// REPOSITORY SOURCE: diplomat-bit/almost | PATH: diplomat-bit-almost-93a5466/components/views/personal/SecurityView.tsx
================================================================================

// components/views/personal/SecurityView.tsx
import React, { useContext, useState } from 'react';
import { DataContext } from '../../../context/DataContext';
import Card from '../../Card';
import PlaidLinkButton from '../../PlaidLinkButton';

const MOCK_SECURITY_EVENTS = [
    { id: 'e1', type: 'Login', description: 'Successful login from Chrome on macOS', timestamp: '2 minutes ago', icon: 'login' },
    { id: 'e2', type: 'Setting Change', description: '2FA was enabled', timestamp: '2 days ago', icon: 'setting' },
    { id: 'e3', type: 'Login', description: 'Successful login from DemoBank App on iOS', timestamp: '3 days ago', icon: 'login' },
    { id: 'e4', type: 'API Key', description: 'New API key created for "Staging-WebApp-Test"', timestamp: '4 days ago', icon: 'key' },
    { id: 'e5', type: 'Failed Login', description: 'Failed login attempt from unknown IP', timestamp: '5 days ago', icon: 'failed' },
];

const EventIcon: React.FC<{type: string}> = ({type}) => {
    let path = "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"; 
    if(type === 'login') path = "M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1m0-11V4a2 2 0 00-2-2h-3a2 2 0 00-2 2v1";
    if(type === 'setting') path = "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z";
    if(type === 'key') path = "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.623 5.873M15 7A6 6 0 002.377 8.373M15 7a2 2 0 00-2-2H9a2 2 0 00-2 2"
    if(type === 'failed') path = "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z";
    return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} /></svg>
};

const SecurityView: React.FC = () => {
    const context = useContext(DataContext);
    
    if (!context) throw new Error("SecurityView must be within a DataProvider.");
    const { linkedAccounts, unlinkAccount, handlePlaidSuccess } = context;

    return (
        <div className="space-y-6 animate-fade-in">
            <h2 className="text-3xl font-bold text-white tracking-wider">The Citadel (AegisVault)</h2>
            
            <Card title="Security Event Timeline" isCollapsible>
                <div className="relative pl-6 space-y-4">
                    <div className="absolute left-0 top-0 h-full w-0.5 bg-gray-700/50"></div>
                    {MOCK_SECURITY_EVENTS.map(event => (
                        <div key={event.id} className="relative pl-8 py-1 group">
                             <div className={`absolute left-[-12px] top-2 w-6 h-6 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${event.type === 'Failed Login' ? 'bg-red-500/20 text-red-300' : 'bg-cyan-500/20 text-cyan-300'}`}>
                                <EventIcon type={event.icon}/>
                            </div>
                            <p className="font-semibold text-white text-sm">{event.description}</p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">{event.timestamp}</p>
                        </div>
                    ))}
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Security Settings">
                    <ul className="divide-y divide-gray-700/60">
                         <li className="py-3 flex justify-between items-center"><p className="text-sm">Two-Factor Authentication</p><input type="checkbox" className="toggle toggle-cyan" defaultChecked /></li>
                         <li className="py-3 flex justify-between items-center"><p className="text-sm">Biometric Login</p><input type="checkbox" className="toggle toggle-cyan" /></li>
                         <li className="py-3 flex justify-between items-center"><p className="text-sm">Master Key Access</p><button className="text-xs text-cyan-400 hover:underline">Rotate Keys</button></li>
                    </ul>
                </Card>
                <Card title="Authorized Treaties" subtitle="Institutional Data Bridges">
                    <div className="space-y-3 mb-6">
                        {linkedAccounts.length > 0 ? linkedAccounts.map(account => (
                            <div key={account.id} className="flex justify-between items-center p-3 bg-gray-800/40 border border-gray-700/30 rounded-xl hover:border-cyan-500/30 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m-1 4h1m5-8h1m-1 4h1m-1 4h1M9 21v-3.07a2 2 0 01.15-.76 2 2 0 011.6-1.17h.5a2 2 0 011.6 1.17c.1.4.15.76.15.76V21" /></svg>
                                    </div>
                                    <div><h4 className="font-semibold text-sm text-white">{account.name}</h4><p className="text-[10px] text-gray-500 font-mono tracking-widest">IDENTITY: **** {account.mask}</p></div>
                                </div>
                                <button onClick={() => unlinkAccount(account.id)} className="px-2 py-1 bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/20 rounded-lg text-[10px] uppercase font-bold tracking-tighter">Sever Connection</button>
                            </div>
                        )) : (<p className="text-gray-500 text-center py-4 text-sm italic">No active data treaties in force.</p>)}
                    </div>
                    <PlaidLinkButton onSuccess={handlePlaidSuccess} />
                </Card>
            </div>
        </div>
    );
};

export default SecurityView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | ORIGINAL PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/personal/SecurityView.tsx
================================================================================

// components/views/personal/SecurityView.tsx
import React, { useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { DataContext } from '../../../context/DataContext';
import Card from '../../Card';
import PlaidLinkButton from '../../PlaidLinkButton';

// ================================================================================================
// SVG ICONS
// ================================================================================================
const ShieldCheckIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.917l9 2.083 9-2.083c0-5.922-3.824-11.026-9.382-13.984z" />
    </svg>
);
const KeyIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.623 5.873M15 7A6 6 0 002.377 8.373M15 7a2 2 0 00-2-2H9a2 2 0 00-2 2m12 11.5a1.5 1.5 0 01-3 0V17a1.5 1.5 0 01-3 0v-1.5a1.5 1.5 0 01-3 0V11a3 3 0 013-3h3a3 3 0 013 3v1.5a1.5 1.5 0 01-3 0V14a1.5 1.5 0 01-3 0v1.5a1.5 1.5 0 013 0v1.5a1.5 1.5 0 013 0z" />
    </svg>
);
const DevicePhoneMobileIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
);
const QrCodeIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.5 5.5h3v3h-3v-3zM15.5 5.5h3v3h-3v-3zM5.5 15.5h3v3h-3v-3zM10.5 10.5h3v3h-3v-3zM15.5 15.5h3v3h-3v-3zM4 4h16v16H4V4zM10 4v16M4 10h16" />
    </svg>
);
const AtSymbolIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
    </svg>
);
const BellIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
);
const GlobeAltIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9V3m0 18a9 9 0 009-9m-9 9a9 9 0 00-9-9" />
    </svg>
);
const DesktopComputerIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);
const TrashIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);
const InformationCircleIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const CheckCircleIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const ExclamationTriangleIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
);
const XCircleIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const EyeIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);
const EyeSlashIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a10.05 10.05 0 013.54-4.475m5.234-1.225A10.05 10.05 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.05 10.05 0 01-1.423 3.55m-5.11-6.85a3 3 0 00-4.243 4.243m4.243-4.243l-4.243 4.243" />
    </svg>
);
const FingerPrintIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c.828 0 1.5.672 1.5 1.5S12.828 14 12 14s-1.5-.672-1.5-1.5.672-1.5 1.5-1.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3.5c4.685 0 8.5 3.815 8.5 8.5 0 .307-.018.61-.05.91M12 3.5C7.315 3.5 3.5 7.315 3.5 12c0 .307.018.61.05.91M4.414 17.586A8.5 8.5 0 0012 20.5a8.5 8.5 0 007.586-2.914M12 3.5V2m0 18.5v-1.5M4.414 6.414L3 5m18 18l-1.414-1.414M21 12h-1.5M4.5 12H3m16.586-5.586L19.5 5" />
    </svg>
);
const ShieldExclamationIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2.036c-2.31 0-4.45.89-6.08 2.52C4.29 6.186 3.5 8.326 3.5 10.636V16.5a1 1 0 001 1h15a1 1 0 001-1V10.636c0-2.31-.79-4.45-2.42-6.08C16.45 2.926 14.31 2.036 12 2.036z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01" />
    </svg>
);
const UserCircleIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A10.002 10.002 0 0112 3c3.25 0 6.22.99 8.685 2.684M12 12a4 4 0 100-8 4 4 0 000 8zm-9 8a9 9 0 0118 0h-18z" />
    </svg>
);
const Spinner: React.FC<{className?: string}> = ({ className = 'w-5 h-5' }) => (
    <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

// ================================================================================================
// TYPE DEFINITIONS
// ================================================================================================

export interface LoginActivity { id: string; device: string; location: string; ip: string; timestamp: string; isCurrent: boolean; userAgent: string; riskLevel: 'low' | 'medium' | 'high'; }
export type TwoFactorMethodType = 'authenticator' | 'sms' | 'security_key';
export interface TwoFactorMethod { id: string; type: TwoFactorMethodType; name: string; addedOn: string; isPrimary: boolean; }
export type ApiScope = 'read:transactions' | 'read:balance' | 'write:transfers' | 'read:portfolio' | 'full_access';
export interface ApiKey { id: string; name: string; prefix: string; lastUsed: string | null; createdOn: string; scopes: ApiScope[]; expiresOn: string | null; }
export interface AuthorizedApp { id: string; name: string; logoUrl: string; description: string; scopes: string[]; authorizedOn: string; }
export interface SecurityNotificationSettings { newLogin: ('email' | 'sms' | 'push')[]; failedLogin: ('email' | 'sms')[]; passwordChange: ('email' | 'sms')[]; apiKeyCreation: ('email')[]; }
export interface PasswordStrength { score: 0 | 1 | 2 | 3 | 4; feedback: { warning: string; suggestions: string[]; }; }
export type ModalType = null | 'changePassword' | 'setup2fa' | 'generateApiKey' | 'revokeApiKey' | 'viewBackupCodes';
export type ToastType = 'success' | 'error' | 'info' | 'warning';
export interface ToastMessage { id: number; type: ToastType; message: string; }
export interface SecurityRecommendation { id: string; title: string; description: string; action: () => void; priority: 'high' | 'medium' | 'low'; completed: boolean; }
export interface BreachedAccount { site: string; breachDate: string; dataClasses: string[]; }
export interface WebAuthnCredential { id: string; name: string; addedOn: string; }
// ================================================================================================
// MOCK DATA
// ================================================================================================

const MOCK_LOGIN_ACTIVITY: LoginActivity[] = [
    { id: '1', device: 'Chrome on macOS', location: 'New York, USA', ip: '192.168.1.1', timestamp: '2 minutes ago', isCurrent: true, userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36', riskLevel: 'low' },
    { id: '2', device: 'DemoBank App on iOS', location: 'New York, USA', ip: '172.16.0.1', timestamp: '3 days ago', isCurrent: false, userAgent: 'DemoBank/3.1.2 (iPhone; iOS 16.1.1; Scale/3.00)', riskLevel: 'low' },
    { id: '3', device: 'Chrome on Windows', location: 'Chicago, USA', ip: '10.0.0.1', timestamp: '1 week ago', isCurrent: false, userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36', riskLevel: 'medium' },
    { id: '4', device: 'Firefox on Linux', location: 'Bucharest, Romania', ip: '203.0.113.42', timestamp: '2 weeks ago', isCurrent: false, userAgent: 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:107.0) Gecko/20100101 Firefox/107.0', riskLevel: 'high' },
];
const MOCK_SECURITY_EVENTS = [
    { id: 'e1', type: 'Login', description: 'Successful login from Chrome on macOS', timestamp: '2 minutes ago', icon: 'login' },
    { id: 'e2', type: 'Setting Change', description: '2FA method "Authenticator App" was added', timestamp: '2 days ago', icon: 'setting' },
    { id: 'e3', type: 'API Key', description: 'New API key created for "Staging-WebApp-Test"', timestamp: '4 days ago', icon: 'key' },
    { id: 'e4', type: 'Failed Login', description: 'Failed login attempt from 203.0.113.55', timestamp: '5 days ago', icon: 'failed' },
    { id: 'e5', type: 'Password Change', description: 'Password was successfully changed', timestamp: '1 week ago', icon: 'key' },
];
export const MOCK_2FA_METHODS: TwoFactorMethod[] = [{ id: '2fa1', type: 'authenticator', name: 'Google Authenticator', addedOn: '2023-01-15', isPrimary: true }];
export const MOCK_API_KEYS: ApiKey[] = [{ id: 'api2', name: 'Production Data Scraper', prefix: 'sk_prod_x4y5z6', lastUsed: '2 hours ago', createdOn: '2023-01-01', scopes: ['read:transactions'], expiresOn: null }];
export const MOCK_AUTHORIZED_APPS: AuthorizedApp[] = [{ id: 'app1', name: 'Mint', logoUrl: '/mint-logo.png', description: 'Personal finance and budgeting app.', scopes: ['Read transaction history', 'View account balances'], authorizedOn: '2023-02-20' }];
const MOCK_BREACH_DATA: BreachedAccount[] = [{ site: 'socialnetwork.com', breachDate: '2021-06-01', dataClasses: ['Email addresses', 'Passwords', 'Usernames'] }];
const MOCK_WEBAUTHN_CREDS: WebAuthnCredential[] = [{ id: 'cred1', name: 'YubiKey 5C', addedOn: '2023-04-10' }];

// ================================================================================================
// UTILITY FUNCTIONS
// ================================================================================================

export const generateSecureString = (length: number): string => {
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    return Array.from(array, dec => 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[dec % 62]).join('');
};
export const copyToClipboard = (text: string): Promise<void> => navigator.clipboard.writeText(text);
export const calculatePasswordStrength = (password: string): PasswordStrength => {
    let score = 0;
    const feedback = { warning: '', suggestions: [] as string[] };
    if (!password) return { score: 0, feedback };
    if (password.length >= 8) score++; else feedback.suggestions.push('Use at least 8 characters.');
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++; else feedback.suggestions.push('Include both uppercase and lowercase letters.');
    if (/[0-9]/.test(password)) score++; else feedback.suggestions.push('Add numbers.');
    if (/[^A-Za-z0-9]/.test(password)) score++; else feedback.suggestions.push('Add symbols (e.g., !@#$).');
    score = Math.min(score, 4) as PasswordStrength['score'];
    if (score < 2 && password.length > 0) feedback.warning = 'Password is too weak.';
    return { score, feedback };
};

// ================================================================================================
// UI PRIMITIVE COMPONENTS
// ================================================================================================

export const SecurityModal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; footer?: React.ReactNode; size?: 'md' | 'lg' | 'xl'; }> = ({ isOpen, onClose, title, children, footer, size = 'lg' }) => {
    if (!isOpen) return null;
    const sizeClasses = { md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-xl' };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center" onClick={onClose}>
            <div className={`bg-gray-900 border border-gray-700 rounded-lg shadow-xl w-full m-4 ${sizeClasses[size]}`} onClick={e => e.stopPropagation()}>
                <div className="p-5 border-b border-gray-700 flex justify-between items-center"><h3 className="text-xl font-bold text-white">{title}</h3><button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button></div>
                <div className="p-6">{children}</div>
                {footer && <div className="p-5 bg-gray-800/50 border-t border-gray-700 rounded-b-lg flex justify-end space-x-3">{footer}</div>}
            </div>
        </div>
    );
};
export const Toast: React.FC<{ toast: ToastMessage, onDismiss: (id: number) => void }> = ({ toast, onDismiss }) => {
    useEffect(() => { const timer = setTimeout(() => onDismiss(toast.id), 5000); return () => clearTimeout(timer); }, [toast.id, onDismiss]);
    const colors = { success: 'bg-green-500/20 border-green-500 text-green-300', error: 'bg-red-500/20 border-red-500 text-red-300', info: 'bg-blue-500/20 border-blue-500 text-blue-300', warning: 'bg-yellow-500/20 border-yellow-500 text-yellow-300' };
    const icons = { success: <CheckCircleIcon className="w-5 h-5" />, error: <XCircleIcon className="w-5 h-5" />, info: <InformationCircleIcon className="w-5 h-5" />, warning: <ExclamationTriangleIcon className="w-5 h-5" /> };
    return <div className={`flex items-start p-4 mb-3 rounded-lg border shadow-lg text-sm ${colors[toast.type]}`}><div className="mr-3">{icons[toast.type]}</div><p className="flex-1">{toast.message}</p><button onClick={() => onDismiss(toast.id)} className="ml-4 text-gray-400 hover:text-white">&times;</button></div>;
}
export const ToastContainer: React.FC<{ toasts: ToastMessage[], onDismiss: (id: number) => void }> = ({ toasts, onDismiss }) => (<div className="fixed bottom-5 right-5 z-50 w-full max-w-sm">{toasts.map(toast => <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />)}</div>);
const EventIcon: React.FC<{type: string}> = ({type}) => {
    const icons = { login: <KeyIcon className="w-4 h-4" />, setting: <ShieldCheckIcon className="w-4 h-4" />, key: <KeyIcon className="w-4 h-4" />, failed: <ExclamationTriangleIcon className="w-4 h-4" /> };
    return icons[type as keyof typeof icons] || <InformationCircleIcon className="w-4 h-4" />;
};
export const FormInput: React.FC<{ id: string; label: string; type: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string; autoComplete?: string; hasToggle?: boolean; }> = ({ id, label, type, value, onChange, placeholder, autoComplete, hasToggle }) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const inputType = hasToggle ? (isPasswordVisible ? 'text' : 'password') : type;
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
            <div className="relative">
                <input id={id} name={id} type={inputType} value={value} onChange={onChange} placeholder={placeholder} autoComplete={autoComplete} className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-cyan-500 focus:border-cyan-500" />
                {hasToggle && <button type="button" onClick={() => setIsPasswordVisible(!isPasswordVisible)} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-white">{isPasswordVisible ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}</button>}
            </div>
        </div>
    );
};
export const PasswordStrengthMeter: React.FC<{ strength: PasswordStrength }> = ({ strength }) => {
    const strengthColors = ['bg-red-500', 'bg-red-500', 'bg-yellow-500', 'bg-green-500', 'bg-green-500'];
    const strengthText = ['Very Weak', 'Weak', 'Okay', 'Strong', 'Very Strong'];
    return (
        <div className="space-y-2">
            <div className="w-full bg-gray-700 rounded-full h-2"><div className={`h-2 rounded

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/views/personal/SecurityView.tsx
================================================================================

// components/views/personal/SecurityView.tsx
import React, { useContext, useState } from 'react';
import { DataContext } from '../../../context/DataContext';
import Card from '../../Card';
import PlaidLinkButton from '../../PlaidLinkButton';

const MOCK_SECURITY_EVENTS = [
    { id: 'e1', type: 'Login', description: 'Successful login from Chrome on macOS', timestamp: '2 minutes ago', icon: 'login' },
    { id: 'e2', type: 'Setting Change', description: '2FA was enabled', timestamp: '2 days ago', icon: 'setting' },
    { id: 'e3', type: 'Login', description: 'Successful login from DemoBank App on iOS', timestamp: '3 days ago', icon: 'login' },
    { id: 'e4', type: 'API Key', description: 'New API key created for "Staging-WebApp-Test"', timestamp: '4 days ago', icon: 'key' },
    { id: 'e5', type: 'Failed Login', description: 'Failed login attempt from unknown IP', timestamp: '5 days ago', icon: 'failed' },
];

const EventIcon: React.FC<{type: string}> = ({type}) => {
    let path = "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"; 
    if(type === 'login') path = "M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1m0-11V4a2 2 0 00-2-2h-3a2 2 0 00-2 2v1";
    if(type === 'setting') path = "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z";
    if(type === 'key') path = "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.623 5.873M15 7A6 6 0 002.377 8.373M15 7a2 2 0 00-2-2H9a2 2 0 00-2 2"
    if(type === 'failed') path = "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z";
    return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} /></svg>
};

const SecurityView: React.FC = () => {
    const context = useContext(DataContext);
    
    if (!context) throw new Error("SecurityView must be within a DataProvider.");
    const { linkedAccounts, unlinkAccount, handlePlaidSuccess } = context;

    return (
        <div className="space-y-6 animate-fade-in">
            <h2 className="text-3xl font-bold text-white tracking-wider">The Citadel (AegisVault)</h2>
            
            <Card title="Security Event Timeline" isCollapsible>
                <div className="relative pl-6 space-y-4">
                    <div className="absolute left-0 top-0 h-full w-0.5 bg-gray-700/50"></div>
                    {MOCK_SECURITY_EVENTS.map(event => (
                        <div key={event.id} className="relative pl-8 py-1 group">
                             <div className={`absolute left-[-12px] top-2 w-6 h-6 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${event.type === 'Failed Login' ? 'bg-red-500/20 text-red-300' : 'bg-cyan-500/20 text-cyan-300'}`}>
                                <EventIcon type={event.icon}/>
                            </div>
                            <p className="font-semibold text-white text-sm">{event.description}</p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">{event.timestamp}</p>
                        </div>
                    ))}
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Security Settings">
                    <ul className="divide-y divide-gray-700/60">
                         <li className="py-3 flex justify-between items-center"><p className="text-sm">Two-Factor Authentication</p><input type="checkbox" className="toggle toggle-cyan" defaultChecked /></li>
                         <li className="py-3 flex justify-between items-center"><p className="text-sm">Biometric Login</p><input type="checkbox" className="toggle toggle-cyan" /></li>
                         <li className="py-3 flex justify-between items-center"><p className="text-sm">Master Key Access</p><button className="text-xs text-cyan-400 hover:underline">Rotate Keys</button></li>
                    </ul>
                </Card>
                <Card title="Authorized Treaties" subtitle="Institutional Data Bridges">
                    <div className="space-y-3 mb-6">
                        {linkedAccounts.length > 0 ? linkedAccounts.map(account => (
                            <div key={account.id} className="flex justify-between items-center p-3 bg-gray-800/40 border border-gray-700/30 rounded-xl hover:border-cyan-500/30 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m-1 4h1m5-8h1m-1 4h1m-1 4h1M9 21v-3.07a2 2 0 01.15-.76 2 2 0 011.6-1.17h.5a2 2 0 011.6 1.17c.1.4.15.76.15.76V21" /></svg>
                                    </div>
                                    <div><h4 className="font-semibold text-sm text-white">{account.name}</h4><p className="text-[10px] text-gray-500 font-mono tracking-widest">IDENTITY: **** {account.mask}</p></div>
                                </div>
                                <button onClick={() => unlinkAccount(account.id)} className="px-2 py-1 bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/20 rounded-lg text-[10px] uppercase font-bold tracking-tighter">Sever Connection</button>
                            </div>
                        )) : (<p className="text-gray-500 text-center py-4 text-sm italic">No active data treaties in force.</p>)}
                    </div>
                    <PlaidLinkButton onSuccess={handlePlaidSuccess} />
                </Card>
            </div>
        </div>
    );
};

export default SecurityView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/views/personal/SecurityView.tsx
================================================================================

// components/views/personal/SecurityView.tsx
import React, { useContext, useState } from 'react';
import { DataContext } from '../../../context/DataContext';
import Card from '../../Card';
import PlaidLinkButton from '../../PlaidLinkButton';

const MOCK_SECURITY_EVENTS = [
    { id: 'e1', type: 'Login', description: 'Successful login from Chrome on macOS', timestamp: '2 minutes ago', icon: 'login' },
    { id: 'e2', type: 'Setting Change', description: '2FA was enabled', timestamp: '2 days ago', icon: 'setting' },
    { id: 'e3', type: 'Login', description: 'Successful login from DemoBank App on iOS', timestamp: '3 days ago', icon: 'login' },
    { id: 'e4', type: 'API Key', description: 'New API key created for "Staging-WebApp-Test"', timestamp: '4 days ago', icon: 'key' },
    { id: 'e5', type: 'Failed Login', description: 'Failed login attempt from unknown IP', timestamp: '5 days ago', icon: 'failed' },
];

const EventIcon: React.FC<{type: string}> = ({type}) => {
    let path = "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"; 
    if(type === 'login') path = "M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1m0-11V4a2 2 0 00-2-2h-3a2 2 0 00-2 2v1";
    if(type === 'setting') path = "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z";
    if(type === 'key') path = "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.623 5.873M15 7A6 6 0 002.377 8.373M15 7a2 2 0 00-2-2H9a2 2 0 00-2 2"
    if(type === 'failed') path = "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z";
    return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} /></svg>
};

const SecurityView: React.FC = () => {
    const context = useContext(DataContext);
    
    if (!context) throw new Error("SecurityView must be within a DataProvider.");
    const { linkedAccounts, unlinkAccount, handlePlaidSuccess } = context;

    return (
        <div className="space-y-6 animate-fade-in">
            <h2 className="text-3xl font-bold text-white tracking-wider">The Citadel (AegisVault)</h2>
            
            <Card title="Security Event Timeline" isCollapsible>
                <div className="relative pl-6 space-y-4">
                    <div className="absolute left-0 top-0 h-full w-0.5 bg-gray-700/50"></div>
                    {MOCK_SECURITY_EVENTS.map(event => (
                        <div key={event.id} className="relative pl-8 py-1 group">
                             <div className={`absolute left-[-12px] top-2 w-6 h-6 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${event.type === 'Failed Login' ? 'bg-red-500/20 text-red-300' : 'bg-cyan-500/20 text-cyan-300'}`}>
                                <EventIcon type={event.icon}/>
                            </div>
                            <p className="font-semibold text-white text-sm">{event.description}</p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">{event.timestamp}</p>
                        </div>
                    ))}
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Security Settings">
                    <ul className="divide-y divide-gray-700/60">
                         <li className="py-3 flex justify-between items-center"><p className="text-sm">Two-Factor Authentication</p><input type="checkbox" className="toggle toggle-cyan" defaultChecked /></li>
                         <li className="py-3 flex justify-between items-center"><p className="text-sm">Biometric Login</p><input type="checkbox" className="toggle toggle-cyan" /></li>
                         <li className="py-3 flex justify-between items-center"><p className="text-sm">Master Key Access</p><button className="text-xs text-cyan-400 hover:underline">Rotate Keys</button></li>
                    </ul>
                </Card>
                <Card title="Authorized Treaties" subtitle="Institutional Data Bridges">
                    <div className="space-y-3 mb-6">
                        {linkedAccounts.length > 0 ? linkedAccounts.map(account => (
                            <div key={account.id} className="flex justify-between items-center p-3 bg-gray-800/40 border border-gray-700/30 rounded-xl hover:border-cyan-500/30 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m-1 4h1m5-8h1m-1 4h1m-1 4h1M9 21v-3.07a2 2 0 01.15-.76 2 2 0 011.6-1.17h.5a2 2 0 011.6 1.17c.1.4.15.76.15.76V21" /></svg>
                                    </div>
                                    <div><h4 className="font-semibold text-sm text-white">{account.name}</h4><p className="text-[10px] text-gray-500 font-mono tracking-widest">IDENTITY: **** {account.mask}</p></div>
                                </div>
                                <button onClick={() => unlinkAccount(account.id)} className="px-2 py-1 bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/20 rounded-lg text-[10px] uppercase font-bold tracking-tighter">Sever Connection</button>
                            </div>
                        )) : (<p className="text-gray-500 text-center py-4 text-sm italic">No active data treaties in force.</p>)}
                    </div>
                    <PlaidLinkButton onSuccess={handlePlaidSuccess} />
                </Card>
            </div>
        </div>
    );
};

export default SecurityView;
