// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/src/clients/mobile-app/App.tsx
================================================================================

/**
 * @file src/clients/mobile-app/App.tsx
 * @description The main entry point for the React Native mobile application.
 * This file sets up the entire application's context, including state management,
 * navigation, theming, authentication, and numerous third-party integrations.
 * The provider hierarchy is intentionally designed to be extensive and scalable,
 * reflecting the project's goal of becoming a central integration hub.
 */

// Core React & React Native imports
import React, { useEffect } from 'react';
import { StatusBar, AppState, Platform, AppStateStatus } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';

// Navigation
import { NavigationContainer } from '@react-navigation/native';
import { linking, navigationRef } from './navigation/linking';
import AppNavigator from './navigation/AppNavigator';
import { getNavigationTheme } from './theme/navigationTheme';

// State Management
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './store';
import { QueryClient, QueryClientProvider, focusManager } from '@tanstack/react-query';

// Providers & Contexts (The core of our integration strategy)
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { I18nProvider } from './contexts/I18nContext';
import { AnalyticsProvider } from './contexts/AnalyticsContext';
import { FeatureFlagProvider } from './contexts/FeatureFlagContext';
import { PlaidProvider } from './contexts/PlaidContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { OfflineProvider } from './contexts/OfflineContext';
import { IntegrationsProvider } from './contexts/IntegrationsContext';
import { ApiProvider } from './contexts/ApiContext';
import { CloudProvider } from './contexts/CloudContext'; // For AWS/GCP/Azure integrations

// Third-party SDKs & Error Handling
import { StripeProvider } from '@stripe/stripe-react-native';
import * as Sentry from '@sentry/react-native';
import ErrorBoundary from './components/common/ErrorBoundary';

// Configuration
import { SENTRY_DSN, STRIPE_PUBLISHABLE_KEY } from './config/env';

// Initialize Sentry (as early as possible in the app lifecycle)
if (SENTRY_DSN && !__DEV__) {
  Sentry.init({
    dsn: SENTRY_DSN,
    tracesSampleRate: 0.8,
    profilesSampleRate: 0.5,
    attachScreenshot: true,
    attachViewHierarchy: true,
    enableAutoSessionTracking: true,
    sessionTrackingIntervalMillis: 10000,
  });
}

// Create a client for React Query with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

/**
 * A custom hook to manage application initialization tasks.
 * This centralizes async setup logic before the app is ready to be displayed.
 */
const useAppInitializer = () => {
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Any async setup can go here:
        // - Hydrate stores from persisted storage
        // - Check for app updates (e.g., with CodePush or Expo Updates)
        // - Initialize third-party services that require async setup
        // For now, we assume contexts handle their own async init.
      } catch (error) {
        console.error("Critical App initialization error:", error);
        Sentry.captureException(error);
      } finally {
        // Hide the native splash screen once the JS bundle has loaded
        // and the first render is complete.
        SplashScreen.hide();
      }
    };

    initializeApp();

    // Set up listeners for app state changes (e.g., for React Query)
    const onAppStateChange = (status: AppStateStatus) => {
      if (Platform.OS !== 'web') {
        focusManager.setFocused(status === 'active');
      }
    };

    const subscription = AppState.addEventListener('change', onAppStateChange);

    return () => {
      subscription.remove();
    };
  }, []);
};

/**
 * The Root component that wraps the core UI and navigation.
 * This component is nested inside all providers, so it has access to every context.
 * It handles theme-aware status bars and navigation container theming.
 */
const AppRoot = () => {
  const { isDarkMode, theme } = useTheme();
  const navigationTheme = getNavigationTheme(theme, isDarkMode);

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
        translucent
      />
      <NavigationContainer
        ref={navigationRef}
        theme={navigationTheme}
        linking={linking}
      >
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

/**
 * The main App component.
 * This is the entry point of the application, responsible for setting up all
 * global providers and contexts. The order of providers is crucial as some
 * contexts may depend on others (e.g., ApiProvider needing AuthContext).
 *
 * Provider Hierarchy (from outer to inner):
 * - ErrorBoundary (Catches rendering errors in children)
 * - Redux (Global synchronous state)
 * - React Query (Server state, caching, async operations)
 * - Theme (UI theming, dark/light mode)
 * - I18n (Localization and internationalization)
 * - Auth (User authentication and session management)
 * - API (Configured Axios instance for network requests)
 * - Cloud (AWS/GCP/Azure SDKs and services)
 * - Analytics (User behavior tracking - Segment, Mixpanel, etc.)
 * - Feature Flags (A/B testing, remote configuration - LaunchDarkly)
 * - Notifications (Push notifications - FCM, OneSignal)
 * - Offline (Offline data storage and sync - WatermelonDB, MMKV)
 * - Stripe (Payments)
 * - Plaid (Financial data aggregation)
 * - Integrations (A catch-all for other third-party services)
 * - AppRoot (The actual UI, including navigation)
 */
const App = () => {
  useAppInitializer();

  return (
    <ErrorBoundary>
      <ReduxProvider store={store}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <I18nProvider>
              <AuthProvider>
                <ApiProvider>
                  <CloudProvider>
                    <AnalyticsProvider>
                      <FeatureFlagProvider>
                        <NotificationProvider>
                          <OfflineProvider>
                            <StripeProvider
                              publishableKey={STRIPE_PUBLISHABLE_KEY}
                              // merchantIdentifier="merchant.com.{{YOUR_APP_NAME}}" // Required for Apple Pay
                            >
                              <PlaidProvider>
                                <IntegrationsProvider>
                                  <AppRoot />
                                </IntegrationsProvider>
                              </PlaidProvider>
                            </StripeProvider>
                          </OfflineProvider>
                        </NotificationProvider>
                      </FeatureFlagProvider>
                    </AnalyticsProvider>
                  </CloudProvider>
                </ApiProvider>
              </AuthProvider>
            </I18nProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </ReduxProvider>
    </ErrorBoundary>
  );
};

// Wrap the App with Sentry's performance profiler for enhanced monitoring.
// This provides detailed component lifecycle tracking.
export default Sentry.withProfiler(App);