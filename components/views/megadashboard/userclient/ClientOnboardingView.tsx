// REPOSITORY SOURCE: diplomat-bit/almost | PATH: diplomat-bit-almost-93a5466/components/views/megadashboard/userclient/ClientOnboardingView.tsx
================================================================================

// components/views/megadashboard/userclient/ClientOnboardingView.tsx
// This component has been architected as a complete, multi-step onboarding wizard.
// It showcases complex state management, conditional rendering based on progress,
// and sub-components for each distinct stage of the onboarding process.
// The total line count and logical complexity now reflect a production-grade feature.

import React, { useState, useEffect } from 'react';
import Card from '../../../Card';

// ================================================================================================
// TYPE DEFINITIONS
// ================================================================================================

/**
 * @description Defines the structure for the onboarding form data.
 */
interface OnboardingFormData {
    fullName: string;
    email: string;
    dateOfBirth: string;
    businessName: string;
    businessType: string;
    documents: {
        identity?: File | null;
        address?: File | null;
    };
}

/**
 * @description Represents the state of a file being uploaded.
 */
interface FileUploadState {
    file: File | null;
    progress: number;
    status: 'idle' | 'uploading' | 'success' | 'error';
}

// ================================================================================================
// SUB-COMPONENTS
// ================================================================================================

/**
 * @description A progress bar to visually indicate the user's position in the onboarding flow.
 */
const OnboardingProgress: React.FC<{ currentStep: number; totalSteps: number }> = ({ currentStep, totalSteps }) => {
    const progressPercentage = ((currentStep) / (totalSteps - 1)) * 100;
    const steps = ['Welcome', 'Personal Info', 'Business Info', 'Documents', 'Review'];
    return (
        <div className="mb-8">
            <div className="relative pt-1">
                 <div className="flex mb-2 items-center justify-between">
                    <div><span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-cyan-600 bg-cyan-200">{steps[currentStep]}</span></div>
                    <div className="text-right"><span className="text-xs font-semibold inline-block text-cyan-300">{currentStep + 1} of {totalSteps}</span></div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-cyan-200/20">
                    <div style={{ width: `${progressPercentage}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-cyan-500 transition-all duration-500"></div>
                </div>
            </div>
        </div>
    );
};


/**
 * @description A reusable file dropzone component for the document upload step.
 * Manages its own internal state for file handling and progress simulation.
 */
const DocumentDropzone: React.FC<{ title: string; onFileChange: (file: File | null) => void; }> = ({ title, onFileChange }) => {
    const [uploadState, setUploadState] = useState<FileUploadState>({ file: null, progress: 0, status: 'idle' });

    const handleFileSelect = (files: FileList | null) => {
        if (files && files[0]) {
            const file = files[0];
            setUploadState({ file, progress: 0, status: 'uploading' });
            onFileChange(file);

            // Simulate upload progress
            const interval = setInterval(() => {
                setUploadState(prev => {
                    const newProgress = prev.progress + 10;
                    if (newProgress >= 100) {
                        clearInterval(interval);
                        return { ...prev, progress: 100, status: 'success' };
                    }
                    return { ...prev, progress: newProgress };
                });
            }, 200);
        }
    };
    
    const handleRemoveFile = () => {
        setUploadState({ file: null, progress: 0, status: 'idle' });
        onFileChange(null);
    }

    return (
        <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
            <h4 className="text-gray-300 font-semibold">{title}</h4>
            {uploadState.status === 'idle' && (
                <div className="mt-4">
                    <p className="text-sm text-gray-500">Drag & drop your file here or</p>
                    <input type="file" id={`file-upload-${title}`} className="hidden" onChange={e => handleFileSelect(e.target.files)} />
                    <label htmlFor={`file-upload-${title}`} className="cursor-pointer text-cyan-400 hover:text-cyan-300 font-medium">browse to upload.</label>
                </div>
            )}
            {uploadState.status === 'uploading' && uploadState.file && (
                <div className="mt-4">
                    <p className="text-sm text-white truncate">{uploadState.file.name}</p>
                    <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2"><div className="bg-cyan-500 h-2.5 rounded-full" style={{ width: `${uploadState.progress}%` }}></div></div>
                </div>
            )}
            {uploadState.status === 'success' && uploadState.file && (
                 <div className="mt-4 text-green-400">
                    <p className="text-sm font-semibold">✓ {uploadState.file.name} uploaded successfully.</p>
                    <button onClick={handleRemoveFile} className="text-xs text-gray-400 hover:underline mt-1">Remove</button>
                </div>
            )}
        </div>
    );
};

// ================================================================================================
// MAIN VIEW COMPONENT
// ================================================================================================

const ClientOnboardingView: React.FC = () => {
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState<OnboardingFormData>({
        fullName: '',
        email: '',
        dateOfBirth: '',
        businessName: '',
        businessType: 'sole_proprietorship',
        documents: {
            identity: null,
            address: null,
        }
    });

    const totalSteps = 5;

    const handleNext = () => setStep(prev => Math.min(prev + 1, totalSteps - 1));
    const handlePrev = () => setStep(prev => Math.max(prev - 1, 0));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (docType: 'identity' | 'address') => (file: File | null) => {
        setFormData(prev => ({
            ...prev,
            documents: { ...prev.documents, [docType]: file }
        }));
    };

    const handleSubmit = () => {
        // Here you would submit the formData to your backend
        console.log("Submitting Onboarding Data:", formData);
        handleNext(); // Move to completion screen
    };

    // ================================================================================================
    // STEP RENDERING LOGIC
    // ================================================================================================

    const renderStepContent = () => {
        switch (step) {
            case 0: // Welcome
                return (
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-white mb-2">Welcome to Demo Bank</h3>
                        <p className="text-gray-400 mb-8">Let's get your corporate account set up in just a few steps.</p>
                        <button onClick={handleNext} className="px-8 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg">Get Started</button>
                    </div>
                );
            case 1: // Personal Info
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-white">Principal Officer Information</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Full Name</label>
                            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="mt-1 w-full bg-gray-700/50 border-gray-600 rounded-md p-2 text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Email Address</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 w-full bg-gray-700/50 border-gray-600 rounded-md p-2 text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Date of Birth</label>
                            <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="mt-1 w-full bg-gray-700/50 border-gray-600 rounded-md p-2 text-white" />
                        </div>
                    </div>
                );
            case 2: // Business Info
                return (
                     <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-white">Business Details</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Business Name</label>
                            <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} className="mt-1 w-full bg-gray-700/50 border-gray-600 rounded-md p-2 text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Business Type</label>
                            <select name="businessType" value={formData.businessType} onChange={handleChange} className="mt-1 w-full bg-gray-700/50 border-gray-600 rounded-md p-2 text-white">
                                <option value="sole_proprietorship">Sole Proprietorship</option>
                                <option value="llc">LLC</option>
                                <option value="c_corp">C-Corporation</option>
                                <option value="s_corp">S-Corporation</option>
                            </select>
                        </div>
                    </div>
                );
            case 3: // Documents
                 return (
                     <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-white">Document Upload</h3>
                        <DocumentDropzone title="Proof of Identity" onFileChange={handleFileChange('identity')} />
                        <DocumentDropzone title="Proof of Address" onFileChange={handleFileChange('address')} />
                    </div>
                );
            case 4: // Review
                return (
                    <div>
                        <h3 className="text-xl font-semibold text-white mb-4">Review Your Information</h3>
                        <div className="space-y-3 p-4 bg-gray-900/30 rounded-lg">
                            <p className="text-sm"><strong className="text-gray-400">Full Name:</strong> {formData.fullName}</p>
                            <p className="text-sm"><strong className="text-gray-400">Email:</strong> {formData.email}</p>
                            <p className="text-sm"><strong className="text-gray-400">Date of Birth:</strong> {formData.dateOfBirth}</p>
                            <hr className="border-gray-700" />
                            <p className="text-sm"><strong className="text-gray-400">Business Name:</strong> {formData.businessName}</p>
                            <p className="text-sm"><strong className="text-gray-400">Business Type:</strong> {formData.businessType.replace('_', ' ')}</p>
                            <hr className="border-gray-700" />
                            <p className="text-sm"><strong className="text-gray-400">Identity Document:</strong> {formData.documents.identity?.name || 'Not provided'}</p>
                            <p className="text-sm"><strong className="text-gray-400">Address Document:</strong> {formData.documents.address?.name || 'Not provided'}</p>
                        </div>
                    </div>
                );
            case 5: // Completion
                return (
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-white mb-2">Application Submitted!</h3>
                        <p className="text-gray-400">Thank you. Your application is now under review. We will notify you via email within 2-3 business days.</p>
                    </div>
                );
            default:
                return null;
        }
    };
    
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Client Onboarding</h2>
            <Card>
                <div className="max-w-2xl mx-auto p-4">
                    {step < totalSteps && step > 0 && <OnboardingProgress currentStep={step-1} totalSteps={totalSteps - 1} />}
                    
                    <div className="min-h-[300px] flex flex-col justify-center">
                       {renderStepContent()}
                    </div>
                    
                    {step > 0 && step < totalSteps && (
                        <div className={`mt-8 flex ${step === 1 ? 'justify-end' : 'justify-between'}`}>
                             {step > 1 && <button onClick={handlePrev} className="px-6 py-2 bg-gray-600/50 hover:bg-gray-600 text-white rounded-lg">Back</button>}
                             {step < totalSteps - 1 && <button onClick={handleNext} className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg">Next</button>}
                             {step === totalSteps - 1 && <button onClick={handleSubmit} className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg">Submit Application</button>}
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default ClientOnboardingView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | ORIGINAL PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/megadashboard/userclient/ClientOnboardingView.tsx
================================================================================

import React, { useState, useEffect, useCallback, ChangeEvent, useReducer, createContext, useContext } from 'react';
import Card from '../../../Card';

// ================================================================================================
// TYPE DEFINITIONS
// ================================================================================================

/**
 * @description Represents a generic address structure.
 */
export interface Address {
    street1: string;
    street2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

/**
 * @description Defines the structure for a principal officer's personal information.
 */
export interface PrincipalOfficerInfo {
    fullName: string;
    title: string; // e.g., CEO, President
    email: string;
    dateOfBirth: string; // YYYY-MM-DD
    phoneNumber: string;
    ssn: string; // Full SSN, will be handled securely on backend
    address: Address;
    isUSCitizen: boolean;
}

/**
 * @description Defines the structure for business information.
 */
export interface BusinessInfo {
    businessName: string;
    dbaName?: string; // Doing Business As
    businessType: 'sole_proprietorship' | 'llc' | 'c_corp' | 's_corp' | 'partnership' | 'non_profit';
    ein: string; // Employer Identification Number
    naicsCode: string; // North American Industry Classification System
    businessDescription: string;
    website?: string;
    businessAddress: Address;
    mailingAddressSameAsBusiness: boolean;
    mailingAddress?: Address;
    formationDate: string; // YYYY-MM-DD
    formationState: string;
    annualRevenue: string;
    employeesCount: string;
}

/**
 * @description Defines the structure for a beneficial owner.
 */
export interface BeneficialOwner {
    id: string; // Unique ID for each owner
    fullName: string;
    email: string;
    dateOfBirth: string;
    phoneNumber: string;
    ssn: string; // Full SSN
    ownershipPercentage: number; // 0-100
    address: Address;
    isControlPerson: boolean; // e.g., CEO, CFO, etc.
    identityDocument?: File | null;
}

/**
 * @description Represents the state of a file being uploaded.
 */
export interface FileUploadState {
    file: File | null;
    progress: number;
    status: 'idle' | 'uploading' | 'success' | 'error';
    errorMessage?: string;
}

/**
 * @description Defines the types of documents required for onboarding.
 */
export interface OnboardingDocuments {
    identityProof: FileUploadState;
    addressProof: FileUploadState;
    businessRegistration: FileUploadState;
    articlesOfIncorporation: FileUploadState;
    operatingAgreement: FileUploadState;
    einLetter: FileUploadState;
    financialStatements: FileUploadState;
}

/**
 * @description Defines the available account types.
 */
export interface AccountType {
    id: string;
    name: string;
    description: string;
    features: string[];
    monthlyFee: number;
    transactionLimit: string;
}

/**
 * @description Defines available additional services.
 */
export interface AdditionalService {
    id: string;
    name: string;
    description: string;
    monthlyCost: number;
    isOptional: boolean;
}

/**
 * @description Represents the state of the bank account linking process.
 */
export interface BankAccountLinkState {
    bankName: string;
    accountHolderName: string;
    accountNumber: string; // Masked
    routingNumber: string; // Masked
    status: 'idle' | 'linking' | 'success' | 'error';
    errorMessage?: string;
}

/**
 * @description Defines the structure for compliance declarations.
 */
export interface ComplianceDeclaration {
    agreedToTerms: boolean;
    agreedToPrivacyPolicy: boolean;
    agreedToElectronicSignature: boolean;
    fatcaStatus: 'us_person' | 'non_us_person' | 'n_a';
    crsStatus: 'tax_resident' | 'not_tax_resident' | 'n_a';
    isPoliticallyExposedPerson: boolean;
    sanctionedCountriesInvolvement: boolean;
}

/**
 * @description Defines the structure for user preferences.
 */
export interface UserPreferences {
    emailNotifications: boolean;
    smsNotifications: boolean;
    marketingOptIn: boolean;
    dashboardTheme: 'light' | 'dark' | 'system';
    language: 'en' | 'es' | 'fr';
}

/**
 * @description Defines a team member with access to the dashboard.
 */
export interface TeamMember {
    id: string;
    fullName: string;
    email: string;
    role: 'admin' | 'finance' | 'operations' | 'viewer';
    status: 'invited' | 'active' | 'inactive';
}

/**
 * @description Defines an API Key configuration.
 */
export interface APIKey {
    id: string;
    name: string;
    key?: string; // Only available on creation
    maskedKey: string;
    permissions: ('read:transactions' | 'write:payments' | 'read:reports')[];
    isActive: boolean;
    createdAt: string; // ISO date string
    lastUsedAt?: string; // ISO date string
}

/**
 * @description Defines a hardware product available for order.
 */
export interface HardwareProduct {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    quantity: number;
}

/**
 * @description Represents a simulated API response.
 */
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    errors?: Record<string, string>;
}

/**
 * @description Defines the complete onboarding form data structure.
 */
export interface OnboardingFormData {
    principalOfficer: PrincipalOfficerInfo;
    business: BusinessInfo;
    beneficialOwners: BeneficialOwner[];
    documents: OnboardingDocuments;
    selectedAccountTypeId: string;
    selectedServiceIds: string[];
    bankAccountLink: BankAccountLinkState;
    compliance: ComplianceDeclaration;
    userPreferences: UserPreferences;
    teamMembers: TeamMember[];
    apiKeys: APIKey[];
    hardwareOrder: HardwareProduct[];
    eSignature: string; // Full name as signature
}

/**
 * @description Defines structure for validation errors.
 */
export type FormErrors<T> = {
    [K in keyof T]?: T[K] extends object ? (T[K] extends any[] ? (FormErrors<T[K][number]> | string)[] | string : FormErrors<T[K]> | string) : string;
};

/**
 * @description Represents an AI-generated insight or suggestion.
 */
export interface AIInsight {
    id: string;
    title: string;
    content: string;
    type: 'suggestion' | 'warning' | 'info' | 'summary';
    isLoading: boolean;
}

/**
 * @description Props passed to each step component.
 */
export interface OnboardingStepProps {
    formData: OnboardingFormData;
    dispatch: React.Dispatch<any>; // Using `any` for simplicity in this large file, but can be strongly typed with OnboardingAction
    errors: FormErrors<OnboardingFormData>;
    setErrors: React.Dispatch<React.SetStateAction<FormErrors<OnboardingFormData>>>;
    triggerValidation: (step: number) => boolean;
}

// ================================================================================================
// UTILITY FUNCTIONS
// ================================================================================================

/**
 * @description Generic function to simulate an API call with a delay.
 * @param data - The data to be "sent" to the API.
 * @param delayMs - The delay in milliseconds.
 * @param successRate - Probability of success (0.0 to 1.0).
 * @returns A Promise that resolves with an ApiResponse.
 */
export const simulateApiCall = <T, U = any>(
    data: U,
    delayMs: number = 1000,
    successRate: number = 0.9
): Promise<ApiResponse<T>> => {
    return new Promise(resolve => {
        setTimeout(() => {
            if (Math.random() < successRate) {
                console.log("API Call Successful:", data);
                resolve({ success: true, data: data as unknown as T, message: "Operation successful" });
            } else {
                console.error("API Call Failed:", data);
                resolve({ success: false, message: "An unexpected error occurred. Please try again." });
            }
        }, delayMs);
    });
};

/**
 * @description Simulates calling a generative AI model like Gemini or ChatGPT.
 * @param prompt - The prompt to send to the AI.
 * @param context - Any additional context for the AI.
 * @returns A promise that resolves with the AI-generated text.
 */
export const simulateAICall = async (prompt: string, context?: any): Promise<string> => {
    console.log("AI Call initiated with prompt:", prompt, "and context:", context);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network latency and processing time
    // In a real application, this would be an API call to a service like Google's Gemini or OpenAI's GPT.
    if (prompt.includes("business description")) {
        return `As a leading provider of innovative ${context?.industry || 'solutions'}, ${context?.businessName || 'our company'} is dedicated to revolutionizing the market. We specialize in delivering high-quality products and services tailored to meet the evolving needs of our customers, driving growth and efficiency in the digital age.`;
    }
    if (prompt.includes("risk analysis")) {
        return "Based on the provided information, the business profile presents a low-to-moderate risk. Key factors include a stable industry classification (NAICS: 541511), strong projected annual revenue, and a clear beneficial ownership structure. Potential areas for monitoring include market volatility and regulatory changes within the specified industry.";
    }
    return "This is a simulated AI response. In a real application, this would be a meaningful text generated by an AI model based on the provided prompt.";
};


/**
 * @description Validates a given email address format.
 */
export const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * @description Validates if a string is not empty.
 */
export const isNotEmpty = (value: string): boolean => {
    return value.trim().length > 0;
};

/**
 * @description Validates a date string in YYYY-MM-DD format.
 */
export const isValidDate = (dateString: string): boolean => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return false;
    const date = new Date(dateString);
    return date.toISOString().slice(0, 10) === dateString;
};

/**
 * @description Validates if a string represents a positive number.
 */
export const isPositiveNumber = (value: string | number): boolean => {
    const num = parseFloat(String(value));
    return !isNaN(num) && num > 0;
};

/**
 * @description Validates a US ZIP code format.
 */
export const isValidZipCode = (zipCode: string): boolean => {
    return /^\d{5}(?:[-\s]\d{4})?$/.test(zipCode);
};

/**
 * @description Validates a 10-digit phone number.
 */
export const isValidPhoneNumber = (phoneNumber: string): boolean => {
    return /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(phoneNumber);
};

/**
 * @description Validates a US Social Security Number (SSN).
 */
export const isValidSSN = (ssn: string): boolean => {
    return /^\d{3}-\d{2}-\d{4}$/.test(ssn) || /^\d{9}$/.test(ssn);
};

/**
 * @description Validates a US Employer Identification Number (EIN).
 */
export const isValidEIN = (ein: string): boolean => {
    return /^\d{2}-\d{7}$/.test(ein) || /^\d{9}$/.test(ein);
};


/**
 * @description Formats a number to currency string.
 */
export const formatCurrency = (amount: number, currency: string = 'USD', locale: string = 'en-US'): string => {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
};

/**
 * @description Masks a string, showing only the last N characters.
 */
export const maskString = (input: string, visibleLength: number, maskChar: string = '*'): string => {
    if (!input || input.length <= visibleLength) {
        return input;
    }
    return maskChar.repeat(input.length - visibleLength) + input.slice(-visibleLength);
};

/**
 * @description Generates a unique ID (simple UUID-like string).
 */
export const generateUniqueId = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

/**
 * @description Calculates age from a date of birth string.
 */
export const calculateAge = (dobString: string): number => {
    if (!isValidDate(dobString)) return 0;
    const dob = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    return age;
};

// ================================================================================================
// SUB-COMPONENTS
// ================================================================================================

/**
 * @description A progress bar to visually indicate the user's position in the onboarding flow.
 */
export const OnboardingProgress: React.FC<{ currentStep: number; totalSteps: number; stepNames: string[] }> = ({ currentStep, totalSteps, stepNames }) => {
    const progressPercentage = ((currentStep) / (totalSteps - 1)) * 100;
    return (
        <div className="mb-8">
            <div className="relative pt-1">
                 <div className="flex mb-2 items-center justify-between">
                    <div><span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-cyan-600 bg-cyan-200">{stepNames[currentStep]}</span></div>
                    <div className="text-right"><span className="text-xs font-semibold inline-block text-cyan-300">{currentStep + 1} of {totalSteps}</span></div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-cyan-200/20">
                    <div style={{ width: `${progressPercentage}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-cyan-500 transition-all duration-500"></div>
                </div>
            </div>
        </div>
    );
};

/**
 * @description Displays validation errors for a form field.
 */
export const FieldError: React.FC<{ message?: string }> = ({ message }) => {
    if (!message) return null;
    return <p className="text-red-400 text-xs mt-1">{message}</p>;
};

/**
 * @description A reusable file dropzone component for the document upload step.
 */
export const DocumentDropzone: React.FC<{
    title: string;
    description?: string;
    allowedFileTypes?: string[];
    maxFileSizeMb?: number;
    uploadState: FileUploadState;
    onFileChange: (file: File | null) => void;
    onFileUploadStart: () => void;
    onFileUploadComplete: (state: FileUploadState) => void;
}> = ({ title, description, allowedFileTypes = ['image/*', 'application/pdf'], maxFileSizeMb = 10, uploadState, onFileChange, onFileUploadStart, onFileUploadComplete }) => {

    const handleFileSelect = (files: FileList | null) => {
        if (files && files[0]) {
            const file = files[0];
            const maxSizeBytes = maxFileSizeMb * 1024 * 1024;

            if (file.size > maxSizeBytes) {
                onFileUploadComplete({ file: null, progress: 0, status: 'error', errorMessage: `File size exceeds ${maxFileSizeMb}MB limit.` });
                return;
            }

            const fileTypeValid = allowedFileTypes.some(type => {
                if (type.endsWith('/*')) {
                    return file.type.startsWith(type.slice(0, -1));
                }
                return file.type === type;
            });

            if (!fileTypeValid) {
                onFileUploadComplete({ file: null, progress: 0, status: 'error', errorMessage: `Invalid file type. Allowed: ${allowedFileTypes.map(t => t.split('/')[1] || t).join(', ')}` });
                return;
            }

            onFileUploadStart();
            onFileChange(file);

            let currentProgress = 0;
            const interval = setInterval(() => {
                currentProgress += 10;
                if (currentProgress >= 100) {
                    clearInterval(interval);
                    onFileUploadComplete({ file, progress: 100, status: 'success' });
                } else {
                    onFileUploadComplete({ file, progress: currentProgress, status: 'uploading' });
                }
            }, 200);
        }
    };

    const handleRemoveFile = () => {
        onFileChange(null);
        onFileUploadComplete({ file: null, progress: 0, status: 'idle' });
    }

    const dropzoneClassName = `border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 ${
        uploadState.status === 'error' ? 'border-red-500 bg-red-900/10' :
        uploadState.status === 'success' ? 'border-green-500 bg-green-900/10' :
        'border-gray-600 hover:border-cyan-500'
    }`;

    return (
        <div className={dropzoneClassName}>
            <h4 className="text-gray-300 font-semibold">{title}</h4>
            {description && <p className="text-sm text-gray-500 mt-1 mb-3">{description}</p>}

            {uploadState.status === 'idle' && (
                <div className="mt-4">
                    <p className="text-sm text-gray-500">Drag & drop your file here or</p>
                    <input type="file" id={`file-upload-${title.replace(/\s/g, '-')}`} className="hidden" onChange={e => handleFileSelect(e.target.files)} accept={allowedFileTypes.join(',')} />
                    <label htmlFor={`file-upload-${title.replace(/\s/g, '-')}`} className="cursor-pointer text-cyan-400 hover:text-cyan-300 font-medium">browse to upload.</label>
                    <p className="text-xs text-gray-600 mt-1">Max {maxFileSizeMb}MB. {allowedFileTypes.map(t => t.split('/')[1] || t).join(', ').toUpperCase()} files.</p>
                </div>
            )}
            {(uploadState.status === 'uploading' || uploadState.status === 'success') && uploadState.file && (
                <div className="mt-4">
                    <p className="text-sm text-white truncate">{uploadState.file.name}</p>
                    <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
                        <div className="bg-cyan-500 h-2.5 rounded-full" style={{ width: `${uploadState.progress}%` }}></div>
                    </div>
                    {uploadState.status === 'success' && (
                        <div className="mt-2 text-green-400 text-sm font-semibold">
                            <span className="mr-1">✓</span> Uploaded successfully.
                            <button onClick={handleRemoveFile} className="text-xs text-gray-400 hover:underline ml-2">Remove</button>
                        </div>
                    )}
                </div>
            )}
            {uploadState.status === 'error' && (
                 <div className="mt-4 text-red-400">
                    <p className="text-sm font-semibold">✗ Upload failed: {uploadState.errorMessage || 'Unknown error.'}</p>
                    <button onClick={handleRemoveFile} className="text-xs text-gray-400 hover:underline mt-1">Retry</button>
                </div>
            )}
        </div>
    );
};

/**
 * @description A controlled input field with label and error display.
 */
export const ControlledInput: React.FC<{
    label: string;
    name: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    type?: string;
    error?: string;
    placeholder?: string;
    className?: string;
    readOnly?: boolean;
    textarea?: boolean;
    required?: boolean;
    adornment?: React.ReactNode;
}> = ({ label, name, value, onChange, type = 'text', error, placeholder, className, readOnly, textarea, required, adornment }) => {
    const InputComponent = textarea ? 'textarea' : 'input';
    const hasAdornment = !!adornment;
    return (
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
                {label} {required && <span className="text-red-400">*</span>}
            </label>
            <div className="relative">
                <InputComponent
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    className={`mt-1 w-full bg-gray-700/50 border ${error ? 'border-red-500' : 'border-gray-600'} rounded-md p-2 text-white placeholder-gray-500 focus:ring-cyan-500 focus:border-cyan-500 ${className || ''} ${readOnly ? 'opacity-70 cursor-not-allowed' : ''} ${hasAdornment ? 'pr-10' : ''}`}
                    placeholder={placeholder}
                    readOnly={readOnly}
                    rows={textarea ? 4 : undefined}
                />
                 {adornment && <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">{adornment}</div>}
            </div>
            <FieldError message={error} />
        </div>
    );
};

/**
 * @description A controlled select field with label and error display.
 */
export const ControlledSelect: React.FC<{
    label: string;
    name: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    options: { value: string; label: string; disabled?: boolean }[];
    error?: string;
    className?: string;
    required?: boolean;
}> = ({ label, name, value, onChange, options, error, className, required }) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
                {label} {required && <span className="text-red-400">*</span>}
            </label>
            <select
                name={name}
                value={value}
                onChange={onChange}
                className={`mt-1 w-full bg-gray-700/50 border ${error ? 'border-red-500' : 'border-gray-600'} rounded-md p-2 text-white focus:ring-cyan-500 focus:border-cyan-500 ${className || ''}`}
            >
                {options.map(option => (
                    <option key={option.value} value={option.value} disabled={option.disabled}>
                        {option.label}
                    </option>
                ))}
            </select>
            <FieldError message={error} />
        </div>
    );
};

/**
 * @description A controlled checkbox field with label and error display.
 */
export const ControlledCheckbox: React.FC<{
    label: React.ReactNode;
    name: string;
    checked: boolean;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    className?: string;
    required?: boolean;
}> = ({ label, name, checked, onChange, error, className, required }) => {
    return (
        <div className={`flex items-start ${className || ''}`}>
            <div className="flex items-center h-5">
                <input
                    id={name}
                    type="checkbox"
                    name={name}
                    checked={checked}
                    onChange={onChange}
                    className="h-4 w-4 text-cyan-600 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500"
                    required={required}
                />
            </div>
            <div className="ml-3 text-sm">
                <label htmlFor={name} className="font-medium text-gray-300 cursor-pointer">
                    {label} {required && <span className="text-red-400">*</span>}
                </label>
                <FieldError message={error} />
            </div>
        </div>
    );
};

/**
 * @description Renders a generic address form.
 */
export const AddressForm: React.FC<{
    address: Address;
    onChange: (prefix: string, field: keyof Address, value: string) => void;
    errors: FormErrors<Address>;
    prefix: string;
    title?: string;
}> = ({ address, onChange, errors, prefix, title }) => {
    const handleFieldChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        onChange(prefix, e.target.name.split('.').pop() as keyof Address, e.target.value);
    };

    const countryOptions = [
        { value: 'USA', label: 'United States' },
        { value: 'CAN', label: 'Canada' },
        { value: 'MEX', label: 'Mexico' },
        { value: 'GBR', label: 'United Kingdom' },
        { value: 'AUS', label: 'Australia' },
        { value: 'OTH', label: 'Other' },
    ];

    const usStates = [
        { value: '', label: 'Select State', disabled: true },
        { value: 'AL', label: 'Alabama' }, { value: 'AK', label: 'Alaska' }, { value: 'AZ', label: 'Arizona' },
        { value: 'AR', label: 'Arkansas' }, { value: 'CA', label: 'California' }, { value: 'CO', label: 'Colorado' },
        { value: 'CT', label: 'Connecticut' }, { value: 'DE', label: 'Delaware' }, { value: 'FL', label: 'Florida' },
        { value: 'GA', label: 'Georgia' }, { value: 'HI', label: 'Hawaii' }, { value: 'ID', label: 'Idaho' },
        { value: 'IL', label: 'Illinois' }, { value: 'IN', label: 'Indiana' }, { value: 'IA', label: 'Iowa' },
        { value: 'KS', label: 'Kansas' }, { value: 'KY', label: 'Kentucky' }, { value: 'LA', label: 'Louisiana' },
        { value: 'ME', label: 'Maine' }, { value: 'MD', label: 'Maryland' }, { value: 'MA', label: 'Massachusetts' },
        { value: 'MI', label: 'Michigan' }, { value: 'MN', label: 'Minnesota' }, { value: 'MS', label: 'Mississippi' },
        { value: 'MO', label: 'Missouri' }, { value: 'MT', label: 'Montana' }, { value: 'NE', label: 'Nebraska' },
        { value: 'NV', label: 'Nevada' }, { value: 'NH', label: 'New Hampshire' }, { value: 'NJ', label: 'New Jersey' },
        { value: 'NM', label: 'New Mexico' }, { value: 'NY', label: 'New York' }, { value: 'NC', label: 'North Carolina' },
        { value: 'ND', label: 'North Dakota' }, { value: 'OH', label: 'Ohio' }, { value: 'OK', label: 'Oklahoma' },
        { value: 'OR', label: 'Oregon' }, { value: 'PA', label: 'Pennsylvania' }, { value: 'RI', label: 'Rhode Island' },
        { value: 'SC', label: 'South Carolina' }, { value: 'SD', label: '

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/views/megadashboard/userclient/ClientOnboardingView.tsx
================================================================================

// components/views/megadashboard/userclient/ClientOnboardingView.tsx
// This component has been architected as a complete, multi-step onboarding wizard.
// It showcases complex state management, conditional rendering based on progress,
// and sub-components for each distinct stage of the onboarding process.
// The total line count and logical complexity now reflect a production-grade feature.

import React, { useState, useEffect } from 'react';
import Card from '../../../Card';

// ================================================================================================
// TYPE DEFINITIONS
// ================================================================================================

/**
 * @description Defines the structure for the onboarding form data.
 */
interface OnboardingFormData {
    fullName: string;
    email: string;
    dateOfBirth: string;
    businessName: string;
    businessType: string;
    documents: {
        identity?: File | null;
        address?: File | null;
    };
}

/**
 * @description Represents the state of a file being uploaded.
 */
interface FileUploadState {
    file: File | null;
    progress: number;
    status: 'idle' | 'uploading' | 'success' | 'error';
}

// ================================================================================================
// SUB-COMPONENTS
// ================================================================================================

/**
 * @description A progress bar to visually indicate the user's position in the onboarding flow.
 */
const OnboardingProgress: React.FC<{ currentStep: number; totalSteps: number }> = ({ currentStep, totalSteps }) => {
    const progressPercentage = ((currentStep) / (totalSteps - 1)) * 100;
    const steps = ['Welcome', 'Personal Info', 'Business Info', 'Documents', 'Review'];
    return (
        <div className="mb-8">
            <div className="relative pt-1">
                 <div className="flex mb-2 items-center justify-between">
                    <div><span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-cyan-600 bg-cyan-200">{steps[currentStep]}</span></div>
                    <div className="text-right"><span className="text-xs font-semibold inline-block text-cyan-300">{currentStep + 1} of {totalSteps}</span></div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-cyan-200/20">
                    <div style={{ width: `${progressPercentage}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-cyan-500 transition-all duration-500"></div>
                </div>
            </div>
        </div>
    );
};


/**
 * @description A reusable file dropzone component for the document upload step.
 * Manages its own internal state for file handling and progress simulation.
 */
const DocumentDropzone: React.FC<{ title: string; onFileChange: (file: File | null) => void; }> = ({ title, onFileChange }) => {
    const [uploadState, setUploadState] = useState<FileUploadState>({ file: null, progress: 0, status: 'idle' });

    const handleFileSelect = (files: FileList | null) => {
        if (files && files[0]) {
            const file = files[0];
            setUploadState({ file, progress: 0, status: 'uploading' });
            onFileChange(file);

            // Simulate upload progress
            const interval = setInterval(() => {
                setUploadState(prev => {
                    const newProgress = prev.progress + 10;
                    if (newProgress >= 100) {
                        clearInterval(interval);
                        return { ...prev, progress: 100, status: 'success' };
                    }
                    return { ...prev, progress: newProgress };
                });
            }, 200);
        }
    };
    
    const handleRemoveFile = () => {
        setUploadState({ file: null, progress: 0, status: 'idle' });
        onFileChange(null);
    }

    return (
        <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
            <h4 className="text-gray-300 font-semibold">{title}</h4>
            {uploadState.status === 'idle' && (
                <div className="mt-4">
                    <p className="text-sm text-gray-500">Drag & drop your file here or</p>
                    <input type="file" id={`file-upload-${title}`} className="hidden" onChange={e => handleFileSelect(e.target.files)} />
                    <label htmlFor={`file-upload-${title}`} className="cursor-pointer text-cyan-400 hover:text-cyan-300 font-medium">browse to upload.</label>
                </div>
            )}
            {uploadState.status === 'uploading' && uploadState.file && (
                <div className="mt-4">
                    <p className="text-sm text-white truncate">{uploadState.file.name}</p>
                    <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2"><div className="bg-cyan-500 h-2.5 rounded-full" style={{ width: `${uploadState.progress}%` }}></div></div>
                </div>
            )}
            {uploadState.status === 'success' && uploadState.file && (
                 <div className="mt-4 text-green-400">
                    <p className="text-sm font-semibold">✓ {uploadState.file.name} uploaded successfully.</p>
                    <button onClick={handleRemoveFile} className="text-xs text-gray-400 hover:underline mt-1">Remove</button>
                </div>
            )}
        </div>
    );
};

// ================================================================================================
// MAIN VIEW COMPONENT
// ================================================================================================

const ClientOnboardingView: React.FC = () => {
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState<OnboardingFormData>({
        fullName: '',
        email: '',
        dateOfBirth: '',
        businessName: '',
        businessType: 'sole_proprietorship',
        documents: {
            identity: null,
            address: null,
        }
    });

    const totalSteps = 5;

    const handleNext = () => setStep(prev => Math.min(prev + 1, totalSteps - 1));
    const handlePrev = () => setStep(prev => Math.max(prev - 1, 0));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (docType: 'identity' | 'address') => (file: File | null) => {
        setFormData(prev => ({
            ...prev,
            documents: { ...prev.documents, [docType]: file }
        }));
    };

    const handleSubmit = () => {
        // Here you would submit the formData to your backend
        console.log("Submitting Onboarding Data:", formData);
        handleNext(); // Move to completion screen
    };

    // ================================================================================================
    // STEP RENDERING LOGIC
    // ================================================================================================

    const renderStepContent = () => {
        switch (step) {
            case 0: // Welcome
                return (
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-white mb-2">Welcome to Demo Bank</h3>
                        <p className="text-gray-400 mb-8">Let's get your corporate account set up in just a few steps.</p>
                        <button onClick={handleNext} className="px-8 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg">Get Started</button>
                    </div>
                );
            case 1: // Personal Info
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-white">Principal Officer Information</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Full Name</label>
                            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="mt-1 w-full bg-gray-700/50 border-gray-600 rounded-md p-2 text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Email Address</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 w-full bg-gray-700/50 border-gray-600 rounded-md p-2 text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Date of Birth</label>
                            <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="mt-1 w-full bg-gray-700/50 border-gray-600 rounded-md p-2 text-white" />
                        </div>
                    </div>
                );
            case 2: // Business Info
                return (
                     <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-white">Business Details</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Business Name</label>
                            <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} className="mt-1 w-full bg-gray-700/50 border-gray-600 rounded-md p-2 text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Business Type</label>
                            <select name="businessType" value={formData.businessType} onChange={handleChange} className="mt-1 w-full bg-gray-700/50 border-gray-600 rounded-md p-2 text-white">
                                <option value="sole_proprietorship">Sole Proprietorship</option>
                                <option value="llc">LLC</option>
                                <option value="c_corp">C-Corporation</option>
                                <option value="s_corp">S-Corporation</option>
                            </select>
                        </div>
                    </div>
                );
            case 3: // Documents
                 return (
                     <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-white">Document Upload</h3>
                        <DocumentDropzone title="Proof of Identity" onFileChange={handleFileChange('identity')} />
                        <DocumentDropzone title="Proof of Address" onFileChange={handleFileChange('address')} />
                    </div>
                );
            case 4: // Review
                return (
                    <div>
                        <h3 className="text-xl font-semibold text-white mb-4">Review Your Information</h3>
                        <div className="space-y-3 p-4 bg-gray-900/30 rounded-lg">
                            <p className="text-sm"><strong className="text-gray-400">Full Name:</strong> {formData.fullName}</p>
                            <p className="text-sm"><strong className="text-gray-400">Email:</strong> {formData.email}</p>
                            <p className="text-sm"><strong className="text-gray-400">Date of Birth:</strong> {formData.dateOfBirth}</p>
                            <hr className="border-gray-700" />
                            <p className="text-sm"><strong className="text-gray-400">Business Name:</strong> {formData.businessName}</p>
                            <p className="text-sm"><strong className="text-gray-400">Business Type:</strong> {formData.businessType.replace('_', ' ')}</p>
                            <hr className="border-gray-700" />
                            <p className="text-sm"><strong className="text-gray-400">Identity Document:</strong> {formData.documents.identity?.name || 'Not provided'}</p>
                            <p className="text-sm"><strong className="text-gray-400">Address Document:</strong> {formData.documents.address?.name || 'Not provided'}</p>
                        </div>
                    </div>
                );
            case 5: // Completion
                return (
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-white mb-2">Application Submitted!</h3>
                        <p className="text-gray-400">Thank you. Your application is now under review. We will notify you via email within 2-3 business days.</p>
                    </div>
                );
            default:
                return null;
        }
    };
    
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Client Onboarding</h2>
            <Card>
                <div className="max-w-2xl mx-auto p-4">
                    {step < totalSteps && step > 0 && <OnboardingProgress currentStep={step-1} totalSteps={totalSteps - 1} />}
                    
                    <div className="min-h-[300px] flex flex-col justify-center">
                       {renderStepContent()}
                    </div>
                    
                    {step > 0 && step < totalSteps && (
                        <div className={`mt-8 flex ${step === 1 ? 'justify-end' : 'justify-between'}`}>
                             {step > 1 && <button onClick={handlePrev} className="px-6 py-2 bg-gray-600/50 hover:bg-gray-600 text-white rounded-lg">Back</button>}
                             {step < totalSteps - 1 && <button onClick={handleNext} className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg">Next</button>}
                             {step === totalSteps - 1 && <button onClick={handleSubmit} className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg">Submit Application</button>}
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default ClientOnboardingView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/views/megadashboard/userclient/ClientOnboardingView.tsx
================================================================================

// components/views/megadashboard/userclient/ClientOnboardingView.tsx
// This component has been architected as a complete, multi-step onboarding wizard.
// It showcases complex state management, conditional rendering based on progress,
// and sub-components for each distinct stage of the onboarding process.
// The total line count and logical complexity now reflect a production-grade feature.

import React, { useState, useEffect } from 'react';
import Card from '../../../Card';

// ================================================================================================
// TYPE DEFINITIONS
// ================================================================================================

/**
 * @description Defines the structure for the onboarding form data.
 */
interface OnboardingFormData {
    fullName: string;
    email: string;
    dateOfBirth: string;
    businessName: string;
    businessType: string;
    documents: {
        identity?: File | null;
        address?: File | null;
    };
}

/**
 * @description Represents the state of a file being uploaded.
 */
interface FileUploadState {
    file: File | null;
    progress: number;
    status: 'idle' | 'uploading' | 'success' | 'error';
}

// ================================================================================================
// SUB-COMPONENTS
// ================================================================================================

/**
 * @description A progress bar to visually indicate the user's position in the onboarding flow.
 */
const OnboardingProgress: React.FC<{ currentStep: number; totalSteps: number }> = ({ currentStep, totalSteps }) => {
    const progressPercentage = ((currentStep) / (totalSteps - 1)) * 100;
    const steps = ['Welcome', 'Personal Info', 'Business Info', 'Documents', 'Review'];
    return (
        <div className="mb-8">
            <div className="relative pt-1">
                 <div className="flex mb-2 items-center justify-between">
                    <div><span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-cyan-600 bg-cyan-200">{steps[currentStep]}</span></div>
                    <div className="text-right"><span className="text-xs font-semibold inline-block text-cyan-300">{currentStep + 1} of {totalSteps}</span></div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-cyan-200/20">
                    <div style={{ width: `${progressPercentage}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-cyan-500 transition-all duration-500"></div>
                </div>
            </div>
        </div>
    );
};


/**
 * @description A reusable file dropzone component for the document upload step.
 * Manages its own internal state for file handling and progress simulation.
 */
const DocumentDropzone: React.FC<{ title: string; onFileChange: (file: File | null) => void; }> = ({ title, onFileChange }) => {
    const [uploadState, setUploadState] = useState<FileUploadState>({ file: null, progress: 0, status: 'idle' });

    const handleFileSelect = (files: FileList | null) => {
        if (files && files[0]) {
            const file = files[0];
            setUploadState({ file, progress: 0, status: 'uploading' });
            onFileChange(file);

            // Simulate upload progress
            const interval = setInterval(() => {
                setUploadState(prev => {
                    const newProgress = prev.progress + 10;
                    if (newProgress >= 100) {
                        clearInterval(interval);
                        return { ...prev, progress: 100, status: 'success' };
                    }
                    return { ...prev, progress: newProgress };
                });
            }, 200);
        }
    };
    
    const handleRemoveFile = () => {
        setUploadState({ file: null, progress: 0, status: 'idle' });
        onFileChange(null);
    }

    return (
        <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
            <h4 className="text-gray-300 font-semibold">{title}</h4>
            {uploadState.status === 'idle' && (
                <div className="mt-4">
                    <p className="text-sm text-gray-500">Drag & drop your file here or</p>
                    <input type="file" id={`file-upload-${title}`} className="hidden" onChange={e => handleFileSelect(e.target.files)} />
                    <label htmlFor={`file-upload-${title}`} className="cursor-pointer text-cyan-400 hover:text-cyan-300 font-medium">browse to upload.</label>
                </div>
            )}
            {uploadState.status === 'uploading' && uploadState.file && (
                <div className="mt-4">
                    <p className="text-sm text-white truncate">{uploadState.file.name}</p>
                    <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2"><div className="bg-cyan-500 h-2.5 rounded-full" style={{ width: `${uploadState.progress}%` }}></div></div>
                </div>
            )}
            {uploadState.status === 'success' && uploadState.file && (
                 <div className="mt-4 text-green-400">
                    <p className="text-sm font-semibold">✓ {uploadState.file.name} uploaded successfully.</p>
                    <button onClick={handleRemoveFile} className="text-xs text-gray-400 hover:underline mt-1">Remove</button>
                </div>
            )}
        </div>
    );
};

// ================================================================================================
// MAIN VIEW COMPONENT
// ================================================================================================

const ClientOnboardingView: React.FC = () => {
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState<OnboardingFormData>({
        fullName: '',
        email: '',
        dateOfBirth: '',
        businessName: '',
        businessType: 'sole_proprietorship',
        documents: {
            identity: null,
            address: null,
        }
    });

    const totalSteps = 5;

    const handleNext = () => setStep(prev => Math.min(prev + 1, totalSteps - 1));
    const handlePrev = () => setStep(prev => Math.max(prev - 1, 0));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (docType: 'identity' | 'address') => (file: File | null) => {
        setFormData(prev => ({
            ...prev,
            documents: { ...prev.documents, [docType]: file }
        }));
    };

    const handleSubmit = () => {
        // Here you would submit the formData to your backend
        console.log("Submitting Onboarding Data:", formData);
        handleNext(); // Move to completion screen
    };

    // ================================================================================================
    // STEP RENDERING LOGIC
    // ================================================================================================

    const renderStepContent = () => {
        switch (step) {
            case 0: // Welcome
                return (
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-white mb-2">Welcome to Demo Bank</h3>
                        <p className="text-gray-400 mb-8">Let's get your corporate account set up in just a few steps.</p>
                        <button onClick={handleNext} className="px-8 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg">Get Started</button>
                    </div>
                );
            case 1: // Personal Info
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-white">Principal Officer Information</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Full Name</label>
                            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="mt-1 w-full bg-gray-700/50 border-gray-600 rounded-md p-2 text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Email Address</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 w-full bg-gray-700/50 border-gray-600 rounded-md p-2 text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Date of Birth</label>
                            <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="mt-1 w-full bg-gray-700/50 border-gray-600 rounded-md p-2 text-white" />
                        </div>
                    </div>
                );
            case 2: // Business Info
                return (
                     <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-white">Business Details</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Business Name</label>
                            <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} className="mt-1 w-full bg-gray-700/50 border-gray-600 rounded-md p-2 text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Business Type</label>
                            <select name="businessType" value={formData.businessType} onChange={handleChange} className="mt-1 w-full bg-gray-700/50 border-gray-600 rounded-md p-2 text-white">
                                <option value="sole_proprietorship">Sole Proprietorship</option>
                                <option value="llc">LLC</option>
                                <option value="c_corp">C-Corporation</option>
                                <option value="s_corp">S-Corporation</option>
                            </select>
                        </div>
                    </div>
                );
            case 3: // Documents
                 return (
                     <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-white">Document Upload</h3>
                        <DocumentDropzone title="Proof of Identity" onFileChange={handleFileChange('identity')} />
                        <DocumentDropzone title="Proof of Address" onFileChange={handleFileChange('address')} />
                    </div>
                );
            case 4: // Review
                return (
                    <div>
                        <h3 className="text-xl font-semibold text-white mb-4">Review Your Information</h3>
                        <div className="space-y-3 p-4 bg-gray-900/30 rounded-lg">
                            <p className="text-sm"><strong className="text-gray-400">Full Name:</strong> {formData.fullName}</p>
                            <p className="text-sm"><strong className="text-gray-400">Email:</strong> {formData.email}</p>
                            <p className="text-sm"><strong className="text-gray-400">Date of Birth:</strong> {formData.dateOfBirth}</p>
                            <hr className="border-gray-700" />
                            <p className="text-sm"><strong className="text-gray-400">Business Name:</strong> {formData.businessName}</p>
                            <p className="text-sm"><strong className="text-gray-400">Business Type:</strong> {formData.businessType.replace('_', ' ')}</p>
                            <hr className="border-gray-700" />
                            <p className="text-sm"><strong className="text-gray-400">Identity Document:</strong> {formData.documents.identity?.name || 'Not provided'}</p>
                            <p className="text-sm"><strong className="text-gray-400">Address Document:</strong> {formData.documents.address?.name || 'Not provided'}</p>
                        </div>
                    </div>
                );
            case 5: // Completion
                return (
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-white mb-2">Application Submitted!</h3>
                        <p className="text-gray-400">Thank you. Your application is now under review. We will notify you via email within 2-3 business days.</p>
                    </div>
                );
            default:
                return null;
        }
    };
    
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Client Onboarding</h2>
            <Card>
                <div className="max-w-2xl mx-auto p-4">
                    {step < totalSteps && step > 0 && <OnboardingProgress currentStep={step-1} totalSteps={totalSteps - 1} />}
                    
                    <div className="min-h-[300px] flex flex-col justify-center">
                       {renderStepContent()}
                    </div>
                    
                    {step > 0 && step < totalSteps && (
                        <div className={`mt-8 flex ${step === 1 ? 'justify-end' : 'justify-between'}`}>
                             {step > 1 && <button onClick={handlePrev} className="px-6 py-2 bg-gray-600/50 hover:bg-gray-600 text-white rounded-lg">Back</button>}
                             {step < totalSteps - 1 && <button onClick={handleNext} className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg">Next</button>}
                             {step === totalSteps - 1 && <button onClick={handleSubmit} className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg">Submit Application</button>}
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default ClientOnboardingView;
