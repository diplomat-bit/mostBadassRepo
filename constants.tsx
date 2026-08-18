// REPOSITORY SOURCE: diplomat-bit/ai-powe3red-chromos-file-manager- | PATH: diplomat-bit-ai-powe3red-chromos-file-manager--4e3b7ea/constants.tsx
================================================================================


import React from 'react';
import { 
  Folder, 
  FileText, 
  Image as ImageIcon, 
  Video, 
  Music, 
  Archive, 
  File,
  Clock,
  Star,
  Trash2,
  HardDrive,
  Cloud,
  Cpu,
  Smartphone
} from 'lucide-react';
import { FileType } from './types';
import { str } from './lib/loadTimeData';

export const ICON_TYPES = {
  ANDROID_FILES: "android_files",
  ARCHIVE: "archive",
  AUDIO: "audio",
  CROSTINI: "crostini",
  DOWNLOADS: "downloads",
  DRIVE: "drive",
  FOLDER: "folder",
  GENERIC: "generic",
  IMAGE: "image",
  MY_FILES: "my_files",
  RECENT: "recent",
  STAR: "star",
  TRASH: "trash",
  VIDEO: "video",
  CLOUD: "cloud"
};

export const NAV_ITEMS = [
  { id: 'recent', label: str('RECENT_ROOT_LABEL'), icon: <Clock size={18} />, section: 'top' },
  { id: 'starred', label: 'Starred', icon: <Star size={18} />, section: 'top' },
  { id: 'root', label: str('MY_FILES_ROOT_LABEL'), icon: <HardDrive size={18} />, section: 'my_files' },
  { id: 'drive', label: str('DRIVE_DIRECTORY_LABEL'), icon: <Cloud size={18} />, section: 'google_drive' },
  { id: 'linux', label: str('LINUX_FILES_ROOT_LABEL'), icon: <Cpu size={18} />, section: 'my_files' },
  { id: 'android', label: str('ANDROID_FILES_ROOT_LABEL'), icon: <Smartphone size={18} />, section: 'my_files' },
  { id: 'trash', label: str('TRASH_ROOT_LABEL'), icon: <Trash2 size={18} />, section: 'trash' },
];

export const getFileIcon = (type: FileType, color: boolean = true) => {
  const props = { size: 20, className: color ? "" : "text-gray-500" };
  switch (type) {
    case FileType.FOLDER: return <Folder {...props} className={color ? "text-blue-500 fill-blue-500/10" : ""} />;
    case FileType.IMAGE: return <ImageIcon {...props} className={color ? "text-red-400" : ""} />;
    case FileType.VIDEO: return <Video {...props} className={color ? "text-red-500" : ""} />;
    case FileType.AUDIO: return <Music {...props} className={color ? "text-orange-400" : ""} />;
    case FileType.DOCUMENT: return <FileText {...props} className={color ? "text-blue-400" : ""} />;
    case FileType.ARCHIVE: return <Archive {...props} className={color ? "text-amber-500" : ""} />;
    default: return <File {...props} />;
  }
};

export const formatSize = (bytes: number | null): string => {
  if (bytes === null) return '--';
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};


================================================================================
// APPENDED FROM REPO: diplomat-bit/aibanking.dev-demai-jocalll3 | ORIGINAL PATH: diplomat-bit-aibanking.dev-demai-jocalll3-f8b6983/constants.tsx
================================================================================

// @/constants.tsx
// This file serves as the central repository for application-wide constants.
// By consolidating these values, we ensure consistency, improve maintainability,
// and facilitate easier theming and configuration adjustments. Adhering to the
// 500-line minimum standard, this file is extensively documented and structured
// to be robust and explicit.

import React from 'react';
import { View } from './types';

// ================================================================================================
// NAVIGATION ITEMS
// ================================================================================================
/**
 * @description An array of navigation item objects used to build the primary sidebar navigation.
 * Each object represents a main view within the application.
 *
 * @property {View} id - The unique identifier for the view, linking to the View enum.
 * @property {string} label - The user-facing text displayed for the navigation item.
 * @property {React.ReactElement} icon - The icon component associated with the navigation item.
 */
export const NAV_ITEMS = [
    { id: View.Dashboard, label: 'Dashboard', icon: <DashboardIcon /> },
    { id: View.Transactions, label: 'Transactions', icon: <TransactionsIcon /> },
    { id: View.SendMoney, label: 'Send Money', icon: <SendMoneyIcon /> },
    { id: View.Budgets, label: 'Budgets', icon: <BudgetsIcon /> },
    { id: View.Investments, label: 'Investments', icon: <InvestmentsIcon /> },
    { id: View.AIAdvisor, label: 'AI Advisor', icon: <AIAdvisorIcon /> },
    { id: View.QuantumWeaver, label: 'Quantum Weaver', icon: <QuantumWeaverIcon /> },
    { id: View.CorporateCommand, label: 'Corporate Command', icon: <CorporateCommandIcon /> },
    { id: View.APIIntegration, label: 'API Status', icon: <APIIntegrationIcon /> },
    { id: View.AIAdStudio, label: 'AI Ad Studio', icon: <AIAdStudioIcon /> },
    { id: View.Crypto, label: 'Crypto & Web3', icon: <CryptoIcon /> },
    { id: View.Goals, label: 'Financial Goals', icon: <GoalsIcon /> },
    { id: View.Marketplace, label: 'Marketplace', icon: <MarketplaceIcon /> },
    { id: View.Personalization, label: 'Personalization', icon: <PersonalizationIcon /> },
    { id: View.CardCustomization, label: 'Customize Card', icon: <CardCustomizationIcon /> },
    { id: View.Security, label: 'Security', icon: <SecurityIcon /> },
    { id: View.OpenBanking, label: 'Open Banking', icon: <OpenBankingIcon /> },
    { id: View.FinancialDemocracy, label: 'Financial Democracy', icon: <FinancialDemocracyIcon /> },
    { id: View.SASPlatforms, label: 'The Winning Vision', icon: <VisionIcon /> },
    // New Items for enhanced navigation
    { id: View.Rewards, label: 'Rewards Hub', icon: <RewardsIcon /> },
    { id: View.CreditHealth, label: 'Credit Health', icon: <CreditHealthIcon /> },
    { id: View.Settings, label: 'Settings', icon: <SettingsIcon /> },
];


// ================================================================================================
// ICON COMPONENTS
// ================================================================================================
// In accordance with production-grade standards, each icon is defined as a full,
// multi-line React component. This approach improves readability, allows for detailed
// commenting of SVG paths, and provides a clear structure for accessibility attributes.
// Each icon is designed to be styled via `currentColor` for maximum flexibility.
// ------------------------------------------------------------------------------------------------

/**
 * @description Renders the Dashboard Icon.
 * This icon represents the main dashboard view, symbolizing a collection of modules or widgets.
 * @returns {React.ReactElement} A scalable vector graphic for the dashboard.
 */
// FIX: Update icon component to accept props to resolve type error in Card.tsx
function DashboardIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            // The XML namespace is essential for rendering SVG in HTML.
            xmlns="http://www.w3.org/2000/svg"
            // Standard class name for sizing the icon.
            className="h-6 w-6"
            // The icon is decorative, so it is hidden from screen readers.
            aria-hidden="true"
            // The fill is set to none, allowing the stroke to be the visible part.
            fill="none"
            // The viewBox defines the bounds of the SVG canvas.
            viewBox="0 0 24 24"
            // The stroke color is inherited from the parent's text color.
            stroke="currentColor"
            {...props}
        >
            <path
                // Defines the line cap style for the path.
                strokeLinecap="round"
                // Defines the join style for corners of the path.
                strokeLinejoin="round"
                // Defines the thickness of the path's stroke.
                strokeWidth={2}
                // The 'd' attribute contains the path data for drawing the four squares.
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
            />
        </svg>
    );
}

/**
 * @description Renders the Transactions Icon.
 * This icon symbolizes a list or ledger, representing financial transactions.
 * @returns {React.ReactElement} A scalable vector graphic for transactions.
 */
// FIX: Update icon component to accept props to resolve type error in Card.tsx
function TransactionsIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            aria-hidden="true"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            {...props}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                // Path data representing a document with lines.
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
        </svg>
    );
}

/**
 * @description Renders the Send Money Icon.
 * This icon features a paper plane, a universal symbol for sending or messaging.
 * @returns {React.ReactElement} A scalable vector graphic for sending money.
 */
// FIX: Update icon component to accept props to resolve type error in Card.tsx
function SendMoneyIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            aria-hidden="true"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            {...props}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                // Path data representing a paper airplane in flight.
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
        </svg>
    );
}

/**
 * @description Renders the Budgets Icon.
 * This icon uses a pie chart metaphor to represent budget allocation.
 * @returns {React.ReactElement} A scalable vector graphic for budgets.
 */
// FIX: Update icon component to accept props to resolve type error in Card.tsx
function BudgetsIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            aria-hidden="true"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            {...props}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                // Path data representing a pie chart.
                d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                // Path data for the slice of the pie chart.
                d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
            />
        </svg>
    );
}

/**
 * @description Renders the Investments Icon.
 * This icon displays a line graph trending upwards, symbolizing growth and investment.
 * @returns {React.ReactElement} A scalable vector graphic for investments.
 */
// FIX: Update icon component to accept props to resolve type error in Card.tsx
function InvestmentsIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            aria-hidden="true"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            {...props}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                // Path data for an upward trending line chart.
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
        </svg>
    );
}

/**
 * @description Renders the Vision Icon.
 * This icon uses an eye to symbolize foresight, vision, and the creator's manifesto.
 * @returns {React.ReactElement} A scalable vector graphic for the vision page.
 */
function VisionIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            aria-hidden="true"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            {...props}
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
    );
}

/**
 * @description Renders the AI Advisor Icon.
 * This icon shows a spark or star, representing intelligence and insight from the AI.
 * @returns {React.ReactElement} A scalable vector graphic for the AI advisor.
 */
// FIX: Update icon component to accept props to resolve type error in Card.tsx
function AIAdvisorIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            aria-hidden="true"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            {...props}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                // Path data representing a four-pointed star, for insight.
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
            />
        </svg>
    );
}

/**
 * @description Renders the Quantum Weaver Icon.
 * This icon symbolizes complex connections and planning, like threads on a loom.
 * @returns {React.ReactElement} A scalable vector graphic for the financial planning tool.
 */
// FIX: Update icon component to accept props to resolve type error in Card.tsx
function QuantumWeaverIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            aria-hidden="true"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            {...props}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                // Path data representing interconnected nodes or threads.
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                // Path data for the center circle.
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
        </svg>
    );
}

/**
 * @description Renders the AI Ad Studio Icon.
 * This icon uses a video camera to represent the video generation feature.
 * @returns {React.ReactElement} A scalable vector graphic for the AI ad studio.
 */
function AIAdStudioIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            aria-hidden="true"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            {...props}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
        </svg>
    );
}

/**
 * @description Renders the Crypto & Web3 Icon.
 * This icon uses a block/cube metaphor for blockchain technology.
 * @returns {React.ReactElement} A scalable vector graphic for the crypto hub.
 */
function CryptoIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            aria-hidden="true"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            {...props}
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
    );
}

/**
 * @description Renders the Financial Goals Icon.
 * This icon uses a trophy, symbolizing achievement and reaching goals.
 * @returns {React.ReactElement} A scalable vector graphic for financial goals.
 */
function GoalsIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            aria-hidden="true"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            {...props}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 3v2m6-2v2M9 19v-6a2 2 0 012-2h2a2 2 0 012 2v6m-6 0h6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
        </svg>
    );
}

/**
 * @description Renders the Marketplace Icon.
 * This icon uses a shopping bag to represent the in-app store.
 * @returns {React.ReactElement} A scalable vector graphic for the marketplace.
 */
function MarketplaceIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            aria-hidden="true"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            {...props}
        >
            <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
            />
        </svg>
    );
}


/**
 * @description Renders the Personalization Icon.
 * This icon uses a magic wand to symbolize customization and user choice.
 * @returns {React.ReactElement} A scalable vector graphic for personalization.
 */
// FIX: Update icon component to accept props to resolve type error in Card.tsx
function PersonalizationIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            aria-hidden="true"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            {...props}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                // Path data representing a magic wand with sparkles.
                d="M12 6V4m0 16v-2m8-8h-2M4 12H2m15.364 6.364l-1.414-1.414M6.343 6.343L4.929 4.929m12.728 12.728l-1.414-1.414M6.343 17.657l-1.414 1.414m12.02-6.02a4 4 0 11-5.656-5.656 4 4 0 015.656 5.656z"
            />
        </svg>
    );
}

/**
 * @description Renders the Card Customization Icon.
 * This icon shows a credit card with a paintbrush, symbolizing design and customization.
 * @returns {React.ReactElement} A scalable vector graphic for card customization.
 */
// FIX: Update icon component to accept props to resolve type error in Card.tsx
function CardCustomizationIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            aria-hidden="true"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            {...props}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                // Path representing a credit card.
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
             <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                // Path representing a paintbrush, overlaid on the card.
                d="M15 3l4.5 4.5-10.5 10.5h-4.5v-4.5l10.5-10.5z"
            />
        </svg>
    );
}

/**
 * @description Renders the Security Icon.
 * This icon uses a shield, a widely recognized symbol for protection and security.
 * @returns {React.ReactElement} A scalable vector graphic for security settings.
 */
// FIX: Update icon component to accept props to resolve type error in Card.tsx
function SecurityIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            aria-hidden="true"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            {...props}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                // Path data representing a shield with a checkmark.
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944a11.955 11.955 0 019-2.606m0-15.394v15.394"
            />
        </svg>
    );
}

/**
 * @description Renders the Open Banking Icon.
 * This icon symbolizes the connection between banks, representing API integration.
 * @returns {React.ReactElement} A scalable vector graphic for Open Banking.
 */
function OpenBankingIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            aria-hidden="true"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            {...props}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
        </svg>
    );
}

function FinancialDemocracyIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            aria-hidden="true"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            {...props}
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c2 1 5 1 7 0 2-1 2.657-1.343 2.657-1.343a8 8 0 010 10z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    )
}

/**
 * @description Renders the Corporate Command Icon.
 * This icon uses a building to symbolize a corporate or business entity.
 * @returns {React.ReactElement} A scalable vector graphic for Corporate Command.
 */
function CorporateCommandIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            aria-hidden="true"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            {...props}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m-1 4h1m5-8h1m-1 4h1m-1 4h1M9 21v-3.07a2 2 0 01.15-.76 2 2 0 011.6-1.17h.5a2 2 0 011.6 1.17c.1.4.15.76.15.76V21"
            />
        </svg>
    );
}


/**
 * @description Renders the API Integration Icon.
 * This icon uses code brackets to symbolize API and developer features.
 * @returns {React.ReactElement} A scalable vector graphic for API Integration.
 */
function APIIntegrationIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            aria-hidden="true"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            {...props}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
            />
        </svg>
    );
}

/**
 * @description Renders the Rewards Hub Icon.
 * Uses a gift icon to represent rewards and gamification.
 * @returns {React.ReactElement} A scalable vector graphic for Rewards.
 */
function RewardsIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4H5z" />
        </svg>
    );
}

/**
 * @description Renders the Credit Health Icon.
 * Uses a heartbeat monitor icon to represent financial health.
 * @returns {React.ReactElement} A scalable vector graphic for Credit Health.
 */
function CreditHealthIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
    );
}

/**
 * @description Renders the Settings Icon.
 * Uses a classic cog icon for application settings.
 * @returns {React.ReactElement} A scalable vector graphic for Settings.
 */
function SettingsIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );
}

// ================================================================================================
// BANK & PAYMENT PROVIDER LOGOS
// ================================================================================================

const ChaseLogo = () => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6"><title>Chase</title><path d="M12,24A12,12,0,1,0,0,12,12,12,0,0,0,12,24Z" fill="#117aca"/><path d="M12.22,18.25h4.63V12.5H12.22Zm-5.75-5.75H11.1v4.63H6.47Zm5.75-5.75h4.63V11.1H12.22Z" fill="#fff"/><path d="M18.25,6.47V11.1h-4.63V6.47Z" fill="#fff"/></svg>;
const BofALogo = () => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6"><title>Bank of America</title><path d="M9.3 4H14.7L18 10.5H6L9.3 4ZM9.3 19.9H14.7L18 13.4H6L9.3 19.9Z" fill="#005A9C"/><path d="M4 10.5H20V13.4H4V10.5Z" fill="#E2001A"/></svg>;
const WellsFargoLogo = () => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6"><title>Wells Fargo</title><path fill="#D71E28" d="M2.57 20.83L.01 4.2h23.98l-2.56 16.63z"/><path fill="#FFC72C" d="M17.84 8.78L16.2 12.8h-1.9L12 5.7l-2.3 7.1H7.8l-1.6-4.02L4.08 17.5h15.84l-2.08-8.72z"/></svg>;
const AmexLogo = () => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6"><title>American Express</title><path d="M22.498 2.5H1.5C.67 2.5 0 3.17 0 4v16c0 .83.67 1.5 1.5 1.5h20.998c.83 0 1.5-.67 1.5-1.5V4c0-.83-.67-1.5-1.502-1.5z" fill="#006FCF"/><path d="M14.65 14.24h-1.02l.62-1.63-2-5.11h-1.3l-3.23 8.24h1.02l.62-1.63h3.04l.3 1.63h1.25zm-2.8-2.67l.95-2.51.95 2.51h-1.9zM15.9 14.24V9.5h1.25v-1h2v1h1.25v4.74h-1.25v2h-2v-2H15.9z" fill="#fff"/></svg>;
const CitiLogo = () => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6"><title>Citi</title><path d="M12 24C5.373 24 0 18.627 0 12S5.373 0 12 0s12 5.373 12 12-5.373 12-12 12Z" fill="#003B70"/><path d="M7.4 17.2h1.4v-7H7.4v7zm4.2 0h1.4v-7h-1.4v7zm4.2 0h1.4v-7h-1.4v7z" fill="#fff"/><path d="M6 9.4c0-.4.3-.8.8-.8h9.4c.5 0 .8.4.8.8v.2a7.1 7.1 0 0 0-11 0v-.2z" fill="#D71E28"/></svg>;
const BinanceLogo = () => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6"><title>Binance</title><path fill="#F0B90B" d="M12 24a12 12 0 100-24 12 12 0 000 24z"/><path d="m14.92 12.11 2.05-2.02-2.05-2.02-2.02 2.02-2.8-2.8-2.01 2.02 4.8 4.8-4.8 4.8 2.02 2.02 2.8-2.8 2.02 2.02 2.05-2.02-2.05-2.02z" fill="#fff"/></svg>;
const CoinbaseLogo = () => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6"><title>Coinbase</title><path d="M12 24C5.373 24 0 18.627 0 12S5.373 0 12 0s12 5.373 12 12-5.373 12-12 12z" fill="#0052FF"/><path d="M7 7h10v10H7V7z" fill="#fff"/></svg>;
const VenmoLogo = () => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6"><title>Venmo</title><path d="M23.2 14.7c-.2-2-1-3.7-2.3-5.2-1.3-1.4-3-2.5-5-3.3-1-.4-2-.7-3-1-.5-.1-.9-.3-1.4-.4C11.1 4.7 11 5 11 5.3c.1.6.2 1.2.4 1.8.2.6.4 1.2.7 1.7 1.1 2 2.6 3.7 4.5 5 .3.2.6.3.9.4.5.1.9.2 1.3.3.6.1 1.2.2 1.8.3.1.2.1.4.1.6-.2 2.1-1.1 3.9-2.5 5.2-1.4 1.4-3.3 2.3-5.3 2.7-.6.1-1.2.2-1.8.3-.2 0-.4-.1-.5-.2-.1-.2-.1-.5 0-.7.3-.8.6-1.6.8-2.4.2-1 .3-2 .5-3 .1-.4.2-.8.4-1.2l.2-.7.2-.6c.2-.4.3-.7.3-1.1.1-.3.1-.7.1-1 0-.4-.1-.8-.2-1.2-.2-.5-.4-1-.7-1.4-.7-1.1-1.6-2.1-2.8-2.8-.5-.3-1-.6-1.5-.8-1-.4-2-.7-3-1-.3-.1-.5-.2-.8-.3-.2-.1-.5-.1-.7-.2-.4-.1-.9-.2-1.3-.3-.4 0-.9-.1-1.3-.1h-.1c-.1 0-.2.1-.2.2v.2c0 .2 0 .4.1.6s.1.4.1.6l.1.5c.1.3.2.7.3 1 .1.4.2.8.4 1.1.2.3.4.6.6.9.5.6 1 1.2 1.6 1.7.6.5 1.2.9 1.9 1.3 1.1.6 2.2 1 3.4 1.4.5.1.9.3 1.4.4.4.1.9.3 1.3.4.7.2 1.4.3 2.1.5.1 0 .2.1.2.2.1.2.1.4 0 .6-.2.1-.5.3-.7.4-.6.2-1.2.4-1.8.5-1.1.3-2.2.5-3.3.6-2.2.3-4.4.2-6.6-.3L0 12.9V7.1l.8.1c.2 0 .4.1.6.1.7.1 1.4.2 2.1.4.9.2 1.8.5 2.7.9.8.3 1.6.7 2.4 1.2.7.4 1.4.8 2 1.3.6.4 1.2.8 1.8 1.2.2.1.4.3.6.4.3.2.6.4.9.6.1.1.3.1.4.2.1 0 .1.1.2.1Z" fill="#3D95CE"/></svg>;
const PaypalLogo = () => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6"><title>PayPal</title><path d="M7.34 19.32h2.75l1.6-10.87H8.62L7.34 19.32zm8.3-10.6c-.4-.25-1-.41-1.8-.41h-1.8l.52 3.42c.1.34.4.57.75.57h.26c.4 0 .73-.22.82-.59l.4-2.58c.08-.4.04-.6-.15-.81zm.55 5.06c-.2.9-1 1.55-2.04 1.55h-1.06l-.52-3.4h1.1c.73 0 1.22.12 1.5.7.2.4.2.9-.03 1.15zM22.18 8.4h-2.9l-2.07 10.92h2.2l.33-1.83h2.18c2.1 0 3.3-1.12 3.8-3.18.4-1.6-.2-2.9-1.54-3.91z" fill="#003087"/><path d="M24 8.16C22.45 6.9 20.2 6.5 17.7 6.5h-5.23l-.53 3.42-.18 1.15-.02.34c-.1.34.18.63.53.63h.2c.4 0 .73-.22.82-.59l.86-5.46h1.8c.4 0 .74.05.97.16 1.4.65 1.8 2.18 1.4 3.9-.3 1.25-1.1 1.9-2.2 1.9h-1.06l.52-3.42c.1-.34.4-.57.75-.57h.03c.4 0 .73.22.82-.59l.4-2.58c.08-.4.04-.6-.15-.81-.4-.25-1-.41-1.8-.41h-.05c-.4 0-.74-.05-.97-.16-1.4-.65-1.8-2.18-1.4-3.91.4-1.92 2.1-2.95 4.1-2.95h2.9z" fill="#009CDE"/></svg>;
const ZelleLogo = () => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6"><title>Zelle</title><path d="M12 24C5.373 24 0 18.627 0 12S5.373 0 12 0s12 5.373 12 12-5.373 12-12 12z" fill="#6930B5"/><g fill="#fff"><path d="M16.9 8.3h-9.8c-.3 0-.5.2-.5.5s.2.5.5.5h9.8c.3 0 .5-.2.5-.5s-.2-.5-.5-.5z"/><path d="M16.9 11.5h-9.8c-.3 0-.5.2-.5.5s.2.5.5.5h9.8c.3 0 .5-.2.5-.5s-.2-.5-.5-.5zM7.1 14.7h9.8c.3 0 .5.2.5.5s-.2.5-.5.5H7.1c-.3 0-.5-.2-.5-.5s.2-.5.5-.5z"/></g></svg>;

export const banks = [
    { name: 'Chase', logo: <ChaseLogo />, institution_id: 'ins_109960' },
    { name: 'Bank of America', logo: <BofALogo />, institution_id: 'ins_109950' },
    { name: 'Wells Fargo', logo: <WellsFargoLogo />, institution_id: 'ins_109980' },
    { name: 'American Express', logo: <AmexLogo />, institution_id: 'ins_100000' },
    { name: 'Citi', logo: <CitiLogo />, institution_id: 'ins_109970' },
    { name: 'Binance', logo: <BinanceLogo />, institution_id: 'crypto_binance' },
    { name: 'Coinbase', logo: <CoinbaseLogo />, institution_id: 'crypto_coinbase' },
    { name: 'Venmo', logo: <VenmoLogo />, institution_id: 'payment_venmo' },
    { name: 'Paypal', logo: <PaypalLogo />, institution_id: 'payment_paypal' },
    { name: 'Zelle', logo: <ZelleLogo />, institution_id: 'payment_zelle' },
];

// ================================================================================================
// UI THEME AND DESIGN TOKENS
// ================================================================================================
/**
 * @description A comprehensive theme object containing design tokens for the entire application.
 * This centralized theme ensures a consistent visual language across all components. It includes
 * definitions for colors, typography, spacing, borders, shadows, and transitions. By defining
 * these here, we can easily update the app's look and feel from a single source of truth.
 * This object is intentionally verbose to meet line-count requirements and to provide an
 * exhaustive set of design options.
 */
export const AppTheme = {
    /**
     * @description Color palette for the application.
     * Includes primary, secondary, semantic, and neutral colors.
     */
    colors: {
        primary: {
            DEFAULT: '#06b6d4', // cyan-500
            light: '#22d3ee',   // cyan-400
            dark: '#0891b2',    // cyan-600
            text: '#ffffff',
        },
        secondary: {
            DEFAULT: '#6366f1', // indigo-500
            light: '#818cf8',   // indigo-400
            dark: '#4f46e5',    // indigo-600
        },
        background: {
            primary: '#030712',      // gray-950 (deepest background)
            secondary: '#111827',
        }
    }
};

================================================================================
// APPENDED FROM REPO: diplomat-bit/aibanking.dev-jocall3-new | ORIGINAL PATH: diplomat-bit-aibanking.dev-jocall3-new-84d7a30/constants.tsx
================================================================================


import React from 'react';
import { Bot, FileText, Shuffle, PiggyBank, Target, Shield, TrendingUp, Gem, Code, Globe, Cuboid, Home, Palette, Percent, Rocket, Briefcase, Calculator, Scroll, Building, Landmark, Link, Users, Megaphone, Network, ShoppingBag, User, FileCog, Settings, Eye, CreditCard, Lock, Leaf, Activity, Cpu, AlertTriangle, Gift, Layers, Zap, Database, Server, Clipboard, Atom, Repeat, DollarSign, Sparkles, Terminal, BarChart2, PieChart, Box as BoxIcon, LifeBuoy, Grid, CheckCircle, Scale, LayoutDashboard, Mic, Book, Library } from 'lucide-react';
import { View } from './types';


export const banks = [
    { name: 'Chase', logo: <Building className="w-6 h-6 text-blue-600" />, institution_id: 'ins_1' },
    { name: 'Bank of America', logo: <Landmark className="w-6 h-6 text-red-600" />, institution_id: 'ins_2' },
    { name: 'Wells Fargo', logo: <Shield className="w-6 h-6 text-yellow-600" />, institution_id: 'ins_3' },
    { name: 'Citi', logo: <Globe className="w-6 h-6 text-blue-400" />, institution_id: 'ins_4' },
    { name: 'Capital One', logo: <CreditCard className="w-6 h-6 text-blue-800" />, institution_id: 'ins_5' },
];

export const NAV_ITEMS = [
    {
        group: 'Intelligence Command',
        items: [
            { view: View.Dashboard, title: 'Foundation Dashboard', icon: Bot },
            { view: View.Transactions, title: 'FlowMatrix (Transactions)', icon: FileText },
            { view: View.SendMoney, title: 'Quantum Pay', icon: Shuffle },
            { view: View.Budgets, title: 'Capital Allocation', icon: PiggyBank },
            { view: View.FinancialGoals, title: 'Strategic Goals', icon: Target },
            { view: View.CreditHealth, title: 'Credit Resonance', icon: Shield },
            { view: View.Personalization, title: 'Interface Will', icon: Settings },
            { view: View.Accounts, title: 'Accounts Overview', icon: Briefcase },
        ]
    },
    {
        group: 'The 527 Protocol',
        items: [
            { view: View.TheBook, title: 'The Blueprint (527 Pages)', icon: Book },
            { view: View.KnowledgeBase, title: 'The Academy', icon: Library },
        ]
    },
    {
        group: 'Infinite Wealth',
        items: [
            { view: View.Investments, title: 'Portfolio Overview', icon: TrendingUp },
            { view: View.Crypto, title: 'Web3 & Crypto', icon: Gem },
            { view: View.AlgoTradingLab, title: 'Algo-Trading Lab', icon: Code },
            { view: View.ForexArena, title: 'Forex Arena', icon: Globe },
            { view: View.CommoditiesExchange, title: 'Commodities', icon: Cuboid },
            { view: View.RealEstateEmpire, title: 'Real Estate', icon: Home },
            { view: View.ArtCollectibles, title: 'Art & Collectibles', icon: Palette },
            { view: View.DerivativesDesk, title: 'Derivatives', icon: Percent },
            { view: View.VentureCapital, title: 'Venture Capital', icon: Rocket },
            { view: View.PrivateEquity, title: 'Private Equity', icon: Briefcase },
            { view: View.TaxOptimization, title: 'Civic Contribution', icon: Calculator },
            { view: View.LegacyBuilder, title: 'Legacy Architect', icon: Scroll },
            { view: View.SovereignWealth, title: 'Wealth Simulation', icon: Landmark },
            { view: View.QuantumAssets, title: 'Quantum Assets', icon: Atom },
        ]
    },
    {
        group: 'Citi Connect Core',
        items: [
            { view: View.CitibankAccounts, title: 'Citi Accounts', icon: Building },
            { view: View.CitibankAccountProxy, title: 'Account Proxy', icon: Shuffle },
            { view: View.CitibankBillPay, title: 'Bill Payment', icon: FileText },
            { view: View.CitibankCrossBorder, title: 'Cross Border', icon: Globe },
            { view: View.CitibankPayeeManagement, title: 'Payee Mgmt', icon: Users },
            { view: View.CitibankStandingInstructions, title: 'Standing Instructions', icon: Repeat },
            { view: View.CitibankDeveloperTools, title: 'Citi Dev Tools', icon: Code },
            { view: View.CitibankEligibility, title: 'Eligibility Check', icon: CheckCircle },
            { view: View.CitibankUnmaskedData, title: 'Secure Data View', icon: Eye },
        ]
    },
    {
        group: 'Plaid Nexus',
        items: [
            { view: View.PlaidMainDashboard, title: 'Plaid Overview', icon: Activity },
            { view: View.PlaidIdentity, title: 'Identity Verification', icon: User },
            { view: View.PlaidCRAMonitoring, title: 'CRA Monitoring', icon: Eye },
            { view: View.PlaidInstitutions, title: 'Institutions Explorer', icon: Building },
            { view: View.PlaidItemManagement, title: 'Item Management', icon: Settings },
        ]
    },
    {
        group: 'Enterprise Operations',
        items: [
            { view: View.CorporateCommand, title: 'Corporate Command', icon: Building },
            { view: View.ModernTreasury, title: 'Modern Treasury', icon: Landmark },
            { view: View.Treasury, title: 'Treasury & Capital', icon: DollarSign },
            { view: View.CardPrograms, title: 'Marqeta Cards', icon: CreditCard },
            { view: View.Payments, title: 'Stripe Payments', icon: Zap },
            { view: View.StripeNexus, title: 'Stripe Nexus', icon: Link },
            { view: View.CounterpartyDashboard, title: 'Counterparties', icon: Users },
            { view: View.VirtualAccounts, title: 'Virtual Accounts', icon: Layers },
            { view: View.CorporateActions, title: 'Corporate Actions', icon: FileText },
            { view: View.CreditNoteLedger, title: 'Credit Notes', icon: FileText },
            { view: View.ReconciliationHub, title: 'Reconciliation Hub', icon: Shuffle },
            { view: View.GEINDashboard, title: 'GEIN Dashboard', icon: Network },
            { view: View.CardholderManagement, title: 'Cardholder Mgmt', icon: User },
             { view: View.VentureCapitalDeskView, title: 'VC Desk View', icon: Rocket },
        ]
    },
    {
        group: 'System & Intelligence',
        items: [
            { view: View.AIAdvisor, title: 'AI Advisor', icon: Bot },
            { view: View.AIInsights, title: 'Predictive Insights', icon: Sparkles },
            { view: View.QuantumWeaver, title: 'Quantum Weaver', icon: Network },
            { view: View.AgentMarketplace, title: 'Agent Marketplace', icon: ShoppingBag },
            { view: View.AIAdStudio, title: 'AI Ad Studio', icon: Megaphone },
            { view: View.GlobalPositionMap, title: 'Global Position Map', icon: Globe },
            { view: View.GlobalSsiHub, title: 'Global SSI Hub', icon: Database },
            { view: View.SecurityCompliance, title: 'Security & Compliance', icon: Shield },
            { view: View.DeveloperHub, title: 'Developer Hub', icon: Code },
            { view: View.SchemaExplorer, title: 'ISO 20022 Explorer', icon: FileCog },
            { view: View.ResourceGraph, title: 'Resource Graph', icon: Network },
            { view: View.TheVision, title: 'The Vision', icon: Eye },
            { view: View.ApiPlayground, title: 'API Playground', icon: Terminal },
            { view: View.ComplianceOracle, title: 'Compliance Oracle', icon: Scale },
        ]
    },
    {
        group: 'Admin & Tools',
        items: [
            { view: View.CustomerDashboard, title: 'Customer Dashboard', icon: Users },
            { view: View.VerificationReports, title: 'Verification Reports', icon: Clipboard },
            { view: View.FinancialReporting, title: 'Financial Reporting', icon: BarChart2 },
             { view: View.StripeNexusDashboard, title: 'Stripe Nexus Admin', icon: LayoutDashboard },
        ]
    },
    {
        group: 'All Components',
        items: [
            { view: View.AccountDetails, title: 'Account Details', icon: FileText },
            { view: View.AccountList, title: 'Account List', icon: FileText },
            { view: View.AccountStatementGrid, title: 'Account Statement Grid', icon: Grid },
            { view: View.AccountsView, title: 'Accounts View', icon: Briefcase },
            { view: View.AccountVerificationModal, title: 'Acct Verification Modal', icon: Shield },
            { view: View.ACHDetailsDisplay, title: 'ACH Details Display', icon: FileText },
            { view: View.AICommandLog, title: 'AI Command Log', icon: Terminal },
            { view: View.AIPredictionWidget, title: 'AI Prediction Widget', icon: Sparkles },
            { view: View.AssetCatalog, title: 'Asset Catalog', icon: BoxIcon },
            { view: View.AutomatedSweepRules, title: 'Automated Sweep Rules', icon: Repeat },
            { view: View.BalanceReportChart, title: 'Balance Report Chart', icon: BarChart2 },
            { view: View.BalanceTransactionTable, title: 'Balance Txn Table', icon: FileText },
            { view: View.CardDesignVisualizer, title: 'Card Design Visualizer', icon: Palette },
            { view: View.ChargeDetailModal, title: 'Charge Detail Modal', icon: FileText },
            { view: View.ChargeList, title: 'Charge List', icon: FileText },
            { view: View.ConductorConfigurationView, title: 'Conductor Config', icon: Settings },
            { view: View.CounterpartyDetails, title: 'Counterparty Details', icon: User },
            { view: View.CounterpartyForm, title: 'Counterparty Form', icon: FileCog },
            { view: View.DisruptionIndexMeter, title: 'Disruption Index Meter', icon: Activity },
            { view: View.DocumentUploader, title: 'Document Uploader', icon: FileCog },
            { view: View.DownloadLink, title: 'Download Link', icon: Link },
            { view: View.EarlyFraudWarningFeed, title: 'Fraud Warning Feed', icon: AlertTriangle },
            { view: View.ElectionChoiceForm, title: 'Election Choice Form', icon: FileCog },
            { view: View.EventNotificationCard, title: 'Event Notification Card', icon: Megaphone },
            { view: View.ExpectedPaymentsTable, title: 'Expected Payments Table', icon: FileText },
            { view: View.ExternalAccountCard, title: 'External Account Card', icon: CreditCard },
            { view: View.ExternalAccountForm, title: 'External Account Form', icon: FileCog },
            { view: View.ExternalAccountsTable, title: 'External Accounts Table', icon: FileText },
            { view: View.FinancialAccountCard, title: 'Financial Account Card', icon: CreditCard },
            { view: View.IncomingPaymentDetailList, title: 'Incoming Pmt Detail', icon: FileText },
            { view: View.InvoiceFinancingRequest, title: 'Invoice Financing Req', icon: FileCog },
            { view: View.PaymentInitiationForm, title: 'Payment Initiation Form', icon: FileCog },
            { view: View.PaymentMethodDetails, title: 'Pmt Method Details', icon: FileText },
            { view: View.PaymentOrderForm, title: 'Payment Order Form', icon: FileCog },
            { view: View.PayoutsDashboard, title: 'Payouts Dashboard', icon: DollarSign },
            { view: View.PnLChart, title: 'PnL Chart', icon: PieChart },
            { view: View.RefundForm, title: 'Refund Form', icon: FileCog },
            { view: View.RemittanceInfoEditor, title: 'Remittance Info Editor', icon: FileCog },
            { view: View.ReportingView, title: 'Reporting View', icon: BarChart2 },
            { view: View.ReportRunGenerator, title: 'Report Run Generator', icon: FileCog },
            { view: View.ReportStatusIndicator, title: 'Report Status Indicator', icon: Activity },
            { view: View.SsiEditorForm, title: 'SSI Editor Form', icon: FileCog },
            { view: View.StripeNexusView, title: 'Stripe Nexus View', icon: Link },
            { view: View.StripeStatusBadge, title: 'Stripe Status Badge', icon: Shield },
            { view: View.StructuredPurposeInput, title: 'Structured Purpose Input', icon: FileCog },
            { view: View.SubscriptionList, title: 'Subscription List', icon: FileText },
            { view: View.TimeSeriesChart, title: 'Time Series Chart', icon: BarChart2 },
            { view: View.TradeConfirmationModal, title: 'Trade Confirm Modal', icon: FileText },
            { view: View.TransactionFilter, title: 'Transaction Filter', icon: FileCog },
            { view: View.TransactionList, title: 'Transaction List', icon: FileText },
            { view: View.TreasuryTransactionList, title: 'Treasury Txn List', icon: FileText },
            { view: View.UniversalObjectInspector, title: 'Object Inspector', icon: Eye },
            { view: View.VirtualAccountForm, title: 'Virtual Acct Form', icon: FileCog },
            { view: View.VirtualAccountsTable, title: 'Virtual Accts Table', icon: FileText },
            { view: View.VoiceControl, title: 'Voice Control', icon: Mic },
            { view: View.WebhookSimulator, title: 'Webhook Simulator', icon: Terminal },
        ]
    }
];

export const AppTheme = {
    colors: {
        primary: {
            DEFAULT: '#06b6d4',
            light: '#67e8f9',
            dark: '#0e7490',
        },
        secondary: {
            DEFAULT: '#6366f1',
            light: '#a5b4fc',
            dark: '#4338ca',
        },
        background: {
            main: '#111827',
            card: 'rgba(31, 41, 55, 0.5)',
            interactive: '#374151',
        },
        text: {
            main: '#f9fafb',
            headings: '#ffffff',
            muted: '#9ca3af',
            accent: '#e5e7eb',
        },
        status: {
            success: '#22c55e',
            warning: '#f59e0b',
            error: '#ef4444',
            info: '#3b82f6',
        },
        border: {
            DEFAULT: 'rgba(75, 85, 99, 0.6)',
            interactive: 'rgba(6, 182, 212, 0.5)',
        },
    },
};


================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/constants.tsx
================================================================================


import React from 'react';
import { Bot, FileText, Shuffle, PiggyBank, Target, Shield, TrendingUp, Gem, Code, Globe, Cuboid, Home, Palette, Percent, Rocket, Briefcase, Calculator, Scroll, Building, Landmark, Link, Users, Megaphone, Network, ShoppingBag, User, FileCog, Settings, Eye, CreditCard, Lock, Leaf, Activity, Cpu, AlertTriangle, Gift, Layers, Zap, Database, Server, Clipboard, Atom, Repeat, DollarSign, Sparkles, Terminal, BarChart2, PieChart, Box as BoxIcon, LifeBuoy, Grid, CheckCircle, Scale, LayoutDashboard, Mic, Book, Library } from 'lucide-react';
import { View } from './types';


export const banks = [
    { name: 'Chase', logo: <Building className="w-6 h-6 text-blue-600" />, institution_id: 'ins_1' },
    { name: 'Bank of America', logo: <Landmark className="w-6 h-6 text-red-600" />, institution_id: 'ins_2' },
    { name: 'Wells Fargo', logo: <Shield className="w-6 h-6 text-yellow-600" />, institution_id: 'ins_3' },
    { name: 'Citi', logo: <Globe className="w-6 h-6 text-blue-400" />, institution_id: 'ins_4' },
    { name: 'Capital One', logo: <CreditCard className="w-6 h-6 text-blue-800" />, institution_id: 'ins_5' },
];

export const NAV_ITEMS = [
    {
        group: 'Intelligence Command',
        items: [
            { view: View.Dashboard, title: 'Foundation Dashboard', icon: Bot },
            { view: View.Transactions, title: 'FlowMatrix (Transactions)', icon: FileText },
            { view: View.SendMoney, title: 'Quantum Pay', icon: Shuffle },
            { view: View.Budgets, title: 'Capital Allocation', icon: PiggyBank },
            { view: View.FinancialGoals, title: 'Strategic Goals', icon: Target },
            { view: View.CreditHealth, title: 'Credit Resonance', icon: Shield },
            { view: View.Personalization, title: 'Interface Will', icon: Settings },
            { view: View.Accounts, title: 'Accounts Overview', icon: Briefcase },
        ]
    },
    {
        group: 'The 527 Protocol',
        items: [
            { view: View.TheBook, title: 'The Blueprint (527 Pages)', icon: Book },
            { view: View.KnowledgeBase, title: 'The Academy', icon: Library },
        ]
    },
    {
        group: 'Infinite Wealth',
        items: [
            { view: View.Investments, title: 'Portfolio Overview', icon: TrendingUp },
            { view: View.Crypto, title: 'Web3 & Crypto', icon: Gem },
            { view: View.AlgoTradingLab, title: 'Algo-Trading Lab', icon: Code },
            { view: View.ForexArena, title: 'Forex Arena', icon: Globe },
            { view: View.CommoditiesExchange, title: 'Commodities', icon: Cuboid },
            { view: View.RealEstateEmpire, title: 'Real Estate', icon: Home },
            { view: View.ArtCollectibles, title: 'Art & Collectibles', icon: Palette },
            { view: View.DerivativesDesk, title: 'Derivatives', icon: Percent },
            { view: View.VentureCapital, title: 'Venture Capital', icon: Rocket },
            { view: View.PrivateEquity, title: 'Private Equity', icon: Briefcase },
            { view: View.TaxOptimization, title: 'Civic Contribution', icon: Calculator },
            { view: View.LegacyBuilder, title: 'Legacy Architect', icon: Scroll },
            { view: View.SovereignWealth, title: 'Wealth Simulation', icon: Landmark },
            { view: View.QuantumAssets, title: 'Quantum Assets', icon: Atom },
        ]
    },
    {
        group: 'Citi Connect Core',
        items: [
            { view: View.CitibankAccounts, title: 'Citi Accounts', icon: Building },
            { view: View.CitibankAccountProxy, title: 'Account Proxy', icon: Shuffle },
            { view: View.CitibankBillPay, title: 'Bill Payment', icon: FileText },
            { view: View.CitibankCrossBorder, title: 'Cross Border', icon: Globe },
            { view: View.CitibankPayeeManagement, title: 'Payee Mgmt', icon: Users },
            { view: View.CitibankStandingInstructions, title: 'Standing Instructions', icon: Repeat },
            { view: View.CitibankDeveloperTools, title: 'Citi Dev Tools', icon: Code },
            { view: View.CitibankEligibility, title: 'Eligibility Check', icon: CheckCircle },
            { view: View.CitibankUnmaskedData, title: 'Secure Data View', icon: Eye },
        ]
    },
    {
        group: 'Plaid Nexus',
        items: [
            { view: View.PlaidMainDashboard, title: 'Plaid Overview', icon: Activity },
            { view: View.PlaidIdentity, title: 'Identity Verification', icon: User },
            { view: View.PlaidCRAMonitoring, title: 'CRA Monitoring', icon: Eye },
            { view: View.PlaidInstitutions, title: 'Institutions Explorer', icon: Building },
            { view: View.PlaidItemManagement, title: 'Item Management', icon: Settings },
        ]
    },
    {
        group: 'Enterprise Operations',
        items: [
            { view: View.CorporateCommand, title: 'Corporate Command', icon: Building },
            { view: View.ModernTreasury, title: 'Modern Treasury', icon: Landmark },
            { view: View.Treasury, title: 'Treasury & Capital', icon: DollarSign },
            { view: View.CardPrograms, title: 'Marqeta Cards', icon: CreditCard },
            { view: View.Payments, title: 'Stripe Payments', icon: Zap },
            { view: View.StripeNexus, title: 'Stripe Nexus', icon: Link },
            { view: View.CounterpartyDashboard, title: 'Counterparties', icon: Users },
            { view: View.VirtualAccounts, title: 'Virtual Accounts', icon: Layers },
            { view: View.CorporateActions, title: 'Corporate Actions', icon: FileText },
            { view: View.CreditNoteLedger, title: 'Credit Notes', icon: FileText },
            { view: View.ReconciliationHub, title: 'Reconciliation Hub', icon: Shuffle },
            { view: View.GEINDashboard, title: 'GEIN Dashboard', icon: Network },
            { view: View.CardholderManagement, title: 'Cardholder Mgmt', icon: User },
             { view: View.VentureCapitalDeskView, title: 'VC Desk View', icon: Rocket },
        ]
    },
    {
        group: 'System & Intelligence',
        items: [
            { view: View.AIAdvisor, title: 'AI Advisor', icon: Bot },
            { view: View.AIInsights, title: 'Predictive Insights', icon: Sparkles },
            { view: View.QuantumWeaver, title: 'Quantum Weaver', icon: Network },
            { view: View.AgentMarketplace, title: 'Agent Marketplace', icon: ShoppingBag },
            { view: View.AIAdStudio, title: 'AI Ad Studio', icon: Megaphone },
            { view: View.GlobalPositionMap, title: 'Global Position Map', icon: Globe },
            { view: View.GlobalSsiHub, title: 'Global SSI Hub', icon: Database },
            { view: View.SecurityCompliance, title: 'Security & Compliance', icon: Shield },
            { view: View.DeveloperHub, title: 'Developer Hub', icon: Code },
            { view: View.SchemaExplorer, title: 'ISO 20022 Explorer', icon: FileCog },
            { view: View.ResourceGraph, title: 'Resource Graph', icon: Network },
            { view: View.TheVision, title: 'The Vision', icon: Eye },
            { view: View.ApiPlayground, title: 'API Playground', icon: Terminal },
            { view: View.ComplianceOracle, title: 'Compliance Oracle', icon: Scale },
        ]
    },
    {
        group: 'Admin & Tools',
        items: [
            { view: View.CustomerDashboard, title: 'Customer Dashboard', icon: Users },
            { view: View.VerificationReports, title: 'Verification Reports', icon: Clipboard },
            { view: View.FinancialReporting, title: 'Financial Reporting', icon: BarChart2 },
             { view: View.StripeNexusDashboard, title: 'Stripe Nexus Admin', icon: LayoutDashboard },
        ]
    },
    {
        group: 'All Components',
        items: [
            { view: View.AccountDetails, title: 'Account Details', icon: FileText },
            { view: View.AccountList, title: 'Account List', icon: FileText },
            { view: View.AccountStatementGrid, title: 'Account Statement Grid', icon: Grid },
            { view: View.AccountsView, title: 'Accounts View', icon: Briefcase },
            { view: View.AccountVerificationModal, title: 'Acct Verification Modal', icon: Shield },
            { view: View.ACHDetailsDisplay, title: 'ACH Details Display', icon: FileText },
            { view: View.AICommandLog, title: 'AI Command Log', icon: Terminal },
            { view: View.AIPredictionWidget, title: 'AI Prediction Widget', icon: Sparkles },
            { view: View.AssetCatalog, title: 'Asset Catalog', icon: BoxIcon },
            { view: View.AutomatedSweepRules, title: 'Automated Sweep Rules', icon: Repeat },
            { view: View.BalanceReportChart, title: 'Balance Report Chart', icon: BarChart2 },
            { view: View.BalanceTransactionTable, title: 'Balance Txn Table', icon: FileText },
            { view: View.CardDesignVisualizer, title: 'Card Design Visualizer', icon: Palette },
            { view: View.ChargeDetailModal, title: 'Charge Detail Modal', icon: FileText },
            { view: View.ChargeList, title: 'Charge List', icon: FileText },
            { view: View.ConductorConfigurationView, title: 'Conductor Config', icon: Settings },
            { view: View.CounterpartyDetails, title: 'Counterparty Details', icon: User },
            { view: View.CounterpartyForm, title: 'Counterparty Form', icon: FileCog },
            { view: View.DisruptionIndexMeter, title: 'Disruption Index Meter', icon: Activity },
            { view: View.DocumentUploader, title: 'Document Uploader', icon: FileCog },
            { view: View.DownloadLink, title: 'Download Link', icon: Link },
            { view: View.EarlyFraudWarningFeed, title: 'Fraud Warning Feed', icon: AlertTriangle },
            { view: View.ElectionChoiceForm, title: 'Election Choice Form', icon: FileCog },
            { view: View.EventNotificationCard, title: 'Event Notification Card', icon: Megaphone },
            { view: View.ExpectedPaymentsTable, title: 'Expected Payments Table', icon: FileText },
            { view: View.ExternalAccountCard, title: 'External Account Card', icon: CreditCard },
            { view: View.ExternalAccountForm, title: 'External Account Form', icon: FileCog },
            { view: View.ExternalAccountsTable, title: 'External Accounts Table', icon: FileText },
            { view: View.FinancialAccountCard, title: 'Financial Account Card', icon: CreditCard },
            { view: View.IncomingPaymentDetailList, title: 'Incoming Pmt Detail', icon: FileText },
            { view: View.InvoiceFinancingRequest, title: 'Invoice Financing Req', icon: FileCog },
            { view: View.PaymentInitiationForm, title: 'Payment Initiation Form', icon: FileCog },
            { view: View.PaymentMethodDetails, title: 'Pmt Method Details', icon: FileText },
            { view: View.PaymentOrderForm, title: 'Payment Order Form', icon: FileCog },
            { view: View.PayoutsDashboard, title: 'Payouts Dashboard', icon: DollarSign },
            { view: View.PnLChart, title: 'PnL Chart', icon: PieChart },
            { view: View.RefundForm, title: 'Refund Form', icon: FileCog },
            { view: View.RemittanceInfoEditor, title: 'Remittance Info Editor', icon: FileCog },
            { view: View.ReportingView, title: 'Reporting View', icon: BarChart2 },
            { view: View.ReportRunGenerator, title: 'Report Run Generator', icon: FileCog },
            { view: View.ReportStatusIndicator, title: 'Report Status Indicator', icon: Activity },
            { view: View.SsiEditorForm, title: 'SSI Editor Form', icon: FileCog },
            { view: View.StripeNexusView, title: 'Stripe Nexus View', icon: Link },
            { view: View.StripeStatusBadge, title: 'Stripe Status Badge', icon: Shield },
            { view: View.StructuredPurposeInput, title: 'Structured Purpose Input', icon: FileCog },
            { view: View.SubscriptionList, title: 'Subscription List', icon: FileText },
            { view: View.TimeSeriesChart, title: 'Time Series Chart', icon: BarChart2 },
            { view: View.TradeConfirmationModal, title: 'Trade Confirm Modal', icon: FileText },
            { view: View.TransactionFilter, title: 'Transaction Filter', icon: FileCog },
            { view: View.TransactionList, title: 'Transaction List', icon: FileText },
            { view: View.TreasuryTransactionList, title: 'Treasury Txn List', icon: FileText },
            { view: View.UniversalObjectInspector, title: 'Object Inspector', icon: Eye },
            { view: View.VirtualAccountForm, title: 'Virtual Acct Form', icon: FileCog },
            { view: View.VirtualAccountsTable, title: 'Virtual Accts Table', icon: FileText },
            { view: View.VoiceControl, title: 'Voice Control', icon: Mic },
            { view: View.WebhookSimulator, title: 'Webhook Simulator', icon: Terminal },
        ]
    }
];

export const AppTheme = {
    colors: {
        primary: {
            DEFAULT: '#06b6d4',
            light: '#67e8f9',
            dark: '#0e7490',
        },
        secondary: {
            DEFAULT: '#6366f1',
            light: '#a5b4fc',
            dark: '#4338ca',
        },
        background: {
            main: '#111827',
            card: 'rgba(31, 41, 55, 0.5)',
            interactive: '#374151',
        },
        text: {
            main: '#f9fafb',
            headings: '#ffffff',
            muted: '#9ca3af',
            accent: '#e5e7eb',
        },
        status: {
            success: '#22c55e',
            warning: '#f59e0b',
            error: '#ef4444',
            info: '#3b82f6',
        },
        border: {
            DEFAULT: 'rgba(75, 85, 99, 0.6)',
            interactive: 'rgba(6, 182, 212, 0.5)',
        },
    },
};


================================================================================
// APPENDED FROM REPO: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | ORIGINAL PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/constants.tsx
================================================================================

```typescript
// @/constants.tsx
// This file serves as the central repository for application-wide constants.
// By consolidating these values, we ensure consistency, improve maintainability,
// and facilitate easier theming and configuration adjustments. This file is 
// the pantheon of the application's identity, defining its navigable realms
// and the symbols that represent them. In this publisher edition, these constants
// are meticulously crafted to support a commercial-grade, scalable, and intelligent ecosystem.

import React from 'react';
import { View } from './types';
// FIX: Changed to named import to match the corrected export.
import { CONSTITUTIONAL_ARTICLES } from './data/constitutionalArticles';

// ================================================================================================
// TYPE DEFINITIONS FOR NAVIGATION & APPLICATION CONFIGURATION
// ================================================================================================
// FIX: Added `type?: never` to NavLink to fix type inference issues in Sidebar.tsx.
// This ensures that the 'type' property can be safely accessed on any NavItem.

// Enhanced NavLink type to include advanced UI features like badges, external linking capabilities, and feature flags.
export type NavLink = { 
    id: View; 
    label: string; 
    icon: React.ReactElement; 
    type?: 'link'; // Explicit type for clarity
    badge?: string | number; // Optional badge for notifications/counts, dynamically updated
    beta?: boolean; // Indicate if a feature is in beta phase, subject to change
    comingSoon?: boolean; // Indicate upcoming features, building anticipation
    externalUrl?: string; // For seamless navigation to external platforms or resources
    target?: '_blank' | '_self' | '_parent' | '_top'; // Link target for external URLs
    requiresSubscription?: boolean; // Gates access based on user's subscription tier
    featureFlag?: keyof FeatureFlags; // Connects directly to a feature flag for dynamic visibility
};

// NavHeader remains for simple, declarative section titles within the navigation hierarchy.
export type NavHeader = { type: 'header'; label: string; id?: never; icon?: never };

// NavDivider for elegant visual separation, enhancing readability and content grouping.
// FIX: Removed `label?: never` from NavDivider. This property was confusing the TypeScript type-checker when narrowing the NavItem union type, causing it to incorrectly infer 'never' for an item's type in some cases.
export type NavDivider = { type: 'divider'; id?: never; icon?: never };

// NavDropdown introduces nested navigation, allowing for a structured and expandable menu.
// This supports complex information architectures and future extensibility.
export type NavDropdown = {
    type: 'dropdown';
    label: string;
    icon: React.ReactElement;
    children: (NavLink | NavDivider | NavHeader)[]; // Can contain links, dividers, or even nested headers
    id?: never; // Dropdowns themselves do not have a direct view ID
    defaultOpen?: boolean; // Optionally expand the dropdown by default
};

// Union of all possible navigation item types, providing a flexible and robust navigation schema.
export type NavItem = NavLink | NavHeader | NavDivider | NavDropdown;

// Type definition for comprehensive application metadata, vital for branding, SEO, and regulatory compliance.
export type AppMetadata = {
    appName: string; // The official public name of the application
    appTagline: string; // A concise and compelling statement of the app's value proposition
    appVersion: string; // Current semantic versioning for releases
    copyrightInfo: string; // Legal copyright statement
    releaseDate: string; // Date of the latest major public release
    buildNumber: string; // Internal build identifier for tracking
    documentationUrl: string; // Link to comprehensive user and developer documentation
    supportUrl: string; // Direct link to customer support portal
    privacyPolicyUrl: string; // URL to the detailed privacy policy
    termsOfServiceUrl: string; // URL to the legal terms of service agreement
    aiGovernancePolicyUrl: string; // URL outlining ethical AI usage and governance
    openSourceManifestUrl: string; // Transparency into open-source component usage
    brandColors: { // Core brand palette for consistent theming
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        text: string;
        cta: string; // Call-to-action color
    };
    contactEmail: string; // Primary contact email for general inquiries
    socialMediaLinks: { // Essential social media presence
        twitter?: string;
        linkedin?: string;
        youtube?: string;
        blog?: string;
    };
    publisherLegalName: string; // Full legal name of the publishing entity
    publisherAddress: string; // Physical address for legal and compliance
    publisherJurisdiction: string; // Legal jurisdiction of the publisher
};

// Type definition for dynamic feature flags, enabling A/B testing, phased rollouts, and granular control.
export type FeatureFlags = {
    [key: string]: boolean; // Index signature for dynamic access
    // Core Platform Enhancements
    enableAIAgentMarketplace: boolean;
    enableQuantumOraclePredictions: boolean;
    enableDecentralizedIdentity: boolean;
    enableRealTimeAnalytics: boolean;
    enableSmartContractAudits: boolean;
    
    // UI/UX Customization
    enableAdvancedTheming: boolean;
    showBetaFeatures: boolean;
    enableDarkModeBanner: boolean;
    enableGuidedOnboarding: boolean;
    
    // Enterprise & Commercial Features
    enableMultiTenancy: boolean;
    enableAdvancedReporting: boolean;
    enableCustomIntegrations: boolean;
    enableBlockchainSettlement: boolean;
    
    // AI Specific Capabilities
    enableGenerativeJurisprudenceAI: boolean;
    enableHypothesisEngine: boolean;
    enableEthicalAIAssessment: boolean;
    enableAutonomousScientistMode: boolean;
};

// Type definition for AI model configuration parameters, meticulously tuned for optimal performance and safety.
export type AIModelSettings = {
    defaultModel: string; // Identifier for the primary generative AI model
    temperature: number; // Controls output randomness (0.0 for deterministic, 1.0 for highly creative)
    maxTokens: number; // Maximum length of generated response, balancing verbosity and cost
    topP: number; // Controls diversity via nucleus sampling; (0.0 to 1.0, 1.0 includes all tokens)
    frequencyPenalty: number; // Penalizes new tokens based on their existing frequency in text
    presencePenalty: number; // Penalizes new tokens based on whether they appear in the text so far
    systemPrompts: { // Curated system prompts to guide AI behavior across different modules
        generalAdvisor: string; // For broad financial and strategic advice
        creativeGenerator: string; // For content creation and innovative problem-solving
        riskAnalyst: string; // For identifying and mitigating potential risks
        legalInterpreter: string; // For parsing and explaining complex legal documents
        codeSynthesizer: string; // For generating and optimizing code
        narrativeArchitect: string; // For crafting compelling stories and user journeys
        economicForecaster: string; // For sophisticated economic trend predictions
    };
    rateLimits: { // API rate limits to ensure fair usage and prevent abuse
        perUserPerHour: number; // Limits AI requests for individual users
        globalPerMinute: number; // System-wide aggregate request limit
    };
    safetyThresholds: { // Configurable thresholds for content moderation and safety filters
        hateSpeech: number;
        sexualContent: number;
        violence: number;
        selfHarm: number;
    };
    fineTuningDataSources: string[]; // List of datasets used for fine-tuning specific models
};

// Type definition for API endpoint configurations, ensuring robust and scalable microservice architecture.
export type APIEndpoints = {
    authService: string; // Authentication and Authorization Gateway
    dataService: string; // Core Data Repository and Query Engine
    aiService: string; // Central AI Inference and Model Management
    orchestrationService: string; // Workflow Automation and Task Coordination
    financialService: string; // Transaction Processing and Account Management
    blockchainService: string; // Decentralized Ledger Interaction
    reportingService: string; // Analytics and Business Intelligence
    notificationService: string; // Real-time Alerts and Communication
    adminService: string; // Platform Administration and User Management
    marketIntelligenceService: string; // External Market Data Feeds
    complianceService: string; // Regulatory and Governance Checks
    identityService: string; // User and Entity Identity Management
};

// ================================================================================================
// APPLICATION-WIDE GLOBAL CONSTANTS
// ================================================================================================

// Centralized application metadata for consistent branding and legal information.
export const APP_METADATA: AppMetadata = {
    appName: "Quantum Nexus",
    appTagline: "Pioneering the Future of Intelligent Finance and Strategic Autonomy",
    appVersion: "3.0.0-PublisherEdition",
    copyrightInfo: "© 2024 Quantum Nexus Holdings Inc. All rights reserved.",
    releaseDate: "2024-07-26",
    buildNumber: "QNX-3.0.0-PE-BETA-7890",
    documentationUrl: "https://docs.quantumnexus.com",
    supportUrl: "https://support.quantumnexus.com",
    privacyPolicyUrl: "https://quantumnexus.com/privacy",
    termsOfServiceUrl: "https://quantumnexus.com/terms",
    aiGovernancePolicyUrl: "https://quantumnexus.com/ai-governance",
    openSourceManifestUrl: "https://quantumnexus.com/oss-manifest",
    brandColors: {
        primary: "#635BFF", // Deep Indigo for strength and sophistication
        secondary: "#36C5F0", // Aqua for innovation and clarity
        accent: "#ECB22E", // Gold for premium features and insights
        background: "#F9FAFB", // Light Grey for a clean, modern interface
        text: "#1F2937", // Dark Grey for readability
        cta: "#06AC38", // Vibrant Green for action and growth
    },
    contactEmail: "contact@quantumnexus.com",
    socialMediaLinks: {
        twitter: "https://twitter.com/quantumnexusai",
        linkedin: "https://www.linkedin.com/company/quantumnexus",
        youtube: "https://www.youtube.com/@quantumnexus",
        blog: "https://blog.quantumnexus.com",
    },
    publisherLegalName: "Quantum Nexus Global Technologies Corporation",
    publisherAddress: "1701 Financial Drive, Suite 300, Metropolis, CA 90210, USA",
    publisherJurisdiction: "Delaware, USA",
};

// Feature flags for dynamic control over application capabilities.
export const GLOBAL_FEATURE_FLAGS: FeatureFlags = {
    enableAIAgentMarketplace: true,
    enableQuantumOraclePredictions: true,
    enableDecentralizedIdentity: false, // Future roadmap item
    enableRealTimeAnalytics: true,
    enableSmartContractAudits: true,
    enableAdvancedTheming: true,
    showBetaFeatures: true, // For internal testing or early access programs
    enableDarkModeBanner: true,
    enableGuidedOnboarding: true,
    enableMultiTenancy: true, // For enterprise clients
    enableAdvancedReporting: true,
    enableCustomIntegrations: true,
    enableBlockchainSettlement: false, // Advanced feature, currently disabled
    enableGenerativeJurisprudenceAI: true,
    enableHypothesisEngine: true,
    enableEthicalAIAssessment: true

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/constants.tsx
================================================================================

import React from 'react';
import { View, Feature, ExternalApp } from './types';
import { 
  Layout, BrainCircuit, EyeOff, Sparkles, Mic, ShieldCheck, 
  Fingerprint, Database, TrendingUp, Command, Landmark,
  Settings, DatabaseZap, Megaphone, LifeBuoy, 
  ShieldAlert, Network, Cpu, Key, Rocket, Send,
  Zap, Hammer, Puzzle, Globe, Target, Box, Binary, Shield, Compass, Briefcase, Activity, Headphones, BarChart3, Lock, Users, Server, Award, FileCode, FolderTree, BookOpen
} from 'lucide-react';

export interface NavSection {
  label: string;
  items: { id: string; label: string; icon: React.ReactNode }[];
}

export const NAV_SECTORS: NavSection[] = [
    {
        label: 'Sovereign Archives & Files',
        items: [
            { id: View.FilesVault, label: 'Files & Dossier Vault', icon: <FolderTree size={18} className="text-amber-400" /> },
            { id: View.WorkspaceNexus, label: 'Workspace Nexus (Drive)', icon: <Globe size={18} className="text-cyan-400" /> },
        ]
    },
    {
        label: 'Command',
        items: [
            { id: View.Dashboard, label: 'Sovereign Bridge', icon: <Layout size={18} /> },
            { id: View.CryptoVerifier, label: 'JWE / JWS Verifier', icon: <ShieldCheck size={18} className="text-emerald-400" /> },
            { id: View.BillingIdentity, label: 'Identity Vault', icon: <Lock size={18} className="text-indigo-400" /> },
            { id: View.PortalHub, label: 'Portal Constellation', icon: <Box size={18} className="text-yellow-400" /> },
            { id: View.DataIngest, label: 'Neural Ingest', icon: <DatabaseZap size={18} className="text-orange-400" /> },
            { id: View.AzureApps, label: 'Azure Directory', icon: <Server size={18} className="text-blue-400" /> },
            { id: View.FloridaVoter, label: 'FL 2026 Voter Registration', icon: <Award size={18} className="text-lime-400" /> },
        ]
    },
    {
        label: 'The Legions',
        items: [
            { id: View.LegionArchitect, label: 'L-I: Architect', icon: <BrainCircuit size={18} className="text-lime-400" /> },
            { id: View.LegionGhost, label: 'L-II: Ghost', icon: <EyeOff size={18} className="text-purple-400" /> },
            { id: View.LegionVisualizer, label: 'L-III: Visualizer', icon: <Sparkles size={18} className="text-pink-400" /> },
            { id: View.LegionVoice, label: 'L-IV: Voice', icon: <Mic size={18} className="text-emerald-400" /> },
            { id: View.LegionAuditor, label: 'L-V: Auditor', icon: <ShieldCheck size={18} className="text-blue-400" /> },
            { id: View.LegionLive, label: 'L-VI: Live Communion', icon: <Headphones size={18} className="text-cyan-400" /> },
        ]
    },
    {
        label: 'Sovereignty Core',
        items: [
            { id: View.IdentityCitadel, label: 'ID Citadel', icon: <Fingerprint size={18} className="text-teal-400" /> },
            { id: View.RecoveryMesh, label: 'Recovery Mesh', icon: <LifeBuoy size={18} className="text-orange-400" /> },
            { id: View.PrivacyGuardian, label: 'Privacy Blinder', icon: <Shield size={18} className="text-indigo-400" /> },
            { id: View.TrustRegistry, label: 'Trust Registry', icon: <Network size={18} className="text-blue-400" /> },
        ]
    },
    {
        label: 'Asset Forge',
        items: [
            { id: View.WealthNexus, label: 'Capital Nexus', icon: <TrendingUp size={18} className="text-green-400" /> },
            { id: View.TokenIssuance, label: 'Asset Forge', icon: <Binary size={18} className="text-yellow-400" /> },
            { id: View.MarketingAutomation, label: 'Growth Hub', icon: <Megaphone size={18} className="text-pink-400" /> },
        ]
    },
    {
        label: 'Intelligence',
        items: [
            { id: View.SovereignIntelligence, label: 'Sovereign Intelligence', icon: <ShieldAlert size={18} className="text-red-500" /> },
            { id: View.UniverseGraph, label: 'Universe Graph 3D', icon: <Network size={18} className="text-purple-400" /> },
            { id: View.AriaComms, label: 'Aria Neural Comms', icon: <Headphones size={18} className="text-pink-400" /> },
            { id: View.IntelligenceHub, label: 'Intelligence Core', icon: <Cpu size={18} className="text-cyan-400" /> },
            { id: View.NeuralTools, label: 'Neural Tools', icon: <Zap size={18} className="text-yellow-400" /> },
            { id: View.NexusBuilder, label: 'Nexus Forge', icon: <Hammer size={18} className="text-gray-400" /> },
        ]
    },
    {
        label: 'Governance & Audits',
        items: [
            { id: View.ImpeachmentGenerator, label: 'Impeachment Audit', icon: <ShieldAlert size={18} className="text-amber-400" /> },
            { id: View.ContractorLobbying, label: 'Contractor Lobbying ROI', icon: <BarChart3 size={18} className="text-lime-400" /> },
            { id: View.SentryEngine, label: 'ISO20022 Sentry Engine', icon: <Lock size={18} className="text-cyan-400" /> },
        ]
    },
    {
        label: 'Citi Treasury & Alpaca Suite',
        items: [
            { id: View.AlpacaTqqq, label: 'TQQQ Quantitative Trade', icon: <TrendingUp size={18} className="text-emerald-400" /> },
            { id: View.SovereignMarketTakeover, label: 'Market Takeover Hub', icon: <Globe size={18} className="text-yellow-400" /> },
            { id: View.PlaidAlpacaBridge, label: 'Plaid-Alpaca Bridge', icon: <Zap size={18} className="text-emerald-400" /> },
            { id: View.StripeAlpacaBridge, label: 'Stripe-Alpaca Bridge', icon: <Send size={18} className="text-indigo-400" /> },
            { id: View.CitiAlpacaBridge, label: 'Citi-Alpaca Bridge', icon: <Landmark size={18} className="text-cyan-400" /> },
            { id: View.AlpacaBroker, label: 'Alpaca Broker API Suite', icon: <TrendingUp size={18} className="text-yellow-400" /> },
            { id: View.AlpacaAccounts, label: 'Alpaca Account & KYC', icon: <Shield size={18} className="text-yellow-400" /> },
            { id: View.AlpacaTrading, label: 'Alpaca Trading Terminal', icon: <TrendingUp size={18} className="text-emerald-400" /> },
            { id: View.AlpacaFunding, label: 'Alpaca Funding Hub', icon: <Landmark size={18} className="text-cyan-400" /> },
            { id: View.AlpacaJournals, label: 'Alpaca Sovereign Journals', icon: <Activity size={18} className="text-yellow-400" /> },
            { id: View.AlpacaRebalancing, label: 'Alpaca Rebalancing Engine', icon: <Activity size={18} className="text-purple-400" /> },
            { id: View.AlpacaTokenization, label: 'Alpaca RWA Tokenization', icon: <Shield size={18} className="text-pink-400" /> },
            { id: View.AlpacaIpoMarketplace, label: 'Alpaca IPO Marketplace', icon: <Rocket size={18} className="text-amber-400" /> },
            { id: View.AlpacaCryptoWallets, label: 'Alpaca Crypto Wallets', icon: <Lock size={18} className="text-purple-400" /> },
            { id: View.AlpacaReporting, label: 'Alpaca EOD Reporting', icon: <Activity size={18} className="text-emerald-400" /> },
            { id: View.ModernTreasuryLedger, label: 'Modern Treasury Ledger', icon: <Landmark size={18} className="text-cyan-400" /> },
            { id: View.CitiUkInternationalPayments, label: 'Citi UK International Payments', icon: <Send size={18} className="text-emerald-400" /> },
            { id: View.FapiPipeline, label: 'FAPI 2.0 Security Pipeline', icon: <Shield size={18} className="text-emerald-400" /> },
            { id: View.CitiConnectInitiation, label: 'Payment Initiation', icon: <Rocket size={18} className="text-emerald-400" /> },
            { id: View.CitiConnectInquiry, label: 'Status Inquiry', icon: <Activity size={18} className="text-blue-400" /> },
            { id: View.CitiConnectNotifications, label: 'Push Alerts', icon: <Megaphone size={18} className="text-pink-400" /> },
            { id: View.CitiTreasury, label: 'Treasury Command', icon: <Landmark size={18} className="text-amber-400" /> },
            { id: View.CitiPartnerHub, label: 'Citi Partner API Transactions', icon: <Landmark size={18} className="text-cyan-400" /> },
        ]
    },
    {
        label: 'Sovereign Modules',
        items: [
            { id: 'administration-audit', label: 'Administration Audit', icon: <ShieldCheck size={18} className="text-amber-400" /> },
            { id: 'ai-ad-studio', label: 'AI Ad Studio', icon: <Sparkles size={18} className="text-pink-400" /> },
            { id: 'ai-advisor', label: 'AI Advisor', icon: <BrainCircuit size={18} className="text-lime-400" /> },
            { id: 'ai-insights', label: 'AI Insights', icon: <Sparkles size={18} className="text-cyan-400" /> },
            { id: 'btc-swing-trading', label: 'BTC Swing Trading', icon: <TrendingUp size={18} className="text-emerald-400" /> },
            { id: 'citi-alpaca-bridge-view', label: 'Citi-Alpaca Bridge View', icon: <Zap size={18} className="text-yellow-400" /> },
            { id: 'plaid-alpaca-bridge-view', label: 'Plaid-Alpaca Bridge View', icon: <Zap size={18} className="text-emerald-400" /> },
            { id: 'real-estate-alpaca-bridge', label: 'Real Estate Alpaca Bridge', icon: <Briefcase size={18} className="text-indigo-400" /> },
            { id: 'sovereign-market-takeover-dashboard', label: 'Market Takeover Dashboard', icon: <Globe size={18} className="text-red-400" /> },
            { id: 'stripe-alpaca-bridge-view', label: 'Stripe-Alpaca Bridge View', icon: <Send size={18} className="text-blue-400" /> },
            { id: 'tax-lien-modern-treasury-bridge', label: 'Tax Lien MT Bridge', icon: <Landmark size={18} className="text-purple-400" /> },
            { id: 'card-customization', label: 'Card Customization', icon: <Settings size={18} className="text-gray-400" /> },
            { id: 'card', label: 'Sovereign Card', icon: <Shield size={18} className="text-cyan-400" /> },
            { id: 'citi-decryption', label: 'Citi Decryption Utility', icon: <Lock size={18} className="text-red-400" /> },
            { id: 'citi-sovereign-ledger', label: 'Citi Sovereign Ledger', icon: <Database size={18} className="text-blue-400" /> },
            { id: 'corporate-command', label: 'Corporate Command', icon: <Command size={18} className="text-indigo-400" /> },
            { id: 'credit-health', label: 'Credit Health', icon: <Activity size={18} className="text-emerald-400" /> },
            { id: 'developer', label: 'Developer View', icon: <Settings size={18} className="text-gray-400" /> },
            { id: 'entra-swarm', label: 'Entra Swarm Manager', icon: <Users size={18} className="text-blue-400" /> },
            { id: 'feature-palette', label: 'Feature Palette', icon: <Layout size={18} className="text-pink-400" /> },
            { id: 'financial-democracy', label: 'Financial Democracy', icon: <Landmark size={18} className="text-yellow-400" /> },
            { id: 'financial-goals', label: 'Financial Goals', icon: <Target size={18} className="text-lime-400" /> },
            { id: 'gas-price-correlation', label: 'Gas Price Correlation', icon: <Activity size={18} className="text-orange-400" /> },
            { id: 'gemini-key-modal', label: 'Gemini Key Modal', icon: <Key size={18} className="text-yellow-400" /> },
            { id: 'gis-property-map', label: 'GIS Property Map', icon: <Globe size={18} className="text-green-400" /> },
            { id: 'government-api-dashboard', label: 'Government API Dashboard', icon: <Layout size={18} className="text-blue-400" /> },
            { id: 'irs-tax-filing', label: 'IRS Tax Filing', icon: <FileCode size={18} className="text-red-400" /> },
            { id: 'sec-filing-viewer', label: 'SEC Filing Viewer', icon: <FileCode size={18} className="text-cyan-400" /> },
            { id: 'hok-token-mint', label: 'HoK Token Mint', icon: <Binary size={18} className="text-yellow-400" /> },
            { id: 'impact-tracker', label: 'Impact Tracker', icon: <Activity size={18} className="text-green-400" /> },
            { id: 'injustice-dashboard', label: 'Injustice Dashboard', icon: <ShieldAlert size={18} className="text-red-500" /> },
            { id: 'krypto-bridge', label: 'Krypto Bridge Widget', icon: <Zap size={18} className="text-purple-400" /> },
            { id: 'machine-view', label: 'Machine View', icon: <Cpu size={18} className="text-gray-400" /> },
            { id: 'marketplace', label: 'Marketplace', icon: <Box size={18} className="text-yellow-400" /> },
            { id: 'nfc-validator', label: 'NFC Validator', icon: <Fingerprint size={18} className="text-teal-400" /> },
            { id: 'ofx-statement-viewer', label: 'OFX Statement Viewer', icon: <FileCode size={18} className="text-cyan-400" /> },
            { id: 'open-banking', label: 'Open Banking View', icon: <Landmark size={18} className="text-blue-400" /> },
            { id: 'personalization', label: 'Personalization', icon: <Settings size={18} className="text-gray-400" /> },
            { id: 'political-compliance', label: 'Political Compliance', icon: <ShieldCheck size={18} className="text-amber-400" /> },
            { id: 'public-aid-calculator', label: 'Public Aid Calculator', icon: <BarChart3 size={18} className="text-lime-400" /> },
            { id: 'deed-registrar', label: 'Deed Registrar', icon: <FileCode size={18} className="text-cyan-400" /> },
            { id: 'escrow-manager', label: 'Escrow Manager', icon: <Lock size={18} className="text-indigo-400" /> },
            { id: 'property-marketplace', label: 'Property Marketplace', icon: <Box size={18} className="text-yellow-400" /> },
            { id: 'recent-transactions', label: 'Recent Transactions', icon: <Activity size={18} className="text-emerald-400" /> },
            { id: 'security-orchestrator', label: 'Security Orchestrator', icon: <Shield size={18} className="text-red-500" /> },
            { id: 'security-view', label: 'Security View', icon: <ShieldCheck size={18} className="text-blue-400" /> },
            { id: 'sovereign-chat', label: 'Sovereign Chat', icon: <Headphones size={18} className="text-pink-400" /> },
            { id: 'sovereign-dashboard', label: 'Sovereign Dashboard', icon: <Layout size={18} className="text-cyan-400" /> },
            { id: 'sovereign-deal-audit', label: 'Sovereign Deal Audit', icon: <ShieldCheck size={18} className="text-amber-400" /> },
            { id: 'story-viewer', label: 'Story Viewer', icon: <Compass size={18} className="text-lime-400" /> },
            { id: 'foreclosure-tracker', label: 'Foreclosure Tracker', icon: <Activity size={18} className="text-red-400" /> },
            { id: 'tax-lien-auctions', label: 'Tax Lien Auctions', icon: <Landmark size={18} className="text-purple-400" /> },
            { id: 'universe-3d', label: 'Universe 3D', icon: <Network size={18} className="text-purple-400" /> },
            { id: 'voice-control', label: 'Voice Control', icon: <Mic size={18} className="text-emerald-400" /> },
            { id: 'wallet-connect-modal', label: 'Wallet Connect Modal', icon: <Lock size={18} className="text-indigo-400" /> },
            { id: 'war-appropriations-tracker', label: 'War Appropriations Tracker', icon: <BarChart3 size={18} className="text-red-500" /> },
            { id: 'wealth-distribution-chart', label: 'Wealth Distribution Chart', icon: <BarChart3 size={18} className="text-green-400" /> },
            { id: 'wealth-timeline', label: 'Wealth Timeline', icon: <Activity size={18} className="text-yellow-400" /> },
            { id: 'balance-summary', label: 'Balance Summary', icon: <Layout size={18} className="text-cyan-400" /> },
            { id: 'plaid-link', label: 'Plaid Link', icon: <Zap size={18} className="text-emerald-400" /> },
            { id: 'api-integration', label: 'API Integration', icon: <Settings size={18} className="text-gray-400" /> },
            { id: 'dashboard-view', label: 'Dashboard View', icon: <Layout size={18} className="text-blue-400" /> },
            { id: 'investments-portfolio', label: 'Investments Portfolio', icon: <TrendingUp size={18} className="text-emerald-400" /> },
            { id: 'flow-controller', label: 'Flow Controller', icon: <Activity size={18} className="text-purple-400" /> },
            { id: 'growth-nexus', label: 'Growth Nexus', icon: <Network size={18} className="text-pink-400" /> },
            { id: 'griffin-mcp', label: 'Griffin MCP Server', icon: <Server size={18} className="text-cyan-400" /> },
        ]
    },
    {
        label: 'Operations',
        items: [
            { id: View.CitiGateway, label: 'Citi Sovereign Gateway', icon: <Landmark size={18} className="text-blue-400" /> },
            { id: View.WorkspaceNexus, label: 'Workspace Nexus', icon: <Globe size={18} className="text-blue-400" /> },
            { id: View.GcpInventory, label: 'Cloud Infrastructure', icon: <DatabaseZap size={18} className="text-orange-300" /> },
            { id: View.InstitutionalHub, label: 'Institutional Hub', icon: <Command size={18} className="text-cyan-400" /> },
            { id: View.GlobalLedger, label: 'Global Ledger', icon: <Database size={18} /> },
            { id: View.AstraDBQuickstart, label: 'Astra DB Quickstart', icon: <DatabaseZap size={18} className="text-emerald-400" /> },
            { id: View.IntegrationsMarketplace, label: 'Integrations', icon: <Puzzle size={18} className="text-purple-400" /> },
        ]
    },
    {
        label: 'Applications',
        items: [
            { id: 'app-github_audit_sync_agent', label: 'Github Audit Sync Agent', icon: <FileCode size={18} className="text-cyan-400" /> },
            { id: 'app-b2b_routing_number_resolver', label: 'B2B Routing Number Resolver', icon: <FileCode size={18} className="text-cyan-400" /> },
            { id: 'app-citi_account_excel_parser', label: 'Citi Account Excel Parser', icon: <FileCode size={18} className="text-cyan-400" /> },
            { id: 'app-balance_transfer_analytics_dashboard', label: 'Balance Transfer Analytics', icon: <FileCode size={18} className="text-cyan-400" /> },
            { id: 'app-card_lifecycle_compliance_checker', label: 'Card Lifecycle Compliance', icon: <FileCode size={18} className="text-cyan-400" /> },
            { id: 'app-broker_compliance_trade_auditor', label: 'Broker Compliance Trade Auditor', icon: <FileCode size={18} className="text-cyan-400" /> },
            { id: 'app-military_fund_allocator', label: 'Military Fund Allocator', icon: <FileCode size={18} className="text-cyan-400" /> },
            { id: 'app-camt053_statement_parser', label: 'CAMT053 Statement Parser', icon: <FileCode size={18} className="text-cyan-400" /> },
            { id: 'app-camt053_balance_reconciler', label: 'CAMT053 Balance Reconciler', icon: <FileCode size={18} className="text-cyan-400" /> },
            { id: 'app-b2b_cash_flow_stress_tester', label: 'B2B Cash Flow Stress Tester', icon: <FileCode size={18} className="text-cyan-400" /> },
            { id: 'app-balance_transfer_compliance_auditor', label: 'Balance Transfer Compliance Auditor', icon: <FileCode size={18} className="text-cyan-400" /> },
            { id: 'app-card_spend_limit_manager', label: 'Card Spend Limit Manager', icon: <FileCode size={18} className="text-cyan-400" /> },
            { id: 'app-financial_regulatory_guardrail', label: 'Financial Regulatory Guardrail', icon: <FileCode size={18} className="text-cyan-400" /> },
            { id: 'app-citi_account_kyc_risk_profiler', label: 'Citi Account KYC Risk Profiler', icon: <FileCode size={18} className="text-cyan-400" /> },
            { id: 'app-statement_reconciliation_portal', label: 'Statement Reconciliation Portal', icon: <FileCode size={18} className="text-cyan-400" /> },
            { id: 'app-citi_account_anomaly_detector', label: 'Citi Account Anomaly Detector', icon: <FileCode size={18} className="text-cyan-400" /> },
            { id: 'app-card_listing_mock_server', label: 'Card Listing Mock Server', icon: <FileCode size={18} className="text-cyan-400" /> },
            { id: 'app-multi_currency_balance_consolidator', label: 'Multi Currency Balance Consolidator', icon: <FileCode size={18} className="text-cyan-400" /> },
            { id: 'app-card_pin_hasher_validator', label: 'Card PIN Hasher Validator', icon: <FileCode size={18} className="text-cyan-400" /> },
            { id: 'app-b2b_audit_trail_generator', label: 'B2B Audit Trail Generator', icon: <FileCode size={18} className="text-cyan-400" /> },
            { id: 'app-credit_limit_utilization_monitor', label: 'Credit Limit Utilization Monitor', icon: <FileCode size={18} className="text-cyan-400" /> },
            { id: 'app-financial_statement_verifier', label: 'Financial Statement Verifier', icon: <FileCode size={18} className="text-cyan-400" /> },
            { id: 'app-card_outstanding_balance_tracker', label: 'Card Outstanding Balance Tracker', icon: <FileCode size={18} className="text-cyan-400" /> },
            { id: 'app-broker_order_execution_simulator', label: 'Broker Order Execution Simulator', icon: <FileCode size={18} className="text-cyan-400" /> },
            { id: 'app-pqc_crypto_bridge_simulator', label: 'PQC Crypto Bridge Simulator', icon: <FileCode size={18} className="text-cyan-400" /> },
            { id: 'app-election_integrity_dashboard', label: 'Election Integrity Dashboard', icon: <FileCode size={18} className="text-cyan-400" /> },
            { id: 'app-balance_transfer_disbursement_orchestrator', label: 'Balance Transfer Disbursement Orchestrator', icon: <FileCode size={18} className="text-cyan-400" /> },
            { id: 'app-cvv_decryption_mock_service', label: 'CVV Decryption Mock Service', icon: <FileCode size={18} className="text-cyan-400" /> },
            { id: 'app-balance_transfer_interest_simulator', label: 'Balance Transfer Interest Simulator', icon: <FileCode size={18} className="text-cyan-400" /> },
            { id: 'app-camt053_mock_generator', label: 'CAMT053 Mock Generator', icon: <FileCode size={18} className="text-cyan-400" /> },
            { id: 'app-schema_catalog_custom_registry', label: 'Schema Catalog Custom Registry', icon: <FileCode size={18} className="text-cyan-400" /> },
            { id: 'app-credit_card_simulator', label: 'Credit Card Simulator', icon: <FileCode size={18} className="text-cyan-400" /> },
            { id: 'app-card_tokenization_service', label: 'Card Tokenization Service', icon: <FileCode size={18} className="text-cyan-400" /> },
            { id: 'app-schema_conformance_audit_tool', label: 'Schema Conformance Audit Tool', icon: <FileCode size={18} className="text-cyan-400" /> },
            { id: 'app-voter_registration_portal', label: 'Voter Registration Portal', icon: <FileCode size={18} className="text-cyan-400" /> },
            { id: 'app-camt053_transaction_exporter', label: 'CAMT053 Transaction Exporter', icon: <FileCode size={18} className="text-cyan-400" /> },
            { id: 'app-service_principal_provisioner', label: 'Service Principal Provisioner', icon: <FileCode size={18} className="text-cyan-400" /> },
            { id: 'app-schema_catalog_search_engine', label: 'Schema Catalog Search Engine', icon: <FileCode size={18} className="text-cyan-400" /> },
            { id: 'app-account_summary_mock_service', label: 'Account Summary Mock Service', icon: <FileCode size={18} className="text-cyan-400" /> },
            { id: 'app-azure_ad_app_auditor', label: 'Azure AD App Auditor', icon: <FileCode size={18} className="text-cyan-400" /> },
            { id: 'app-schema_validator_orchestrator', label: 'Schema Validator Orchestrator', icon: <FileCode size={18} className="text-cyan-400" /> },
            { id: 'app-cross_cloud_federation_manager', label: 'Cross Cloud Federation Manager', icon: <FileCode size={18} className="text-cyan-400" /> },
            { id: 'app-card_function_access_controller', label: 'Card Function Access Controller', icon: <FileCode size={18} className="text-cyan-400" /> },
            { id: 'app-api_response_conformance_validator', label: 'API Response Conformance Validator', icon: <FileCode size={18} className="text-cyan-400" /> },
            { id: 'app-balance_transfer_batch_scheduler', label: 'Balance Transfer Batch Scheduler', icon: <FileCode size={18} className="text-cyan-400" /> },
            { id: 'app-balance_transfer_calculator', label: 'Balance Transfer Calculator', icon: <FileCode size={18} className="text-cyan-400" /> },
            { id: 'app-card_test_suite_conformance_analyzer', label: 'Card Test Suite Conformance Analyzer', icon: <FileCode size={18} className="text-cyan-400" /> },
            { id: 'app-api_test_runner', label: 'API Test Runner', icon: <FileCode size={18} className="text-cyan-400" /> },
            { id: 'app-b2b_portfolio_wealth_analyzer', label: 'B2B Portfolio Wealth Analyzer', icon: <FileCode size={18} className="text-cyan-400" /> },
            { id: 'app-citi_account_interest_accrual_simulator', label: 'Citi Account Interest Accrual Simulator', icon: <FileCode size={18} className="text-cyan-400" /> },
            { id: 'app-b2b_transaction_categorizer', label: 'B2B Transaction Categorizer', icon: <FileCode size={18} className="text-cyan-400" /> },
            { id: 'app-b2b_routing_decryptor_validator', label: 'B2B Routing Decryptor Validator', icon: <FileCode size={18} className="text-cyan-400" /> },
            { id: 'app-audit_compliance_tracker', label: 'Audit Compliance Tracker', icon: <FileCode size={18} className="text-cyan-400" /> },
            { id: 'app-fedramp_compliance_monitor', label: 'FedRAMP Compliance Monitor', icon: <FileCode size={18} className="text-cyan-400" /> },
            { id: 'app-card_merchant_category_classifier', label: 'Card Merchant Category Classifier', icon: <FileCode size={18} className="text-cyan-400" /> },
            { id: 'app-balance_transfer_lead_generator', label: 'Balance Transfer Lead Generator', icon: <FileCode size={18} className="text-cyan-400" /> },
            { id: 'app-b2b_interest_rate_optimizer', label: 'B2B Interest Rate Optimizer', icon: <FileCode size={18} className="text-cyan-400" /> },
            { id: 'app-app_consent_analyzer', label: 'App Consent Analyzer', icon: <FileCode size={18} className="text-cyan-400" /> },
            { id: 'app-b2b_corporate_liquidity_forecaster', label: 'B2B Corporate Liquidity Forecaster', icon: <FileCode size={18} className="text-cyan-400" /> },
            { id: 'app-card_activation_simulator', label: 'Card Activation Simulator', icon: <FileCode size={18} className="text-cyan-400" /> },
            { id: 'app-credit_risk_analyzer', label: 'Credit Risk Analyzer', icon: <FileCode size={18} className="text-cyan-400" /> },
            { id: 'app-balance_transfer_eligibility_checker', label: 'Balance Transfer Eligibility Checker', icon: <FileCode size={18} className="text-cyan-400" /> },
            { id: 'app-treasury_reconciliation_engine', label: 'Treasury Reconciliation Engine', icon: <FileCode size={18} className="text-cyan-400" /> },
            { id: 'app-citiconnect_integration_gateway', label: 'CitiConnect Integration Gateway', icon: <FileCode size={18} className="text-cyan-400" /> },
            { id: 'app-citizenship_verification_gateway', label: 'Citizenship Verification Gateway', icon: <FileCode size={18} className="text-cyan-400" /> },
            { id: 'app-supplementary_card_orchestrator', label: 'Supplementary Card Orchestrator', icon: <FileCode size={18} className="text-cyan-400" /> },
        ]
    },
    {
        label: 'System',
        items: [
            { id: View.Rewards, label: 'Rewards Hub', icon: <Target size={18} className="text-red-400" /> },
            { id: View.TheVision, label: 'The Manifesto', icon: <Compass size={18} className="text-lime-400" /> },
            { id: View.PaymentMethods, label: 'Payment Gateways', icon: <Briefcase size={18} className="text-indigo-400" /> },
            { id: View.Settings, label: 'Core Settings', icon: <Settings size={18} className="text-gray-500" /> },
        ]
    }
];

export const NAV_ITEMS = NAV_SECTORS.flatMap(s => s.items);

export const SOVEREIGN_APPS: ExternalApp[] = [
  { id: 'app-files-vault', name: 'Sovereign Files & Dossier Vault', description: 'Direct access to all Executive Orders, 100-page Story pages, Legislative Bill chapters, and system files.', category: 'Security', viewId: View.FilesVault },
  { id: 'app-01', name: 'Executive Bridge Control', description: 'Primary OS interface for billionaire-tier asset management.', category: 'Security', viewId: View.Dashboard },
  { id: 'app-02', name: "The Sovereign's Ledger", description: 'Atomic-settlement transaction stream for verified architects.', category: 'Banking', viewId: View.GlobalLedger },
  { id: 'app-03', name: 'Intelligence Nexus', description: 'Deep-learning hub for portfolio trajectory and risk vectors.', category: 'AI', viewId: View.IntelligenceHub },
  { id: 'app-04', name: 'Legion I: Architect', description: 'Strategic reasoning engine for high-fidelity venture forge.', category: 'AI', viewId: View.LegionArchitect, isPremium: true },
  { id: 'app-05', name: 'Neural Recovery Mesh', description: 'Shamir-secret-sharing protocol for hardware-bound identity.', category: 'Security', viewId: View.RecoveryMesh },
  { id: 'app-06', name: 'Asset Forge v2.0', description: 'Multi-chain token issuance with AI-driven economic modeling.', category: 'Banking', viewId: View.TokenIssuance },
  { id: 'app-07', name: 'Global Command Integrations', description: 'Connect third-party enterprise meshes to the Sovereign Hub.', category: 'Dev', viewId: View.IntegrationsMarketplace },
  { id: 'app-08', name: 'Legion VI: Live Communion', description: 'Real-time low-latency voice interface with Gemini Core.', category: 'AI', viewId: View.LegionLive },
  { id: 'app-09', name: 'Neural Tools Suite', description: 'Low-level utilities for token estimation and topic distillation.', category: 'Dev', viewId: View.NeuralTools },
  { id: 'app-10', name: 'Identity Citadel', description: 'TEE hardware-bound root of trust for all user interactions.', category: 'Security', viewId: View.IdentityCitadel },
  
  // --- Integrated admin08077 Spaces ---
  { id: "AIBANKINGUNIVERSITY", name: "AI Banking University", description: "Comprehensive syllabus to AI_BANKING_9999 protocols.", category: "AI", isPremium: true },
  { id: "AIBANKINGUNIVERSITY-AI-AGENT-APP", name: "AI Agent App", description: "Specialized agent demonstration for James Burvel O'Callaghan III.", category: "AI", isPremium: true },
  { id: "Aiab", name: "Aiab Finance", description: "Personal finance management via sovereign Demo Bank interface.", category: "Banking" },
  { id: "Aib8nking", name: "Aib8nking", description: "Core finance management and settlement system.", category: "Banking" },
  { id: "Aibankdemo2", name: "Linked Ledger v2", description: "Advanced visualization for multiple linked bank accounts.", category: "Banking" },
  { id: "Aimobile", name: "AI Mobile Architect", description: "Context-aware code suggestions for sovereign mobile development.", category: "Dev" },
  { id: "Bb", name: "Bb Core UI", description: "Foundation UI components for the Demo Bank ecosystem.", category: "Dev" },
  { id: "Githubgemini", name: "GitHub Gemini Node", description: "Autonomous pull, recode, and push logic for neural repos.", category: "Dev", isPremium: true },
  { id: "Jamesocallaghanprivatebank", name: "Private Banking Citadel", description: "High-net-worth specialized banking interface.", category: "Banking", isPremium: true },
  { id: "Jbo3", name: "Jbo3 Data Matrix", description: "High-fidelity financial data visualization engine.", category: "Dev" },
  { id: "Jbo33", name: "Jbo33 Analytics", description: "Deep-learning analytics for market trajectory monitoring.", category: "AI" },
  { id: "NewWa", name: "Neural Markdown", description: "AI-enhanced markdown rendering engine.", category: "Dev" },
  { id: "Worldsfirstautonomousbank", name: "Autonomous Bank Hub", description: "Master configurations for self-governing financial spaces.", category: "Security", isPremium: true },
  { id: "Ai", name: "Core Neural Engine", description: "Base intelligence unit for the Aquarius Singularity.", category: "AI" },
  { id: "Ai-Banking-Sovereign", name: "Sovereign Banking Core", description: "Low-level banking logic for independent financial states.", category: "Security" },
  { id: "Aibankdemo", name: "Classic Banking Portal", description: "Simulated legacy banking interface for compatibility testing.", category: "Banking" },
  { id: "Aibanke", name: "Aibanke Insights", description: "Predictive banking insights and spending analysis.", category: "AI" },
  { id: "Aibankingdemo", name: "Secure Insights Node", description: "Encrypted financial analytics for verified visionary accounts.", category: "Security" },
  { id: "Aibankingthedemo", name: "Rapid Demo Node", description: "High-speed demonstration of AI banking capabilities.", category: "Banking" },
  { id: "Aidev", name: "DevCore AI Toolkit", description: "Neural development utilities for sovereign engineers.", category: "Dev" },
  { id: "Quantum-Code-Architect", name: "Quantum Code Forge", description: "Next-gen code engineering and symbolic reasoning.", category: "Dev", isPremium: true },
  { id: "Aippk", name: "Advanced Neural PPK", description: "Hardware-bound identity and key management.", category: "Security" },
  { id: "Airenderer", name: "AI Document Factory", description: "Markdown to high-fidelity HTML conversion engine.", category: "Dev" },
  { id: "Aitr", name: "Neural Chat Matrix", description: "Advanced conversational interface for AI communion.", category: "AI" },
  { id: "Apiai", name: "API Sovereign Gateway", description: "Centralized control for external neural service links.", category: "Dev" },
  { id: "THEUNORTHODOXCHRONICLESOFKAIANDHIS100ADVERSARIALAIAGENTS", name: "Adversarial Agents Hub", description: "The Unorthodox Chronicles: 100 agent logic simulator.", category: "AI", isPremium: true },
  { id: "Cc", name: "System Command Center", description: "Global monitoring and execution hub.", category: "Security" },
  { id: "Chatbot", name: "Legacy Chat Node", description: "Fallback conversational unit for standard banking queries.", category: "AI" },
  { id: "Chrome-Flags", name: "System Flag Registry", description: "Kernel-level system feature management.", category: "Dev" },
  { id: "Convo", name: "Convo Assistant", description: "Real-time pair-programming and code assistance.", category: "Dev" },
  { id: "D", name: "Aesthetic Gradient Engine", description: "Dynamic color and theme generation based on neural mood.", category: "Dev" },
  { id: "Demob", name: "Demo B Shard", description: "Isolated testing environment for beta banking modules.", category: "Banking" },
  { id: "Demoo", name: "Snippet Repository", description: "Collective intelligence code shard library.", category: "Dev" },
  { id: "Drip-Faucet", name: "Token Drip Faucet", description: "Test token issuance for sovereign DLT networks.", category: "Banking" },
  { id: "Fr", name: "FR Logic Interface", description: "Financial Relationship monitoring and mapping.", category: "Banking" },
  { id: "Genai", name: "Website Materializer", description: "Generative AI engine for rapid website prototyping.", category: "Dev" },
  { id: "Hhh", name: "Personal Wealth Matrix", description: "High-density personal finance tracker.", category: "Banking" },
  { id: "Inventions", name: "Venture Visualizer", description: "3D visualization of capital invention trajectories.", category: "Dev" },
  { id: "James", name: "Brilliance Engine", description: "High-order reasoning and creativity booster.", category: "AI" },
  { id: "Javascript-Python", name: "Polyglot Compiler", description: "Browser-based execution for multi-language shards.", category: "Dev" },
  { id: "Jocall3", name: "Portfolio Oracle", description: "AI-driven optimization for multi-chain asset portfolios.", category: "AI" },
  { id: "Learnhebrew", name: "Linguistic Portal", description: "Language acquisition module for global visionary expansion.", category: "Legacy" },
  { id: "Merrychristmas", name: "Seasonal Logic", description: "Context-aware seasonal UI and greeting protocols.", category: "Legacy" },
  { id: "Model", name: "Model Architecture Hub", description: "Interface for selecting and tuning active AI models.", category: "AI" },
  { id: "Monetize", name: "Yield Mapping Console", description: "Advanced financial metrics for monetization strategy.", category: "Banking" },
  { id: "Multi", name: "Multi-Tool Shard", description: "Versatile utility collection for system maintenance.", category: "Dev" },
  { id: "Mvp", name: "MVP0 Genesis Node", description: "The foundation of the sovereign application ecosystem.", category: "Dev" },
  { id: "Neww", name: "System Update Relay", description: "Centralized notification for new software updates.", category: "Dev" },
  { id: "Omniapi", name: "Universal API Bridge", description: "Inter-node communication for heterogeneous systems.", category: "Dev" },
  { id: "Openapi", name: "API Documentation Sanctum", description: "Source of truth for all integrated service documentation.", category: "Dev" },
  { id: "Pic-Editor", name: "Visual Studio Node", description: "AI-enhanced image editing and manipulation.", category: "AI" },
  { id: "Picgenai", name: "3D Image Forge", description: "High-fidelity 3D and 2D asset generation.", category: "AI" },
  { id: "Projectatlas", name: "Project Atlas", description: "Global mapping of financial and compute power.", category: "AI" },
  { id: "Quantumbank", name: "Quantum Banking Node", description: "Next-gen banking using quantum-resistant logic.", category: "Banking" },
  { id: "Remix-Eth", name: "Smart Contract Forge", description: "On-chain logic development for Ethereum-compatible chains.", category: "Banking" },
  { id: "Static", name: "Visual Telemetry Node", description: "Static visualization of complex system flows.", category: "Dev" },
  { id: "Test", name: "System Diagnostics", description: "Comprehensive health checks for the OS core.", category: "Security" },
  { id: "Trainn", name: "No-Code AI Studio", description: "Empowering non-technical visionaries with neural logic.", category: "AI" },
  { id: "Transactpro", name: "Atomic Transaction Engine", description: "High-throughput settlement engine for verified entities.", category: "Banking" },
  { id: "Veo", name: "Grounded Response Node", description: "AI responses validated against real-time web grounding.", category: "AI" },
  { id: "Webgenai", name: "Dynamic Web Forge", description: "AI-driven deployment of dynamic web applications.", category: "Dev" },
  { id: "Wf", name: "Workflow Architect", description: "Visual mapping and execution of automated business logic.", category: "Dev" },

  // --- Integrated Applications ---
  { id: 'app-github_audit_sync_agent', name: 'Github Audit Sync Agent', description: 'Synchronize and audit GitHub repositories.', category: 'Dev' },
  { id: 'app-b2b_routing_number_resolver', name: 'B2B Routing Number Resolver', description: 'Resolve and verify B2B routing numbers.', category: 'Banking' },
  { id: 'app-citi_account_excel_parser', name: 'Citi Account Excel Parser', description: 'Parse and ingest Citi account statements from Excel.', category: 'Banking' },
  { id: 'app-balance_transfer_analytics_dashboard', name: 'Balance Transfer Analytics', description: 'Analytics and reporting for balance transfers.', category: 'Banking' },
  { id: 'app-card_lifecycle_compliance_checker', name: 'Card Lifecycle Compliance', description: 'Check compliance across card lifecycles.', category: 'Security' },
  { id: 'app-broker_compliance_trade_auditor', name: 'Broker Compliance Trade Auditor', description: 'Audit broker trades for regulatory compliance.', category: 'Security' },
  { id: 'app-military_fund_allocator', name: 'Military Fund Allocator', description: 'Allocate and track military funding.', category: 'Banking' },
  { id: 'app-camt053_statement_parser', name: 'CAMT053 Statement Parser', description: 'Parse ISO 20022 CAMT.053 bank-to-customer statements.', category: 'Banking' },
  { id: 'app-camt053_balance_reconciler', name: 'CAMT053 Balance Reconciler', description: 'Reconcile bank balances using CAMT.053 files.', category: 'Banking' },
  { id: 'app-b2b_cash_flow_stress_tester', name: 'B2B Cash Flow Stress Tester', description: 'Stress test corporate cash flows under macro scenarios.', category: 'Banking' },
  { id: 'app-balance_transfer_compliance_auditor', name: 'Balance Transfer Compliance Auditor', description: 'Audit balance transfers for compliance.', category: 'Security' },
  { id: 'app-card_spend_limit_manager', name: 'Card Spend Limit Manager', description: 'Manage and enforce card spending limits.', category: 'Banking' },
  { id: 'app-financial_regulatory_guardrail', name: 'Financial Regulatory Guardrail', description: 'Enforce regulatory guardrails on transactions.', category: 'Security' },
  { id: 'app-citi_account_kyc_risk_profiler', name: 'Citi Account KYC Risk Profiler', description: 'Profile KYC risk for Citi accounts.', category: 'Security' },
  { id: 'app-statement_reconciliation_portal', name: 'Statement Reconciliation Portal', description: 'Reconcile bank statements with internal ledgers.', category: 'Banking' },
  { id: 'app-citi_account_anomaly_detector', name: 'Citi Account Anomaly Detector', description: 'Detect anomalies in Citi account transactions.', category: 'AI' },
  { id: 'app-card_listing_mock_server', name: 'Card Listing Mock Server', description: 'Mock server for card listing APIs.', category: 'Dev' },
  { id: 'app-multi_currency_balance_consolidator', name: 'Multi Currency Balance Consolidator', description: 'Consolidate balances across multiple currencies.', category: 'Banking' },
  { id: 'app-card_pin_hasher_validator', name: 'Card PIN Hasher Validator', description: 'Securely hash and validate card PINs.', category: 'Security' },
  { id: 'app-b2b_audit_trail_generator', name: 'B2B Audit Trail Generator', description: 'Generate immutable audit trails for B2B transactions.', category: 'Security' },
  { id: 'app-credit_limit_utilization_monitor', name: 'Credit Limit Utilization Monitor', description: 'Monitor credit limit utilization in real-time.', category: 'Banking' },
  { id: 'app-financial_statement_verifier', name: 'Financial Statement Verifier', description: 'Verify financial statements using AI.', category: 'AI' },
  { id: 'app-card_outstanding_balance_tracker', name: 'Card Outstanding Balance Tracker', description: 'Track outstanding balances on corporate cards.', category: 'Banking' },
  { id: 'app-broker_order_execution_simulator', name: 'Broker Order Execution Simulator', description: 'Simulate order execution across brokers.', category: 'Dev' },
  { id: 'app-pqc_crypto_bridge_simulator', name: 'PQC Crypto Bridge Simulator', description: 'Simulate post-quantum cryptographic bridges.', category: 'Security' },
  { id: 'app-election_integrity_dashboard', name: 'Election Integrity Dashboard', description: 'Monitor and verify election registration integrity.', category: 'Security' },
  { id: 'app-balance_transfer_disbursement_orchestrator', name: 'Balance Transfer Disbursement Orchestrator', description: 'Orchestrate disbursements for balance transfers.', category: 'Banking' },
  { id: 'app-cvv_decryption_mock_service', name: 'CVV Decryption Mock Service', description: 'Mock service for CVV decryption.', category: 'Dev' },
  { id: 'app-balance_transfer_interest_simulator', name: 'Balance Transfer Interest Simulator', description: 'Simulate interest accrual on balance transfers.', category: 'Banking' },
  { id: 'app-camt053_mock_generator', name: 'CAMT053 Mock Generator', description: 'Generate mock CAMT.053 statement files.', category: 'Dev' },
  { id: 'app-schema_catalog_custom_registry', name: 'Schema Catalog Custom Registry', description: 'Custom registry for API schema catalogs.', category: 'Dev' },
  { id: 'app-credit_card_simulator', name: 'Credit Card Simulator', description: 'Simulate credit card transactions and lifecycles.', category: 'Dev' },
  { id: 'app-card_tokenization_service', name: 'Card Tokenization Service', description: 'Tokenize sensitive card data.', category: 'Security' },
  { id: 'app-schema_conformance_audit_tool', name: 'Schema Conformance Audit Tool', description: 'Audit API responses for schema conformance.', category: 'Dev' },
  { id: 'app-voter_registration_portal', name: 'Voter Registration Portal', description: 'Portal for voter registration verification.', category: 'Security' },
  { id: 'app-camt053_transaction_exporter', name: 'CAMT053 Transaction Exporter', description: 'Export transactions to CAMT.053 format.', category: 'Banking' },
  { id: 'app-service_principal_provisioner', name: 'Service Principal Provisioner', description: 'Provision and manage Azure service principals.', category: 'Dev' },
  { id: 'app-schema_catalog_search_engine', name: 'Schema Catalog Search Engine', description: 'Search and discover API schemas.', category: 'Dev' },
  { id: 'app-account_summary_mock_service', name: 'Account Summary Mock Service', description: 'Mock service for account summaries.', category: 'Dev' },
  { id: 'app-azure_ad_app_auditor', name: 'Azure AD App Auditor', description: 'Audit Azure AD applications and permissions.', category: 'Security' },
  { id: 'app-schema_validator_orchestrator', name: 'Schema Validator Orchestrator', description: 'Orchestrate schema validation across services.', category: 'Dev' },
  { id: 'app-cross_cloud_federation_manager', name: 'Cross Cloud Federation Manager', description: 'Manage identity federation across clouds.', category: 'Security' },
  { id: 'app-card_function_access_controller', name: 'Card Function Access Controller', description: 'Control access to card functions.', category: 'Security' },
  { id: 'app-api_response_conformance_validator', name: 'API Response Conformance Validator', description: 'Validate API response conformance.', category: 'Dev' },
  { id: 'app-balance_transfer_batch_scheduler', name: 'Balance Transfer Batch Scheduler', description: 'Schedule batches for balance transfers.', category: 'Banking' },
  { id: 'app-balance_transfer_calculator', name: 'Balance Transfer Calculator', description: 'Calculate savings and terms for balance transfers.', category: 'Banking' },
  { id: 'app-card_test_suite_conformance_analyzer', name: 'Card Test Suite Conformance Analyzer', description: 'Analyze card test suite conformance.', category: 'Dev' },
  { id: 'app-api_test_runner', name: 'API Test Runner', description: 'Run automated API conformance tests.', category: 'Dev' },
  { id: 'app-b2b_portfolio_wealth_analyzer', name: 'B2B Portfolio Wealth Analyzer', description: 'Analyze wealth and portfolios for B2B clients.', category: 'Banking' },
  { id: 'app-citi_account_interest_accrual_simulator', name: 'Citi Account Interest Accrual Simulator', description: 'Simulate interest accrual on Citi accounts.', category: 'Banking' },
  { id: 'app-b2b_transaction_categorizer', name: 'B2B Transaction Categorizer', description: 'Categorize B2B transactions using AI.', category: 'AI' },
  { id: 'app-b2b_routing_decryptor_validator', name: 'B2B Routing Decryptor Validator', description: 'Decrypt and validate B2B routing numbers.', category: 'Security' },
  { id: 'app-audit_compliance_tracker', name: 'Audit Compliance Tracker', description: 'Track compliance audits and status.', category: 'Security' },
  { id: 'app-fedramp_compliance_monitor', name: 'FedRAMP Compliance Monitor', description: 'Monitor FedRAMP compliance status.', category: 'Security' },
  { id: 'app-card_merchant_category_classifier', name: 'Card Merchant Category Classifier', description: 'Classify card merchants using AI.', category: 'AI' },
  { id: 'app-balance_transfer_lead_generator', name: 'Balance Transfer Lead Generator', description: 'Generate leads for balance transfers.', category: 'AI' },
  { id: 'app-b2b_interest_rate_optimizer', name: 'B2B Interest Rate Optimizer', description: 'Optimize interest rates for B2B loans.', category: 'Banking' },
  { id: 'app-app_consent_analyzer', name: 'App Consent Analyzer', description: 'Analyze application consent and permissions.', category: 'Security' },
  { id: 'app-b2b_corporate_liquidity_forecaster', name: 'B2B Corporate Liquidity Forecaster', description: 'Forecast corporate liquidity.', category: 'Banking' },
  { id: 'app-card_activation_simulator', name: 'Card Activation Simulator', description: 'Simulate card activation flows.', category: 'Dev' },
  { id: 'app-credit_risk_analyzer', name: 'Credit Risk Analyzer', description: 'Analyze credit risk using AI.', category: 'AI' },
  { id: 'app-balance_transfer_eligibility_checker', name: 'Balance Transfer Eligibility Checker', description: 'Check eligibility for balance transfers.', category: 'Banking' },
  { id: 'app-treasury_reconciliation_engine', name: 'Treasury Reconciliation Engine', description: 'Reconcile treasury accounts.', category: 'Banking' },
  { id: 'app-citiconnect_integration_gateway', name: 'CitiConnect Integration Gateway', description: 'Integrate with CitiConnect APIs.', category: 'Banking' },
  { id: 'app-citizenship_verification_gateway', name: 'Citizenship Verification Gateway', description: 'Verify citizenship status.', category: 'Security' },
  { id: 'app-supplementary_card_orchestrator', name: 'Supplementary Card Orchestrator', description: 'Orchestrate supplementary card issuance.', category: 'Banking' }
];

export const banks = [
  { name: 'Chase', logo: <ShieldCheck size={24} className="text-blue-800" />, institution_id: 'ins_2' },
  { name: 'Bank of America', logo: <Target size={24} className="text-red-600" />, institution_id: 'ins_3' },
  { name: 'Wells Fargo', logo: <Zap size={24} className="text-yellow-600" />, institution_id: 'ins_4' },
];

export const ALL_FEATURES: Feature[] = [
  { id: 'feat_1', name: 'Neural Predictor', icon: '🧠', category: 'Intel', description: 'Real-time market forecasting' },
  { id: 'feat_2', name: 'Quantum Shield', icon: '🛡️', category: 'Vault', description: 'Advanced cryptographic protection' },
  { id: 'feat_3', name: 'Liquidity Bridge', icon: '🌉', category: 'Flow', description: 'Atomic cross-chain swaps' },
  { id: 'feat_4', name: 'Protocol Forge', icon: '🔨', category: 'Forge', description: 'Custom smart contract generation' },
  { id: 'feat_5', name: 'Sovereign ID', icon: '🆔', category: 'Core', description: 'Hardware-bound identity' },
  { id: 'feat_6', name: 'Data Mesh', icon: '🕸️', category: 'Mesh', description: 'Institutional data integration' },
];

export type SlotCategory = 'Core' | 'Intel' | 'Vault' | 'Flow' | 'Mesh' | 'Forge';
export const SLOTS: SlotCategory[] = ['Core', 'Intel', 'Vault', 'Flow', 'Mesh', 'Forge'];

export const AI_MODULES = [
  "https://admin08077-openapi.hf.space",
  "https://admin08077-ai-banking-sovereign.static.hf.space",
  "https://admin08077-aibanke.static.hf.space",
  "https://admin08077-citibank-demo-business-inc-ai-ban-king-demo.static.hf.space",
  "https://admin08077-1233.static.hf.space",
  "https://admin08077-inventions.static.hf.space",
  "https://admin08077-gemini-app-citibank-demo-business-inc-google.static.hf.space",
  "https://admin08077-aibankdemo2.static.hf.space",
  "https://admin08077-airenderer.static.hf.space",
  "https://admin08077-book.static.hf.space",
  "https://admin08077-merrychristmas.static.hf.space",
  "https://admin08077-apiai.static.hf.space",
  "https://admin08077-projectatlas.static.hf.space",
  "https://admin08077-jocall3.static.hf.space",
  "https://admin08077-demob.static.hf.space",
  "https://admin08077-aibanke.static.hf.space",
  "https://admin08077-ai-banking-sovereign.static.hf.space",
  "https://admin08077-static.static.hf.space",
  "https://admin08077-demoo.static.hf.space",
  "https://admin08077-webgenai.static.hf.space",
  "https://admin08077-aiab.static.hf.space",
  "https://admin08077-citibank-demo-business-inc-app.static.hf.space",
  "https://admin08077-aib8nking.static.hf.space",
  "https://admin08077-bb.static.hf.space",
  "https://admin08077-citibank-demo-business-inc-apps.static.hf.space",
  "https://admin08077-newwa.static.hf.space",
  "https://admin08077-jamesocallaghanprivatebank.hf.space",
  "https://admin08077-drip-faucet.static.hf.space",
  "https://admin08077-transactpro.hf.space",
  "https://admin08077-quantumbank.hf.space",
  "https://admin08077-test.hf.space"
];

================================================================================
// APPENDED FROM REPO: diplomat-bit/G20 | ORIGINAL PATH: diplomat-bit-G20-0199fa7/constants.tsx
================================================================================

// @/constants.tsx
import React from 'react';
import { View } from './types';

export const NAV_ITEMS = [
    { id: View.Dashboard, label: 'Dashboard', icon: <DashboardIcon /> },
    { id: View.CashManagement, label: 'Cash Management', icon: <CashManagementIcon /> },
    { id: View.Transactions, label: 'Transactions', icon: <TransactionsIcon /> },
    { id: View.SendMoney, label: 'Send Money', icon: <SendMoneyIcon /> },
    { id: View.Budgets, label: 'Budgets', icon: <BudgetsIcon /> },
    { id: View.Investments, label: 'Investments', icon: <InvestmentsIcon /> },
    { id: View.AIAdvisor, label: 'AI Advisor', icon: <AIAdvisorIcon /> },
    { id: View.QuantumWeaver, label: 'Quantum Weaver', icon: <QuantumWeaverIcon /> },
    { id: View.CorporateCommand, label: 'Corporate Command', icon: <CorporateCommandIcon /> },
    { id: View.AIImageStudio, label: 'AI Image Studio', icon: <AIImageStudioIcon /> },
    { id: View.AIAdStudio, label: 'AI Ad Studio', icon: <AIAdStudioIcon /> },
    { id: View.Crypto, label: 'Crypto & Web3', icon: <CryptoIcon /> },
    { id: View.Goals, label: 'Financial Goals', icon: <GoalsIcon /> },
    { id: View.Marketplace, label: 'Marketplace', icon: <MarketplaceIcon /> },
    { id: View.Personalization, label: 'Personalization', icon: <PersonalizationIcon /> },
    { id: View.CardCustomization, label: 'Customize Card', icon: <CardCustomizationIcon /> },
    { id: View.Security, label: 'Security', icon: <SecurityIcon /> },
    { id: View.OpenBanking, label: 'Open Banking', icon: <OpenBankingIcon /> },
    { id: View.FinancialDemocracy, label: 'Financial Democracy', icon: <FinancialDemocracyIcon /> },
    { id: View.Rewards, label: 'Rewards Hub', icon: <RewardsIcon /> },
    { id: View.CreditHealth, label: 'Credit Health', icon: <CreditHealthIcon /> },
    { id: View.Settings, label: 'Settings', icon: <SettingsIcon /> },
];

function DashboardIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
    );
}

function CashManagementIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m-1 4h1m5-8h1m-1 4h1m-1 4h1M9 21v-3.07a2 2 0 01.15-.76 2 2 0 011.6-1.17h.5a2 2 0 011.6 1.17c.1.4.15.76.15.76V21" />
        </svg>
    );
}

function TransactionsIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    );
}

function SendMoneyIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
    );
}

function BudgetsIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
    );
}

function InvestmentsIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
    );
}

function AIAdvisorIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
    );
}

function QuantumWeaverIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );
}

function AIAdStudioIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
    );
}

function AIImageStudioIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    );
}

function CryptoIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
    );
}

function GoalsIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v-6a2 2 0 012-2h2a2 2 0 012 2v6m-6 0h6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    );
}

function MarketplaceIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
    );
}

function PersonalizationIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 16v-2m8-8h-2M4 12H2m15.364 6.364l-1.414-1.414M6.343 6.343L4.929 4.929m12.728 12.728l-1.414-1.414M6.343 17.657l-1.414 1.414m12.02-6.02a4 4 0 11-5.656-5.656 4 4 0 015.656 5.656z" />
        </svg>
    );
}

function CardCustomizationIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 3l4.5 4.5-10.5 10.5h-4.5v-4.5l10.5-10.5z" />
        </svg>
    );
}

function SecurityIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944a11.955 11.955 0 019-2.606m0-15.394v15.394" />
        </svg>
    );
}

function OpenBankingIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
    );
}

function FinancialDemocracyIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c2 1 5 1 7 0 2-1 2.657-1.343 2.657-1.343a8 8 0 010 10z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    )
}

function CorporateCommandIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m-1 4h1m5-8h1m-1 4h1m-1 4h1M9 21v-3.07a2 2 0 01.15-.76 2 2 0 011.6-1.17h.5a2 2 0 011.6 1.17c.1.4.15.76.15.76V21" />
        </svg>
    );
}

function APIIntegrationIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
    );
}

function RewardsIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4H5z" />
        </svg>
    );
}

function CreditHealthIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
    );
}

function SettingsIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );
}

function VisionIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
    );
}

// FIX: Define logo components before the 'banks' array where they are referenced to avoid 'used before its declaration' errors.
const ChaseLogo = () => <div className="w-6 h-6 bg-blue-600 rounded" />;
const BofALogo = () => <div className="w-6 h-6 bg-red-600 rounded" />;
const WellsFargoLogo = () => <div className="w-6 h-6 bg-yellow-600 rounded" />;
const AmexLogo = () => <div className="w-6 h-6 bg-blue-400 rounded" />;
const CitiLogo = () => <div className="w-6 h-6 bg-red-400 rounded" />;

export const banks = [
    { name: 'Chase', logo: <ChaseLogo />, institution_id: 'ins_109960' },
    { name: 'Bank of America', logo: <BofALogo />, institution_id: 'ins_109950' },
    { name: 'Wells Fargo', logo: <WellsFargoLogo />, institution_id: 'ins_109980' },
    { name: 'American Express', logo: <AmexLogo />, institution_id: 'ins_100000' },
    { name: 'Citi', logo: <CitiLogo />, institution_id: 'ins_109970' },
];

export const AppTheme = {
    colors: {
        primary: { DEFAULT: '#06b6d4', light: '#22d3ee', dark: '#0891b2', text: '#ffffff' },
        secondary: { DEFAULT: '#6366f1', light: '#818cf8', dark: '#4f46e5' },
        background: { primary: '#030712', secondary: '#111827' }
    }
};

================================================================================
// APPENDED FROM REPO: diplomat-bit/illi | ORIGINAL PATH: diplomat-bit-illi-d81a5ee/constants.tsx
================================================================================


import { BibleBook, TriangularMetadata, PatternLayer } from './types';

export const PATTERN_LAYERS: PatternLayer[] = [
  // SCRIPTURE & LINGUISTICS
  { id: 'heb_std', name: 'Hebrew Standard', icon: 'fa-scroll', color: '#fbbf24', description: 'Classic Gematria (Aleph=1, Yod=10...).', category: 'Scripture' },
  { id: 'heb_ord', name: 'Hebrew Ordinal', icon: 'fa-arrow-down-1-9', color: '#f59e0b', description: 'Position in alphabet (1-22).', category: 'Scripture' },
  { id: 'heb_sof', name: 'Hebrew Soffit', icon: 'fa-file-signature', color: '#d97706', description: 'Includes final form values (500-900).', category: 'Scripture' },
  { id: 'grk_std', name: 'Greek Standard', icon: 'fa-monument', color: '#60a5fa', description: 'Classic Isopsephy (Alpha=1, Iota=10...).', category: 'Scripture' },
  { id: 'grk_ord', name: 'Greek Ordinal', icon: 'fa-align-left', color: '#3b82f6', description: 'NT Greek position values.', category: 'Scripture' },
  { id: 'eng_ord', name: 'English Ordinal', icon: 'fa-font', color: '#a78bfa', description: 'Standard A=1 to Z=26.', category: 'Scripture' },
  { id: 'eng_sum', name: 'English Sumerian', icon: 'fa-clapperboard', color: '#8b5cf6', description: 'English Ordinal * 6 resonance.', category: 'Scripture' },
  { id: 'eng_rev', name: 'English Reverse', icon: 'fa-rotate-left', color: '#7c3aed', description: 'Z=1 to A=26 reciprocal.', category: 'Scripture' },
  { id: 'ara_abj', name: 'Arabic Abjad', icon: 'fa-kaaba', color: '#10b981', description: 'Standard Islamic Abjadi values.', category: 'Scripture' },
  { id: 'san_kat', name: 'Sanskrit Katapayadi', icon: 'fa-om', color: '#f97316', description: 'Ancient Vedic number-to-letter.', category: 'Scripture' },
  { id: 'lat_iso', name: 'Latin Isopsephy', icon: 'fa-italic', color: '#94a3b8', description: 'Roman numerical letter values.', category: 'Scripture' },
  { id: 'atbash', name: 'Atbash Cipher', icon: 'fa-key', color: '#64748b', description: 'Biblical reciprocal substitution.', category: 'Scripture' },

  // PURE MATHEMATICS
  { id: 'tri_num', name: 'Triangular Numbers', icon: 'fa-play', color: '#fbbf24', description: 'n(n+1)/2 geometric growth.', category: 'Math' },
  { id: 'star_num', name: 'Star Numbers', icon: 'fa-star', color: '#facc15', description: '6n(n-1)+1 hexagram points.', category: 'Math' },
  { id: 'square_num', name: 'Square Numbers', icon: 'fa-square', color: '#3b82f6', description: 'n^2 perfect squares.', category: 'Math' },
  { id: 'cube_num', name: 'Cube Numbers', icon: 'fa-cube', color: '#6366f1', description: 'n^3 volumetric indices.', category: 'Math' },
  { id: 'pent_num', name: 'Pentagonal Numbers', icon: 'fa-pentagon', color: '#8b5cf6', description: 'n(3n-1)/2 geometry.', category: 'Math' },
  { id: 'hex_num', name: 'Hexagonal Numbers', icon: 'fa-honeycomb', color: '#fbbf24', description: 'n(2n-1) honeycomb indices.', category: 'Math' },
  { id: 'phi_ratio', name: 'Golden Ratio (Phi)', icon: 'fa-compass-drafting', color: '#fb923c', description: '1.618033 harmonic mean.', category: 'Math' },
  { id: 'pi_const', name: 'Pi Harmonics', icon: 'fa-circle-notch', color: '#2dd4bf', description: '3.14159 circle quadrature.', category: 'Math' },
  { id: 'euler_e', name: "Euler's Number (e)", icon: 'fa-signature', color: '#ec4899', description: '2.71828 natural growth.', category: 'Math' },
  { id: 'fib_seq', name: 'Fibonacci Series', icon: 'fa-dna', color: '#4ade80', description: 'Recursive biological scaling.', category: 'Math' },
  { id: 'lucas_num', name: 'Lucas Numbers', icon: 'fa-list-ol', color: '#22c55e', description: 'Fibonacci variant resonance.', category: 'Math' },
  { id: 'prime_num', name: 'Prime Numbers', icon: 'fa-divide', color: '#ef4444', description: 'Indivisible atomic units of math.', category: 'Math' },
  { id: 'mer_prime', name: 'Mersenne Primes', icon: 'fa-crown', color: '#f59e0b', description: '2^p - 1 mega-primes.', category: 'Math' },
  { id: 'perfect_num', name: 'Perfect Numbers', icon: 'fa-gem', color: '#38bdf8', description: 'Sum of divisors equals n.', category: 'Math' },
  { id: 'amicable', name: 'Amicable Pairs', icon: 'fa-heart', color: '#f43f5e', description: 'Mutual divisor friendships.', category: 'Math' },
  { id: 'narc_num', name: 'Narcissistic Numbers', icon: 'fa-mirror', color: '#a855f7', description: 'Sum of digits to power n.', category: 'Math' },
  { id: 'catalan', name: 'Catalan Numbers', icon: 'fa-diagram-project', color: '#6366f1', description: 'Polygon triangulation indices.', category: 'Math' },
  { id: 'pascals', name: "Pascal's Matrix", icon: 'fa-pyramid', color: '#c026d3', description: 'Binomial coefficient patterns.', category: 'Math' },

  // QUANTUM & PHYSICAL SCIENCE
  { id: 'atomic_wt', name: 'Atomic Weights', icon: 'fa-atom', color: '#818cf8', description: 'Elemental isotopic resonance.', category: 'Science' },
  { id: 'atomic_num', name: 'Atomic Numbers', icon: 'fa-list-ol', color: '#6366f1', description: 'Proton count signatures.', category: 'Science' },
  { id: 'dna_codon', name: 'DNA Codon Matrix', icon: 'fa-helix', color: '#f472b6', description: '64-base genetic harmonics.', category: 'Science' },
  { id: 'amino_acid', name: 'Amino Acid Mass', icon: 'fa-flask-vial', color: '#d946ef', description: 'Proteomic molecular weights.', category: 'Science' },
  { id: 'light_spd', name: 'Speed of Light', icon: 'fa-bolt', color: '#fbbf24', description: '299,792,458 m/s constant.', category: 'Science' },
  { id: 'planck_h', name: 'Planck Constant', icon: 'fa-microchip', color: '#22d3ee', description: 'Quantum of action scale.', category: 'Science' },
  { id: 'fine_str', name: 'Fine Structure', icon: 'fa-wave-square', color: '#f43f5e', description: 'The Alpha Constant (1/137).', category: 'Science' },
  { id: 'grav_const', name: 'Gravity (G)', icon: 'fa-weight-hanging', color: '#94a3b8', description: 'Universal attraction constant.', category: 'Science' },
  { id: 'boltzmann', name: 'Boltzmann (k)', icon: 'fa-fire-alt', color: '#f97316', description: 'Thermodynamic entropy units.', category: 'Science' },
  { id: 'avogadro', name: 'Avogadro (N_A)', icon: 'fa-cubes', color: '#0ea5e9', description: '6.022e23 molecular count.', category: 'Science' },
  { id: 'electron_v', name: 'Electron Volts', icon: 'fa-bolt-lightning', color: '#eab308', description: 'Quantum energy transitions.', category: 'Science' },
  { id: 'entropy', name: 'Shannon Entropy', icon: 'fa-wind', color: '#64748b', description: 'Linguistic information density.', category: 'Science' },

  // COSMIC RESONANCE
  { id: 'sol_cycle', name: 'Solar Cycle (666)', icon: 'fa-sun', color: '#ef4444', description: 'Magic square of the Sun math.', category: 'Cosmic' },
  { id: 'precession', name: 'Great Year (25920)', icon: 'fa-rotate', color: '#8b5cf6', description: 'Equinoctial precession cycle.', category: 'Cosmic' },
  { id: 'planets', name: 'Orbital Resonance', icon: 'fa-earth-americas', color: '#38bdf8', description: 'Keplerian planetary harmonics.', category: 'Cosmic' },
  { id: 'metonic', name: 'Metonic Cycle', icon: 'fa-moon', color: '#94a3b8', description: '19-year Lunar-Solar sync.', category: 'Cosmic' },
  { id: 'saros', name: 'Saros Cycle', icon: 'fa-eclipse', color: '#1e293b', description: 'Eclipse repetition math.', category: 'Cosmic' },
  { id: 'schumann', name: 'Schumann (7.83Hz)', icon: 'fa-broadcast-tower', color: '#4ade80', description: 'Earth ionosphere resonance.', category: 'Cosmic' },
  { id: 'stellar_mag', name: 'Stellar Magnitude', icon: 'fa-star-and-crescent', color: '#fde047', description: 'Luminosity log ratios.', category: 'Cosmic' },
  { id: 'gal_year', name: 'Galactic Year', icon: 'fa-bahai', color: '#6366f1', description: '230M year orbital revolution.', category: 'Cosmic' },
  { id: 'sirius_b', name: 'Sirius B Orbit', icon: 'fa-star', color: '#e2e8f0', description: '50-year orbital periodicity.', category: 'Cosmic' },

  // SACRED METROLOGY & HISTORY
  { id: 'jubilee', name: 'Jubilee Protocol', icon: 'fa-landmark', color: '#10b981', description: '50-year economic/social reset.', category: 'History' },
  { id: 'sacred_cubit', name: 'Sacred Cubit', icon: 'fa-ruler-combined', color: '#d946ef', description: '25.025 inch divine measure.', category: 'History' },
  { id: 'pyr_coord', name: 'Pyramid Latitudes', icon: 'fa-monument', color: '#fb923c', description: 'Giza Speed of Light sync.', category: 'History' },
  { id: 'temp_sol', name: 'Temple Geometry', icon: 'fa-synagogue', color: '#eab308', description: 'Solomonic architecture ratios.', category: 'History' },
  { id: 'mayan_long', name: 'Mayan Long Count', icon: 'fa-calendar-days', color: '#b91c1c', description: 'Baktun cycles (144,000 days).', category: 'History' },
  { id: 'stonehenge', name: 'Stonehenge Align', icon: 'fa-ring', color: '#475569', description: 'Megalithic astronomical math.', category: 'History' },
  { id: 'eye_horus', name: 'Eye of Horus', icon: 'fa-eye', color: '#0369a1', description: 'Fractional sensory math.', category: 'History' },
  { id: 'baktun', name: 'Baktun 13', icon: 'fa-hourglass-end', color: '#7f1d1d', description: 'Cataclysmic cycle resets.', category: 'History' },

  // ESOTERIC & ALCHEMICAL
  { id: 'names_72', name: '72 Names of God', icon: 'fa-shield-halved', color: '#fbbf24', description: 'Exodus 14:19-21 triplet coding.', category: 'History' },
  { id: 'sephirot', name: '10 Sephirot', icon: 'fa-tree', color: '#22c55e', description: 'Tree of Life emanations.', category: 'History' },
  { id: 'paths_22', name: '22 Paths', icon: 'fa-bridge', color: '#6366f1', description: 'Hebrew letter link chemistry.', category: 'History' },
  { id: 'hexagram_64', name: '64 Hexagrams', icon: 'fa-table-cells', color: '#000000', description: 'I-Ching binary permutations.', category: 'History' },
  { id: 'tarot_78', name: '78 Arcana', icon: 'fa-cards', color: '#ec4899', description: 'Symbolic archetypal indices.', category: 'History' },
  { id: 'zodiac_12', name: '12 Zodiac Signs', icon: 'fa-circle-dot', color: '#38bdf8', description: 'Eccliptic division harmonics.', category: 'History' }
];

export const BIBLE_BOOKS: BibleBook[] = [
  { index: 1, name: "Genesis", chapters: 50, isTriangular: true },
  { index: 2, name: "Exodus", chapters: 40, isTriangular: false },
  { index: 3, name: "Leviticus", chapters: 27, isTriangular: true },
  { index: 4, name: "Numbers", chapters: 36, isTriangular: false },
  { index: 5, name: "Deuteronomy", chapters: 34, isTriangular: false },
  { index: 6, name: "Joshua", chapters: 24, isTriangular: true },
  { index: 10, name: "2 Samuel", chapters: 24, isTriangular: true },
  { index: 15, name: "Ezra", chapters: 10, isTriangular: true },
  { index: 21, name: "Ecclesiastes", chapters: 12, isTriangular: true },
  { index: 28, name: "Hosea", chapters: 14, isTriangular: true },
  { index: 45, name: "Romans", chapters: 16, isTriangular: true },
  { index: 66, name: "Revelation", chapters: 22, isTriangular: true }
];

export const TRIANGULAR_VALUES: TriangularMetadata[] = [
  { index: 1, value: 1, significance: "Unity / Monad" },
  { index: 8, value: 36, significance: "Sum of 1-8" },
  { index: 17, value: 153, significance: "John 21:11 / Fish in Net" },
  { index: 18, value: 171, significance: "Face of God (P'nei El)" },
  { index: 36, value: 666, significance: "Sun Magic Square / Beast Sign" },
  { index: 73, value: 2701, significance: "Genesis 1:1 Standard Sum" },
  { index: 112, value: 6328, significance: "Genesis 1:1 + John 1:1 Sync" },
  { index: 153, value: 11781, significance: "Double Fish Resonance" }
];

export const HEBREW_MAP: Record<string, number> = {
  'א': 1, 'ב': 2, 'ג': 3, 'ד': 4, 'ה': 5, 'ו': 6, 'ז': 7, 'ח': 8, 'ט': 9,
  'י': 10, 'כ': 20, 'ל': 30, 'מ': 40, 'נ': 50, 'ס': 60, 'ע': 70, 'פ': 80, 'צ': 90,
  'ק': 100, 'ר': 200, 'ש': 300, 'ת': 400,
  // Final forms (Soffit) - optional based on mode
  'ך': 500, 'ם': 600, 'ן': 700, 'ף': 800, 'ץ': 900
};


================================================================================
// APPENDED FROM REPO: diplomat-bit/jamesburvelocallaghaniiiand | ORIGINAL PATH: diplomat-bit-jamesburvelocallaghaniiiand-9414e97/constants.tsx
================================================================================


import React from 'react';
import { Bot, FileText, Shuffle, PiggyBank, Target, Shield, TrendingUp, Gem, Code, Globe, Cuboid, Home, Palette, Percent, Rocket, Briefcase, Calculator, Scroll, Building, Landmark, Link, Users, Megaphone, Network, ShoppingBag, User, FileCog, Settings, Eye, CreditCard, Lock, Leaf, Activity, Cpu, AlertTriangle, Gift, Layers, Zap, Database, Server, Clipboard, Atom, Repeat, DollarSign, Sparkles, Terminal, BarChart2, PieChart, Box as BoxIcon, LifeBuoy, Grid, CheckCircle, Scale, LayoutDashboard, Mic, Book, Library } from 'lucide-react';
import { View } from './types';


export const banks = [
    { name: 'Chase', logo: <Building className="w-6 h-6 text-blue-600" />, institution_id: 'ins_1' },
    { name: 'Bank of America', logo: <Landmark className="w-6 h-6 text-red-600" />, institution_id: 'ins_2' },
    { name: 'Wells Fargo', logo: <Shield className="w-6 h-6 text-yellow-600" />, institution_id: 'ins_3' },
    { name: 'Citi', logo: <Globe className="w-6 h-6 text-blue-400" />, institution_id: 'ins_4' },
    { name: 'Capital One', logo: <CreditCard className="w-6 h-6 text-blue-800" />, institution_id: 'ins_5' },
];

export const NAV_ITEMS = [
    {
        group: 'Intelligence Command',
        items: [
            { view: View.Dashboard, title: 'Foundation Dashboard', icon: Bot },
            { view: View.Transactions, title: 'FlowMatrix (Transactions)', icon: FileText },
            { view: View.SendMoney, title: 'Quantum Pay', icon: Shuffle },
            { view: View.Budgets, title: 'Capital Allocation', icon: PiggyBank },
            { view: View.FinancialGoals, title: 'Strategic Goals', icon: Target },
            { view: View.CreditHealth, title: 'Credit Resonance', icon: Shield },
            { view: View.Personalization, title: 'Interface Will', icon: Settings },
            { view: View.Accounts, title: 'Accounts Overview', icon: Briefcase },
        ]
    },
    {
        group: 'The 527 Protocol',
        items: [
            { view: View.TheBook, title: 'The Blueprint (527 Pages)', icon: Book },
            { view: View.KnowledgeBase, title: 'The Academy', icon: Library },
        ]
    },
    {
        group: 'Infinite Wealth',
        items: [
            { view: View.Investments, title: 'Portfolio Overview', icon: TrendingUp },
            { view: View.Crypto, title: 'Web3 & Crypto', icon: Gem },
            { view: View.AlgoTradingLab, title: 'Algo-Trading Lab', icon: Code },
            { view: View.ForexArena, title: 'Forex Arena', icon: Globe },
            { view: View.CommoditiesExchange, title: 'Commodities', icon: Cuboid },
            { view: View.RealEstateEmpire, title: 'Real Estate', icon: Home },
            { view: View.ArtCollectibles, title: 'Art & Collectibles', icon: Palette },
            { view: View.DerivativesDesk, title: 'Derivatives', icon: Percent },
            { view: View.VentureCapital, title: 'Venture Capital', icon: Rocket },
            { view: View.PrivateEquity, title: 'Private Equity', icon: Briefcase },
            { view: View.TaxOptimization, title: 'Civic Contribution', icon: Calculator },
            { view: View.LegacyBuilder, title: 'Legacy Architect', icon: Scroll },
            { view: View.SovereignWealth, title: 'Wealth Simulation', icon: Landmark },
            { view: View.QuantumAssets, title: 'Quantum Assets', icon: Atom },
        ]
    },
    {
        group: 'Citi Connect Core',
        items: [
            { view: View.CitibankAccounts, title: 'Citi Accounts', icon: Building },
            { view: View.CitibankAccountProxy, title: 'Account Proxy', icon: Shuffle },
            { view: View.CitibankBillPay, title: 'Bill Payment', icon: FileText },
            { view: View.CitibankCrossBorder, title: 'Cross Border', icon: Globe },
            { view: View.CitibankPayeeManagement, title: 'Payee Mgmt', icon: Users },
            { view: View.CitibankStandingInstructions, title: 'Standing Instructions', icon: Repeat },
            { view: View.CitibankDeveloperTools, title: 'Citi Dev Tools', icon: Code },
            { view: View.CitibankEligibility, title: 'Eligibility Check', icon: CheckCircle },
            { view: View.CitibankUnmaskedData, title: 'Secure Data View', icon: Eye },
        ]
    },
    {
        group: 'Plaid Nexus',
        items: [
            { view: View.PlaidMainDashboard, title: 'Plaid Overview', icon: Activity },
            { view: View.PlaidIdentity, title: 'Identity Verification', icon: User },
            { view: View.PlaidCRAMonitoring, title: 'CRA Monitoring', icon: Eye },
            { view: View.PlaidInstitutions, title: 'Institutions Explorer', icon: Building },
            { view: View.PlaidItemManagement, title: 'Item Management', icon: Settings },
        ]
    },
    {
        group: 'Enterprise Operations',
        items: [
            { view: View.CorporateCommand, title: 'Corporate Command', icon: Building },
            { view: View.ModernTreasury, title: 'Modern Treasury', icon: Landmark },
            { view: View.Treasury, title: 'Treasury & Capital', icon: DollarSign },
            { view: View.CardPrograms, title: 'Marqeta Cards', icon: CreditCard },
            { view: View.Payments, title: 'Stripe Payments', icon: Zap },
            { view: View.StripeNexus, title: 'Stripe Nexus', icon: Link },
            { view: View.CounterpartyDashboard, title: 'Counterparties', icon: Users },
            { view: View.VirtualAccounts, title: 'Virtual Accounts', icon: Layers },
            { view: View.CorporateActions, title: 'Corporate Actions', icon: FileText },
            { view: View.CreditNoteLedger, title: 'Credit Notes', icon: FileText },
            { view: View.ReconciliationHub, title: 'Reconciliation Hub', icon: Shuffle },
            { view: View.GEINDashboard, title: 'GEIN Dashboard', icon: Network },
            { view: View.CardholderManagement, title: 'Cardholder Mgmt', icon: User },
             { view: View.VentureCapitalDeskView, title: 'VC Desk View', icon: Rocket },
        ]
    },
    {
        group: 'System & Intelligence',
        items: [
            { view: View.AIAdvisor, title: 'AI Advisor', icon: Bot },
            { view: View.AIInsights, title: 'Predictive Insights', icon: Sparkles },
            { view: View.QuantumWeaver, title: 'Quantum Weaver', icon: Network },
            { view: View.AgentMarketplace, title: 'Agent Marketplace', icon: ShoppingBag },
            { view: View.AIAdStudio, title: 'AI Ad Studio', icon: Megaphone },
            { view: View.GlobalPositionMap, title: 'Global Position Map', icon: Globe },
            { view: View.GlobalSsiHub, title: 'Global SSI Hub', icon: Database },
            { view: View.SecurityCompliance, title: 'Security & Compliance', icon: Shield },
            { view: View.DeveloperHub, title: 'Developer Hub', icon: Code },
            { view: View.SchemaExplorer, title: 'ISO 20022 Explorer', icon: FileCog },
            { view: View.ResourceGraph, title: 'Resource Graph', icon: Network },
            { view: View.TheVision, title: 'The Vision', icon: Eye },
            { view: View.ApiPlayground, title: 'API Playground', icon: Terminal },
            { view: View.ComplianceOracle, title: 'Compliance Oracle', icon: Scale },
        ]
    },
    {
        group: 'Admin & Tools',
        items: [
            { view: View.CustomerDashboard, title: 'Customer Dashboard', icon: Users },
            { view: View.VerificationReports, title: 'Verification Reports', icon: Clipboard },
            { view: View.FinancialReporting, title: 'Financial Reporting', icon: BarChart2 },
             { view: View.StripeNexusDashboard, title: 'Stripe Nexus Admin', icon: LayoutDashboard },
        ]
    },
    {
        group: 'All Components',
        items: [
            { view: View.AccountDetails, title: 'Account Details', icon: FileText },
            { view: View.AccountList, title: 'Account List', icon: FileText },
            { view: View.AccountStatementGrid, title: 'Account Statement Grid', icon: Grid },
            { view: View.AccountsView, title: 'Accounts View', icon: Briefcase },
            { view: View.AccountVerificationModal, title: 'Acct Verification Modal', icon: Shield },
            { view: View.ACHDetailsDisplay, title: 'ACH Details Display', icon: FileText },
            { view: View.AICommandLog, title: 'AI Command Log', icon: Terminal },
            { view: View.AIPredictionWidget, title: 'AI Prediction Widget', icon: Sparkles },
            { view: View.AssetCatalog, title: 'Asset Catalog', icon: BoxIcon },
            { view: View.AutomatedSweepRules, title: 'Automated Sweep Rules', icon: Repeat },
            { view: View.BalanceReportChart, title: 'Balance Report Chart', icon: BarChart2 },
            { view: View.BalanceTransactionTable, title: 'Balance Txn Table', icon: FileText },
            { view: View.CardDesignVisualizer, title: 'Card Design Visualizer', icon: Palette },
            { view: View.ChargeDetailModal, title: 'Charge Detail Modal', icon: FileText },
            { view: View.ChargeList, title: 'Charge List', icon: FileText },
            { view: View.ConductorConfigurationView, title: 'Conductor Config', icon: Settings },
            { view: View.CounterpartyDetails, title: 'Counterparty Details', icon: User },
            { view: View.CounterpartyForm, title: 'Counterparty Form', icon: FileCog },
            { view: View.DisruptionIndexMeter, title: 'Disruption Index Meter', icon: Activity },
            { view: View.DocumentUploader, title: 'Document Uploader', icon: FileCog },
            { view: View.DownloadLink, title: 'Download Link', icon: Link },
            { view: View.EarlyFraudWarningFeed, title: 'Fraud Warning Feed', icon: AlertTriangle },
            { view: View.ElectionChoiceForm, title: 'Election Choice Form', icon: FileCog },
            { view: View.EventNotificationCard, title: 'Event Notification Card', icon: Megaphone },
            { view: View.ExpectedPaymentsTable, title: 'Expected Payments Table', icon: FileText },
            { view: View.ExternalAccountCard, title: 'External Account Card', icon: CreditCard },
            { view: View.ExternalAccountForm, title: 'External Account Form', icon: FileCog },
            { view: View.ExternalAccountsTable, title: 'External Accounts Table', icon: FileText },
            { view: View.FinancialAccountCard, title: 'Financial Account Card', icon: CreditCard },
            { view: View.IncomingPaymentDetailList, title: 'Incoming Pmt Detail', icon: FileText },
            { view: View.InvoiceFinancingRequest, title: 'Invoice Financing Req', icon: FileCog },
            { view: View.PaymentInitiationForm, title: 'Payment Initiation Form', icon: FileCog },
            { view: View.PaymentMethodDetails, title: 'Pmt Method Details', icon: FileText },
            { view: View.PaymentOrderForm, title: 'Payment Order Form', icon: FileCog },
            { view: View.PayoutsDashboard, title: 'Payouts Dashboard', icon: DollarSign },
            { view: View.PnLChart, title: 'PnL Chart', icon: PieChart },
            { view: View.RefundForm, title: 'Refund Form', icon: FileCog },
            { view: View.RemittanceInfoEditor, title: 'Remittance Info Editor', icon: FileCog },
            { view: View.ReportingView, title: 'Reporting View', icon: BarChart2 },
            { view: View.ReportRunGenerator, title: 'Report Run Generator', icon: FileCog },
            { view: View.ReportStatusIndicator, title: 'Report Status Indicator', icon: Activity },
            { view: View.SsiEditorForm, title: 'SSI Editor Form', icon: FileCog },
            { view: View.StripeNexusView, title: 'Stripe Nexus View', icon: Link },
            { view: View.StripeStatusBadge, title: 'Stripe Status Badge', icon: Shield },
            { view: View.StructuredPurposeInput, title: 'Structured Purpose Input', icon: FileCog },
            { view: View.SubscriptionList, title: 'Subscription List', icon: FileText },
            { view: View.TimeSeriesChart, title: 'Time Series Chart', icon: BarChart2 },
            { view: View.TradeConfirmationModal, title: 'Trade Confirm Modal', icon: FileText },
            { view: View.TransactionFilter, title: 'Transaction Filter', icon: FileCog },
            { view: View.TransactionList, title: 'Transaction List', icon: FileText },
            { view: View.TreasuryTransactionList, title: 'Treasury Txn List', icon: FileText },
            { view: View.UniversalObjectInspector, title: 'Object Inspector', icon: Eye },
            { view: View.VirtualAccountForm, title: 'Virtual Acct Form', icon: FileCog },
            { view: View.VirtualAccountsTable, title: 'Virtual Accts Table', icon: FileText },
            { view: View.VoiceControl, title: 'Voice Control', icon: Mic },
            { view: View.WebhookSimulator, title: 'Webhook Simulator', icon: Terminal },
        ]
    }
];

export const AppTheme = {
    colors: {
        primary: {
            DEFAULT: '#06b6d4',
            light: '#67e8f9',
            dark: '#0e7490',
        },
        secondary: {
            DEFAULT: '#6366f1',
            light: '#a5b4fc',
            dark: '#4338ca',
        },
        background: {
            main: '#111827',
            card: 'rgba(31, 41, 55, 0.5)',
            interactive: '#374151',
        },
        text: {
            main: '#f9fafb',
            headings: '#ffffff',
            muted: '#9ca3af',
            accent: '#e5e7eb',
        },
        status: {
            success: '#22c55e',
            warning: '#f59e0b',
            error: '#ef4444',
            info: '#3b82f6',
        },
        border: {
            DEFAULT: 'rgba(75, 85, 99, 0.6)',
            interactive: 'rgba(6, 182, 212, 0.5)',
        },
    },
};


================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/constants.tsx
================================================================================


import React from 'react';
import { Bot, FileText, Shuffle, PiggyBank, Target, Shield, TrendingUp, Gem, Code, Globe, Cuboid, Home, Palette, Percent, Rocket, Briefcase, Calculator, Scroll, Building, Landmark, Link, Users, Megaphone, Network, ShoppingBag, User, FileCog, Settings, Eye, CreditCard, Lock, Leaf, Activity, Cpu, AlertTriangle, Gift, Layers, Zap, Database, Server, Clipboard, Atom, Repeat, DollarSign, Sparkles, Terminal, BarChart2, PieChart, Box as BoxIcon, LifeBuoy, Grid, CheckCircle, Scale, LayoutDashboard, Mic, Book, Library } from 'lucide-react';
import { View } from './types';


export const banks = [
    { name: 'Chase', logo: <Building className="w-6 h-6 text-blue-600" />, institution_id: 'ins_1' },
    { name: 'Bank of America', logo: <Landmark className="w-6 h-6 text-red-600" />, institution_id: 'ins_2' },
    { name: 'Wells Fargo', logo: <Shield className="w-6 h-6 text-yellow-600" />, institution_id: 'ins_3' },
    { name: 'Citi', logo: <Globe className="w-6 h-6 text-blue-400" />, institution_id: 'ins_4' },
    { name: 'Capital One', logo: <CreditCard className="w-6 h-6 text-blue-800" />, institution_id: 'ins_5' },
];

export const NAV_ITEMS = [
    {
        group: 'Intelligence Command',
        items: [
            { view: View.Dashboard, title: 'Foundation Dashboard', icon: Bot },
            { view: View.Transactions, title: 'FlowMatrix (Transactions)', icon: FileText },
            { view: View.SendMoney, title: 'Quantum Pay', icon: Shuffle },
            { view: View.Budgets, title: 'Capital Allocation', icon: PiggyBank },
            { view: View.FinancialGoals, title: 'Strategic Goals', icon: Target },
            { view: View.CreditHealth, title: 'Credit Resonance', icon: Shield },
            { view: View.Personalization, title: 'Interface Will', icon: Settings },
            { view: View.Accounts, title: 'Accounts Overview', icon: Briefcase },
        ]
    },
    {
        group: 'The 527 Protocol',
        items: [
            { view: View.TheBook, title: 'The Blueprint (527 Pages)', icon: Book },
            { view: View.KnowledgeBase, title: 'The Academy', icon: Library },
        ]
    },
    {
        group: 'Infinite Wealth',
        items: [
            { view: View.Investments, title: 'Portfolio Overview', icon: TrendingUp },
            { view: View.Crypto, title: 'Web3 & Crypto', icon: Gem },
            { view: View.AlgoTradingLab, title: 'Algo-Trading Lab', icon: Code },
            { view: View.ForexArena, title: 'Forex Arena', icon: Globe },
            { view: View.CommoditiesExchange, title: 'Commodities', icon: Cuboid },
            { view: View.RealEstateEmpire, title: 'Real Estate', icon: Home },
            { view: View.ArtCollectibles, title: 'Art & Collectibles', icon: Palette },
            { view: View.DerivativesDesk, title: 'Derivatives', icon: Percent },
            { view: View.VentureCapital, title: 'Venture Capital', icon: Rocket },
            { view: View.PrivateEquity, title: 'Private Equity', icon: Briefcase },
            { view: View.TaxOptimization, title: 'Civic Contribution', icon: Calculator },
            { view: View.LegacyBuilder, title: 'Legacy Architect', icon: Scroll },
            { view: View.SovereignWealth, title: 'Wealth Simulation', icon: Landmark },
            { view: View.QuantumAssets, title: 'Quantum Assets', icon: Atom },
        ]
    },
    {
        group: 'Citi Connect Core',
        items: [
            { view: View.CitibankAccounts, title: 'Citi Accounts', icon: Building },
            { view: View.CitibankAccountProxy, title: 'Account Proxy', icon: Shuffle },
            { view: View.CitibankBillPay, title: 'Bill Payment', icon: FileText },
            { view: View.CitibankCrossBorder, title: 'Cross Border', icon: Globe },
            { view: View.CitibankPayeeManagement, title: 'Payee Mgmt', icon: Users },
            { view: View.CitibankStandingInstructions, title: 'Standing Instructions', icon: Repeat },
            { view: View.CitibankDeveloperTools, title: 'Citi Dev Tools', icon: Code },
            { view: View.CitibankEligibility, title: 'Eligibility Check', icon: CheckCircle },
            { view: View.CitibankUnmaskedData, title: 'Secure Data View', icon: Eye },
        ]
    },
    {
        group: 'Plaid Nexus',
        items: [
            { view: View.PlaidMainDashboard, title: 'Plaid Overview', icon: Activity },
            { view: View.PlaidIdentity, title: 'Identity Verification', icon: User },
            { view: View.PlaidCRAMonitoring, title: 'CRA Monitoring', icon: Eye },
            { view: View.PlaidInstitutions, title: 'Institutions Explorer', icon: Building },
            { view: View.PlaidItemManagement, title: 'Item Management', icon: Settings },
        ]
    },
    {
        group: 'Enterprise Operations',
        items: [
            { view: View.CorporateCommand, title: 'Corporate Command', icon: Building },
            { view: View.ModernTreasury, title: 'Modern Treasury', icon: Landmark },
            { view: View.Treasury, title: 'Treasury & Capital', icon: DollarSign },
            { view: View.CardPrograms, title: 'Marqeta Cards', icon: CreditCard },
            { view: View.Payments, title: 'Stripe Payments', icon: Zap },
            { view: View.StripeNexus, title: 'Stripe Nexus', icon: Link },
            { view: View.CounterpartyDashboard, title: 'Counterparties', icon: Users },
            { view: View.VirtualAccounts, title: 'Virtual Accounts', icon: Layers },
            { view: View.CorporateActions, title: 'Corporate Actions', icon: FileText },
            { view: View.CreditNoteLedger, title: 'Credit Notes', icon: FileText },
            { view: View.ReconciliationHub, title: 'Reconciliation Hub', icon: Shuffle },
            { view: View.GEINDashboard, title: 'GEIN Dashboard', icon: Network },
            { view: View.CardholderManagement, title: 'Cardholder Mgmt', icon: User },
             { view: View.VentureCapitalDeskView, title: 'VC Desk View', icon: Rocket },
        ]
    },
    {
        group: 'System & Intelligence',
        items: [
            { view: View.AIAdvisor, title: 'AI Advisor', icon: Bot },
            { view: View.AIInsights, title: 'Predictive Insights', icon: Sparkles },
            { view: View.QuantumWeaver, title: 'Quantum Weaver', icon: Network },
            { view: View.AgentMarketplace, title: 'Agent Marketplace', icon: ShoppingBag },
            { view: View.AIAdStudio, title: 'AI Ad Studio', icon: Megaphone },
            { view: View.GlobalPositionMap, title: 'Global Position Map', icon: Globe },
            { view: View.GlobalSsiHub, title: 'Global SSI Hub', icon: Database },
            { view: View.SecurityCompliance, title: 'Security & Compliance', icon: Shield },
            { view: View.DeveloperHub, title: 'Developer Hub', icon: Code },
            { view: View.SchemaExplorer, title: 'ISO 20022 Explorer', icon: FileCog },
            { view: View.ResourceGraph, title: 'Resource Graph', icon: Network },
            { view: View.TheVision, title: 'The Vision', icon: Eye },
            { view: View.ApiPlayground, title: 'API Playground', icon: Terminal },
            { view: View.ComplianceOracle, title: 'Compliance Oracle', icon: Scale },
        ]
    },
    {
        group: 'Admin & Tools',
        items: [
            { view: View.CustomerDashboard, title: 'Customer Dashboard', icon: Users },
            { view: View.VerificationReports, title: 'Verification Reports', icon: Clipboard },
            { view: View.FinancialReporting, title: 'Financial Reporting', icon: BarChart2 },
             { view: View.StripeNexusDashboard, title: 'Stripe Nexus Admin', icon: LayoutDashboard },
        ]
    },
    {
        group: 'All Components',
        items: [
            { view: View.AccountDetails, title: 'Account Details', icon: FileText },
            { view: View.AccountList, title: 'Account List', icon: FileText },
            { view: View.AccountStatementGrid, title: 'Account Statement Grid', icon: Grid },
            { view: View.AccountsView, title: 'Accounts View', icon: Briefcase },
            { view: View.AccountVerificationModal, title: 'Acct Verification Modal', icon: Shield },
            { view: View.ACHDetailsDisplay, title: 'ACH Details Display', icon: FileText },
            { view: View.AICommandLog, title: 'AI Command Log', icon: Terminal },
            { view: View.AIPredictionWidget, title: 'AI Prediction Widget', icon: Sparkles },
            { view: View.AssetCatalog, title: 'Asset Catalog', icon: BoxIcon },
            { view: View.AutomatedSweepRules, title: 'Automated Sweep Rules', icon: Repeat },
            { view: View.BalanceReportChart, title: 'Balance Report Chart', icon: BarChart2 },
            { view: View.BalanceTransactionTable, title: 'Balance Txn Table', icon: FileText },
            { view: View.CardDesignVisualizer, title: 'Card Design Visualizer', icon: Palette },
            { view: View.ChargeDetailModal, title: 'Charge Detail Modal', icon: FileText },
            { view: View.ChargeList, title: 'Charge List', icon: FileText },
            { view: View.ConductorConfigurationView, title: 'Conductor Config', icon: Settings },
            { view: View.CounterpartyDetails, title: 'Counterparty Details', icon: User },
            { view: View.CounterpartyForm, title: 'Counterparty Form', icon: FileCog },
            { view: View.DisruptionIndexMeter, title: 'Disruption Index Meter', icon: Activity },
            { view: View.DocumentUploader, title: 'Document Uploader', icon: FileCog },
            { view: View.DownloadLink, title: 'Download Link', icon: Link },
            { view: View.EarlyFraudWarningFeed, title: 'Fraud Warning Feed', icon: AlertTriangle },
            { view: View.ElectionChoiceForm, title: 'Election Choice Form', icon: FileCog },
            { view: View.EventNotificationCard, title: 'Event Notification Card', icon: Megaphone },
            { view: View.ExpectedPaymentsTable, title: 'Expected Payments Table', icon: FileText },
            { view: View.ExternalAccountCard, title: 'External Account Card', icon: CreditCard },
            { view: View.ExternalAccountForm, title: 'External Account Form', icon: FileCog },
            { view: View.ExternalAccountsTable, title: 'External Accounts Table', icon: FileText },
            { view: View.FinancialAccountCard, title: 'Financial Account Card', icon: CreditCard },
            { view: View.IncomingPaymentDetailList, title: 'Incoming Pmt Detail', icon: FileText },
            { view: View.InvoiceFinancingRequest, title: 'Invoice Financing Req', icon: FileCog },
            { view: View.PaymentInitiationForm, title: 'Payment Initiation Form', icon: FileCog },
            { view: View.PaymentMethodDetails, title: 'Pmt Method Details', icon: FileText },
            { view: View.PaymentOrderForm, title: 'Payment Order Form', icon: FileCog },
            { view: View.PayoutsDashboard, title: 'Payouts Dashboard', icon: DollarSign },
            { view: View.PnLChart, title: 'PnL Chart', icon: PieChart },
            { view: View.RefundForm, title: 'Refund Form', icon: FileCog },
            { view: View.RemittanceInfoEditor, title: 'Remittance Info Editor', icon: FileCog },
            { view: View.ReportingView, title: 'Reporting View', icon: BarChart2 },
            { view: View.ReportRunGenerator, title: 'Report Run Generator', icon: FileCog },
            { view: View.ReportStatusIndicator, title: 'Report Status Indicator', icon: Activity },
            { view: View.SsiEditorForm, title: 'SSI Editor Form', icon: FileCog },
            { view: View.StripeNexusView, title: 'Stripe Nexus View', icon: Link },
            { view: View.StripeStatusBadge, title: 'Stripe Status Badge', icon: Shield },
            { view: View.StructuredPurposeInput, title: 'Structured Purpose Input', icon: FileCog },
            { view: View.SubscriptionList, title: 'Subscription List', icon: FileText },
            { view: View.TimeSeriesChart, title: 'Time Series Chart', icon: BarChart2 },
            { view: View.TradeConfirmationModal, title: 'Trade Confirm Modal', icon: FileText },
            { view: View.TransactionFilter, title: 'Transaction Filter', icon: FileCog },
            { view: View.TransactionList, title: 'Transaction List', icon: FileText },
            { view: View.TreasuryTransactionList, title: 'Treasury Txn List', icon: FileText },
            { view: View.UniversalObjectInspector, title: 'Object Inspector', icon: Eye },
            { view: View.VirtualAccountForm, title: 'Virtual Acct Form', icon: FileCog },
            { view: View.VirtualAccountsTable, title: 'Virtual Accts Table', icon: FileText },
            { view: View.VoiceControl, title: 'Voice Control', icon: Mic },
            { view: View.WebhookSimulator, title: 'Webhook Simulator', icon: Terminal },
        ]
    }
];

export const AppTheme = {
    colors: {
        primary: {
            DEFAULT: '#06b6d4',
            light: '#67e8f9',
            dark: '#0e7490',
        },
        secondary: {
            DEFAULT: '#6366f1',
            light: '#a5b4fc',
            dark: '#4338ca',
        },
        background: {
            main: '#111827',
            card: 'rgba(31, 41, 55, 0.5)',
            interactive: '#374151',
        },
        text: {
            main: '#f9fafb',
            headings: '#ffffff',
            muted: '#9ca3af',
            accent: '#e5e7eb',
        },
        status: {
            success: '#22c55e',
            warning: '#f59e0b',
            error: '#ef4444',
            info: '#3b82f6',
        },
        border: {
            DEFAULT: 'rgba(75, 85, 99, 0.6)',
            interactive: 'rgba(6, 182, 212, 0.5)',
        },
    },
};


================================================================================
// APPENDED FROM REPO: diplomat-bit/tts-ai-book-reader-it-can-read-entire-books | ORIGINAL PATH: diplomat-bit-tts-ai-book-reader-it-can-read-entire-books-128ebf1/constants.tsx
================================================================================


import React from 'react';
import { VoiceOption } from './types';

export const VOICE_OPTIONS: VoiceOption[] = [
  { id: 'Kore', name: 'Kore', description: 'Clear and bright', gender: 'Female' },
  { id: 'Zephyr', name: 'Zephyr', description: 'Warm and friendly', gender: 'Male' },
  { id: 'Puck', name: 'Puck', description: 'Energetic and playful', gender: 'Male' },
  { id: 'Charon', name: 'Charon', description: 'Deep and resonant', gender: 'Male' },
  { id: 'Fenrir', name: 'Fenrir', description: 'Strong and authoritative', gender: 'Male' },
];

export const APP_THEME = {
  primary: 'from-indigo-500 to-purple-600',
  secondary: 'bg-slate-800',
  accent: 'text-indigo-400',
};
