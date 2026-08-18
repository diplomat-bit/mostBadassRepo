// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/types/auth/QuantumIdentityTypes.ts
================================================================================

export enum QuantumSecurityRole {
  GUEST = 'GUEST',
  STANDARD_USER = 'STANDARD_USER',
  PREMIUM_SUBSCRIBER = 'PREMIUM_SUBSCRIBER',
  CORPORATE_ADMIN = 'CORPORATE_ADMIN',
  FINANCIAL_CONTROLLER = 'FINANCIAL_CONTROLLER',
  DEVELOPER_OPERATOR = 'DEVELOPER_OPERATOR',
  SECURITY_AUDITOR = 'SECURITY_AUDITOR',
  SYSTEM_ARCHITECT = 'SYSTEM_ARCHITECT',
  AI_ETHICS_OVERSEER = 'AI_ETHICS_OVERSEER',
  QUANTUM_ROOT_ADMIN = 'QUANTUM_ROOT_ADMIN',
  AUTONOMOUS_AGENT = 'AUTONOMOUS_AGENT',
}

export enum AuthenticationStatus {
  UNAUTHENTICATED = 'UNAUTHENTICATED',
  AUTHENTICATED = 'AUTHENTICATED',
  MFA_REQUIRED = 'MFA_REQUIRED',
  BIOMETRIC_CHALLENGE_PENDING = 'BIOMETRIC_CHALLENGE_PENDING',
  QUANTUM_KEY_EXCHANGE_PENDING = 'QUANTUM_KEY_EXCHANGE_PENDING',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  PASSWORD_EXPIRED = 'PASSWORD_EXPIRED',
  IDENTITY_VERIFICATION_REQUIRED = 'IDENTITY_VERIFICATION_REQUIRED',
  SUSPICIOUS_ACTIVITY_DETECTED = 'SUSPICIOUS_ACTIVITY_DETECTED',
}

export enum BiometricModality {
  FINGERPRINT = 'FINGERPRINT',
  FACIAL_RECOGNITION = 'FACIAL_RECOGNITION',
  RETINA_SCAN = 'RETINA_SCAN',
  VOICE_PRINT = 'VOICE_PRINT',
  BEHAVIORAL_KEYSTROKE = 'BEHAVIORAL_KEYSTROKE',
  HEARTBEAT_RHYTHM = 'HEARTBEAT_RHYTHM',
  NONE = 'NONE',
}

export enum AccountStanding {
  GOOD = 'GOOD',
  PROBATION = 'PROBATION',
  RESTRICTED = 'RESTRICTED',
  SUSPENDED = 'SUSPENDED',
  BANNED = 'BANNED',
  ARCHIVED = 'ARCHIVED',
}

export enum IdentityVerificationLevel {
  NONE = 'NONE',
  EMAIL_VERIFIED = 'EMAIL_VERIFIED',
  PHONE_VERIFIED = 'PHONE_VERIFIED',
  GOVERNMENT_ID_VERIFIED = 'GOVERNMENT_ID_VERIFIED',
  BIOMETRICALLY_CONFIRMED = 'BIOMETRICALLY_CONFIRMED',
  QUANTUM_CRYPTOGRAPHIC_PROOF = 'QUANTUM_CRYPTOGRAPHIC_PROOF',
}

export interface GeoLocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude?: number;
  altitudeAccuracy?: number;
  heading?: number;
  speed?: number;
}

export interface DeviceFingerprint {
  deviceId: string;
  deviceType: 'MOBILE' | 'DESKTOP' | 'TABLET' | 'IOT' | 'QUANTUM_TERMINAL';
  os: string;
  browser: string;
  screenResolution: string;
  userAgent: string;
  cpuConcurrency?: number;
  gpuRenderer?: string;
  trustScore: number;
}

export interface QuantumSessionContext {
  sessionId: string;
  ipAddress: string;
  geoData?: {
    country: string;
    city: string;
    coordinates?: GeoLocationCoordinates;
    timezone: string;
  };
  device: DeviceFingerprint;
  createdAt: string;
  lastActiveAt: string;
  expiresAt: string;
  isRevoked: boolean;
  anomalyScore: number; // 0.0 to 1.0, AI-calculated risk
}

export interface UserAIPreferences {
  assistantPersonality: 'PROFESSIONAL' | 'FRIENDLY' | 'TECHNICAL' | 'SOCRATIC' | 'CONCISE';
  predictiveAnalyticsEnabled: boolean;
  autonomousDecisionMakingLevel: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH';
  contentSummarization: boolean;
  voiceInteractionEnabled: boolean;
  preferredGenerativeModel: 'GEMINI_PRO' | 'GPT_4' | 'CLAUDE_OPUS' | 'INTERNAL_QUANTUM_MODEL';
  financialRiskTolerance: 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE' | 'SPECULATIVE';
  learningStyle: 'VISUAL' | 'TEXTUAL' | 'INTERACTIVE' | 'AUDITORY';
}

export interface UserSecurityProfile {
  mfaEnabled: boolean;
  mfaMethod: 'TOTP' | 'SMS' | 'EMAIL' | 'HARDWARE_KEY' | 'BIOMETRIC';
  biometricModalitiesRegistered: BiometricModality[];
  lastPasswordChange: string;
  passwordHistoryCount: number;
  failedLoginAttempts: number;
  securityQuestionsSet: boolean;
  quantumEncryptionEnabled: boolean;
  antiPhishingPhrase?: string;
  authorizedDevicesCount: number;
}

export interface UserFinancialContext {
  primaryCurrency: string;
  linkedBankAccountsCount: number;
  creditScore?: number;
  kycStatus: IdentityVerificationLevel;
  subscriptionPlan: 'FREE' | 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE';
  billingCycle: 'MONTHLY' | 'ANNUAL';
  taxResidency: string;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  preferredName?: string;
  email: string;
  phoneNumber?: string;
  avatarUrl?: string;
  coverPhotoUrl?: string;
  jobTitle?: string;
  department?: string;
  organizationId?: string;
  bio?: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    portfolio?: string;
  };
  dateOfBirth?: string;
  locale: string;
  theme: 'LIGHT' | 'DARK' | 'SYSTEM' | 'HOLOGRAPHIC';
}

export interface QuantumUser {
  id: string;
  username: string;
  email: string;
  roles: QuantumSecurityRole[];
  profile: UserProfile;
  preferences: UserAIPreferences;
  security: UserSecurityProfile;
  financial: UserFinancialContext;
  accountStanding: AccountStanding;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string;
  metadata: Record<string, any>;
}

export interface AuthTokenPayload {
  accessToken: string;
  refreshToken: string;
  idToken?: string;
  tokenType: 'Bearer';
  expiresIn: number; // seconds
  scope: string[];
}

export interface MFAChallenge {
  transactionId: string;
  method: 'SMS' | 'EMAIL' | 'TOTP' | 'BIOMETRIC' | 'QUANTUM_KEY';
  target?: string; // Masked email or phone
  expiry: string;
}

export interface QuantumAuthResponse {
  status: AuthenticationStatus;
  user?: QuantumUser;
  tokens?: AuthTokenPayload;
  session?: QuantumSessionContext;
  mfaChallenge?: MFAChallenge;
  message?: string;
  requiresPasswordChange?: boolean;
  riskAssessment?: {
    score: number;
    factors: string[];
    action: 'ALLOW' | 'CHALLENGE' | 'DENY';
  };
}

export interface LoginRequest {
  email?: string;
  username?: string;
  password?: string;
  mfaCode?: string;
  biometricSignature?: string;
  deviceFingerprint?: DeviceFingerprint;
}

export interface RegistrationRequest {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  inviteCode?: string;
  organizationId?: string;
  agreedToTerms: boolean;
  marketingConsent: boolean;
}

export interface PasswordResetRequest {
  email: string;
  redirectUrl?: string;
}

export interface PasswordConfirmRequest {
  token: string;
  newPassword: string;
}

export type PermissionString = 
  | 'user:read' 
  | 'user:write' 
  | 'user:delete' 
  | 'admin:access' 
  | 'finance:view_balance' 
  | 'finance:transfer' 
  | 'ai:invoke_model' 
  | 'system:config'
  | 'audit:logs'
  | 'developer:api_keys';

export interface RBACPolicy {
  role: QuantumSecurityRole;
  permissions: PermissionString[];
  inheritsFrom?: QuantumSecurityRole[];
}

export interface IdentityVerificationRequest {
  documentType: 'PASSPORT' | 'DRIVERS_LICENSE' | 'ID_CARD';
  documentFrontImage: string; // Base64 or URL
  documentBackImage?: string; // Base64 or URL
  selfieImage: string; // Base64 or URL
  livenessCheckData?: any;
}

export interface BiometricRegistrationRequest {
  modality: BiometricModality;
  publicKey: string;
  signature: string;
  deviceData: DeviceFingerprint;
}

export interface SSOProfile {
  provider: 'GOOGLE' | 'GITHUB' | 'MICROSOFT' | 'LINKEDIN' | 'APPLE';
  providerId: string;
  email: string;
  displayName: string;
  photoUrl?: string;
}

export interface SecurityEventLog {
  id: string;
  timestamp: string;
  eventType: 'LOGIN' | 'LOGOUT' | 'FAILED_LOGIN' | 'PASSWORD_CHANGE' | 'MFA_UPDATE' | 'API_KEY_CREATED';
  userId: string;
  ipAddress: string;
  device: string;
  outcome: 'SUCCESS' | 'FAILURE';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  metadata?: Record<string, any>;
}

export const DEFAULT_USER_PREFERENCES: UserAIPreferences = {
  assistantPersonality: 'PROFESSIONAL',
  predictiveAnalyticsEnabled: true,
  autonomousDecisionMakingLevel: 'LOW',
  contentSummarization: true,
  voiceInteractionEnabled: false,
  preferredGenerativeModel: 'GEMINI_PRO',
  financialRiskTolerance: 'MODERATE',
  learningStyle: 'VISUAL',
};

export const DEFAULT_SECURITY_PROFILE: UserSecurityProfile = {
  mfaEnabled: false,
  mfaMethod: 'EMAIL',
  biometricModalitiesRegistered: [],
  lastPasswordChange: new Date().toISOString(),
  passwordHistoryCount: 0,
  failedLoginAttempts: 0,
  securityQuestionsSet: false,
  quantumEncryptionEnabled: false,
  authorizedDevicesCount: 0,
};