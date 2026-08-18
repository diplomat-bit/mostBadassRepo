// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/src/clients/mobile-app/src/services/pushNotifications.ts
================================================================================

import { Platform } from 'react-native';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import notifee, {
  AndroidImportance,
  AndroidVisibility,
  EventType,
} from '@notifee/react-native';
import { apiClient } from '../api/apiClient';
import { logger } from './logger';
import { analyticsService } from './analytics';
import { navigationService } from './navigation';
import { AppStore } from '../store/appStore'; // Assuming a Zustand/Redux store
import { config } from '../config';

// Define a standard notification payload structure from our backend
export interface CustomNotificationPayload {
  title?: string;
  body?: string;
  // Deep linking information
  screen?: string;
  params?: Record<string, any>;
  // Data for analytics or in-app processing
  analyticsTag?: string;
  campaignId?: string;
  // Action identifiers for interactive notifications
  actionId?: string;
}

/**
 * A comprehensive service for handling all aspects of push notifications.
 * Integrates with Firebase Cloud Messaging (FCM), Notifee for advanced display,
 * our backend API for token management, and other internal services like
 * analytics, navigation, and state management.
 */
class PushNotificationService {
  private static instance: PushNotificationService;
  private isInitialized = false;

  private constructor() {}

  /**
   * Gets the singleton instance of the PushNotificationService.
   */
  public static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService();
    }
    return PushNotificationService.instance;
  }

  /**
   * Initializes the push notification service.
   * This should be called once when the app starts, after user authentication.
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      logger.warn('PushNotificationService already initialized.');
      return;
    }

    try {
      const hasPermission = await this.requestUserPermission();
      if (!hasPermission) {
        logger.info('User has not granted push notification permissions.');
        analyticsService.track('push_permission_denied');
        return;
      }

      await this.createNotificationChannels();
      this.setupListeners();
      await this.registerDevice();

      this.isInitialized = true;
      logger.info('PushNotificationService initialized successfully.');
      analyticsService.track('push_service_initialized');
    } catch (error) {
      logger.error('Failed to initialize PushNotificationService', error);
      analyticsService.track('push_service_init_failed', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Requests permission from the user to send push notifications.
   * @returns {Promise<boolean>} True if permission is granted, false otherwise.
   */
  public async requestUserPermission(): Promise<boolean> {
    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        logger.info('Push notification permission granted.');
        analyticsService.track('push_permission_granted');
      } else {
        logger.info('Push notification permission denied by user.');
      }
      return enabled;
    } catch (error) {
      logger.error('Error requesting push notification permission', error);
      return false;
    }
  }

  /**
   * Retrieves the current FCM registration token for the device.
   * @returns {Promise<string | null>} The FCM token or null if an error occurs.
   */
  public async getFCMToken(): Promise<string | null> {
    try {
      // Check if APNs token is available on iOS before getting FCM token
      if (Platform.OS === 'ios') {
        const apnsToken = await messaging().getAPNSToken();
        if (!apnsToken) {
          logger.warn('APNs token not available yet. FCM token might be delayed.');
        }
      }
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        logger.info('FCM Token retrieved:', fcmToken);
        return fcmToken;
      }
      logger.warn('Could not retrieve FCM token.');
      return null;
    } catch (error) {
      logger.error('Failed to get FCM token', error);
      return null;
    }
  }

  /**
   * Registers the device's FCM token with our backend server.
   */
  public async registerDevice(): Promise<void> {
    const token = await this.getFCMToken();
    if (token) {
      try {
        await apiClient.post('/notifications/register-device', {
          token,
          platform: Platform.OS,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        });
        logger.info('Device token registered with backend successfully.');
        analyticsService.identify({ fcm_token: token });
      } catch (error) {
        logger.error('Failed to register device token with backend', error);
        analyticsService.track('push_token_registration_failed', {
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }
  }

  /**
   * Unregisters the device from the backend, typically on user logout.
   */
  public async unregisterDevice(): Promise<void> {
    const token = await this.getFCMToken();
    if (token) {
      try {
        await apiClient.post('/notifications/unregister-device', { token });
        logger.info('Device token unregistered from backend.');
        analyticsService.track('push_token_unregistered');
      } catch (error) {
        logger.error('Failed to unregister device token from backend', error);
      }
    }
    // Invalidate the token to ensure a new one is generated on next login
    await messaging().deleteToken();
    this.isInitialized = false;
  }

  /**
   * Sets up all necessary listeners for incoming messages and token updates.
   */
  private setupListeners(): void {
    // 1. Listen for token refreshes
    messaging().onTokenRefresh(async (newToken) => {
      logger.info('FCM token refreshed:', newToken);
      analyticsService.track('push_token_refreshed');
      await this.registerDevice(); // Re-register with the new token
    });

    // 2. Listen for foreground messages
    messaging().onMessage(this.onForegroundMessage);

    // 3. Handle notifications that opened the app from a background state
    messaging().onNotificationOpenedApp(this.onNotificationOpenedApp);

    // 4. Handle notifications that opened the app from a quit state
    messaging()
      .getInitialNotification()
      .then(this.onNotificationOpenedApp);

    // 5. Set a background message handler (must be outside of the class context)
    messaging().setBackgroundMessageHandler(onBackgroundMessage);

    // 6. Listen for Notifee events (e.g., user pressing an action button)
    notifee.onForegroundEvent(async ({ type, detail }) => {
      if (type === EventType.PRESS || type === EventType.ACTION_PRESS) {
        logger.info('Notifee foreground event received', { type, detail });
        if (detail.notification) {
          this.handleNotificationAction(detail.notification);
        }
      }
    });

    notifee.onBackgroundEvent(async ({ type, detail }) => {
      if (type === EventType.PRESS || type === EventType.ACTION_PRESS) {
        logger.info('Notifee background event received', { type, detail });
        if (detail.notification) {
          this.handleNotificationAction(detail.notification);
        }
      }
    });
  }

  /**
   * Handles an incoming message while the app is in the foreground.
   * Uses Notifee to display a heads-up notification.
   * @param remoteMessage The incoming message from FCM.
   */
  private onForegroundMessage = async (
    remoteMessage: FirebaseMessagingTypes.RemoteMessage,
  ): Promise<void> => {
    logger.info('Foreground notification received:', remoteMessage);
    analyticsService.track('push_received_foreground', {
      messageId: remoteMessage.messageId,
      ...remoteMessage.data,
    });

    if (!remoteMessage.notification) {
      logger.warn('Foreground message received without a notification payload.');
      return;
    }

    try {
      await notifee.displayNotification({
        title: remoteMessage.notification.title,
        body: remoteMessage.notification.body,
        data: remoteMessage.data,
        android: {
          channelId: config.DEFAULT_NOTIFICATION_CHANNEL_ID,
          importance: AndroidImportance.HIGH,
          pressAction: {
            id: 'default',
          },
        },
        ios: {
          sound: 'default',
          foregroundPresentationOptions: {
            alert: true,
            badge: true,
            sound: true,
          },
        },
      });
    } catch (error) {
      logger.error('Failed to display foreground notification with Notifee', error);
    }
  };

  /**
   * Handles the event when a user taps a notification, opening the app.
   * @param remoteMessage The message that was tapped.
   */
  private onNotificationOpenedApp = (
    remoteMessage: FirebaseMessagingTypes.RemoteMessage | null,
  ): void => {
    if (remoteMessage) {
      logger.info(
        'Notification caused app to open from background/quit state:',
        remoteMessage,
      );
      analyticsService.track('push_opened', {
        messageId: remoteMessage.messageId,
        ...remoteMessage.data,
      });
      this.handleNotificationAction(remoteMessage);
    }
  };

  /**
   * Central logic to process a notification's data and perform actions,
   * such as deep linking or updating app state.
   * @param message The notification message (can be from FCM or Notifee).
   */
  private handleNotificationAction(
    message:
      | FirebaseMessagingTypes.RemoteMessage
      | FirebaseMessagingTypes.Notification,
  ): void {
    const data = (message as any).data as CustomNotificationPayload | undefined;

    if (!data) {
      logger.warn('No data payload found in notification for action handling.');
      return;
    }

    // Update badge count in the app state
    AppStore.getState().decrementNotificationBadge();

    // Handle deep linking
    if (data.screen) {
      logger.info(`Navigating to screen: ${data.screen}`, data.params);
      navigationService.navigate(data.screen, data.params);
    }

    // Handle other custom actions
    if (data.actionId === 'mark_as_read') {
      // Example: Call an API to mark a message as read
      logger.info('Handling "mark_as_read" action.');
    }
  }

  /**
   * Creates necessary notification channels for Android (Oreo and above).
   * This should be done before displaying any notifications.
   */
  private async createNotificationChannels(): Promise<void> {
    if (Platform.OS !== 'android') {
      return;
    }

    try {
      // A default channel for general notifications
      await notifee.createChannel({
        id: config.DEFAULT_NOTIFICATION_CHANNEL_ID,
        name: 'General Notifications',
        description: 'Default channel for all app notifications',
        importance: AndroidImportance.HIGH,
        visibility: AndroidVisibility.PUBLIC,
        sound: 'default',
      });

      // A channel for high-priority alerts
      await notifee.createChannel({
        id: 'alerts',
        name: 'High-Priority Alerts',
        description: 'For critical alerts and updates',
        importance: AndroidImportance.HIGH,
        bypassDnd: true, // Allows sound even in Do Not Disturb mode
        visibility: AndroidVisibility.PUBLIC,
        sound: 'alert_sound', // Assumes a custom sound file in android/app/src/main/res/raw
      });

      logger.info('Android notification channels created.');
    } catch (error) {
      logger.error('Failed to create Android notification channels', error);
    }
  }
}

/**
 * Background message handler for FCM.
 * This function must be a top-level function, not a class method.
 * It handles messages when the app is in the background or quit.
 * @param remoteMessage The incoming message from FCM.
 */
async function onBackgroundMessage(
  remoteMessage: FirebaseMessagingTypes.RemoteMessage,
) {
  logger.info('Background notification received:', remoteMessage);
  analyticsService.track('push_received_background', {
    messageId: remoteMessage.messageId,
    ...remoteMessage.data,
  });

  // Here you can perform background tasks, like fetching data.
  // Note: UI updates are not possible from here.

  // Update the badge count
  const currentBadgeCount = await notifee.getBadgeCount();
  await notifee.setBadgeCount(currentBadgeCount + 1);
  AppStore.getState().incrementNotificationBadge();
}

export const pushNotificationService = PushNotificationService.getInstance();