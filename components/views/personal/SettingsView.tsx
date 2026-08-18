// REPOSITORY SOURCE: diplomat-bit/almost | PATH: diplomat-bit-almost-93a5466/components/views/personal/SettingsView.tsx
================================================================================

// components/views/personal/SettingsView.tsx
import React from 'react';
import Card from '../../Card';

const SettingsView: React.FC = () => {
    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white tracking-wider">Settings</h2>
            
            <Card title="Profile">
                <div className="space-y-4">
                    <div><label className="block text-sm font-medium text-gray-400">Name</label><p className="text-white">The Visionary</p></div>
                    <div><label className="block text-sm font-medium text-gray-400">Email</label><p className="text-white">visionary@demobank.com</p></div>
                </div>
            </Card>
            
            <Card title="Notification Preferences">
                 <ul className="divide-y divide-gray-700/60">
                    <li className="py-3 flex justify-between items-center">
                        <div><h4 className="font-semibold text-white">Large Transaction Alerts</h4><p className="text-sm text-gray-400">Notify me of any transaction over $500.</p></div>
                        <input type="checkbox" className="toggle toggle-cyan" defaultChecked />
                    </li>
                     <li className="py-3 flex justify-between items-center">
                        <div><h4 className="font-semibold text-white">Budget Warnings</h4><p className="text-sm text-gray-400">Let me know when I'm approaching a budget limit.</p></div>
                        <input type="checkbox" className="toggle toggle-cyan" defaultChecked />
                    </li>
                    <li className="py-3 flex justify-between items-center">
                        <div><h4 className="font-semibold text-white">AI Insight Notifications</h4><p className="text-sm text-gray-400">Alert me when the AI has a new high-urgency insight.</p></div>
                        <input type="checkbox" className="toggle toggle-cyan" defaultChecked />
                    </li>
                    <li className="py-3 flex justify-between items-center">
                        <div><h4 className="font-semibold text-white">Promotional Emails</h4><p className="text-sm text-gray-400">Receive marketing and product update emails.</p></div>
                        <input type="checkbox" className="toggle toggle-cyan" />
                    </li>
                </ul>
            </Card>
            
            <Card title="Appearance">
                 <p className="text-gray-400 text-sm">Theme and background customization options are available in the <span className="font-semibold text-cyan-300">Personalization</span> view.</p>
            </Card>
        </div>
    );
};

export default SettingsView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | ORIGINAL PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/personal/SettingsView.tsx
================================================================================

```typescript
// components/views/personal/SettingsView.tsx
import React, { useState, useEffect, useReducer, useCallback, useMemo, useRef, createContext, useContext } from 'react';
import Card from '../../Card';

// SECTION: Type Definitions for a Real-World Application
// =======================================================

export type PlanTier = 'Free' | 'Premium' | 'Visionary';
export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD';
export type Language = 'en-US' | 'es-ES' | 'fr-FR' | 'de-DE' | 'ja-JP';
export type Timezone = 'UTC' | 'America/New_York' | 'Europe/London' | 'Asia/Tokyo';
export type NotificationChannel = 'email' | 'sms' | 'push';
export type DataExportFormat = 'json' | 'csv' | 'xml';
export type Theme = 'dark' | 'light' | 'system';
export type FontSize = 'small' | 'medium' | 'large';
export type ConnectedAppProvider = 'Google' | 'Slack' | 'GitHub' | 'Microsoft';

export interface UserProfile {
    name: string;
    username: string;
    email: string;
    phone: string;
    address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    avatarUrl: string;
    isEmailVerified: boolean;
}

export interface NotificationPreferences {
    largeTransaction: {
        enabled: boolean;
        threshold: number;
        channels: NotificationChannel[];
    };
    budgetWarnings: {
        enabled: boolean;
        thresholdPercent: number;
        channels: NotificationChannel[];
    };
    aiInsights: {
        enabled: boolean;
        urgency: 'high' | 'medium' | 'all';
        channels: NotificationChannel[];
    };
    promotional: {
        productUpdates: boolean;
        partnerOffers: boolean;
        newsletter: boolean;
    };
    securityAlerts: {
        newLogin: boolean;
        failedLogin: boolean;
        passwordChange: boolean;
        channels: NotificationChannel[];
    };
    doNotDisturb: {
        enabled: boolean;
        startTime: string; // HH:mm
        endTime: string; // HH:mm
    };
}

export interface SecuritySettings {
    twoFactorEnabled: boolean;
    twoFactorMethod: 'app' | 'sms' | null;
    biometricLoginEnabled: boolean;
    lastPasswordChange: string; // ISO 8601 date string
    sessionTimeout: number; // in minutes
}

export interface LoginActivity {
    id: string;
    timestamp: string;
    device: string;
    ipAddress: string;
    location: string;
    status: 'Success' | 'Failed';
    isCurrent: boolean;
}

export interface TrustedDevice {
    id: string;
    device: string;
    location: string;
    lastLogin: string;
}

export interface LinkedAccount {
    id: string;
    institution: string;
    accountName: string;
    accountNumberLast4: string;
    type: 'Checking' | 'Savings' | 'Credit Card';
    status: 'Active' | 'Error' | 'Syncing';
}

export interface SubscriptionDetails {
    plan: PlanTier;
    status: 'Active' | 'Canceled' | 'Past Due';
    renewalDate: string;
    price: number;
    currency: Currency;
}

export interface BillingHistoryItem {
    id: string;
    date: string;
    amount: number;
    description: string;
    invoiceUrl: string;
}

export interface PaymentMethod {
    id: string;
    type: 'CreditCard';
    brand: 'Visa' | 'Mastercard' | 'Amex';
    last4: string;
    expiryMonth: number;
    expiryYear: number;
    isDefault: boolean;
}

export interface ApiKey {
    id: string;
    keyPrefix: string;
    label: string;
    created: string;
    lastUsed: string | null;
    scopes: string[];
}

export interface ConnectedApp {
    id: string;
    provider: ConnectedAppProvider;
    username: string;
    connectedAt: string;
    scopes: string[];
}

export interface AccessibilitySettings {
    highContrast: boolean;
    fontSize: FontSize;
    reduceMotion: boolean;
}

export interface UserSettings {
    profile: UserProfile;
    notifications: NotificationPreferences;
    security: SecuritySettings;
    accessibility: AccessibilitySettings;
    subscription: SubscriptionDetails;
    language: Language;
    timezone: Timezone;
    currency: Currency;
}

// SECTION: Mock API and Data
// ===================================

export const mockApiCall = <T,>(data: T, delay = 1000, shouldFail = false): Promise<T> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (shouldFail) {
                reject(new Error("API Error: The operation failed. Please try again."));
            } else {
                resolve(JSON.parse(JSON.stringify(data))); // Deep copy to simulate real API
            }
        }, delay);
    });
};

const MOCK_USER_SETTINGS: UserSettings = {
    profile: {
        name: 'The Visionary',
        username: 'visionary',
        email: 'visionary@demobank.com',
        phone: '+1 (555) 123-4567',
        address: {
            street: '123 Innovation Drive',
            city: 'Futureville',
            state: 'CA',
            zipCode: '90210',
            country: 'USA'
        },
        avatarUrl: `https://i.pravatar.cc/150?u=visionary`,
        isEmailVerified: true,
    },
    notifications: {
        largeTransaction: { enabled: true, threshold: 500, channels: ['email', 'push'] },
        budgetWarnings: { enabled: true, thresholdPercent: 80, channels: ['push'] },
        aiInsights: { enabled: true, urgency: 'high', channels: ['email', 'push'] },
        promotional: { productUpdates: false, partnerOffers: false, newsletter: false },
        securityAlerts: { newLogin: true, failedLogin: true, passwordChange: true, channels: ['email', 'sms'] },
        doNotDisturb: { enabled: false, startTime: '22:00', endTime: '08:00' },
    },
    security: {
        twoFactorEnabled: true,
        twoFactorMethod: 'app',
        biometricLoginEnabled: false,
        lastPasswordChange: '2023-10-26T10:00:00Z',
        sessionTimeout: 60,
    },
    accessibility: {
        highContrast: false,
        fontSize: 'medium',
        reduceMotion: false,
    },
    subscription: {
        plan: 'Visionary',
        status: 'Active',
        renewalDate: '2024-12-31',
        price: 49.99,
        currency: 'USD',
    },
    language: 'en-US',
    timezone: 'America/New_York',
    currency: 'USD',
};

const MOCK_LOGIN_ACTIVITY: LoginActivity[] = [
    { id: 'la1', timestamp: new Date().toISOString(), device: 'Chrome on macOS', ipAddress: '192.168.1.101', location: 'New York, NY', status: 'Success', isCurrent: true },
    { id: 'la2', timestamp: new Date(Date.now() - 86400000).toISOString(), device: 'iPhone App', ipAddress: '72.229.28.185', location: 'New York, NY', status: 'Success', isCurrent: false },
    { id: 'la3', timestamp: new Date(Date.now() - 172800000).toISOString(), device: 'Chrome on Windows', ipAddress: '203.0.113.15', location: 'London, UK', status: 'Failed', isCurrent: false },
    { id: 'la4', timestamp: new Date(Date.now() - 259200000).toISOString(), device: 'Safari on iPad', ipAddress: '72.229.28.185', location: 'New York, NY', status: 'Success', isCurrent: false },
];

const MOCK_TRUSTED_DEVICES: TrustedDevice[] = [
    { id: 'td1', device: 'Chrome on macOS', location: 'New York, NY', lastLogin: new Date().toISOString() },
    { id: 'td2', device: 'iPhone App', location: 'New York, NY', lastLogin: new Date(Date.now() - 86400000).toISOString() },
];

const MOCK_LINKED_ACCOUNTS: LinkedAccount[] = [
    { id: 'acc1', institution: 'Demo Bank', accountName: 'Visionary Checking', accountNumberLast4: '1234', type: 'Checking', status: 'Active' },
    { id: 'acc2', institution: 'Demo Bank', accountName: 'Future Savings', accountNumberLast4: '5678', type: 'Savings', status: 'Active' },
    { id: 'acc3', institution: 'Global Credit Union', accountName: 'World Traveler Card', accountNumberLast4: '9012', type: 'Credit Card', status: 'Error' },
];

const MOCK_BILLING_HISTORY: BillingHistoryItem[] = [
    { id: 'bh1', date: '2023-12-31', amount: 49.99, description: 'Visionary Plan - Annual Renewal', invoiceUrl: '#' },
    { id: 'bh2', date: '2022-12-31', amount: 49.99, description: 'Visionary Plan - Annual Renewal', invoiceUrl: '#' },
];

const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
    { id: 'pm1', type: 'CreditCard', brand: 'Visa', last4: '4242', expiryMonth: 12, expiryYear: 2028, isDefault: true },
    { id: 'pm2', type: 'CreditCard', brand: 'Amex', last4: '0005', expiryMonth: 8, expiryYear: 2026, isDefault: false },
];

const MOCK_API_KEYS: ApiKey[] = [
    { id: 'apk1', keyPrefix: 'dv_sk_1a2b3c4d', label: 'My Analytics Dashboard', created: '2023-08-15T14:30:00Z', lastUsed: '2023-11-01T10:00:00Z', scopes: ['read:transactions', 'read:insights'] },
    { id: 'apk2', keyPrefix: 'dv_sk_5e6f7g8h', label: 'Budgeting App Integration', created: '2023-09-01T11:00:00Z', lastUsed: null, scopes: ['read:transactions', 'write:transactions'] },
];

const MOCK_CONNECTED_APPS: ConnectedApp[] = [
    { id: 'ca1', provider: 'Google', username: 'visionary@gmail.com', connectedAt: '2023-05-10T09:00:00Z', scopes: ['Read Google Calendar', 'Access Google Drive files'] },
];


// SECTION: UI Helper Components
// ==============================

export const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
    const sizeClasses = { sm: 'h-5 w-5', md: 'h-8 w-8', lg: 'h-12 w-12' };
    return <div className={`animate-spin rounded-full border-b-2 border-cyan-400 ${sizeClasses[size]}`}></div>;
};

export const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center" onClick={onClose}>
            <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-xl p-6 w-full max-w-lg relative" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
                </div>
                <div>{children}</div>
            </div>
        </div>
    );
};

export const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
        <input {...props} className="w-full bg-gray-800/50 border border-gray-700 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition" />
    </div>
);

export const SelectField: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string, children: React.ReactNode }> = ({ label, children, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
        <select {...props} className="w-full bg-gray-800/50 border border-gray-700 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition">
            {children}
        </select>
    </div>
);


export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger'; isLoading?: boolean }> = ({ children, variant = 'primary', isLoading = false, ...props }) => {
    const baseClasses = "px-4 py-2 rounded-md font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center justify-center disabled:cursor-not-allowed";
    const variantClasses = {
        primary: "bg-cyan-500 text-white hover:bg-cyan-600 focus:ring-cyan-500 disabled:bg-cyan-800/50 disabled:text-gray-400",
        secondary: "bg-gray-700 text-white hover:bg-gray-600 focus:ring-gray-500 disabled:bg-gray-800/50 disabled:text-gray-500",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-800/50 disabled:text-gray-400",
    };
    return (
        <button className={`${baseClasses} ${variantClasses[variant]}`} disabled={isLoading || props.disabled} {...props}>
            {isLoading ? <Spinner size="sm" /> : children}
        </button>
    );
};

export const ToggleSwitch: React.FC<{ checked: boolean, onChange: (checked: boolean) => void }> = ({ checked, onChange }) => (
    <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only peer" />
        <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-focus:ring-4 peer-focus:ring-cyan-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
    </label>
);

// SECTION: Settings Section Components
// =====================================

export const ProfileSettings: React.FC<{ profile: UserProfile; onSave: (newProfile: UserProfile) => Promise<void> }> = ({ profile, onSave }) => {
    const [formData, setFormData] = useState(profile);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({ ...prev, [parent]: { ...prev[parent as keyof typeof prev], [child]: value }}));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onloadend = () => setFormData(prev => ({ ...prev, avatarUrl: reader.result as string }));
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);
        setSuccess(false);
        try {
            await onSave(formData);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            setError(err.message || "Failed to save profile.");
        } finally {
            setIsSaving(false);
        }
    };

    const isDirty = useMemo(() => JSON.stringify(profile) !== JSON.stringify(formData), [profile, formData]);

    return (
        <Card title="Profile Information">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center space-x-4">
                    <img src={formData.avatarUrl} alt="Avatar" className="w-20 h-20 rounded-full object-cover" />
                    <div>
                        <Button type="button" variant="secondary" onClick={() => fileInputRef.current?.click()}>Change Avatar</Button>
                        <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} className="hidden" accept="image/*" />
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB.</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="Full Name" name="name" value={formData.name} onChange={handleChange} />
                    <InputField label="Username" name="username" value={formData.username} onChange={handleChange} />
                </div>
                <InputField label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} />
                {!profile.isEmailVerified && <p className="text-yellow-400 text-sm">Your email is not verified. <a href="#" className="underline">Resend verification email.</a></p>}
                <InputField label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
                <h4 className="text-lg font-semibold text-white pt-4 border-t border-gray-700/60">Mailing Address</h4>
                <InputField label="Street Address" name="address.street" value={formData.address.street} onChange={handleChange} />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InputField label="City" name="address.city" value={formData.address.city} onChange={handleChange} />
                    <InputField label="State / Province" name="address.state" value={formData.address.state} onChange={handleChange} />
                    <InputField label="ZIP / Postal Code" name="address.zipCode" value={formData.address.zipCode} onChange={handleChange} />
                </div>
                <div className="flex justify-end items-center space-x-4">
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    {success && <p className="text-green-500 text-sm">Profile saved successfully!</p>}
                    <Button type="submit" isLoading={isSaving} disabled={!isDirty || isSaving}>Save Changes</Button>
                </div>
            </form>
        </Card>
    );
};

export const SecuritySettingsSection: React.FC<{ settings: SecuritySettings; onUpdate: (newSettings: Partial<SecuritySettings>) => Promise<void> }> = ({ settings, onUpdate }) => {
    const [loginActivity, setLoginActivity] = useState<LoginActivity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [show2FAModal, setShow2FAModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const activity = await mockApiCall(MOCK_LOGIN_ACTIVITY);
            setLoginActivity(activity);
            setIsLoading(false);
        };
        fetchData();
    }, []);

    const handlePasswordChange = async (data: any) => {
        await mockApiCall({}, 1500);
        await onUpdate({ lastPasswordChange: new Date().toISOString() });
        setShowPasswordModal(false);
    };

    const handle2FASetup = async () => {
        await mockApiCall({}, 1500);
        await onUpdate({ twoFactorEnabled: !settings.twoFactorEnabled });
        setShow2FAModal(false);
    };

    const handleBiometricToggle = (enabled: boolean) => {
        onUpdate({ biometricLoginEnabled: enabled });
    };

    const formatDate = (dateString: string) => new Date(dateString).toLocaleString();

    return (
        <Card title="Security">
            <div className="space-y-6">
                <div className="py-3 flex justify-between items-center">
                    <div>
                        <h4 className="font-semibold text-white">Password</h4>
                        <p className="text-sm text-gray-400">Last changed: {formatDate(settings.lastPasswordChange)}</p>
                    </div>
                    <Button variant="secondary" onClick={() => setShowPasswordModal(true)}>Change Password</Button>
                </div>

                <div className="py-3 flex justify-between items-center border-t border-gray-700/60">
                    <div>
                        <h4 className="font-semibold text-white">Two-Factor Authentication (2FA)</h4>
                        <p className="text-sm text-gray-400">Add an extra layer of security to your account.</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${settings.twoFactorEnabled ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {settings.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                        <Button variant="secondary" onClick={() => setShow2FAModal(true)}>{settings.twoFactorEnabled ? 'Manage' : 'Enable'}</Button>
                    </div>
                </div>

                <div className="py-3 flex justify-between items-center border-t border-gray-700/60">
                    <div>
                        <h4 className="font-semibold text-white">Biometric Login</h4>
                        <p className="text-sm text-gray-400">Use Face ID or Touch ID to log in on supported devices.</p>
                    </div>
                    <ToggleSwitch checked={settings.biometricLoginEnabled} onChange={handleBiometricToggle} />
                </div>
                
                <div className="pt-6 border-t border-gray-700/60">
                    <h4 className="font-semibold text-white mb-2">Active Sessions & Login Activity</h4>
                    {isLoading ? <Spinner /> : (
                        <ul className="divide-y divide-gray-700/60 max-h-60 overflow-y-auto">
                           {loginActivity.map(activity => (
                               <li key={activity.id} className="py-3">
                                   <div className="flex justify-between items-start">
                                       <div>
                                           <p className="text-white font-medium">{activity.device} {activity.isCurrent && <span className="text-xs text-cyan-400">(This session)</span>}</p>
                                           <p className="text-sm text-gray-400">{activity.location} - {activity.ipAddress}</p>
                                       </div>
                                       <div className="text-right">
                                            <p className={`text-sm font-semibold ${activity.status === 'Success' ? 'text-green-400' : 'text-red-400'}`}>{activity.status}</p>
                                            <p className="text-xs text-gray-500">{formatDate(activity.timestamp)}</p>
                                       </div>
                                   </div>
                                    {!activity.isCurrent && activity.status === 'Success' && <Button variant="secondary" size="sm" className="mt-2 text-xs">Sign out</Button>}
                               </li>
                           ))}
                        </ul>
                    )}
                </div>
            </div>
            
            <ChangePasswordModal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} onSave={handlePasswordChange} />
            <TwoFactorAuthModal isOpen={show2FAModal} onClose={() => setShow2FAModal(false)} onSave={handle2FASetup} isEnabled={settings.twoFactorEnabled} />
        </Card>
    );
};

export const ChangePasswordModal: React.FC<{ isOpen: boolean; onClose: () => void; onSave: (data: any) => Promise<void> }> = ({ isOpen, onClose, onSave }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (newPassword !== confirmPassword) return setError("New passwords do not match.");
        if (newPassword.length < 12) return setError("Password must be at least 12 characters long.");
        
        setIsSaving(true);
        try {
            await onSave({ currentPassword, newPassword });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Change Password">
            <form onSubmit={handleSubmit} className="space-y-4">
                <InputField label="Current Password" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required />
                <InputField label="New Password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                <InputField label="Confirm New Password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit" isLoading={isSaving}>Save Changes</Button>
                </div>
            </form>
        </Modal>
    );
};

export const TwoFactorAuthModal: React.FC<{ isOpen: boolean; onClose: () => void; onSave: () => Promise<void>; isEnabled: boolean }> = ({ isOpen, onClose, onSave, isEnabled }) => {
    const [code, setCode] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const backupCodes = ["3K4F-8G7H", "9J2L-5M6N", "1P8R-3S4T"];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        await onSave();
        setIsSaving(false);
    };

    if (isEnabled) {
        return (
             <Modal isOpen={isOpen} onClose={onClose} title="Manage Two-Factor Authentication">
                <div className="space-y-4">
                    <p className="text-gray-300">2FA is currently enabled on your account.</p>
                    <div>
                        <h4 className="font-semibold text-white">Backup Codes</h4>
                        <p className="text-sm text-gray-400">Store these in a safe place. They can be used to log in if you lose access to your authenticator app.</p>
                        <div className="bg-gray-800 p-4 rounded-md mt-2 space-y-1">
                            {backupCodes.map(c => <code key={c} className="text-cyan-300 block">{c}</code>)}
                        </div>
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button variant="danger" onClick={handleSubmit} isLoading={isSaving}>Disable 2FA</Button>
                    </div>
                </div>
            </Modal>
        );
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Setup Two-Factor Authentication">
            <div className="space-y-4">
                <p className="text-gray-300">Scan the QR code with your authenticator app (e.g., Google Authenticator, Authy).</p>
                <div className="flex justify-center p-4 bg-white rounded-md">
                    <div className="w-40 h-40 bg-gray-300 flex items-center justify-center text-gray-600">QR Code Placeholder</div>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputField label="Enter the 6-digit code from your app" value={code} onChange={e => setCode(e.target.value)} maxLength={6} required />
                    <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                        <Button type="submit" isLoading={isSaving}>Verify & Enable</Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};


export const ExpandedNotificationPreferences: React.FC<{ preferences: NotificationPreferences; onSave: (newPrefs: NotificationPreferences) => Promise<void> }> = ({ preferences, onSave }) => {
    const [prefs, setPrefs] = useState(preferences);
    const [isSaving, setIsSaving] = useState(false);

    const handleToggle = (category: keyof NotificationPreferences, key: string, value: any) => {
        setPrefs(p => ({ ...p, [category]: { ...p[category], [key]: value }}));
    };

    const handleChannelToggle = (category: 'largeTransaction' | 'budgetWarnings' | 'aiInsights' | 'securityAlerts', channel: NotificationChannel) => {
        setPrefs(p => {
            const currentChannels = p[category].channels;
            const newChannels = currentChannels.includes(channel) ? currentChannels.filter(c => c !== channel) : [...currentChannels, channel];
            return { ...p, [category]: { ...p[category], channels: newChannels }};
        });
    };
    
    const handleSave = async () => {
        setIsSaving(true);
        await onSave(prefs);
        setIsSaving(false);
    };

    const isDirty = useMemo(() => JSON.stringify(preferences) !== JSON.stringify(prefs), [preferences, prefs]);

    const ChannelToggles: React.FC<{ category: 'largeTransaction' | 'budgetWarnings' | 'aiInsights' | 'securityAlerts' }> = ({ category }) => (
        <div className="flex space-x-4 pl-8 pt-2">
            {(['email', 'sms', 'push'] as NotificationChannel[]).map(channel => (
                <label key={channel} className="flex items-center space-x-2 text-sm text-gray-300">
                    <input type="checkbox" className="checkbox checkbox-xs checkbox-cyan" checked={prefs[category].channels.includes(channel)} onChange={() => handleChannelToggle(category, channel)} />
                    <span>{channel.toUpperCase()}</span>
                </label>
            ))}
        </div>
    );

    return (
        <Card title="Notification Preferences">
            <div className="space-y-4">
                <NotificationItem title="Large Transaction Alerts" description={`Notify me of any transaction over $${prefs.largeTransaction.threshold}.`}>
                    <ToggleSwitch checked={prefs.largeTransaction.enabled} onChange={checked => handleToggle('largeTransaction', 'enabled', checked)} />
                </NotificationItem>
                {prefs.largeTransaction.enabled && <ChannelToggles category="largeTransaction" />}

                <NotificationItem title="Budget Warnings" description={`Let me know when I'm approaching a budget limit.`}>
                    <ToggleSwitch checked={prefs.budgetWarnings.enabled} onChange={checked => handleToggle('budgetWarnings', 'enabled', checked)} />
                </NotificationItem>
                {prefs.budgetWarnings.enabled && <ChannelToggles category="budgetWarnings" />}
                
                <NotificationItem title="AI Insight Notifications" description="Alert me when the AI has a new high-urgency insight.">
                    <ToggleSwitch checked={prefs.aiInsights.enabled} onChange={checked => handleToggle('aiInsights', 'enabled', checked)} />
                </NotificationItem>
                {prefs.aiInsights.enabled && <ChannelToggles category="aiInsights" />}

                <NotificationItem title="Security Alerts" description="Notify me of important security events like new logins.">
                    <ToggleSwitch checked={prefs.securityAlerts.newLogin || prefs.securityAlerts.failedLogin || prefs.securityAlerts.passwordChange} onChange={checked => {
                        setPrefs(p => ({ ...p, securityAlerts: { ...p.securityAlerts, newLogin: checked, failedLogin: checked, passwordChange: checked }}));
                    }} />
                </NotificationItem>
                {prefs.securityAlerts.newLogin && <ChannelToggles category="securityAlerts" />}
                
                <h4 className="text-lg font-semibold text-white pt-4 border-t border-gray-700/60">Marketing Communications</h4>
                <NotificationItem title="Product Updates" description="Receive emails about new features and improvements.">
                     <ToggleSwitch checked={prefs.promotional.productUpdates} onChange={checked => handleToggle('promotional', 'productUpdates', checked)} />
                </NotificationItem>
                <NotificationItem title="Partner Offers" description="Get special offers from our partners.">
                     <ToggleSwitch checked={prefs.promotional.partnerOffers} onChange={checked => handleToggle('promotional', 'partnerOffers', checked)} />
                </NotificationItem>
                <NotificationItem title="Newsletter" description="Subscribe to our monthly financial insights newsletter.">
                     <ToggleSwitch checked={prefs.promotional.newsletter} onChange={checked => handleToggle('promotional', 'newsletter', checked)} />
                </NotificationItem>

                <div className="flex justify-end pt-4">
                    <Button onClick={handleSave} isLoading={isSaving} disabled={!isDirty || isSaving}>Save Preferences</Button>
                </div>
            </div>
        </Card>
    );
};

export const NotificationItem: React.FC<{ title: string; description: string; children: React.ReactNode }> = ({ title, description, children }) => (
    <div className="py-3 flex justify-between items-center">
        <div>
            <h4 className="font-semibold text-white">{title}</h4>
            <p className="text-sm text-gray-400">{description}</p>
        </div>
        {children}
    </div>
);

export const DataPrivacySettings: React.FC = () => {
    const [isExporting, setIsExporting] = useState(false);
    const [exportStatus, setExportStatus] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    
    const handleExport = async (format: DataExportFormat) => {
        setIsExporting(true);
        setExportStatus(`Exporting your data as ${format.toUpperCase()}...`);
        await mockApiCall({}, 2000);
        setExportStatus(`Your data export is ready. A download link has been sent to your email.`);
        setIsExporting(false);
        setTimeout(() => setExportStatus(''), 5000);
    };

    const handleDeleteAccount = async () => {
        await mockApiCall({}, 3000);
        alert("Account deletion process initiated. You will be logged out.");
        setShowDeleteModal(false);
    };

    return (
        <Card title="Data & Privacy">
            <div className="space-y-6">
                <div>
                    <h4 className="font-semibold text-white">Export Your Data</h4>
                    <p className="text-sm text-gray-400 mb-3">Download a copy of your account data.</p>
                    <div className="flex space-x-2">
                        <Button variant="secondary" onClick={() => handleExport('json')} disabled={isExporting}>Export as JSON</Button>
                        <Button variant="secondary" onClick={() => handleExport('csv')} disabled={isExporting}>Export as CSV</Button>
                    </div>
                    {exportStatus && <p className="text-sm text-cyan-300 mt-2">{exportStatus}</p>}
                </div>
                
                <div className="pt-4 border-t border-gray-700/60">
                    <h4 className="font-semibold text-white">Data Sharing Preferences</h4>
                    <p className="text-sm text-gray-400 mb-3">Control how your anonymized data is used to improve our services and AI models.</p>
                    <NotificationItem title="Contribute to AI Model Improvement" description="Allow your anonymized data to be used to train and improve our financial models.">
                        <ToggleSwitch checked={true} onChange={()=>{}} />
                    </NotificationItem>
                </div>

                <div className="pt-4 border-t border-gray-700/60">
                    <h4 className="font-semibold text-white">Delete Your Account</h4>
                    <p className="text-sm text-gray-400 mb-3">Permanently delete your account and all associated data. This action cannot be undone.</p>
                    <Button variant="danger" onClick={() => setShowDeleteModal(true)}>Request Account Deletion</Button>
                </div>
            </div>
            <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Account">
                <DeleteAccountConfirmation onConfirm={handleDeleteAccount} />
            </Modal>
        </Card>
    );
};

export const DeleteAccountConfirmation: React.FC<{ onConfirm: () => Promise<void> }> = ({ onConfirm }) => {
    const [confirmationText, setConfirmationText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const requiredText = "DELETE MY ACCOUNT";
    const canDelete = confirmationText === requiredText;

    const handleDelete = async () => {
        setIsDeleting(true);
        await onConfirm();
        setIsDeleting(false);
    }

    return (
        <div className="space-y-4">
            <p className="text-gray-300">This is a permanent action. All your data, including transactions, insights, and settings, will be erased forever.</p>
            <p className="text-gray-300">To proceed, please type <strong className="text-red-400">{requiredText}</strong> in the box below.</p>
            <InputField label={`Type '${requiredText}' to confirm`} value={confirmationText} onChange={(e) => setConfirmationText(e.target.value)} />
            <div className="flex justify-end pt-4">
                <Button variant="danger" onClick={handleDelete} disabled={!canDelete || isDeleting} isLoading={isDeleting}>
                    I understand, delete my account
                </Button>
            </div>
        </div>
    );
};

export const SubscriptionManagement: React.FC<{ subscription: SubscriptionDetails }> = ({ subscription }) => {
    const [billingHistory, setBillingHistory] = useState<BillingHistoryItem[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const [history, methods] = await Promise.all([
                mockApiCall(MOCK_BILLING_HISTORY),
                mockApiCall(MOCK_PAYMENT_METHODS),
            ]);
            setBillingHistory(history);
            setPaymentMethods(methods);
            setIsLoading(false);
        };
        fetchData();
    }, []);
    
    return (
        <Card title="Subscription & Billing">
            {isLoading ? <div className="flex justify-center"><Spinner/></div> : (
                <div className="space-y-8">
                    <div>
                        <h4 className="font-semibold text-white text-lg">Current Plan</h4>
                        <div className="mt-2 bg-gray-800/50 p-4 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="text-xl font-bold text-cyan-300">{subscription.plan} Plan</p>
                                <p className="text-gray-400">
                                    <span className={`capitalize ${subscription.status === 'Active' ? 'text-green-400' : 'text-red-400'}`}>{subscription.status}</span>
                                    &nbsp;&bull;&nbsp;Renews on {new Date(subscription.renewalDate).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-white">${subscription.price}<span className="text-base text-gray-400">/year</span></p>
                            </div>
                        </div>
                        <div className="mt-4 flex space-x-2">
                            <Button>Change Plan</Button>
                            <Button variant="secondary">Cancel Subscription</Button>
                        </div>
                    </div>
                    
                    <div>
                        <h4 className="font-semibold text-white text-lg">Payment Methods</h4>
                        <ul className="mt-2 space-y-2">
                           {paymentMethods.map(pm => (
                               <li key={pm.id} className="bg-gray-800/50 p-3 rounded-md flex justify-between items-center">
                                   <div className="flex items-center space-x-3">
                                        <span className="text-white font-mono">{pm.brand} **** {pm.last4}</span>
                                        <span className="text-gray-400 text-sm">Expires {pm.expiryMonth}/{pm.expiryYear}</span>
                                   </div>
                                   <div>
                                       {pm.isDefault && <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded-full">Default</span>}
                                       <button className="text-gray-400 hover:text-white ml-4">&hellip;</button>
                                   </div>
                               </li>
                           ))}
                        </ul>
                        <Button variant="secondary" className="mt-2">Add Payment Method</Button>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white text-lg">Billing History</h4>
                        <div className="overflow-x-auto mt-2">
                            <table className="min-w-full divide-y divide-gray-700/60">
                                <thead className="bg-gray-800/30">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Description</th>
                                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Invoice</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700/60">
                                    {billingHistory.map(item => (
                                        <tr key={item.id}>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{new Date(item.date).toLocaleDateString()}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{item.description}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-white text-right font-mono">${item.amount.toFixed(2)}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                                                <a href={item.invoiceUrl} className="text-cyan-400 hover:text-cyan-300">Download</a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </Card>
    );
};

export const GeneralSettings: React.FC<{ language: Language; timezone: Timezone; currency: Currency; onSave: (data: Partial<UserSettings>) => Promise<void>; }> = ({ language, timezone, currency, onSave }) => {
    const [formState, setFormState] = useState({ language, timezone, currency });
    const [isSaving, setIsSaving] = useState(false);
    const originalState = useMemo(() => ({ language, timezone, currency }), [language, timezone, currency]);
    const isDirty = useMemo(() => JSON.stringify(formState) !== JSON.stringify(originalState), [formState, originalState]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormState(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        await onSave(formState);
        setIsSaving(false);
    };

    return (
        <Card title="General">
            <div className="space-y-4">
                <SelectField label="Language" name="language" value={formState.language} onChange={handleChange}>
                    <option value="en-US">English (United States)</option>
                    <option value="es-ES">Español (España)</option>
                    <option value="fr-FR">Français (France)</option>
                </SelectField>
                <SelectField label="Timezone" name="timezone" value={formState.timezone} onChange={handleChange}>
                    <option value="America/New_York">Eastern Time (US & Canada)</option>
                    <option value="Europe/London">London</option>
                    <option value="Asia/Tokyo">Tokyo</option>
                    <option value="UTC">UTC</option>
                </SelectField>
                <SelectField label="Currency" name="currency" value={formState.currency} onChange={handleChange}>
                    <option value="USD">USD - United States Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                </SelectField>
                <div className="flex justify-end pt-4">
                    <Button onClick={handleSave} isLoading={isSaving} disabled={!isDirty}>Save Changes</Button>
                </div>
            </div>
        </Card>
    );
}

// SECTION: Main Settings View Component
// =====================================

const SettingsView: React.FC = () => {
    const [settings, setSettings] = useState<UserSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await mockApiCall(MOCK_USER_SETTINGS, 500);
                setSettings(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const updateSettings = (updates: Partial<UserSettings>) => {
        setSettings(prev => prev ? { ...prev, ...updates } : null);
    };

    const handleSaveProfile = async (newProfile: UserProfile) => {
        await mockApiCall(newProfile);
        updateSettings({ profile: newProfile });
    };
    
    const handleSaveNotifications = async (newPrefs: NotificationPreferences) => {
        await mockApiCall(newPrefs);
        updateSettings({ notifications: newPrefs });
    };

    const handleUpdateSecurity = async (securityUpdates: Partial<SecuritySettings>) => {
        const newSettings = { ...settings!.security, ...securityUpdates };
        await mockApiCall(newSettings);
        setSettings(prev => prev ? { ...prev, security: newSettings } : null);
    };
    
    const handleSaveGeneral = async (generalUpdates: Partial<UserSettings>) => {
        await mockApiCall(generalUpdates);
        updateSettings(generalUpdates);
    }

    if (isLoading) {
        return <div className="flex justify-center items-center h-64"><Spinner size="lg" /></div>;
    }
    
    if (error || !settings) {
        return (
             <div className="text-center text-red-400 bg-red-500/10 p-4 rounded-lg">
                <h3 className="font-bold">Error</h3>
                <p>{error || "Could not load settings."}</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white tracking-wider">Settings</h2>
            
            <ProfileSettings profile={settings.profile} onSave={handleSaveProfile} />
            <GeneralSettings language={settings.language} timezone={settings.timezone} currency={settings.currency} onSave={handleSaveGeneral}/>
            <SecuritySettingsSection settings={settings.security} onUpdate={handleUpdateSecurity} />
            <ExpandedNotificationPreferences preferences={settings.notifications} onSave={handleSaveNotifications} />
            <SubscriptionManagement subscription={settings.subscription} />
            <DataPrivacySettings />

            <Card title="Appearance">
                 <p className="text-gray-400 text-sm">Theme and background customization options are available in the <span className="font-semibold text-cyan-300">Personalization</span> view.</p>
            </Card>
        </div>
    );
};

export default SettingsView;
```

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/views/personal/SettingsView.tsx
================================================================================

// components/views/personal/SettingsView.tsx
import React from 'react';
import Card from '../../Card';

const SettingsView: React.FC = () => {
    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white tracking-wider">Settings</h2>
            
            <Card title="Profile">
                <div className="space-y-4">
                    <div><label className="block text-sm font-medium text-gray-400">Name</label><p className="text-white">The Visionary</p></div>
                    <div><label className="block text-sm font-medium text-gray-400">Email</label><p className="text-white">visionary@demobank.com</p></div>
                </div>
            </Card>
            
            <Card title="Notification Preferences">
                 <ul className="divide-y divide-gray-700/60">
                    <li className="py-3 flex justify-between items-center">
                        <div><h4 className="font-semibold text-white">Large Transaction Alerts</h4><p className="text-sm text-gray-400">Notify me of any transaction over $500.</p></div>
                        <input type="checkbox" className="toggle toggle-cyan" defaultChecked />
                    </li>
                     <li className="py-3 flex justify-between items-center">
                        <div><h4 className="font-semibold text-white">Budget Warnings</h4><p className="text-sm text-gray-400">Let me know when I'm approaching a budget limit.</p></div>
                        <input type="checkbox" className="toggle toggle-cyan" defaultChecked />
                    </li>
                    <li className="py-3 flex justify-between items-center">
                        <div><h4 className="font-semibold text-white">AI Insight Notifications</h4><p className="text-sm text-gray-400">Alert me when the AI has a new high-urgency insight.</p></div>
                        <input type="checkbox" className="toggle toggle-cyan" defaultChecked />
                    </li>
                    <li className="py-3 flex justify-between items-center">
                        <div><h4 className="font-semibold text-white">Promotional Emails</h4><p className="text-sm text-gray-400">Receive marketing and product update emails.</p></div>
                        <input type="checkbox" className="toggle toggle-cyan" />
                    </li>
                </ul>
            </Card>
            
            <Card title="Appearance">
                 <p className="text-gray-400 text-sm">Theme and background customization options are available in the <span className="font-semibold text-cyan-300">Personalization</span> view.</p>
            </Card>
        </div>
    );
};

export default SettingsView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/views/personal/SettingsView.tsx
================================================================================

// components/views/personal/SettingsView.tsx
import React from 'react';
import Card from '../../Card';

const SettingsView: React.FC = () => {
    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white tracking-wider">Settings</h2>
            
            <Card title="Profile">
                <div className="space-y-4">
                    <div><label className="block text-sm font-medium text-gray-400">Name</label><p className="text-white">The Visionary</p></div>
                    <div><label className="block text-sm font-medium text-gray-400">Email</label><p className="text-white">visionary@demobank.com</p></div>
                </div>
            </Card>
            
            <Card title="Notification Preferences">
                 <ul className="divide-y divide-gray-700/60">
                    <li className="py-3 flex justify-between items-center">
                        <div><h4 className="font-semibold text-white">Large Transaction Alerts</h4><p className="text-sm text-gray-400">Notify me of any transaction over $500.</p></div>
                        <input type="checkbox" className="toggle toggle-cyan" defaultChecked />
                    </li>
                     <li className="py-3 flex justify-between items-center">
                        <div><h4 className="font-semibold text-white">Budget Warnings</h4><p className="text-sm text-gray-400">Let me know when I'm approaching a budget limit.</p></div>
                        <input type="checkbox" className="toggle toggle-cyan" defaultChecked />
                    </li>
                    <li className="py-3 flex justify-between items-center">
                        <div><h4 className="font-semibold text-white">AI Insight Notifications</h4><p className="text-sm text-gray-400">Alert me when the AI has a new high-urgency insight.</p></div>
                        <input type="checkbox" className="toggle toggle-cyan" defaultChecked />
                    </li>
                    <li className="py-3 flex justify-between items-center">
                        <div><h4 className="font-semibold text-white">Promotional Emails</h4><p className="text-sm text-gray-400">Receive marketing and product update emails.</p></div>
                        <input type="checkbox" className="toggle toggle-cyan" />
                    </li>
                </ul>
            </Card>
            
            <Card title="Appearance">
                 <p className="text-gray-400 text-sm">Theme and background customization options are available in the <span className="font-semibold text-cyan-300">Personalization</span> view.</p>
            </Card>
        </div>
    );
};

export default SettingsView;
