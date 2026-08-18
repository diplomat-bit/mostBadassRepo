// REPOSITORY SOURCE: diplomat-bit/almost | PATH: diplomat-bit-almost-93a5466/components/views/personal/MarketplaceView.tsx.md
================================================================================

openapi: 3.0.0
info:
  title: JAMESBURVELOCALLAGHANIII
  version: 1.0.0
  description: >-
    Welcome to the **Quantum Core 3.0**, the pinnacle of financial technology,
    meticulously engineered to power the experience. This is far more than a
    mere set of endpoints; it is the living, breathing neural network of a
    next-generation financial ecosystem, poised to redefine digital banking for
    a global audience.


    Our API is a testament to the philosophy that finance should be an
    intelligent, predictive, and intensely personal dialogue—a dynamic,
    self-optimizing collaboration between users, visionary developers, and our
    proprietary Artificial General Intelligence, **Quantum**. We provide
    unparalleled programmatic access to the sophisticated tools and vast data
    reservoirs that fuel our platform, spanning from hyper-personalized wealth
    management to AI-driven corporate finance automation, decentralized asset
    orchestration, and pioneering business incubation.


    This comprehensive specification unveils the secure and high-performance
    protocols to connect with and command the core functionalities of . Empower
    yourself to architect and deploy the future of finance, with an
    infrastructure designed for exponential scalability, impenetrable security,
    real-time intelligence, and seamless global integration. As your most
    ambitious visions crystallize, our platform's unparalleled capabilities will
    not just meet them—they will amplify them. This is finance, reimagined,
    limitless, and brought to life by AI.
servers:
  - url: https://ce47fe80-dabc-4ad0-b0e7-cf285695b8b8.mock.pstmn.io
paths:
  /users/register:
    post:
      summary: Register a New User Account
      responses:
        '201':
          description: User registered successfully. Awaits email/MFA verification.
          content:
            application/json:
              schema:
                type: object
                properties:
                  address:
                    type: object
                    properties: {}
                  securityStatus:
                    type: object
                    description: Security-related status for the user account.
                    properties: {}
                  preferences:
                    type: object
                    description: User's personalized preferences for the platform.
                    properties:
                      notificationChannels:
                        type: object
                        description: Preferred channels for receiving notifications.
                        properties: {}
                required:
                  - email
                  - id
                  - identityVerified
                  - name
              example:
                id: user-alice-001
                name: Alice Wonderland
                email: alice.w@example.com
                phone: +1-555-987-6543
                dateOfBirth: '1990-05-10'
                address:
                  street: 123 Magic Lane
                  city: Fantasyland
                  state: CA
                  zip: '90210'
                  country: USA
                loyaltyTier: Bronze
                loyaltyPoints: 0
                gamificationLevel: 1
                aiPersona: Conservative Saver
                securityStatus:
                  twoFactorEnabled: false
                  biometricsEnrolled: false
                  lastLogin: '2024-07-22T08:00:00Z'
                  lastLoginIp: 203.0.113.10
                preferences:
                  preferredLanguage: en-US
                  theme: Light-Default
                  aiInteractionMode: balanced
                  notificationChannels:
                    email: true
                    push: true
                    sms: false
                    inApp: true
                  dataSharingConsent: true
                  transactionGrouping: category
                identityVerified: false
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '409':
          description: >-
            The request could not be completed due to a conflict with the
            current state of the resource (e.g., duplicate entry, expired
            state).
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: RESOURCE_CONFLICT
                message: >-
                  A resource with this identifier already exists or the
                  operation conflicts with an existing state.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - users
        - register
      description: >-
        Registers a new user account with , initiating the onboarding process.
        Requires basic user details.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                address:
                  type: object
                  properties: {}
              required:
                - email
                - name
                - password
            example:
              name: Alice Wonderland
              email: alice.w@example.com
              password: SecureP@ssw0rd2024!
              phone: +1-555-987-6543
  /users/login:
    post:
      summary: User Login and Session Creation
      responses:
        '200':
          description: Successful login response
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - accessToken
                  - expiresIn
                  - refreshToken
                  - tokenType
              example:
                accessToken: '{{vault:json-web-token}}'
                refreshToken: some_long_refresh_token_string_for_renewal
                expiresIn: 3600
                tokenType: Bearer
        '401':
          description: Invalid or missing authentication credentials
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: MFA required error
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: MFA_REQUIRED
                message: >-
                  Multi-factor authentication is required. Please provide your
                  MFA code.
                timestamp: '2024-07-22T08:05:00Z'
      tags:
        - users
        - login
      description: >-
        Authenticates a user and creates a secure session, returning access
        tokens. May require MFA depending on user settings.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties: {}
              required:
                - email
                - password
            example:
              email: quantum.visionary@demobank.com
              password: YourSecurePassword123
  /users/password-reset/initiate:
    post:
      summary: Initiate Password Reset
      responses:
        '200':
          description: Password reset initiated. Check your email/phone for verification.
          content:
            application/json:
              schema:
                type: object
                properties: {}
              example:
                message: Verification code sent to your registered email/phone.
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - users
        - password-reset
        - initiate
      description: >-
        Starts the password reset flow by sending a verification code or link to
        the user's registered email or phone.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties: {}
              required:
                - identifier
            example:
              identifier: reset.user@example.com
  /users/password-reset/confirm:
    post:
      summary: Confirm Password Reset
      responses:
        '200':
          description: Password reset successfully.
          content:
            application/json:
              schema:
                type: object
                properties: {}
              example:
                message: Password updated successfully.
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Invalid or expired verification code.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_VERIFICATION_CODE
                message: The provided verification code is invalid or has expired.
                timestamp: '2024-07-22T08:10:00Z'
      tags:
        - users
        - password-reset
        - confirm
      description: >-
        Confirms the password reset using the received verification code and
        sets a new password.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties: {}
              required:
                - identifier
                - newPassword
                - verificationCode
            example:
              identifier: reset.user@example.com
              verificationCode: '654321'
              newPassword: MyNewStrongPassword@789
  /users/me/preferences:
    get:
      summary: Get User Personalization Preferences
      responses:
        '200':
          description: The user's personalized preferences.
          content:
            application/json:
              schema:
                description: User's personalized preferences for the platform.
                type: object
                properties:
                  notificationChannels:
                    type: object
                    description: Preferred channels for receiving notifications.
                    properties: {}
              example:
                preferredLanguage: en-US
                theme: Light-Default
                aiInteractionMode: balanced
                notificationChannels:
                  email: true
                  push: true
                  sms: false
                  inApp: true
                dataSharingConsent: true
                transactionGrouping: category
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - users
        - me
        - preferences
      description: >-
        Retrieves the user's deep personalization preferences, including AI
        customization settings, notification channel priorities, thematic
        choices, and data sharing consents.
    put:
      summary: Update User Personalization Preferences
      responses:
        '200':
          description: User preferences updated successfully.
          content:
            application/json:
              schema:
                description: User's personalized preferences for the platform.
                type: object
                properties:
                  notificationChannels:
                    type: object
                    description: Preferred channels for receiving notifications.
                    properties: {}
              example:
                preferredLanguage: en-US
                theme: Dark-Quantum
                aiInteractionMode: proactive
                notificationChannels:
                  email: true
                  push: true
                  sms: false
                  inApp: true
                dataSharingConsent: true
                transactionGrouping: category
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - users
        - me
        - preferences
      description: >-
        Updates the user's deep personalization preferences, allowing dynamic
        control over AI behavior, notification delivery, thematic choices, and
        data privacy settings.
      requestBody:
        content:
          application/json:
            schema:
              description: User's personalized preferences for the platform.
              type: object
              properties:
                notificationChannels:
                  type: object
                  description: Preferred channels for receiving notifications.
                  properties: {}
            example:
              theme: Dark-Quantum
              aiInteractionMode: proactive
  /users/me/devices:
    get:
      summary: List Connected Devices
      parameters:
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
      responses:
        '200':
          description: A paginated list of connected devices.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 2
                data:
                  - id: dev_mobile_ios_aabbcc
                    type: mobile
                    os: iOS 17.5
                    model: iPhone 15 Pro Max
                    lastActive: '2024-07-22T11:05:00Z'
                    ipAddress: 203.0.113.12
                    trustLevel: trusted
                    pushToken: ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]
                  - id: dev_desktop_win_123456
                    type: desktop
                    os: Windows 11
                    model: Dell XPS 15
                    lastActive: '2024-07-22T10:00:00Z'
                    ipAddress: 203.0.113.15
                    trustLevel: trusted
                nextOffset: 2
      tags:
        - users
        - me
        - devices
      description: >-
        Retrieves a list of all devices linked to the user's account, including
        mobile phones, tablets, and desktops, indicating their last active
        status and security posture.
  /users/me/biometrics/verify:
    post:
      summary: Verify Biometric Data for Sensitive Operations
      responses:
        '200':
          description: Biometric verification successful.
          content:
            application/json:
              schema:
                type: object
                properties: {}
              example:
                verificationStatus: success
                message: Biometric authentication successful.
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - users
        - me
        - biometrics
        - verify
      description: >-
        Performs real-time biometric verification to authorize sensitive actions
        or access protected resources, using a one-time biometric signature.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties: {}
              required:
                - biometricSignature
                - biometricType
                - deviceId
            example:
              biometricType: fingerprint
              biometricSignature: base64encoded_one_time_fingerprint_proof
              deviceId: dev_mobile_android_ddeeff
  /users/me/biometrics:
    get:
      summary: Get Biometric Enrollment Status
      responses:
        '200':
          description: Current biometric enrollment status.
          content:
            application/json:
              schema:
                description: Current biometric enrollment status for a user.
                type: object
                properties: {}
                required:
                  - biometricsEnrolled
                  - enrolledBiometrics
              example:
                biometricsEnrolled: true
                enrolledBiometrics:
                  - type: facial_recognition
                    deviceId: dev_mobile_ios_aabbcc
                    enrollmentDate: '2024-07-22T17:00:00Z'
                  - type: fingerprint
                    deviceId: dev_mobile_android_ddeeff
                    enrollmentDate: '2024-06-15T09:30:00Z'
                lastUsed: '2024-07-22T17:30:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - users
        - me
        - biometrics
      description: >-
        Retrieves the current status of biometric enrollments for the
        authenticated user.
  /users/me:
    get:
      summary: Retrieve Comprehensive Current User Profile
      responses:
        '200':
          description: The user's complete, enriched profile information.
          content:
            application/json:
              schema:
                type: object
                properties:
                  address:
                    type: object
                    properties: {}
                  securityStatus:
                    type: object
                    description: Security-related status for the user account.
                    properties: {}
                  preferences:
                    type: object
                    description: User's personalized preferences for the platform.
                    properties:
                      notificationChannels:
                        type: object
                        description: Preferred channels for receiving notifications.
                        properties: {}
                required:
                  - email
                  - id
                  - identityVerified
                  - name
              example:
                id: user-quantum-visionary-001
                name: The Quantum Visionary
                email: quantum.visionary@demobank.com
                phone: +1-555-123-4567
                dateOfBirth: '1980-01-15'
                address:
                  street: 100 Innovation Drive
                  city: Quantumville
                  state: CA
                  zip: '90210'
                  country: USA
                loyaltyTier: Zenith Platinum
                loyaltyPoints: 12500
                gamificationLevel: 7
                aiPersona: Prudent Planner
                securityStatus:
                  twoFactorEnabled: true
                  biometricsEnrolled: true
                  lastLogin: '2024-07-22T08:00:00Z'
                  lastLoginIp: 203.0.113.45
                preferences:
                  preferredLanguage: en-US
                  theme: Dark-Quantum
                  aiInteractionMode: balanced
                  notificationChannels:
                    email: true
                    push: true
                    sms: false
                    inApp: true
                  dataSharingConsent: true
                  transactionGrouping: category
                identityVerified: true
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - users
        - me
      description: >-
        Fetches the complete and dynamically updated profile information for the
        currently authenticated user, encompassing personal details, security
        status, gamification level, loyalty points, and linked identity
        attributes.
    put:
      summary: Update Current User Profile
      responses:
        '200':
          description: Example of updated user profile
          content:
            application/json:
              schema:
                type: object
                properties:
                  address:
                    type: object
                    properties: {}
                  securityStatus:
                    type: object
                    description: Security-related status for the user account.
                    properties: {}
                  preferences:
                    type: object
                    description: User's personalized preferences for the platform.
                    properties:
                      notificationChannels:
                        type: object
                        description: Preferred channels for receiving notifications.
                        properties: {}
                required:
                  - email
                  - id
                  - identityVerified
                  - name
              example:
                id: user-quantum-visionary-001
                name: Quantum Visionary Pro
                email: quantum.visionary@demobank.com
                phone: +1-555-999-0000
                dateOfBirth: '1980-01-15'
                address:
                  street: 100 Innovation Drive
                  city: Quantumville
                  state: CA
                  zip: '90210'
                  country: USA
                loyaltyTier: Zenith Platinum
                loyaltyPoints: 12500
                gamificationLevel: 7
                aiPersona: Prudent Planner
                securityStatus:
                  twoFactorEnabled: true
                  biometricsEnrolled: true
                  lastLogin: '2024-07-22T08:00:00Z'
                  lastLoginIp: 203.0.113.45
                preferences:
                  preferredLanguage: en-US
                  theme: Dark-Quantum
                  aiInteractionMode: balanced
                  notificationChannels:
                    email: true
                    push: true
                    sms: false
                    inApp: true
                  dataSharingConsent: true
                  transactionGrouping: category
                identityVerified: true
        '400':
          description: Common bad request error
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Invalid or missing authentication credentials
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: Insufficient permissions
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - users
        - me
      description: >-
        Updates selected fields of the currently authenticated user's profile
        information.
      requestBody:
        content:
          application/json:
            schema:
              description: Fields that can be updated in a user's profile.
              type: object
              properties:
                address:
                  type: object
                  properties: {}
                preferences:
                  type: object
                  description: User's personalized preferences for the platform.
                  properties:
                    notificationChannels:
                      type: object
                      description: Preferred channels for receiving notifications.
                      properties: {}
            example:
              name: Quantum Visionary Pro
              phone: +1-555-999-0000
  /accounts/me:
    get:
      summary: List Linked Financial Accounts
      parameters:
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
      responses:
        '200':
          description: A paginated, detailed list of linked financial accounts.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 2
                data:
                  - id: acc_chase_checking_4567
                    externalId: plaid_acc_abc123
                    name: Chase Checking
                    institutionName: Chase Bank
                    mask: '4567'
                    type: depository
                    subtype: checking
                    currency: USD
                    currentBalance: 1250.75
                    availableBalance: 1200
                    lastUpdated: '2024-07-22T10:45:00Z'
                  - id: acc_fidelity_ira_1234
                    externalId: plaid_acc_def456
                    name: Fidelity IRA
                    institutionName: Fidelity Investments
                    mask: '1234'
                    type: investment
                    subtype: ira
                    currency: USD
                    currentBalance: 150000.5
                    availableBalance: 149000
                    lastUpdated: '2024-07-22T10:45:00Z'
                nextOffset: 2
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - accounts
        - me
      description: >-
        Fetches a comprehensive, real-time list of all external financial
        accounts linked to the user's  profile, including consolidated balances
        and institutional details.
  /accounts/{accountId}/details:
    get:
      summary: Get Detailed Account Analytics & Forecasts
      responses:
        '200':
          description: Detailed account information with analytics and forecasts.
          content:
            application/json:
              schema:
                allOf:
                  - description: Summary information for a linked financial account.
                    type: object
                    properties: {}
                    required:
                      - currency
                      - currentBalance
                      - id
                      - institutionName
                      - lastUpdated
                      - name
                      - type
                  - type: object
                    properties:
                      projectedCashFlow:
                        type: object
                        properties: {}
              example:
                id: acc_chase_checking_4567
                externalId: plaid_acc_abc123
                name: Chase Checking
                institutionName: Chase Bank
                mask: '4567'
                type: depository
                subtype: checking
                currency: USD
                currentBalance: 1250.75
                availableBalance: 1200
                lastUpdated: '2024-07-22T10:45:00Z'
                accountHolder: The Quantum Visionary
                interestRate: 0.01
                openedDate: '2020-03-01'
                transactionsCount: 150
                projectedCashFlow:
                  days30: 500
                  days90: 1200
                  confidenceScore: 85
                balanceHistory:
                  - date: '2024-07-21'
                    balance: 1230.5
                  - date: '2024-07-20'
                    balance: 1500
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - accounts
        - '{accountId}'
        - details
      description: >-
        Retrieves comprehensive analytics for a specific financial account,
        including historical balance trends, projected cash flow, and AI-driven
        insights into spending patterns.
    parameters:
      - name: accountId
        in: path
        required: true
        description: Unique identifier for the financial account.
        schema:
          type: string
        example: acc_chase_checking_4567
  /accounts/{accountId}/transactions/pending:
    get:
      summary: Get Pending Transactions for an Account
      parameters:
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
      responses:
        '200':
          description: A paginated list of pending transactions.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 2
                data:
                  - id: txn_pending-123
                    accountId: acc_chase_checking_4567
                    type: expense
                    category: Shopping
                    aiCategoryConfidence: 0.85
                    description: Amazon.com
                    amount: 75.2
                    currency: USD
                    date: '2024-07-22'
                    carbonFootprint: 0.5
                    paymentChannel: online
                    disputeStatus: none
                  - id: txn_pending-456
                    accountId: acc_chase_checking_4567
                    type: expense
                    category: Utilities
                    aiCategoryConfidence: 0.9
                    description: Electric Bill
                    amount: 110
                    currency: USD
                    date: '2024-07-22'
                    carbonFootprint: 2
                    paymentChannel: bill_payment
                    disputeStatus: none
                nextOffset: 2
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - accounts
        - '{accountId}'
        - transactions
        - pending
      description: >-
        Retrieves a list of pending transactions that have not yet cleared for a
        specific financial account.
    parameters:
      - name: accountId
        in: path
        required: true
        description: Unique identifier for the financial account.
        schema:
          type: string
        example: acc_chase_checking_4567
  /accounts/{accountId}/statements:
    get:
      summary: Retrieve Account Statements
      parameters:
        - name: year
          in: query
          description: Year for the statement.
          schema:
            type: integer
          example: '2024'
        - name: month
          in: query
          description: Month for the statement (1-12).
          schema:
            type: integer
          example: '7'
        - name: format
          in: query
          description: >-
            Desired format for the statement. Use 'application/json' Accept
            header for download links.
          schema:
            type: string
          example: pdf
      responses:
        '200':
          description: >-
            Account statement metadata with download links, or direct download
            in requested format.
          content:
            application/json:
              schema:
                type: object
                properties:
                  downloadUrls:
                    type: object
                    description: Map of available download URLs for different formats.
                    properties: {}
                required:
                  - accountId
                  - downloadUrls
                  - period
                  - statementId
              example:
                statementId: stmt_acc123_202407
                accountId: acc_chase_checking_4567
                period: July 2024
                downloadUrls:
                  pdf: https://demobank.com/statements/acc123_202407.pdf?sig=...
                  csv: https://demobank.com/statements/acc123_202407.csv?sig=...
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - accounts
        - '{accountId}'
        - statements
      description: >-
        Fetches digital statements for a specific account, allowing filtering by
        date range and format.
    parameters:
      - name: accountId
        in: path
        required: true
        description: Unique identifier for the financial account.
        schema:
          type: string
        example: acc_chase_checking_4567
  /accounts/{accountId}/overdraft-settings:
    get:
      summary: Get Overdraft Protection Settings
      responses:
        '200':
          description: Overdraft settings for the account.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - accountId
                  - enabled
                  - feePreference
              example:
                accountId: acc_chase_checking_4567
                enabled: true
                protectionLimit: 500
                linkToSavings: true
                linkedSavingsAccountId: acc_chase_savings_1234
                feePreference: always_pay
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - accounts
        - '{accountId}'
        - overdraft-settings
      description: >-
        Retrieves the current overdraft protection settings for a specific
        account.
    parameters:
      - name: accountId
        in: path
        required: true
        description: Unique identifier for the financial account.
        schema:
          type: string
        example: acc_chase_checking_4567
    put:
      summary: Update Overdraft Protection Settings
      responses:
        '200':
          description: Overdraft settings updated successfully.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - accountId
                  - enabled
                  - feePreference
              example:
                accountId: acc_chase_checking_4567
                enabled: false
                feePreference: decline_if_over_limit
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - accounts
        - '{accountId}'
        - overdraft-settings
      description: >-
        Updates the overdraft protection settings for a specific account,
        enabling or disabling protection and configuring preferences.
      requestBody:
        content:
          application/json:
            schema:
              description: Fields for updating overdraft protection settings.
              type: object
              properties: {}
            example:
              enabled: false
              linkToSavings: false
              feePreference: decline_if_over_limit
  /accounts/link:
    post:
      summary: Initiate Linking a New External Institution
      responses:
        '200':
          description: >-
            Account linking initiated. Provides a URI for the user to complete
            the connection securely.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - authUri
                  - linkSessionId
                  - status
              example:
                linkSessionId: link_session_xyz789
                authUri: >-
                  https://auth.plaid.com/oauth/initiate?client_id=...&redirect_uri=...
                status: pending_user_action
                message: >-
                  Please redirect user to the provided URI to complete
                  authentication.
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - accounts
        - link
      description: >-
        Begins the secure process of linking a new external financial
        institution (e.g., another bank, investment platform) to the user's 
        profile, typically involving a third-party tokenized flow.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties: {}
              required:
                - countryCode
                - institutionName
            example:
              institutionName: Bank of America
              countryCode: US
  /transactions/{transactionId}/categorize:
    put:
      summary: Manually Categorize or Recategorize a Transaction
      responses:
        '200':
          description: Transaction category updated successfully.
          content:
            application/json:
              schema:
                type: object
                properties:
                  merchantDetails:
                    type: object
                    description: >-
                      Detailed information about a merchant associated with a
                      transaction.
                    properties:
                      address:
                        type: object
                        properties: {}
                  location:
                    type: object
                    description: Geographic location details for a transaction.
                    properties: {}
                required:
                  - accountId
                  - amount
                  - category
                  - currency
                  - date
                  - description
                  - id
                  - type
              example:
                id: txn_quantum-2024-07-21-A7B8C9
                accountId: acc_chase_checking_4567
                type: expense
                category: Home > Groceries
                aiCategoryConfidence: 0.98
                description: Coffee Shop - Quantum Cafe
                amount: 12.5
                currency: USD
                date: '2024-07-21'
                postedDate: '2024-07-22'
                carbonFootprint: 1.2
                paymentChannel: in_store
                tags:
                  - work_lunch
                disputeStatus: none
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - transactions
        - '{transactionId}'
        - categorize
      description: >-
        Allows the user to override or refine the AI's categorization for a
        transaction, improving future AI accuracy and personal financial
        reporting.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties: {}
              required:
                - category
            example:
              category: Home > Groceries
              notes: Bulk purchase for party
              applyToFuture: true
    parameters:
      - name: transactionId
        in: path
        required: true
        description: Unique identifier for the transaction.
        schema:
          type: string
        example: txn_quantum-2024-07-21-A7B8C9
  /transactions/{transactionId}/notes:
    put:
      summary: Add/Update Notes for a Transaction
      responses:
        '200':
          description: Transaction notes updated successfully.
          content:
            application/json:
              schema:
                type: object
                properties:
                  merchantDetails:
                    type: object
                    description: >-
                      Detailed information about a merchant associated with a
                      transaction.
                    properties:
                      address:
                        type: object
                        properties: {}
                  location:
                    type: object
                    description: Geographic location details for a transaction.
                    properties: {}
                required:
                  - accountId
                  - amount
                  - category
                  - currency
                  - date
                  - description
                  - id
                  - type
              example:
                id: txn_quantum-2024-07-21-A7B8C9
                accountId: acc_chase_checking_4567
                type: expense
                category: Dining & Restaurants
                aiCategoryConfidence: 0.92
                description: Coffee Shop - Quantum Cafe
                amount: 12.5
                currency: USD
                date: '2024-07-21'
                postedDate: '2024-07-22'
                carbonFootprint: 1.2
                paymentChannel: in_store
                tags:
                  - work_lunch
                receiptUrl: https://demobank.com/receipts/txn_1a2b3c4d5e.pdf
                disputeStatus: none
                notes: This was a special coffee for a client meeting.
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - transactions
        - '{transactionId}'
        - notes
      description: >-
        Allows the user to add or update personal notes for a specific
        transaction.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties: {}
              required:
                - notes
            example:
              notes: This was a special coffee for a client meeting.
    parameters:
      - name: transactionId
        in: path
        required: true
        description: Unique identifier for the transaction.
        schema:
          type: string
        example: txn_quantum-2024-07-21-A7B8C9
  /transactions/{transactionId}:
    get:
      summary: Get Detailed Transaction by ID
      responses:
        '200':
          description: The requested transaction details with enhanced data.
          content:
            application/json:
              schema:
                type: object
                properties:
                  merchantDetails:
                    type: object
                    description: >-
                      Detailed information about a merchant associated with a
                      transaction.
                    properties:
                      address:
                        type: object
                        properties: {}
                  location:
                    type: object
                    description: Geographic location details for a transaction.
                    properties: {}
                required:
                  - accountId
                  - amount
                  - category
                  - currency
                  - date
                  - description
                  - id
                  - type
              example:
                id: txn_quantum-2024-07-21-A7B8C9
                accountId: acc_chase_checking_4567
                type: expense
                category: Dining & Restaurants
                aiCategoryConfidence: 0.92
                description: Coffee Shop - Quantum Cafe
                merchantDetails:
                  name: Quantum Cafe
                  logoUrl: https://assets.demobank.com/merchants/quantum_cafe.png
                  website: https://quantum.cafe
                  address:
                    city: Quantumville
                    state: CA
                    zip: '90210'
                amount: 12.5
                currency: USD
                date: '2024-07-21'
                postedDate: '2024-07-22'
                carbonFootprint: 1.2
                location:
                  latitude: 34.0522
                  longitude: -118.2437
                  city: Los Angeles
                paymentChannel: in_store
                tags:
                  - work_lunch
                receiptUrl: https://demobank.com/receipts/txn_1a2b3c4d5e.pdf
                disputeStatus: none
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - transactions
        - '{transactionId}'
      description: >-
        Retrieves granular information for a single transaction by its unique
        ID, including AI categorization confidence, merchant details, and
        associated carbon footprint.
    parameters:
      - name: transactionId
        in: path
        required: true
        description: Unique identifier for the transaction.
        schema:
          type: string
        example: txn_quantum-2024-07-21-A7B8C9
  /transactions/recurring:
    get:
      summary: List Recurring Transactions
      parameters:
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
      responses:
        '200':
          description: A paginated list of recurring transactions.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 2
                data:
                  - id: rec_txn_netflix_001
                    description: Netflix Subscription
                    category: Entertainment
                    amount: 19.99
                    currency: USD
                    frequency: monthly
                    nextDueDate: '2024-08-01'
                    lastPaidDate: '2024-07-01'
                    status: active
                    linkedAccountId: acc_chase_checking_4567
                    aiConfidenceScore: 0.95
                  - id: rec_txn_gym_002
                    description: Gym Membership
                    category: Health & Fitness
                    amount: 49
                    currency: USD
                    frequency: monthly
                    nextDueDate: '2024-08-15'
                    lastPaidDate: '2024-07-15'
                    status: active
                    linkedAccountId: acc_chase_checking_4567
                    aiConfidenceScore: 0.99
                nextOffset: 2
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - transactions
        - recurring
      description: >-
        Retrieves a list of all detected or user-defined recurring transactions,
        useful for budget tracking and subscription management.
  /transactions/insights/spending-trends:
    get:
      summary: Get AI-Driven Spending Trends
      responses:
        '200':
          description: Spending trends analysis.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - aiInsights
                  - forecastNextMonth
                  - overallTrend
                  - percentageChange
                  - period
                  - topCategoriesByChange
              example:
                period: Last 3 Months
                overallTrend: increasing
                percentageChange: 5.2
                topCategoriesByChange:
                  - category: Dining & Restaurants
                    percentageChange: 15
                    absoluteChange: 120
                  - category: Groceries
                    percentageChange: 8
                    absoluteChange: 50
                aiInsights:
                  - id: insight-spending-alert-001
                    title: High Dining Spend Alert
                    description: >-
                      Your dining expenses this month are 35% higher than your
                      average, potentially impacting your budget by $150.
                    category: spending
                    severity: medium
                    actionableRecommendation: >-
                      Consider utilizing the 'Budget Optimizer' tool to adjust
                      your dining budget or explore meal prep options.
                    timestamp: '2024-07-22T11:45:00Z'
                forecastNextMonth: 2850
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - transactions
        - insights
        - spending-trends
      description: >-
        Retrieves AI-generated insights into user spending trends over time,
        identifying patterns and anomalies.
  /transactions:
    get:
      summary: List & Filter Transactions with Advanced Options
      parameters:
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
        - name: type
          in: query
          description: Filter transactions by type (e.g., income, expense, transfer).
          schema:
            type: string
          example: expense
        - name: category
          in: query
          description: Filter transactions by their AI-assigned or user-defined category.
          schema:
            type: string
          example: Groceries
        - name: startDate
          in: query
          description: Retrieve transactions from this date (inclusive).
          schema:
            type: string
          example: '2024-01-01'
        - name: endDate
          in: query
          description: Retrieve transactions up to this date (inclusive).
          schema:
            type: string
          example: '2024-12-31'
        - name: minAmount
          in: query
          description: >-
            Filter for transactions with an amount greater than or equal to this
            value.
          schema:
            type: integer
          example: '20'
        - name: maxAmount
          in: query
          description: >-
            Filter for transactions with an amount less than or equal to this
            value.
          schema:
            type: integer
          example: '100'
        - name: searchQuery
          in: query
          description: >-
            Free-text search across transaction descriptions, merchants, and
            notes.
          schema:
            type: string
          example: Starbucks
      responses:
        '200':
          description: A paginated, intelligently filtered list of transactions.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 5
                data:
                  - id: txn_quantum-2024-07-21-A7B8C9
                    accountId: acc_chase_checking_4567
                    type: expense
                    category: Dining & Restaurants
                    aiCategoryConfidence: 0.92
                    description: Coffee Shop - Quantum Cafe
                    merchantDetails:
                      name: Quantum Cafe
                      logoUrl: https://assets.demobank.com/merchants/quantum_cafe.png
                      website: https://quantum.cafe
                      address:
                        city: Quantumville
                        state: CA
                        zip: '90210'
                    amount: 12.5
                    currency: USD
                    date: '2024-07-21'
                    postedDate: '2024-07-22'
                    carbonFootprint: 1.2
                    paymentChannel: in_store
                    tags:
                      - work_lunch
                    disputeStatus: none
                  - id: txn_quantum-2024-07-20-B1C2D3
                    accountId: acc_chase_checking_4567
                    type: expense
                    category: Groceries
                    aiCategoryConfidence: 0.95
                    description: Whole Foods Market
                    merchantDetails:
                      name: Whole Foods Market
                      logoUrl: https://assets.demobank.com/merchants/whole_foods.png
                      website: https://wholefoodsmarket.com
                      address:
                        city: Quantumville
                        state: CA
                        zip: '90210'
                    amount: 85.3
                    currency: USD
                    date: '2024-07-20'
                    postedDate: '2024-07-20'
                    carbonFootprint: 5.5
                    paymentChannel: in_store
                    tags:
                      - weekly_shop
                    disputeStatus: none
                nextOffset: 2
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - transactions
      description: >-
        Retrieves a paginated list of the user's transactions, with extensive
        options for filtering by type, category, date range, amount, and
        intelligent AI-driven sorting and search capabilities.
  /budgets/{budgetId}:
    get:
      summary: Get Detailed Budget Information
      responses:
        '200':
          description: Detailed budget information.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - alertThreshold
                  - categories
                  - endDate
                  - id
                  - name
                  - period
                  - remainingAmount
                  - spentAmount
                  - startDate
                  - status
                  - totalAmount
              example:
                id: budget_monthly_aug
                name: August 2024 Household Budget
                period: monthly
                startDate: '2024-08-01'
                endDate: '2024-08-31'
                totalAmount: 3000
                spentAmount: 1200.5
                remainingAmount: 1799.5
                categories:
                  - name: Groceries
                    allocated: 500
                    spent: 250.75
                    remaining: 249.25
                  - name: Utilities
                    allocated: 150
                    spent: 110
                    remaining: 40
                  - name: Dining & Restaurants
                    allocated: 300
                    spent: 350
                    remaining: -50
                status: active
                alertThreshold: 80
                aiRecommendations:
                  - id: insight-budget-overspend-001
                    title: Dining Budget Exceeded
                    description: >-
                      You've exceeded your dining budget by $50. Consider
                      reallocating funds or reducing future dining expenses.
                    category: budget
                    severity: medium
                    actionableRecommendation: >-
                      Adjust your 'Dining & Restaurants' category or use the
                      'Budget Optimizer' tool.
                    timestamp: '2024-07-22T13:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - budgets
        - '{budgetId}'
      description: >-
        Retrieves detailed information for a specific budget, including current
        spending, remaining amounts, and AI recommendations.
    parameters:
      - name: budgetId
        in: path
        required: true
        description: Unique identifier for the budget.
        schema:
          type: string
        example: budget_monthly_aug
    put:
      summary: Update an Existing Budget
      responses:
        '200':
          description: Budget updated successfully.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - alertThreshold
                  - categories
                  - endDate
                  - id
                  - name
                  - period
                  - remainingAmount
                  - spentAmount
                  - startDate
                  - status
                  - totalAmount
              example:
                id: budget_monthly_aug
                name: August 2024 Household Budget
                period: monthly
                startDate: '2024-08-01'
                endDate: '2024-08-31'
                totalAmount: 3200
                spentAmount: 1200.5
                remainingAmount: 1999.5
                categories:
                  - name: Groceries
                    allocated: 500
                    spent: 250.75
                    remaining: 249.25
                status: active
                alertThreshold: 85
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - budgets
        - '{budgetId}'
      description: >-
        Updates the parameters of an existing budget, such as total amount,
        dates, or categories.
      requestBody:
        content:
          application/json:
            schema:
              description: Fields that can be updated for an existing budget.
              type: object
              properties: {}
            example:
              totalAmount: 3200
              alertThreshold: 85
  /budgets:
    get:
      summary: List All User Budgets
      parameters:
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
      responses:
        '200':
          description: A paginated list of user budgets.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 2
                data:
                  - id: budget_monthly_aug
                    name: August 2024 Household Budget
                    period: monthly
                    startDate: '2024-08-01'
                    endDate: '2024-08-31'
                    totalAmount: 3000
                    spentAmount: 1200.5
                    remainingAmount: 1799.5
                    categories:
                      - name: Groceries
                        allocated: 500
                        spent: 250.75
                        remaining: 249.25
                      - name: Utilities
                        allocated: 150
                        spent: 110
                        remaining: 40
                    status: active
                    alertThreshold: 80
                  - id: budget_vacation_2025
                    name: 2025 Europe Trip
                    period: yearly
                    startDate: '2024-01-01'
                    endDate: '2025-12-31'
                    totalAmount: 5000
                    spentAmount: 1500
                    remainingAmount: 3500
                    categories:
                      - name: Flights
                        allocated: 2000
                        spent: 800
                        remaining: 1200
                    status: active
                    alertThreshold: 90
                nextOffset: 2
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - budgets
      description: >-
        Retrieves a list of all active and historical budgets for the
        authenticated user.
  /investments/portfolios/{portfolioId}/rebalance:
    post:
      summary: Initiate AI-Driven Portfolio Rebalancing
      responses:
        '202':
          description: >-
            Portfolio rebalancing initiated. Details will be provided
            asynchronously.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - portfolioId
                  - rebalanceId
                  - status
                  - statusMessage
              example:
                rebalanceId: rebal_port_growth_123
                portfolioId: portfolio_equity_growth
                status: analyzing
                statusMessage: >-
                  AI is analyzing optimal trade strategy to match target risk
                  profile.
                estimatedImpact: Projected 5% reduction in portfolio volatility.
                confirmationRequired: true
                confirmationExpiresAt: '2024-07-22T15:00:00Z'
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - investments
        - portfolios
        - '{portfolioId}'
        - rebalance
      description: >-
        Triggers an AI-driven rebalancing process for a specific investment
        portfolio based on a target risk tolerance or strategy.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties: {}
              required:
                - targetRiskTolerance
            example:
              targetRiskTolerance: medium
              dryRun: true
              confirmationRequired: true
    parameters:
      - name: portfolioId
        in: path
        required: true
        description: Unique identifier for the investment portfolio.
        schema:
          type: string
        example: portfolio_equity_growth
  /investments/portfolios/{portfolioId}:
    get:
      summary: Get Detailed Investment Portfolio
      responses:
        '200':
          description: Detailed investment portfolio information.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - currency
                  - id
                  - lastUpdated
                  - name
                  - riskTolerance
                  - todayGainLoss
                  - totalValue
                  - type
                  - unrealizedGainLoss
              example:
                id: portfolio_equity_growth
                name: Aggressive Growth Portfolio
                type: equities
                currency: USD
                totalValue: 250000
                unrealizedGainLoss: 25000
                todayGainLoss: 500
                lastUpdated: '2024-07-22T10:00:00Z'
                riskTolerance: aggressive
                aiPerformanceInsights:
                  - id: insight-market-outlook-001
                    title: Strong Tech Sector Performance
                    description: >-
                      The AI predicts continued strong performance in the tech
                      sector, which currently forms a significant portion of
                      your portfolio.
                    category: investing
                    severity: low
                    timestamp: '2024-07-22T14:15:00Z'
                holdings:
                  - symbol: AAPL
                    name: Apple Inc.
                    quantity: 100
                    averageCost: 150
                    currentPrice: 180
                    marketValue: 18000
                    percentageOfPortfolio: 7.2
                    esgScore: 8.5
                  - symbol: MSFT
                    name: Microsoft Corp.
                    quantity: 50
                    averageCost: 300
                    currentPrice: 320
                    marketValue: 16000
                    percentageOfPortfolio: 6.4
                    esgScore: 8.9
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - investments
        - portfolios
        - '{portfolioId}'
      description: >-
        Retrieves detailed information for a specific investment portfolio,
        including holdings, performance, and AI insights.
    parameters:
      - name: portfolioId
        in: path
        required: true
        description: Unique identifier for the investment portfolio.
        schema:
          type: string
        example: portfolio_equity_growth
    put:
      summary: Update Investment Portfolio Details
      responses:
        '200':
          description: Investment portfolio updated successfully.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - currency
                  - id
                  - lastUpdated
                  - name
                  - riskTolerance
                  - todayGainLoss
                  - totalValue
                  - type
                  - unrealizedGainLoss
              example:
                id: portfolio_equity_growth
                name: Aggressive Growth Portfolio
                type: equities
                currency: USD
                totalValue: 250000
                unrealizedGainLoss: 25000
                todayGainLoss: 500
                lastUpdated: '2024-07-22T14:30:00Z'
                riskTolerance: medium
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - investments
        - portfolios
        - '{portfolioId}'
      description: >-
        Updates high-level details of an investment portfolio, such as name or
        risk tolerance.
      requestBody:
        content:
          application/json:
            schema:
              description: Fields that can be updated for an investment portfolio.
              type: object
              properties: {}
            example:
              riskTolerance: medium
              aiRebalancingFrequency: quarterly
  /investments/portfolios:
    get:
      summary: List All Investment Portfolios
      parameters:
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
      responses:
        '200':
          description: A paginated list of investment portfolios.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 2
                data:
                  - id: portfolio_equity_growth
                    name: Aggressive Growth Portfolio
                    type: equities
                    currency: USD
                    totalValue: 250000
                    unrealizedGainLoss: 25000
                    todayGainLoss: 500
                    lastUpdated: '2024-07-22T10:00:00Z'
                    riskTolerance: aggressive
                  - id: portfolio_retirement_bond
                    name: Retirement Bond Portfolio
                    type: bonds
                    currency: USD
                    totalValue: 180000
                    unrealizedGainLoss: 5000
                    todayGainLoss: 100
                    lastUpdated: '2024-07-22T10:00:00Z'
                    riskTolerance: low
                nextOffset: 2
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - investments
        - portfolios
      description: >-
        Retrieves a summary of all investment portfolios linked to the user's
        account.
  /investments/assets/search:
    get:
      summary: Search for Investment Assets with ESG Scores
      parameters:
        - name: query
          in: query
          description: Search query for asset name or symbol.
          schema:
            type: string
          example: Tesla
        - name: minESGScore
          in: query
          description: Minimum desired ESG score (0-10).
          schema:
            type: integer
          example: '7'
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
      responses:
        '200':
          description: A paginated list of investment assets with ESG data.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 2
                data:
                  - assetSymbol: TSLA
                    assetName: Tesla Inc.
                    assetType: stock
                    currentPrice: 250.75
                    currency: USD
                    overallESGScore: 9.1
                    environmentalScore: 9.5
                    socialScore: 8.8
                    governanceScore: 9
                    esgRatingProvider: MSCI
                    esgControversies:
                      - Labor Practices Controversy
                    aiESGInsight: >-
                      Tesla's high environmental score is driven by its focus on
                      sustainable transportation, though social scores reflect
                      recent labor concerns.
                  - assetSymbol: Vanguard Total Stock Market ETF
                    assetName: Vanguard Total Stock Market ETF
                    assetType: etf
                    currentPrice: 200
                    currency: USD
                    overallESGScore: 7.8
                    environmentalScore: 7.5
                    socialScore: 8
                    governanceScore: 8
                    esgRatingProvider: Sustainalytics
                    esgControversies: []
                    aiESGInsight: >-
                      A broadly diversified ETF with a solid overall ESG
                      profile, reflecting average market performance in
                      sustainability.
                nextOffset: 2
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - investments
        - assets
        - search
      description: >-
        Searches for available investment assets (stocks, ETFs, mutual funds)
        and returns their ESG impact scores.
  /ai/advisor/chat/history:
    get:
      summary: Retrieve AI Advisor Conversation History
      parameters:
        - name: sessionId
          in: query
          description: >-
            Optional: Filter history by a specific session ID. If omitted,
            recent conversations will be returned.
          schema:
            type: string
          example: session-quantum-xyz-789-alpha
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
      responses:
        '200':
          description: Paginated list of chat messages.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 3
                data:
                  - role: user
                    content: What is my current net worth?
                    timestamp: '2024-07-22T18:00:00Z'
                  - role: assistant
                    content: >-
                      I've completed a detailed analysis of your spending. It
                      appears your dining expenses account for 35% of your total
                      outflows this month, significantly higher than your target.
                      Would you like me to identify specific areas for reduction or
                      suggest alternative dining options?
                    timestamp: '2024-07-22T18:01:00Z'
                  - role: user
                    content: Yes, please provide a breakdown.
                    timestamp: '2024-07-22T18:02:00Z'
                nextOffset: 2
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - ai
        - advisor
        - chat
        - history
      description: >-
        Fetches the full conversation history with the Quantum AI Advisor for a
        given session or user.
  /ai/advisor/chat:
    post:
      summary: Send a Message to the Quantum AI Advisor
      responses:
        '200':
          description: AI response with spending insights
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - sessionId
              example:
                text: >-
                  I've completed a detailed analysis of your spending. It
                  appears your dining expenses account for 35% of your total
                  outflows this month, significantly higher than your target.
                  Would you like me to identify specific areas for reduction or
                  suggest alternative dining options?
                sessionId: session-quantum-xyz-789-alpha
                proactiveInsights:
                  - id: insight-dining-overspend-002
                    title: High Dining Spend Alert
                    description: >-
                      Your dining expenses this month are 35% higher than your
                      average, potentially impacting your budget by $150.
                    category: spending
                    severity: medium
                    actionableRecommendation: >-
                      Consider utilizing the 'Budget Optimizer' tool to adjust
                      your dining budget or explore meal prep options.
                    timestamp: '2024-07-22T15:00:00Z'
        '400':
          description: Common bad request error
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Invalid or missing authentication credentials
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '503':
          description: AI service overloaded
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: AI_SERVICE_UNAVAILABLE
                message: >-
                  The Quantum AI Advisor service is temporarily overloaded.
                  Please try again in a few minutes.
                timestamp: '2024-07-22T15:05:00Z'
      tags:
        - ai
        - advisor
        - chat
      description: >-
        Initiates or continues a sophisticated conversation with Quantum, the AI
        Advisor. Quantum can provide advanced financial insights, execute
        complex tasks via an expanding suite of intelligent tools, and learn
        from user interactions to offer hyper-personalized guidance.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                functionResponse:
                  type: object
                  description: >-
                    Optional: The output from a tool function that the AI
                    previously requested to be executed.
                  properties: {}
              example:
                message: >-
                  Can you analyze my recent spending patterns and suggest areas
                  for saving, focusing on my dining expenses?
                sessionId: session-quantum-xyz-789-alpha
  /ai/advisor/tools:
    get:
      summary: List Available AI Tools for Quantum
      parameters:
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
      responses:
        '200':
          description: A paginated list of available AI tools.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 2
                data:
                  - name: send_money
                    description: >-
                      Sends money to a specified recipient from the user's
                      primary checking account.
                    parameters:
                      type: object
                      properties:
                        amount:
                          type: number
                          description: The amount of money to send.
                        recipient:
                          type: string
                          description: The name or ID of the recipient.
                        currency:
                          type: string
                          description: The currency of the transaction (e.g., USD, EUR).
                      required:
                        - amount
                        - recipient
                        - currency
                    accessScope: write:payments
                  - name: get_account_balance
                    description: >-
                      Retrieves the current balance of a specified financial
                      account.
                    parameters:
                      type: object
                      properties:
                        accountId:
                          type: string
                          description: The ID of the account.
                      required:
                        - accountId
                    accessScope: read:accounts
                nextOffset: 2
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - ai
        - advisor
        - tools
      description: >-
        Retrieves a dynamic manifest of all integrated AI tools that Quantum can
        invoke and execute, providing details on their capabilities, parameters,
        and access requirements.
  /ai/oracle/simulate/advanced:
    post:
      summary: Run an Advanced Multi-Variable Financial Simulation
      responses:
        '200':
          description: >-
            Advanced simulation completed successfully, returning granular
            impact analysis, sensitivity curves, and optimized strategies.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - overallSummary
                  - scenarioResults
                  - simulationId
              example:
                simulationId: sim_oracle-complex-macro-123
                overallSummary: >-
                  The advanced simulation reveals that a job loss scenario has a
                  significant initial impact on liquidity, but recovery is
                  highly dependent on market conditions and the duration of
                  unemployment. Proactive savings and diversified investments
                  are key mitigating factors.
                scenarioResults:
                  - scenarioName: Job Loss & Mild Market Recovery
                    narrativeSummary: >-
                      In this scenario, initial liquidity challenges are
                      observed, but a swift market recovery and prudent spending
                      lead to recovery within 3 years.
                    finalNetWorthProjected: 1250000
                    liquidityMetrics:
                      minCashBalance: -5000
                      recoveryTimeMonths: 36
                    sensitivityAnalysisGraphs:
                      - paramName: marketRecoveryRate
                        data:
                          - paramValue: 0.03
                            outcomeValue: 1100000
                          - paramValue: 0.05
                            outcomeValue: 1250000
                          - paramValue: 0.07
                            outcomeValue: 1400000
                strategicRecommendations:
                  - id: insight-emergency-fund-003
                    title: Strengthen Emergency Fund
                    description: >-
                      Maintain an emergency fund equivalent to 6-12 months of
                      living expenses to buffer against unexpected job loss.
                    category: saving
                    severity: high
                    actionableRecommendation: >-
                      Consult with treasury manager to explore investment
                      options.
                    timestamp: '2024-07-22T16:30:00Z'
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '503':
          description: >-
            AI simulation service is experiencing extended processing times or
            is unavailable for complex requests.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: SIMULATION_LONG_PROCESSING
                message: >-
                  AI simulation service is experiencing extended processing
                  times for complex requests. Please allow more time.
                timestamp: '2024-07-22T16:45:00Z'
      tags:
        - ai
        - oracle
        - simulate
        - advanced
      description: >-
        Engages the Quantum Oracle for highly complex, multi-variable
        simulations, allowing precise control over numerous financial
        parameters, market conditions, and personal events to generate deep,
        predictive insights and sensitivity analysis.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                globalEconomicFactors:
                  type: object
                  description: >-
                    Optional: Global economic conditions to apply to all
                    scenarios.
                  properties: {}
                personalAssumptions:
                  type: object
                  description: >-
                    Optional: Personal financial assumptions to override
                    defaults.
                  properties: {}
              required:
                - prompt
                - scenarios
            example:
              prompt: >-
                Evaluate the long-term impact of a sudden job loss combined with
                a variable market downturn, analyzing worst-case and best-case
                recovery scenarios over a decade.
              scenarios:
                - name: Job Loss & Mild Market Recovery
                  events:
                    - type: job_loss
                      details:
                        durationMonths: 6
                        severanceAmount: 10000
                        unemploymentBenefits: 2000
                    - type: market_downturn
                      details:
                        impactPercentage: 0.15
                        recoveryYears: 3
                  durationYears: 10
                  sensitivityAnalysisParams:
                    - paramName: marketRecoveryRate
                      min: 0.03
                      max: 0.07
                      step: 0.01
  /ai/oracle/simulate:
    post:
      summary: Run a 'What-If' Financial Simulation (Standard)
      responses:
        '200':
          description: >-
            The simulation was successful. The response contains a detailed
            impact analysis and actionable recommendations.
          content:
            application/json:
              schema:
                type: object
                properties:
                  riskAnalysis:
                    type: object
                    description: AI-driven risk assessment of the simulated scenario.
                    properties: {}
                required:
                  - keyImpacts
                  - narrativeSummary
                  - simulationId
              example:
                simulationId: sim_oracle-growth-2024-xyz
                narrativeSummary: >-
                  If you consistently invest an additional $1,000 per month into
                  your aggressive growth portfolio over the next 5 years, the
                  Quantum Oracle predicts your portfolio could grow by
                  approximately 45-60%, significantly increasing your wealth.
                  However, this comes with elevated risk during market
                  downturns.
                keyImpacts:
                  - metric: Projected Portfolio Value
                    value: $120,000 - $140,000
                    severity: high
                  - metric: Overall Net Worth Increase
                    value: $60,000 - $70,000
                    severity: high
                recommendations:
                  - title: Review Portfolio Diversification
                    description: >-
                      Given the aggressive nature of this strategy, the Oracle
                      suggests reviewing your current portfolio diversification
                      to mitigate concentration risk.
                    actionTrigger: open_portfolio_diversification_tool
                riskAnalysis:
                  maxDrawdown: 0.25
                  volatilityIndex: 0.18
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '503':
          description: >-
            AI simulation service is temporarily unavailable due to high demand
            or maintenance.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: SIMULATION_SERVICE_UNAVAILABLE
                message: >-
                  AI simulation service is temporarily unavailable due to high
                  demand. Please try again shortly.
                timestamp: '2024-07-22T16:00:00Z'
      tags:
        - ai
        - oracle
        - simulate
      description: >-
        Submits a hypothetical scenario to the Quantum Oracle AI for standard
        financial impact analysis. The AI simulates the effect on the user's
        current financial state and provides a summary.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties: {}
              required:
                - prompt
            example:
              prompt: >-
                What if I invest an additional $1,000 per month into my
                aggressive growth portfolio for the next 5 years?
              parameters:
                durationYears: 5
                monthlyInvestmentAmount: 1000
                riskTolerance: aggressive
  /ai/oracle/simulations/{simulationId}:
    get:
      summary: Get Detailed Simulation Results
      responses:
        '200':
          description: Detailed simulation results.
          content:
            application/json:
              schema:
                oneOf:
                  - type: object
                    properties:
                      riskAnalysis:
                        type: object
                        description: AI-driven risk assessment of the simulated scenario.
                        properties: {}
                    required:
                      - keyImpacts
                      - narrativeSummary
                      - simulationId
                  - type: object
                    properties: {}
                    required:
                      - overallSummary
                      - scenarioResults
                      - simulationId
              example:
                simulationId: sim_oracle-growth-2024-xyz
                narrativeSummary: >-
                  If you consistently invest an additional $1,000 per month into
                  your aggressive growth portfolio over the next 5 years, the
                  Quantum Oracle predicts your portfolio could grow by
                  approximately 45-60%...
                keyImpacts:
                  - metric: Projected Portfolio Value
                    value: $120,000 - $140,000
                    severity: high
                recommendations:
                  - title: Review Portfolio Diversification
                    description: >-
                      Given the aggressive nature of this strategy, the Oracle
                      suggests reviewing your current portfolio diversification
                      to mitigate concentration risk.
                riskAnalysis:
                  maxDrawdown: 0.25
                  volatilityIndex: 0.18
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - ai
        - oracle
        - simulations
        - '{simulationId}'
      description: >-
        Retrieves the full, detailed results of a specific financial simulation
        by its ID.
    parameters:
      - name: simulationId
        in: path
        required: true
        description: Unique identifier for the financial simulation.
        schema:
          type: string
        example: sim_oracle-growth-2024-xyz
  /ai/oracle/simulations:
    get:
      summary: List All User Simulations
      parameters:
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
      responses:
        '200':
          description: A paginated list of financial simulations.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 3
                data:
                  - simulationId: sim_oracle-growth-2024-xyz
                    title: Investment Growth Scenario
                    status: completed
                    creationDate: '2024-07-20T10:00:00Z'
                    lastUpdated: '2024-07-20T10:15:00Z'
                    summary: >-
                      Simulated impact of additional monthly investments over 5
                      years.
                  - simulationId: sim_oracle-complex-macro-123
                    title: Job Loss & Market Downturn Impact
                    status: completed
                    creationDate: '2024-07-18T14:30:00Z'
                    lastUpdated: '2024-07-18T14:45:00Z'
                    summary: >-
                      Evaluated long-term impact of job loss with variable
                      market conditions.
                nextOffset: 2
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - ai
        - oracle
        - simulations
      description: >-
        Retrieves a list of all financial simulations previously run by the
        user, including their status and summaries.
  /ai/incubator/pitch/{pitchId}/details:
    get:
      summary: Get Detailed AI Analysis & Feedback for a Business Pitch
      responses:
        '200':
          description: >-
            Comprehensive details of the pitch's current state, AI feedback, and
            next steps.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - lastUpdated
                      - nextSteps
                      - pitchId
                      - stage
                      - statusMessage
                  - type: object
                    properties:
                      aiFinancialModel:
                        type: object
                        description: AI's detailed financial model analysis.
                        properties:
                          revenueBreakdown:
                            type: object
                            example:
                              Year 1: 2.5M
                              Year 2: 7.8M
                              Year 3: 15M
                          costStructureAnalysis:
                            type: object
                            example:
                              Fixed Costs: 30%
                              Variable Costs: 40%
                              R&D: 15%
                      aiMarketAnalysis:
                        type: object
                        description: AI's detailed market analysis.
                        properties: {}
                      aiCoachingPlan:
                        type: object
                        description: AI-generated coaching plan for the entrepreneur.
                        properties: {}
                      aiRiskAssessment:
                        type: object
                        description: AI's assessment of risks associated with the venture.
                        properties: {}
              example:
                pitchId: pitch_qw_synergychain-xyz
                stage: feedback_required
                statusMessage: >-
                  Quantum Weaver has completed its initial analysis. Please
                  review the feedback and answer the outstanding questions.
                lastUpdated: '2024-07-22T21:00:00Z'
                feedbackSummary: Initial analysis indicates a strong market fit, but further detail is required on customer acquisition costs and scaling strategy.
                questions:
                  - id: q_qa-team-001
                    question: >-
                      Please elaborate on the specific technical challenges you
                      anticipate in deploying your quantum-inspired algorithms
                      at scale, and how your team plans to mitigate these.
                    category: technology
                    isRequired: true
                  - id: q_qa-market-002
                    question: >-
                      Provide more granular projections for customer acquisition
                      cost (CAC) for the first 12 months.
                    category: market
                    isRequired: true
                nextSteps: >-
                  Please address the outstanding questions in the 'questions'
                  array and resubmit feedback.
                estimatedFundingOffer: 5000000
                aiFinancialModel:
                  revenueBreakdown:
                    Year 1: 2.5M
                    Year 2: 7.8M
                    Year 3: 15M
                  costStructureAnalysis:
                    Fixed Costs: 30%
                    Variable Costs: 40%
                    R&D: 15%
                  breakevenPoint: 18 months
                  capitalRequirements: 4500000
                  sensitivityAnalysis:
                    - scenario: Aggressive Growth
                      projectedIRR: 0.35
                      terminalValue: 50000000
                    - scenario: Moderate Growth
                      projectedIRR: 0.2
                      terminalValue: 30000000
                aiMarketAnalysis:
                  targetMarketSize: $50 Billion (TAM)
                  competitiveAdvantages:
                    - Proprietary AI Algorithm
                    - First-mover advantage in quantum-AI finance
                  growthOpportunities: >-
                    Expansion into APAC region, new product lines (e.g.,
                    corporate treasury solutions).
                  riskFactors: >-
                    Regulatory changes in AI governance, talent acquisition
                    challenges.
                aiCoachingPlan:
                  title: Pre-Seed Fundraising Strategy
                  summary: >-
                    This plan outlines key strategic steps to optimize your
                    pitch deck, identify target investors, and prepare for due
                    diligence to secure pre-seed funding.
                  steps:
                    - title: Refine Investor Presentation
                      description: >-
                        Update your pitch deck to incorporate recent market
                        validation data and clearly articulate the competitive
                        differentiation of SynergyChain AI, guided by feedback
                        from Quantum Weaver.
                      timeline: 1-2 weeks
                      status: pending
                      resources:
                        - name: Pitch Deck Template
                          url: https://demobank.com/resources/pitch-template.pptx
                    - title: Market Research Deep Dive
                      description: >-
                        Conduct further detailed market research to validate
                        customer acquisition cost assumptions for enterprise
                        clients.
                      timeline: 2 weeks
                      status: pending
                investorMatchScore: 0.88
                aiRiskAssessment:
                  technicalRisk: >-
                    Medium (complex AI development, quantum compute
                    dependencies)
                  marketRisk: >-
                    Low (established market, clear pain points, strong value
                    prop)
                  teamRisk: >-
                    Low (experienced founding team with relevant domain
                    expertise)
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - ai
        - incubator
        - pitch
        - '{pitchId}'
        - details
      description: >-
        Retrieves the granular AI-driven analysis, strategic feedback, market
        validation results, and any outstanding questions from Quantum Weaver
        for a specific business pitch.
    parameters:
      - name: pitchId
        in: path
        required: true
        description: Unique identifier for the business pitch.
        schema:
          type: string
        example: pitch_qw_synergychain-xyz
  /ai/incubator/pitch/{pitchId}/feedback:
    put:
      summary: Submit Feedback or Answers to AI Questions for a Business Pitch
      responses:
        '200':
          description: Feedback submitted successfully. Pitch status updated.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - lastUpdated
                  - nextSteps
                  - pitchId
                  - stage
                  - statusMessage
              example:
                pitchId: pitch_qw_synergychain-xyz
                stage: ai_analysis
                statusMessage: >-
                  Thank you for your feedback. Quantum Weaver is now
                  re-evaluating your pitch based on the new information.
                lastUpdated: '2024-07-22T22:00:00Z'
                feedbackSummary: Updated technical and market details provided.
                questions: []
                nextSteps: The AI will provide updated analysis and next steps shortly.
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - ai
        - incubator
        - pitch
        - '{pitchId}'
        - feedback
      description: >-
        Allows the entrepreneur to respond to specific questions or provide
        additional details requested by Quantum Weaver, moving the pitch forward
        in the incubation process.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties: {}
            example:
              feedback: >-
                Regarding the technical challenges, our team has allocated 3
                months for R&D on quantum-resistant cryptography, mitigating the
                risk. We've also brought in Dr. Elena Petrova, a leading expert
                in secure multi-party computation.
              answers:
                - questionId: q_qa-team-001
                  answer: >-
                    Our mitigation strategy includes dedicated R&D and new hires
                    with specific expertise.
                - questionId: q_qa-market-002
                  answer: >-
                    Our CAC projections are based on pilot program results
                    showing $500 per enterprise client with a conversion rate of
                    10% from trials.
    parameters:
      - name: pitchId
        in: path
        required: true
        description: Unique identifier for the business pitch.
        schema:
          type: string
        example: pitch_qw_synergychain-xyz
  /ai/incubator/pitch:
    post:
      summary: Submit a High-Potential Business Plan to Quantum Weaver
      responses:
        '202':
          description: >-
            The business plan was successfully ingested and is undergoing
            initial AI analysis. A unique pitch ID is provided for tracking
            progress.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - lastUpdated
                  - nextSteps
                  - pitchId
                  - stage
                  - statusMessage
              example:
                pitchId: pitch_qw_synergychain-xyz
                stage: initial_review
                statusMessage: >-
                  Your business plan has been received and is undergoing initial
                  review by Quantum Weaver.
                lastUpdated: '2024-07-22T20:00:00Z'
                nextSteps: >-
                  Please monitor for AI-generated feedback and potential
                  questions within the next 48 hours.
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '409':
          description: >-
            The request could not be completed due to a conflict with the
            current state of the resource (e.g., duplicate entry, expired
            state).
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: RESOURCE_CONFLICT
                message: >-
                  A resource with this identifier already exists or the
                  operation conflicts with an existing state.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - ai
        - incubator
        - pitch
      description: >-
        Submits a detailed business plan to the Quantum Weaver AI for rigorous
        analysis, market validation, and seed funding consideration. This
        initiates the AI-driven incubation journey, aiming to transform
        innovative ideas into commercially successful ventures.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                financialProjections:
                  type: object
                  description: >-
                    Key financial metrics and projections for the next 3-5
                    years.
                  properties: {}
              required:
                - businessPlan
                - financialProjections
                - foundingTeam
                - marketOpportunity
            example:
              businessPlan: >-
                Quantum-AI powered financial advisor platform leveraging neural
                networks for predictive analytics and hyper-personalized
                advice...
              foundingTeam:
                - name: Dr. Eleanor Vance
                  role: CEO & Lead AI Scientist
                  experience: >-
                    15+ years in AI/ML, PhD in Quantum Computing, ex-Google
                    Brain
                - name: Marcus Thorne
                  role: COO & Finance Expert
                  experience: 20+ years in Fintech, ex-Goldman Sachs
              marketOpportunity: >-
                The booming digital finance market coupled with demand for truly
                personalized, AI-driven financial guidance presents a
                multi-billion dollar opportunity. Our unique quantum-AI approach
                provides unparalleled accuracy and foresight.
              financialProjections:
                seedRoundAmount: 2500000
                valuationPreMoney: 10000000
                projectionYears: 3
                revenueForecast:
                  - 500000
                  - 2000000
                  - 6000000
                profitabilityEstimate: Achieve profitability within 18 months.
  /ai/incubator/pitches:
    get:
      summary: List All User Business Pitches
      parameters:
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
        - name: status
          in: query
          description: Filter pitches by their current stage.
          schema:
            type: string
          example: feedback_required
      responses:
        '200':
          description: A paginated list of business pitches.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 3
                data:
                  - pitchId: pitch_qw_synergychain-xyz
                    stage: feedback_required
                    statusMessage: >-
                      Quantum Weaver has completed its initial analysis. Please
                      review the feedback and answer the outstanding questions.
                    lastUpdated: '2024-07-22T21:00:00Z'
                    feedbackSummary: >-
                      Initial analysis indicates a strong market fit, but
                      further detail is required on customer acquisition costs
                      and scaling strategy.
                    questions:
                      - id: q_qa-team-001
                        question: Please elaborate on technical challenges.
                        category: technology
                        isRequired: true
                    nextSteps: Please address the outstanding questions.
                  - pitchId: pitch_qw_fintech-ai-app
                    stage: approved_for_funding
                    statusMessage: >-
                      Congratulations! Your pitch has been approved for seed
                      funding.
                    lastUpdated: '2024-07-15T10:00:00Z'
                    estimatedFundingOffer: 1000000
                    nextSteps: Contact our investment team to finalize terms.
                nextOffset: 2
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - ai
        - incubator
        - pitches
      description: >-
        Retrieves a summary list of all business pitches submitted by the
        authenticated user to Quantum Weaver.
  /ai/ads/generate:
    post:
      summary: Generate a Standard Video Ad with Veo 2.0
      responses:
        '202':
          description: >-
            Video generation initiated. The response contains an operation ID to
            poll for status updates and retrieve the final asset.
          content:
            application/json:
              schema:
                type: object
                properties: {}
              example:
                operationId: op-video-gen-12345-abcde
                estimatedCompletionTimeSeconds: 300
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - ai
        - ads
        - generate
      description: >-
        Submits a request to generate a high-quality video ad using the advanced
        Veo 2.0 generative AI model. This is an asynchronous operation, suitable
        for standard ad content creation.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties: {}
              required:
                - lengthSeconds
                - prompt
                - style
            example:
              prompt: >-
                A captivating ad featuring a young entrepreneur using 's AI
                tools to grow their startup. Focus on innovation and ease of
                use.
              style: Cinematic
              lengthSeconds: 15
              aspectRatio: '16:9'
              brandColors:
                - '#0000FF'
                - '#FFD700'
  /ai/ads/operations/{operationId}:
    get:
      summary: Get Video Generation Status & Retrieve Asset
      responses:
        '200':
          description: Video generation in progress
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - message
                  - operationId
                  - progressPercentage
                  - status
              example:
                operationId: op-video-gen-12345-abcde
                status: rendering
                progressPercentage: 75
                message: Encoding final video with optimized codecs...
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - ai
        - ads
        - operations
        - '{operationId}'
      description: >-
        Polls the real-time status of an asynchronous video generation
        operation. Once complete ('done'), the response includes a temporary,
        signed URL to access and download the generated video asset.
    parameters:
      - name: operationId
        in: path
        required: true
        description: The unique identifier for the video generation operation.
        schema:
          type: string
        example: op-video-gen-12345-abcde
  /ai/ads:
    get:
      summary: List All Generated Video Ads
      parameters:
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
        - name: status
          in: query
          description: Filter ads by their generation status.
          schema:
            type: string
          example: done
      responses:
        '200':
          description: A paginated list of generated video ads.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 3
                data:
                  - operationId: op-video-gen-12345-abcde
                    status: done
                    progressPercentage: 100
                    message: Video generation successfully completed.
                    videoUri: >-
                      https://demobank-cdn.com/generated-videos/final/1a2b3c4d.mp4?sig=eyJ...
                    previewImageUri: >-
                      https://demobank-cdn.com/generated-videos/preview/1a2b3c4d.png
                  - operationId: op-adv-video-gen-xyz789-fghjk
                    status: done
                    progressPercentage: 100
                    message: Advanced video generation completed.
                    videoUri: >-
                      https://demobank-cdn.com/generated-videos/final/adv_1a2b3c4d.mp4?sig=eyJ...
                    previewImageUri: >-
                      https://demobank-cdn.com/generated-videos/preview/adv_1a2b3c4d.png
                nextOffset: 2
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - ai
        - ads
      description: >-
        Retrieves a list of all video advertisements previously generated by the
        user in the AI Ad Studio.
  /corporate/cards/{cardId}/controls:
    put:
      summary: Update Granular Corporate Card Spending Controls
      responses:
        '200':
          description: The corporate card with its advanced controls updated successfully.
          content:
            application/json:
              schema:
                type: object
                properties:
                  controls:
                    type: object
                    description: Granular spending controls for a corporate card.
                    properties: {}
                required:
                  - cardNumberMask
                  - cardType
                  - controls
                  - createdDate
                  - currency
                  - expirationDate
                  - frozen
                  - holderName
                  - id
                  - status
              example:
                id: corp_card_xyz987654
                holderName: Alex Johnson
                associatedEmployeeId: emp_ajohnson_007
                cardNumberMask: 4111********1234
                expirationDate: '2028-12-31'
                status: Active
                frozen: false
                cardType: physical
                controls:
                  atmWithdrawals: true
                  contactlessPayments: true
                  onlineTransactions: true
                  internationalTransactions: true
                  monthlyLimit: 3000
                  dailyLimit: 750
                  singleTransactionLimit: 1000
                  merchantCategoryRestrictions:
                    - Software Subscriptions
                    - Conferences
                  vendorRestrictions:
                    - Amazon
                    - Uber
                spendingPolicyId: policy_travel_eu
                createdDate: '2023-01-15T09:00:00Z'
                currency: USD
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - corporate
        - cards
        - '{cardId}'
        - controls
      description: >-
        Updates the sophisticated spending controls, limits, and policy
        overrides for a specific corporate card, enabling real-time adjustments
        for security and budget adherence.
      requestBody:
        content:
          application/json:
            schema:
              description: Granular spending controls for a corporate card.
              type: object
              properties: {}
            example:
              monthlyLimit: 3000
              dailyLimit: 750
              internationalTransactions: true
              merchantCategoryRestrictions:
                - Software Subscriptions
                - Conferences
    parameters:
      - name: cardId
        in: path
        required: true
        description: Unique identifier for the corporate card.
        schema:
          type: string
        example: corp_card_xyz987654
  /corporate/cards/{cardId}/freeze:
    post:
      summary: Instantly Freeze or Unfreeze a Corporate Card
      responses:
        '200':
          description: Example of a frozen corporate card
          content:
            application/json:
              schema:
                type: object
                properties:
                  controls:
                    type: object
                    description: Granular spending controls for a corporate card.
                    properties: {}
                required:
                  - cardNumberMask
                  - cardType
                  - controls
                  - createdDate
                  - currency
                  - expirationDate
                  - frozen
                  - holderName
                  - id
                  - status
              example:
                id: corp_card_xyz987654
                holderName: Alex Johnson
                associatedEmployeeId: emp_ajohnson_007
                cardNumberMask: 4111********1234
                expirationDate: '2028-12-31'
                status: Suspended
                frozen: true
                cardType: physical
                controls:
                  atmWithdrawals: true
                  contactlessPayments: true
                  onlineTransactions: true
                  internationalTransactions: false
                  monthlyLimit: 2500
                  dailyLimit: 500
                  singleTransactionLimit: 1000
                  merchantCategoryRestrictions:
                    - Restaurants
                    - Travel
                    - Office Supplies
                  vendorRestrictions:
                    - Amazon
                    - Uber
                spendingPolicyId: policy_travel_eu
                createdDate: '2023-01-15T09:00:00Z'
                currency: USD
        '401':
          description: Invalid or missing authentication credentials
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: Insufficient permissions
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: Resource not found error
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - corporate
        - cards
        - '{cardId}'
        - freeze
      description: >-
        Immediately changes the frozen status of a corporate card, preventing or
        allowing transactions in real-time, critical for security and expense
        management.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties: {}
              required:
                - freeze
            example:
              freeze: true
    parameters:
      - name: cardId
        in: path
        required: true
        description: Unique identifier for the corporate card.
        schema:
          type: string
        example: corp_card_xyz987654
  /corporate/cards/{cardId}/transactions:
    get:
      summary: List Transactions for a Corporate Card
      parameters:
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
        - name: startDate
          in: query
          description: Start date for filtering results (inclusive, YYYY-MM-DD).
          schema:
            type: string
          example: '2024-01-01'
        - name: endDate
          in: query
          description: End date for filtering results (inclusive, YYYY-MM-DD).
          schema:
            type: string
          example: '2024-12-31'
      responses:
        '200':
          description: A paginated list of corporate card transactions.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 5
                data:
                  - id: corp_txn_google_ads_1
                    accountId: corp_card_virtual_marketing
                    type: expense
                    category: Advertising
                    aiCategoryConfidence: 0.98
                    description: Google Ads Payment
                    merchantDetails:
                      name: Google Ads
                    amount: 150
                    currency: USD
                    date: '2024-07-10'
                    postedDate: '2024-07-11'
                    paymentChannel: online
                    disputeStatus: none
                  - id: corp_txn_amazon_office
                    accountId: corp_card_xyz987654
                    type: expense
                    category: Office Supplies
                    aiCategoryConfidence: 0.9
                    description: Amazon.com
                    merchantDetails:
                      name: Amazon
                    amount: 75.5
                    currency: USD
                    date: '2024-07-05'
                    postedDate: '2024-07-06'
                    paymentChannel: online
                    disputeStatus: none
                nextOffset: 2
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - corporate
        - cards
        - '{cardId}'
        - transactions
      description: >-
        Retrieves a paginated list of transactions made with a specific
        corporate card, including AI categorization and compliance flags.
    parameters:
      - name: cardId
        in: path
        required: true
        description: Unique identifier for the corporate card.
        schema:
          type: string
        example: corp_card_xyz987654
  /corporate/cards/virtual:
    post:
      summary: Issue a New Virtual Corporate Card
      responses:
        '201':
          description: Virtual corporate card issued successfully.
          content:
            application/json:
              schema:
                type: object
                properties:
                  controls:
                    type: object
                    description: Granular spending controls for a corporate card.
                    properties: {}
                required:
                  - cardNumberMask
                  - cardType
                  - controls
                  - createdDate
                  - currency
                  - expirationDate
                  - frozen
                  - holderName
                  - id
                  - status
              example:
                id: corp_card_virtual_marketing_q4
                holderName: Marketing Campaign Q4
                associatedEmployeeId: emp_marketing_01
                cardNumberMask: 5123********5678
                expirationDate: '2025-12-31'
                status: Active
                frozen: false
                cardType: virtual
                controls:
                  atmWithdrawals: false
                  contactlessPayments: false
                  onlineTransactions: true
                  internationalTransactions: false
                  monthlyLimit: 1000
                  dailyLimit: 500
                  singleTransactionLimit: 200
                  merchantCategoryRestrictions:
                    - Advertising
                  vendorRestrictions:
                    - Facebook Ads
                    - Google Ads
                createdDate: '2024-07-22T16:00:00Z'
                currency: USD
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - corporate
        - cards
        - virtual
      description: >-
        Creates and issues a new virtual corporate card with specified spending
        limits, merchant restrictions, and expiration dates, ideal for secure
        online purchases and temporary projects.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                controls:
                  type: object
                  description: Granular spending controls for a corporate card.
                  properties: {}
              required:
                - controls
                - expirationDate
                - holderName
                - purpose
            example:
              holderName: Marketing Campaign Q4
              associatedEmployeeId: emp_marketing_01
              purpose: Online advertising for Q4 campaigns
              controls:
                atmWithdrawals: false
                contactlessPayments: false
                onlineTransactions: true
                internationalTransactions: false
                monthlyLimit: 1000
                dailyLimit: 500
                singleTransactionLimit: 200
                merchantCategoryRestrictions:
                  - Advertising
                vendorRestrictions:
                  - Facebook Ads
                  - Google Ads
              expirationDate: '2025-12-31'
  /corporate/cards:
    get:
      summary: List All Corporate Enterprise Cards
      parameters:
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
      responses:
        '200':
          description: A paginated, detailed list of all corporate enterprise cards.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 2
                data:
                  - id: corp_card_xyz987654
                    holderName: Alex Johnson
                    associatedEmployeeId: emp_ajohnson_007
                    cardNumberMask: 4111********1234
                    expirationDate: '2028-12-31'
                    status: Active
                    frozen: false
                    cardType: physical
                    controls:
                      atmWithdrawals: true
                      contactlessPayments: true
                      onlineTransactions: true
                      internationalTransactions: false
                      monthlyLimit: 2500
                      dailyLimit: 500
                      singleTransactionLimit: 1000
                      merchantCategoryRestrictions:
                        - Restaurants
                        - Travel
                        - Office Supplies
                      vendorRestrictions:
                        - Amazon
                        - Uber
                    spendingPolicyId: policy_travel_eu
                    createdDate: '2023-01-15T09:00:00Z'
                    currency: USD
                  - id: corp_card_virtual_marketing
                    holderName: Marketing Campaign Q3
                    associatedEmployeeId: emp_marketing_01
                    cardNumberMask: 5123********5678
                    expirationDate: '2025-09-30'
                    status: Active
                    frozen: false
                    cardType: virtual
                    controls:
                      atmWithdrawals: false
                      contactlessPayments: false
                      onlineTransactions: true
                      internationalTransactions: false
                      monthlyLimit: 500
                      dailyLimit: 500
                      singleTransactionLimit: 200
                      merchantCategoryRestrictions:
                        - Advertising
                      vendorRestrictions:
                        - Facebook Ads
                        - Google Ads
                    createdDate: '2024-07-01T10:00:00Z'
                    currency: USD
                nextOffset: 2
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - corporate
        - cards
      description: >-
        Retrieves a comprehensive list of all physical and virtual corporate
        cards associated with the user's organization, including their status,
        assigned holder, and current spending controls.
  /corporate/anomalies/{anomalyId}/status:
    put:
      summary: Update Anomaly Review Status
      responses:
        '200':
          description: The updated anomaly object with the new status and resolution notes.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - aiConfidenceScore
                  - description
                  - entityId
                  - entityType
                  - id
                  - recommendedAction
                  - riskScore
                  - severity
                  - status
                  - timestamp
              example:
                id: anom_risk-2024-07-21-D1E2F3
                description: Unusual large transaction detected in an inactive account.
                details: >-
                  Transaction of $15,000 to 'International Widgets Inc.' from
                  account 'CHASE CHECKING 4567'. This account has been dormant
                  for 6 months...
                severity: Critical
                status: Resolved
                entityType: Transaction
                entityId: txn_quantum-2024-07-21-A7B8C9
                timestamp: '2024-07-21T10:15:30Z'
                riskScore: 95
                aiConfidenceScore: 0.98
                recommendedAction: >-
                  Immediately freeze associated corporate card and contact
                  cardholder for verification.
                relatedTransactions:
                  - txn_previous_small_txns
                resolutionNotes: >-
                  Confirmed legitimate transaction after contacting vendor.
                  Marked as resolved.
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - corporate
        - anomalies
        - '{anomalyId}'
        - status
      description: >-
        Updates the review status of a specific financial anomaly, allowing
        compliance officers to mark it as dismissed, resolved, or escalate for
        further investigation after thorough AI-assisted and human review.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties: {}
              required:
                - status
            example:
              status: Resolved
              resolutionNotes: >-
                Confirmed legitimate transaction after contacting vendor. Marked
                as resolved.
    parameters:
      - name: anomalyId
        in: path
        required: true
        description: Unique identifier for the financial anomaly.
        schema:
          type: string
        example: anom_risk-2024-07-21-D1E2F3
  /corporate/anomalies:
    get:
      summary: List AI-Detected Financial Anomalies
      parameters:
        - name: status
          in: query
          description: Filter anomalies by their current review status.
          schema:
            type: string
          example: New
        - name: severity
          in: query
          description: Filter anomalies by their AI-assessed severity level.
          schema:
            type: string
          example: Critical
        - name: entityType
          in: query
          description: >-
            Filter anomalies by the type of financial entity they are related
            to.
          schema:
            type: string
          example: Transaction
        - name: startDate
          in: query
          description: Start date for filtering results (inclusive, YYYY-MM-DD).
          schema:
            type: string
          example: '2024-01-01'
        - name: endDate
          in: query
          description: End date for filtering results (inclusive, YYYY-MM-DD).
          schema:
            type: string
          example: '2024-12-31'
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
      responses:
        '200':
          description: >-
            A paginated list of AI-detected financial anomalies, prioritized by
            risk score.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 3
                data:
                  - id: anom_risk-2024-07-21-D1E2F3
                    description: Unusual large transaction detected in an inactive account.
                    details: >-
                      Transaction of $15,000 to 'International Widgets Inc.'
                      from account 'CHASE CHECKING 4567'. This account has been
                      dormant for 6 months and typical transactions are under
                      $500. High risk score due to dormancy and unusual
                      amount/payee combination.
                    severity: Critical
                    status: New
                    entityType: Transaction
                    entityId: txn_quantum-2024-07-21-A7B8C9
                    timestamp: '2024-07-21T10:15:30Z'
                    riskScore: 95
                    aiConfidenceScore: 0.98
                    recommendedAction: >-
                      Immediately freeze associated corporate card and contact
                      cardholder for verification.
                    relatedTransactions:
                      - txn_previous_small_txns
                  - id: anom_risk-2024-07-22-E4F5G6
                    description: >-
                      Multiple failed login attempts followed by successful
                      login from new IP.
                    details: >-
                      Five failed login attempts from IP 192.0.2.10, immediately
                      followed by a successful login from a new IP 203.0.113.20.
                      Suggests possible credential stuffing attack.
                    severity: High
                    status: Under Review
                    entityType: User
                    entityId: user-quantum-visionary-001
                    timestamp: '2024-07-22T09:00:00Z'
                    riskScore: 88
                    aiConfidenceScore: 0.92
                    recommendedAction: Request user to verify login via MFA, alert security team.
                    relatedTransactions: []
                nextOffset: 2
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - corporate
        - anomalies
      description: >-
        Retrieves a comprehensive list of AI-detected financial anomalies across
        transactions, payments, and corporate cards that require immediate
        review and potential action to mitigate risk and ensure compliance.
  /corporate/compliance/audits/{auditId}/report:
    get:
      summary: Retrieve AI-Generated Compliance Audit Report
      responses:
        '200':
          description: The comprehensive compliance audit report.
          content:
            application/json:
              schema:
                type: object
                properties:
                  periodCovered:
                    type: object
                    description: The period covered by this audit report.
                    properties: {}
                required:
                  - auditDate
                  - auditId
                  - findings
                  - overallComplianceScore
                  - periodCovered
                  - recommendedActions
                  - status
                  - summary
              example:
                auditId: audit_corp_xyz789
                status: completed
                auditDate: '2024-07-22T19:00:00Z'
                periodCovered:
                  startDate: '2024-01-01'
                  endDate: '2024-06-30'
                overallComplianceScore: 92
                summary: >-
                  Overall high compliance across all transaction types. Minor
                  areas for improvement identified in expense reporting related
                  to receipt documentation.
                findings:
                  - type: recommendation
                    severity: Low
                    description: >-
                      Several small transactions lacked complete receipt
                      documentation in the expense management system.
                    relatedEntities:
                      - txn_abc123
                      - txn_def456
                  - type: observation
                    severity: Low
                    description: >-
                      Automated sanction screening system shows 99.8% coverage,
                      with 0.2% requiring manual review.
                recommendedActions:
                  - id: insight-receipt-compliance-004
                    title: Improve Receipt Submission Compliance
                    description: >-
                      Implement automated reminders for employees to upload
                      receipts for all transactions above $20.
                    category: compliance
                    severity: low
                    actionableRecommendation: Configure expense system rules.
                    timestamp: '2024-07-22T19:05:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - corporate
        - compliance
        - audits
        - '{auditId}'
        - report
      description: Retrieves the full report generated by an AI-driven compliance audit.
    parameters:
      - name: auditId
        in: path
        required: true
        description: Unique identifier for the compliance audit.
        schema:
          type: string
        example: audit_corp_xyz789
  /corporate/compliance/audits:
    post:
      summary: Request an AI-Driven Compliance Audit Report
      responses:
        '202':
          description: >-
            Compliance audit initiated. An audit ID is returned to check the
            status and retrieve the report.
          content:
            application/json:
              schema:
                type: object
                properties: {}
              example:
                auditId: audit_corp_xyz789
                status: processing
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - corporate
        - compliance
        - audits
      description: >-
        Initiates an AI-powered compliance audit for a specific period or scope,
        generating a comprehensive report detailing adherence to regulatory
        frameworks, internal policies, and flagging potential risks.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties: {}
              required:
                - auditScope
                - endDate
                - regulatoryFrameworks
                - startDate
            example:
              auditScope: all_transactions
              startDate: '2024-01-01'
              endDate: '2024-06-30'
              regulatoryFrameworks:
                - AML
                - PCI-DSS
  /corporate/sanction-screening:
    post:
      summary: Perform Real-time Sanction Screening
      responses:
        '200':
          description: Clear screening result
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - matchDetails
                  - matchFound
                  - screeningId
                  - screeningTimestamp
                  - status
              example:
                screeningId: screen_xyz456
                matchFound: false
                matchDetails: []
                screeningTimestamp: '2024-07-22T19:30:00Z'
                status: clear
        '400':
          description: Common bad request error
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Invalid or missing authentication credentials
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: Insufficient permissions
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - corporate
        - sanction-screening
      description: >-
        Executes a real-time screening of an individual or entity against global
        sanction lists and watchlists.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                address:
                  type: object
                  properties: {}
              required:
                - country
                - entityType
                - name
            example:
              name: John Doe
              country: US
              dateOfBirth: '1970-01-01'
              entityType: individual
  /corporate/treasury/cash-flow/forecast:
    get:
      summary: Get AI-Driven Corporate Cash Flow Forecast
      parameters:
        - name: forecastHorizonDays
          in: query
          description: >-
            The number of days into the future for which to generate the cash
            flow forecast (e.g., 30, 90, 180).
          schema:
            type: integer
          example: '90'
        - name: includeScenarioAnalysis
          in: query
          description: >-
            If true, the forecast will include best-case and worst-case scenario
            analysis alongside the most likely projection.
          schema:
            type: boolean
          example: 'true'
      responses:
        '200':
          description: A comprehensive AI-driven cash flow forecast report.
          content:
            application/json:
              schema:
                type: object
                properties:
                  inflowForecast:
                    type: object
                    description: Forecast of cash inflows by source.
                    properties: {}
                  outflowForecast:
                    type: object
                    description: Forecast of cash outflows by category.
                    properties: {}
                required:
                  - aiRecommendations
                  - currency
                  - forecastId
                  - inflowForecast
                  - liquidityRiskScore
                  - outflowForecast
                  - overallStatus
                  - period
                  - projectedBalances
              example:
                forecastId: cf_forecast_corp_Q3_2024
                period: Q3 2024 (July - September)
                currency: USD
                overallStatus: positive_outlook
                projectedBalances:
                  - date: '2024-07-31'
                    projectedCash: 1500000
                    scenario: most_likely
                  - date: '2024-08-31'
                    projectedCash: 1750000
                    scenario: most_likely
                  - date: '2024-07-31'
                    projectedCash: 1400000
                    scenario: worst_case
                  - date: '2024-07-31'
                    projectedCash: 1600000
                    scenario: best_case
                inflowForecast:
                  totalProjected: 3000000
                  bySource:
                    - source: Client Payments
                      amount: 2500000
                    - source: Investment Returns
                      amount: 500000
                outflowForecast:
                  totalProjected: 2000000
                  byCategory:
                    - category: Payroll
                      amount: 1000000
                    - category: Operating Expenses
                      amount: 700000
                liquidityRiskScore: 15
                aiRecommendations:
                  - id: insight-cash-optimization-001
                    title: Optimize Short-Term Investments
                    description: >-
                      With a strong positive cash flow outlook, consider
                      allocating surplus funds to short-term, low-risk
                      investments to maximize returns.
                    category: corporate_treasury
                    severity: low
                    actionableRecommendation: >-
                      Consult with treasury manager to explore investment
                      options.
                    timestamp: '2024-07-22T19:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - corporate
        - treasury
        - cash-flow
        - forecast
      description: >-
        Retrieves an advanced AI-driven cash flow forecast for the organization,
        projecting liquidity, identifying potential surpluses or deficits, and
        providing recommendations for optimal treasury management.
  /corporate/treasury/liquidity-positions:
    get:
      summary: Get Real-time Corporate Liquidity Positions
      responses:
        '200':
          description: Real-time liquidity positions.
          content:
            application/json:
              schema:
                type: object
                properties:
                  shortTermInvestments:
                    type: object
                    description: >-
                      Details on short-term investments contributing to
                      liquidity.
                    properties: {}
                  aiLiquidityAssessment:
                    type: object
                    description: AI's overall assessment of liquidity.
                    properties: {}
                required:
                  - accountTypeBreakdown
                  - aiLiquidityAssessment
                  - aiRecommendations
                  - currencyBreakdown
                  - shortTermInvestments
                  - snapshotTime
                  - totalLiquidAssets
              example:
                snapshotTime: '2024-07-22T18:30:00Z'
                totalLiquidAssets: 5200000
                currencyBreakdown:
                  - currency: USD
                    amount: 4000000
                    percentage: 76.9
                  - currency: EUR
                    amount: 1000000
                    percentage: 19.2
                  - currency: GBP
                    amount: 200000
                    percentage: 3.9
                accountTypeBreakdown:
                  - type: Checking
                    amount: 3500000
                  - type: Savings
                    amount: 500000
                  - type: Money Market
                    amount: 1200000
                shortTermInvestments:
                  totalValue: 1200000
                  maturingNext30Days: 300000
                aiLiquidityAssessment:
                  status: optimal
                  message: >-
                    Current liquidity is optimal and sufficient for all
                    short-term obligations and planned expenditures. High
                    flexibility for strategic investments.
                aiRecommendations:
                  - id: insight-investment-strategy-002
                    title: Review Mid-Term Investment Strategy
                    description: >-
                      Given the robust liquidity, consider reviewing
                      opportunities for mid-term strategic investments to
                      enhance capital growth without compromising short-term
                      operational needs.
                    category: corporate_treasury
                    severity: low
                    actionableRecommendation: Schedule meeting with investment committee.
                    timestamp: '2024-07-22T18:40:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - corporate
        - treasury
        - liquidity-positions
      description: >-
        Provides a real-time overview of the organization's liquidity across all
        accounts, currencies, and short-term investments.
  /corporate/risk/fraud/rules/{ruleId}:
    put:
      summary: Update an AI-Powered Fraud Detection Rule
      responses:
        '200':
          description: Fraud detection rule updated successfully.
          content:
            application/json:
              schema:
                type: object
                properties:
                  criteria:
                    type: object
                    description: Criteria that define when a fraud rule should trigger.
                    properties: {}
                  action:
                    type: object
                    description: Action to take when a fraud rule is triggered.
                    properties: {}
                    required:
                      - details
                      - type
                required:
                  - action
                  - createdAt
                  - createdBy
                  - criteria
                  - description
                  - id
                  - lastUpdated
                  - name
                  - severity
                  - status
              example:
                id: fraud_rule_high_value_inactive
                name: High Value Transaction from Inactive Account
                description: >-
                  Flags transactions over a certain threshold from accounts that
                  have been inactive for a specified period.
                status: inactive
                severity: High
                criteria:
                  transactionAmountMin: 7500
                  accountInactivityDays: 60
                  transactionType: debit
                  countryOfOrigin:
                    - US
                    - CA
                action:
                  type: flag
                  details: Flag for manual review only, do not block.
                createdBy: system:ai-risk-engine
                createdAt: '2024-05-01T10:00:00Z'
                lastUpdated: '2024-07-22T20:15:00Z'
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - corporate
        - risk
        - fraud
        - rules
        - '{ruleId}'
      description: >-
        Updates an existing custom AI-powered fraud detection rule, modifying
        its criteria, actions, or status.
      requestBody:
        content:
          application/json:
            schema:
              description: Fields that can be updated for an existing fraud detection rule.
              type: object
              properties:
                criteria:
                  type: object
                  description: Criteria that define when a fraud rule should trigger.
                  properties: {}
                action:
                  type: object
                  description: Action to take when a fraud rule is triggered.
                  properties: {}
                  required:
                    - details
                    - type
            example:
              status: inactive
              criteria:
                transactionAmountMin: 7500
                accountInactivityDays: 60
              action:
                type: flag
                details: Flag for manual review only, do not block.
    parameters:
      - name: ruleId
        in: path
        required: true
        description: Unique identifier for the fraud detection rule.
        schema:
          type: string
        example: fraud_rule_high_value_inactive
  /corporate/risk/fraud/rules:
    get:
      summary: List AI-Powered Fraud Detection Rules
      parameters:
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
      responses:
        '200':
          description: A paginated list of fraud detection rules.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 2
                data:
                  - id: fraud_rule_high_value_inactive
                    name: High Value Transaction from Inactive Account
                    description: >-
                      Flags transactions over a certain threshold from accounts
                      that have been inactive for a specified period.
                    status: active
                    severity: High
                    criteria:
                      transactionAmountMin: 5000
                      accountInactivityDays: 90
                      transactionType: debit
                      countryOfOrigin:
                        - US
                        - CA
                    action:
                      type: block
                      details: Block transaction and send critical alert to fraud team.
                    createdBy: system:ai-risk-engine
                    createdAt: '2024-05-01T10:00:00Z'
                    lastUpdated: '2024-07-20T11:30:00Z'
                  - id: fraud_rule_suspicious_geo
                    name: Suspicious Geolocation Mismatch
                    description: >-
                      Detects transactions originating from a geolocation
                      significantly different from recent login activity without
                      prior travel notification.
                    status: active
                    severity: Critical
                    criteria:
                      geographicDistanceKm: 5000
                      lastLoginDays: 7
                      noTravelNotification: true
                    action:
                      type: alert
                      details: >-
                        Send immediate MFA challenge to user and flag for
                        review.
                    createdBy: system:ai-risk-engine
                    createdAt: '2024-06-10T09:00:00Z'
                    lastUpdated: '2024-07-01T10:00:00Z'
                nextOffset: 2
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - corporate
        - risk
        - fraud
        - rules
      description: >-
        Retrieves a list of AI-powered fraud detection rules currently active
        for the organization, including their parameters, thresholds, and
        associated actions (e.g., flag, block, alert).
  /web3/wallets/{walletId}/balances:
    get:
      summary: Get Crypto Asset Balances for a Wallet
      parameters:
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
      responses:
        '200':
          description: A paginated list of crypto asset balances.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 3
                offset: 0
                total: 3
                data:
                  - assetSymbol: ETH
                    assetName: Ethereum
                    balance: 2.5
                    usdValue: 7500
                    contractAddress: 0x...
                  - assetSymbol: USDC
                    assetName: USD Coin
                    balance: 1000
                    usdValue: 1000
                    contractAddress: 0x...
                  - assetSymbol: LINK
                    assetName: Chainlink
                    balance: 50
                    usdValue: 700
                    contractAddress: 0x...
                nextOffset: 3
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - web3
        - wallets
        - '{walletId}'
        - balances
      description: >-
        Retrieves the current balances of all recognized crypto assets within a
        specific connected wallet.
    parameters:
      - name: walletId
        in: path
        required: true
        description: Unique identifier for the crypto wallet connection.
        schema:
          type: string
        example: wallet_conn_eth_0xabc123
  /web3/wallets:
    get:
      summary: List Connected Crypto Wallets
      parameters:
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
      responses:
        '200':
          description: A paginated list of connected cryptocurrency wallets.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 2
                data:
                  - id: wallet_conn_eth_0xabc123
                    walletProvider: MetaMask
                    walletAddress: '0x25a6f8b7C4dC6f5F3E7A3D7E8C9B0A1B2C3D4E5F'
                    blockchainNetwork: Ethereum
                    status: connected
                    lastSynced: '2024-07-22T13:00:00Z'
                    readAccessGranted: true
                    writeAccessGranted: false
                  - id: wallet_conn_sol_0xdef456
                    walletProvider: Phantom
                    walletAddress: '0x2A1B3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0B'
                    blockchainNetwork: Solana
                    status: connected
                    lastSynced: '2024-07-22T12:45:00Z'
                    readAccessGranted: true
                    writeAccessGranted: false
                nextOffset: 2
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - web3
        - wallets
      description: >-
        Retrieves a list of all securely linked cryptocurrency wallets (e.g.,
        MetaMask, Ledger integration), showing their addresses, associated
        networks, and verification status.
    post:
      summary: Connect a New Crypto Wallet
      responses:
        '201':
          description: Wallet connection initiated or confirmed successfully.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - blockchainNetwork
                  - id
                  - lastSynced
                  - readAccessGranted
                  - status
                  - walletAddress
                  - walletProvider
                  - writeAccessGranted
              example:
                id: wallet_conn_eth_0x123abc
                walletProvider: MetaMask
                walletAddress: '0x123abc456def7890123abc456def7890123abc456def'
                blockchainNetwork: Ethereum
                status: connected
                lastSynced: '2024-07-22T20:00:00Z'
                readAccessGranted: true
                writeAccessGranted: false
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '409':
          description: >-
            The request could not be completed due to a conflict with the
            current state of the resource (e.g., duplicate entry, expired
            state).
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: RESOURCE_CONFLICT
                message: >-
                  A resource with this identifier already exists or the
                  operation conflicts with an existing state.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - web3
        - wallets
      description: >-
        Initiates the process to securely connect a new cryptocurrency wallet to
        the user's  profile, typically involving a signed message or OAuth flow
        from the wallet provider.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties: {}
              required:
                - blockchainNetwork
                - signedMessage
                - walletAddress
                - walletProvider
            example:
              walletAddress: 0x123abc456def7890...
              walletProvider: MetaMask
              signedMessage: >-
                0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890
              blockchainNetwork: Ethereum
  /web3/nfts:
    get:
      summary: Retrieve User's NFT Collection
      parameters:
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
      responses:
        '200':
          description: A paginated list of the user's NFT assets.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 2
                data:
                  - id: nft_bored_ape_yacht_club_1234
                    collectionName: Bored Ape Yacht Club
                    name: 'Bored Ape #1234'
                    description: >-
                      A unique digital collectible from the Bored Ape Yacht Club
                      series.
                    imageUrl: >-
                      https://opensea.io/assets/ethereum/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/1234
                    blockchainNetwork: Ethereum
                    ownerAddress: '0x25a6f8b7C4dC6f5F3E7A3D7E8C9B0A1B2C3D4E5F'
                    contractAddress: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d'
                    tokenId: '1234'
                    lastSalePriceUSD: 150000
                    estimatedValueUSD: 160000
                    attributes:
                      - trait_type: Background
                        value: Blue
                      - trait_type: Fur
                        value: Brown
                  - id: nft_cryptopunk_5678
                    collectionName: CryptoPunks
                    name: 'CryptoPunk #5678'
                    imageUrl: https://larvalabs.com/cryptopunks/punk5678.png
                    blockchainNetwork: Ethereum
                    ownerAddress: '0x25a6f8b7C4dC6f5F3E7A3D7E8C9B0A1B2C3D4E5F'
                    contractAddress: '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb'
                    tokenId: '5678'
                    lastSalePriceUSD: 200000
                    estimatedValueUSD: 210000
                    attributes:
                      - trait_type: Accessory
                        value: Headband
                nextOffset: 2
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - web3
        - nfts
      description: >-
        Fetches a comprehensive list of Non-Fungible Tokens (NFTs) owned by the
        user across all connected wallets and supported blockchain networks,
        including metadata and market values.
  /web3/transactions/initiate:
    post:
      summary: Initiate a Cryptocurrency Transfer
      responses:
        '202':
          description: Crypto transfer initiated. Awaiting user signature/confirmation.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - status
                  - transferId
              example:
                transferId: crypto_txn_xyz789
                status: pending_signature
                message: Please confirm the transaction in your MetaMask wallet.
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - web3
        - transactions
        - initiate
      description: >-
        Prepares and initiates a cryptocurrency transfer from a connected wallet
        to a specified recipient address. Requires user confirmation (e.g., via
        wallet signature).
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties: {}
              required:
                - amount
                - assetSymbol
                - blockchainNetwork
                - recipientAddress
                - sourceWalletId
            example:
              sourceWalletId: wallet_conn_eth_0xabc123
              recipientAddress: '0xdef4567890abcdef1234567890abcdef1234567890'
              amount: 0.1
              assetSymbol: ETH
              blockchainNetwork: Ethereum
              gasPriceGwei: 50
              memo: Payment for services
  /payments/fx/rates:
    get:
      summary: Get Real-time & Predictive Foreign Exchange Rates
      parameters:
        - name: baseCurrency
          in: query
          description: The base currency code (e.g., USD).
          schema:
            type: string
          example: USD
        - name: targetCurrency
          in: query
          description: The target currency code (e.g., EUR).
          schema:
            type: string
          example: EUR
        - name: forecastDays
          in: query
          description: Number of days into the future to provide an AI-driven prediction.
          schema:
            type: integer
          example: '7'
      responses:
        '200':
          description: Real-time and predictive foreign exchange rates.
          content:
            application/json:
              schema:
                type: object
                properties:
                  currentRate:
                    type: object
                    description: Real-time foreign exchange rates.
                    properties: {}
                  historicalVolatility:
                    type: object
                    properties: {}
                required:
                  - baseCurrency
                  - currentRate
                  - targetCurrency
              example:
                baseCurrency: USD
                targetCurrency: EUR
                currentRate:
                  bid: 0.9025
                  ask: 0.9035
                  mid: 0.903
                  timestamp: '2024-07-22T13:30:00Z'
                predictiveRates:
                  - date: '2024-07-29'
                    predictedMidRate: 0.905
                    confidenceIntervalLower: 0.901
                    confidenceIntervalUpper: 0.909
                    aiModelConfidence: 0.88
                  - date: '2024-08-05'
                    predictedMidRate: 0.9065
                    confidenceIntervalLower: 0.902
                    confidenceIntervalUpper: 0.911
                    aiModelConfidence: 0.85
                historicalVolatility:
                  past7Days: 0.005
                  past30Days: 0.012
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - payments
        - fx
        - rates
      description: >-
        Retrieves current and AI-predicted future foreign exchange rates for a
        specified currency pair, including bid/ask spreads and historical
        volatility data for informed decisions.
  /payments/fx/convert:
    post:
      summary: Initiate a Currency Conversion
      responses:
        '200':
          description: Currency conversion completed successfully.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - conversionId
                  - conversionTimestamp
                  - fxRateApplied
                  - sourceAmount
                  - sourceCurrency
                  - status
                  - targetAmount
              example:
                conversionId: fx_conv_abc123
                status: completed
                sourceAmount: 1000
                sourceCurrency: USD
                targetAmount: 920.5
                fxRateApplied: 0.9205
                feesApplied: 5
                conversionTimestamp: '2024-07-22T13:45:00Z'
                transactionId: txn_fx_conv_abc123-20240722
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - payments
        - fx
        - convert
      description: >-
        Executes an instant currency conversion between two currencies, either
        from a balance or into a specified account.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties: {}
              required:
                - sourceAccountId
                - sourceAmount
                - sourceCurrency
                - targetCurrency
            example:
              sourceAccountId: acc_chase_checking_4567
              targetAccountId: acc_euro_savings_9876
              sourceAmount: 1000
              sourceCurrency: USD
              targetCurrency: EUR
              fxRateLock: true
  /sustainability/carbon-footprint:
    get:
      summary: Retrieve Personal Carbon Footprint Report
      responses:
        '200':
          description: A comprehensive personal carbon footprint report.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - aiInsights
                  - breakdownByCategory
                  - period
                  - reportId
                  - totalCarbonFootprintKgCO2e
              example:
                reportId: cf_report_2024-Q2
                period: April - June 2024
                totalCarbonFootprintKgCO2e: 1250.7
                breakdownByCategory:
                  - category: Transportation
                    carbonFootprintKgCO2e: 450.2
                    percentage: 36
                  - category: Food
                    carbonFootprintKgCO2e: 300.5
                    percentage: 24
                  - category: Housing
                    carbonFootprintKgCO2e: 250
                    percentage: 20
                aiInsights:
                  - id: insight-transport-carbon-001
                    title: Reduce Commute Carbon
                    description: >-
                      Your daily commute contributes significantly to your
                      carbon footprint. Consider carpooling or public transport.
                    category: sustainability
                    severity: medium
                    actionableRecommendation: Explore green commuting options.
                    timestamp: '2024-07-22T16:00:00Z'
                offsetRecommendations:
                  - project: Amazon Reforestation Project
                    costPerTonUSD: 25
                    offsetAmountKgCO2e: 1250.7
                    totalCostUSD: 31.27
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - sustainability
        - carbon-footprint
      description: >-
        Generates a detailed report of the user's estimated carbon footprint
        based on transaction data, lifestyle choices, and AI-driven impact
        assessments, offering insights and reduction strategies.
  /sustainability/investments/impact:
    get:
      summary: Analyze ESG Impact of Investment Portfolio
      responses:
        '200':
          description: An analysis of the ESG impact of the investment portfolio.
          content:
            application/json:
              schema:
                type: object
                properties:
                  breakdownByESGFactors:
                    type: object
                    description: >-
                      Breakdown of the portfolio's ESG score by individual
                      factors.
                    properties: {}
                required:
                  - aiRecommendations
                  - benchmarkESGScore
                  - breakdownByESGFactors
                  - lowestESGHoldings
                  - overallESGScore
                  - portfolioId
                  - topESGHoldings
              example:
                portfolioId: portfolio_equity_growth
                overallESGScore: 7.8
                benchmarkESGScore: 6.5
                breakdownByESGFactors:
                  environmentalScore: 7
                  socialScore: 8.5
                  governanceScore: 8
                topESGHoldings:
                  - assetSymbol: TSLA
                    assetName: Tesla Inc.
                    esgScore: 9.1
                  - assetSymbol: MSFT
                    assetName: Microsoft Corp.
                    esgScore: 8.9
                lowestESGHoldings:
                  - assetSymbol: XOM
                    assetName: ExxonMobil Corp.
                    esgScore: 4.5
                  - assetSymbol: BAC
                    assetName: Bank of America
                    esgScore: 6
                aiRecommendations:
                  - id: insight-esg-diversify-002
                    title: Enhance ESG Diversification
                    description: >-
                      Your portfolio has a strong ESG profile, but could be
                      further improved by reducing exposure to companies with
                      lower ESG scores in the energy sector.
                    category: sustainability
                    severity: low
                    actionableRecommendation: Explore alternative energy ETFs or green bonds.
                    timestamp: '2024-07-22T16:15:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - sustainability
        - investments
        - impact
      description: >-
        Provides an AI-driven analysis of the Environmental, Social, and
        Governance (ESG) impact of the user's entire investment portfolio,
        benchmarking against industry standards and suggesting more sustainable
        alternatives.
  /sustainability/carbon-offsets:
    post:
      summary: Purchase Carbon Offsets
      responses:
        '200':
          description: Carbon offsets purchased successfully.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - amountOffsetKgCO2e
                  - purchaseDate
                  - purchaseId
                  - totalCostUSD
              example:
                purchaseId: co_purchase_xyz123
                amountOffsetKgCO2e: 500
                totalCostUSD: 12.5
                projectSupported: Verified Carbon Standard Project X
                transactionId: txn_offset_12345
                purchaseDate: '2024-07-22T14:00:00Z'
                certificateUrl: https://demobank.com/certificates/co_purchase_xyz123.pdf
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - sustainability
        - carbon-offsets
      description: >-
        Allows users to purchase carbon offsets to neutralize their estimated
        carbon footprint, supporting environmental initiatives.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties: {}
              required:
                - amountKgCO2e
                - offsetProject
                - paymentAccountId
            example:
              amountKgCO2e: 500
              paymentAccountId: acc_chase_checking_4567
              offsetProject: Verified Carbon Standard Project X
  /lending/applications/{applicationId}:
    get:
      summary: Get Loan Application Status & Details
      responses:
        '200':
          description: Loan application approved with offer details
          content:
            application/json:
              schema:
                type: object
                properties:
                  aiUnderwritingResult:
                    type: object
                    properties: {}
                    required:
                      - aiConfidence
                      - decision
                      - reason
                  offerDetails:
                    type: object
                    properties: {}
                    required:
                      - amount
                      - expirationDate
                      - interestRate
                      - isPreApproved
                      - offerId
                      - offerType
                required:
                  - applicationDate
                  - applicationId
                  - loanAmountRequested
                  - loanPurpose
                  - nextSteps
                  - status
              example:
                applicationId: loan_app_creditflow-123
                status: approved
                loanAmountRequested: 10000
                loanPurpose: home_improvement
                applicationDate: '2024-07-22T15:00:00Z'
                aiUnderwritingResult:
                  decision: approved
                  reason: Strong credit score and consistent income history.
                  recommendedInterestRate: 6.5
                  maxApprovedAmount: 12000
                  aiConfidence: 0.95
                offerDetails:
                  offerId: offer_pers_loan_001
                  offerType: personal_loan
                  amount: 10000
                  interestRate: 6.5
                  repaymentTermMonths: 36
                  monthlyPayment: 306.45
                  originationFee: 150
                  totalRepayable: 11032.2
                  expirationDate: '2024-08-31'
                  isPreApproved: false
                  aiPersonalizationScore: 0.9
                nextSteps: >-
                  Review your offer details and accept the loan to proceed with
                  funding.
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - lending
        - applications
        - '{applicationId}'
      description: >-
        Retrieves the current status and detailed information for a submitted
        loan application, including AI underwriting outcomes, approved terms,
        and next steps.
    parameters:
      - name: applicationId
        in: path
        required: true
        description: Unique identifier for the loan application.
        schema:
          type: string
        example: loan_app_creditflow-123
  /lending/offers/pre-approved:
    get:
      summary: Get Pre-Approved Loan Offers
      parameters:
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
      responses:
        '200':
          description: A paginated list of pre-approved loan offers.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 2
                data:
                  - offerId: offer_pre_app_001
                    offerType: personal_loan
                    amount: 15000
                    interestRate: 4.5
                    repaymentTermMonths: 60
                    monthlyPayment: 280
                    originationFee: 0
                    totalRepayable: 16800
                    expirationDate: '2024-08-31'
                    isPreApproved: true
                    aiPersonalizationScore: 0.95
                  - offerId: offer_pre_app_002
                    offerType: credit_line
                    amount: 5000
                    interestRate: 8.99
                    originationFee: 50
                    expirationDate: '2024-09-15'
                    isPreApproved: true
                    aiPersonalizationScore: 0.88
                nextOffset: 2
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - lending
        - offers
        - pre-approved
      description: >-
        Retrieves a list of personalized, pre-approved loan offers generated by
        the AI based on the user's financial profile and credit health.
  /developers/webhooks/{subscriptionId}:
    put:
      summary: Update Webhook Subscription
      responses:
        '200':
          description: Example of an updated webhook subscription
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - callbackUrl
                  - createdAt
                  - events
                  - id
                  - status
              example:
                id: whsub_devtool_finance_events
                callbackUrl: https://my-new-app.com/webhooks/demobank-events
                events:
                  - transaction.created
                  - user.login_failed
                status: active
                lastTriggered: '2024-07-22T17:00:00Z'
                failureCount: 0
        '400':
          description: Common bad request error
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Invalid or missing authentication credentials
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: Insufficient permissions
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: Resource not found error
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - developers
        - webhooks
        - '{subscriptionId}'
      description: >-
        Modifies an existing webhook subscription, allowing changes to the
        callback URL, subscribed events, or activation status.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties: {}
            example:
              status: paused
    parameters:
      - name: subscriptionId
        in: path
        required: true
        description: Unique identifier for the webhook subscription.
        schema:
          type: string
        example: whsub_devtool_finance_events
    delete:
      summary: Delete Webhook Subscription
      responses:
        '204':
          description: Webhook subscription deleted successfully.
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - developers
        - webhooks
        - '{subscriptionId}'
      description: >-
        Deletes an existing webhook subscription, stopping all future event
        notifications to the specified callback URL.
  /developers/webhooks:
    get:
      summary: List Webhook Subscriptions
      parameters:
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
      responses:
        '200':
          description: A paginated list of active webhook subscriptions.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 2
                data:
                  - id: whsub_devtool_finance_events
                    callbackUrl: https://my-app.com/webhooks/demobank-events
                    events:
                      - transaction.created
                      - account.updated
                      - user.login_failed
                    status: active
                    lastTriggered: '2024-07-22T17:00:00Z'
                    failureCount: 0
                  - id: whsub_alert_system
                    callbackUrl: https://alert-system.com/demobank-alerts
                    events:
                      - security.critical_alert
                    status: paused
                    lastTriggered: '2024-07-20T08:00:00Z'
                    failureCount: 2
                nextOffset: 2
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - developers
        - webhooks
      description: >-
        Retrieves a list of all active webhook subscriptions for the
        authenticated developer application, detailing endpoint URLs, subscribed
        events, and current status.
  /developers/api-keys/{keyId}:
    delete:
      summary: Revoke a Developer API Key
      responses:
        '204':
          description: API key revoked successfully.
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - developers
        - api-keys
        - '{keyId}'
      description: Revokes an existing API key, disabling its access immediately.
    parameters:
      - name: keyId
        in: path
        required: true
        description: Unique identifier for the API key.
        schema:
          type: string
        example: api_key_dev_app_01
  /developers/api-keys:
    get:
      summary: List Developer API Keys
      parameters:
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
      responses:
        '200':
          description: A paginated list of API keys.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 2
                data:
                  - id: api_key_dev_app_01
                    prefix: db_pk_test_
                    status: active
                    createdAt: '2024-01-01T10:00:00Z'
                    expiresAt: '2025-01-01T10:00:00Z'
                    scopes:
                      - read:accounts
                      - write:payments
                    lastUsed: '2024-07-22T17:15:00Z'
                  - id: api_key_webhook_validator
                    prefix: db_sk_prod_
                    status: active
                    createdAt: '2023-05-01T11:00:00Z'
                    scopes:
                      - webhook:events
                    lastUsed: '2024-07-22T17:30:00Z'
                nextOffset: 2
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - developers
        - api-keys
      description: >-
        Retrieves a list of API keys issued to the authenticated developer
        application.
    post:
      summary: Create a New Developer API Key
      responses:
        '201':
          description: API key created successfully.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - createdAt
                  - id
                  - prefix
                  - scopes
                  - status
              example:
                id: api_key_analytics_service
                prefix: db_pk_test_
                status: active
                createdAt: '2024-07-22T18:00:00Z'
                expiresAt: '2024-10-20T18:00:00Z'
                scopes:
                  - read:accounts
                  - read:transactions
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - developers
        - api-keys
      description: >-
        Generates a new API key for the developer application with specified
        scopes and an optional expiration.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties: {}
              required:
                - name
                - scopes
            example:
              name: My Analytics Service Key
              scopes:
                - read:accounts
                - read:transactions
              expiresInDays: 90
  /identity/kyc/status:
    get:
      summary: Get Current KYC Verification Status
      responses:
        '200':
          description: 'KYC status: verified (Gold tier)'
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - lastSubmissionDate
                  - overallStatus
                  - requiredActions
                  - userId
              example:
                userId: user-quantum-visionary-001
                overallStatus: verified
                lastSubmissionDate: '2024-07-21T18:00:00Z'
                requiredActions: []
                verifiedTier: gold
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - identity
        - kyc
        - status
      description: >-
        Retrieves the current status of the user's Know Your Customer (KYC)
        verification process.
  /goals/{goalId}:
    get:
      summary: Get Detailed Financial Goal
      responses:
        '200':
          description: Detailed financial goal information.
          content:
            application/json:
              schema:
                type: object
                properties:
                  aiStrategicPlan:
                    type: object
                    description: AI-generated strategic plan for achieving the goal.
                    properties: {}
                required:
                  - currentAmount
                  - id
                  - lastUpdated
                  - name
                  - progressPercentage
                  - status
                  - targetAmount
                  - targetDate
                  - type
              example:
                id: goal_retirement_2050
                name: Retirement Fund by 2050
                type: retirement
                targetAmount: 1000000
                currentAmount: 350000
                targetDate: '2050-12-31'
                progressPercentage: 35
                status: on_track
                contributingAccounts:
                  - acc_chase_invest_ira_001
                  - acc_fidelity_401k_xyz
                lastUpdated: '2024-07-22T19:00:00Z'
                riskTolerance: medium
                aiStrategicPlan:
                  planId: plan_retirement_2050
                  summary: >-
                    The AI projects you are on track to reach your retirement
                    goal, but recommends increasing annual contributions by 5%
                    to account for potential market volatility.
                  steps:
                    - title: Increase 401k Contributions
                      description: >-
                        Adjust your 401k contributions to 12% of your salary by
                        year-end.
                      status: in_progress
                    - title: Review Portfolio Asset Allocation
                      description: >-
                        Ensure your investment portfolio remains diversified
                        according to your medium risk tolerance.
                      status: pending
                aiInsights:
                  - id: insight-retirement-track-001
                    title: Retirement Goal On Track
                    description: >-
                      Your retirement savings are progressing as expected, but a
                      slight increase in contributions would provide a larger
                      buffer against market fluctuations.
                    category: financial_goals
                    severity: low
                    actionableRecommendation: Adjust savings plan via the 'Quantum Planner'.
                    timestamp: '2024-07-22T19:35:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - goals
        - '{goalId}'
      description: >-
        Retrieves detailed information for a specific financial goal, including
        current progress, AI strategic plan, and related insights.
    parameters:
      - name: goalId
        in: path
        required: true
        description: Unique identifier for the financial goal.
        schema:
          type: string
        example: goal_retirement_2050
    put:
      summary: Update an Existing Financial Goal
      responses:
        '200':
          description: Example of an updated financial goal
          content:
            application/json:
              schema:
                type: object
                properties:
                  aiStrategicPlan:
                    type: object
                    description: AI-generated strategic plan for achieving the goal.
                    properties: {}
                required:
                  - currentAmount
                  - id
                  - lastUpdated
                  - name
                  - progressPercentage
                  - status
                  - targetAmount
                  - targetDate
                  - type
              example:
                id: goal_retirement_2050
                name: Retirement Fund by 2050
                type: retirement
                targetAmount: 1200000
                currentAmount: 350000
                targetDate: '2050-12-31'
                progressPercentage: 29.17
                status: behind_schedule
                contributingAccounts:
                  - acc_chase_invest_ira_001
                  - acc_fidelity_401k_xyz
                lastUpdated: '2024-07-22T19:45:00Z'
                riskTolerance: medium
                aiStrategicPlan:
                  planId: plan_retirement_2050_recalc
                  summary: >-
                    Due to the increased target, the AI recommends a more
                    aggressive savings rate or adjusting investment strategy.
                  steps:
                    - title: Increase 401k Contributions
                      description: >-
                        Adjust your 401k contributions to 15% of your salary
                        immediately.
                      status: pending
                    - title: Evaluate Higher-Growth Investments
                      description: >-
                        Review opportunities for higher-growth investments if
                        your risk tolerance allows.
                      status: pending
        '400':
          description: Common bad request error
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Invalid or missing authentication credentials
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: Insufficient permissions
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: Resource not found error
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - goals
        - '{goalId}'
      description: >-
        Updates the parameters of an existing financial goal, such as target
        amount, date, or contributing accounts. This may trigger an AI plan
        recalculation.
      requestBody:
        content:
          application/json:
            schema:
              description: Fields that can be updated for an existing financial goal.
              type: object
              properties: {}
            example:
              targetAmount: 1200000
              generateAIPlan: true
    delete:
      summary: Delete a Financial Goal
      responses:
        '204':
          description: Financial goal deleted successfully.
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - goals
        - '{goalId}'
      description: Deletes a specific financial goal from the user's profile.
  /goals:
    get:
      summary: List All User Financial Goals
      parameters:
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
      responses:
        '200':
          description: A paginated list of financial goals.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 2
                data:
                  - id: goal_retirement_2050
                    name: Retirement Fund by 2050
                    type: retirement
                    targetAmount: 1000000
                    currentAmount: 350000
                    targetDate: '2050-12-31'
                    progressPercentage: 35
                    status: on_track
                    contributingAccounts:
                      - acc_chase_invest_ira_001
                      - acc_fidelity_401k_xyz
                    lastUpdated: '2024-07-22T19:00:00Z'
                    riskTolerance: medium
                  - id: goal_home_purchase_2030
                    name: Down Payment for New Home
                    type: home_purchase
                    targetAmount: 100000
                    currentAmount: 25000
                    targetDate: '2030-06-30'
                    progressPercentage: 25
                    status: behind_schedule
                    contributingAccounts:
                      - acc_savings_001
                    lastUpdated: '2024-07-22T19:00:00Z'
                    riskTolerance: low
                nextOffset: 2
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - goals
      description: >-
        Retrieves a list of all financial goals defined by the user, including
        their progress and associated AI plans.
  /notifications/me:
    get:
      summary: List User Notifications
      parameters:
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
        - name: status
          in: query
          description: Filter notifications by their read status.
          schema:
            type: string
          example: unread
        - name: severity
          in: query
          description: Filter notifications by AI-assigned severity level.
          schema:
            type: string
          example: high
      responses:
        '200':
          description: A paginated list of user notifications.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 3
                data:
                  - id: notif_security_alert_001
                    type: security
                    title: Suspicious Login Detected
                    message: >-
                      A login attempt was made from an unrecognized
                      device/location. Please review your recent activity.
                    severity: critical
                    timestamp: '2024-07-22T20:00:00Z'
                    read: false
                    actionableLink: /users/me/security-log
                  - id: notif_budget_alert_002
                    type: financial_insight
                    title: Dining Budget Near Limit
                    message: >-
                      You've spent 85% of your dining budget for the month.
                      Consider adjusting your spending.
                    severity: medium
                    timestamp: '2024-07-22T15:30:00Z'
                    read: false
                    actionableLink: /budgets/monthly_aug
                    aiInsightId: insight-dining-overspend-002
                nextOffset: 2
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - notifications
        - me
      description: >-
        Retrieves a paginated list of personalized notifications and proactive
        AI alerts for the authenticated user, allowing filtering by status and
        severity.
  /notifications/{notificationId}/mark-read:
    post:
      summary: Mark a Notification as Read
      responses:
        '200':
          description: Notification marked as read successfully.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - id
                  - message
                  - read
                  - severity
                  - timestamp
                  - title
                  - type
              example:
                id: notif_budget_alert_002
                type: financial_insight
                title: Dining Budget Near Limit
                message: >-
                  You've spent 85% of your dining budget for the month. Consider
                  adjusting your spending.
                severity: medium
                timestamp: '2024-07-22T15:30:00Z'
                read: true
                actionableLink: /budgets/monthly_aug
                aiInsightId: insight-dining-overspend-002
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >

================================================================================
// APPENDED FROM REPO: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | ORIGINAL PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/personal/MarketplaceView.tsx.md
================================================================================

```md
---
# The Agora

This is the Agora. Not a store of goods, but a curated reality of potential tools and alliances. Each item presented is a reflection of your own trajectory, a possibility unearthed by the AI Co-Pilot from the patterns of your life. To enter the marketplace is to be shown not what you might want, but what your journey might require next.

---

### A Fable for the Builder: The Curator

(A traditional marketplace is a noisy, chaotic place. A thousand merchants shouting, each claiming their wares are what you need. It is a game of persuasion, not of truth. We wanted to build a different kind of marketplace. A quiet, thoughtful space. This is the Agora, and its only merchant is a curator who works for you.)

(The AI, Plato, is that curator. It has no wares of its own to sell. Its only goal is to understand you so deeply that it can show you the tools you might need for the next leg of your journey. Its core logic is 'Trajectory-Based Curation.')

(It begins by reading your history, your `transactions`. It sees you have been spending on art supplies, on books about design. It understands that you are on a creative path. It then scours the universe of possible products and services, not for what is popular, not for what is profitable, but for what resonates with the path you are already on. It looks for the tools that a creator might need.)

(The `aiJustification` is the heart of this process. It is the curator, Plato, explaining its reasoning. It is not a sales pitch. It is a quiet conversation. "Because you have shown an interest in visual arts, you might find this high-resolution digital canvas valuable for your work." It is a suggestion born of listening.)

(This turns the act of commerce on its head. It is no longer about being sold to. It is about being understood. The products that appear here are not advertisements. They are possibilities. Echoes of your own expressed interests, reflected back to you in the form of tools that might help you on your way. It is a marketplace where every item on display is, in a sense, a piece of your own unfolding story.)

---
import React, { useState, useEffect, useMemo, useCallback, useRef, createContext, useContext, useReducer, FC, ReactNode, CSSProperties } from 'react';
import { a as animated, useSpring, useTransition, useSprings, useChain } from '@react-spring/web';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { produce } from 'immer';
import { format as formatDate, formatDistanceToNow } from 'date-fns';

//================================================================================================
// 1. TYPE DEFINITIONS & ENUMS
//================================================================================================

export type UUID = string;

export enum Currency {
  USD = 'USD', EUR = 'EUR', GBP = 'GBP', JPY = 'JPY', ETH = 'ETH', BTC = 'BTC',
}

export enum ItemType {
  PhysicalGood = 'PHYSICAL_GOOD', DigitalSoftware = 'DIGITAL_SOFTWARE', Service = 'SERVICE',
  Subscription = 'SUBSCRIPTION', Educational = 'EDUCATIONAL', CommunityAccess = 'COMMUNITY_ACCESS',
  Consulting = 'CONSULTING', APIAccess = 'API_ACCESS',
}

export enum TrajectoryType {
  Creative = 'CREATIVE', Entrepreneurial = 'ENTREPRENEURIAL', Wellness = 'WELLNESS',
  Technical = 'TECHNICAL', Academic = 'ACADEMIC', Social = 'SOCIAL', Financial = 'FINANCIAL',
}

export enum OrderStatus {
    Pending = 'PENDING', Processing = 'PROCESSING', Shipped = 'SHIPPED',
    Delivered = 'DELIVERED', Cancelled = 'CANCELLED',
}

export interface Price {
  amount: number; currency: Currency; isRecurring: boolean;
  recurringInterval?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export interface Vendor {
  id: UUID; name: string; logoUrl: string; rating: number; // 1-5 scale
  bio: string; joinedDate: string; isVerified: boolean;
}

export interface AIJustification {
  short: string; detailed: string;
  basedOn: string[]; // e.g., ["Transaction history", "Recent project 'Odyssey'", "Stated interest in 'philosophy'"]
  confidenceScore: number; // 0-1
}

export interface ReviewSentiment { positive: number; neutral: number; negative: number; }
export interface ReviewTopic { topic: string; mentions: number; sentiment: 'positive' | 'neutral' | 'negative'; }
export interface ReviewAnalysis { overallSentiment: ReviewSentiment; keyTopics: ReviewTopic[]; }

export interface Review {
  id: UUID; author: string; authorAvatar?: string; rating: number; // 1-5 scale
  comment: string; createdAt: string; // ISO 8601
  isHelpfulCount: number; media: { type: 'image' | 'video'; url: string }[];
}

export interface QuestionAndAnswer {
    id: UUID; question: string; questionBy: string; askedAt: string;
    answer?: string; answeredBy?: string; answeredAt?: string;
}

export interface PhysicalGoodDetails { weightKg: number; dimensionsCm: { w: number; h: number; d: number }; }
export interface DigitalSoftwareDetails { version: string; platform: ('windows' | 'mac' | 'linux')[]; license: 'perpetual' | 'subscription'; }
export interface ServiceDetails { durationHours?: number; scope: string; }

export interface MarketplaceItem {
  id: UUID; name: string; tagline: string; description: string; imageUrls: string[];
  type: ItemType; category: string; tags: string[]; price: Price; vendor: Vendor;
  aiJustification: AIJustification; userReviews: Review[]; reviewAnalysis: ReviewAnalysis;
  qAndA: QuestionAndAnswer[]; relatedItems: UUID[]; stock?: number; isFeatured: boolean;
  relevanceScore: number; // Calculated by AI for sorting
  createdAt: string;
  details: PhysicalGoodDetails | DigitalSoftwareDetails | ServiceDetails | null;
  attributes: { name: string; value: string | number }[];
}

export interface UserTransaction {
  id: UUID; date: string; // ISO 8601
  description: string; amount: number; currency: Currency; category: string;
}

export interface UserProject {
  id: UUID; name: string; description: string; relatedTransactions: UUID[];
  startDate: string; // ISO 8601
}

export interface UserTrajectory {
  primaryType: TrajectoryType; secondaryTypes: TrajectoryType[];
  narrative: string; // A short story about the user's path, generated by the AI
  confidence: number; // 0-1
  evidence: string[];
}

export interface UserProfile {
  id: UUID; name: string; email: string; avatarUrl: string; joinedDate: string; // ISO 8601
  transactions: UserTransaction[]; projects: UserProject[];
}

export interface CurationSettings {
  allowTransactionAnalysis: boolean; allowProjectAnalysis: boolean;
  preferredItemTypes: ItemType[]; excludedTags: string[];
  curationAggressiveness: 'conservative' | 'balanced' | 'exploratory';
}

export interface CartItem { itemId: UUID; quantity: number; addedAt: string; }
export interface WishlistItem { itemId: UUID; addedAt: string; }
export type SortOption = 'relevance' | 'price_asc' | 'price_desc' | 'newest' | 'rating';

export interface FilterState {
  searchQuery: string; categories: Set<string>; itemTypes: Set<ItemType>;
  priceRange: [number, number]; ratingRange: [number, number]; showFeaturedOnly: boolean;
}

export type Notification = {
    id: UUID; type: 'success' | 'error' | 'info'; message: string; timestamp: number;
}
export interface ComparisonState { isComparing: boolean; itemIds: UUID[]; }
export type ModalState = 'none' | 'itemDetail' | 'plato' | 'settings' | 'cart';

export type MarketplaceState = {
  isLoading: boolean; error: Error | null; items: MarketplaceItem[]; userProfile: UserProfile | null;
  userTrajectory: UserTrajectory | null; curationSettings: CurationSettings;
  filters: FilterState; sortBy: SortOption;
  pagination: { currentPage: number; itemsPerPage: number; };
  selectedItemId: UUID | null;
  activeModal: ModalState;
  cart: CartItem[]; wishlist: WishlistItem[];
  notifications: Notification[];
  comparison: ComparisonState;
};

export type MarketplaceAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: { items: MarketplaceItem[]; userProfile: UserProfile; userTrajectory: UserTrajectory; } }
  | { type: 'FETCH_ERROR'; payload: Error }
  | { type: 'UPDATE_FILTERS'; payload: Partial<FilterState> }
  | { type: 'UPDATE_SORT'; payload: SortOption }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_MODAL'; payload: { modal: ModalState; itemId?: UUID | null } }
  | { type: 'UPDATE_CURATION_SETTINGS'; payload: Partial<CurationSettings> }
  | { type: 'SUBMIT_FEEDBACK'; payload: { itemId: UUID; feedback: 'helpful' | 'not_relevant' } }
  | { type: 'ADD_TO_CART'; payload: { itemId: UUID; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: { itemId: UUID } }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { itemId: UUID; quantity: number } }
  | { type: 'TOGGLE_WISHLIST_ITEM'; payload: { itemId: UUID } }
  | { type: 'ADD_NOTIFICATION'; payload: { type: 'success' | 'error' | 'info'; message: string } }
  | { type: 'REMOVE_NOTIFICATION'; payload: { id: UUID } }
  | { type: 'START_COMPARISON'; payload: { itemIds: UUID[] } }
  | { type: 'END_COMPARISON' }
  | { type: 'RESET_FILTERS' };

//================================================================================================
// 2. MOCK DATA GENERATION & API SERVICE LAYER
//================================================================================================

const MOCK_DB_DELAY = 600;
const generateUUID = (): UUID => crypto.randomUUID();
const sample = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const createMockVendor = (name: string, logo: string, bio: string): Vendor => ({
  id: generateUUID(), name, logoUrl: `https://api.dicebear.com/7.x/logo/svg?seed=${logo}`,
  rating: 3.5 + Math.random() * 1.5, bio,
  joinedDate: new Date(Date.now() - Math.random() * 365 * 2 * 24 * 60 * 60 * 1000).toISOString(),
  isVerified: Math.random() > 0.3,
});

const VENDORS = {
  artisanInk: createMockVendor('Artisan Ink', 'artisan-ink', 'Creators of fine digital and physical art tools.'),
  codeWeavers: createMockVendor('CodeWeavers', 'codeweavers', 'Building the next generation of development software.'),
  mindfulFlow: createMockVendor('Mindful Flow', 'mindfulflow', 'Guiding you towards a balanced life with tools for wellness.'),
  symposium: createMockVendor('Symposium', 'symposium', 'A collective for deep learning and knowledge sharing.'),
  quantCore: createMockVendor('QuantCore Analytics', 'quantcore', 'AI-driven financial modeling and API services.'),
};

const createMockReview = (): Review => ({
  id: generateUUID(), author: sample(['Alex', 'Sam', 'Charlie', 'Dana', 'Jordan']), authorAvatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${Math.random()}`,
  rating: Math.ceil(Math.random() * 5),
  comment: sample(['Life-changing!', 'A solid product, worth the price.', 'Had some issues with setup, but support was great.', 'Not what I expected.', 'Incredible value. Would recommend to anyone on a similar path.']),
  createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
  isHelpfulCount: Math.floor(Math.random() * 50), media: [],
});

const generateMockItems = (count: number): MarketplaceItem[] => {
    const items: MarketplaceItem[] = [];
    const templates = [
      { name: 'Visionary Pro Canvas', tagline: 'The ultimate digital drawing tablet.', type: ItemType.PhysicalGood, category: 'Digital Art', price: { amount: 799, currency: Currency.USD, isRecurring: false }, vendor: VENDORS.artisanInk, imageSeed: 'tablet_pro', tags: ['drawing', 'illustration'], attributes: [{name: 'Resolution', value: '8K'}, {name: 'Pressure Levels', value: 8192}] },
      { name: 'CodeScribe AI', tagline: 'Your AI-powered pair programmer.', type: ItemType.DigitalSoftware, category: 'Development', price: { amount: 20, currency: Currency.USD, isRecurring: true, recurringInterval: 'monthly' }, vendor: VENDORS.codeWeavers, imageSeed: 'codescribe_ai', tags: ['ai', 'coding', 'productivity'], attributes: [{name: 'Languages', value: 'JS, Python, Go'}, {name: 'IDE Support', value: 'VSCode, JetBrains'}] },
      { name: 'Zenith Meditation Pod', tagline: 'A subscription to guided mindfulness.', type: ItemType.Service, category: 'Wellness', price: { amount: 15, currency: Currency.USD, isRecurring: true, recurringInterval: 'monthly' }, vendor: VENDORS.mindfulFlow, imageSeed: 'zenith_pod', tags: ['meditation', 'mental health'], attributes: [{name: 'Session Lengths', value: '5, 10, 20 min'}, {name: 'Styles', value: 'Vipassana, Zen'}] },
      { name: 'The Philosophy of Systems', tagline: 'Deep-dive course on complex systems.', type: ItemType.Educational, category: 'Learning', price: { amount: 250, currency: Currency.USD, isRecurring: false }, vendor: VENDORS.symposium, imageSeed: 'systems_course', tags: ['philosophy', 'thinking models'], attributes: [{name: 'Duration', value: '8 Weeks'}, {name: 'Effort', value: '3-5 hours/week'}] },
      { name: 'Market Forecaster API', tagline: 'Predictive analytics for financial markets.', type: ItemType.APIAccess, category: 'Finance', price: { amount: 499, currency: Currency.USD, isRecurring: true, recurringInterval: 'monthly' }, vendor: VENDORS.quantCore, imageSeed: 'market_api', tags: ['finance', 'api', 'ai'], attributes: [{name: 'Rate Limit', value: '1000/min'}, {name: 'Data Lag', value: '< 50ms'}] },
    ];

    for (let i = 0; i < count; i++) {
        const template = sample(templates);
        const name = `${template.name} Mk${Math.floor(i / templates.length) + 1}`;
        items.push({
            id: generateUUID(), name, tagline: template.tagline,
            description: 'This is a detailed description that would elaborate on the product\'s features, benefits, and specifications. It is designed to give the user a complete understanding of what they are considering, allowing for an informed decision based on their curated trajectory. '.repeat(Math.random() * 4 + 2),
            imageUrls: [`https://picsum.photos/seed/${template.imageSeed}${i}/600/400`, `https://picsum.photos/seed/${template.imageSeed}${i}b/600/400`, `https://picsum.photos/seed/${template.imageSeed}${i}c/600/400`],
            type: template.type, category: template.category, tags: [template.category.toLowerCase(), ...template.tags],
            price: { ...template.price, amount: Math.round(template.price.amount * (0.8 + Math.random() * 0.4)) },
            vendor: template.vendor,
            aiJustification: {
                short: 'Based on your recent activities, this seems like a logical next step.',
                detailed: 'Our analysis of your project \'Odyssey\' and recent transactions related to digital art suggests a deep dive into high-fidelity illustration. This tool, known for its powerful brush engine and non-destructive workflow, directly aligns with the techniques you appear to be exploring. It could significantly accelerate your progress on the path of a digital artist.',
                basedOn: ['Project \'Odyssey\'', 'Transactions in \'Art Supplies\''],
                confidenceScore: Math.random() * 0.4 + 0.55,
            },
            userReviews: Array.from({ length: Math.floor(Math.random() * 20) + 5 }, createMockReview),
            reviewAnalysis: {
                overallSentiment: { positive: Math.floor(Math.random()*30+60), neutral: Math.floor(Math.random()*10+10), negative: Math.floor(Math.random()*10) },
                keyTopics: [ { topic: 'Ease of Use', mentions: 15, sentiment: 'positive' }, { topic: 'Price', mentions: 10, sentiment: 'neutral' }, { topic: 'Customer Support', mentions: 5, sentiment: 'negative' } ],
            },
            qAndA: [], relatedItems: [],
            isFeatured: Math.random() > 0.8,
            relevanceScore: Math.random(),
            createdAt: new Date(Date.now() - Math.random() * 730 * 24 * 60 * 60 * 1000).toISOString(),
            stock: template.type === ItemType.PhysicalGood ? Math.floor(Math.random() * 100) : undefined,
            details: null,
            attributes: template.attributes,
        });
    }

    items.forEach(item => { item.relatedItems = items.filter(other => other.id !== item.id && other.category === item.category).map(other => other.id).slice(0, 3); });
    return items;
};

const MOCK_ITEMS = generateMockItems(100);

const MOCK_USER_PROFILE: UserProfile = {
  id: 'user-001', name: 'Alexandria', email: 'alex@example.com',
  avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=alexandria',
  joinedDate: new Date('2022-01-15T09:30:00Z').toISOString(),
  transactions: [ { id: generateUUID(), date: new Date().toISOString(), description: 'Artisan Ink Supplies', amount: 85, currency: Currency.USD, category: 'Art Supplies' }, { id: generateUUID(), date: new Date().toISOString(), description: 'Symposium: Design Theory', amount: 120, currency: Currency.USD, category: 'Education' } ],
  projects: [ { id: 'proj-odyssey', name: 'Odyssey', description: 'A series of digital illustrations exploring ancient myths.', relatedTransactions: [], startDate: new Date('2023-05-01T10:00:00Z').toISOString() } ],
};

const MOCK_USER_TRAJECTORY: UserTrajectory = {
  primaryType: TrajectoryType.Creative, secondaryTypes: [TrajectoryType.Academic],
  narrative: 'You are on the path of a modern storyteller, blending classical themes with digital artistry. Your journey is about mastering new mediums to express timeless ideas.',
  confidence: 0.88,
  evidence: ['Purchase history of art supplies', 'Enrollment in design theory courses', 'Active project \'Odyssey\' focusing on mythology'],
};

export class MockApiService {
  static async fetchMarketplaceData(userId: UUID): Promise<{ items: MarketplaceItem[]; userProfile: UserProfile; userTrajectory: UserTrajectory; }> {
    return new Promise(resolve => {
      setTimeout(() => {
        const personalizedItems = MOCK_ITEMS.map(item => ({ ...item, relevanceScore: this.calculateRelevance(item, MOCK_USER_TRAJECTORY), })).sort((a, b) => b.relevanceScore - a.relevanceScore);
        resolve({ items: personalizedItems, userProfile: MOCK_USER_PROFILE, userTrajectory: MOCK_USER_TRAJECTORY });
      }, MOCK_DB_DELAY);
    });
  }

  private static calculateRelevance(item: MarketplaceItem, trajectory: UserTrajectory): number {
    let score = 0.5;
    if(trajectory.primaryType === TrajectoryType.Creative && (item.category === 'Digital Art' || item.category === 'Community')) score += 0.4;
    if(trajectory.secondaryTypes.includes(TrajectoryType.Academic) && item.type === ItemType.Educational) score += 0.3;
    if (item.isFeatured) score += 0.1;
    return Math.min(1, score * (0.8 + Math.random() * 0.4));
  }

  static async submitFeedback(userId: UUID, itemId: UUID, feedback: 'helpful' | 'not_relevant'): Promise<{success: boolean}> { return new Promise(resolve => setTimeout(() => resolve({ success: true }), 500)); }

  static async askPlato(userId: UUID, query: string, history: {q:string, a:string}[]): Promise<string> {
    return new Promise(resolve => {
      setTimeout(() => {
        const response = `Based on our previous conversation and your question about "${query}", I've analyzed your current trajectory as a '${MOCK_USER_TRAJECTORY.primaryType.toLowerCase()}'. I recommend exploring tools that offer collaborative features. For instance, the 'Creator's Guild Access' would connect you with peers who share your passion, potentially accelerating your 'Odyssey' project. Is collaboration something you're interested in?`;
        resolve(response);
      }, 1200);
    });
  }

  static async getComparisonAnalysis(itemIds: UUID[], trajectory: UserTrajectory): Promise<string> {
      return new Promise(resolve => {
          setTimeout(() => {
              const items = MOCK_ITEMS.filter(i => itemIds.includes(i.id));
              if (items.length < 2) return resolve("Not enough items to compare.");
              const analysis = `Comparing **${items[0].name}** and **${items[1].name}** for your **${trajectory.primaryType}** trajectory:\n\n- **${items[0].name}**: Excels in raw performance and is a one-time purchase. It's better for focused, solo work where you need maximum power.\n- **${items[1].name}**: Offers more collaborative features and a subscription model, ensuring you always have the latest updates. It's ideal if you plan to work in a team.\n\n**Recommendation:** Given your 'Odyssey' project appears to be a solo endeavor, the **${items[0].name}** might offer better long-term value. However, if you anticipate bringing on collaborators, the subscription model of **${items[1].name}** is more flexible.`;
              resolve(analysis);
          }, 1500);
      });
  }
}

//================================================================================================
// 3. STATE MANAGEMENT (Context & Reducer)
//================================================================================================

export const initialFilters: FilterState = { searchQuery: '', categories: new Set(), itemTypes: new Set(), priceRange: [0, 1000], ratingRange: [0, 5], showFeaturedOnly: false, };
export const initialState: MarketplaceState = {
  isLoading: true, error: null, items: [], userProfile: null, userTrajectory: null,
  curationSettings: { allowTransactionAnalysis: true, allowProjectAnalysis: true, preferredItemTypes: [], excludedTags: [], curationAggressiveness: 'balanced', },
  filters: initialFilters, sortBy: 'relevance', pagination: { currentPage: 1, itemsPerPage: 12 },
  selectedItemId: null, activeModal: 'none', cart: [], wishlist: [], notifications: [],
  comparison: { isComparing: false, itemIds: [] },
};

export const marketplaceReducer = produce((draft: MarketplaceState, action: MarketplaceAction) => {
  switch (action.type) {
    case 'FETCH_START': draft.isLoading = true; draft.error = null; break;
    case 'FETCH_SUCCESS':
      draft.isLoading = false;
      draft.items = action.payload.items;
      draft.userProfile = action.payload.userProfile;
      draft.userTrajectory = action.payload.userTrajectory;
      break;
    case 'FETCH_ERROR': draft.isLoading = false; draft.error = action.payload; break;
    case 'UPDATE_FILTERS': draft.filters = { ...draft.filters, ...action.payload }; draft.pagination.currentPage = 1; break;
    case 'RESET_FILTERS': draft.filters = initialFilters; draft.pagination.currentPage = 1; break;
    case 'UPDATE_SORT': draft.sortBy = action.payload; break;
    case 'SET_PAGE': draft.pagination.currentPage = action.payload; break;
    case 'SET_MODAL': draft.activeModal = action.payload.modal; draft.selectedItemId = action.payload.itemId || null; break;
    case 'ADD_TO_CART': {
      const existingItem = draft.cart.find(i => i.itemId === action.payload.itemId);
      if (existingItem) existingItem.quantity += action.payload.quantity;
      else draft.cart.push({ ...action.payload, addedAt: new Date().toISOString() });
      break;
    }
    case 'REMOVE_FROM_CART': draft.cart = draft.cart.filter(i => i.itemId !== action.payload.itemId); break;
    case 'UPDATE_CART_QUANTITY': {
      const item = draft.cart.find(i => i.itemId === action.payload.itemId);
      if (item) item.quantity = action.payload.quantity;
      break;
    }
    case 'TOGGLE_WISHLIST_ITEM': {
        const { itemId } = action.payload;
        const index = draft.wishlist.findIndex(i => i.itemId === itemId);
        if (index > -1) draft.wishlist.splice(index, 1);
        else draft.wishlist.push({ itemId, addedAt: new Date().toISOString() });
        break;
    }
    case 'ADD_NOTIFICATION': draft.notifications.push({ id: generateUUID(), timestamp: Date.now(), ...action.payload }); break;
    case 'REMOVE_NOTIFICATION': draft.notifications = draft.notifications.filter(n => n.id !== action.payload.id); break;
    default: break;
  }
});

export const MarketplaceContext = createContext<{ state: MarketplaceState; dispatch: React.Dispatch<MarketplaceAction>; } | undefined>(undefined);
export const useMarketplace = () => { const context = useContext(MarketplaceContext); if (!context) throw new Error('useMarketplace must be used within a MarketplaceProvider'); return context; };

//================================================================================================
// 4. UTILITY & CUSTOM HOOKS
//================================================================================================

export const useFilteredAndSortedItems = () => {
    const { state } = useMarketplace();
    const { items, filters, sortBy, pagination } = state;
    return useMemo(() => {
        let result = items.filter(item => {
            const query = filters.searchQuery.toLowerCase();
            if (query && !(item.name.toLowerCase().includes(query) || item.description.toLowerCase().includes(query) || item.tags.some(t => t.toLowerCase().includes(query)))) return false;
            if (filters.categories.size > 0 && !filters.categories.has(item.category)) return false;
            if (filters.itemTypes.size > 0 && !filters.itemTypes.has(item.type)) return false;
            if (item.price.amount < filters.priceRange[0] || item.price.amount > filters.priceRange[1]) return false;
            const avgRating = item.userReviews.reduce((acc, r) => acc + r.rating, 0) / item.userReviews.length;
            if (avgRating < filters.ratingRange[0] || avgRating > filters.ratingRange[1]) return false;
            if (filters.showFeaturedOnly && !item.isFeatured) return false;
            return true;
        });
        switch (sortBy) {
            case 'price_asc': result.sort((a, b) => a.price.amount - b.price.amount); break;
            case 'price_desc': result.sort((a, b) => b.price.amount - a.price.amount); break;
            case 'newest': result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
            case 'rating': result.sort((a, b) => (b.userReviews.reduce((acc, r) => acc + r.rating, 0) / b.userReviews.length) - (a.userReviews.reduce((acc, r) => acc + r.rating, 0) / a.userReviews.length)); break;
            default: result.sort((a, b) => b.relevanceScore - a.relevanceScore); break;
        }
        const totalItems = result.length;
        const pagedItems = result.slice((pagination.currentPage - 1) * pagination.itemsPerPage, pagination.currentPage * pagination.itemsPerPage);
        return { pagedItems, totalItems };
    }, [items, filters, sortBy, pagination]);
};

export const formatCurrency = (price: Price): string => {
  const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: price.currency, maximumFractionDigits: 2 });
  let formatted = formatter.format(price.amount);
  if (price.isRecurring) formatted += `/${price.recurringInterval === 'monthly' ? 'mo' : 'yr'}`;
  return formatted;
};

export const useDebounce = <T>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => { const handler = setTimeout(() => { setDebouncedValue(value); }, delay); return () => { clearTimeout(handler); }; }, [value, delay]);
    return debouncedValue;
};

//================================================================================================
// 5. UI COMPONENTS
//================================================================================================

const IconSearch: FC = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const IconX: FC = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconThumbsUp: FC = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a2 2 0 0 1 1.79 1.11L15 5.88Z"/></svg>;
const IconThumbsDown: FC = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2"/><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a2 2 0 0 1-1.79-1.11L9 18.12Z"/></svg>;
const IconHeart: FC<{ filled?: boolean }> = ({ filled }) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={filled ? "#dc3545" : "none"} stroke="#dc3545" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>;
const IconShoppingCart: FC = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>;
const IconSettings: FC = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;
const IconFilter: FC = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>;
const IconStar: FC<{ filled?: boolean }> = ({ filled }) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={filled ? "#ffc107" : "none"} stroke="#ffc107" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>;

const STYLES: { [key: string]: CSSProperties } = {
  pageContainer: { fontFamily: 'Inter, system-ui, sans-serif', backgroundColor: '#f8f9fa', color: '#212529', minHeight: '100vh', '--primary-color': '#007bff' },
  header: { padding: '1.5rem 2.5rem', backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #dee2e6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 },
  headerTitle: { fontSize: '1.75rem', fontWeight: 700, margin: 0 },
  mainContent: { padding: '2.5rem', display: 'grid', gridTemplateColumns: '320px 1fr', gap: '2.5rem', alignItems: 'start' },
  sidebar: { backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #dee2e6', alignSelf: 'start', position: 'sticky', top: '120px' },
  itemGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' },
  card: { backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', border: '1px solid #dee2e6', cursor: 'pointer', display: 'flex', flexDirection: 'column' },
  modalBackdrop: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(33, 37, 41, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modalContent: { backgroundColor: 'white', borderRadius: '12px', width: '90%', maxHeight: '90vh', overflowY: 'auto' },
  button: { padding: '0.75rem 1.5rem', border: 'none', borderRadius: '8px', cursor: 'pointer', backgroundColor: 'var(--primary-color)', color: 'white', fontSize: '1rem', fontWeight: 500, transition: 'background-color 0.2s, transform 0.1s' },
  input: { width: '100%', padding: '0.75rem', border: '1px solid #ced4da', borderRadius: '8px', fontSize: '1rem' },
  h2: { marginTop: 0, marginBottom: '1.5rem', fontWeight: 700, fontSize: '2rem' },
  h3: { marginTop: '2rem', marginBottom: '1rem', borderBottom: '1px solid #e9ecef', paddingBottom: '0.75rem', fontWeight: 600, fontSize: '1.25rem' },
};

export const StarRating: FC<{ rating: number }> = ({ rating }) => <div>{Array.from({ length: 5 }).map((_, i) => <IconStar key={i} filled={i < rating} />)}</div>;
export const SkeletonCard: FC = () => (<div style={STYLES.card}><div style={{ width: '100%', height: '180px', backgroundColor: '#e9ecef' }} /><div style={{ padding: '20px' }}><div style={{ height: '20px', backgroundColor: '#e9ecef', borderRadius: '4px', marginBottom: '10px' }} /><div style={{ height: '16px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '75%', marginBottom: '15px' }} /><div style={{ height: '14px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '90%' }} /></div></div>);
export const ItemCard: FC<{ item: MarketplaceItem; onSelect: (id: UUID) => void; onAddToCart: (id: UUID) => void; onToggleWishlist: (id: UUID) => void; isWishlisted: boolean; }> = ({ item, onSelect, onAddToCart, onToggleWishlist, isWishlisted }) => {
  const [isHovered, setIsHovered] = useState(false);
  const springProps = useSpring({ transform: `translateY(${isHovered ? -5 : 0}px)`, boxShadow: isHovered ? '0 12px 24px rgba(0,0,0,0.1)' : '0 4px 8px rgba(0,0,0,0.05)' });
  const avgRating = item.userReviews.reduce((acc, r) => acc + r.rating, 0) / item.userReviews.length;
  return (
    <animated.div style={{ ...STYLES.card, ...springProps }} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div style={{ position: 'relative' }}>
          <img onClick={() => onSelect(item.id)} src={item.imageUrls[0]} alt={item.name} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
          <button onClick={(e) => { e.stopPropagation(); onToggleWishlist(item.id); }} style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(255,255,255,0.8)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IconHeart filled={isWishlisted} /></button>
      </div>
      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h4 onClick={() => onSelect(item.id)} style={{ margin: '0 0 10px 0', fontSize: '18px', fontWeight: 600, flex: 1 }}>{item.name}</h4>
        <div onClick={() => onSelect(item.id)} style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px' }}><StarRating rating={avgRating} /> <span style={{fontSize: '12px', color: '#6c757d'}}>({item.userReviews.length})</span></div>
        <p onClick={() => onSelect(item.id)} style={{ margin: '0 0 15px 0', fontStyle: 'italic', fontSize: '13px', borderLeft: '3px solid var(--primary-color)', paddingLeft: '10px', color: '#495057' }}>"{item.aiJustification.short}"</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
          <span style={{ fontWeight: 'bold', fontSize: '18px' }}>{formatCurrency(item.price)}</span>
          <button onClick={(e) => { e.stopPropagation(); onAddToCart(item.id); }} style={{...STYLES.button, padding: '8px 12px', fontSize: '14px' }}>Add to Cart</button>
        </div>
      </div>
    </animated.div>
  );
};
export const ItemDetailModal: FC<{ item: MarketplaceItem | undefined; onClose: () => void; }> = ({ item, onClose }) => {
    const { dispatch } = useMarketplace();
    const [activeTab, setActiveTab] = useState('description');
    const tabs = ['description', 'reviews', 'details', 'vendor'];
    if (!item) return null;
    const sentimentData = [{ name: 'Positive', value: item.reviewAnalysis.overallSentiment.positive }, { name: 'Neutral', value: item.reviewAnalysis.overallSentiment.neutral }, { name: 'Negative', value: item.reviewAnalysis.overallSentiment.negative }];
    const COLORS = ['#28a745', '#ffc107', '#dc3545'];
    return (
        <div style={STYLES.modalBackdrop} onClick={onClose}>
            <animated.div style={{ ...STYLES.modalContent, width: '90%', maxWidth: '1200px', display: 'grid', gridTemplateColumns: '400px 1fr', gap: '2rem' }} onClick={e => e.stopPropagation()}>
                <button onClick={onClose} style={{ ...STYLES.button, position: 'absolute', top: '20px', right: '20px', background: 'none', color: '#333' }}><IconX /></button>
                <div>
                    <img src={item.imageUrls[0]} alt={item.name} style={{ width: '100%', borderRadius: '8px' }} />
                    <h2 style={{ ...STYLES.h2, fontSize: '28px', marginTop: '20px' }}>{item.name}</h2>
                    <p style={{ fontSize: '18px', color: '#6c757d' }}>{item.tagline}</p>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', margin: '20px 0' }}>{formatCurrency(item.price)}</div>
                    <button onClick={() => { dispatch({type: 'ADD_TO_CART', payload: {itemId: item.id, quantity: 1}}); dispatch({type: 'ADD_NOTIFICATION', payload: {type: 'success', message: `${item.name} added to cart!`}}) }} style={{ ...STYLES.button, width: '100%', padding: '15px' }}>Acquire Tool</button>
                    <div style={{ backgroundColor: '#f0f7ff', padding: '20px', borderRadius: '8px', border: '1px solid #cce4ff', marginTop: '20px' }}>
                        <h3 style={{ ...STYLES.h3, marginTop: 0 }}>Plato's Justification</h3>
                        <p>{item.aiJustification.detailed}</p>
                        <div style={{ fontSize: '12px', color: '#555', marginTop: '15px' }}><strong>Based on:</strong> {item.aiJustification.basedOn.join(', ')}<br /><strong>Confidence:</strong> {Math.round(item.aiJustification.confidenceScore * 100)}%</div>
                    </div>
                </div>
                <div>
                    <div style={{ display: 'flex', borderBottom: '1px solid #dee2e6' }}>{tabs.map(tab => <button key={tab} onClick={() => setActiveTab(tab)} style={{ ...STYLES.button, background: activeTab === tab ? '#e9ecef' : 'none', color: '#343a40', textTransform: 'capitalize' }}>{tab}</button>)}</div>
                    <div style={{paddingTop: '20px'}}>
                        {activeTab === 'description' && <p>{item.description}</p>}
                        {activeTab === 'details' && <ul>{item.attributes.map(attr => <li key={attr.name}><strong>{attr.name}:</strong> {attr.value}</li>)}</ul>}
                        {activeTab === 'vendor' && <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}><img src={item.vendor.logoUrl} alt={item.vendor.name} style={{ width: '50px', height: '50px' }}/><p>{item.vendor.bio}</p></div>}
                        {activeTab === 'reviews' && (
                            <div>
                                <h3 style={STYLES.h3}>Review Analysis</h3>
                                <div style={{height: '200px'}}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart><Pie data={sentimentData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>{sentimentData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}</Pie></PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <h3 style={STYLES.h3}>User Reviews ({item.userReviews.length})</h3>
                                {item.userReviews.map(review => (
                                    <div key={review.id} style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}>
                                        <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}><img src={review.authorAvatar} style={{width: 32, height: 32, borderRadius: 16}} /><strong>{review.author}</strong> - <StarRating rating={review.rating} /></div>
                                        <p style={{margin: '5px 0'}}>{review.comment}</p>
                                        <small style={{color: '#6c757d'}}>{formatDistanceToNow(new Date(review.createdAt))} ago</small>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </animated.div>
        </div>
    );
};
export const PlatoConsultationModal: FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [history, setHistory] = useState<{q: string, a: string}[]>([]);
    const [isThinking, setIsThinking] = useState(false);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); if(!query.trim() || isThinking) return; setIsThinking(true);
        const userQuery = query; setQuery('');
        const answer = await MockApiService.askPlato('user-001', userQuery, history);
        setHistory(prev => [...prev, { q: userQuery, a: answer }]); setIsThinking(false);
    };
    if (!isOpen) return null;
    return (
        <div style={STYLES.modalBackdrop} onClick={onClose}>
            <div style={{ ...STYLES.modalContent, maxWidth: '600px', display: 'flex', flexDirection: 'column', height: '80vh' }} onClick={e => e.stopPropagation()}>
                <button onClick={onClose} style={{ ...STYLES.button, position: 'absolute', top: '20px', right: '20px', background: 'none', color: '#333' }}><IconX /></button>
                <h2 style={STYLES.h2}>Consult Plato</h2>
                <div style={{ flex: 1, overflowY: 'auto', marginBottom: '20px', paddingRight: '10px' }}>
                    {history.length === 0 && <p>You may ask for guidance. For example: "What should I learn next to improve my digital art?"</p>}
                    {history.map((entry, index) => (<div key={index}><p style={{textAlign: 'right', fontWeight: 'bold'}}>You: {entry.q}</p><p style={{backgroundColor: '#f0f7ff', padding: '10px', borderRadius: '8px'}}>Plato: {entry.a}</p></div>))}
                    {isThinking && <div style={{display: 'flex', justifyContent: 'center'}}><p>Plato is thinking...</p></div>}
                </div>
                <form onSubmit={handleSubmit} style={{display: 'flex', gap: '10px'}}><input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Ask for a recommendation..." style={STYLES.input} disabled={isThinking}/> <button type="submit" style={STYLES.button} disabled={isThinking}>Send</button></form>
            </div>
        </div>
    );
};
export const Sidebar: FC = () => {
  const { state, dispatch } = useMarketplace();
  const { filters, items } = state;
  const categories = useMemo(() => Array.from(new Set(items.map(i => i.category))), [items]);
  const itemTypes = useMemo(() => Array.from(new Set(items.map(i => i.type))), [items]);

  const handleFilterChange = (payload: Partial<FilterState>) => dispatch({ type: 'UPDATE_FILTERS', payload });

  return (
    <aside style={STYLES.sidebar}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h3 style={{...STYLES.h3, marginTop: 0, border: 'none'}}>Filters</h3>
        <button onClick={() => dispatch({type: 'RESET_FILTERS'})} style={{...STYLES.button, background: 'none', color: 'var(--primary-color)', padding: 0}}>Reset</button>
      </div>
      <div>
        <h4>Category</h4>
        {categories.map(cat => (<div key={cat}><input type="checkbox" id={`cat-${cat}`} checked={filters.categories.has(cat)} onChange={() => { const newSet = new Set(filters.categories); if(newSet.has(cat)) newSet.delete(cat); else newSet.add(cat); handleFilterChange({categories: newSet})}} /> <label htmlFor={`cat-${cat}`}>{cat}</label></div>))}
      </div>
      <div style={{marginTop: '20px'}}>
        <h4>Item Type</h4>
        {itemTypes.map(type => (<div key={type}><input type="checkbox" id={`type-${type}`} checked={filters.itemTypes.has(type)} onChange={() => { const newSet = new Set(filters.itemTypes); if(newSet.has(type)) newSet.delete(type); else newSet.add(type); handleFilterChange({itemTypes: newSet})}} /> <label htmlFor={`type-${type}`}>{type.replace(/_/g, ' ').toLocaleLowerCase()}</label></div>))}
      </div>
      <div style={{marginTop: '20px'}}>
        <h4>Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}</h4>
        <input type="range" min="0" max="1000" value={filters.priceRange[1]} onChange={e => handleFilterChange({ priceRange: [filters.priceRange[0], Number(e.target.value)] })} style={{width: '100%'}}/>
      </div>
    </aside>
  );
};

//================================================================================================
// 6. MAIN VIEW COMPONENT
//================================================================================================

export const MarketplaceViewContent: FC = () => {
  const { state, dispatch } = useMarketplace();
  const { isLoading, error, selectedItemId, items, wishlist, pagination } = state;
  const { pagedItems, totalItems } = useFilteredAndSortedItems();

  useEffect(() => { dispatch({ type: 'FETCH_START' }); MockApiService.fetchMarketplaceData('user-001').then(data => dispatch({ type: 'FETCH_SUCCESS', payload: data })).catch(e => dispatch({ type: 'FETCH_ERROR', payload: e as Error })); }, [dispatch]);

  const selectedItem = useMemo(() => items.find(item => item.id === selectedItemId), [items, selectedItemId]);
  const handleAddToCart = useCallback((itemId: UUID) => { dispatch({ type: 'ADD_TO_CART', payload: { itemId, quantity: 1 } }); dispatch({ type: 'ADD_NOTIFICATION', payload: { type: 'success', message: 'Item added to cart!' } }); }, [dispatch]);
  const handleToggleWishlist = useCallback((itemId: UUID) => { dispatch({ type: 'TOGGLE_WISHLIST_ITEM', payload: { itemId } }); }, [dispatch]);
  const totalPages = Math.ceil(totalItems / pagination.itemsPerPage);

  return (
    <div style={STYLES.pageContainer}>
      <header style={STYLES.header}>
        <div><h1 style={STYLES.headerTitle}>The Agora</h1><p style={{margin: 0, color: '#6c757d'}}>A curated reality of potential, by Plato</p></div>
        <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}><button style={STYLES.button} onClick={() => dispatch({ type: 'SET_MODAL', payload: { modal: 'plato' } })}>Consult Plato</button><button style={{...STYLES.button, background: 'none', color: '#495057'}} onClick={() => dispatch({ type: 'SET_MODAL', payload: { modal: 'cart' } })}><IconShoppingCart /></button><button style={{...STYLES.button, background: 'none', color: '#495057'}} onClick={() => dispatch({ type: 'SET_MODAL', payload: { modal: 'settings' } })}><IconSettings /></button><img src={state.userProfile?.avatarUrl} alt="User Avatar" style={{width: '48px', height: '48px', borderRadius: '50%'}} /></div>
      </header>
      <main style={STYLES.mainContent}>
        <Sidebar />
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div style={{ position: 'relative', width: '50%' }}><span style={{position: 'absolute', top: '50%', left: '10px', transform: 'translateY(-50%)', color: '#999'}}><IconSearch/></span><input type="text" placeholder="Search for tools, services, ideas..." value={state.filters.searchQuery} onChange={e => dispatch({ type: 'UPDATE_FILTERS', payload: { searchQuery: e.target.value } })} style={{...STYLES.input, paddingLeft: '40px'}} /></div>
            <div><label htmlFor="sort-by">Sort by: </label><select id="sort-by" value={state.sortBy} onChange={e => dispatch({type: 'UPDATE_SORT', payload: e.target.value as SortOption})} style={{...STYLES.input, width: 'auto'}}><option value="relevance">Relevance</option><option value="price_asc">Price: Low to High</option><option value="price_desc">Price: High to Low</option><option value="newest">Newest</option><option value="rating">Highest Rated</option></select></div>
          </div>
          {isLoading ? (<div style={STYLES.itemGrid}>{Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}</div>) : error ? (<p>There was an error loading the Agora: {error.message}</p>) : pagedItems.length > 0 ? (
            <>
              <div style={STYLES.itemGrid}>{pagedItems.map(item => (<ItemCard key={item.id} item={item} onSelect={(id) => dispatch({ type: 'SET_MODAL', payload: { modal: 'itemDetail', itemId: id } })} onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} isWishlisted={wishlist.some(w => w.itemId === item.id)} />))}</div>
              <div style={{display: 'flex', justifyContent: 'center', marginTop: '2rem', gap: '0.5rem'}}>{Array.from({length: totalPages}).map((_, i) => (<button key={i} onClick={() => dispatch({type: 'SET_PAGE', payload: i+1})} style={{...STYLES.button, background: pagination.currentPage === i+1 ? 'var(--primary-color)' : '#e9ecef', color: pagination.currentPage === i+1 ? 'white' : 'black'}}>{i+1}</button>))}</div>
            </>
          ) : (<p>No items match your current filters.</p>)}
        </div>
      </main>
      {state.activeModal === 'itemDetail' && <ItemDetailModal item={selectedItem} onClose={() => dispatch({ type: 'SET_MODAL', payload: { modal: 'none' } })} />}
      <PlatoConsultationModal isOpen={state.activeModal === 'plato'} onClose={() => dispatch({ type: 'SET_MODAL', payload: { modal: 'none' } })}/>
    </div>
  );
};

export const MarketplaceView: FC = () => {
    const [state, dispatch] = useReducer(marketplaceReducer, initialState);
    return (
      <MarketplaceContext.Provider value={{ state, dispatch }}>
        <MarketplaceViewContent />
      </MarketplaceContext.Provider>
    );
};

export default MarketplaceView;
```

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/views/personal/MarketplaceView.tsx.md
================================================================================

openapi: 3.0.0
info:
  title: JAMESBURVELOCALLAGHANIII
  version: 1.0.0
  description: >-
    Welcome to the **Quantum Core 3.0**, the pinnacle of financial technology,
    meticulously engineered to power the experience. This is far more than a
    mere set of endpoints; it is the living, breathing neural network of a
    next-generation financial ecosystem, poised to redefine digital banking for
    a global audience.


    Our API is a testament to the philosophy that finance should be an
    intelligent, predictive, and intensely personal dialogue—a dynamic,
    self-optimizing collaboration between users, visionary developers, and our
    proprietary Artificial General Intelligence, **Quantum**. We provide
    unparalleled programmatic access to the sophisticated tools and vast data
    reservoirs that fuel our platform, spanning from hyper-personalized wealth
    management to AI-driven corporate finance automation, decentralized asset
    orchestration, and pioneering business incubation.


    This comprehensive specification unveils the secure and high-performance
    protocols to connect with and command the core functionalities of . Empower
    yourself to architect and deploy the future of finance, with an
    infrastructure designed for exponential scalability, impenetrable security,
    real-time intelligence, and seamless global integration. As your most
    ambitious visions crystallize, our platform's unparalleled capabilities will
    not just meet them—they will amplify them. This is finance, reimagined,
    limitless, and brought to life by AI.
servers:
  - url: https://ce47fe80-dabc-4ad0-b0e7-cf285695b8b8.mock.pstmn.io
paths:
  /users/register:
    post:
      summary: Register a New User Account
      responses:
        '201':
          description: User registered successfully. Awaits email/MFA verification.
          content:
            application/json:
              schema:
                type: object
                properties:
                  address:
                    type: object
                    properties: {}
                  securityStatus:
                    type: object
                    description: Security-related status for the user account.
                    properties: {}
                  preferences:
                    type: object
                    description: User's personalized preferences for the platform.
                    properties:
                      notificationChannels:
                        type: object
                        description: Preferred channels for receiving notifications.
                        properties: {}
                required:
                  - email
                  - id
                  - identityVerified
                  - name
              example:
                id: user-alice-001
                name: Alice Wonderland
                email: alice.w@example.com
                phone: +1-555-987-6543
                dateOfBirth: '1990-05-10'
                address:
                  street: 123 Magic Lane
                  city: Fantasyland
                  state: CA
                  zip: '90210'
                  country: USA
                loyaltyTier: Bronze
                loyaltyPoints: 0
                gamificationLevel: 1
                aiPersona: Conservative Saver
                securityStatus:
                  twoFactorEnabled: false
                  biometricsEnrolled: false
                  lastLogin: '2024-07-22T08:00:00Z'
                  lastLoginIp: 203.0.113.10
                preferences:
                  preferredLanguage: en-US
                  theme: Light-Default
                  aiInteractionMode: balanced
                  notificationChannels:
                    email: true
                    push: true
                    sms: false
                    inApp: true
                  dataSharingConsent: true
                  transactionGrouping: category
                identityVerified: false
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '409':
          description: >-
            The request could not be completed due to a conflict with the
            current state of the resource (e.g., duplicate entry, expired
            state).
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: RESOURCE_CONFLICT
                message: >-
                  A resource with this identifier already exists or the
                  operation conflicts with an existing state.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - users
        - register
      description: >-
        Registers a new user account with , initiating the onboarding process.
        Requires basic user details.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                address:
                  type: object
                  properties: {}
              required:
                - email
                - name
                - password
            example:
              name: Alice Wonderland
              email: alice.w@example.com
              password: SecureP@ssw0rd2024!
              phone: +1-555-987-6543
  /users/login:
    post:
      summary: User Login and Session Creation
      responses:
        '200':
          description: Successful login response
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - accessToken
                  - expiresIn
                  - refreshToken
                  - tokenType
              example:
                accessToken: '{{vault:json-web-token}}'
                refreshToken: some_long_refresh_token_string_for_renewal
                expiresIn: 3600
                tokenType: Bearer
        '401':
          description: Invalid or missing authentication credentials
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: MFA required error
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: MFA_REQUIRED
                message: >-
                  Multi-factor authentication is required. Please provide your
                  MFA code.
                timestamp: '2024-07-22T08:05:00Z'
      tags:
        - users
        - login
      description: >-
        Authenticates a user and creates a secure session, returning access
        tokens. May require MFA depending on user settings.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties: {}
              required:
                - email
                - password
            example:
              email: quantum.visionary@demobank.com
              password: YourSecurePassword123
  /users/password-reset/initiate:
    post:
      summary: Initiate Password Reset
      responses:
        '200':
          description: Password reset initiated. Check your email/phone for verification.
          content:
            application/json:
              schema:
                type: object
                properties: {}
              example:
                message: Verification code sent to your registered email/phone.
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - users
        - password-reset
        - initiate
      description: >-
        Starts the password reset flow by sending a verification code or link to
        the user's registered email or phone.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties: {}
              required:
                - identifier
            example:
              identifier: reset.user@example.com
  /users/password-reset/confirm:
    post:
      summary: Confirm Password Reset
      responses:
        '200':
          description: Password reset successfully.
          content:
            application/json:
              schema:
                type: object
                properties: {}
              example:
                message: Password updated successfully.
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Invalid or expired verification code.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_VERIFICATION_CODE
                message: The provided verification code is invalid or has expired.
                timestamp: '2024-07-22T08:10:00Z'
      tags:
        - users
        - password-reset
        - confirm
      description: >-
        Confirms the password reset using the received verification code and
        sets a new password.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties: {}
              required:
                - identifier
                - newPassword
                - verificationCode
            example:
              identifier: reset.user@example.com
              verificationCode: '654321'
              newPassword: MyNewStrongPassword@789
  /users/me/preferences:
    get:
      summary: Get User Personalization Preferences
      responses:
        '200':
          description: The user's personalized preferences.
          content:
            application/json:
              schema:
                description: User's personalized preferences for the platform.
                type: object
                properties:
                  notificationChannels:
                    type: object
                    description: Preferred channels for receiving notifications.
                    properties: {}
              example:
                preferredLanguage: en-US
                theme: Light-Default
                aiInteractionMode: balanced
                notificationChannels:
                  email: true
                  push: true
                  sms: false
                  inApp: true
                dataSharingConsent: true
                transactionGrouping: category
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - users
        - me
        - preferences
      description: >-
        Retrieves the user's deep personalization preferences, including AI
        customization settings, notification channel priorities, thematic
        choices, and data sharing consents.
    put:
      summary: Update User Personalization Preferences
      responses:
        '200':
          description: User preferences updated successfully.
          content:
            application/json:
              schema:
                description: User's personalized preferences for the platform.
                type: object
                properties:
                  notificationChannels:
                    type: object
                    description: Preferred channels for receiving notifications.
                    properties: {}
              example:
                preferredLanguage: en-US
                theme: Dark-Quantum
                aiInteractionMode: proactive
                notificationChannels:
                  email: true
                  push: true
                  sms: false
                  inApp: true
                dataSharingConsent: true
                transactionGrouping: category
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - users
        - me
        - preferences
      description: >-
        Updates the user's deep personalization preferences, allowing dynamic
        control over AI behavior, notification delivery, thematic choices, and
        data privacy settings.
      requestBody:
        content:
          application/json:
            schema:
              description: User's personalized preferences for the platform.
              type: object
              properties:
                notificationChannels:
                  type: object
                  description: Preferred channels for receiving notifications.
                  properties: {}
            example:
              theme: Dark-Quantum
              aiInteractionMode: proactive
  /users/me/devices:
    get:
      summary: List Connected Devices
      parameters:
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
      responses:
        '200':
          description: A paginated list of connected devices.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 2
                data:
                  - id: dev_mobile_ios_aabbcc
                    type: mobile
                    os: iOS 17.5
                    model: iPhone 15 Pro Max
                    lastActive: '2024-07-22T11:05:00Z'
                    ipAddress: 203.0.113.12
                    trustLevel: trusted
                    pushToken: ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]
                  - id: dev_desktop_win_123456
                    type: desktop
                    os: Windows 11
                    model: Dell XPS 15
                    lastActive: '2024-07-22T10:00:00Z'
                    ipAddress: 203.0.113.15
                    trustLevel: trusted
                nextOffset: 2
      tags:
        - users
        - me
        - devices
      description: >-
        Retrieves a list of all devices linked to the user's account, including
        mobile phones, tablets, and desktops, indicating their last active
        status and security posture.
  /users/me/biometrics/verify:
    post:
      summary: Verify Biometric Data for Sensitive Operations
      responses:
        '200':
          description: Biometric verification successful.
          content:
            application/json:
              schema:
                type: object
                properties: {}
              example:
                verificationStatus: success
                message: Biometric authentication successful.
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - users
        - me
        - biometrics
        - verify
      description: >-
        Performs real-time biometric verification to authorize sensitive actions
        or access protected resources, using a one-time biometric signature.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties: {}
              required:
                - biometricSignature
                - biometricType
                - deviceId
            example:
              biometricType: fingerprint
              biometricSignature: base64encoded_one_time_fingerprint_proof
              deviceId: dev_mobile_android_ddeeff
  /users/me/biometrics:
    get:
      summary: Get Biometric Enrollment Status
      responses:
        '200':
          description: Current biometric enrollment status.
          content:
            application/json:
              schema:
                description: Current biometric enrollment status for a user.
                type: object
                properties: {}
                required:
                  - biometricsEnrolled
                  - enrolledBiometrics
              example:
                biometricsEnrolled: true
                enrolledBiometrics:
                  - type: facial_recognition
                    deviceId: dev_mobile_ios_aabbcc
                    enrollmentDate: '2024-07-22T17:00:00Z'
                  - type: fingerprint
                    deviceId: dev_mobile_android_ddeeff
                    enrollmentDate: '2024-06-15T09:30:00Z'
                lastUsed: '2024-07-22T17:30:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - users
        - me
        - biometrics
      description: >-
        Retrieves the current status of biometric enrollments for the
        authenticated user.
  /users/me:
    get:
      summary: Retrieve Comprehensive Current User Profile
      responses:
        '200':
          description: The user's complete, enriched profile information.
          content:
            application/json:
              schema:
                type: object
                properties:
                  address:
                    type: object
                    properties: {}
                  securityStatus:
                    type: object
                    description: Security-related status for the user account.
                    properties: {}
                  preferences:
                    type: object
                    description: User's personalized preferences for the platform.
                    properties:
                      notificationChannels:
                        type: object
                        description: Preferred channels for receiving notifications.
                        properties: {}
                required:
                  - email
                  - id
                  - identityVerified
                  - name
              example:
                id: user-quantum-visionary-001
                name: The Quantum Visionary
                email: quantum.visionary@demobank.com
                phone: +1-555-123-4567
                dateOfBirth: '1980-01-15'
                address:
                  street: 100 Innovation Drive
                  city: Quantumville
                  state: CA
                  zip: '90210'
                  country: USA
                loyaltyTier: Zenith Platinum
                loyaltyPoints: 12500
                gamificationLevel: 7
                aiPersona: Prudent Planner
                securityStatus:
                  twoFactorEnabled: true
                  biometricsEnrolled: true
                  lastLogin: '2024-07-22T08:00:00Z'
                  lastLoginIp: 203.0.113.45
                preferences:
                  preferredLanguage: en-US
                  theme: Dark-Quantum
                  aiInteractionMode: balanced
                  notificationChannels:
                    email: true
                    push: true
                    sms: false
                    inApp: true
                  dataSharingConsent: true
                  transactionGrouping: category
                identityVerified: true
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - users
        - me
      description: >-
        Fetches the complete and dynamically updated profile information for the
        currently authenticated user, encompassing personal details, security
        status, gamification level, loyalty points, and linked identity
        attributes.
    put:
      summary: Update Current User Profile
      responses:
        '200':
          description: Example of updated user profile
          content:
            application/json:
              schema:
                type: object
                properties:
                  address:
                    type: object
                    properties: {}
                  securityStatus:
                    type: object
                    description: Security-related status for the user account.
                    properties: {}
                  preferences:
                    type: object
                    description: User's personalized preferences for the platform.
                    properties:
                      notificationChannels:
                        type: object
                        description: Preferred channels for receiving notifications.
                        properties: {}
                required:
                  - email
                  - id
                  - identityVerified
                  - name
              example:
                id: user-quantum-visionary-001
                name: Quantum Visionary Pro
                email: quantum.visionary@demobank.com
                phone: +1-555-999-0000
                dateOfBirth: '1980-01-15'
                address:
                  street: 100 Innovation Drive
                  city: Quantumville
                  state: CA
                  zip: '90210'
                  country: USA
                loyaltyTier: Zenith Platinum
                loyaltyPoints: 12500
                gamificationLevel: 7
                aiPersona: Prudent Planner
                securityStatus:
                  twoFactorEnabled: true
                  biometricsEnrolled: true
                  lastLogin: '2024-07-22T08:00:00Z'
                  lastLoginIp: 203.0.113.45
                preferences:
                  preferredLanguage: en-US
                  theme: Dark-Quantum
                  aiInteractionMode: balanced
                  notificationChannels:
                    email: true
                    push: true
                    sms: false
                    inApp: true
                  dataSharingConsent: true
                  transactionGrouping: category
                identityVerified: true
        '400':
          description: Common bad request error
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Invalid or missing authentication credentials
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: Insufficient permissions
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - users
        - me
      description: >-
        Updates selected fields of the currently authenticated user's profile
        information.
      requestBody:
        content:
          application/json:
            schema:
              description: Fields that can be updated in a user's profile.
              type: object
              properties:
                address:
                  type: object
                  properties: {}
                preferences:
                  type: object
                  description: User's personalized preferences for the platform.
                  properties:
                    notificationChannels:
                      type: object
                      description: Preferred channels for receiving notifications.
                      properties: {}
            example:
              name: Quantum Visionary Pro
              phone: +1-555-999-0000
  /accounts/me:
    get:
      summary: List Linked Financial Accounts
      parameters:
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
      responses:
        '200':
          description: A paginated, detailed list of linked financial accounts.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 2
                data:
                  - id: acc_chase_checking_4567
                    externalId: plaid_acc_abc123
                    name: Chase Checking
                    institutionName: Chase Bank
                    mask: '4567'
                    type: depository
                    subtype: checking
                    currency: USD
                    currentBalance: 1250.75
                    availableBalance: 1200
                    lastUpdated: '2024-07-22T10:45:00Z'
                  - id: acc_fidelity_ira_1234
                    externalId: plaid_acc_def456
                    name: Fidelity IRA
                    institutionName: Fidelity Investments
                    mask: '1234'
                    type: investment
                    subtype: ira
                    currency: USD
                    currentBalance: 150000.5
                    availableBalance: 149000
                    lastUpdated: '2024-07-22T10:45:00Z'
                nextOffset: 2
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - accounts
        - me
      description: >-
        Fetches a comprehensive, real-time list of all external financial
        accounts linked to the user's  profile, including consolidated balances
        and institutional details.
  /accounts/{accountId}/details:
    get:
      summary: Get Detailed Account Analytics & Forecasts
      responses:
        '200':
          description: Detailed account information with analytics and forecasts.
          content:
            application/json:
              schema:
                allOf:
                  - description: Summary information for a linked financial account.
                    type: object
                    properties: {}
                    required:
                      - currency
                      - currentBalance
                      - id
                      - institutionName
                      - lastUpdated
                      - name
                      - type
                  - type: object
                    properties:
                      projectedCashFlow:
                        type: object
                        properties: {}
              example:
                id: acc_chase_checking_4567
                externalId: plaid_acc_abc123
                name: Chase Checking
                institutionName: Chase Bank
                mask: '4567'
                type: depository
                subtype: checking
                currency: USD
                currentBalance: 1250.75
                availableBalance: 1200
                lastUpdated: '2024-07-22T10:45:00Z'
                accountHolder: The Quantum Visionary
                interestRate: 0.01
                openedDate: '2020-03-01'
                transactionsCount: 150
                projectedCashFlow:
                  days30: 500
                  days90: 1200
                  confidenceScore: 85
                balanceHistory:
                  - date: '2024-07-21'
                    balance: 1230.5
                  - date: '2024-07-20'
                    balance: 1500
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - accounts
        - '{accountId}'
        - details
      description: >-
        Retrieves comprehensive analytics for a specific financial account,
        including historical balance trends, projected cash flow, and AI-driven
        insights into spending patterns.
    parameters:
      - name: accountId
        in: path
        required: true
        description: Unique identifier for the financial account.
        schema:
          type: string
        example: acc_chase_checking_4567
  /accounts/{accountId}/transactions/pending:
    get:
      summary: Get Pending Transactions for an Account
      parameters:
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
      responses:
        '200':
          description: A paginated list of pending transactions.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 2
                data:
                  - id: txn_pending-123
                    accountId: acc_chase_checking_4567
                    type: expense
                    category: Shopping
                    aiCategoryConfidence: 0.85
                    description: Amazon.com
                    amount: 75.2
                    currency: USD
                    date: '2024-07-22'
                    carbonFootprint: 0.5
                    paymentChannel: online
                    disputeStatus: none
                  - id: txn_pending-456
                    accountId: acc_chase_checking_4567
                    type: expense
                    category: Utilities
                    aiCategoryConfidence: 0.9
                    description: Electric Bill
                    amount: 110
                    currency: USD
                    date: '2024-07-22'
                    carbonFootprint: 2
                    paymentChannel: bill_payment
                    disputeStatus: none
                nextOffset: 2
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - accounts
        - '{accountId}'
        - transactions
        - pending
      description: >-
        Retrieves a list of pending transactions that have not yet cleared for a
        specific financial account.
    parameters:
      - name: accountId
        in: path
        required: true
        description: Unique identifier for the financial account.
        schema:
          type: string
        example: acc_chase_checking_4567
  /accounts/{accountId}/statements:
    get:
      summary: Retrieve Account Statements
      parameters:
        - name: year
          in: query
          description: Year for the statement.
          schema:
            type: integer
          example: '2024'
        - name: month
          in: query
          description: Month for the statement (1-12).
          schema:
            type: integer
          example: '7'
        - name: format
          in: query
          description: >-
            Desired format for the statement. Use 'application/json' Accept
            header for download links.
          schema:
            type: string
          example: pdf
      responses:
        '200':
          description: >-
            Account statement metadata with download links, or direct download
            in requested format.
          content:
            application/json:
              schema:
                type: object
                properties:
                  downloadUrls:
                    type: object
                    description: Map of available download URLs for different formats.
                    properties: {}
                required:
                  - accountId
                  - downloadUrls
                  - period
                  - statementId
              example:
                statementId: stmt_acc123_202407
                accountId: acc_chase_checking_4567
                period: July 2024
                downloadUrls:
                  pdf: https://demobank.com/statements/acc123_202407.pdf?sig=...
                  csv: https://demobank.com/statements/acc123_202407.csv?sig=...
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - accounts
        - '{accountId}'
        - statements
      description: >-
        Fetches digital statements for a specific account, allowing filtering by
        date range and format.
    parameters:
      - name: accountId
        in: path
        required: true
        description: Unique identifier for the financial account.
        schema:
          type: string
        example: acc_chase_checking_4567
  /accounts/{accountId}/overdraft-settings:
    get:
      summary: Get Overdraft Protection Settings
      responses:
        '200':
          description: Overdraft settings for the account.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - accountId
                  - enabled
                  - feePreference
              example:
                accountId: acc_chase_checking_4567
                enabled: true
                protectionLimit: 500
                linkToSavings: true
                linkedSavingsAccountId: acc_chase_savings_1234
                feePreference: always_pay
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - accounts
        - '{accountId}'
        - overdraft-settings
      description: >-
        Retrieves the current overdraft protection settings for a specific
        account.
    parameters:
      - name: accountId
        in: path
        required: true
        description: Unique identifier for the financial account.
        schema:
          type: string
        example: acc_chase_checking_4567
    put:
      summary: Update Overdraft Protection Settings
      responses:
        '200':
          description: Overdraft settings updated successfully.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - accountId
                  - enabled
                  - feePreference
              example:
                accountId: acc_chase_checking_4567
                enabled: false
                feePreference: decline_if_over_limit
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - accounts
        - '{accountId}'
        - overdraft-settings
      description: >-
        Updates the overdraft protection settings for a specific account,
        enabling or disabling protection and configuring preferences.
      requestBody:
        content:
          application/json:
            schema:
              description: Fields for updating overdraft protection settings.
              type: object
              properties: {}
            example:
              enabled: false
              linkToSavings: false
              feePreference: decline_if_over_limit
  /accounts/link:
    post:
      summary: Initiate Linking a New External Institution
      responses:
        '200':
          description: >-
            Account linking initiated. Provides a URI for the user to complete
            the connection securely.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - authUri
                  - linkSessionId
                  - status
              example:
                linkSessionId: link_session_xyz789
                authUri: >-
                  https://auth.plaid.com/oauth/initiate?client_id=...&redirect_uri=...
                status: pending_user_action
                message: >-
                  Please redirect user to the provided URI to complete
                  authentication.
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - accounts
        - link
      description: >-
        Begins the secure process of linking a new external financial
        institution (e.g., another bank, investment platform) to the user's 
        profile, typically involving a third-party tokenized flow.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties: {}
              required:
                - countryCode
                - institutionName
            example:
              institutionName: Bank of America
              countryCode: US
  /transactions/{transactionId}/categorize:
    put:
      summary: Manually Categorize or Recategorize a Transaction
      responses:
        '200':
          description: Transaction category updated successfully.
          content:
            application/json:
              schema:
                type: object
                properties:
                  merchantDetails:
                    type: object
                    description: >-
                      Detailed information about a merchant associated with a
                      transaction.
                    properties:
                      address:
                        type: object
                        properties: {}
                  location:
                    type: object
                    description: Geographic location details for a transaction.
                    properties: {}
                required:
                  - accountId
                  - amount
                  - category
                  - currency
                  - date
                  - description
                  - id
                  - type
              example:
                id: txn_quantum-2024-07-21-A7B8C9
                accountId: acc_chase_checking_4567
                type: expense
                category: Home > Groceries
                aiCategoryConfidence: 0.98
                description: Coffee Shop - Quantum Cafe
                amount: 12.5
                currency: USD
                date: '2024-07-21'
                postedDate: '2024-07-22'
                carbonFootprint: 1.2
                paymentChannel: in_store
                tags:
                  - work_lunch
                disputeStatus: none
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - transactions
        - '{transactionId}'
        - categorize
      description: >-
        Allows the user to override or refine the AI's categorization for a
        transaction, improving future AI accuracy and personal financial
        reporting.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties: {}
              required:
                - category
            example:
              category: Home > Groceries
              notes: Bulk purchase for party
              applyToFuture: true
    parameters:
      - name: transactionId
        in: path
        required: true
        description: Unique identifier for the transaction.
        schema:
          type: string
        example: txn_quantum-2024-07-21-A7B8C9
  /transactions/{transactionId}/notes:
    put:
      summary: Add/Update Notes for a Transaction
      responses:
        '200':
          description: Transaction notes updated successfully.
          content:
            application/json:
              schema:
                type: object
                properties:
                  merchantDetails:
                    type: object
                    description: >-
                      Detailed information about a merchant associated with a
                      transaction.
                    properties:
                      address:
                        type: object
                        properties: {}
                  location:
                    type: object
                    description: Geographic location details for a transaction.
                    properties: {}
                required:
                  - accountId
                  - amount
                  - category
                  - currency
                  - date
                  - description
                  - id
                  - type
              example:
                id: txn_quantum-2024-07-21-A7B8C9
                accountId: acc_chase_checking_4567
                type: expense
                category: Dining & Restaurants
                aiCategoryConfidence: 0.92
                description: Coffee Shop - Quantum Cafe
                amount: 12.5
                currency: USD
                date: '2024-07-21'
                postedDate: '2024-07-22'
                carbonFootprint: 1.2
                paymentChannel: in_store
                tags:
                  - work_lunch
                receiptUrl: https://demobank.com/receipts/txn_1a2b3c4d5e.pdf
                disputeStatus: none
                notes: This was a special coffee for a client meeting.
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - transactions
        - '{transactionId}'
        - notes
      description: >-
        Allows the user to add or update personal notes for a specific
        transaction.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties: {}
              required:
                - notes
            example:
              notes: This was a special coffee for a client meeting.
    parameters:
      - name: transactionId
        in: path
        required: true
        description: Unique identifier for the transaction.
        schema:
          type: string
        example: txn_quantum-2024-07-21-A7B8C9
  /transactions/{transactionId}:
    get:
      summary: Get Detailed Transaction by ID
      responses:
        '200':
          description: The requested transaction details with enhanced data.
          content:
            application/json:
              schema:
                type: object
                properties:
                  merchantDetails:
                    type: object
                    description: >-
                      Detailed information about a merchant associated with a
                      transaction.
                    properties:
                      address:
                        type: object
                        properties: {}
                  location:
                    type: object
                    description: Geographic location details for a transaction.
                    properties: {}
                required:
                  - accountId
                  - amount
                  - category
                  - currency
                  - date
                  - description
                  - id
                  - type
              example:
                id: txn_quantum-2024-07-21-A7B8C9
                accountId: acc_chase_checking_4567
                type: expense
                category: Dining & Restaurants
                aiCategoryConfidence: 0.92
                description: Coffee Shop - Quantum Cafe
                merchantDetails:
                  name: Quantum Cafe
                  logoUrl: https://assets.demobank.com/merchants/quantum_cafe.png
                  website: https://quantum.cafe
                  address:
                    city: Quantumville
                    state: CA
                    zip: '90210'
                amount: 12.5
                currency: USD
                date: '2024-07-21'
                postedDate: '2024-07-22'
                carbonFootprint: 1.2
                location:
                  latitude: 34.0522
                  longitude: -118.2437
                  city: Los Angeles
                paymentChannel: in_store
                tags:
                  - work_lunch
                receiptUrl: https://demobank.com/receipts/txn_1a2b3c4d5e.pdf
                disputeStatus: none
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - transactions
        - '{transactionId}'
      description: >-
        Retrieves granular information for a single transaction by its unique
        ID, including AI categorization confidence, merchant details, and
        associated carbon footprint.
    parameters:
      - name: transactionId
        in: path
        required: true
        description: Unique identifier for the transaction.
        schema:
          type: string
        example: txn_quantum-2024-07-21-A7B8C9
  /transactions/recurring:
    get:
      summary: List Recurring Transactions
      parameters:
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
      responses:
        '200':
          description: A paginated list of recurring transactions.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 2
                data:
                  - id: rec_txn_netflix_001
                    description: Netflix Subscription
                    category: Entertainment
                    amount: 19.99
                    currency: USD
                    frequency: monthly
                    nextDueDate: '2024-08-01'
                    lastPaidDate: '2024-07-01'
                    status: active
                    linkedAccountId: acc_chase_checking_4567
                    aiConfidenceScore: 0.95
                  - id: rec_txn_gym_002
                    description: Gym Membership
                    category: Health & Fitness
                    amount: 49
                    currency: USD
                    frequency: monthly
                    nextDueDate: '2024-08-15'
                    lastPaidDate: '2024-07-15'
                    status: active
                    linkedAccountId: acc_chase_checking_4567
                    aiConfidenceScore: 0.99
                nextOffset: 2
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - transactions
        - recurring
      description: >-
        Retrieves a list of all detected or user-defined recurring transactions,
        useful for budget tracking and subscription management.
  /transactions/insights/spending-trends:
    get:
      summary: Get AI-Driven Spending Trends
      responses:
        '200':
          description: Spending trends analysis.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - aiInsights
                  - forecastNextMonth
                  - overallTrend
                  - percentageChange
                  - period
                  - topCategoriesByChange
              example:
                period: Last 3 Months
                overallTrend: increasing
                percentageChange: 5.2
                topCategoriesByChange:
                  - category: Dining & Restaurants
                    percentageChange: 15
                    absoluteChange: 120
                  - category: Groceries
                    percentageChange: 8
                    absoluteChange: 50
                aiInsights:
                  - id: insight-spending-alert-001
                    title: High Dining Spend Alert
                    description: >-
                      Your dining expenses this month are 35% higher than your
                      average, potentially impacting your budget by $150.
                    category: spending
                    severity: medium
                    actionableRecommendation: >-
                      Consider utilizing the 'Budget Optimizer' tool to adjust
                      your dining budget or explore meal prep options.
                    timestamp: '2024-07-22T11:45:00Z'
                forecastNextMonth: 2850
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - transactions
        - insights
        - spending-trends
      description: >-
        Retrieves AI-generated insights into user spending trends over time,
        identifying patterns and anomalies.
  /transactions:
    get:
      summary: List & Filter Transactions with Advanced Options
      parameters:
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
        - name: type
          in: query
          description: Filter transactions by type (e.g., income, expense, transfer).
          schema:
            type: string
          example: expense
        - name: category
          in: query
          description: Filter transactions by their AI-assigned or user-defined category.
          schema:
            type: string
          example: Groceries
        - name: startDate
          in: query
          description: Retrieve transactions from this date (inclusive).
          schema:
            type: string
          example: '2024-01-01'
        - name: endDate
          in: query
          description: Retrieve transactions up to this date (inclusive).
          schema:
            type: string
          example: '2024-12-31'
        - name: minAmount
          in: query
          description: >-
            Filter for transactions with an amount greater than or equal to this
            value.
          schema:
            type: integer
          example: '20'
        - name: maxAmount
          in: query
          description: >-
            Filter for transactions with an amount less than or equal to this
            value.
          schema:
            type: integer
          example: '100'
        - name: searchQuery
          in: query
          description: >-
            Free-text search across transaction descriptions, merchants, and
            notes.
          schema:
            type: string
          example: Starbucks
      responses:
        '200':
          description: A paginated, intelligently filtered list of transactions.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 5
                data:
                  - id: txn_quantum-2024-07-21-A7B8C9
                    accountId: acc_chase_checking_4567
                    type: expense
                    category: Dining & Restaurants
                    aiCategoryConfidence: 0.92
                    description: Coffee Shop - Quantum Cafe
                    merchantDetails:
                      name: Quantum Cafe
                      logoUrl: https://assets.demobank.com/merchants/quantum_cafe.png
                      website: https://quantum.cafe
                      address:
                        city: Quantumville
                        state: CA
                        zip: '90210'
                    amount: 12.5
                    currency: USD
                    date: '2024-07-21'
                    postedDate: '2024-07-22'
                    carbonFootprint: 1.2
                    paymentChannel: in_store
                    tags:
                      - work_lunch
                    disputeStatus: none
                  - id: txn_quantum-2024-07-20-B1C2D3
                    accountId: acc_chase_checking_4567
                    type: expense
                    category: Groceries
                    aiCategoryConfidence: 0.95
                    description: Whole Foods Market
                    merchantDetails:
                      name: Whole Foods Market
                      logoUrl: https://assets.demobank.com/merchants/whole_foods.png
                      website: https://wholefoodsmarket.com
                      address:
                        city: Quantumville
                        state: CA
                        zip: '90210'
                    amount: 85.3
                    currency: USD
                    date: '2024-07-20'
                    postedDate: '2024-07-20'
                    carbonFootprint: 5.5
                    paymentChannel: in_store
                    tags:
                      - weekly_shop
                    disputeStatus: none
                nextOffset: 2
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - transactions
      description: >-
        Retrieves a paginated list of the user's transactions, with extensive
        options for filtering by type, category, date range, amount, and
        intelligent AI-driven sorting and search capabilities.
  /budgets/{budgetId}:
    get:
      summary: Get Detailed Budget Information
      responses:
        '200':
          description: Detailed budget information.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - alertThreshold
                  - categories
                  - endDate
                  - id
                  - name
                  - period
                  - remainingAmount
                  - spentAmount
                  - startDate
                  - status
                  - totalAmount
              example:
                id: budget_monthly_aug
                name: August 2024 Household Budget
                period: monthly
                startDate: '2024-08-01'
                endDate: '2024-08-31'
                totalAmount: 3000
                spentAmount: 1200.5
                remainingAmount: 1799.5
                categories:
                  - name: Groceries
                    allocated: 500
                    spent: 250.75
                    remaining: 249.25
                  - name: Utilities
                    allocated: 150
                    spent: 110
                    remaining: 40
                  - name: Dining & Restaurants
                    allocated: 300
                    spent: 350
                    remaining: -50
                status: active
                alertThreshold: 80
                aiRecommendations:
                  - id: insight-budget-overspend-001
                    title: Dining Budget Exceeded
                    description: >-
                      You've exceeded your dining budget by $50. Consider
                      reallocating funds or reducing future dining expenses.
                    category: budget
                    severity: medium
                    actionableRecommendation: >-
                      Adjust your 'Dining & Restaurants' category or use the
                      'Budget Optimizer' tool.
                    timestamp: '2024-07-22T13:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - budgets
        - '{budgetId}'
      description: >-
        Retrieves detailed information for a specific budget, including current
        spending, remaining amounts, and AI recommendations.
    parameters:
      - name: budgetId
        in: path
        required: true
        description: Unique identifier for the budget.
        schema:
          type: string
        example: budget_monthly_aug
    put:
      summary: Update an Existing Budget
      responses:
        '200':
          description: Budget updated successfully.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - alertThreshold
                  - categories
                  - endDate
                  - id
                  - name
                  - period
                  - remainingAmount
                  - spentAmount
                  - startDate
                  - status
                  - totalAmount
              example:
                id: budget_monthly_aug
                name: August 2024 Household Budget
                period: monthly
                startDate: '2024-08-01'
                endDate: '2024-08-31'
                totalAmount: 3200
                spentAmount: 1200.5
                remainingAmount: 1999.5
                categories:
                  - name: Groceries
                    allocated: 500
                    spent: 250.75
                    remaining: 249.25
                status: active
                alertThreshold: 85
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - budgets
        - '{budgetId}'
      description: >-
        Updates the parameters of an existing budget, such as total amount,
        dates, or categories.
      requestBody:
        content:
          application/json:
            schema:
              description: Fields that can be updated for an existing budget.
              type: object
              properties: {}
            example:
              totalAmount: 3200
              alertThreshold: 85
  /budgets:
    get:
      summary: List All User Budgets
      parameters:
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
      responses:
        '200':
          description: A paginated list of user budgets.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 2
                data:
                  - id: budget_monthly_aug
                    name: August 2024 Household Budget
                    period: monthly
                    startDate: '2024-08-01'
                    endDate: '2024-08-31'
                    totalAmount: 3000
                    spentAmount: 1200.5
                    remainingAmount: 1799.5
                    categories:
                      - name: Groceries
                        allocated: 500
                        spent: 250.75
                        remaining: 249.25
                      - name: Utilities
                        allocated: 150
                        spent: 110
                        remaining: 40
                    status: active
                    alertThreshold: 80
                  - id: budget_vacation_2025
                    name: 2025 Europe Trip
                    period: yearly
                    startDate: '2024-01-01'
                    endDate: '2025-12-31'
                    totalAmount: 5000
                    spentAmount: 1500
                    remainingAmount: 3500
                    categories:
                      - name: Flights
                        allocated: 2000
                        spent: 800
                        remaining: 1200
                    status: active
                    alertThreshold: 90
                nextOffset: 2
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - budgets
      description: >-
        Retrieves a list of all active and historical budgets for the
        authenticated user.
  /investments/portfolios/{portfolioId}/rebalance:
    post:
      summary: Initiate AI-Driven Portfolio Rebalancing
      responses:
        '202':
          description: >-
            Portfolio rebalancing initiated. Details will be provided
            asynchronously.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - portfolioId
                  - rebalanceId
                  - status
                  - statusMessage
              example:
                rebalanceId: rebal_port_growth_123
                portfolioId: portfolio_equity_growth
                status: analyzing
                statusMessage: >-
                  AI is analyzing optimal trade strategy to match target risk
                  profile.
                estimatedImpact: Projected 5% reduction in portfolio volatility.
                confirmationRequired: true
                confirmationExpiresAt: '2024-07-22T15:00:00Z'
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - investments
        - portfolios
        - '{portfolioId}'
        - rebalance
      description: >-
        Triggers an AI-driven rebalancing process for a specific investment
        portfolio based on a target risk tolerance or strategy.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties: {}
              required:
                - targetRiskTolerance
            example:
              targetRiskTolerance: medium
              dryRun: true
              confirmationRequired: true
    parameters:
      - name: portfolioId
        in: path
        required: true
        description: Unique identifier for the investment portfolio.
        schema:
          type: string
        example: portfolio_equity_growth
  /investments/portfolios/{portfolioId}:
    get:
      summary: Get Detailed Investment Portfolio
      responses:
        '200':
          description: Detailed investment portfolio information.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - currency
                  - id
                  - lastUpdated
                  - name
                  - riskTolerance
                  - todayGainLoss
                  - totalValue
                  - type
                  - unrealizedGainLoss
              example:
                id: portfolio_equity_growth
                name: Aggressive Growth Portfolio
                type: equities
                currency: USD
                totalValue: 250000
                unrealizedGainLoss: 25000
                todayGainLoss: 500
                lastUpdated: '2024-07-22T10:00:00Z'
                riskTolerance: aggressive
                aiPerformanceInsights:
                  - id: insight-market-outlook-001
                    title: Strong Tech Sector Performance
                    description: >-
                      The AI predicts continued strong performance in the tech
                      sector, which currently forms a significant portion of
                      your portfolio.
                    category: investing
                    severity: low
                    timestamp: '2024-07-22T14:15:00Z'
                holdings:
                  - symbol: AAPL
                    name: Apple Inc.
                    quantity: 100
                    averageCost: 150
                    currentPrice: 180
                    marketValue: 18000
                    percentageOfPortfolio: 7.2
                    esgScore: 8.5
                  - symbol: MSFT
                    name: Microsoft Corp.
                    quantity: 50
                    averageCost: 300
                    currentPrice: 320
                    marketValue: 16000
                    percentageOfPortfolio: 6.4
                    esgScore: 8.9
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - investments
        - portfolios
        - '{portfolioId}'
      description: >-
        Retrieves detailed information for a specific investment portfolio,
        including holdings, performance, and AI insights.
    parameters:
      - name: portfolioId
        in: path
        required: true
        description: Unique identifier for the investment portfolio.
        schema:
          type: string
        example: portfolio_equity_growth
    put:
      summary: Update Investment Portfolio Details
      responses:
        '200':
          description: Investment portfolio updated successfully.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - currency
                  - id
                  - lastUpdated
                  - name
                  - riskTolerance
                  - todayGainLoss
                  - totalValue
                  - type
                  - unrealizedGainLoss
              example:
                id: portfolio_equity_growth
                name: Aggressive Growth Portfolio
                type: equities
                currency: USD
                totalValue: 250000
                unrealizedGainLoss: 25000
                todayGainLoss: 500
                lastUpdated: '2024-07-22T14:30:00Z'
                riskTolerance: medium
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - investments
        - portfolios
        - '{portfolioId}'
      description: >-
        Updates high-level details of an investment portfolio, such as name or
        risk tolerance.
      requestBody:
        content:
          application/json:
            schema:
              description: Fields that can be updated for an investment portfolio.
              type: object
              properties: {}
            example:
              riskTolerance: medium
              aiRebalancingFrequency: quarterly
  /investments/portfolios:
    get:
      summary: List All Investment Portfolios
      parameters:
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
      responses:
        '200':
          description: A paginated list of investment portfolios.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 2
                data:
                  - id: portfolio_equity_growth
                    name: Aggressive Growth Portfolio
                    type: equities
                    currency: USD
                    totalValue: 250000
                    unrealizedGainLoss: 25000
                    todayGainLoss: 500
                    lastUpdated: '2024-07-22T10:00:00Z'
                    riskTolerance: aggressive
                  - id: portfolio_retirement_bond
                    name: Retirement Bond Portfolio
                    type: bonds
                    currency: USD
                    totalValue: 180000
                    unrealizedGainLoss: 5000
                    todayGainLoss: 100
                    lastUpdated: '2024-07-22T10:00:00Z'
                    riskTolerance: low
                nextOffset: 2
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - investments
        - portfolios
      description: >-
        Retrieves a summary of all investment portfolios linked to the user's
        account.
  /investments/assets/search:
    get:
      summary: Search for Investment Assets with ESG Scores
      parameters:
        - name: query
          in: query
          description: Search query for asset name or symbol.
          schema:
            type: string
          example: Tesla
        - name: minESGScore
          in: query
          description: Minimum desired ESG score (0-10).
          schema:
            type: integer
          example: '7'
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
      responses:
        '200':
          description: A paginated list of investment assets with ESG data.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 2
                data:
                  - assetSymbol: TSLA
                    assetName: Tesla Inc.
                    assetType: stock
                    currentPrice: 250.75
                    currency: USD
                    overallESGScore: 9.1
                    environmentalScore: 9.5
                    socialScore: 8.8
                    governanceScore: 9
                    esgRatingProvider: MSCI
                    esgControversies:
                      - Labor Practices Controversy
                    aiESGInsight: >-
                      Tesla's high environmental score is driven by its focus on
                      sustainable transportation, though social scores reflect
                      recent labor concerns.
                  - assetSymbol: Vanguard Total Stock Market ETF
                    assetName: Vanguard Total Stock Market ETF
                    assetType: etf
                    currentPrice: 200
                    currency: USD
                    overallESGScore: 7.8
                    environmentalScore: 7.5
                    socialScore: 8
                    governanceScore: 8
                    esgRatingProvider: Sustainalytics
                    esgControversies: []
                    aiESGInsight: >-
                      A broadly diversified ETF with a solid overall ESG
                      profile, reflecting average market performance in
                      sustainability.
                nextOffset: 2
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - investments
        - assets
        - search
      description: >-
        Searches for available investment assets (stocks, ETFs, mutual funds)
        and returns their ESG impact scores.
  /ai/advisor/chat/history:
    get:
      summary: Retrieve AI Advisor Conversation History
      parameters:
        - name: sessionId
          in: query
          description: >-
            Optional: Filter history by a specific session ID. If omitted,
            recent conversations will be returned.
          schema:
            type: string
          example: session-quantum-xyz-789-alpha
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
      responses:
        '200':
          description: Paginated list of chat messages.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 3
                data:
                  - role: user
                    content: What is my current net worth?
                    timestamp: '2024-07-22T18:00:00Z'
                  - role: assistant
                    content: >-
                      I've completed a detailed analysis of your spending. It
                      appears your dining expenses account for 35% of your total
                      outflows this month, significantly higher than your target.
                      Would you like me to identify specific areas for reduction or
                      suggest alternative dining options?
                    timestamp: '2024-07-22T18:01:00Z'
                  - role: user
                    content: Yes, please provide a breakdown.
                    timestamp: '2024-07-22T18:02:00Z'
                nextOffset: 2
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - ai
        - advisor
        - chat
        - history
      description: >-
        Fetches the full conversation history with the Quantum AI Advisor for a
        given session or user.
  /ai/advisor/chat:
    post:
      summary: Send a Message to the Quantum AI Advisor
      responses:
        '200':
          description: AI response with spending insights
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - sessionId
              example:
                text: >-
                  I've completed a detailed analysis of your spending. It
                  appears your dining expenses account for 35% of your total
                  outflows this month, significantly higher than your target.
                  Would you like me to identify specific areas for reduction or
                  suggest alternative dining options?
                sessionId: session-quantum-xyz-789-alpha
                proactiveInsights:
                  - id: insight-dining-overspend-002
                    title: High Dining Spend Alert
                    description: >-
                      Your dining expenses this month are 35% higher than your
                      average, potentially impacting your budget by $150.
                    category: spending
                    severity: medium
                    actionableRecommendation: >-
                      Consider utilizing the 'Budget Optimizer' tool to adjust
                      your dining budget or explore meal prep options.
                    timestamp: '2024-07-22T15:00:00Z'
        '400':
          description: Common bad request error
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Invalid or missing authentication credentials
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '503':
          description: AI service overloaded
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: AI_SERVICE_UNAVAILABLE
                message: >-
                  The Quantum AI Advisor service is temporarily overloaded.
                  Please try again in a few minutes.
                timestamp: '2024-07-22T15:05:00Z'
      tags:
        - ai
        - advisor
        - chat
      description: >-
        Initiates or continues a sophisticated conversation with Quantum, the AI
        Advisor. Quantum can provide advanced financial insights, execute
        complex tasks via an expanding suite of intelligent tools, and learn
        from user interactions to offer hyper-personalized guidance.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                functionResponse:
                  type: object
                  description: >-
                    Optional: The output from a tool function that the AI
                    previously requested to be executed.
                  properties: {}
              example:
                message: >-
                  Can you analyze my recent spending patterns and suggest areas
                  for saving, focusing on my dining expenses?
                sessionId: session-quantum-xyz-789-alpha
  /ai/advisor/tools:
    get:
      summary: List Available AI Tools for Quantum
      parameters:
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
      responses:
        '200':
          description: A paginated list of available AI tools.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 2
                data:
                  - name: send_money
                    description: >-
                      Sends money to a specified recipient from the user's
                      primary checking account.
                    parameters:
                      type: object
                      properties:
                        amount:
                          type: number
                          description: The amount of money to send.
                        recipient:
                          type: string
                          description: The name or ID of the recipient.
                        currency:
                          type: string
                          description: The currency of the transaction (e.g., USD, EUR).
                      required:
                        - amount
                        - recipient
                        - currency
                    accessScope: write:payments
                  - name: get_account_balance
                    description: >-
                      Retrieves the current balance of a specified financial
                      account.
                    parameters:
                      type: object
                      properties:
                        accountId:
                          type: string
                          description: The ID of the account.
                      required:
                        - accountId
                    accessScope: read:accounts
                nextOffset: 2
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - ai
        - advisor
        - tools
      description: >-
        Retrieves a dynamic manifest of all integrated AI tools that Quantum can
        invoke and execute, providing details on their capabilities, parameters,
        and access requirements.
  /ai/oracle/simulate/advanced:
    post:
      summary: Run an Advanced Multi-Variable Financial Simulation
      responses:
        '200':
          description: >-
            Advanced simulation completed successfully, returning granular
            impact analysis, sensitivity curves, and optimized strategies.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - overallSummary
                  - scenarioResults
                  - simulationId
              example:
                simulationId: sim_oracle-complex-macro-123
                overallSummary: >-
                  The advanced simulation reveals that a job loss scenario has a
                  significant initial impact on liquidity, but recovery is
                  highly dependent on market conditions and the duration of
                  unemployment. Proactive savings and diversified investments
                  are key mitigating factors.
                scenarioResults:
                  - scenarioName: Job Loss & Mild Market Recovery
                    narrativeSummary: >-
                      In this scenario, initial liquidity challenges are
                      observed, but a swift market recovery and prudent spending
                      lead to recovery within 3 years.
                    finalNetWorthProjected: 1250000
                    liquidityMetrics:
                      minCashBalance: -5000
                      recoveryTimeMonths: 36
                    sensitivityAnalysisGraphs:
                      - paramName: marketRecoveryRate
                        data:
                          - paramValue: 0.03
                            outcomeValue: 1100000
                          - paramValue: 0.05
                            outcomeValue: 1250000
                          - paramValue: 0.07
                            outcomeValue: 1400000
                strategicRecommendations:
                  - id: insight-emergency-fund-003
                    title: Strengthen Emergency Fund
                    description: >-
                      Maintain an emergency fund equivalent to 6-12 months of
                      living expenses to buffer against unexpected job loss.
                    category: saving
                    severity: high
                    actionableRecommendation: >-
                      Consult with treasury manager to explore investment
                      options.
                    timestamp: '2024-07-22T16:30:00Z'
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '503':
          description: >-
            AI simulation service is experiencing extended processing times or
            is unavailable for complex requests.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: SIMULATION_LONG_PROCESSING
                message: >-
                  AI simulation service is experiencing extended processing
                  times for complex requests. Please allow more time.
                timestamp: '2024-07-22T16:45:00Z'
      tags:
        - ai
        - oracle
        - simulate
        - advanced
      description: >-
        Engages the Quantum Oracle for highly complex, multi-variable
        simulations, allowing precise control over numerous financial
        parameters, market conditions, and personal events to generate deep,
        predictive insights and sensitivity analysis.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                globalEconomicFactors:
                  type: object
                  description: >-
                    Optional: Global economic conditions to apply to all
                    scenarios.
                  properties: {}
                personalAssumptions:
                  type: object
                  description: >-
                    Optional: Personal financial assumptions to override
                    defaults.
                  properties: {}
              required:
                - prompt
                - scenarios
            example:
              prompt: >-
                Evaluate the long-term impact of a sudden job loss combined with
                a variable market downturn, analyzing worst-case and best-case
                recovery scenarios over a decade.
              scenarios:
                - name: Job Loss & Mild Market Recovery
                  events:
                    - type: job_loss
                      details:
                        durationMonths: 6
                        severanceAmount: 10000
                        unemploymentBenefits: 2000
                    - type: market_downturn
                      details:
                        impactPercentage: 0.15
                        recoveryYears: 3
                  durationYears: 10
                  sensitivityAnalysisParams:
                    - paramName: marketRecoveryRate
                      min: 0.03
                      max: 0.07
                      step: 0.01
  /ai/oracle/simulate:
    post:
      summary: Run a 'What-If' Financial Simulation (Standard)
      responses:
        '200':
          description: >-
            The simulation was successful. The response contains a detailed
            impact analysis and actionable recommendations.
          content:
            application/json:
              schema:
                type: object
                properties:
                  riskAnalysis:
                    type: object
                    description: AI-driven risk assessment of the simulated scenario.
                    properties: {}
                required:
                  - keyImpacts
                  - narrativeSummary
                  - simulationId
              example:
                simulationId: sim_oracle-growth-2024-xyz
                narrativeSummary: >-
                  If you consistently invest an additional $1,000 per month into
                  your aggressive growth portfolio over the next 5 years, the
                  Quantum Oracle predicts your portfolio could grow by
                  approximately 45-60%, significantly increasing your wealth.
                  However, this comes with elevated risk during market
                  downturns.
                keyImpacts:
                  - metric: Projected Portfolio Value
                    value: $120,000 - $140,000
                    severity: high
                  - metric: Overall Net Worth Increase
                    value: $60,000 - $70,000
                    severity: high
                recommendations:
                  - title: Review Portfolio Diversification
                    description: >-
                      Given the aggressive nature of this strategy, the Oracle
                      suggests reviewing your current portfolio diversification
                      to mitigate concentration risk.
                    actionTrigger: open_portfolio_diversification_tool
                riskAnalysis:
                  maxDrawdown: 0.25
                  volatilityIndex: 0.18
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '503':
          description: >-
            AI simulation service is temporarily unavailable due to high demand
            or maintenance.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: SIMULATION_SERVICE_UNAVAILABLE
                message: >-
                  AI simulation service is temporarily unavailable due to high
                  demand. Please try again shortly.
                timestamp: '2024-07-22T16:00:00Z'
      tags:
        - ai
        - oracle
        - simulate
      description: >-
        Submits a hypothetical scenario to the Quantum Oracle AI for standard
        financial impact analysis. The AI simulates the effect on the user's
        current financial state and provides a summary.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties: {}
              required:
                - prompt
            example:
              prompt: >-
                What if I invest an additional $1,000 per month into my
                aggressive growth portfolio for the next 5 years?
              parameters:
                durationYears: 5
                monthlyInvestmentAmount: 1000
                riskTolerance: aggressive
  /ai/oracle/simulations/{simulationId}:
    get:
      summary: Get Detailed Simulation Results
      responses:
        '200':
          description: Detailed simulation results.
          content:
            application/json:
              schema:
                oneOf:
                  - type: object
                    properties:
                      riskAnalysis:
                        type: object
                        description: AI-driven risk assessment of the simulated scenario.
                        properties: {}
                    required:
                      - keyImpacts
                      - narrativeSummary
                      - simulationId
                  - type: object
                    properties: {}
                    required:
                      - overallSummary
                      - scenarioResults
                      - simulationId
              example:
                simulationId: sim_oracle-growth-2024-xyz
                narrativeSummary: >-
                  If you consistently invest an additional $1,000 per month into
                  your aggressive growth portfolio over the next 5 years, the
                  Quantum Oracle predicts your portfolio could grow by
                  approximately 45-60%...
                keyImpacts:
                  - metric: Projected Portfolio Value
                    value: $120,000 - $140,000
                    severity: high
                recommendations:
                  - title: Review Portfolio Diversification
                    description: >-
                      Given the aggressive nature of this strategy, the Oracle
                      suggests reviewing your current portfolio diversification
                      to mitigate concentration risk.
                riskAnalysis:
                  maxDrawdown: 0.25
                  volatilityIndex: 0.18
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - ai
        - oracle
        - simulations
        - '{simulationId}'
      description: >-
        Retrieves the full, detailed results of a specific financial simulation
        by its ID.
    parameters:
      - name: simulationId
        in: path
        required: true
        description: Unique identifier for the financial simulation.
        schema:
          type: string
        example: sim_oracle-growth-2024-xyz
  /ai/oracle/simulations:
    get:
      summary: List All User Simulations
      parameters:
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
      responses:
        '200':
          description: A paginated list of financial simulations.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 3
                data:
                  - simulationId: sim_oracle-growth-2024-xyz
                    title: Investment Growth Scenario
                    status: completed
                    creationDate: '2024-07-20T10:00:00Z'
                    lastUpdated: '2024-07-20T10:15:00Z'
                    summary: >-
                      Simulated impact of additional monthly investments over 5
                      years.
                  - simulationId: sim_oracle-complex-macro-123
                    title: Job Loss & Market Downturn Impact
                    status: completed
                    creationDate: '2024-07-18T14:30:00Z'
                    lastUpdated: '2024-07-18T14:45:00Z'
                    summary: >-
                      Evaluated long-term impact of job loss with variable
                      market conditions.
                nextOffset: 2
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - ai
        - oracle
        - simulations
      description: >-
        Retrieves a list of all financial simulations previously run by the
        user, including their status and summaries.
  /ai/incubator/pitch/{pitchId}/details:
    get:
      summary: Get Detailed AI Analysis & Feedback for a Business Pitch
      responses:
        '200':
          description: >-
            Comprehensive details of the pitch's current state, AI feedback, and
            next steps.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - lastUpdated
                      - nextSteps
                      - pitchId
                      - stage
                      - statusMessage
                  - type: object
                    properties:
                      aiFinancialModel:
                        type: object
                        description: AI's detailed financial model analysis.
                        properties:
                          revenueBreakdown:
                            type: object
                            example:
                              Year 1: 2.5M
                              Year 2: 7.8M
                              Year 3: 15M
                          costStructureAnalysis:
                            type: object
                            example:
                              Fixed Costs: 30%
                              Variable Costs: 40%
                              R&D: 15%
                      aiMarketAnalysis:
                        type: object
                        description: AI's detailed market analysis.
                        properties: {}
                      aiCoachingPlan:
                        type: object
                        description: AI-generated coaching plan for the entrepreneur.
                        properties: {}
                      aiRiskAssessment:
                        type: object
                        description: AI's assessment of risks associated with the venture.
                        properties: {}
              example:
                pitchId: pitch_qw_synergychain-xyz
                stage: feedback_required
                statusMessage: >-
                  Quantum Weaver has completed its initial analysis. Please
                  review the feedback and answer the outstanding questions.
                lastUpdated: '2024-07-22T21:00:00Z'
                feedbackSummary: Initial analysis indicates a strong market fit, but further detail is required on customer acquisition costs and scaling strategy.
                questions:
                  - id: q_qa-team-001
                    question: >-
                      Please elaborate on the specific technical challenges you
                      anticipate in deploying your quantum-inspired algorithms
                      at scale, and how your team plans to mitigate these.
                    category: technology
                    isRequired: true
                  - id: q_qa-market-002
                    question: >-
                      Provide more granular projections for customer acquisition
                      cost (CAC) for the first 12 months.
                    category: market
                    isRequired: true
                nextSteps: >-
                  Please address the outstanding questions in the 'questions'
                  array and resubmit feedback.
                estimatedFundingOffer: 5000000
                aiFinancialModel:
                  revenueBreakdown:
                    Year 1: 2.5M
                    Year 2: 7.8M
                    Year 3: 15M
                  costStructureAnalysis:
                    Fixed Costs: 30%
                    Variable Costs: 40%
                    R&D: 15%
                  breakevenPoint: 18 months
                  capitalRequirements: 4500000
                  sensitivityAnalysis:
                    - scenario: Aggressive Growth
                      projectedIRR: 0.35
                      terminalValue: 50000000
                    - scenario: Moderate Growth
                      projectedIRR: 0.2
                      terminalValue: 30000000
                aiMarketAnalysis:
                  targetMarketSize: $50 Billion (TAM)
                  competitiveAdvantages:
                    - Proprietary AI Algorithm
                    - First-mover advantage in quantum-AI finance
                  growthOpportunities: >-
                    Expansion into APAC region, new product lines (e.g.,
                    corporate treasury solutions).
                  riskFactors: >-
                    Regulatory changes in AI governance, talent acquisition
                    challenges.
                aiCoachingPlan:
                  title: Pre-Seed Fundraising Strategy
                  summary: >-
                    This plan outlines key strategic steps to optimize your
                    pitch deck, identify target investors, and prepare for due
                    diligence to secure pre-seed funding.
                  steps:
                    - title: Refine Investor Presentation
                      description: >-
                        Update your pitch deck to incorporate recent market
                        validation data and clearly articulate the competitive
                        differentiation of SynergyChain AI, guided by feedback
                        from Quantum Weaver.
                      timeline: 1-2 weeks
                      status: pending
                      resources:
                        - name: Pitch Deck Template
                          url: https://demobank.com/resources/pitch-template.pptx
                    - title: Market Research Deep Dive
                      description: >-
                        Conduct further detailed market research to validate
                        customer acquisition cost assumptions for enterprise
                        clients.
                      timeline: 2 weeks
                      status: pending
                investorMatchScore: 0.88
                aiRiskAssessment:
                  technicalRisk: >-
                    Medium (complex AI development, quantum compute
                    dependencies)
                  marketRisk: >-
                    Low (established market, clear pain points, strong value
                    prop)
                  teamRisk: >-
                    Low (experienced founding team with relevant domain
                    expertise)
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - ai
        - incubator
        - pitch
        - '{pitchId}'
        - details
      description: >-
        Retrieves the granular AI-driven analysis, strategic feedback, market
        validation results, and any outstanding questions from Quantum Weaver
        for a specific business pitch.
    parameters:
      - name: pitchId
        in: path
        required: true
        description: Unique identifier for the business pitch.
        schema:
          type: string
        example: pitch_qw_synergychain-xyz
  /ai/incubator/pitch/{pitchId}/feedback:
    put:
      summary: Submit Feedback or Answers to AI Questions for a Business Pitch
      responses:
        '200':
          description: Feedback submitted successfully. Pitch status updated.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - lastUpdated
                  - nextSteps
                  - pitchId
                  - stage
                  - statusMessage
              example:
                pitchId: pitch_qw_synergychain-xyz
                stage: ai_analysis
                statusMessage: >-
                  Thank you for your feedback. Quantum Weaver is now
                  re-evaluating your pitch based on the new information.
                lastUpdated: '2024-07-22T22:00:00Z'
                feedbackSummary: Updated technical and market details provided.
                questions: []
                nextSteps: The AI will provide updated analysis and next steps shortly.
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - ai
        - incubator
        - pitch
        - '{pitchId}'
        - feedback
      description: >-
        Allows the entrepreneur to respond to specific questions or provide
        additional details requested by Quantum Weaver, moving the pitch forward
        in the incubation process.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties: {}
            example:
              feedback: >-
                Regarding the technical challenges, our team has allocated 3
                months for R&D on quantum-resistant cryptography, mitigating the
                risk. We've also brought in Dr. Elena Petrova, a leading expert
                in secure multi-party computation.
              answers:
                - questionId: q_qa-team-001
                  answer: >-
                    Our mitigation strategy includes dedicated R&D and new hires
                    with specific expertise.
                - questionId: q_qa-market-002
                  answer: >-
                    Our CAC projections are based on pilot program results
                    showing $500 per enterprise client with a conversion rate of
                    10% from trials.
    parameters:
      - name: pitchId
        in: path
        required: true
        description: Unique identifier for the business pitch.
        schema:
          type: string
        example: pitch_qw_synergychain-xyz
  /ai/incubator/pitch:
    post:
      summary: Submit a High-Potential Business Plan to Quantum Weaver
      responses:
        '202':
          description: >-
            The business plan was successfully ingested and is undergoing
            initial AI analysis. A unique pitch ID is provided for tracking
            progress.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - lastUpdated
                  - nextSteps
                  - pitchId
                  - stage
                  - statusMessage
              example:
                pitchId: pitch_qw_synergychain-xyz
                stage: initial_review
                statusMessage: >-
                  Your business plan has been received and is undergoing initial
                  review by Quantum Weaver.
                lastUpdated: '2024-07-22T20:00:00Z'
                nextSteps: >-
                  Please monitor for AI-generated feedback and potential
                  questions within the next 48 hours.
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '409':
          description: >-
            The request could not be completed due to a conflict with the
            current state of the resource (e.g., duplicate entry, expired
            state).
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: RESOURCE_CONFLICT
                message: >-
                  A resource with this identifier already exists or the
                  operation conflicts with an existing state.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - ai
        - incubator
        - pitch
      description: >-
        Submits a detailed business plan to the Quantum Weaver AI for rigorous
        analysis, market validation, and seed funding consideration. This
        initiates the AI-driven incubation journey, aiming to transform
        innovative ideas into commercially successful ventures.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                financialProjections:
                  type: object
                  description: >-
                    Key financial metrics and projections for the next 3-5
                    years.
                  properties: {}
              required:
                - businessPlan
                - financialProjections
                - foundingTeam
                - marketOpportunity
            example:
              businessPlan: >-
                Quantum-AI powered financial advisor platform leveraging neural
                networks for predictive analytics and hyper-personalized
                advice...
              foundingTeam:
                - name: Dr. Eleanor Vance
                  role: CEO & Lead AI Scientist
                  experience: >-
                    15+ years in AI/ML, PhD in Quantum Computing, ex-Google
                    Brain
                - name: Marcus Thorne
                  role: COO & Finance Expert
                  experience: 20+ years in Fintech, ex-Goldman Sachs
              marketOpportunity: >-
                The booming digital finance market coupled with demand for truly
                personalized, AI-driven financial guidance presents a
                multi-billion dollar opportunity. Our unique quantum-AI approach
                provides unparalleled accuracy and foresight.
              financialProjections:
                seedRoundAmount: 2500000
                valuationPreMoney: 10000000
                projectionYears: 3
                revenueForecast:
                  - 500000
                  - 2000000
                  - 6000000
                profitabilityEstimate: Achieve profitability within 18 months.
  /ai/incubator/pitches:
    get:
      summary: List All User Business Pitches
      parameters:
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
        - name: status
          in: query
          description: Filter pitches by their current stage.
          schema:
            type: string
          example: feedback_required
      responses:
        '200':
          description: A paginated list of business pitches.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 3
                data:
                  - pitchId: pitch_qw_synergychain-xyz
                    stage: feedback_required
                    statusMessage: >-
                      Quantum Weaver has completed its initial analysis. Please
                      review the feedback and answer the outstanding questions.
                    lastUpdated: '2024-07-22T21:00:00Z'
                    feedbackSummary: >-
                      Initial analysis indicates a strong market fit, but
                      further detail is required on customer acquisition costs
                      and scaling strategy.
                    questions:
                      - id: q_qa-team-001
                        question: Please elaborate on technical challenges.
                        category: technology
                        isRequired: true
                    nextSteps: Please address the outstanding questions.
                  - pitchId: pitch_qw_fintech-ai-app
                    stage: approved_for_funding
                    statusMessage: >-
                      Congratulations! Your pitch has been approved for seed
                      funding.
                    lastUpdated: '2024-07-15T10:00:00Z'
                    estimatedFundingOffer: 1000000
                    nextSteps: Contact our investment team to finalize terms.
                nextOffset: 2
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - ai
        - incubator
        - pitches
      description: >-
        Retrieves a summary list of all business pitches submitted by the
        authenticated user to Quantum Weaver.
  /ai/ads/generate:
    post:
      summary: Generate a Standard Video Ad with Veo 2.0
      responses:
        '202':
          description: >-
            Video generation initiated. The response contains an operation ID to
            poll for status updates and retrieve the final asset.
          content:
            application/json:
              schema:
                type: object
                properties: {}
              example:
                operationId: op-video-gen-12345-abcde
                estimatedCompletionTimeSeconds: 300
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - ai
        - ads
        - generate
      description: >-
        Submits a request to generate a high-quality video ad using the advanced
        Veo 2.0 generative AI model. This is an asynchronous operation, suitable
        for standard ad content creation.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties: {}
              required:
                - lengthSeconds
                - prompt
                - style
            example:
              prompt: >-
                A captivating ad featuring a young entrepreneur using 's AI
                tools to grow their startup. Focus on innovation and ease of
                use.
              style: Cinematic
              lengthSeconds: 15
              aspectRatio: '16:9'
              brandColors:
                - '#0000FF'
                - '#FFD700'
  /ai/ads/operations/{operationId}:
    get:
      summary: Get Video Generation Status & Retrieve Asset
      responses:
        '200':
          description: Video generation in progress
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - message
                  - operationId
                  - progressPercentage
                  - status
              example:
                operationId: op-video-gen-12345-abcde
                status: rendering
                progressPercentage: 75
                message: Encoding final video with optimized codecs...
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - ai
        - ads
        - operations
        - '{operationId}'
      description: >-
        Polls the real-time status of an asynchronous video generation
        operation. Once complete ('done'), the response includes a temporary,
        signed URL to access and download the generated video asset.
    parameters:
      - name: operationId
        in: path
        required: true
        description: The unique identifier for the video generation operation.
        schema:
          type: string
        example: op-video-gen-12345-abcde
  /ai/ads:
    get:
      summary: List All Generated Video Ads
      parameters:
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
        - name: status
          in: query
          description: Filter ads by their generation status.
          schema:
            type: string
          example: done
      responses:
        '200':
          description: A paginated list of generated video ads.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 3
                data:
                  - operationId: op-video-gen-12345-abcde
                    status: done
                    progressPercentage: 100
                    message: Video generation successfully completed.
                    videoUri: >-
                      https://demobank-cdn.com/generated-videos/final/1a2b3c4d.mp4?sig=eyJ...
                    previewImageUri: >-
                      https://demobank-cdn.com/generated-videos/preview/1a2b3c4d.png
                  - operationId: op-adv-video-gen-xyz789-fghjk
                    status: done
                    progressPercentage: 100
                    message: Advanced video generation completed.
                    videoUri: >-
                      https://demobank-cdn.com/generated-videos/final/adv_1a2b3c4d.mp4?sig=eyJ...
                    previewImageUri: >-
                      https://demobank-cdn.com/generated-videos/preview/adv_1a2b3c4d.png
                nextOffset: 2
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - ai
        - ads
      description: >-
        Retrieves a list of all video advertisements previously generated by the
        user in the AI Ad Studio.
  /corporate/cards/{cardId}/controls:
    put:
      summary: Update Granular Corporate Card Spending Controls
      responses:
        '200':
          description: The corporate card with its advanced controls updated successfully.
          content:
            application/json:
              schema:
                type: object
                properties:
                  controls:
                    type: object
                    description: Granular spending controls for a corporate card.
                    properties: {}
                required:
                  - cardNumberMask
                  - cardType
                  - controls
                  - createdDate
                  - currency
                  - expirationDate
                  - frozen
                  - holderName
                  - id
                  - status
              example:
                id: corp_card_xyz987654
                holderName: Alex Johnson
                associatedEmployeeId: emp_ajohnson_007
                cardNumberMask: 4111********1234
                expirationDate: '2028-12-31'
                status: Active
                frozen: false
                cardType: physical
                controls:
                  atmWithdrawals: true
                  contactlessPayments: true
                  onlineTransactions: true
                  internationalTransactions: true
                  monthlyLimit: 3000
                  dailyLimit: 750
                  singleTransactionLimit: 1000
                  merchantCategoryRestrictions:
                    - Software Subscriptions
                    - Conferences
                  vendorRestrictions:
                    - Amazon
                    - Uber
                spendingPolicyId: policy_travel_eu
                createdDate: '2023-01-15T09:00:00Z'
                currency: USD
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - corporate
        - cards
        - '{cardId}'
        - controls
      description: >-
        Updates the sophisticated spending controls, limits, and policy
        overrides for a specific corporate card, enabling real-time adjustments
        for security and budget adherence.
      requestBody:
        content:
          application/json:
            schema:
              description: Granular spending controls for a corporate card.
              type: object
              properties: {}
            example:
              monthlyLimit: 3000
              dailyLimit: 750
              internationalTransactions: true
              merchantCategoryRestrictions:
                - Software Subscriptions
                - Conferences
    parameters:
      - name: cardId
        in: path
        required: true
        description: Unique identifier for the corporate card.
        schema:
          type: string
        example: corp_card_xyz987654
  /corporate/cards/{cardId}/freeze:
    post:
      summary: Instantly Freeze or Unfreeze a Corporate Card
      responses:
        '200':
          description: Example of a frozen corporate card
          content:
            application/json:
              schema:
                type: object
                properties:
                  controls:
                    type: object
                    description: Granular spending controls for a corporate card.
                    properties: {}
                required:
                  - cardNumberMask
                  - cardType
                  - controls
                  - createdDate
                  - currency
                  - expirationDate
                  - frozen
                  - holderName
                  - id
                  - status
              example:
                id: corp_card_xyz987654
                holderName: Alex Johnson
                associatedEmployeeId: emp_ajohnson_007
                cardNumberMask: 4111********1234
                expirationDate: '2028-12-31'
                status: Suspended
                frozen: true
                cardType: physical
                controls:
                  atmWithdrawals: true
                  contactlessPayments: true
                  onlineTransactions: true
                  internationalTransactions: false
                  monthlyLimit: 2500
                  dailyLimit: 500
                  singleTransactionLimit: 1000
                  merchantCategoryRestrictions:
                    - Restaurants
                    - Travel
                    - Office Supplies
                  vendorRestrictions:
                    - Amazon
                    - Uber
                spendingPolicyId: policy_travel_eu
                createdDate: '2023-01-15T09:00:00Z'
                currency: USD
        '401':
          description: Invalid or missing authentication credentials
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: Insufficient permissions
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: Resource not found error
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - corporate
        - cards
        - '{cardId}'
        - freeze
      description: >-
        Immediately changes the frozen status of a corporate card, preventing or
        allowing transactions in real-time, critical for security and expense
        management.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties: {}
              required:
                - freeze
            example:
              freeze: true
    parameters:
      - name: cardId
        in: path
        required: true
        description: Unique identifier for the corporate card.
        schema:
          type: string
        example: corp_card_xyz987654
  /corporate/cards/{cardId}/transactions:
    get:
      summary: List Transactions for a Corporate Card
      parameters:
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
        - name: startDate
          in: query
          description: Start date for filtering results (inclusive, YYYY-MM-DD).
          schema:
            type: string
          example: '2024-01-01'
        - name: endDate
          in: query
          description: End date for filtering results (inclusive, YYYY-MM-DD).
          schema:
            type: string
          example: '2024-12-31'
      responses:
        '200':
          description: A paginated list of corporate card transactions.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 5
                data:
                  - id: corp_txn_google_ads_1
                    accountId: corp_card_virtual_marketing
                    type: expense
                    category: Advertising
                    aiCategoryConfidence: 0.98
                    description: Google Ads Payment
                    merchantDetails:
                      name: Google Ads
                    amount: 150
                    currency: USD
                    date: '2024-07-10'
                    postedDate: '2024-07-11'
                    paymentChannel: online
                    disputeStatus: none
                  - id: corp_txn_amazon_office
                    accountId: corp_card_xyz987654
                    type: expense
                    category: Office Supplies
                    aiCategoryConfidence: 0.9
                    description: Amazon.com
                    merchantDetails:
                      name: Amazon
                    amount: 75.5
                    currency: USD
                    date: '2024-07-05'
                    postedDate: '2024-07-06'
                    paymentChannel: online
                    disputeStatus: none
                nextOffset: 2
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - corporate
        - cards
        - '{cardId}'
        - transactions
      description: >-
        Retrieves a paginated list of transactions made with a specific
        corporate card, including AI categorization and compliance flags.
    parameters:
      - name: cardId
        in: path
        required: true
        description: Unique identifier for the corporate card.
        schema:
          type: string
        example: corp_card_xyz987654
  /corporate/cards/virtual:
    post:
      summary: Issue a New Virtual Corporate Card
      responses:
        '201':
          description: Virtual corporate card issued successfully.
          content:
            application/json:
              schema:
                type: object
                properties:
                  controls:
                    type: object
                    description: Granular spending controls for a corporate card.
                    properties: {}
                required:
                  - cardNumberMask
                  - cardType
                  - controls
                  - createdDate
                  - currency
                  - expirationDate
                  - frozen
                  - holderName
                  - id
                  - status
              example:
                id: corp_card_virtual_marketing_q4
                holderName: Marketing Campaign Q4
                associatedEmployeeId: emp_marketing_01
                cardNumberMask: 5123********5678
                expirationDate: '2025-12-31'
                status: Active
                frozen: false
                cardType: virtual
                controls:
                  atmWithdrawals: false
                  contactlessPayments: false
                  onlineTransactions: true
                  internationalTransactions: false
                  monthlyLimit: 1000
                  dailyLimit: 500
                  singleTransactionLimit: 200
                  merchantCategoryRestrictions:
                    - Advertising
                  vendorRestrictions:
                    - Facebook Ads
                    - Google Ads
                createdDate: '2024-07-22T16:00:00Z'
                currency: USD
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - corporate
        - cards
        - virtual
      description: >-
        Creates and issues a new virtual corporate card with specified spending
        limits, merchant restrictions, and expiration dates, ideal for secure
        online purchases and temporary projects.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                controls:
                  type: object
                  description: Granular spending controls for a corporate card.
                  properties: {}
              required:
                - controls
                - expirationDate
                - holderName
                - purpose
            example:
              holderName: Marketing Campaign Q4
              associatedEmployeeId: emp_marketing_01
              purpose: Online advertising for Q4 campaigns
              controls:
                atmWithdrawals: false
                contactlessPayments: false
                onlineTransactions: true
                internationalTransactions: false
                monthlyLimit: 1000
                dailyLimit: 500
                singleTransactionLimit: 200
                merchantCategoryRestrictions:
                  - Advertising
                vendorRestrictions:
                  - Facebook Ads
                  - Google Ads
              expirationDate: '2025-12-31'
  /corporate/cards:
    get:
      summary: List All Corporate Enterprise Cards
      parameters:
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
      responses:
        '200':
          description: A paginated, detailed list of all corporate enterprise cards.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 2
                data:
                  - id: corp_card_xyz987654
                    holderName: Alex Johnson
                    associatedEmployeeId: emp_ajohnson_007
                    cardNumberMask: 4111********1234
                    expirationDate: '2028-12-31'
                    status: Active
                    frozen: false
                    cardType: physical
                    controls:
                      atmWithdrawals: true
                      contactlessPayments: true
                      onlineTransactions: true
                      internationalTransactions: false
                      monthlyLimit: 2500
                      dailyLimit: 500
                      singleTransactionLimit: 1000
                      merchantCategoryRestrictions:
                        - Restaurants
                        - Travel
                        - Office Supplies
                      vendorRestrictions:
                        - Amazon
                        - Uber
                    spendingPolicyId: policy_travel_eu
                    createdDate: '2023-01-15T09:00:00Z'
                    currency: USD
                  - id: corp_card_virtual_marketing
                    holderName: Marketing Campaign Q3
                    associatedEmployeeId: emp_marketing_01
                    cardNumberMask: 5123********5678
                    expirationDate: '2025-09-30'
                    status: Active
                    frozen: false
                    cardType: virtual
                    controls:
                      atmWithdrawals: false
                      contactlessPayments: false
                      onlineTransactions: true
                      internationalTransactions: false
                      monthlyLimit: 500
                      dailyLimit: 500
                      singleTransactionLimit: 200
                      merchantCategoryRestrictions:
                        - Advertising
                      vendorRestrictions:
                        - Facebook Ads
                        - Google Ads
                    createdDate: '2024-07-01T10:00:00Z'
                    currency: USD
                nextOffset: 2
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - corporate
        - cards
      description: >-
        Retrieves a comprehensive list of all physical and virtual corporate
        cards associated with the user's organization, including their status,
        assigned holder, and current spending controls.
  /corporate/anomalies/{anomalyId}/status:
    put:
      summary: Update Anomaly Review Status
      responses:
        '200':
          description: The updated anomaly object with the new status and resolution notes.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - aiConfidenceScore
                  - description
                  - entityId
                  - entityType
                  - id
                  - recommendedAction
                  - riskScore
                  - severity
                  - status
                  - timestamp
              example:
                id: anom_risk-2024-07-21-D1E2F3
                description: Unusual large transaction detected in an inactive account.
                details: >-
                  Transaction of $15,000 to 'International Widgets Inc.' from
                  account 'CHASE CHECKING 4567'. This account has been dormant
                  for 6 months...
                severity: Critical
                status: Resolved
                entityType: Transaction
                entityId: txn_quantum-2024-07-21-A7B8C9
                timestamp: '2024-07-21T10:15:30Z'
                riskScore: 95
                aiConfidenceScore: 0.98
                recommendedAction: >-
                  Immediately freeze associated corporate card and contact
                  cardholder for verification.
                relatedTransactions:
                  - txn_previous_small_txns
                resolutionNotes: >-
                  Confirmed legitimate transaction after contacting vendor.
                  Marked as resolved.
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - corporate
        - anomalies
        - '{anomalyId}'
        - status
      description: >-
        Updates the review status of a specific financial anomaly, allowing
        compliance officers to mark it as dismissed, resolved, or escalate for
        further investigation after thorough AI-assisted and human review.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties: {}
              required:
                - status
            example:
              status: Resolved
              resolutionNotes: >-
                Confirmed legitimate transaction after contacting vendor. Marked
                as resolved.
    parameters:
      - name: anomalyId
        in: path
        required: true
        description: Unique identifier for the financial anomaly.
        schema:
          type: string
        example: anom_risk-2024-07-21-D1E2F3
  /corporate/anomalies:
    get:
      summary: List AI-Detected Financial Anomalies
      parameters:
        - name: status
          in: query
          description: Filter anomalies by their current review status.
          schema:
            type: string
          example: New
        - name: severity
          in: query
          description: Filter anomalies by their AI-assessed severity level.
          schema:
            type: string
          example: Critical
        - name: entityType
          in: query
          description: >-
            Filter anomalies by the type of financial entity they are related
            to.
          schema:
            type: string
          example: Transaction
        - name: startDate
          in: query
          description: Start date for filtering results (inclusive, YYYY-MM-DD).
          schema:
            type: string
          example: '2024-01-01'
        - name: endDate
          in: query
          description: End date for filtering results (inclusive, YYYY-MM-DD).
          schema:
            type: string
          example: '2024-12-31'
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
      responses:
        '200':
          description: >-
            A paginated list of AI-detected financial anomalies, prioritized by
            risk score.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 3
                data:
                  - id: anom_risk-2024-07-21-D1E2F3
                    description: Unusual large transaction detected in an inactive account.
                    details: >-
                      Transaction of $15,000 to 'International Widgets Inc.'
                      from account 'CHASE CHECKING 4567'. This account has been
                      dormant for 6 months and typical transactions are under
                      $500. High risk score due to dormancy and unusual
                      amount/payee combination.
                    severity: Critical
                    status: New
                    entityType: Transaction
                    entityId: txn_quantum-2024-07-21-A7B8C9
                    timestamp: '2024-07-21T10:15:30Z'
                    riskScore: 95
                    aiConfidenceScore: 0.98
                    recommendedAction: >-
                      Immediately freeze associated corporate card and contact
                      cardholder for verification.
                    relatedTransactions:
                      - txn_previous_small_txns
                  - id: anom_risk-2024-07-22-E4F5G6
                    description: >-
                      Multiple failed login attempts followed by successful
                      login from new IP.
                    details: >-
                      Five failed login attempts from IP 192.0.2.10, immediately
                      followed by a successful login from a new IP 203.0.113.20.
                      Suggests possible credential stuffing attack.
                    severity: High
                    status: Under Review
                    entityType: User
                    entityId: user-quantum-visionary-001
                    timestamp: '2024-07-22T09:00:00Z'
                    riskScore: 88
                    aiConfidenceScore: 0.92
                    recommendedAction: Request user to verify login via MFA, alert security team.
                    relatedTransactions: []
                nextOffset: 2
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - corporate
        - anomalies
      description: >-
        Retrieves a comprehensive list of AI-detected financial anomalies across
        transactions, payments, and corporate cards that require immediate
        review and potential action to mitigate risk and ensure compliance.
  /corporate/compliance/audits/{auditId}/report:
    get:
      summary: Retrieve AI-Generated Compliance Audit Report
      responses:
        '200':
          description: The comprehensive compliance audit report.
          content:
            application/json:
              schema:
                type: object
                properties:
                  periodCovered:
                    type: object
                    description: The period covered by this audit report.
                    properties: {}
                required:
                  - auditDate
                  - auditId
                  - findings
                  - overallComplianceScore
                  - periodCovered
                  - recommendedActions
                  - status
                  - summary
              example:
                auditId: audit_corp_xyz789
                status: completed
                auditDate: '2024-07-22T19:00:00Z'
                periodCovered:
                  startDate: '2024-01-01'
                  endDate: '2024-06-30'
                overallComplianceScore: 92
                summary: >-
                  Overall high compliance across all transaction types. Minor
                  areas for improvement identified in expense reporting related
                  to receipt documentation.
                findings:
                  - type: recommendation
                    severity: Low
                    description: >-
                      Several small transactions lacked complete receipt
                      documentation in the expense management system.
                    relatedEntities:
                      - txn_abc123
                      - txn_def456
                  - type: observation
                    severity: Low
                    description: >-
                      Automated sanction screening system shows 99.8% coverage,
                      with 0.2% requiring manual review.
                recommendedActions:
                  - id: insight-receipt-compliance-004
                    title: Improve Receipt Submission Compliance
                    description: >-
                      Implement automated reminders for employees to upload
                      receipts for all transactions above $20.
                    category: compliance
                    severity: low
                    actionableRecommendation: Configure expense system rules.
                    timestamp: '2024-07-22T19:05:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - corporate
        - compliance
        - audits
        - '{auditId}'
        - report
      description: Retrieves the full report generated by an AI-driven compliance audit.
    parameters:
      - name: auditId
        in: path
        required: true
        description: Unique identifier for the compliance audit.
        schema:
          type: string
        example: audit_corp_xyz789
  /corporate/compliance/audits:
    post:
      summary: Request an AI-Driven Compliance Audit Report
      responses:
        '202':
          description: >-
            Compliance audit initiated. An audit ID is returned to check the
            status and retrieve the report.
          content:
            application/json:
              schema:
                type: object
                properties: {}
              example:
                auditId: audit_corp_xyz789
                status: processing
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - corporate
        - compliance
        - audits
      description: >-
        Initiates an AI-powered compliance audit for a specific period or scope,
        generating a comprehensive report detailing adherence to regulatory
        frameworks, internal policies, and flagging potential risks.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties: {}
              required:
                - auditScope
                - endDate
                - regulatoryFrameworks
                - startDate
            example:
              auditScope: all_transactions
              startDate: '2024-01-01'
              endDate: '2024-06-30'
              regulatoryFrameworks:
                - AML
                - PCI-DSS
  /corporate/sanction-screening:
    post:
      summary: Perform Real-time Sanction Screening
      responses:
        '200':
          description: Clear screening result
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - matchDetails
                  - matchFound
                  - screeningId
                  - screeningTimestamp
                  - status
              example:
                screeningId: screen_xyz456
                matchFound: false
                matchDetails: []
                screeningTimestamp: '2024-07-22T19:30:00Z'
                status: clear
        '400':
          description: Common bad request error
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Invalid or missing authentication credentials
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: Insufficient permissions
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - corporate
        - sanction-screening
      description: >-
        Executes a real-time screening of an individual or entity against global
        sanction lists and watchlists.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                address:
                  type: object
                  properties: {}
              required:
                - country
                - entityType
                - name
            example:
              name: John Doe
              country: US
              dateOfBirth: '1970-01-01'
              entityType: individual
  /corporate/treasury/cash-flow/forecast:
    get:
      summary: Get AI-Driven Corporate Cash Flow Forecast
      parameters:
        - name: forecastHorizonDays
          in: query
          description: >-
            The number of days into the future for which to generate the cash
            flow forecast (e.g., 30, 90, 180).
          schema:
            type: integer
          example: '90'
        - name: includeScenarioAnalysis
          in: query
          description: >-
            If true, the forecast will include best-case and worst-case scenario
            analysis alongside the most likely projection.
          schema:
            type: boolean
          example: 'true'
      responses:
        '200':
          description: A comprehensive AI-driven cash flow forecast report.
          content:
            application/json:
              schema:
                type: object
                properties:
                  inflowForecast:
                    type: object
                    description: Forecast of cash inflows by source.
                    properties: {}
                  outflowForecast:
                    type: object
                    description: Forecast of cash outflows by category.
                    properties: {}
                required:
                  - aiRecommendations
                  - currency
                  - forecastId
                  - inflowForecast
                  - liquidityRiskScore
                  - outflowForecast
                  - overallStatus
                  - period
                  - projectedBalances
              example:
                forecastId: cf_forecast_corp_Q3_2024
                period: Q3 2024 (July - September)
                currency: USD
                overallStatus: positive_outlook
                projectedBalances:
                  - date: '2024-07-31'
                    projectedCash: 1500000
                    scenario: most_likely
                  - date: '2024-08-31'
                    projectedCash: 1750000
                    scenario: most_likely
                  - date: '2024-07-31'
                    projectedCash: 1400000
                    scenario: worst_case
                  - date: '2024-07-31'
                    projectedCash: 1600000
                    scenario: best_case
                inflowForecast:
                  totalProjected: 3000000
                  bySource:
                    - source: Client Payments
                      amount: 2500000
                    - source: Investment Returns
                      amount: 500000
                outflowForecast:
                  totalProjected: 2000000
                  byCategory:
                    - category: Payroll
                      amount: 1000000
                    - category: Operating Expenses
                      amount: 700000
                liquidityRiskScore: 15
                aiRecommendations:
                  - id: insight-cash-optimization-001
                    title: Optimize Short-Term Investments
                    description: >-
                      With a strong positive cash flow outlook, consider
                      allocating surplus funds to short-term, low-risk
                      investments to maximize returns.
                    category: corporate_treasury
                    severity: low
                    actionableRecommendation: >-
                      Consult with treasury manager to explore investment
                      options.
                    timestamp: '2024-07-22T19:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - corporate
        - treasury
        - cash-flow
        - forecast
      description: >-
        Retrieves an advanced AI-driven cash flow forecast for the organization,
        projecting liquidity, identifying potential surpluses or deficits, and
        providing recommendations for optimal treasury management.
  /corporate/treasury/liquidity-positions:
    get:
      summary: Get Real-time Corporate Liquidity Positions
      responses:
        '200':
          description: Real-time liquidity positions.
          content:
            application/json:
              schema:
                type: object
                properties:
                  shortTermInvestments:
                    type: object
                    description: >-
                      Details on short-term investments contributing to
                      liquidity.
                    properties: {}
                  aiLiquidityAssessment:
                    type: object
                    description: AI's overall assessment of liquidity.
                    properties: {}
                required:
                  - accountTypeBreakdown
                  - aiLiquidityAssessment
                  - aiRecommendations
                  - currencyBreakdown
                  - shortTermInvestments
                  - snapshotTime
                  - totalLiquidAssets
              example:
                snapshotTime: '2024-07-22T18:30:00Z'
                totalLiquidAssets: 5200000
                currencyBreakdown:
                  - currency: USD
                    amount: 4000000
                    percentage: 76.9
                  - currency: EUR
                    amount: 1000000
                    percentage: 19.2
                  - currency: GBP
                    amount: 200000
                    percentage: 3.9
                accountTypeBreakdown:
                  - type: Checking
                    amount: 3500000
                  - type: Savings
                    amount: 500000
                  - type: Money Market
                    amount: 1200000
                shortTermInvestments:
                  totalValue: 1200000
                  maturingNext30Days: 300000
                aiLiquidityAssessment:
                  status: optimal
                  message: >-
                    Current liquidity is optimal and sufficient for all
                    short-term obligations and planned expenditures. High
                    flexibility for strategic investments.
                aiRecommendations:
                  - id: insight-investment-strategy-002
                    title: Review Mid-Term Investment Strategy
                    description: >-
                      Given the robust liquidity, consider reviewing
                      opportunities for mid-term strategic investments to
                      enhance capital growth without compromising short-term
                      operational needs.
                    category: corporate_treasury
                    severity: low
                    actionableRecommendation: Schedule meeting with investment committee.
                    timestamp: '2024-07-22T18:40:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - corporate
        - treasury
        - liquidity-positions
      description: >-
        Provides a real-time overview of the organization's liquidity across all
        accounts, currencies, and short-term investments.
  /corporate/risk/fraud/rules/{ruleId}:
    put:
      summary: Update an AI-Powered Fraud Detection Rule
      responses:
        '200':
          description: Fraud detection rule updated successfully.
          content:
            application/json:
              schema:
                type: object
                properties:
                  criteria:
                    type: object
                    description: Criteria that define when a fraud rule should trigger.
                    properties: {}
                  action:
                    type: object
                    description: Action to take when a fraud rule is triggered.
                    properties: {}
                    required:
                      - details
                      - type
                required:
                  - action
                  - createdAt
                  - createdBy
                  - criteria
                  - description
                  - id
                  - lastUpdated
                  - name
                  - severity
                  - status
              example:
                id: fraud_rule_high_value_inactive
                name: High Value Transaction from Inactive Account
                description: >-
                  Flags transactions over a certain threshold from accounts that
                  have been inactive for a specified period.
                status: inactive
                severity: High
                criteria:
                  transactionAmountMin: 7500
                  accountInactivityDays: 60
                  transactionType: debit
                  countryOfOrigin:
                    - US
                    - CA
                action:
                  type: flag
                  details: Flag for manual review only, do not block.
                createdBy: system:ai-risk-engine
                createdAt: '2024-05-01T10:00:00Z'
                lastUpdated: '2024-07-22T20:15:00Z'
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - corporate
        - risk
        - fraud
        - rules
        - '{ruleId}'
      description: >-
        Updates an existing custom AI-powered fraud detection rule, modifying
        its criteria, actions, or status.
      requestBody:
        content:
          application/json:
            schema:
              description: Fields that can be updated for an existing fraud detection rule.
              type: object
              properties:
                criteria:
                  type: object
                  description: Criteria that define when a fraud rule should trigger.
                  properties: {}
                action:
                  type: object
                  description: Action to take when a fraud rule is triggered.
                  properties: {}
                  required:
                    - details
                    - type
            example:
              status: inactive
              criteria:
                transactionAmountMin: 7500
                accountInactivityDays: 60
              action:
                type: flag
                details: Flag for manual review only, do not block.
    parameters:
      - name: ruleId
        in: path
        required: true
        description: Unique identifier for the fraud detection rule.
        schema:
          type: string
        example: fraud_rule_high_value_inactive
  /corporate/risk/fraud/rules:
    get:
      summary: List AI-Powered Fraud Detection Rules
      parameters:
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
      responses:
        '200':
          description: A paginated list of fraud detection rules.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 2
                data:
                  - id: fraud_rule_high_value_inactive
                    name: High Value Transaction from Inactive Account
                    description: >-
                      Flags transactions over a certain threshold from accounts
                      that have been inactive for a specified period.
                    status: active
                    severity: High
                    criteria:
                      transactionAmountMin: 5000
                      accountInactivityDays: 90
                      transactionType: debit
                      countryOfOrigin:
                        - US
                        - CA
                    action:
                      type: block
                      details: Block transaction and send critical alert to fraud team.
                    createdBy: system:ai-risk-engine
                    createdAt: '2024-05-01T10:00:00Z'
                    lastUpdated: '2024-07-20T11:30:00Z'
                  - id: fraud_rule_suspicious_geo
                    name: Suspicious Geolocation Mismatch
                    description: >-
                      Detects transactions originating from a geolocation
                      significantly different from recent login activity without
                      prior travel notification.
                    status: active
                    severity: Critical
                    criteria:
                      geographicDistanceKm: 5000
                      lastLoginDays: 7
                      noTravelNotification: true
                    action:
                      type: alert
                      details: >-
                        Send immediate MFA challenge to user and flag for
                        review.
                    createdBy: system:ai-risk-engine
                    createdAt: '2024-06-10T09:00:00Z'
                    lastUpdated: '2024-07-01T10:00:00Z'
                nextOffset: 2
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - corporate
        - risk
        - fraud
        - rules
      description: >-
        Retrieves a list of AI-powered fraud detection rules currently active
        for the organization, including their parameters, thresholds, and
        associated actions (e.g., flag, block, alert).
  /web3/wallets/{walletId}/balances:
    get:
      summary: Get Crypto Asset Balances for a Wallet
      parameters:
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
      responses:
        '200':
          description: A paginated list of crypto asset balances.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 3
                offset: 0
                total: 3
                data:
                  - assetSymbol: ETH
                    assetName: Ethereum
                    balance: 2.5
                    usdValue: 7500
                    contractAddress: 0x...
                  - assetSymbol: USDC
                    assetName: USD Coin
                    balance: 1000
                    usdValue: 1000
                    contractAddress: 0x...
                  - assetSymbol: LINK
                    assetName: Chainlink
                    balance: 50
                    usdValue: 700
                    contractAddress: 0x...
                nextOffset: 3
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - web3
        - wallets
        - '{walletId}'
        - balances
      description: >-
        Retrieves the current balances of all recognized crypto assets within a
        specific connected wallet.
    parameters:
      - name: walletId
        in: path
        required: true
        description: Unique identifier for the crypto wallet connection.
        schema:
          type: string
        example: wallet_conn_eth_0xabc123
  /web3/wallets:
    get:
      summary: List Connected Crypto Wallets
      parameters:
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
      responses:
        '200':
          description: A paginated list of connected cryptocurrency wallets.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 2
                data:
                  - id: wallet_conn_eth_0xabc123
                    walletProvider: MetaMask
                    walletAddress: '0x25a6f8b7C4dC6f5F3E7A3D7E8C9B0A1B2C3D4E5F'
                    blockchainNetwork: Ethereum
                    status: connected
                    lastSynced: '2024-07-22T13:00:00Z'
                    readAccessGranted: true
                    writeAccessGranted: false
                  - id: wallet_conn_sol_0xdef456
                    walletProvider: Phantom
                    walletAddress: '0x2A1B3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0B'
                    blockchainNetwork: Solana
                    status: connected
                    lastSynced: '2024-07-22T12:45:00Z'
                    readAccessGranted: true
                    writeAccessGranted: false
                nextOffset: 2
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - web3
        - wallets
      description: >-
        Retrieves a list of all securely linked cryptocurrency wallets (e.g.,
        MetaMask, Ledger integration), showing their addresses, associated
        networks, and verification status.
    post:
      summary: Connect a New Crypto Wallet
      responses:
        '201':
          description: Wallet connection initiated or confirmed successfully.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - blockchainNetwork
                  - id
                  - lastSynced
                  - readAccessGranted
                  - status
                  - walletAddress
                  - walletProvider
                  - writeAccessGranted
              example:
                id: wallet_conn_eth_0x123abc
                walletProvider: MetaMask
                walletAddress: '0x123abc456def7890123abc456def7890123abc456def'
                blockchainNetwork: Ethereum
                status: connected
                lastSynced: '2024-07-22T20:00:00Z'
                readAccessGranted: true
                writeAccessGranted: false
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '409':
          description: >-
            The request could not be completed due to a conflict with the
            current state of the resource (e.g., duplicate entry, expired
            state).
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: RESOURCE_CONFLICT
                message: >-
                  A resource with this identifier already exists or the
                  operation conflicts with an existing state.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - web3
        - wallets
      description: >-
        Initiates the process to securely connect a new cryptocurrency wallet to
        the user's  profile, typically involving a signed message or OAuth flow
        from the wallet provider.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties: {}
              required:
                - blockchainNetwork
                - signedMessage
                - walletAddress
                - walletProvider
            example:
              walletAddress: 0x123abc456def7890...
              walletProvider: MetaMask
              signedMessage: >-
                0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890
              blockchainNetwork: Ethereum
  /web3/nfts:
    get:
      summary: Retrieve User's NFT Collection
      parameters:
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
      responses:
        '200':
          description: A paginated list of the user's NFT assets.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 2
                data:
                  - id: nft_bored_ape_yacht_club_1234
                    collectionName: Bored Ape Yacht Club
                    name: 'Bored Ape #1234'
                    description: >-
                      A unique digital collectible from the Bored Ape Yacht Club
                      series.
                    imageUrl: >-
                      https://opensea.io/assets/ethereum/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/1234
                    blockchainNetwork: Ethereum
                    ownerAddress: '0x25a6f8b7C4dC6f5F3E7A3D7E8C9B0A1B2C3D4E5F'
                    contractAddress: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d'
                    tokenId: '1234'
                    lastSalePriceUSD: 150000
                    estimatedValueUSD: 160000
                    attributes:
                      - trait_type: Background
                        value: Blue
                      - trait_type: Fur
                        value: Brown
                  - id: nft_cryptopunk_5678
                    collectionName: CryptoPunks
                    name: 'CryptoPunk #5678'
                    imageUrl: https://larvalabs.com/cryptopunks/punk5678.png
                    blockchainNetwork: Ethereum
                    ownerAddress: '0x25a6f8b7C4dC6f5F3E7A3D7E8C9B0A1B2C3D4E5F'
                    contractAddress: '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb'
                    tokenId: '5678'
                    lastSalePriceUSD: 200000
                    estimatedValueUSD: 210000
                    attributes:
                      - trait_type: Accessory
                        value: Headband
                nextOffset: 2
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - web3
        - nfts
      description: >-
        Fetches a comprehensive list of Non-Fungible Tokens (NFTs) owned by the
        user across all connected wallets and supported blockchain networks,
        including metadata and market values.
  /web3/transactions/initiate:
    post:
      summary: Initiate a Cryptocurrency Transfer
      responses:
        '202':
          description: Crypto transfer initiated. Awaiting user signature/confirmation.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - status
                  - transferId
              example:
                transferId: crypto_txn_xyz789
                status: pending_signature
                message: Please confirm the transaction in your MetaMask wallet.
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - web3
        - transactions
        - initiate
      description: >-
        Prepares and initiates a cryptocurrency transfer from a connected wallet
        to a specified recipient address. Requires user confirmation (e.g., via
        wallet signature).
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties: {}
              required:
                - amount
                - assetSymbol
                - blockchainNetwork
                - recipientAddress
                - sourceWalletId
            example:
              sourceWalletId: wallet_conn_eth_0xabc123
              recipientAddress: '0xdef4567890abcdef1234567890abcdef1234567890'
              amount: 0.1
              assetSymbol: ETH
              blockchainNetwork: Ethereum
              gasPriceGwei: 50
              memo: Payment for services
  /payments/fx/rates:
    get:
      summary: Get Real-time & Predictive Foreign Exchange Rates
      parameters:
        - name: baseCurrency
          in: query
          description: The base currency code (e.g., USD).
          schema:
            type: string
          example: USD
        - name: targetCurrency
          in: query
          description: The target currency code (e.g., EUR).
          schema:
            type: string
          example: EUR
        - name: forecastDays
          in: query
          description: Number of days into the future to provide an AI-driven prediction.
          schema:
            type: integer
          example: '7'
      responses:
        '200':
          description: Real-time and predictive foreign exchange rates.
          content:
            application/json:
              schema:
                type: object
                properties:
                  currentRate:
                    type: object
                    description: Real-time foreign exchange rates.
                    properties: {}
                  historicalVolatility:
                    type: object
                    properties: {}
                required:
                  - baseCurrency
                  - currentRate
                  - targetCurrency
              example:
                baseCurrency: USD
                targetCurrency: EUR
                currentRate:
                  bid: 0.9025
                  ask: 0.9035
                  mid: 0.903
                  timestamp: '2024-07-22T13:30:00Z'
                predictiveRates:
                  - date: '2024-07-29'
                    predictedMidRate: 0.905
                    confidenceIntervalLower: 0.901
                    confidenceIntervalUpper: 0.909
                    aiModelConfidence: 0.88
                  - date: '2024-08-05'
                    predictedMidRate: 0.9065
                    confidenceIntervalLower: 0.902
                    confidenceIntervalUpper: 0.911
                    aiModelConfidence: 0.85
                historicalVolatility:
                  past7Days: 0.005
                  past30Days: 0.012
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - payments
        - fx
        - rates
      description: >-
        Retrieves current and AI-predicted future foreign exchange rates for a
        specified currency pair, including bid/ask spreads and historical
        volatility data for informed decisions.
  /payments/fx/convert:
    post:
      summary: Initiate a Currency Conversion
      responses:
        '200':
          description: Currency conversion completed successfully.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - conversionId
                  - conversionTimestamp
                  - fxRateApplied
                  - sourceAmount
                  - sourceCurrency
                  - status
                  - targetAmount
              example:
                conversionId: fx_conv_abc123
                status: completed
                sourceAmount: 1000
                sourceCurrency: USD
                targetAmount: 920.5
                fxRateApplied: 0.9205
                feesApplied: 5
                conversionTimestamp: '2024-07-22T13:45:00Z'
                transactionId: txn_fx_conv_abc123-20240722
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - payments
        - fx
        - convert
      description: >-
        Executes an instant currency conversion between two currencies, either
        from a balance or into a specified account.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties: {}
              required:
                - sourceAccountId
                - sourceAmount
                - sourceCurrency
                - targetCurrency
            example:
              sourceAccountId: acc_chase_checking_4567
              targetAccountId: acc_euro_savings_9876
              sourceAmount: 1000
              sourceCurrency: USD
              targetCurrency: EUR
              fxRateLock: true
  /sustainability/carbon-footprint:
    get:
      summary: Retrieve Personal Carbon Footprint Report
      responses:
        '200':
          description: A comprehensive personal carbon footprint report.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - aiInsights
                  - breakdownByCategory
                  - period
                  - reportId
                  - totalCarbonFootprintKgCO2e
              example:
                reportId: cf_report_2024-Q2
                period: April - June 2024
                totalCarbonFootprintKgCO2e: 1250.7
                breakdownByCategory:
                  - category: Transportation
                    carbonFootprintKgCO2e: 450.2
                    percentage: 36
                  - category: Food
                    carbonFootprintKgCO2e: 300.5
                    percentage: 24
                  - category: Housing
                    carbonFootprintKgCO2e: 250
                    percentage: 20
                aiInsights:
                  - id: insight-transport-carbon-001
                    title: Reduce Commute Carbon
                    description: >-
                      Your daily commute contributes significantly to your
                      carbon footprint. Consider carpooling or public transport.
                    category: sustainability
                    severity: medium
                    actionableRecommendation: Explore green commuting options.
                    timestamp: '2024-07-22T16:00:00Z'
                offsetRecommendations:
                  - project: Amazon Reforestation Project
                    costPerTonUSD: 25
                    offsetAmountKgCO2e: 1250.7
                    totalCostUSD: 31.27
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - sustainability
        - carbon-footprint
      description: >-
        Generates a detailed report of the user's estimated carbon footprint
        based on transaction data, lifestyle choices, and AI-driven impact
        assessments, offering insights and reduction strategies.
  /sustainability/investments/impact:
    get:
      summary: Analyze ESG Impact of Investment Portfolio
      responses:
        '200':
          description: An analysis of the ESG impact of the investment portfolio.
          content:
            application/json:
              schema:
                type: object
                properties:
                  breakdownByESGFactors:
                    type: object
                    description: >-
                      Breakdown of the portfolio's ESG score by individual
                      factors.
                    properties: {}
                required:
                  - aiRecommendations
                  - benchmarkESGScore
                  - breakdownByESGFactors
                  - lowestESGHoldings
                  - overallESGScore
                  - portfolioId
                  - topESGHoldings
              example:
                portfolioId: portfolio_equity_growth
                overallESGScore: 7.8
                benchmarkESGScore: 6.5
                breakdownByESGFactors:
                  environmentalScore: 7
                  socialScore: 8.5
                  governanceScore: 8
                topESGHoldings:
                  - assetSymbol: TSLA
                    assetName: Tesla Inc.
                    esgScore: 9.1
                  - assetSymbol: MSFT
                    assetName: Microsoft Corp.
                    esgScore: 8.9
                lowestESGHoldings:
                  - assetSymbol: XOM
                    assetName: ExxonMobil Corp.
                    esgScore: 4.5
                  - assetSymbol: BAC
                    assetName: Bank of America
                    esgScore: 6
                aiRecommendations:
                  - id: insight-esg-diversify-002
                    title: Enhance ESG Diversification
                    description: >-
                      Your portfolio has a strong ESG profile, but could be
                      further improved by reducing exposure to companies with
                      lower ESG scores in the energy sector.
                    category: sustainability
                    severity: low
                    actionableRecommendation: Explore alternative energy ETFs or green bonds.
                    timestamp: '2024-07-22T16:15:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - sustainability
        - investments
        - impact
      description: >-
        Provides an AI-driven analysis of the Environmental, Social, and
        Governance (ESG) impact of the user's entire investment portfolio,
        benchmarking against industry standards and suggesting more sustainable
        alternatives.
  /sustainability/carbon-offsets:
    post:
      summary: Purchase Carbon Offsets
      responses:
        '200':
          description: Carbon offsets purchased successfully.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - amountOffsetKgCO2e
                  - purchaseDate
                  - purchaseId
                  - totalCostUSD
              example:
                purchaseId: co_purchase_xyz123
                amountOffsetKgCO2e: 500
                totalCostUSD: 12.5
                projectSupported: Verified Carbon Standard Project X
                transactionId: txn_offset_12345
                purchaseDate: '2024-07-22T14:00:00Z'
                certificateUrl: https://demobank.com/certificates/co_purchase_xyz123.pdf
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - sustainability
        - carbon-offsets
      description: >-
        Allows users to purchase carbon offsets to neutralize their estimated
        carbon footprint, supporting environmental initiatives.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties: {}
              required:
                - amountKgCO2e
                - offsetProject
                - paymentAccountId
            example:
              amountKgCO2e: 500
              paymentAccountId: acc_chase_checking_4567
              offsetProject: Verified Carbon Standard Project X
  /lending/applications/{applicationId}:
    get:
      summary: Get Loan Application Status & Details
      responses:
        '200':
          description: Loan application approved with offer details
          content:
            application/json:
              schema:
                type: object
                properties:
                  aiUnderwritingResult:
                    type: object
                    properties: {}
                    required:
                      - aiConfidence
                      - decision
                      - reason
                  offerDetails:
                    type: object
                    properties: {}
                    required:
                      - amount
                      - expirationDate
                      - interestRate
                      - isPreApproved
                      - offerId
                      - offerType
                required:
                  - applicationDate
                  - applicationId
                  - loanAmountRequested
                  - loanPurpose
                  - nextSteps
                  - status
              example:
                applicationId: loan_app_creditflow-123
                status: approved
                loanAmountRequested: 10000
                loanPurpose: home_improvement
                applicationDate: '2024-07-22T15:00:00Z'
                aiUnderwritingResult:
                  decision: approved
                  reason: Strong credit score and consistent income history.
                  recommendedInterestRate: 6.5
                  maxApprovedAmount: 12000
                  aiConfidence: 0.95
                offerDetails:
                  offerId: offer_pers_loan_001
                  offerType: personal_loan
                  amount: 10000
                  interestRate: 6.5
                  repaymentTermMonths: 36
                  monthlyPayment: 306.45
                  originationFee: 150
                  totalRepayable: 11032.2
                  expirationDate: '2024-08-31'
                  isPreApproved: false
                  aiPersonalizationScore: 0.9
                nextSteps: >-
                  Review your offer details and accept the loan to proceed with
                  funding.
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - lending
        - applications
        - '{applicationId}'
      description: >-
        Retrieves the current status and detailed information for a submitted
        loan application, including AI underwriting outcomes, approved terms,
        and next steps.
    parameters:
      - name: applicationId
        in: path
        required: true
        description: Unique identifier for the loan application.
        schema:
          type: string
        example: loan_app_creditflow-123
  /lending/offers/pre-approved:
    get:
      summary: Get Pre-Approved Loan Offers
      parameters:
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
      responses:
        '200':
          description: A paginated list of pre-approved loan offers.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 2
                data:
                  - offerId: offer_pre_app_001
                    offerType: personal_loan
                    amount: 15000
                    interestRate: 4.5
                    repaymentTermMonths: 60
                    monthlyPayment: 280
                    originationFee: 0
                    totalRepayable: 16800
                    expirationDate: '2024-08-31'
                    isPreApproved: true
                    aiPersonalizationScore: 0.95
                  - offerId: offer_pre_app_002
                    offerType: credit_line
                    amount: 5000
                    interestRate: 8.99
                    originationFee: 50
                    expirationDate: '2024-09-15'
                    isPreApproved: true
                    aiPersonalizationScore: 0.88
                nextOffset: 2
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - lending
        - offers
        - pre-approved
      description: >-
        Retrieves a list of personalized, pre-approved loan offers generated by
        the AI based on the user's financial profile and credit health.
  /developers/webhooks/{subscriptionId}:
    put:
      summary: Update Webhook Subscription
      responses:
        '200':
          description: Example of an updated webhook subscription
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - callbackUrl
                  - createdAt
                  - events
                  - id
                  - status
              example:
                id: whsub_devtool_finance_events
                callbackUrl: https://my-new-app.com/webhooks/demobank-events
                events:
                  - transaction.created
                  - user.login_failed
                status: active
                lastTriggered: '2024-07-22T17:00:00Z'
                failureCount: 0
        '400':
          description: Common bad request error
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Invalid or missing authentication credentials
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: Insufficient permissions
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: Resource not found error
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - developers
        - webhooks
        - '{subscriptionId}'
      description: >-
        Modifies an existing webhook subscription, allowing changes to the
        callback URL, subscribed events, or activation status.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties: {}
            example:
              status: paused
    parameters:
      - name: subscriptionId
        in: path
        required: true
        description: Unique identifier for the webhook subscription.
        schema:
          type: string
        example: whsub_devtool_finance_events
    delete:
      summary: Delete Webhook Subscription
      responses:
        '204':
          description: Webhook subscription deleted successfully.
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - developers
        - webhooks
        - '{subscriptionId}'
      description: >-
        Deletes an existing webhook subscription, stopping all future event
        notifications to the specified callback URL.
  /developers/webhooks:
    get:
      summary: List Webhook Subscriptions
      parameters:
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
      responses:
        '200':
          description: A paginated list of active webhook subscriptions.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 2
                data:
                  - id: whsub_devtool_finance_events
                    callbackUrl: https://my-app.com/webhooks/demobank-events
                    events:
                      - transaction.created
                      - account.updated
                      - user.login_failed
                    status: active
                    lastTriggered: '2024-07-22T17:00:00Z'
                    failureCount: 0
                  - id: whsub_alert_system
                    callbackUrl: https://alert-system.com/demobank-alerts
                    events:
                      - security.critical_alert
                    status: paused
                    lastTriggered: '2024-07-20T08:00:00Z'
                    failureCount: 2
                nextOffset: 2
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - developers
        - webhooks
      description: >-
        Retrieves a list of all active webhook subscriptions for the
        authenticated developer application, detailing endpoint URLs, subscribed
        events, and current status.
  /developers/api-keys/{keyId}:
    delete:
      summary: Revoke a Developer API Key
      responses:
        '204':
          description: API key revoked successfully.
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - developers
        - api-keys
        - '{keyId}'
      description: Revokes an existing API key, disabling its access immediately.
    parameters:
      - name: keyId
        in: path
        required: true
        description: Unique identifier for the API key.
        schema:
          type: string
        example: api_key_dev_app_01
  /developers/api-keys:
    get:
      summary: List Developer API Keys
      parameters:
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
      responses:
        '200':
          description: A paginated list of API keys.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 2
                data:
                  - id: api_key_dev_app_01
                    prefix: db_pk_test_
                    status: active
                    createdAt: '2024-01-01T10:00:00Z'
                    expiresAt: '2025-01-01T10:00:00Z'
                    scopes:
                      - read:accounts
                      - write:payments
                    lastUsed: '2024-07-22T17:15:00Z'
                  - id: api_key_webhook_validator
                    prefix: db_sk_prod_
                    status: active
                    createdAt: '2023-05-01T11:00:00Z'
                    scopes:
                      - webhook:events
                    lastUsed: '2024-07-22T17:30:00Z'
                nextOffset: 2
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - developers
        - api-keys
      description: >-
        Retrieves a list of API keys issued to the authenticated developer
        application.
    post:
      summary: Create a New Developer API Key
      responses:
        '201':
          description: API key created successfully.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - createdAt
                  - id
                  - prefix
                  - scopes
                  - status
              example:
                id: api_key_analytics_service
                prefix: db_pk_test_
                status: active
                createdAt: '2024-07-22T18:00:00Z'
                expiresAt: '2024-10-20T18:00:00Z'
                scopes:
                  - read:accounts
                  - read:transactions
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - developers
        - api-keys
      description: >-
        Generates a new API key for the developer application with specified
        scopes and an optional expiration.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties: {}
              required:
                - name
                - scopes
            example:
              name: My Analytics Service Key
              scopes:
                - read:accounts
                - read:transactions
              expiresInDays: 90
  /identity/kyc/status:
    get:
      summary: Get Current KYC Verification Status
      responses:
        '200':
          description: 'KYC status: verified (Gold tier)'
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - lastSubmissionDate
                  - overallStatus
                  - requiredActions
                  - userId
              example:
                userId: user-quantum-visionary-001
                overallStatus: verified
                lastSubmissionDate: '2024-07-21T18:00:00Z'
                requiredActions: []
                verifiedTier: gold
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - identity
        - kyc
        - status
      description: >-
        Retrieves the current status of the user's Know Your Customer (KYC)
        verification process.
  /goals/{goalId}:
    get:
      summary: Get Detailed Financial Goal
      responses:
        '200':
          description: Detailed financial goal information.
          content:
            application/json:
              schema:
                type: object
                properties:
                  aiStrategicPlan:
                    type: object
                    description: AI-generated strategic plan for achieving the goal.
                    properties: {}
                required:
                  - currentAmount
                  - id
                  - lastUpdated
                  - name
                  - progressPercentage
                  - status
                  - targetAmount
                  - targetDate
                  - type
              example:
                id: goal_retirement_2050
                name: Retirement Fund by 2050
                type: retirement
                targetAmount: 1000000
                currentAmount: 350000
                targetDate: '2050-12-31'
                progressPercentage: 35
                status: on_track
                contributingAccounts:
                  - acc_chase_invest_ira_001
                  - acc_fidelity_401k_xyz
                lastUpdated: '2024-07-22T19:00:00Z'
                riskTolerance: medium
                aiStrategicPlan:
                  planId: plan_retirement_2050
                  summary: >-
                    The AI projects you are on track to reach your retirement
                    goal, but recommends increasing annual contributions by 5%
                    to account for potential market volatility.
                  steps:
                    - title: Increase 401k Contributions
                      description: >-
                        Adjust your 401k contributions to 12% of your salary by
                        year-end.
                      status: in_progress
                    - title: Review Portfolio Asset Allocation
                      description: >-
                        Ensure your investment portfolio remains diversified
                        according to your medium risk tolerance.
                      status: pending
                aiInsights:
                  - id: insight-retirement-track-001
                    title: Retirement Goal On Track
                    description: >-
                      Your retirement savings are progressing as expected, but a
                      slight increase in contributions would provide a larger
                      buffer against market fluctuations.
                    category: financial_goals
                    severity: low
                    actionableRecommendation: Adjust savings plan via the 'Quantum Planner'.
                    timestamp: '2024-07-22T19:35:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - goals
        - '{goalId}'
      description: >-
        Retrieves detailed information for a specific financial goal, including
        current progress, AI strategic plan, and related insights.
    parameters:
      - name: goalId
        in: path
        required: true
        description: Unique identifier for the financial goal.
        schema:
          type: string
        example: goal_retirement_2050
    put:
      summary: Update an Existing Financial Goal
      responses:
        '200':
          description: Example of an updated financial goal
          content:
            application/json:
              schema:
                type: object
                properties:
                  aiStrategicPlan:
                    type: object
                    description: AI-generated strategic plan for achieving the goal.
                    properties: {}
                required:
                  - currentAmount
                  - id
                  - lastUpdated
                  - name
                  - progressPercentage
                  - status
                  - targetAmount
                  - targetDate
                  - type
              example:
                id: goal_retirement_2050
                name: Retirement Fund by 2050
                type: retirement
                targetAmount: 1200000
                currentAmount: 350000
                targetDate: '2050-12-31'
                progressPercentage: 29.17
                status: behind_schedule
                contributingAccounts:
                  - acc_chase_invest_ira_001
                  - acc_fidelity_401k_xyz
                lastUpdated: '2024-07-22T19:45:00Z'
                riskTolerance: medium
                aiStrategicPlan:
                  planId: plan_retirement_2050_recalc
                  summary: >-
                    Due to the increased target, the AI recommends a more
                    aggressive savings rate or adjusting investment strategy.
                  steps:
                    - title: Increase 401k Contributions
                      description: >-
                        Adjust your 401k contributions to 15% of your salary
                        immediately.
                      status: pending
                    - title: Evaluate Higher-Growth Investments
                      description: >-
                        Review opportunities for higher-growth investments if
                        your risk tolerance allows.
                      status: pending
        '400':
          description: Common bad request error
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Invalid or missing authentication credentials
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: Insufficient permissions
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: Resource not found error
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - goals
        - '{goalId}'
      description: >-
        Updates the parameters of an existing financial goal, such as target
        amount, date, or contributing accounts. This may trigger an AI plan
        recalculation.
      requestBody:
        content:
          application/json:
            schema:
              description: Fields that can be updated for an existing financial goal.
              type: object
              properties: {}
            example:
              targetAmount: 1200000
              generateAIPlan: true
    delete:
      summary: Delete a Financial Goal
      responses:
        '204':
          description: Financial goal deleted successfully.
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - goals
        - '{goalId}'
      description: Deletes a specific financial goal from the user's profile.
  /goals:
    get:
      summary: List All User Financial Goals
      parameters:
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
      responses:
        '200':
          description: A paginated list of financial goals.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 2
                data:
                  - id: goal_retirement_2050
                    name: Retirement Fund by 2050
                    type: retirement
                    targetAmount: 1000000
                    currentAmount: 350000
                    targetDate: '2050-12-31'
                    progressPercentage: 35
                    status: on_track
                    contributingAccounts:
                      - acc_chase_invest_ira_001
                      - acc_fidelity_401k_xyz
                    lastUpdated: '2024-07-22T19:00:00Z'
                    riskTolerance: medium
                  - id: goal_home_purchase_2030
                    name: Down Payment for New Home
                    type: home_purchase
                    targetAmount: 100000
                    currentAmount: 25000
                    targetDate: '2030-06-30'
                    progressPercentage: 25
                    status: behind_schedule
                    contributingAccounts:
                      - acc_savings_001
                    lastUpdated: '2024-07-22T19:00:00Z'
                    riskTolerance: low
                nextOffset: 2
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - goals
      description: >-
        Retrieves a list of all financial goals defined by the user, including
        their progress and associated AI plans.
  /notifications/me:
    get:
      summary: List User Notifications
      parameters:
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
        - name: status
          in: query
          description: Filter notifications by their read status.
          schema:
            type: string
          example: unread
        - name: severity
          in: query
          description: Filter notifications by AI-assigned severity level.
          schema:
            type: string
          example: high
      responses:
        '200':
          description: A paginated list of user notifications.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 3
                data:
                  - id: notif_security_alert_001
                    type: security
                    title: Suspicious Login Detected
                    message: >-
                      A login attempt was made from an unrecognized
                      device/location. Please review your recent activity.
                    severity: critical
                    timestamp: '2024-07-22T20:00:00Z'
                    read: false
                    actionableLink: /users/me/security-log
                  - id: notif_budget_alert_002
                    type: financial_insight
                    title: Dining Budget Near Limit
                    message: >-
                      You've spent 85% of your dining budget for the month.
                      Consider adjusting your spending.
                    severity: medium
                    timestamp: '2024-07-22T15:30:00Z'
                    read: false
                    actionableLink: /budgets/monthly_aug
                    aiInsightId: insight-dining-overspend-002
                nextOffset: 2
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - notifications
        - me
      description: >-
        Retrieves a paginated list of personalized notifications and proactive
        AI alerts for the authenticated user, allowing filtering by status and
        severity.
  /notifications/{notificationId}/mark-read:
    post:
      summary: Mark a Notification as Read
      responses:
        '200':
          description: Notification marked as read successfully.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - id
                  - message
                  - read
                  - severity
                  - timestamp
                  - title
                  - type
              example:
                id: notif_budget_alert_002
                type: financial_insight
                title: Dining Budget Near Limit
                message: >-
                  You've spent 85% of your dining budget for the month. Consider
                  adjusting your spending.
                severity: medium
                timestamp: '2024-07-22T15:30:00Z'
                read: true
                actionableLink: /budgets/monthly_aug
                aiInsightId: insight-dining-overspend-002
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/views/personal/MarketplaceView.tsx.md
================================================================================

openapi: 3.0.0
info:
  title: JAMESBURVELOCALLAGHANIII
  version: 1.0.0
  description: >-
    Welcome to the **Quantum Core 3.0**, the pinnacle of financial technology,
    meticulously engineered to power the experience. This is far more than a
    mere set of endpoints; it is the living, breathing neural network of a
    next-generation financial ecosystem, poised to redefine digital banking for
    a global audience.


    Our API is a testament to the philosophy that finance should be an
    intelligent, predictive, and intensely personal dialogue—a dynamic,
    self-optimizing collaboration between users, visionary developers, and our
    proprietary Artificial General Intelligence, **Quantum**. We provide
    unparalleled programmatic access to the sophisticated tools and vast data
    reservoirs that fuel our platform, spanning from hyper-personalized wealth
    management to AI-driven corporate finance automation, decentralized asset
    orchestration, and pioneering business incubation.


    This comprehensive specification unveils the secure and high-performance
    protocols to connect with and command the core functionalities of . Empower
    yourself to architect and deploy the future of finance, with an
    infrastructure designed for exponential scalability, impenetrable security,
    real-time intelligence, and seamless global integration. As your most
    ambitious visions crystallize, our platform's unparalleled capabilities will
    not just meet them—they will amplify them. This is finance, reimagined,
    limitless, and brought to life by AI.
servers:
  - url: https://ce47fe80-dabc-4ad0-b0e7-cf285695b8b8.mock.pstmn.io
paths:
  /users/register:
    post:
      summary: Register a New User Account
      responses:
        '201':
          description: User registered successfully. Awaits email/MFA verification.
          content:
            application/json:
              schema:
                type: object
                properties:
                  address:
                    type: object
                    properties: {}
                  securityStatus:
                    type: object
                    description: Security-related status for the user account.
                    properties: {}
                  preferences:
                    type: object
                    description: User's personalized preferences for the platform.
                    properties:
                      notificationChannels:
                        type: object
                        description: Preferred channels for receiving notifications.
                        properties: {}
                required:
                  - email
                  - id
                  - identityVerified
                  - name
              example:
                id: user-alice-001
                name: Alice Wonderland
                email: alice.w@example.com
                phone: +1-555-987-6543
                dateOfBirth: '1990-05-10'
                address:
                  street: 123 Magic Lane
                  city: Fantasyland
                  state: CA
                  zip: '90210'
                  country: USA
                loyaltyTier: Bronze
                loyaltyPoints: 0
                gamificationLevel: 1
                aiPersona: Conservative Saver
                securityStatus:
                  twoFactorEnabled: false
                  biometricsEnrolled: false
                  lastLogin: '2024-07-22T08:00:00Z'
                  lastLoginIp: 203.0.113.10
                preferences:
                  preferredLanguage: en-US
                  theme: Light-Default
                  aiInteractionMode: balanced
                  notificationChannels:
                    email: true
                    push: true
                    sms: false
                    inApp: true
                  dataSharingConsent: true
                  transactionGrouping: category
                identityVerified: false
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '409':
          description: >-
            The request could not be completed due to a conflict with the
            current state of the resource (e.g., duplicate entry, expired
            state).
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: RESOURCE_CONFLICT
                message: >-
                  A resource with this identifier already exists or the
                  operation conflicts with an existing state.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - users
        - register
      description: >-
        Registers a new user account with , initiating the onboarding process.
        Requires basic user details.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                address:
                  type: object
                  properties: {}
              required:
                - email
                - name
                - password
            example:
              name: Alice Wonderland
              email: alice.w@example.com
              password: SecureP@ssw0rd2024!
              phone: +1-555-987-6543
  /users/login:
    post:
      summary: User Login and Session Creation
      responses:
        '200':
          description: Successful login response
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - accessToken
                  - expiresIn
                  - refreshToken
                  - tokenType
              example:
                accessToken: '{{vault:json-web-token}}'
                refreshToken: some_long_refresh_token_string_for_renewal
                expiresIn: 3600
                tokenType: Bearer
        '401':
          description: Invalid or missing authentication credentials
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: MFA required error
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: MFA_REQUIRED
                message: >-
                  Multi-factor authentication is required. Please provide your
                  MFA code.
                timestamp: '2024-07-22T08:05:00Z'
      tags:
        - users
        - login
      description: >-
        Authenticates a user and creates a secure session, returning access
        tokens. May require MFA depending on user settings.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties: {}
              required:
                - email
                - password
            example:
              email: quantum.visionary@demobank.com
              password: YourSecurePassword123
  /users/password-reset/initiate:
    post:
      summary: Initiate Password Reset
      responses:
        '200':
          description: Password reset initiated. Check your email/phone for verification.
          content:
            application/json:
              schema:
                type: object
                properties: {}
              example:
                message: Verification code sent to your registered email/phone.
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - users
        - password-reset
        - initiate
      description: >-
        Starts the password reset flow by sending a verification code or link to
        the user's registered email or phone.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties: {}
              required:
                - identifier
            example:
              identifier: reset.user@example.com
  /users/password-reset/confirm:
    post:
      summary: Confirm Password Reset
      responses:
        '200':
          description: Password reset successfully.
          content:
            application/json:
              schema:
                type: object
                properties: {}
              example:
                message: Password updated successfully.
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Invalid or expired verification code.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_VERIFICATION_CODE
                message: The provided verification code is invalid or has expired.
                timestamp: '2024-07-22T08:10:00Z'
      tags:
        - users
        - password-reset
        - confirm
      description: >-
        Confirms the password reset using the received verification code and
        sets a new password.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties: {}
              required:
                - identifier
                - newPassword
                - verificationCode
            example:
              identifier: reset.user@example.com
              verificationCode: '654321'
              newPassword: MyNewStrongPassword@789
  /users/me/preferences:
    get:
      summary: Get User Personalization Preferences
      responses:
        '200':
          description: The user's personalized preferences.
          content:
            application/json:
              schema:
                description: User's personalized preferences for the platform.
                type: object
                properties:
                  notificationChannels:
                    type: object
                    description: Preferred channels for receiving notifications.
                    properties: {}
              example:
                preferredLanguage: en-US
                theme: Light-Default
                aiInteractionMode: balanced
                notificationChannels:
                  email: true
                  push: true
                  sms: false
                  inApp: true
                dataSharingConsent: true
                transactionGrouping: category
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - users
        - me
        - preferences
      description: >-
        Retrieves the user's deep personalization preferences, including AI
        customization settings, notification channel priorities, thematic
        choices, and data sharing consents.
    put:
      summary: Update User Personalization Preferences
      responses:
        '200':
          description: User preferences updated successfully.
          content:
            application/json:
              schema:
                description: User's personalized preferences for the platform.
                type: object
                properties:
                  notificationChannels:
                    type: object
                    description: Preferred channels for receiving notifications.
                    properties: {}
              example:
                preferredLanguage: en-US
                theme: Dark-Quantum
                aiInteractionMode: proactive
                notificationChannels:
                  email: true
                  push: true
                  sms: false
                  inApp: true
                dataSharingConsent: true
                transactionGrouping: category
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - users
        - me
        - preferences
      description: >-
        Updates the user's deep personalization preferences, allowing dynamic
        control over AI behavior, notification delivery, thematic choices, and
        data privacy settings.
      requestBody:
        content:
          application/json:
            schema:
              description: User's personalized preferences for the platform.
              type: object
              properties:
                notificationChannels:
                  type: object
                  description: Preferred channels for receiving notifications.
                  properties: {}
            example:
              theme: Dark-Quantum
              aiInteractionMode: proactive
  /users/me/devices:
    get:
      summary: List Connected Devices
      parameters:
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
      responses:
        '200':
          description: A paginated list of connected devices.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 2
                data:
                  - id: dev_mobile_ios_aabbcc
                    type: mobile
                    os: iOS 17.5
                    model: iPhone 15 Pro Max
                    lastActive: '2024-07-22T11:05:00Z'
                    ipAddress: 203.0.113.12
                    trustLevel: trusted
                    pushToken: ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]
                  - id: dev_desktop_win_123456
                    type: desktop
                    os: Windows 11
                    model: Dell XPS 15
                    lastActive: '2024-07-22T10:00:00Z'
                    ipAddress: 203.0.113.15
                    trustLevel: trusted
                nextOffset: 2
      tags:
        - users
        - me
        - devices
      description: >-
        Retrieves a list of all devices linked to the user's account, including
        mobile phones, tablets, and desktops, indicating their last active
        status and security posture.
  /users/me/biometrics/verify:
    post:
      summary: Verify Biometric Data for Sensitive Operations
      responses:
        '200':
          description: Biometric verification successful.
          content:
            application/json:
              schema:
                type: object
                properties: {}
              example:
                verificationStatus: success
                message: Biometric authentication successful.
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - users
        - me
        - biometrics
        - verify
      description: >-
        Performs real-time biometric verification to authorize sensitive actions
        or access protected resources, using a one-time biometric signature.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties: {}
              required:
                - biometricSignature
                - biometricType
                - deviceId
            example:
              biometricType: fingerprint
              biometricSignature: base64encoded_one_time_fingerprint_proof
              deviceId: dev_mobile_android_ddeeff
  /users/me/biometrics:
    get:
      summary: Get Biometric Enrollment Status
      responses:
        '200':
          description: Current biometric enrollment status.
          content:
            application/json:
              schema:
                description: Current biometric enrollment status for a user.
                type: object
                properties: {}
                required:
                  - biometricsEnrolled
                  - enrolledBiometrics
              example:
                biometricsEnrolled: true
                enrolledBiometrics:
                  - type: facial_recognition
                    deviceId: dev_mobile_ios_aabbcc
                    enrollmentDate: '2024-07-22T17:00:00Z'
                  - type: fingerprint
                    deviceId: dev_mobile_android_ddeeff
                    enrollmentDate: '2024-06-15T09:30:00Z'
                lastUsed: '2024-07-22T17:30:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - users
        - me
        - biometrics
      description: >-
        Retrieves the current status of biometric enrollments for the
        authenticated user.
  /users/me:
    get:
      summary: Retrieve Comprehensive Current User Profile
      responses:
        '200':
          description: The user's complete, enriched profile information.
          content:
            application/json:
              schema:
                type: object
                properties:
                  address:
                    type: object
                    properties: {}
                  securityStatus:
                    type: object
                    description: Security-related status for the user account.
                    properties: {}
                  preferences:
                    type: object
                    description: User's personalized preferences for the platform.
                    properties:
                      notificationChannels:
                        type: object
                        description: Preferred channels for receiving notifications.
                        properties: {}
                required:
                  - email
                  - id
                  - identityVerified
                  - name
              example:
                id: user-quantum-visionary-001
                name: The Quantum Visionary
                email: quantum.visionary@demobank.com
                phone: +1-555-123-4567
                dateOfBirth: '1980-01-15'
                address:
                  street: 100 Innovation Drive
                  city: Quantumville
                  state: CA
                  zip: '90210'
                  country: USA
                loyaltyTier: Zenith Platinum
                loyaltyPoints: 12500
                gamificationLevel: 7
                aiPersona: Prudent Planner
                securityStatus:
                  twoFactorEnabled: true
                  biometricsEnrolled: true
                  lastLogin: '2024-07-22T08:00:00Z'
                  lastLoginIp: 203.0.113.45
                preferences:
                  preferredLanguage: en-US
                  theme: Dark-Quantum
                  aiInteractionMode: balanced
                  notificationChannels:
                    email: true
                    push: true
                    sms: false
                    inApp: true
                  dataSharingConsent: true
                  transactionGrouping: category
                identityVerified: true
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - users
        - me
      description: >-
        Fetches the complete and dynamically updated profile information for the
        currently authenticated user, encompassing personal details, security
        status, gamification level, loyalty points, and linked identity
        attributes.
    put:
      summary: Update Current User Profile
      responses:
        '200':
          description: Example of updated user profile
          content:
            application/json:
              schema:
                type: object
                properties:
                  address:
                    type: object
                    properties: {}
                  securityStatus:
                    type: object
                    description: Security-related status for the user account.
                    properties: {}
                  preferences:
                    type: object
                    description: User's personalized preferences for the platform.
                    properties:
                      notificationChannels:
                        type: object
                        description: Preferred channels for receiving notifications.
                        properties: {}
                required:
                  - email
                  - id
                  - identityVerified
                  - name
              example:
                id: user-quantum-visionary-001
                name: Quantum Visionary Pro
                email: quantum.visionary@demobank.com
                phone: +1-555-999-0000
                dateOfBirth: '1980-01-15'
                address:
                  street: 100 Innovation Drive
                  city: Quantumville
                  state: CA
                  zip: '90210'
                  country: USA
                loyaltyTier: Zenith Platinum
                loyaltyPoints: 12500
                gamificationLevel: 7
                aiPersona: Prudent Planner
                securityStatus:
                  twoFactorEnabled: true
                  biometricsEnrolled: true
                  lastLogin: '2024-07-22T08:00:00Z'
                  lastLoginIp: 203.0.113.45
                preferences:
                  preferredLanguage: en-US
                  theme: Dark-Quantum
                  aiInteractionMode: balanced
                  notificationChannels:
                    email: true
                    push: true
                    sms: false
                    inApp: true
                  dataSharingConsent: true
                  transactionGrouping: category
                identityVerified: true
        '400':
          description: Common bad request error
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Invalid or missing authentication credentials
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: Insufficient permissions
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - users
        - me
      description: >-
        Updates selected fields of the currently authenticated user's profile
        information.
      requestBody:
        content:
          application/json:
            schema:
              description: Fields that can be updated in a user's profile.
              type: object
              properties:
                address:
                  type: object
                  properties: {}
                preferences:
                  type: object
                  description: User's personalized preferences for the platform.
                  properties:
                    notificationChannels:
                      type: object
                      description: Preferred channels for receiving notifications.
                      properties: {}
            example:
              name: Quantum Visionary Pro
              phone: +1-555-999-0000
  /accounts/me:
    get:
      summary: List Linked Financial Accounts
      parameters:
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
      responses:
        '200':
          description: A paginated, detailed list of linked financial accounts.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 2
                data:
                  - id: acc_chase_checking_4567
                    externalId: plaid_acc_abc123
                    name: Chase Checking
                    institutionName: Chase Bank
                    mask: '4567'
                    type: depository
                    subtype: checking
                    currency: USD
                    currentBalance: 1250.75
                    availableBalance: 1200
                    lastUpdated: '2024-07-22T10:45:00Z'
                  - id: acc_fidelity_ira_1234
                    externalId: plaid_acc_def456
                    name: Fidelity IRA
                    institutionName: Fidelity Investments
                    mask: '1234'
                    type: investment
                    subtype: ira
                    currency: USD
                    currentBalance: 150000.5
                    availableBalance: 149000
                    lastUpdated: '2024-07-22T10:45:00Z'
                nextOffset: 2
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - accounts
        - me
      description: >-
        Fetches a comprehensive, real-time list of all external financial
        accounts linked to the user's  profile, including consolidated balances
        and institutional details.
  /accounts/{accountId}/details:
    get:
      summary: Get Detailed Account Analytics & Forecasts
      responses:
        '200':
          description: Detailed account information with analytics and forecasts.
          content:
            application/json:
              schema:
                allOf:
                  - description: Summary information for a linked financial account.
                    type: object
                    properties: {}
                    required:
                      - currency
                      - currentBalance
                      - id
                      - institutionName
                      - lastUpdated
                      - name
                      - type
                  - type: object
                    properties:
                      projectedCashFlow:
                        type: object
                        properties: {}
              example:
                id: acc_chase_checking_4567
                externalId: plaid_acc_abc123
                name: Chase Checking
                institutionName: Chase Bank
                mask: '4567'
                type: depository
                subtype: checking
                currency: USD
                currentBalance: 1250.75
                availableBalance: 1200
                lastUpdated: '2024-07-22T10:45:00Z'
                accountHolder: The Quantum Visionary
                interestRate: 0.01
                openedDate: '2020-03-01'
                transactionsCount: 150
                projectedCashFlow:
                  days30: 500
                  days90: 1200
                  confidenceScore: 85
                balanceHistory:
                  - date: '2024-07-21'
                    balance: 1230.5
                  - date: '2024-07-20'
                    balance: 1500
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - accounts
        - '{accountId}'
        - details
      description: >-
        Retrieves comprehensive analytics for a specific financial account,
        including historical balance trends, projected cash flow, and AI-driven
        insights into spending patterns.
    parameters:
      - name: accountId
        in: path
        required: true
        description: Unique identifier for the financial account.
        schema:
          type: string
        example: acc_chase_checking_4567
  /accounts/{accountId}/transactions/pending:
    get:
      summary: Get Pending Transactions for an Account
      parameters:
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
      responses:
        '200':
          description: A paginated list of pending transactions.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 2
                data:
                  - id: txn_pending-123
                    accountId: acc_chase_checking_4567
                    type: expense
                    category: Shopping
                    aiCategoryConfidence: 0.85
                    description: Amazon.com
                    amount: 75.2
                    currency: USD
                    date: '2024-07-22'
                    carbonFootprint: 0.5
                    paymentChannel: online
                    disputeStatus: none
                  - id: txn_pending-456
                    accountId: acc_chase_checking_4567
                    type: expense
                    category: Utilities
                    aiCategoryConfidence: 0.9
                    description: Electric Bill
                    amount: 110
                    currency: USD
                    date: '2024-07-22'
                    carbonFootprint: 2
                    paymentChannel: bill_payment
                    disputeStatus: none
                nextOffset: 2
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - accounts
        - '{accountId}'
        - transactions
        - pending
      description: >-
        Retrieves a list of pending transactions that have not yet cleared for a
        specific financial account.
    parameters:
      - name: accountId
        in: path
        required: true
        description: Unique identifier for the financial account.
        schema:
          type: string
        example: acc_chase_checking_4567
  /accounts/{accountId}/statements:
    get:
      summary: Retrieve Account Statements
      parameters:
        - name: year
          in: query
          description: Year for the statement.
          schema:
            type: integer
          example: '2024'
        - name: month
          in: query
          description: Month for the statement (1-12).
          schema:
            type: integer
          example: '7'
        - name: format
          in: query
          description: >-
            Desired format for the statement. Use 'application/json' Accept
            header for download links.
          schema:
            type: string
          example: pdf
      responses:
        '200':
          description: >-
            Account statement metadata with download links, or direct download
            in requested format.
          content:
            application/json:
              schema:
                type: object
                properties:
                  downloadUrls:
                    type: object
                    description: Map of available download URLs for different formats.
                    properties: {}
                required:
                  - accountId
                  - downloadUrls
                  - period
                  - statementId
              example:
                statementId: stmt_acc123_202407
                accountId: acc_chase_checking_4567
                period: July 2024
                downloadUrls:
                  pdf: https://demobank.com/statements/acc123_202407.pdf?sig=...
                  csv: https://demobank.com/statements/acc123_202407.csv?sig=...
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - accounts
        - '{accountId}'
        - statements
      description: >-
        Fetches digital statements for a specific account, allowing filtering by
        date range and format.
    parameters:
      - name: accountId
        in: path
        required: true
        description: Unique identifier for the financial account.
        schema:
          type: string
        example: acc_chase_checking_4567
  /accounts/{accountId}/overdraft-settings:
    get:
      summary: Get Overdraft Protection Settings
      responses:
        '200':
          description: Overdraft settings for the account.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - accountId
                  - enabled
                  - feePreference
              example:
                accountId: acc_chase_checking_4567
                enabled: true
                protectionLimit: 500
                linkToSavings: true
                linkedSavingsAccountId: acc_chase_savings_1234
                feePreference: always_pay
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - accounts
        - '{accountId}'
        - overdraft-settings
      description: >-
        Retrieves the current overdraft protection settings for a specific
        account.
    parameters:
      - name: accountId
        in: path
        required: true
        description: Unique identifier for the financial account.
        schema:
          type: string
        example: acc_chase_checking_4567
    put:
      summary: Update Overdraft Protection Settings
      responses:
        '200':
          description: Overdraft settings updated successfully.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - accountId
                  - enabled
                  - feePreference
              example:
                accountId: acc_chase_checking_4567
                enabled: false
                feePreference: decline_if_over_limit
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - accounts
        - '{accountId}'
        - overdraft-settings
      description: >-
        Updates the overdraft protection settings for a specific account,
        enabling or disabling protection and configuring preferences.
      requestBody:
        content:
          application/json:
            schema:
              description: Fields for updating overdraft protection settings.
              type: object
              properties: {}
            example:
              enabled: false
              linkToSavings: false
              feePreference: decline_if_over_limit
  /accounts/link:
    post:
      summary: Initiate Linking a New External Institution
      responses:
        '200':
          description: >-
            Account linking initiated. Provides a URI for the user to complete
            the connection securely.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - authUri
                  - linkSessionId
                  - status
              example:
                linkSessionId: link_session_xyz789
                authUri: >-
                  https://auth.plaid.com/oauth/initiate?client_id=...&redirect_uri=...
                status: pending_user_action
                message: >-
                  Please redirect user to the provided URI to complete
                  authentication.
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - accounts
        - link
      description: >-
        Begins the secure process of linking a new external financial
        institution (e.g., another bank, investment platform) to the user's 
        profile, typically involving a third-party tokenized flow.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties: {}
              required:
                - countryCode
                - institutionName
            example:
              institutionName: Bank of America
              countryCode: US
  /transactions/{transactionId}/categorize:
    put:
      summary: Manually Categorize or Recategorize a Transaction
      responses:
        '200':
          description: Transaction category updated successfully.
          content:
            application/json:
              schema:
                type: object
                properties:
                  merchantDetails:
                    type: object
                    description: >-
                      Detailed information about a merchant associated with a
                      transaction.
                    properties:
                      address:
                        type: object
                        properties: {}
                  location:
                    type: object
                    description: Geographic location details for a transaction.
                    properties: {}
                required:
                  - accountId
                  - amount
                  - category
                  - currency
                  - date
                  - description
                  - id
                  - type
              example:
                id: txn_quantum-2024-07-21-A7B8C9
                accountId: acc_chase_checking_4567
                type: expense
                category: Home > Groceries
                aiCategoryConfidence: 0.98
                description: Coffee Shop - Quantum Cafe
                amount: 12.5
                currency: USD
                date: '2024-07-21'
                postedDate: '2024-07-22'
                carbonFootprint: 1.2
                paymentChannel: in_store
                tags:
                  - work_lunch
                disputeStatus: none
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - transactions
        - '{transactionId}'
        - categorize
      description: >-
        Allows the user to override or refine the AI's categorization for a
        transaction, improving future AI accuracy and personal financial
        reporting.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties: {}
              required:
                - category
            example:
              category: Home > Groceries
              notes: Bulk purchase for party
              applyToFuture: true
    parameters:
      - name: transactionId
        in: path
        required: true
        description: Unique identifier for the transaction.
        schema:
          type: string
        example: txn_quantum-2024-07-21-A7B8C9
  /transactions/{transactionId}/notes:
    put:
      summary: Add/Update Notes for a Transaction
      responses:
        '200':
          description: Transaction notes updated successfully.
          content:
            application/json:
              schema:
                type: object
                properties:
                  merchantDetails:
                    type: object
                    description: >-
                      Detailed information about a merchant associated with a
                      transaction.
                    properties:
                      address:
                        type: object
                        properties: {}
                  location:
                    type: object
                    description: Geographic location details for a transaction.
                    properties: {}
                required:
                  - accountId
                  - amount
                  - category
                  - currency
                  - date
                  - description
                  - id
                  - type
              example:
                id: txn_quantum-2024-07-21-A7B8C9
                accountId: acc_chase_checking_4567
                type: expense
                category: Dining & Restaurants
                aiCategoryConfidence: 0.92
                description: Coffee Shop - Quantum Cafe
                amount: 12.5
                currency: USD
                date: '2024-07-21'
                postedDate: '2024-07-22'
                carbonFootprint: 1.2
                paymentChannel: in_store
                tags:
                  - work_lunch
                receiptUrl: https://demobank.com/receipts/txn_1a2b3c4d5e.pdf
                disputeStatus: none
                notes: This was a special coffee for a client meeting.
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - transactions
        - '{transactionId}'
        - notes
      description: >-
        Allows the user to add or update personal notes for a specific
        transaction.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties: {}
              required:
                - notes
            example:
              notes: This was a special coffee for a client meeting.
    parameters:
      - name: transactionId
        in: path
        required: true
        description: Unique identifier for the transaction.
        schema:
          type: string
        example: txn_quantum-2024-07-21-A7B8C9
  /transactions/{transactionId}:
    get:
      summary: Get Detailed Transaction by ID
      responses:
        '200':
          description: The requested transaction details with enhanced data.
          content:
            application/json:
              schema:
                type: object
                properties:
                  merchantDetails:
                    type: object
                    description: >-
                      Detailed information about a merchant associated with a
                      transaction.
                    properties:
                      address:
                        type: object
                        properties: {}
                  location:
                    type: object
                    description: Geographic location details for a transaction.
                    properties: {}
                required:
                  - accountId
                  - amount
                  - category
                  - currency
                  - date
                  - description
                  - id
                  - type
              example:
                id: txn_quantum-2024-07-21-A7B8C9
                accountId: acc_chase_checking_4567
                type: expense
                category: Dining & Restaurants
                aiCategoryConfidence: 0.92
                description: Coffee Shop - Quantum Cafe
                merchantDetails:
                  name: Quantum Cafe
                  logoUrl: https://assets.demobank.com/merchants/quantum_cafe.png
                  website: https://quantum.cafe
                  address:
                    city: Quantumville
                    state: CA
                    zip: '90210'
                amount: 12.5
                currency: USD
                date: '2024-07-21'
                postedDate: '2024-07-22'
                carbonFootprint: 1.2
                location:
                  latitude: 34.0522
                  longitude: -118.2437
                  city: Los Angeles
                paymentChannel: in_store
                tags:
                  - work_lunch
                receiptUrl: https://demobank.com/receipts/txn_1a2b3c4d5e.pdf
                disputeStatus: none
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - transactions
        - '{transactionId}'
      description: >-
        Retrieves granular information for a single transaction by its unique
        ID, including AI categorization confidence, merchant details, and
        associated carbon footprint.
    parameters:
      - name: transactionId
        in: path
        required: true
        description: Unique identifier for the transaction.
        schema:
          type: string
        example: txn_quantum-2024-07-21-A7B8C9
  /transactions/recurring:
    get:
      summary: List Recurring Transactions
      parameters:
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
      responses:
        '200':
          description: A paginated list of recurring transactions.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 2
                data:
                  - id: rec_txn_netflix_001
                    description: Netflix Subscription
                    category: Entertainment
                    amount: 19.99
                    currency: USD
                    frequency: monthly
                    nextDueDate: '2024-08-01'
                    lastPaidDate: '2024-07-01'
                    status: active
                    linkedAccountId: acc_chase_checking_4567
                    aiConfidenceScore: 0.95
                  - id: rec_txn_gym_002
                    description: Gym Membership
                    category: Health & Fitness
                    amount: 49
                    currency: USD
                    frequency: monthly
                    nextDueDate: '2024-08-15'
                    lastPaidDate: '2024-07-15'
                    status: active
                    linkedAccountId: acc_chase_checking_4567
                    aiConfidenceScore: 0.99
                nextOffset: 2
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - transactions
        - recurring
      description: >-
        Retrieves a list of all detected or user-defined recurring transactions,
        useful for budget tracking and subscription management.
  /transactions/insights/spending-trends:
    get:
      summary: Get AI-Driven Spending Trends
      responses:
        '200':
          description: Spending trends analysis.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - aiInsights
                  - forecastNextMonth
                  - overallTrend
                  - percentageChange
                  - period
                  - topCategoriesByChange
              example:
                period: Last 3 Months
                overallTrend: increasing
                percentageChange: 5.2
                topCategoriesByChange:
                  - category: Dining & Restaurants
                    percentageChange: 15
                    absoluteChange: 120
                  - category: Groceries
                    percentageChange: 8
                    absoluteChange: 50
                aiInsights:
                  - id: insight-spending-alert-001
                    title: High Dining Spend Alert
                    description: >-
                      Your dining expenses this month are 35% higher than your
                      average, potentially impacting your budget by $150.
                    category: spending
                    severity: medium
                    actionableRecommendation: >-
                      Consider utilizing the 'Budget Optimizer' tool to adjust
                      your dining budget or explore meal prep options.
                    timestamp: '2024-07-22T11:45:00Z'
                forecastNextMonth: 2850
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - transactions
        - insights
        - spending-trends
      description: >-
        Retrieves AI-generated insights into user spending trends over time,
        identifying patterns and anomalies.
  /transactions:
    get:
      summary: List & Filter Transactions with Advanced Options
      parameters:
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
        - name: type
          in: query
          description: Filter transactions by type (e.g., income, expense, transfer).
          schema:
            type: string
          example: expense
        - name: category
          in: query
          description: Filter transactions by their AI-assigned or user-defined category.
          schema:
            type: string
          example: Groceries
        - name: startDate
          in: query
          description: Retrieve transactions from this date (inclusive).
          schema:
            type: string
          example: '2024-01-01'
        - name: endDate
          in: query
          description: Retrieve transactions up to this date (inclusive).
          schema:
            type: string
          example: '2024-12-31'
        - name: minAmount
          in: query
          description: >-
            Filter for transactions with an amount greater than or equal to this
            value.
          schema:
            type: integer
          example: '20'
        - name: maxAmount
          in: query
          description: >-
            Filter for transactions with an amount less than or equal to this
            value.
          schema:
            type: integer
          example: '100'
        - name: searchQuery
          in: query
          description: >-
            Free-text search across transaction descriptions, merchants, and
            notes.
          schema:
            type: string
          example: Starbucks
      responses:
        '200':
          description: A paginated, intelligently filtered list of transactions.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 5
                data:
                  - id: txn_quantum-2024-07-21-A7B8C9
                    accountId: acc_chase_checking_4567
                    type: expense
                    category: Dining & Restaurants
                    aiCategoryConfidence: 0.92
                    description: Coffee Shop - Quantum Cafe
                    merchantDetails:
                      name: Quantum Cafe
                      logoUrl: https://assets.demobank.com/merchants/quantum_cafe.png
                      website: https://quantum.cafe
                      address:
                        city: Quantumville
                        state: CA
                        zip: '90210'
                    amount: 12.5
                    currency: USD
                    date: '2024-07-21'
                    postedDate: '2024-07-22'
                    carbonFootprint: 1.2
                    paymentChannel: in_store
                    tags:
                      - work_lunch
                    disputeStatus: none
                  - id: txn_quantum-2024-07-20-B1C2D3
                    accountId: acc_chase_checking_4567
                    type: expense
                    category: Groceries
                    aiCategoryConfidence: 0.95
                    description: Whole Foods Market
                    merchantDetails:
                      name: Whole Foods Market
                      logoUrl: https://assets.demobank.com/merchants/whole_foods.png
                      website: https://wholefoodsmarket.com
                      address:
                        city: Quantumville
                        state: CA
                        zip: '90210'
                    amount: 85.3
                    currency: USD
                    date: '2024-07-20'
                    postedDate: '2024-07-20'
                    carbonFootprint: 5.5
                    paymentChannel: in_store
                    tags:
                      - weekly_shop
                    disputeStatus: none
                nextOffset: 2
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - transactions
      description: >-
        Retrieves a paginated list of the user's transactions, with extensive
        options for filtering by type, category, date range, amount, and
        intelligent AI-driven sorting and search capabilities.
  /budgets/{budgetId}:
    get:
      summary: Get Detailed Budget Information
      responses:
        '200':
          description: Detailed budget information.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - alertThreshold
                  - categories
                  - endDate
                  - id
                  - name
                  - period
                  - remainingAmount
                  - spentAmount
                  - startDate
                  - status
                  - totalAmount
              example:
                id: budget_monthly_aug
                name: August 2024 Household Budget
                period: monthly
                startDate: '2024-08-01'
                endDate: '2024-08-31'
                totalAmount: 3000
                spentAmount: 1200.5
                remainingAmount: 1799.5
                categories:
                  - name: Groceries
                    allocated: 500
                    spent: 250.75
                    remaining: 249.25
                  - name: Utilities
                    allocated: 150
                    spent: 110
                    remaining: 40
                  - name: Dining & Restaurants
                    allocated: 300
                    spent: 350
                    remaining: -50
                status: active
                alertThreshold: 80
                aiRecommendations:
                  - id: insight-budget-overspend-001
                    title: Dining Budget Exceeded
                    description: >-
                      You've exceeded your dining budget by $50. Consider
                      reallocating funds or reducing future dining expenses.
                    category: budget
                    severity: medium
                    actionableRecommendation: >-
                      Adjust your 'Dining & Restaurants' category or use the
                      'Budget Optimizer' tool.
                    timestamp: '2024-07-22T13:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - budgets
        - '{budgetId}'
      description: >-
        Retrieves detailed information for a specific budget, including current
        spending, remaining amounts, and AI recommendations.
    parameters:
      - name: budgetId
        in: path
        required: true
        description: Unique identifier for the budget.
        schema:
          type: string
        example: budget_monthly_aug
    put:
      summary: Update an Existing Budget
      responses:
        '200':
          description: Budget updated successfully.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - alertThreshold
                  - categories
                  - endDate
                  - id
                  - name
                  - period
                  - remainingAmount
                  - spentAmount
                  - startDate
                  - status
                  - totalAmount
              example:
                id: budget_monthly_aug
                name: August 2024 Household Budget
                period: monthly
                startDate: '2024-08-01'
                endDate: '2024-08-31'
                totalAmount: 3200
                spentAmount: 1200.5
                remainingAmount: 1999.5
                categories:
                  - name: Groceries
                    allocated: 500
                    spent: 250.75
                    remaining: 249.25
                status: active
                alertThreshold: 85
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - budgets
        - '{budgetId}'
      description: >-
        Updates the parameters of an existing budget, such as total amount,
        dates, or categories.
      requestBody:
        content:
          application/json:
            schema:
              description: Fields that can be updated for an existing budget.
              type: object
              properties: {}
            example:
              totalAmount: 3200
              alertThreshold: 85
  /budgets:
    get:
      summary: List All User Budgets
      parameters:
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
      responses:
        '200':
          description: A paginated list of user budgets.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 2
                data:
                  - id: budget_monthly_aug
                    name: August 2024 Household Budget
                    period: monthly
                    startDate: '2024-08-01'
                    endDate: '2024-08-31'
                    totalAmount: 3000
                    spentAmount: 1200.5
                    remainingAmount: 1799.5
                    categories:
                      - name: Groceries
                        allocated: 500
                        spent: 250.75
                        remaining: 249.25
                      - name: Utilities
                        allocated: 150
                        spent: 110
                        remaining: 40
                    status: active
                    alertThreshold: 80
                  - id: budget_vacation_2025
                    name: 2025 Europe Trip
                    period: yearly
                    startDate: '2024-01-01'
                    endDate: '2025-12-31'
                    totalAmount: 5000
                    spentAmount: 1500
                    remainingAmount: 3500
                    categories:
                      - name: Flights
                        allocated: 2000
                        spent: 800
                        remaining: 1200
                    status: active
                    alertThreshold: 90
                nextOffset: 2
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - budgets
      description: >-
        Retrieves a list of all active and historical budgets for the
        authenticated user.
  /investments/portfolios/{portfolioId}/rebalance:
    post:
      summary: Initiate AI-Driven Portfolio Rebalancing
      responses:
        '202':
          description: >-
            Portfolio rebalancing initiated. Details will be provided
            asynchronously.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - portfolioId
                  - rebalanceId
                  - status
                  - statusMessage
              example:
                rebalanceId: rebal_port_growth_123
                portfolioId: portfolio_equity_growth
                status: analyzing
                statusMessage: >-
                  AI is analyzing optimal trade strategy to match target risk
                  profile.
                estimatedImpact: Projected 5% reduction in portfolio volatility.
                confirmationRequired: true
                confirmationExpiresAt: '2024-07-22T15:00:00Z'
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - investments
        - portfolios
        - '{portfolioId}'
        - rebalance
      description: >-
        Triggers an AI-driven rebalancing process for a specific investment
        portfolio based on a target risk tolerance or strategy.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties: {}
              required:
                - targetRiskTolerance
            example:
              targetRiskTolerance: medium
              dryRun: true
              confirmationRequired: true
    parameters:
      - name: portfolioId
        in: path
        required: true
        description: Unique identifier for the investment portfolio.
        schema:
          type: string
        example: portfolio_equity_growth
  /investments/portfolios/{portfolioId}:
    get:
      summary: Get Detailed Investment Portfolio
      responses:
        '200':
          description: Detailed investment portfolio information.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - currency
                  - id
                  - lastUpdated
                  - name
                  - riskTolerance
                  - todayGainLoss
                  - totalValue
                  - type
                  - unrealizedGainLoss
              example:
                id: portfolio_equity_growth
                name: Aggressive Growth Portfolio
                type: equities
                currency: USD
                totalValue: 250000
                unrealizedGainLoss: 25000
                todayGainLoss: 500
                lastUpdated: '2024-07-22T10:00:00Z'
                riskTolerance: aggressive
                aiPerformanceInsights:
                  - id: insight-market-outlook-001
                    title: Strong Tech Sector Performance
                    description: >-
                      The AI predicts continued strong performance in the tech
                      sector, which currently forms a significant portion of
                      your portfolio.
                    category: investing
                    severity: low
                    timestamp: '2024-07-22T14:15:00Z'
                holdings:
                  - symbol: AAPL
                    name: Apple Inc.
                    quantity: 100
                    averageCost: 150
                    currentPrice: 180
                    marketValue: 18000
                    percentageOfPortfolio: 7.2
                    esgScore: 8.5
                  - symbol: MSFT
                    name: Microsoft Corp.
                    quantity: 50
                    averageCost: 300
                    currentPrice: 320
                    marketValue: 16000
                    percentageOfPortfolio: 6.4
                    esgScore: 8.9
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - investments
        - portfolios
        - '{portfolioId}'
      description: >-
        Retrieves detailed information for a specific investment portfolio,
        including holdings, performance, and AI insights.
    parameters:
      - name: portfolioId
        in: path
        required: true
        description: Unique identifier for the investment portfolio.
        schema:
          type: string
        example: portfolio_equity_growth
    put:
      summary: Update Investment Portfolio Details
      responses:
        '200':
          description: Investment portfolio updated successfully.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - currency
                  - id
                  - lastUpdated
                  - name
                  - riskTolerance
                  - todayGainLoss
                  - totalValue
                  - type
                  - unrealizedGainLoss
              example:
                id: portfolio_equity_growth
                name: Aggressive Growth Portfolio
                type: equities
                currency: USD
                totalValue: 250000
                unrealizedGainLoss: 25000
                todayGainLoss: 500
                lastUpdated: '2024-07-22T14:30:00Z'
                riskTolerance: medium
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - investments
        - portfolios
        - '{portfolioId}'
      description: >-
        Updates high-level details of an investment portfolio, such as name or
        risk tolerance.
      requestBody:
        content:
          application/json:
            schema:
              description: Fields that can be updated for an investment portfolio.
              type: object
              properties: {}
            example:
              riskTolerance: medium
              aiRebalancingFrequency: quarterly
  /investments/portfolios:
    get:
      summary: List All Investment Portfolios
      parameters:
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
      responses:
        '200':
          description: A paginated list of investment portfolios.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 2
                data:
                  - id: portfolio_equity_growth
                    name: Aggressive Growth Portfolio
                    type: equities
                    currency: USD
                    totalValue: 250000
                    unrealizedGainLoss: 25000
                    todayGainLoss: 500
                    lastUpdated: '2024-07-22T10:00:00Z'
                    riskTolerance: aggressive
                  - id: portfolio_retirement_bond
                    name: Retirement Bond Portfolio
                    type: bonds
                    currency: USD
                    totalValue: 180000
                    unrealizedGainLoss: 5000
                    todayGainLoss: 100
                    lastUpdated: '2024-07-22T10:00:00Z'
                    riskTolerance: low
                nextOffset: 2
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - investments
        - portfolios
      description: >-
        Retrieves a summary of all investment portfolios linked to the user's
        account.
  /investments/assets/search:
    get:
      summary: Search for Investment Assets with ESG Scores
      parameters:
        - name: query
          in: query
          description: Search query for asset name or symbol.
          schema:
            type: string
          example: Tesla
        - name: minESGScore
          in: query
          description: Minimum desired ESG score (0-10).
          schema:
            type: integer
          example: '7'
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
      responses:
        '200':
          description: A paginated list of investment assets with ESG data.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 2
                data:
                  - assetSymbol: TSLA
                    assetName: Tesla Inc.
                    assetType: stock
                    currentPrice: 250.75
                    currency: USD
                    overallESGScore: 9.1
                    environmentalScore: 9.5
                    socialScore: 8.8
                    governanceScore: 9
                    esgRatingProvider: MSCI
                    esgControversies:
                      - Labor Practices Controversy
                    aiESGInsight: >-
                      Tesla's high environmental score is driven by its focus on
                      sustainable transportation, though social scores reflect
                      recent labor concerns.
                  - assetSymbol: Vanguard Total Stock Market ETF
                    assetName: Vanguard Total Stock Market ETF
                    assetType: etf
                    currentPrice: 200
                    currency: USD
                    overallESGScore: 7.8
                    environmentalScore: 7.5
                    socialScore: 8
                    governanceScore: 8
                    esgRatingProvider: Sustainalytics
                    esgControversies: []
                    aiESGInsight: >-
                      A broadly diversified ETF with a solid overall ESG
                      profile, reflecting average market performance in
                      sustainability.
                nextOffset: 2
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - investments
        - assets
        - search
      description: >-
        Searches for available investment assets (stocks, ETFs, mutual funds)
        and returns their ESG impact scores.
  /ai/advisor/chat/history:
    get:
      summary: Retrieve AI Advisor Conversation History
      parameters:
        - name: sessionId
          in: query
          description: >-
            Optional: Filter history by a specific session ID. If omitted,
            recent conversations will be returned.
          schema:
            type: string
          example: session-quantum-xyz-789-alpha
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
      responses:
        '200':
          description: Paginated list of chat messages.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 3
                data:
                  - role: user
                    content: What is my current net worth?
                    timestamp: '2024-07-22T18:00:00Z'
                  - role: assistant
                    content: >-
                      I've completed a detailed analysis of your spending. It
                      appears your dining expenses account for 35% of your total
                      outflows this month, significantly higher than your target.
                      Would you like me to identify specific areas for reduction or
                      suggest alternative dining options?
                    timestamp: '2024-07-22T18:01:00Z'
                  - role: user
                    content: Yes, please provide a breakdown.
                    timestamp: '2024-07-22T18:02:00Z'
                nextOffset: 2
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - ai
        - advisor
        - chat
        - history
      description: >-
        Fetches the full conversation history with the Quantum AI Advisor for a
        given session or user.
  /ai/advisor/chat:
    post:
      summary: Send a Message to the Quantum AI Advisor
      responses:
        '200':
          description: AI response with spending insights
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - sessionId
              example:
                text: >-
                  I've completed a detailed analysis of your spending. It
                  appears your dining expenses account for 35% of your total
                  outflows this month, significantly higher than your target.
                  Would you like me to identify specific areas for reduction or
                  suggest alternative dining options?
                sessionId: session-quantum-xyz-789-alpha
                proactiveInsights:
                  - id: insight-dining-overspend-002
                    title: High Dining Spend Alert
                    description: >-
                      Your dining expenses this month are 35% higher than your
                      average, potentially impacting your budget by $150.
                    category: spending
                    severity: medium
                    actionableRecommendation: >-
                      Consider utilizing the 'Budget Optimizer' tool to adjust
                      your dining budget or explore meal prep options.
                    timestamp: '2024-07-22T15:00:00Z'
        '400':
          description: Common bad request error
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Invalid or missing authentication credentials
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '503':
          description: AI service overloaded
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: AI_SERVICE_UNAVAILABLE
                message: >-
                  The Quantum AI Advisor service is temporarily overloaded.
                  Please try again in a few minutes.
                timestamp: '2024-07-22T15:05:00Z'
      tags:
        - ai
        - advisor
        - chat
      description: >-
        Initiates or continues a sophisticated conversation with Quantum, the AI
        Advisor. Quantum can provide advanced financial insights, execute
        complex tasks via an expanding suite of intelligent tools, and learn
        from user interactions to offer hyper-personalized guidance.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                functionResponse:
                  type: object
                  description: >-
                    Optional: The output from a tool function that the AI
                    previously requested to be executed.
                  properties: {}
              example:
                message: >-
                  Can you analyze my recent spending patterns and suggest areas
                  for saving, focusing on my dining expenses?
                sessionId: session-quantum-xyz-789-alpha
  /ai/advisor/tools:
    get:
      summary: List Available AI Tools for Quantum
      parameters:
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
      responses:
        '200':
          description: A paginated list of available AI tools.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 2
                data:
                  - name: send_money
                    description: >-
                      Sends money to a specified recipient from the user's
                      primary checking account.
                    parameters:
                      type: object
                      properties:
                        amount:
                          type: number
                          description: The amount of money to send.
                        recipient:
                          type: string
                          description: The name or ID of the recipient.
                        currency:
                          type: string
                          description: The currency of the transaction (e.g., USD, EUR).
                      required:
                        - amount
                        - recipient
                        - currency
                    accessScope: write:payments
                  - name: get_account_balance
                    description: >-
                      Retrieves the current balance of a specified financial
                      account.
                    parameters:
                      type: object
                      properties:
                        accountId:
                          type: string
                          description: The ID of the account.
                      required:
                        - accountId
                    accessScope: read:accounts
                nextOffset: 2
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - ai
        - advisor
        - tools
      description: >-
        Retrieves a dynamic manifest of all integrated AI tools that Quantum can
        invoke and execute, providing details on their capabilities, parameters,
        and access requirements.
  /ai/oracle/simulate/advanced:
    post:
      summary: Run an Advanced Multi-Variable Financial Simulation
      responses:
        '200':
          description: >-
            Advanced simulation completed successfully, returning granular
            impact analysis, sensitivity curves, and optimized strategies.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - overallSummary
                  - scenarioResults
                  - simulationId
              example:
                simulationId: sim_oracle-complex-macro-123
                overallSummary: >-
                  The advanced simulation reveals that a job loss scenario has a
                  significant initial impact on liquidity, but recovery is
                  highly dependent on market conditions and the duration of
                  unemployment. Proactive savings and diversified investments
                  are key mitigating factors.
                scenarioResults:
                  - scenarioName: Job Loss & Mild Market Recovery
                    narrativeSummary: >-
                      In this scenario, initial liquidity challenges are
                      observed, but a swift market recovery and prudent spending
                      lead to recovery within 3 years.
                    finalNetWorthProjected: 1250000
                    liquidityMetrics:
                      minCashBalance: -5000
                      recoveryTimeMonths: 36
                    sensitivityAnalysisGraphs:
                      - paramName: marketRecoveryRate
                        data:
                          - paramValue: 0.03
                            outcomeValue: 1100000
                          - paramValue: 0.05
                            outcomeValue: 1250000
                          - paramValue: 0.07
                            outcomeValue: 1400000
                strategicRecommendations:
                  - id: insight-emergency-fund-003
                    title: Strengthen Emergency Fund
                    description: >-
                      Maintain an emergency fund equivalent to 6-12 months of
                      living expenses to buffer against unexpected job loss.
                    category: saving
                    severity: high
                    actionableRecommendation: >-
                      Consult with treasury manager to explore investment
                      options.
                    timestamp: '2024-07-22T16:30:00Z'
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '503':
          description: >-
            AI simulation service is experiencing extended processing times or
            is unavailable for complex requests.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: SIMULATION_LONG_PROCESSING
                message: >-
                  AI simulation service is experiencing extended processing
                  times for complex requests. Please allow more time.
                timestamp: '2024-07-22T16:45:00Z'
      tags:
        - ai
        - oracle
        - simulate
        - advanced
      description: >-
        Engages the Quantum Oracle for highly complex, multi-variable
        simulations, allowing precise control over numerous financial
        parameters, market conditions, and personal events to generate deep,
        predictive insights and sensitivity analysis.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                globalEconomicFactors:
                  type: object
                  description: >-
                    Optional: Global economic conditions to apply to all
                    scenarios.
                  properties: {}
                personalAssumptions:
                  type: object
                  description: >-
                    Optional: Personal financial assumptions to override
                    defaults.
                  properties: {}
              required:
                - prompt
                - scenarios
            example:
              prompt: >-
                Evaluate the long-term impact of a sudden job loss combined with
                a variable market downturn, analyzing worst-case and best-case
                recovery scenarios over a decade.
              scenarios:
                - name: Job Loss & Mild Market Recovery
                  events:
                    - type: job_loss
                      details:
                        durationMonths: 6
                        severanceAmount: 10000
                        unemploymentBenefits: 2000
                    - type: market_downturn
                      details:
                        impactPercentage: 0.15
                        recoveryYears: 3
                  durationYears: 10
                  sensitivityAnalysisParams:
                    - paramName: marketRecoveryRate
                      min: 0.03
                      max: 0.07
                      step: 0.01
  /ai/oracle/simulate:
    post:
      summary: Run a 'What-If' Financial Simulation (Standard)
      responses:
        '200':
          description: >-
            The simulation was successful. The response contains a detailed
            impact analysis and actionable recommendations.
          content:
            application/json:
              schema:
                type: object
                properties:
                  riskAnalysis:
                    type: object
                    description: AI-driven risk assessment of the simulated scenario.
                    properties: {}
                required:
                  - keyImpacts
                  - narrativeSummary
                  - simulationId
              example:
                simulationId: sim_oracle-growth-2024-xyz
                narrativeSummary: >-
                  If you consistently invest an additional $1,000 per month into
                  your aggressive growth portfolio over the next 5 years, the
                  Quantum Oracle predicts your portfolio could grow by
                  approximately 45-60%, significantly increasing your wealth.
                  However, this comes with elevated risk during market
                  downturns.
                keyImpacts:
                  - metric: Projected Portfolio Value
                    value: $120,000 - $140,000
                    severity: high
                  - metric: Overall Net Worth Increase
                    value: $60,000 - $70,000
                    severity: high
                recommendations:
                  - title: Review Portfolio Diversification
                    description: >-
                      Given the aggressive nature of this strategy, the Oracle
                      suggests reviewing your current portfolio diversification
                      to mitigate concentration risk.
                    actionTrigger: open_portfolio_diversification_tool
                riskAnalysis:
                  maxDrawdown: 0.25
                  volatilityIndex: 0.18
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '503':
          description: >-
            AI simulation service is temporarily unavailable due to high demand
            or maintenance.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: SIMULATION_SERVICE_UNAVAILABLE
                message: >-
                  AI simulation service is temporarily unavailable due to high
                  demand. Please try again shortly.
                timestamp: '2024-07-22T16:00:00Z'
      tags:
        - ai
        - oracle
        - simulate
      description: >-
        Submits a hypothetical scenario to the Quantum Oracle AI for standard
        financial impact analysis. The AI simulates the effect on the user's
        current financial state and provides a summary.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties: {}
              required:
                - prompt
            example:
              prompt: >-
                What if I invest an additional $1,000 per month into my
                aggressive growth portfolio for the next 5 years?
              parameters:
                durationYears: 5
                monthlyInvestmentAmount: 1000
                riskTolerance: aggressive
  /ai/oracle/simulations/{simulationId}:
    get:
      summary: Get Detailed Simulation Results
      responses:
        '200':
          description: Detailed simulation results.
          content:
            application/json:
              schema:
                oneOf:
                  - type: object
                    properties:
                      riskAnalysis:
                        type: object
                        description: AI-driven risk assessment of the simulated scenario.
                        properties: {}
                    required:
                      - keyImpacts
                      - narrativeSummary
                      - simulationId
                  - type: object
                    properties: {}
                    required:
                      - overallSummary
                      - scenarioResults
                      - simulationId
              example:
                simulationId: sim_oracle-growth-2024-xyz
                narrativeSummary: >-
                  If you consistently invest an additional $1,000 per month into
                  your aggressive growth portfolio over the next 5 years, the
                  Quantum Oracle predicts your portfolio could grow by
                  approximately 45-60%...
                keyImpacts:
                  - metric: Projected Portfolio Value
                    value: $120,000 - $140,000
                    severity: high
                recommendations:
                  - title: Review Portfolio Diversification
                    description: >-
                      Given the aggressive nature of this strategy, the Oracle
                      suggests reviewing your current portfolio diversification
                      to mitigate concentration risk.
                riskAnalysis:
                  maxDrawdown: 0.25
                  volatilityIndex: 0.18
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - ai
        - oracle
        - simulations
        - '{simulationId}'
      description: >-
        Retrieves the full, detailed results of a specific financial simulation
        by its ID.
    parameters:
      - name: simulationId
        in: path
        required: true
        description: Unique identifier for the financial simulation.
        schema:
          type: string
        example: sim_oracle-growth-2024-xyz
  /ai/oracle/simulations:
    get:
      summary: List All User Simulations
      parameters:
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
      responses:
        '200':
          description: A paginated list of financial simulations.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 3
                data:
                  - simulationId: sim_oracle-growth-2024-xyz
                    title: Investment Growth Scenario
                    status: completed
                    creationDate: '2024-07-20T10:00:00Z'
                    lastUpdated: '2024-07-20T10:15:00Z'
                    summary: >-
                      Simulated impact of additional monthly investments over 5
                      years.
                  - simulationId: sim_oracle-complex-macro-123
                    title: Job Loss & Market Downturn Impact
                    status: completed
                    creationDate: '2024-07-18T14:30:00Z'
                    lastUpdated: '2024-07-18T14:45:00Z'
                    summary: >-
                      Evaluated long-term impact of job loss with variable
                      market conditions.
                nextOffset: 2
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - ai
        - oracle
        - simulations
      description: >-
        Retrieves a list of all financial simulations previously run by the
        user, including their status and summaries.
  /ai/incubator/pitch/{pitchId}/details:
    get:
      summary: Get Detailed AI Analysis & Feedback for a Business Pitch
      responses:
        '200':
          description: >-
            Comprehensive details of the pitch's current state, AI feedback, and
            next steps.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - lastUpdated
                      - nextSteps
                      - pitchId
                      - stage
                      - statusMessage
                  - type: object
                    properties:
                      aiFinancialModel:
                        type: object
                        description: AI's detailed financial model analysis.
                        properties:
                          revenueBreakdown:
                            type: object
                            example:
                              Year 1: 2.5M
                              Year 2: 7.8M
                              Year 3: 15M
                          costStructureAnalysis:
                            type: object
                            example:
                              Fixed Costs: 30%
                              Variable Costs: 40%
                              R&D: 15%
                      aiMarketAnalysis:
                        type: object
                        description: AI's detailed market analysis.
                        properties: {}
                      aiCoachingPlan:
                        type: object
                        description: AI-generated coaching plan for the entrepreneur.
                        properties: {}
                      aiRiskAssessment:
                        type: object
                        description: AI's assessment of risks associated with the venture.
                        properties: {}
              example:
                pitchId: pitch_qw_synergychain-xyz
                stage: feedback_required
                statusMessage: >-
                  Quantum Weaver has completed its initial analysis. Please
                  review the feedback and answer the outstanding questions.
                lastUpdated: '2024-07-22T21:00:00Z'
                feedbackSummary: Initial analysis indicates a strong market fit, but further detail is required on customer acquisition costs and scaling strategy.
                questions:
                  - id: q_qa-team-001
                    question: >-
                      Please elaborate on the specific technical challenges you
                      anticipate in deploying your quantum-inspired algorithms
                      at scale, and how your team plans to mitigate these.
                    category: technology
                    isRequired: true
                  - id: q_qa-market-002
                    question: >-
                      Provide more granular projections for customer acquisition
                      cost (CAC) for the first 12 months.
                    category: market
                    isRequired: true
                nextSteps: >-
                  Please address the outstanding questions in the 'questions'
                  array and resubmit feedback.
                estimatedFundingOffer: 5000000
                aiFinancialModel:
                  revenueBreakdown:
                    Year 1: 2.5M
                    Year 2: 7.8M
                    Year 3: 15M
                  costStructureAnalysis:
                    Fixed Costs: 30%
                    Variable Costs: 40%
                    R&D: 15%
                  breakevenPoint: 18 months
                  capitalRequirements: 4500000
                  sensitivityAnalysis:
                    - scenario: Aggressive Growth
                      projectedIRR: 0.35
                      terminalValue: 50000000
                    - scenario: Moderate Growth
                      projectedIRR: 0.2
                      terminalValue: 30000000
                aiMarketAnalysis:
                  targetMarketSize: $50 Billion (TAM)
                  competitiveAdvantages:
                    - Proprietary AI Algorithm
                    - First-mover advantage in quantum-AI finance
                  growthOpportunities: >-
                    Expansion into APAC region, new product lines (e.g.,
                    corporate treasury solutions).
                  riskFactors: >-
                    Regulatory changes in AI governance, talent acquisition
                    challenges.
                aiCoachingPlan:
                  title: Pre-Seed Fundraising Strategy
                  summary: >-
                    This plan outlines key strategic steps to optimize your
                    pitch deck, identify target investors, and prepare for due
                    diligence to secure pre-seed funding.
                  steps:
                    - title: Refine Investor Presentation
                      description: >-
                        Update your pitch deck to incorporate recent market
                        validation data and clearly articulate the competitive
                        differentiation of SynergyChain AI, guided by feedback
                        from Quantum Weaver.
                      timeline: 1-2 weeks
                      status: pending
                      resources:
                        - name: Pitch Deck Template
                          url: https://demobank.com/resources/pitch-template.pptx
                    - title: Market Research Deep Dive
                      description: >-
                        Conduct further detailed market research to validate
                        customer acquisition cost assumptions for enterprise
                        clients.
                      timeline: 2 weeks
                      status: pending
                investorMatchScore: 0.88
                aiRiskAssessment:
                  technicalRisk: >-
                    Medium (complex AI development, quantum compute
                    dependencies)
                  marketRisk: >-
                    Low (established market, clear pain points, strong value
                    prop)
                  teamRisk: >-
                    Low (experienced founding team with relevant domain
                    expertise)
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - ai
        - incubator
        - pitch
        - '{pitchId}'
        - details
      description: >-
        Retrieves the granular AI-driven analysis, strategic feedback, market
        validation results, and any outstanding questions from Quantum Weaver
        for a specific business pitch.
    parameters:
      - name: pitchId
        in: path
        required: true
        description: Unique identifier for the business pitch.
        schema:
          type: string
        example: pitch_qw_synergychain-xyz
  /ai/incubator/pitch/{pitchId}/feedback:
    put:
      summary: Submit Feedback or Answers to AI Questions for a Business Pitch
      responses:
        '200':
          description: Feedback submitted successfully. Pitch status updated.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - lastUpdated
                  - nextSteps
                  - pitchId
                  - stage
                  - statusMessage
              example:
                pitchId: pitch_qw_synergychain-xyz
                stage: ai_analysis
                statusMessage: >-
                  Thank you for your feedback. Quantum Weaver is now
                  re-evaluating your pitch based on the new information.
                lastUpdated: '2024-07-22T22:00:00Z'
                feedbackSummary: Updated technical and market details provided.
                questions: []
                nextSteps: The AI will provide updated analysis and next steps shortly.
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - ai
        - incubator
        - pitch
        - '{pitchId}'
        - feedback
      description: >-
        Allows the entrepreneur to respond to specific questions or provide
        additional details requested by Quantum Weaver, moving the pitch forward
        in the incubation process.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties: {}
            example:
              feedback: >-
                Regarding the technical challenges, our team has allocated 3
                months for R&D on quantum-resistant cryptography, mitigating the
                risk. We've also brought in Dr. Elena Petrova, a leading expert
                in secure multi-party computation.
              answers:
                - questionId: q_qa-team-001
                  answer: >-
                    Our mitigation strategy includes dedicated R&D and new hires
                    with specific expertise.
                - questionId: q_qa-market-002
                  answer: >-
                    Our CAC projections are based on pilot program results
                    showing $500 per enterprise client with a conversion rate of
                    10% from trials.
    parameters:
      - name: pitchId
        in: path
        required: true
        description: Unique identifier for the business pitch.
        schema:
          type: string
        example: pitch_qw_synergychain-xyz
  /ai/incubator/pitch:
    post:
      summary: Submit a High-Potential Business Plan to Quantum Weaver
      responses:
        '202':
          description: >-
            The business plan was successfully ingested and is undergoing
            initial AI analysis. A unique pitch ID is provided for tracking
            progress.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - lastUpdated
                  - nextSteps
                  - pitchId
                  - stage
                  - statusMessage
              example:
                pitchId: pitch_qw_synergychain-xyz
                stage: initial_review
                statusMessage: >-
                  Your business plan has been received and is undergoing initial
                  review by Quantum Weaver.
                lastUpdated: '2024-07-22T20:00:00Z'
                nextSteps: >-
                  Please monitor for AI-generated feedback and potential
                  questions within the next 48 hours.
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '409':
          description: >-
            The request could not be completed due to a conflict with the
            current state of the resource (e.g., duplicate entry, expired
            state).
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: RESOURCE_CONFLICT
                message: >-
                  A resource with this identifier already exists or the
                  operation conflicts with an existing state.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - ai
        - incubator
        - pitch
      description: >-
        Submits a detailed business plan to the Quantum Weaver AI for rigorous
        analysis, market validation, and seed funding consideration. This
        initiates the AI-driven incubation journey, aiming to transform
        innovative ideas into commercially successful ventures.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                financialProjections:
                  type: object
                  description: >-
                    Key financial metrics and projections for the next 3-5
                    years.
                  properties: {}
              required:
                - businessPlan
                - financialProjections
                - foundingTeam
                - marketOpportunity
            example:
              businessPlan: >-
                Quantum-AI powered financial advisor platform leveraging neural
                networks for predictive analytics and hyper-personalized
                advice...
              foundingTeam:
                - name: Dr. Eleanor Vance
                  role: CEO & Lead AI Scientist
                  experience: >-
                    15+ years in AI/ML, PhD in Quantum Computing, ex-Google
                    Brain
                - name: Marcus Thorne
                  role: COO & Finance Expert
                  experience: 20+ years in Fintech, ex-Goldman Sachs
              marketOpportunity: >-
                The booming digital finance market coupled with demand for truly
                personalized, AI-driven financial guidance presents a
                multi-billion dollar opportunity. Our unique quantum-AI approach
                provides unparalleled accuracy and foresight.
              financialProjections:
                seedRoundAmount: 2500000
                valuationPreMoney: 10000000
                projectionYears: 3
                revenueForecast:
                  - 500000
                  - 2000000
                  - 6000000
                profitabilityEstimate: Achieve profitability within 18 months.
  /ai/incubator/pitches:
    get:
      summary: List All User Business Pitches
      parameters:
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
        - name: status
          in: query
          description: Filter pitches by their current stage.
          schema:
            type: string
          example: feedback_required
      responses:
        '200':
          description: A paginated list of business pitches.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 3
                data:
                  - pitchId: pitch_qw_synergychain-xyz
                    stage: feedback_required
                    statusMessage: >-
                      Quantum Weaver has completed its initial analysis. Please
                      review the feedback and answer the outstanding questions.
                    lastUpdated: '2024-07-22T21:00:00Z'
                    feedbackSummary: >-
                      Initial analysis indicates a strong market fit, but
                      further detail is required on customer acquisition costs
                      and scaling strategy.
                    questions:
                      - id: q_qa-team-001
                        question: Please elaborate on technical challenges.
                        category: technology
                        isRequired: true
                    nextSteps: Please address the outstanding questions.
                  - pitchId: pitch_qw_fintech-ai-app
                    stage: approved_for_funding
                    statusMessage: >-
                      Congratulations! Your pitch has been approved for seed
                      funding.
                    lastUpdated: '2024-07-15T10:00:00Z'
                    estimatedFundingOffer: 1000000
                    nextSteps: Contact our investment team to finalize terms.
                nextOffset: 2
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - ai
        - incubator
        - pitches
      description: >-
        Retrieves a summary list of all business pitches submitted by the
        authenticated user to Quantum Weaver.
  /ai/ads/generate:
    post:
      summary: Generate a Standard Video Ad with Veo 2.0
      responses:
        '202':
          description: >-
            Video generation initiated. The response contains an operation ID to
            poll for status updates and retrieve the final asset.
          content:
            application/json:
              schema:
                type: object
                properties: {}
              example:
                operationId: op-video-gen-12345-abcde
                estimatedCompletionTimeSeconds: 300
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - ai
        - ads
        - generate
      description: >-
        Submits a request to generate a high-quality video ad using the advanced
        Veo 2.0 generative AI model. This is an asynchronous operation, suitable
        for standard ad content creation.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties: {}
              required:
                - lengthSeconds
                - prompt
                - style
            example:
              prompt: >-
                A captivating ad featuring a young entrepreneur using 's AI
                tools to grow their startup. Focus on innovation and ease of
                use.
              style: Cinematic
              lengthSeconds: 15
              aspectRatio: '16:9'
              brandColors:
                - '#0000FF'
                - '#FFD700'
  /ai/ads/operations/{operationId}:
    get:
      summary: Get Video Generation Status & Retrieve Asset
      responses:
        '200':
          description: Video generation in progress
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - message
                  - operationId
                  - progressPercentage
                  - status
              example:
                operationId: op-video-gen-12345-abcde
                status: rendering
                progressPercentage: 75
                message: Encoding final video with optimized codecs...
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - ai
        - ads
        - operations
        - '{operationId}'
      description: >-
        Polls the real-time status of an asynchronous video generation
        operation. Once complete ('done'), the response includes a temporary,
        signed URL to access and download the generated video asset.
    parameters:
      - name: operationId
        in: path
        required: true
        description: The unique identifier for the video generation operation.
        schema:
          type: string
        example: op-video-gen-12345-abcde
  /ai/ads:
    get:
      summary: List All Generated Video Ads
      parameters:
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
        - name: status
          in: query
          description: Filter ads by their generation status.
          schema:
            type: string
          example: done
      responses:
        '200':
          description: A paginated list of generated video ads.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 3
                data:
                  - operationId: op-video-gen-12345-abcde
                    status: done
                    progressPercentage: 100
                    message: Video generation successfully completed.
                    videoUri: >-
                      https://demobank-cdn.com/generated-videos/final/1a2b3c4d.mp4?sig=eyJ...
                    previewImageUri: >-
                      https://demobank-cdn.com/generated-videos/preview/1a2b3c4d.png
                  - operationId: op-adv-video-gen-xyz789-fghjk
                    status: done
                    progressPercentage: 100
                    message: Advanced video generation completed.
                    videoUri: >-
                      https://demobank-cdn.com/generated-videos/final/adv_1a2b3c4d.mp4?sig=eyJ...
                    previewImageUri: >-
                      https://demobank-cdn.com/generated-videos/preview/adv_1a2b3c4d.png
                nextOffset: 2
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - ai
        - ads
      description: >-
        Retrieves a list of all video advertisements previously generated by the
        user in the AI Ad Studio.
  /corporate/cards/{cardId}/controls:
    put:
      summary: Update Granular Corporate Card Spending Controls
      responses:
        '200':
          description: The corporate card with its advanced controls updated successfully.
          content:
            application/json:
              schema:
                type: object
                properties:
                  controls:
                    type: object
                    description: Granular spending controls for a corporate card.
                    properties: {}
                required:
                  - cardNumberMask
                  - cardType
                  - controls
                  - createdDate
                  - currency
                  - expirationDate
                  - frozen
                  - holderName
                  - id
                  - status
              example:
                id: corp_card_xyz987654
                holderName: Alex Johnson
                associatedEmployeeId: emp_ajohnson_007
                cardNumberMask: 4111********1234
                expirationDate: '2028-12-31'
                status: Active
                frozen: false
                cardType: physical
                controls:
                  atmWithdrawals: true
                  contactlessPayments: true
                  onlineTransactions: true
                  internationalTransactions: true
                  monthlyLimit: 3000
                  dailyLimit: 750
                  singleTransactionLimit: 1000
                  merchantCategoryRestrictions:
                    - Software Subscriptions
                    - Conferences
                  vendorRestrictions:
                    - Amazon
                    - Uber
                spendingPolicyId: policy_travel_eu
                createdDate: '2023-01-15T09:00:00Z'
                currency: USD
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - corporate
        - cards
        - '{cardId}'
        - controls
      description: >-
        Updates the sophisticated spending controls, limits, and policy
        overrides for a specific corporate card, enabling real-time adjustments
        for security and budget adherence.
      requestBody:
        content:
          application/json:
            schema:
              description: Granular spending controls for a corporate card.
              type: object
              properties: {}
            example:
              monthlyLimit: 3000
              dailyLimit: 750
              internationalTransactions: true
              merchantCategoryRestrictions:
                - Software Subscriptions
                - Conferences
    parameters:
      - name: cardId
        in: path
        required: true
        description: Unique identifier for the corporate card.
        schema:
          type: string
        example: corp_card_xyz987654
  /corporate/cards/{cardId}/freeze:
    post:
      summary: Instantly Freeze or Unfreeze a Corporate Card
      responses:
        '200':
          description: Example of a frozen corporate card
          content:
            application/json:
              schema:
                type: object
                properties:
                  controls:
                    type: object
                    description: Granular spending controls for a corporate card.
                    properties: {}
                required:
                  - cardNumberMask
                  - cardType
                  - controls
                  - createdDate
                  - currency
                  - expirationDate
                  - frozen
                  - holderName
                  - id
                  - status
              example:
                id: corp_card_xyz987654
                holderName: Alex Johnson
                associatedEmployeeId: emp_ajohnson_007
                cardNumberMask: 4111********1234
                expirationDate: '2028-12-31'
                status: Suspended
                frozen: true
                cardType: physical
                controls:
                  atmWithdrawals: true
                  contactlessPayments: true
                  onlineTransactions: true
                  internationalTransactions: false
                  monthlyLimit: 2500
                  dailyLimit: 500
                  singleTransactionLimit: 1000
                  merchantCategoryRestrictions:
                    - Restaurants
                    - Travel
                    - Office Supplies
                  vendorRestrictions:
                    - Amazon
                    - Uber
                spendingPolicyId: policy_travel_eu
                createdDate: '2023-01-15T09:00:00Z'
                currency: USD
        '401':
          description: Invalid or missing authentication credentials
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: Insufficient permissions
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: Resource not found error
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - corporate
        - cards
        - '{cardId}'
        - freeze
      description: >-
        Immediately changes the frozen status of a corporate card, preventing or
        allowing transactions in real-time, critical for security and expense
        management.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties: {}
              required:
                - freeze
            example:
              freeze: true
    parameters:
      - name: cardId
        in: path
        required: true
        description: Unique identifier for the corporate card.
        schema:
          type: string
        example: corp_card_xyz987654
  /corporate/cards/{cardId}/transactions:
    get:
      summary: List Transactions for a Corporate Card
      parameters:
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
        - name: startDate
          in: query
          description: Start date for filtering results (inclusive, YYYY-MM-DD).
          schema:
            type: string
          example: '2024-01-01'
        - name: endDate
          in: query
          description: End date for filtering results (inclusive, YYYY-MM-DD).
          schema:
            type: string
          example: '2024-12-31'
      responses:
        '200':
          description: A paginated list of corporate card transactions.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 5
                data:
                  - id: corp_txn_google_ads_1
                    accountId: corp_card_virtual_marketing
                    type: expense
                    category: Advertising
                    aiCategoryConfidence: 0.98
                    description: Google Ads Payment
                    merchantDetails:
                      name: Google Ads
                    amount: 150
                    currency: USD
                    date: '2024-07-10'
                    postedDate: '2024-07-11'
                    paymentChannel: online
                    disputeStatus: none
                  - id: corp_txn_amazon_office
                    accountId: corp_card_xyz987654
                    type: expense
                    category: Office Supplies
                    aiCategoryConfidence: 0.9
                    description: Amazon.com
                    merchantDetails:
                      name: Amazon
                    amount: 75.5
                    currency: USD
                    date: '2024-07-05'
                    postedDate: '2024-07-06'
                    paymentChannel: online
                    disputeStatus: none
                nextOffset: 2
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - corporate
        - cards
        - '{cardId}'
        - transactions
      description: >-
        Retrieves a paginated list of transactions made with a specific
        corporate card, including AI categorization and compliance flags.
    parameters:
      - name: cardId
        in: path
        required: true
        description: Unique identifier for the corporate card.
        schema:
          type: string
        example: corp_card_xyz987654
  /corporate/cards/virtual:
    post:
      summary: Issue a New Virtual Corporate Card
      responses:
        '201':
          description: Virtual corporate card issued successfully.
          content:
            application/json:
              schema:
                type: object
                properties:
                  controls:
                    type: object
                    description: Granular spending controls for a corporate card.
                    properties: {}
                required:
                  - cardNumberMask
                  - cardType
                  - controls
                  - createdDate
                  - currency
                  - expirationDate
                  - frozen
                  - holderName
                  - id
                  - status
              example:
                id: corp_card_virtual_marketing_q4
                holderName: Marketing Campaign Q4
                associatedEmployeeId: emp_marketing_01
                cardNumberMask: 5123********5678
                expirationDate: '2025-12-31'
                status: Active
                frozen: false
                cardType: virtual
                controls:
                  atmWithdrawals: false
                  contactlessPayments: false
                  onlineTransactions: true
                  internationalTransactions: false
                  monthlyLimit: 1000
                  dailyLimit: 500
                  singleTransactionLimit: 200
                  merchantCategoryRestrictions:
                    - Advertising
                  vendorRestrictions:
                    - Facebook Ads
                    - Google Ads
                createdDate: '2024-07-22T16:00:00Z'
                currency: USD
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - corporate
        - cards
        - virtual
      description: >-
        Creates and issues a new virtual corporate card with specified spending
        limits, merchant restrictions, and expiration dates, ideal for secure
        online purchases and temporary projects.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                controls:
                  type: object
                  description: Granular spending controls for a corporate card.
                  properties: {}
              required:
                - controls
                - expirationDate
                - holderName
                - purpose
            example:
              holderName: Marketing Campaign Q4
              associatedEmployeeId: emp_marketing_01
              purpose: Online advertising for Q4 campaigns
              controls:
                atmWithdrawals: false
                contactlessPayments: false
                onlineTransactions: true
                internationalTransactions: false
                monthlyLimit: 1000
                dailyLimit: 500
                singleTransactionLimit: 200
                merchantCategoryRestrictions:
                  - Advertising
                vendorRestrictions:
                  - Facebook Ads
                  - Google Ads
              expirationDate: '2025-12-31'
  /corporate/cards:
    get:
      summary: List All Corporate Enterprise Cards
      parameters:
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
      responses:
        '200':
          description: A paginated, detailed list of all corporate enterprise cards.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 2
                data:
                  - id: corp_card_xyz987654
                    holderName: Alex Johnson
                    associatedEmployeeId: emp_ajohnson_007
                    cardNumberMask: 4111********1234
                    expirationDate: '2028-12-31'
                    status: Active
                    frozen: false
                    cardType: physical
                    controls:
                      atmWithdrawals: true
                      contactlessPayments: true
                      onlineTransactions: true
                      internationalTransactions: false
                      monthlyLimit: 2500
                      dailyLimit: 500
                      singleTransactionLimit: 1000
                      merchantCategoryRestrictions:
                        - Restaurants
                        - Travel
                        - Office Supplies
                      vendorRestrictions:
                        - Amazon
                        - Uber
                    spendingPolicyId: policy_travel_eu
                    createdDate: '2023-01-15T09:00:00Z'
                    currency: USD
                  - id: corp_card_virtual_marketing
                    holderName: Marketing Campaign Q3
                    associatedEmployeeId: emp_marketing_01
                    cardNumberMask: 5123********5678
                    expirationDate: '2025-09-30'
                    status: Active
                    frozen: false
                    cardType: virtual
                    controls:
                      atmWithdrawals: false
                      contactlessPayments: false
                      onlineTransactions: true
                      internationalTransactions: false
                      monthlyLimit: 500
                      dailyLimit: 500
                      singleTransactionLimit: 200
                      merchantCategoryRestrictions:
                        - Advertising
                      vendorRestrictions:
                        - Facebook Ads
                        - Google Ads
                    createdDate: '2024-07-01T10:00:00Z'
                    currency: USD
                nextOffset: 2
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - corporate
        - cards
      description: >-
        Retrieves a comprehensive list of all physical and virtual corporate
        cards associated with the user's organization, including their status,
        assigned holder, and current spending controls.
  /corporate/anomalies/{anomalyId}/status:
    put:
      summary: Update Anomaly Review Status
      responses:
        '200':
          description: The updated anomaly object with the new status and resolution notes.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - aiConfidenceScore
                  - description
                  - entityId
                  - entityType
                  - id
                  - recommendedAction
                  - riskScore
                  - severity
                  - status
                  - timestamp
              example:
                id: anom_risk-2024-07-21-D1E2F3
                description: Unusual large transaction detected in an inactive account.
                details: >-
                  Transaction of $15,000 to 'International Widgets Inc.' from
                  account 'CHASE CHECKING 4567'. This account has been dormant
                  for 6 months...
                severity: Critical
                status: Resolved
                entityType: Transaction
                entityId: txn_quantum-2024-07-21-A7B8C9
                timestamp: '2024-07-21T10:15:30Z'
                riskScore: 95
                aiConfidenceScore: 0.98
                recommendedAction: >-
                  Immediately freeze associated corporate card and contact
                  cardholder for verification.
                relatedTransactions:
                  - txn_previous_small_txns
                resolutionNotes: >-
                  Confirmed legitimate transaction after contacting vendor.
                  Marked as resolved.
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - corporate
        - anomalies
        - '{anomalyId}'
        - status
      description: >-
        Updates the review status of a specific financial anomaly, allowing
        compliance officers to mark it as dismissed, resolved, or escalate for
        further investigation after thorough AI-assisted and human review.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties: {}
              required:
                - status
            example:
              status: Resolved
              resolutionNotes: >-
                Confirmed legitimate transaction after contacting vendor. Marked
                as resolved.
    parameters:
      - name: anomalyId
        in: path
        required: true
        description: Unique identifier for the financial anomaly.
        schema:
          type: string
        example: anom_risk-2024-07-21-D1E2F3
  /corporate/anomalies:
    get:
      summary: List AI-Detected Financial Anomalies
      parameters:
        - name: status
          in: query
          description: Filter anomalies by their current review status.
          schema:
            type: string
          example: New
        - name: severity
          in: query
          description: Filter anomalies by their AI-assessed severity level.
          schema:
            type: string
          example: Critical
        - name: entityType
          in: query
          description: >-
            Filter anomalies by the type of financial entity they are related
            to.
          schema:
            type: string
          example: Transaction
        - name: startDate
          in: query
          description: Start date for filtering results (inclusive, YYYY-MM-DD).
          schema:
            type: string
          example: '2024-01-01'
        - name: endDate
          in: query
          description: End date for filtering results (inclusive, YYYY-MM-DD).
          schema:
            type: string
          example: '2024-12-31'
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
      responses:
        '200':
          description: >-
            A paginated list of AI-detected financial anomalies, prioritized by
            risk score.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 3
                data:
                  - id: anom_risk-2024-07-21-D1E2F3
                    description: Unusual large transaction detected in an inactive account.
                    details: >-
                      Transaction of $15,000 to 'International Widgets Inc.'
                      from account 'CHASE CHECKING 4567'. This account has been
                      dormant for 6 months and typical transactions are under
                      $500. High risk score due to dormancy and unusual
                      amount/payee combination.
                    severity: Critical
                    status: New
                    entityType: Transaction
                    entityId: txn_quantum-2024-07-21-A7B8C9
                    timestamp: '2024-07-21T10:15:30Z'
                    riskScore: 95
                    aiConfidenceScore: 0.98
                    recommendedAction: >-
                      Immediately freeze associated corporate card and contact
                      cardholder for verification.
                    relatedTransactions:
                      - txn_previous_small_txns
                  - id: anom_risk-2024-07-22-E4F5G6
                    description: >-
                      Multiple failed login attempts followed by successful
                      login from new IP.
                    details: >-
                      Five failed login attempts from IP 192.0.2.10, immediately
                      followed by a successful login from a new IP 203.0.113.20.
                      Suggests possible credential stuffing attack.
                    severity: High
                    status: Under Review
                    entityType: User
                    entityId: user-quantum-visionary-001
                    timestamp: '2024-07-22T09:00:00Z'
                    riskScore: 88
                    aiConfidenceScore: 0.92
                    recommendedAction: Request user to verify login via MFA, alert security team.
                    relatedTransactions: []
                nextOffset: 2
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - corporate
        - anomalies
      description: >-
        Retrieves a comprehensive list of AI-detected financial anomalies across
        transactions, payments, and corporate cards that require immediate
        review and potential action to mitigate risk and ensure compliance.
  /corporate/compliance/audits/{auditId}/report:
    get:
      summary: Retrieve AI-Generated Compliance Audit Report
      responses:
        '200':
          description: The comprehensive compliance audit report.
          content:
            application/json:
              schema:
                type: object
                properties:
                  periodCovered:
                    type: object
                    description: The period covered by this audit report.
                    properties: {}
                required:
                  - auditDate
                  - auditId
                  - findings
                  - overallComplianceScore
                  - periodCovered
                  - recommendedActions
                  - status
                  - summary
              example:
                auditId: audit_corp_xyz789
                status: completed
                auditDate: '2024-07-22T19:00:00Z'
                periodCovered:
                  startDate: '2024-01-01'
                  endDate: '2024-06-30'
                overallComplianceScore: 92
                summary: >-
                  Overall high compliance across all transaction types. Minor
                  areas for improvement identified in expense reporting related
                  to receipt documentation.
                findings:
                  - type: recommendation
                    severity: Low
                    description: >-
                      Several small transactions lacked complete receipt
                      documentation in the expense management system.
                    relatedEntities:
                      - txn_abc123
                      - txn_def456
                  - type: observation
                    severity: Low
                    description: >-
                      Automated sanction screening system shows 99.8% coverage,
                      with 0.2% requiring manual review.
                recommendedActions:
                  - id: insight-receipt-compliance-004
                    title: Improve Receipt Submission Compliance
                    description: >-
                      Implement automated reminders for employees to upload
                      receipts for all transactions above $20.
                    category: compliance
                    severity: low
                    actionableRecommendation: Configure expense system rules.
                    timestamp: '2024-07-22T19:05:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - corporate
        - compliance
        - audits
        - '{auditId}'
        - report
      description: Retrieves the full report generated by an AI-driven compliance audit.
    parameters:
      - name: auditId
        in: path
        required: true
        description: Unique identifier for the compliance audit.
        schema:
          type: string
        example: audit_corp_xyz789
  /corporate/compliance/audits:
    post:
      summary: Request an AI-Driven Compliance Audit Report
      responses:
        '202':
          description: >-
            Compliance audit initiated. An audit ID is returned to check the
            status and retrieve the report.
          content:
            application/json:
              schema:
                type: object
                properties: {}
              example:
                auditId: audit_corp_xyz789
                status: processing
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - corporate
        - compliance
        - audits
      description: >-
        Initiates an AI-powered compliance audit for a specific period or scope,
        generating a comprehensive report detailing adherence to regulatory
        frameworks, internal policies, and flagging potential risks.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties: {}
              required:
                - auditScope
                - endDate
                - regulatoryFrameworks
                - startDate
            example:
              auditScope: all_transactions
              startDate: '2024-01-01'
              endDate: '2024-06-30'
              regulatoryFrameworks:
                - AML
                - PCI-DSS
  /corporate/sanction-screening:
    post:
      summary: Perform Real-time Sanction Screening
      responses:
        '200':
          description: Clear screening result
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - matchDetails
                  - matchFound
                  - screeningId
                  - screeningTimestamp
                  - status
              example:
                screeningId: screen_xyz456
                matchFound: false
                matchDetails: []
                screeningTimestamp: '2024-07-22T19:30:00Z'
                status: clear
        '400':
          description: Common bad request error
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Invalid or missing authentication credentials
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: Insufficient permissions
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - corporate
        - sanction-screening
      description: >-
        Executes a real-time screening of an individual or entity against global
        sanction lists and watchlists.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                address:
                  type: object
                  properties: {}
              required:
                - country
                - entityType
                - name
            example:
              name: John Doe
              country: US
              dateOfBirth: '1970-01-01'
              entityType: individual
  /corporate/treasury/cash-flow/forecast:
    get:
      summary: Get AI-Driven Corporate Cash Flow Forecast
      parameters:
        - name: forecastHorizonDays
          in: query
          description: >-
            The number of days into the future for which to generate the cash
            flow forecast (e.g., 30, 90, 180).
          schema:
            type: integer
          example: '90'
        - name: includeScenarioAnalysis
          in: query
          description: >-
            If true, the forecast will include best-case and worst-case scenario
            analysis alongside the most likely projection.
          schema:
            type: boolean
          example: 'true'
      responses:
        '200':
          description: A comprehensive AI-driven cash flow forecast report.
          content:
            application/json:
              schema:
                type: object
                properties:
                  inflowForecast:
                    type: object
                    description: Forecast of cash inflows by source.
                    properties: {}
                  outflowForecast:
                    type: object
                    description: Forecast of cash outflows by category.
                    properties: {}
                required:
                  - aiRecommendations
                  - currency
                  - forecastId
                  - inflowForecast
                  - liquidityRiskScore
                  - outflowForecast
                  - overallStatus
                  - period
                  - projectedBalances
              example:
                forecastId: cf_forecast_corp_Q3_2024
                period: Q3 2024 (July - September)
                currency: USD
                overallStatus: positive_outlook
                projectedBalances:
                  - date: '2024-07-31'
                    projectedCash: 1500000
                    scenario: most_likely
                  - date: '2024-08-31'
                    projectedCash: 1750000
                    scenario: most_likely
                  - date: '2024-07-31'
                    projectedCash: 1400000
                    scenario: worst_case
                  - date: '2024-07-31'
                    projectedCash: 1600000
                    scenario: best_case
                inflowForecast:
                  totalProjected: 3000000
                  bySource:
                    - source: Client Payments
                      amount: 2500000
                    - source: Investment Returns
                      amount: 500000
                outflowForecast:
                  totalProjected: 2000000
                  byCategory:
                    - category: Payroll
                      amount: 1000000
                    - category: Operating Expenses
                      amount: 700000
                liquidityRiskScore: 15
                aiRecommendations:
                  - id: insight-cash-optimization-001
                    title: Optimize Short-Term Investments
                    description: >-
                      With a strong positive cash flow outlook, consider
                      allocating surplus funds to short-term, low-risk
                      investments to maximize returns.
                    category: corporate_treasury
                    severity: low
                    actionableRecommendation: >-
                      Consult with treasury manager to explore investment
                      options.
                    timestamp: '2024-07-22T19:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - corporate
        - treasury
        - cash-flow
        - forecast
      description: >-
        Retrieves an advanced AI-driven cash flow forecast for the organization,
        projecting liquidity, identifying potential surpluses or deficits, and
        providing recommendations for optimal treasury management.
  /corporate/treasury/liquidity-positions:
    get:
      summary: Get Real-time Corporate Liquidity Positions
      responses:
        '200':
          description: Real-time liquidity positions.
          content:
            application/json:
              schema:
                type: object
                properties:
                  shortTermInvestments:
                    type: object
                    description: >-
                      Details on short-term investments contributing to
                      liquidity.
                    properties: {}
                  aiLiquidityAssessment:
                    type: object
                    description: AI's overall assessment of liquidity.
                    properties: {}
                required:
                  - accountTypeBreakdown
                  - aiLiquidityAssessment
                  - aiRecommendations
                  - currencyBreakdown
                  - shortTermInvestments
                  - snapshotTime
                  - totalLiquidAssets
              example:
                snapshotTime: '2024-07-22T18:30:00Z'
                totalLiquidAssets: 5200000
                currencyBreakdown:
                  - currency: USD
                    amount: 4000000
                    percentage: 76.9
                  - currency: EUR
                    amount: 1000000
                    percentage: 19.2
                  - currency: GBP
                    amount: 200000
                    percentage: 3.9
                accountTypeBreakdown:
                  - type: Checking
                    amount: 3500000
                  - type: Savings
                    amount: 500000
                  - type: Money Market
                    amount: 1200000
                shortTermInvestments:
                  totalValue: 1200000
                  maturingNext30Days: 300000
                aiLiquidityAssessment:
                  status: optimal
                  message: >-
                    Current liquidity is optimal and sufficient for all
                    short-term obligations and planned expenditures. High
                    flexibility for strategic investments.
                aiRecommendations:
                  - id: insight-investment-strategy-002
                    title: Review Mid-Term Investment Strategy
                    description: >-
                      Given the robust liquidity, consider reviewing
                      opportunities for mid-term strategic investments to
                      enhance capital growth without compromising short-term
                      operational needs.
                    category: corporate_treasury
                    severity: low
                    actionableRecommendation: Schedule meeting with investment committee.
                    timestamp: '2024-07-22T18:40:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - corporate
        - treasury
        - liquidity-positions
      description: >-
        Provides a real-time overview of the organization's liquidity across all
        accounts, currencies, and short-term investments.
  /corporate/risk/fraud/rules/{ruleId}:
    put:
      summary: Update an AI-Powered Fraud Detection Rule
      responses:
        '200':
          description: Fraud detection rule updated successfully.
          content:
            application/json:
              schema:
                type: object
                properties:
                  criteria:
                    type: object
                    description: Criteria that define when a fraud rule should trigger.
                    properties: {}
                  action:
                    type: object
                    description: Action to take when a fraud rule is triggered.
                    properties: {}
                    required:
                      - details
                      - type
                required:
                  - action
                  - createdAt
                  - createdBy
                  - criteria
                  - description
                  - id
                  - lastUpdated
                  - name
                  - severity
                  - status
              example:
                id: fraud_rule_high_value_inactive
                name: High Value Transaction from Inactive Account
                description: >-
                  Flags transactions over a certain threshold from accounts that
                  have been inactive for a specified period.
                status: inactive
                severity: High
                criteria:
                  transactionAmountMin: 7500
                  accountInactivityDays: 60
                  transactionType: debit
                  countryOfOrigin:
                    - US
                    - CA
                action:
                  type: flag
                  details: Flag for manual review only, do not block.
                createdBy: system:ai-risk-engine
                createdAt: '2024-05-01T10:00:00Z'
                lastUpdated: '2024-07-22T20:15:00Z'
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - corporate
        - risk
        - fraud
        - rules
        - '{ruleId}'
      description: >-
        Updates an existing custom AI-powered fraud detection rule, modifying
        its criteria, actions, or status.
      requestBody:
        content:
          application/json:
            schema:
              description: Fields that can be updated for an existing fraud detection rule.
              type: object
              properties:
                criteria:
                  type: object
                  description: Criteria that define when a fraud rule should trigger.
                  properties: {}
                action:
                  type: object
                  description: Action to take when a fraud rule is triggered.
                  properties: {}
                  required:
                    - details
                    - type
            example:
              status: inactive
              criteria:
                transactionAmountMin: 7500
                accountInactivityDays: 60
              action:
                type: flag
                details: Flag for manual review only, do not block.
    parameters:
      - name: ruleId
        in: path
        required: true
        description: Unique identifier for the fraud detection rule.
        schema:
          type: string
        example: fraud_rule_high_value_inactive
  /corporate/risk/fraud/rules:
    get:
      summary: List AI-Powered Fraud Detection Rules
      parameters:
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
      responses:
        '200':
          description: A paginated list of fraud detection rules.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 2
                data:
                  - id: fraud_rule_high_value_inactive
                    name: High Value Transaction from Inactive Account
                    description: >-
                      Flags transactions over a certain threshold from accounts
                      that have been inactive for a specified period.
                    status: active
                    severity: High
                    criteria:
                      transactionAmountMin: 5000
                      accountInactivityDays: 90
                      transactionType: debit
                      countryOfOrigin:
                        - US
                        - CA
                    action:
                      type: block
                      details: Block transaction and send critical alert to fraud team.
                    createdBy: system:ai-risk-engine
                    createdAt: '2024-05-01T10:00:00Z'
                    lastUpdated: '2024-07-20T11:30:00Z'
                  - id: fraud_rule_suspicious_geo
                    name: Suspicious Geolocation Mismatch
                    description: >-
                      Detects transactions originating from a geolocation
                      significantly different from recent login activity without
                      prior travel notification.
                    status: active
                    severity: Critical
                    criteria:
                      geographicDistanceKm: 5000
                      lastLoginDays: 7
                      noTravelNotification: true
                    action:
                      type: alert
                      details: >-
                        Send immediate MFA challenge to user and flag for
                        review.
                    createdBy: system:ai-risk-engine
                    createdAt: '2024-06-10T09:00:00Z'
                    lastUpdated: '2024-07-01T10:00:00Z'
                nextOffset: 2
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - corporate
        - risk
        - fraud
        - rules
      description: >-
        Retrieves a list of AI-powered fraud detection rules currently active
        for the organization, including their parameters, thresholds, and
        associated actions (e.g., flag, block, alert).
  /web3/wallets/{walletId}/balances:
    get:
      summary: Get Crypto Asset Balances for a Wallet
      parameters:
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
      responses:
        '200':
          description: A paginated list of crypto asset balances.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 3
                offset: 0
                total: 3
                data:
                  - assetSymbol: ETH
                    assetName: Ethereum
                    balance: 2.5
                    usdValue: 7500
                    contractAddress: 0x...
                  - assetSymbol: USDC
                    assetName: USD Coin
                    balance: 1000
                    usdValue: 1000
                    contractAddress: 0x...
                  - assetSymbol: LINK
                    assetName: Chainlink
                    balance: 50
                    usdValue: 700
                    contractAddress: 0x...
                nextOffset: 3
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - web3
        - wallets
        - '{walletId}'
        - balances
      description: >-
        Retrieves the current balances of all recognized crypto assets within a
        specific connected wallet.
    parameters:
      - name: walletId
        in: path
        required: true
        description: Unique identifier for the crypto wallet connection.
        schema:
          type: string
        example: wallet_conn_eth_0xabc123
  /web3/wallets:
    get:
      summary: List Connected Crypto Wallets
      parameters:
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
      responses:
        '200':
          description: A paginated list of connected cryptocurrency wallets.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 2
                data:
                  - id: wallet_conn_eth_0xabc123
                    walletProvider: MetaMask
                    walletAddress: '0x25a6f8b7C4dC6f5F3E7A3D7E8C9B0A1B2C3D4E5F'
                    blockchainNetwork: Ethereum
                    status: connected
                    lastSynced: '2024-07-22T13:00:00Z'
                    readAccessGranted: true
                    writeAccessGranted: false
                  - id: wallet_conn_sol_0xdef456
                    walletProvider: Phantom
                    walletAddress: '0x2A1B3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0B'
                    blockchainNetwork: Solana
                    status: connected
                    lastSynced: '2024-07-22T12:45:00Z'
                    readAccessGranted: true
                    writeAccessGranted: false
                nextOffset: 2
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - web3
        - wallets
      description: >-
        Retrieves a list of all securely linked cryptocurrency wallets (e.g.,
        MetaMask, Ledger integration), showing their addresses, associated
        networks, and verification status.
    post:
      summary: Connect a New Crypto Wallet
      responses:
        '201':
          description: Wallet connection initiated or confirmed successfully.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - blockchainNetwork
                  - id
                  - lastSynced
                  - readAccessGranted
                  - status
                  - walletAddress
                  - walletProvider
                  - writeAccessGranted
              example:
                id: wallet_conn_eth_0x123abc
                walletProvider: MetaMask
                walletAddress: '0x123abc456def7890123abc456def7890123abc456def'
                blockchainNetwork: Ethereum
                status: connected
                lastSynced: '2024-07-22T20:00:00Z'
                readAccessGranted: true
                writeAccessGranted: false
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '409':
          description: >-
            The request could not be completed due to a conflict with the
            current state of the resource (e.g., duplicate entry, expired
            state).
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: RESOURCE_CONFLICT
                message: >-
                  A resource with this identifier already exists or the
                  operation conflicts with an existing state.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - web3
        - wallets
      description: >-
        Initiates the process to securely connect a new cryptocurrency wallet to
        the user's  profile, typically involving a signed message or OAuth flow
        from the wallet provider.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties: {}
              required:
                - blockchainNetwork
                - signedMessage
                - walletAddress
                - walletProvider
            example:
              walletAddress: 0x123abc456def7890...
              walletProvider: MetaMask
              signedMessage: >-
                0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890
              blockchainNetwork: Ethereum
  /web3/nfts:
    get:
      summary: Retrieve User's NFT Collection
      parameters:
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
      responses:
        '200':
          description: A paginated list of the user's NFT assets.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 2
                data:
                  - id: nft_bored_ape_yacht_club_1234
                    collectionName: Bored Ape Yacht Club
                    name: 'Bored Ape #1234'
                    description: >-
                      A unique digital collectible from the Bored Ape Yacht Club
                      series.
                    imageUrl: >-
                      https://opensea.io/assets/ethereum/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/1234
                    blockchainNetwork: Ethereum
                    ownerAddress: '0x25a6f8b7C4dC6f5F3E7A3D7E8C9B0A1B2C3D4E5F'
                    contractAddress: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d'
                    tokenId: '1234'
                    lastSalePriceUSD: 150000
                    estimatedValueUSD: 160000
                    attributes:
                      - trait_type: Background
                        value: Blue
                      - trait_type: Fur
                        value: Brown
                  - id: nft_cryptopunk_5678
                    collectionName: CryptoPunks
                    name: 'CryptoPunk #5678'
                    imageUrl: https://larvalabs.com/cryptopunks/punk5678.png
                    blockchainNetwork: Ethereum
                    ownerAddress: '0x25a6f8b7C4dC6f5F3E7A3D7E8C9B0A1B2C3D4E5F'
                    contractAddress: '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb'
                    tokenId: '5678'
                    lastSalePriceUSD: 200000
                    estimatedValueUSD: 210000
                    attributes:
                      - trait_type: Accessory
                        value: Headband
                nextOffset: 2
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - web3
        - nfts
      description: >-
        Fetches a comprehensive list of Non-Fungible Tokens (NFTs) owned by the
        user across all connected wallets and supported blockchain networks,
        including metadata and market values.
  /web3/transactions/initiate:
    post:
      summary: Initiate a Cryptocurrency Transfer
      responses:
        '202':
          description: Crypto transfer initiated. Awaiting user signature/confirmation.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - status
                  - transferId
              example:
                transferId: crypto_txn_xyz789
                status: pending_signature
                message: Please confirm the transaction in your MetaMask wallet.
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - web3
        - transactions
        - initiate
      description: >-
        Prepares and initiates a cryptocurrency transfer from a connected wallet
        to a specified recipient address. Requires user confirmation (e.g., via
        wallet signature).
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties: {}
              required:
                - amount
                - assetSymbol
                - blockchainNetwork
                - recipientAddress
                - sourceWalletId
            example:
              sourceWalletId: wallet_conn_eth_0xabc123
              recipientAddress: '0xdef4567890abcdef1234567890abcdef1234567890'
              amount: 0.1
              assetSymbol: ETH
              blockchainNetwork: Ethereum
              gasPriceGwei: 50
              memo: Payment for services
  /payments/fx/rates:
    get:
      summary: Get Real-time & Predictive Foreign Exchange Rates
      parameters:
        - name: baseCurrency
          in: query
          description: The base currency code (e.g., USD).
          schema:
            type: string
          example: USD
        - name: targetCurrency
          in: query
          description: The target currency code (e.g., EUR).
          schema:
            type: string
          example: EUR
        - name: forecastDays
          in: query
          description: Number of days into the future to provide an AI-driven prediction.
          schema:
            type: integer
          example: '7'
      responses:
        '200':
          description: Real-time and predictive foreign exchange rates.
          content:
            application/json:
              schema:
                type: object
                properties:
                  currentRate:
                    type: object
                    description: Real-time foreign exchange rates.
                    properties: {}
                  historicalVolatility:
                    type: object
                    properties: {}
                required:
                  - baseCurrency
                  - currentRate
                  - targetCurrency
              example:
                baseCurrency: USD
                targetCurrency: EUR
                currentRate:
                  bid: 0.9025
                  ask: 0.9035
                  mid: 0.903
                  timestamp: '2024-07-22T13:30:00Z'
                predictiveRates:
                  - date: '2024-07-29'
                    predictedMidRate: 0.905
                    confidenceIntervalLower: 0.901
                    confidenceIntervalUpper: 0.909
                    aiModelConfidence: 0.88
                  - date: '2024-08-05'
                    predictedMidRate: 0.9065
                    confidenceIntervalLower: 0.902
                    confidenceIntervalUpper: 0.911
                    aiModelConfidence: 0.85
                historicalVolatility:
                  past7Days: 0.005
                  past30Days: 0.012
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - payments
        - fx
        - rates
      description: >-
        Retrieves current and AI-predicted future foreign exchange rates for a
        specified currency pair, including bid/ask spreads and historical
        volatility data for informed decisions.
  /payments/fx/convert:
    post:
      summary: Initiate a Currency Conversion
      responses:
        '200':
          description: Currency conversion completed successfully.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - conversionId
                  - conversionTimestamp
                  - fxRateApplied
                  - sourceAmount
                  - sourceCurrency
                  - status
                  - targetAmount
              example:
                conversionId: fx_conv_abc123
                status: completed
                sourceAmount: 1000
                sourceCurrency: USD
                targetAmount: 920.5
                fxRateApplied: 0.9205
                feesApplied: 5
                conversionTimestamp: '2024-07-22T13:45:00Z'
                transactionId: txn_fx_conv_abc123-20240722
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - payments
        - fx
        - convert
      description: >-
        Executes an instant currency conversion between two currencies, either
        from a balance or into a specified account.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties: {}
              required:
                - sourceAccountId
                - sourceAmount
                - sourceCurrency
                - targetCurrency
            example:
              sourceAccountId: acc_chase_checking_4567
              targetAccountId: acc_euro_savings_9876
              sourceAmount: 1000
              sourceCurrency: USD
              targetCurrency: EUR
              fxRateLock: true
  /sustainability/carbon-footprint:
    get:
      summary: Retrieve Personal Carbon Footprint Report
      responses:
        '200':
          description: A comprehensive personal carbon footprint report.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - aiInsights
                  - breakdownByCategory
                  - period
                  - reportId
                  - totalCarbonFootprintKgCO2e
              example:
                reportId: cf_report_2024-Q2
                period: April - June 2024
                totalCarbonFootprintKgCO2e: 1250.7
                breakdownByCategory:
                  - category: Transportation
                    carbonFootprintKgCO2e: 450.2
                    percentage: 36
                  - category: Food
                    carbonFootprintKgCO2e: 300.5
                    percentage: 24
                  - category: Housing
                    carbonFootprintKgCO2e: 250
                    percentage: 20
                aiInsights:
                  - id: insight-transport-carbon-001
                    title: Reduce Commute Carbon
                    description: >-
                      Your daily commute contributes significantly to your
                      carbon footprint. Consider carpooling or public transport.
                    category: sustainability
                    severity: medium
                    actionableRecommendation: Explore green commuting options.
                    timestamp: '2024-07-22T16:00:00Z'
                offsetRecommendations:
                  - project: Amazon Reforestation Project
                    costPerTonUSD: 25
                    offsetAmountKgCO2e: 1250.7
                    totalCostUSD: 31.27
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - sustainability
        - carbon-footprint
      description: >-
        Generates a detailed report of the user's estimated carbon footprint
        based on transaction data, lifestyle choices, and AI-driven impact
        assessments, offering insights and reduction strategies.
  /sustainability/investments/impact:
    get:
      summary: Analyze ESG Impact of Investment Portfolio
      responses:
        '200':
          description: An analysis of the ESG impact of the investment portfolio.
          content:
            application/json:
              schema:
                type: object
                properties:
                  breakdownByESGFactors:
                    type: object
                    description: >-
                      Breakdown of the portfolio's ESG score by individual
                      factors.
                    properties: {}
                required:
                  - aiRecommendations
                  - benchmarkESGScore
                  - breakdownByESGFactors
                  - lowestESGHoldings
                  - overallESGScore
                  - portfolioId
                  - topESGHoldings
              example:
                portfolioId: portfolio_equity_growth
                overallESGScore: 7.8
                benchmarkESGScore: 6.5
                breakdownByESGFactors:
                  environmentalScore: 7
                  socialScore: 8.5
                  governanceScore: 8
                topESGHoldings:
                  - assetSymbol: TSLA
                    assetName: Tesla Inc.
                    esgScore: 9.1
                  - assetSymbol: MSFT
                    assetName: Microsoft Corp.
                    esgScore: 8.9
                lowestESGHoldings:
                  - assetSymbol: XOM
                    assetName: ExxonMobil Corp.
                    esgScore: 4.5
                  - assetSymbol: BAC
                    assetName: Bank of America
                    esgScore: 6
                aiRecommendations:
                  - id: insight-esg-diversify-002
                    title: Enhance ESG Diversification
                    description: >-
                      Your portfolio has a strong ESG profile, but could be
                      further improved by reducing exposure to companies with
                      lower ESG scores in the energy sector.
                    category: sustainability
                    severity: low
                    actionableRecommendation: Explore alternative energy ETFs or green bonds.
                    timestamp: '2024-07-22T16:15:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - sustainability
        - investments
        - impact
      description: >-
        Provides an AI-driven analysis of the Environmental, Social, and
        Governance (ESG) impact of the user's entire investment portfolio,
        benchmarking against industry standards and suggesting more sustainable
        alternatives.
  /sustainability/carbon-offsets:
    post:
      summary: Purchase Carbon Offsets
      responses:
        '200':
          description: Carbon offsets purchased successfully.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - amountOffsetKgCO2e
                  - purchaseDate
                  - purchaseId
                  - totalCostUSD
              example:
                purchaseId: co_purchase_xyz123
                amountOffsetKgCO2e: 500
                totalCostUSD: 12.5
                projectSupported: Verified Carbon Standard Project X
                transactionId: txn_offset_12345
                purchaseDate: '2024-07-22T14:00:00Z'
                certificateUrl: https://demobank.com/certificates/co_purchase_xyz123.pdf
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - sustainability
        - carbon-offsets
      description: >-
        Allows users to purchase carbon offsets to neutralize their estimated
        carbon footprint, supporting environmental initiatives.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties: {}
              required:
                - amountKgCO2e
                - offsetProject
                - paymentAccountId
            example:
              amountKgCO2e: 500
              paymentAccountId: acc_chase_checking_4567
              offsetProject: Verified Carbon Standard Project X
  /lending/applications/{applicationId}:
    get:
      summary: Get Loan Application Status & Details
      responses:
        '200':
          description: Loan application approved with offer details
          content:
            application/json:
              schema:
                type: object
                properties:
                  aiUnderwritingResult:
                    type: object
                    properties: {}
                    required:
                      - aiConfidence
                      - decision
                      - reason
                  offerDetails:
                    type: object
                    properties: {}
                    required:
                      - amount
                      - expirationDate
                      - interestRate
                      - isPreApproved
                      - offerId
                      - offerType
                required:
                  - applicationDate
                  - applicationId
                  - loanAmountRequested
                  - loanPurpose
                  - nextSteps
                  - status
              example:
                applicationId: loan_app_creditflow-123
                status: approved
                loanAmountRequested: 10000
                loanPurpose: home_improvement
                applicationDate: '2024-07-22T15:00:00Z'
                aiUnderwritingResult:
                  decision: approved
                  reason: Strong credit score and consistent income history.
                  recommendedInterestRate: 6.5
                  maxApprovedAmount: 12000
                  aiConfidence: 0.95
                offerDetails:
                  offerId: offer_pers_loan_001
                  offerType: personal_loan
                  amount: 10000
                  interestRate: 6.5
                  repaymentTermMonths: 36
                  monthlyPayment: 306.45
                  originationFee: 150
                  totalRepayable: 11032.2
                  expirationDate: '2024-08-31'
                  isPreApproved: false
                  aiPersonalizationScore: 0.9
                nextSteps: >-
                  Review your offer details and accept the loan to proceed with
                  funding.
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - lending
        - applications
        - '{applicationId}'
      description: >-
        Retrieves the current status and detailed information for a submitted
        loan application, including AI underwriting outcomes, approved terms,
        and next steps.
    parameters:
      - name: applicationId
        in: path
        required: true
        description: Unique identifier for the loan application.
        schema:
          type: string
        example: loan_app_creditflow-123
  /lending/offers/pre-approved:
    get:
      summary: Get Pre-Approved Loan Offers
      parameters:
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
      responses:
        '200':
          description: A paginated list of pre-approved loan offers.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 2
                data:
                  - offerId: offer_pre_app_001
                    offerType: personal_loan
                    amount: 15000
                    interestRate: 4.5
                    repaymentTermMonths: 60
                    monthlyPayment: 280
                    originationFee: 0
                    totalRepayable: 16800
                    expirationDate: '2024-08-31'
                    isPreApproved: true
                    aiPersonalizationScore: 0.95
                  - offerId: offer_pre_app_002
                    offerType: credit_line
                    amount: 5000
                    interestRate: 8.99
                    originationFee: 50
                    expirationDate: '2024-09-15'
                    isPreApproved: true
                    aiPersonalizationScore: 0.88
                nextOffset: 2
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - lending
        - offers
        - pre-approved
      description: >-
        Retrieves a list of personalized, pre-approved loan offers generated by
        the AI based on the user's financial profile and credit health.
  /developers/webhooks/{subscriptionId}:
    put:
      summary: Update Webhook Subscription
      responses:
        '200':
          description: Example of an updated webhook subscription
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - callbackUrl
                  - createdAt
                  - events
                  - id
                  - status
              example:
                id: whsub_devtool_finance_events
                callbackUrl: https://my-new-app.com/webhooks/demobank-events
                events:
                  - transaction.created
                  - user.login_failed
                status: active
                lastTriggered: '2024-07-22T17:00:00Z'
                failureCount: 0
        '400':
          description: Common bad request error
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Invalid or missing authentication credentials
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: Insufficient permissions
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: Resource not found error
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - developers
        - webhooks
        - '{subscriptionId}'
      description: >-
        Modifies an existing webhook subscription, allowing changes to the
        callback URL, subscribed events, or activation status.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties: {}
            example:
              status: paused
    parameters:
      - name: subscriptionId
        in: path
        required: true
        description: Unique identifier for the webhook subscription.
        schema:
          type: string
        example: whsub_devtool_finance_events
    delete:
      summary: Delete Webhook Subscription
      responses:
        '204':
          description: Webhook subscription deleted successfully.
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - developers
        - webhooks
        - '{subscriptionId}'
      description: >-
        Deletes an existing webhook subscription, stopping all future event
        notifications to the specified callback URL.
  /developers/webhooks:
    get:
      summary: List Webhook Subscriptions
      parameters:
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
      responses:
        '200':
          description: A paginated list of active webhook subscriptions.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 2
                data:
                  - id: whsub_devtool_finance_events
                    callbackUrl: https://my-app.com/webhooks/demobank-events
                    events:
                      - transaction.created
                      - account.updated
                      - user.login_failed
                    status: active
                    lastTriggered: '2024-07-22T17:00:00Z'
                    failureCount: 0
                  - id: whsub_alert_system
                    callbackUrl: https://alert-system.com/demobank-alerts
                    events:
                      - security.critical_alert
                    status: paused
                    lastTriggered: '2024-07-20T08:00:00Z'
                    failureCount: 2
                nextOffset: 2
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - developers
        - webhooks
      description: >-
        Retrieves a list of all active webhook subscriptions for the
        authenticated developer application, detailing endpoint URLs, subscribed
        events, and current status.
  /developers/api-keys/{keyId}:
    delete:
      summary: Revoke a Developer API Key
      responses:
        '204':
          description: API key revoked successfully.
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - developers
        - api-keys
        - '{keyId}'
      description: Revokes an existing API key, disabling its access immediately.
    parameters:
      - name: keyId
        in: path
        required: true
        description: Unique identifier for the API key.
        schema:
          type: string
        example: api_key_dev_app_01
  /developers/api-keys:
    get:
      summary: List Developer API Keys
      parameters:
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
      responses:
        '200':
          description: A paginated list of API keys.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 2
                data:
                  - id: api_key_dev_app_01
                    prefix: db_pk_test_
                    status: active
                    createdAt: '2024-01-01T10:00:00Z'
                    expiresAt: '2025-01-01T10:00:00Z'
                    scopes:
                      - read:accounts
                      - write:payments
                    lastUsed: '2024-07-22T17:15:00Z'
                  - id: api_key_webhook_validator
                    prefix: db_sk_prod_
                    status: active
                    createdAt: '2023-05-01T11:00:00Z'
                    scopes:
                      - webhook:events
                    lastUsed: '2024-07-22T17:30:00Z'
                nextOffset: 2
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - developers
        - api-keys
      description: >-
        Retrieves a list of API keys issued to the authenticated developer
        application.
    post:
      summary: Create a New Developer API Key
      responses:
        '201':
          description: API key created successfully.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - createdAt
                  - id
                  - prefix
                  - scopes
                  - status
              example:
                id: api_key_analytics_service
                prefix: db_pk_test_
                status: active
                createdAt: '2024-07-22T18:00:00Z'
                expiresAt: '2024-10-20T18:00:00Z'
                scopes:
                  - read:accounts
                  - read:transactions
        '400':
          description: Invalid request payload or parameters.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - developers
        - api-keys
      description: >-
        Generates a new API key for the developer application with specified
        scopes and an optional expiration.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties: {}
              required:
                - name
                - scopes
            example:
              name: My Analytics Service Key
              scopes:
                - read:accounts
                - read:transactions
              expiresInDays: 90
  /identity/kyc/status:
    get:
      summary: Get Current KYC Verification Status
      responses:
        '200':
          description: 'KYC status: verified (Gold tier)'
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - lastSubmissionDate
                  - overallStatus
                  - requiredActions
                  - userId
              example:
                userId: user-quantum-visionary-001
                overallStatus: verified
                lastSubmissionDate: '2024-07-21T18:00:00Z'
                requiredActions: []
                verifiedTier: gold
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - identity
        - kyc
        - status
      description: >-
        Retrieves the current status of the user's Know Your Customer (KYC)
        verification process.
  /goals/{goalId}:
    get:
      summary: Get Detailed Financial Goal
      responses:
        '200':
          description: Detailed financial goal information.
          content:
            application/json:
              schema:
                type: object
                properties:
                  aiStrategicPlan:
                    type: object
                    description: AI-generated strategic plan for achieving the goal.
                    properties: {}
                required:
                  - currentAmount
                  - id
                  - lastUpdated
                  - name
                  - progressPercentage
                  - status
                  - targetAmount
                  - targetDate
                  - type
              example:
                id: goal_retirement_2050
                name: Retirement Fund by 2050
                type: retirement
                targetAmount: 1000000
                currentAmount: 350000
                targetDate: '2050-12-31'
                progressPercentage: 35
                status: on_track
                contributingAccounts:
                  - acc_chase_invest_ira_001
                  - acc_fidelity_401k_xyz
                lastUpdated: '2024-07-22T19:00:00Z'
                riskTolerance: medium
                aiStrategicPlan:
                  planId: plan_retirement_2050
                  summary: >-
                    The AI projects you are on track to reach your retirement
                    goal, but recommends increasing annual contributions by 5%
                    to account for potential market volatility.
                  steps:
                    - title: Increase 401k Contributions
                      description: >-
                        Adjust your 401k contributions to 12% of your salary by
                        year-end.
                      status: in_progress
                    - title: Review Portfolio Asset Allocation
                      description: >-
                        Ensure your investment portfolio remains diversified
                        according to your medium risk tolerance.
                      status: pending
                aiInsights:
                  - id: insight-retirement-track-001
                    title: Retirement Goal On Track
                    description: >-
                      Your retirement savings are progressing as expected, but a
                      slight increase in contributions would provide a larger
                      buffer against market fluctuations.
                    category: financial_goals
                    severity: low
                    actionableRecommendation: Adjust savings plan via the 'Quantum Planner'.
                    timestamp: '2024-07-22T19:35:00Z'
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - goals
        - '{goalId}'
      description: >-
        Retrieves detailed information for a specific financial goal, including
        current progress, AI strategic plan, and related insights.
    parameters:
      - name: goalId
        in: path
        required: true
        description: Unique identifier for the financial goal.
        schema:
          type: string
        example: goal_retirement_2050
    put:
      summary: Update an Existing Financial Goal
      responses:
        '200':
          description: Example of an updated financial goal
          content:
            application/json:
              schema:
                type: object
                properties:
                  aiStrategicPlan:
                    type: object
                    description: AI-generated strategic plan for achieving the goal.
                    properties: {}
                required:
                  - currentAmount
                  - id
                  - lastUpdated
                  - name
                  - progressPercentage
                  - status
                  - targetAmount
                  - targetDate
                  - type
              example:
                id: goal_retirement_2050
                name: Retirement Fund by 2050
                type: retirement
                targetAmount: 1200000
                currentAmount: 350000
                targetDate: '2050-12-31'
                progressPercentage: 29.17
                status: behind_schedule
                contributingAccounts:
                  - acc_chase_invest_ira_001
                  - acc_fidelity_401k_xyz
                lastUpdated: '2024-07-22T19:45:00Z'
                riskTolerance: medium
                aiStrategicPlan:
                  planId: plan_retirement_2050_recalc
                  summary: >-
                    Due to the increased target, the AI recommends a more
                    aggressive savings rate or adjusting investment strategy.
                  steps:
                    - title: Increase 401k Contributions
                      description: >-
                        Adjust your 401k contributions to 15% of your salary
                        immediately.
                      status: pending
                    - title: Evaluate Higher-Growth Investments
                      description: >-
                        Review opportunities for higher-growth investments if
                        your risk tolerance allows.
                      status: pending
        '400':
          description: Common bad request error
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: INVALID_INPUT
                message: >-
                  The provided input data is invalid. Please check the request
                  body.
                timestamp: '2024-07-22T08:00:00Z'
        '401':
          description: Invalid or missing authentication credentials
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: Insufficient permissions
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: Resource not found error
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - goals
        - '{goalId}'
      description: >-
        Updates the parameters of an existing financial goal, such as target
        amount, date, or contributing accounts. This may trigger an AI plan
        recalculation.
      requestBody:
        content:
          application/json:
            schema:
              description: Fields that can be updated for an existing financial goal.
              type: object
              properties: {}
            example:
              targetAmount: 1200000
              generateAIPlan: true
    delete:
      summary: Delete a Financial Goal
      responses:
        '204':
          description: Financial goal deleted successfully.
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >-
            The authenticated user does not have the necessary permissions to
            access this resource or perform this action.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: PERMISSION_DENIED
                message: >-
                  You do not have the required permissions to perform this
                  action.
                timestamp: '2024-07-22T08:00:00Z'
        '404':
          description: The requested resource was not found.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: NOT_FOUND
                message: The requested resource could not be found.
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - goals
        - '{goalId}'
      description: Deletes a specific financial goal from the user's profile.
  /goals:
    get:
      summary: List All User Financial Goals
      parameters:
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
      responses:
        '200':
          description: A paginated list of financial goals.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 2
                data:
                  - id: goal_retirement_2050
                    name: Retirement Fund by 2050
                    type: retirement
                    targetAmount: 1000000
                    currentAmount: 350000
                    targetDate: '2050-12-31'
                    progressPercentage: 35
                    status: on_track
                    contributingAccounts:
                      - acc_chase_invest_ira_001
                      - acc_fidelity_401k_xyz
                    lastUpdated: '2024-07-22T19:00:00Z'
                    riskTolerance: medium
                  - id: goal_home_purchase_2030
                    name: Down Payment for New Home
                    type: home_purchase
                    targetAmount: 100000
                    currentAmount: 25000
                    targetDate: '2030-06-30'
                    progressPercentage: 25
                    status: behind_schedule
                    contributingAccounts:
                      - acc_savings_001
                    lastUpdated: '2024-07-22T19:00:00Z'
                    riskTolerance: low
                nextOffset: 2
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - goals
      description: >-
        Retrieves a list of all financial goals defined by the user, including
        their progress and associated AI plans.
  /notifications/me:
    get:
      summary: List User Notifications
      parameters:
        - name: limit
          in: query
          description: Maximum number of items to return in a single page.
          schema:
            type: integer
          example: '20'
        - name: offset
          in: query
          description: Number of items to skip before starting to collect the result set.
          schema:
            type: integer
          example: '0'
        - name: status
          in: query
          description: Filter notifications by their read status.
          schema:
            type: string
          example: unread
        - name: severity
          in: query
          description: Filter notifications by AI-assigned severity level.
          schema:
            type: string
          example: high
      responses:
        '200':
          description: A paginated list of user notifications.
          content:
            application/json:
              schema:
                allOf:
                  - type: object
                    properties: {}
                    required:
                      - limit
                      - offset
                      - total
                  - type: object
                    properties: {}
              example:
                limit: 2
                offset: 0
                total: 3
                data:
                  - id: notif_security_alert_001
                    type: security
                    title: Suspicious Login Detected
                    message: >-
                      A login attempt was made from an unrecognized
                      device/location. Please review your recent activity.
                    severity: critical
                    timestamp: '2024-07-22T20:00:00Z'
                    read: false
                    actionableLink: /users/me/security-log
                  - id: notif_budget_alert_002
                    type: financial_insight
                    title: Dining Budget Near Limit
                    message: >-
                      You've spent 85% of your dining budget for the month.
                      Consider adjusting your spending.
                    severity: medium
                    timestamp: '2024-07-22T15:30:00Z'
                    read: false
                    actionableLink: /budgets/monthly_aug
                    aiInsightId: insight-dining-overspend-002
                nextOffset: 2
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
      tags:
        - notifications
        - me
      description: >-
        Retrieves a paginated list of personalized notifications and proactive
        AI alerts for the authenticated user, allowing filtering by status and
        severity.
  /notifications/{notificationId}/mark-read:
    post:
      summary: Mark a Notification as Read
      responses:
        '200':
          description: Notification marked as read successfully.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - id
                  - message
                  - read
                  - severity
                  - timestamp
                  - title
                  - type
              example:
                id: notif_budget_alert_002
                type: financial_insight
                title: Dining Budget Near Limit
                message: >-
                  You've spent 85% of your dining budget for the month. Consider
                  adjusting your spending.
                severity: medium
                timestamp: '2024-07-22T15:30:00Z'
                read: true
                actionableLink: /budgets/monthly_aug
                aiInsightId: insight-dining-overspend-002
        '401':
          description: Authentication failed or token is missing/invalid.
          content:
            application/json:
              schema:
                type: object
                properties: {}
                required:
                  - code
                  - message
                  - timestamp
              example:
                code: UNAUTHENTICATED
                message: 'Authentication failed: Invalid or missing access token.'
                timestamp: '2024-07-22T08:00:00Z'
        '403':
          description: >