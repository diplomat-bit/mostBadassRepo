// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/config/AuthConfiguration.ts
================================================================================

export const AUTH_CONFIGURATION = {
  /**
   * General Application Identity Configuration
   * Defines the core identity parameters for the application instance within the multiverse environment.
   */
  identity: {
    appName: "Allocatra Financial OS",
    appVersion: "5.4.2-quantum-beta",
    environment: process.env.NODE_ENV || "development",
    issuer: "https://auth.allocatra.com",
    audience: ["https://api.allocatra.com", "https://ws.allocatra.com"],
    supportEmail: "security@allocatra.com",
    documentationUrl: "https://docs.allocatra.com/security/authentication",
    legal: {
      termsOfServiceUrl: "/legal/terms",
      privacyPolicyUrl: "/legal/privacy",
      cookiePolicyUrl: "/legal/cookies",
      gdprCompliance: true,
      ccpaCompliance: true,
    },
  },

  /**
   * Token Management and JWT Configuration
   * Detailed settings for JSON Web Token issuance, validation, and lifecycle management.
   */
  tokens: {
    accessToken: {
      type: "Bearer",
      algorithm: "RS256",
      expirySeconds: 900, // 15 minutes
      expirySlidingWindow: false,
      headerName: "Authorization",
      cookieName: "allocatra_access_token",
      cookieSecure: true,
      cookieSameSite: "Strict" as "Strict" | "Lax" | "None",
      cookiePath: "/",
      claimNamespace: "https://allocatra.com/claims/",
      includePermsInToken: true,
    },
    refreshToken: {
      expirySeconds: 604800, // 7 days
      expirySecondsRememberMe: 2592000, // 30 days
      headerName: "X-Refresh-Token",
      cookieName: "allocatra_refresh_token",
      rotationEnabled: true, // Issue new refresh token on use
      reuseDetection: true, // Revoke family if reused
      cookieHttpOnly: true,
      cookieSecure: true,
      cookieSameSite: "Strict" as "Strict" | "Lax" | "None",
      cookiePath: "/auth/refresh",
    },
    idToken: {
      expirySeconds: 3600, // 1 hour
      includeProfile: true,
      includeEmail: true,
    },
    verification: {
      clockToleranceSeconds: 30, // Allow for slight clock drift
      algorithms: ["RS256"],
      requireExpiration: true,
      requireNotBefore: false, // Optional
      requireIssuedAt: true,
      validateIssuer: true,
      validateAudience: true,
    },
    encryption: {
      enabled: true,
      algorithm: "A256GCM", // AES-GCM 256-bit
      keyManagementService: "AWS_KMS", // or 'GCP_KMS', 'AZURE_KEYVAULT', 'LOCAL'
      keyRotationPeriodDays: 90,
    },
  },

  /**
   * Password Security Policies
   * Enforces strong password requirements compliant with NIST guidelines.
   */
  passwords: {
    hashing: {
      algorithm: "argon2id",
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
      saltLength: 32,
    },
    validation: {
      minLength: 12,
      maxLength: 128,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      specialCharSet: "!@#$%^&*()_+-=[]{}|;:,.<>?",
      prohibitCommonPasswords: true, // Check against top 100k common passwords
      prohibitUserInfo: true, // Don't allow username/email in password
      prohibitSequentialCharacters: true, // e.g., '12345', 'abcde'
      prohibitRepeatingCharacters: true, // e.g., 'aaaaa'
      maxRepeatingChars: 3,
    },
    lifecycle: {
      historyDepth: 5, // Cannot reuse last 5 passwords
      expiryDays: 0, // 0 = never expires (NIST recommendation)
      requireChangeOnBreach: true, // Integrate with HaveIBeenPwned API
      tempPasswordExpiryMinutes: 60,
    },
    lockout: {
      maxAttempts: 5,
      windowSeconds: 300, // 5 minutes
      lockoutDurationSeconds: 900, // 15 minutes
      autoUnlock: true,
      notifyUserOnLockout: true,
      progressiveDelay: true, // Increase delay after each failed attempt in window
    },
  },

  /**
   * Multi-Factor Authentication (MFA) Configuration
   * Settings for 2FA/MFA providers, enforcement policies, and recovery.
   */
  mfa: {
    enabled: true,
    enforcementPolicy: "adaptive", // 'optional', 'required', 'adaptive' (risk-based)
    methods: {
      totp: {
        enabled: true,
        issuer: "Allocatra",
        algorithm: "SHA1", // Google Authenticator compatibility
        digits: 6,
        period: 30,
        window: 1, // Allow 1 step before/after for drift
      },
      sms: {
        enabled: false, // Deprecated due to SIM swapping risks
        provider: "Twilio",
        codeLength: 6,
        expirySeconds: 300,
      },
      email: {
        enabled: true,
        codeLength: 6,
        expirySeconds: 600,
        subjectPrefix: "[Allocatra Security Code]",
      },
      webauthn: {
        enabled: true, // FIDO2 / YubiKey / FaceID / TouchID
        relyingPartyName: "Allocatra Financial OS",
        attestation: "direct", // or 'none', 'indirect'
        authenticatorSelection: {
          userVerification: "preferred",
          residentKey: "preferred",
        },
        timeout: 60000,
      },
      backupCodes: {
        enabled: true,
        count: 10,
        length: 10,
        hashingAlgorithm: "sha256",
      },
    },
    adaptiveTriggers: {
      newDevice: true,
      newLocation: true, // Geo-IP based
      impossibleTravel: true,
      torNetwork: true,
      highRiskAction: true, // e.g., transferring > $1000
    },
    trustedDevices: {
      enabled: true,
      expiryDays: 30,
      maxDevices: 5,
    },
  },

  /**
   * Session Management
   * Controls user session lifecycle, concurrency, and inactivity.
   */
  sessions: {
    storageDriver: "redis", // 'redis', 'memory', 'database'
    maxConcurrentSessions: 5, // Per user
    inactivityTimeoutSeconds: 1800, // 30 minutes
    absoluteTimeoutSeconds: 43200, // 12 hours
    heartbeatIntervalSeconds: 60, // Frontend pings backend
    revokeOnPasswordChange: true,
    revokeOnRoleChange: true,
    detectFingerprintChange: true, // Browser fingerprinting mismatch
    invalidation: {
      globalLogout: true,
      deviceSpecificLogout: true,
    },
  },

  /**
   * Federated Identity and Social Login (OAuth2 / OIDC)
   * Configuration for external identity providers.
   */
  providers: {
    google: {
      enabled: true,
      clientId: process.env.GOOGLE_CLIENT_ID || "GOOGLE_CLIENT_ID_PLACEHOLDER",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "GOOGLE_CLIENT_SECRET_PLACEHOLDER",
      scopes: ["openid", "profile", "email", "https://www.googleapis.com/auth/calendar.readonly"],
      discoveryUrl: "https://accounts.google.com/.well-known/openid-configuration",
      attributeMapping: {
        id: "sub",
        email: "email",
        firstName: "given_name",
        lastName: "family_name",
        avatar: "picture",
      },
    },
    github: {
      enabled: true,
      clientId: process.env.GITHUB_CLIENT_ID || "GITHUB_CLIENT_ID_PLACEHOLDER",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "GITHUB_CLIENT_SECRET_PLACEHOLDER",
      scopes: ["read:user", "user:email"],
      authorizationUrl: "https://github.com/login/oauth/authorize",
      tokenUrl: "https://github.com/login/oauth/access_token",
      userProfileUrl: "https://api.github.com/user",
    },
    microsoft: {
      enabled: true,
      clientId: process.env.MS_CLIENT_ID || "MS_CLIENT_ID_PLACEHOLDER",
      clientSecret: process.env.MS_CLIENT_SECRET || "MS_CLIENT_SECRET_PLACEHOLDER",
      tenantId: "common",
      scopes: ["openid", "profile", "email", "User.Read"],
      discoveryUrl: "https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration",
    },
    linkedin: {
      enabled: true,
      clientId: process.env.LINKEDIN_CLIENT_ID || "LINKEDIN_CLIENT_ID_PLACEHOLDER",
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET || "LINKEDIN_CLIENT_SECRET_PLACEHOLDER",
      scopes: ["r_liteprofile", "r_emailaddress"],
      authorizationUrl: "https://www.linkedin.com/oauth/v2/authorization",
      tokenUrl: "https://www.linkedin.com/oauth/v2/accessToken",
    },
    enterpriseSso: {
      saml: {
        enabled: true,
        certPath: "./certs/saml.pem",
        issuer: "allocatra:enterprise:saml",
        callbackUrl: "/auth/saml/callback",
      },
    },
  },

  /**
   * API Security & Rate Limiting
   * Defense mechanisms for authentication endpoints.
   */
  security: {
    rateLimiting: {
      enabled: true,
      store: "redis",
      global: {
        windowMs: 900000, // 15 minutes
        max: 1000,
      },
      authEndpoints: {
        windowMs: 3600000, // 1 hour
        max: 10, // Max login attempts per IP
        message: "Too many login attempts from this IP, please try again after an hour",
      },
      userEndpoints: {
        windowMs: 60000, // 1 minute
        max: 60,
      },
    },
    headers: {
      enableHSTS: true,
      hstsMaxAge: 31536000, // 1 year
      hstsIncludeSubDomains: true,
      hstsPreload: true,
      xFrameOptions: "DENY",
      xContentTypeOptions: "nosniff",
      xXSSProtection: "1; mode=block",
      referrerPolicy: "strict-origin-when-cross-origin",
      contentSecurityPolicy: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://apis.google.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        imgSrc: ["'self'", "data:", "https://*.googleusercontent.com", "https://*.githubusercontent.com"],
        connectSrc: ["'self'", "wss://allocatra.com", "https://api.allocatra.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
      },
    },
    cors: {
      origin: [
        "https://allocatra.com",
        "https://app.allocatra.com",
        "http://localhost:3000",
        "http://localhost:8080",
      ],
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "X-Refresh-Token"],
      credentials: true,
      maxAge: 86400,
    },
    csrf: {
      enabled: true,
      cookieName: "allocatra_csrf",
      headerName: "X-CSRF-Token",
      ignoreMethods: ["GET", "HEAD", "OPTIONS"],
    },
  },

  /**
   * Role-Based Access Control (RBAC)
   * Defines roles, permissions, and hierarchy.
   */
  rbac: {
    defaultRole: "USER",
    superAdminRole: "QUANTUM_ARCHITECT",
    roles: {
      GUEST: {
        inherits: [],
        permissions: [
          "public:read",
          "auth:login",
          "auth:register",
          "blog:read",
        ],
      },
      USER: {
        inherits: ["GUEST"],
        permissions: [
          "profile:read",
          "profile:update",
          "dashboard:read",
          "transactions:read",
          "transactions:create",
          "budgets:read",
          "budgets:manage",
          "ai:chat:basic",
        ],
      },
      PRO_USER: {
        inherits: ["USER"],
        permissions: [
          "analytics:advanced",
          "investments:manage",
          "ai:chat:advanced",
          "reports:export",
          "api:keys:create",
        ],
      },
      FINANCIAL_ADVISOR: {
        inherits: ["PRO_USER"],
        permissions: [
          "clients:read",
          "clients:manage",
          "compliance:logs:read",
        ],
      },
      ADMIN: {
        inherits: ["FINANCIAL_ADVISOR"],
        permissions: [
          "users:manage",
          "system:logs:read",
          "content:publish",
          "feature-flags:read",
        ],
      },
      QUANTUM_ARCHITECT: {
        inherits: ["ADMIN"],
        permissions: [
          "*", // Wildcard access
          "system:configure",
          "database:migration",
          "security:audit:full",
        ],
      },
    },
    scopes: {
      read: "Read access to resources",
      write: "Write access to resources",
      delete: "Delete access to resources",
      admin: "Administrative access",
    },
  },

  /**
   * Audit Logging Configuration
   * Defines what security events are logged and where.
   */
  audit: {
    enabled: true,
    retentionDays: 365,
    storage: "elasticsearch", // 'database', 'file', 'elasticsearch', 'splunk'
    piiRedaction: true,
    events: {
      auth: [
        "login_success",
        "login_failed",
        "logout",
        "token_refresh",
        "password_change",
        "mfa_setup",
        "mfa_challenge_failed",
      ],
      user: [
        "register",
        "profile_update",
        "account_delete",
        "role_change",
        "api_key_generated",
      ],
      admin: [
        "user_ban",
        "user_impersonation",
        "config_change",
        "feature_flag_toggle",
      ],
      system: [
        "startup",
        "shutdown",
        "error",
        "rate_limit_exceeded",
        "threat_detected",
      ],
    },
  },

  /**
   * Frontend Integration Configuration
   * Routes and UI settings used by the client-side authentication flow.
   */
  ui: {
    routes: {
      login: "/auth/login",
      register: "/auth/register",
      forgotPassword: "/auth/forgot-password",
      resetPassword: "/auth/reset-password",
      verifyEmail: "/auth/verify-email",
      mfaChallenge: "/auth/mfa",
      logout: "/auth/logout",
      callback: "/auth/callback",
      error: "/auth/error",
      unauthorized: "/403",
    },
    theme: {
      primaryColor: "#0F172A",
      secondaryColor: "#3B82F6",
      logoUrl: "/assets/images/logo-full.svg",
      faviconUrl: "/favicon.ico",
      backgroundUrl: "/assets/images/auth-bg-quantum.jpg",
    },
    messages: {
      loginSuccess: "Welcome back to the multiverse.",
      loginFailed: "Invalid credentials. Please verify your quantum signature.",
      mfaRequired: "Secondary authentication protocols initiated.",
      sessionExpired: "Your session has dissipated. Please re-authenticate.",
    },
  },

  /**
   * Advanced Feature Flags
   * Toggles for experimental or tiered authentication features.
   */
  features: {
    enableBiometrics: true,
    enableMagicLink: true,
    enableSocialLogin: true,
    enableGuestAccess: false,
    enablePwnedPasswordCheck: true,
    enableGeoVelocityCheck: true, // Check speed of travel between logins
    enableDeviceFingerprinting: true,
    enableRiskBasedAuth: true,
    enableApiKeys: true,
    enableSso: true,
  },
};

// Type definitions for the configuration object to ensure type safety across the application.
export type AuthConfigType = typeof AUTH_CONFIGURATION;
export type UserRole = keyof typeof AUTH_CONFIGURATION.rbac.roles;
export type MfaMethod = keyof typeof AUTH_CONFIGURATION.mfa.methods;
export type OAuthProvider = keyof typeof AUTH_CONFIGURATION.providers;
export type SecurityEvent = string;

// Helper to retrieve specific provider config
export const getProviderConfig = (provider: OAuthProvider) => {
  return AUTH_CONFIGURATION.providers[provider];
};

// Helper to check if a feature is enabled
export const isAuthFeatureEnabled = (feature: keyof typeof AUTH_CONFIGURATION.features): boolean => {
  return AUTH_CONFIGURATION.features[feature];
};

export default AUTH_CONFIGURATION;