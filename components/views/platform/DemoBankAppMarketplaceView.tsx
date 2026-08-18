// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/platform/DemoBankAppMarketplaceView.tsx
================================================================================

import React, { useState, useEffect, useMemo, useCallback, useRef, createContext, useContext, useReducer, ReactNode } from 'react';
import Card from '../../Card';

// ===================================================================================
// TYPE DEFINITIONS FOR A REAL-WORLD, LARGE-SCALE MARKETPLACE
// ===================================================================================

export interface Developer {
    id: string;
    name: string;
    website: string;
    supportEmail: string;
    location: string;
    isVerified: boolean;
    bio: string;
}

export interface Review {
    id: string;
    appId: number;
    author: string;
    authorProfile: string; // e.g., 'CFO, Acme Corp'
    avatarUrl: string;
    rating: number; // 1 to 5
    title: string;
    comment: string;
    date: string; // ISO 8601 format
    isVerifiedPurchase: boolean;
    helpfulVotes: number;
}

export interface Category {
    id: string;
    name: string;
    description: string;
    icon: string; // SVG path data
}

export interface ChangelogEntry {
    version: string;
    date: string; // ISO 8601 format
    changes: string[];
}

export type SecurityCompliance = 'SOC2' | 'ISO27001' | 'GDPR' | 'HIPAA' | 'PCI-DSS';

export interface App {
    id: number;
    name: string;
    category: string;
    categoryId: string;
    installs: number;
    description: string;
    longDescription: string;
    icon: string; // SVG path data
    developerId: string;
    version: string;
    lastUpdated: string; // ISO 8601 format
    rating: number; // Average rating
    permissions: string[];
    screenshots: string[];
    tags: string[];
    pricing: 'Free' | 'Freemium' | 'Paid' | 'Contact Us';
    featured: boolean;
    trendingScore: number; // Calculated metric for 'trending' sort
    changelog: ChangelogEntry[];
    securityCompliance: SecurityCompliance[];
    videoUrl?: string;
}

export interface AIReviewSummary {
    pros: string[];
    cons: string[];
    sentiment: 'Overwhelmingly Positive' | 'Mostly Positive' | 'Mixed' | 'Mostly Negative';
    overallSummary: string;
}

export interface AIPermissionAnalysis {
    level: 'Low Risk' | 'Medium Risk' | 'High Risk';
    summary: string;
    details: { permission: string; explanation: string; risk: string }[];
}

export type SortOption = 'installs' | 'name' | 'rating' | 'newest' | 'trending';
export type ApiStatus = 'idle' | 'loading' | 'succeeded' | 'failed';
export interface ApiError {
    message: string;
}

// ===================================================================================
// MOCK DATABASE & API SERVICE
// This simulates a real backend with a comprehensive dataset.
// ===================================================================================

export const mockDevelopers: Developer[] = [
    { id: 'dev-001', name: 'QuantumLeap Solutions', website: 'https://quantumleap.dev', supportEmail: 'support@quantumleap.dev', location: 'San Francisco, USA', isVerified: true, bio: 'Pioneering AI-driven financial tools for the next generation of business.' },
    { id: 'dev-002', name: 'ConnectFlow Inc.', website: 'https://connectflow.io', supportEmail: 'help@connectflow.io', location: 'New York, USA', isVerified: true, bio: 'Building the future of business automation, one connection at a time.' },
    { id: 'dev-003', name: 'Insight BI Systems', website: 'https://insightbi.com', supportEmail: 'support@insightbi.com', location: 'London, UK', isVerified: true, bio: 'Turning complex data into beautiful, actionable insights.' },
    { id: 'dev-004', name: 'SecureVault Co.', website: 'https://securevault.co', supportEmail: 'contact@securevault.co', location: 'Berlin, Germany', isVerified: false, bio: 'Dedicated to providing enterprise-grade security for businesses of all sizes.' },
    { id: 'dev-005', name: 'PayStream Finance', website: 'https://paystream.finance', supportEmail: 'support@paystream.finance', location: 'Singapore', isVerified: true, bio: 'Simplifying global payments with a robust and developer-friendly platform.' },
    { id: 'dev-006', name: 'HR Fusion', website: 'https://hrfusion.com', supportEmail: 'support@hrfusion.com', location: 'Toronto, Canada', isVerified: true, bio: 'Integrated HR and payroll solutions that put people first.' },
    { id: 'dev-007', name: 'MarketSync', website: 'https://marketsync.ai', supportEmail: 'help@marketsync.ai', location: 'Tokyo, Japan', isVerified: true, bio: 'Leveraging AI to bridge the gap between sales data and marketing automation.' },
    { id: 'dev-008', name: 'Projectify', website: 'https://projectify.app', supportEmail: 'support@projectify.app', location: 'Sydney, Australia', isVerified: false, bio: 'Helping teams deliver projects on time and under budget.' },
    { id: 'dev-009', name: 'LegalEase', website: 'https://legalease.tech', supportEmail: 'contact@legalease.tech', location: 'Paris, France', isVerified: true, bio: 'Automating legal workflows for modern businesses.' },
    { id: 'dev-010', name: 'HealthMetrics', website: 'https://healthmetrics.io', supportEmail: 'support@healthmetrics.io', location: 'Boston, USA', isVerified: true, bio: 'HIPAA-compliant financial solutions for the healthcare industry.' },
    { id: 'dev-011', name: 'Salesforce Labs', website: 'https://salesforce.com', supportEmail: 'support@salesforce.com', location: 'San Francisco, USA', isVerified: true, bio: 'The world\'s #1 CRM platform, empowering companies to connect with their customers in a whole new way.' },
    { id: 'dev-012', name: 'Atlassian', website: 'https://atlassian.com', supportEmail: 'support@atlassian.com', location: 'Sydney, Australia', isVerified: true, bio: 'Unleashing the potential of every team with tools like Jira, Confluence, and Trello.'},
    { id: 'dev-013', name: 'Stripe', website: 'https://stripe.com', supportEmail: 'support@stripe.com', location: 'Dublin, Ireland', isVerified: true, bio: 'Financial infrastructure for the internet. Millions of companies use Stripe to accept payments and manage their businesses online.'},
    { id: 'dev-014', name: 'Adobe', website: 'https://adobe.com', supportEmail: 'support@adobe.com', location: 'San Jose, USA', isVerified: true, bio: 'Changing the world through digital experiences with creativity, productivity, and data tools.'}
];

export const mockCategories: Category[] = [
    { id: 'cat-01', name: 'Accounting & ERP', description: 'Tools for bookkeeping, invoicing, and financial management.', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { id: 'cat-02', name: 'Productivity & Automation', description: 'Apps to automate workflows and enhance team collaboration.', icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' },
    { id: 'cat-03', name: 'Analytics & BI', description: 'Business intelligence and data visualization tools.', icon: 'M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z' },
    { id: 'cat-04', name: 'Security & Compliance', description: 'Protect your financial data with advanced security apps.', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
    { id: 'cat-05', name: 'Payments & E-Commerce', description: 'Integrate various payment gateways and manage transactions.', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
    { id: 'cat-06', name: 'Human Resources', description: 'Manage payroll, benefits, and employee data.', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a3.004 3.004 0 014.288 0M10 16a3 3 0 11-6 0 3 3 0 016 0zm10-6a3 3 0 11-6 0 3 3 0 016 0zM7 10a3 3 0 11-6 0 3 3 0 016 0z' },
    { id: 'cat-07', name: 'Marketing & CRM', description: 'Tools for CRM, email marketing, and customer engagement.', icon: 'M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z' },
    { id: 'cat-08', name: 'Project Management', description: 'Organize tasks, track progress, and manage projects.', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { id: 'cat-09', name: 'Developer Tools', description: 'APIs, webhooks, and tools for building custom solutions.', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
];

// A much larger set of mock applications
export const mockApps: App[] = [
    { id: 1, name: 'QuantumBooks', category: 'Accounting & ERP', categoryId: 'cat-01', installs: 1200, rating: 4.8, developerId: 'dev-001', version: '2.5.1', lastUpdated: '2023-10-26T10:00:00Z', pricing: 'Freemium', featured: true, description: 'AI-powered accounting and invoicing for small businesses.', longDescription: 'QuantumBooks is a comprehensive accounting solution that leverages artificial intelligence to automate bookkeeping, invoicing, and expense tracking. It provides real-time financial reports, tax preparation assistance, and seamless integration with your bank accounts. Perfect for freelancers and small to medium-sized businesses looking to streamline their financial operations.', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', permissions: ['Read account balance and transaction history', 'Create and manage invoices', 'Initiate payments (with user approval)'], screenshots: ['/img/screenshots/qb1.png', '/img/screenshots/qb2.png', '/img/screenshots/qb3.png'], tags: ['accounting', 'invoicing', 'AI', 'finance'], trendingScore: 85, changelog: [{version: '2.5.1', date: '2023-10-26T10:00:00Z', changes: ['Bug fixes', 'Improved UI responsiveness']}], securityCompliance: ['SOC2', 'GDPR']},
    { id: 2, name: 'ConnectFlow', category: 'Productivity & Automation', categoryId: 'cat-02', installs: 2500, rating: 4.9, developerId: 'dev-002', version: '1.9.0', lastUpdated: '2023-11-01T14:30:00Z', pricing: 'Paid', featured: true, description: 'Automate workflows between Demo Bank and your favorite apps.', longDescription: 'ConnectFlow is the ultimate automation tool. Create powerful "flows" that connect Demo Bank to over 500 other applications like Slack, Google Sheets, Salesforce, and more. Automate notifications for large transactions, sync sales data to your accounting software, or create custom alerts without writing a single line of code.', icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1', permissions: ['Read transaction data', 'Access account holder information', 'Send notifications', 'API access to third-party services'], screenshots: ['/img/screenshots/cf1.png', '/img/screenshots/cf2.png'], tags: ['automation', 'workflow', 'integration', 'productivity'], trendingScore: 92, changelog: [{version: '1.9.0', date: '2023-11-01T14:30:00Z', changes: ['Added 50 new app integrations', 'Performance enhancements']}], securityCompliance: ['SOC2', 'GDPR', 'ISO27001']},
    { id: 3, name: 'Insight BI', category: 'Analytics & BI', categoryId: 'cat-03', installs: 850, rating: 4.6, developerId: 'dev-003', version: '3.2.0', lastUpdated: '2023-10-15T09:00:00Z', pricing: 'Paid', featured: false, description: 'Advanced business intelligence and reporting on your financial data.', longDescription: 'Transform your Demo Bank data into actionable insights. Insight BI offers powerful data visualization tools, customizable dashboards, and predictive analytics. Track cash flow, analyze spending patterns, and forecast revenue with stunning, easy-to-understand charts and graphs.', icon: 'M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z', permissions: ['Read-only access to all financial data', 'Aggregate and analyze transaction history'], screenshots: ['/img/screenshots/ib1.png', '/img/screenshots/ib2.png', '/img/screenshots/ib3.png', '/img/screenshots/ib4.png'], tags: ['analytics', 'reporting', 'BI', 'data visualization'], trendingScore: 78, changelog: [{version: '3.2.0', date: '2023-10-15T09:00:00Z', changes: ['New chart types added', 'Faster data refresh rates']}], securityCompliance: ['SOC2']},
    { id: 4, name: 'SecureVault', category: 'Security & Compliance', categoryId: 'cat-04', installs: 3200, rating: 4.9, developerId: 'dev-004', version: '4.0.1', lastUpdated: '2023-11-05T12:00:00Z', pricing: 'Freemium', featured: true, description: 'Advanced fraud detection and account protection.', longDescription: 'SecureVault provides an extra layer of security for your Demo Bank account. Using machine learning, it analyzes your transaction patterns to detect and flag suspicious activity in real-time. Get instant alerts and freeze your account with a single tap if you suspect fraud.', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', permissions: ['Monitor transaction stream in real-time', 'Send security alerts', 'Temporarily lock account access'], screenshots: ['/img/screenshots/sv1.png', '/img/screenshots/sv2.png'], tags: ['security', 'fraud detection', 'protection', 'AI'], trendingScore: 95, changelog: [{version: '4.0.1', date: '2023-11-05T12:00:00Z', changes: ['Improved ML fraud detection model', 'Added biometric confirmation for account freeze']}], securityCompliance: ['SOC2', 'PCI-DSS']},
    { id: 5, name: 'Stripe Gateway', category: 'Payments & E-Commerce', categoryId: 'cat-05', installs: 15000, rating: 4.9, developerId: 'dev-013', version: '5.1.0', lastUpdated: '2023-11-10T18:00:00Z', pricing: 'Free', featured: false, description: 'Accept payments from anyone, anywhere. Instantly.', longDescription: 'The official Stripe integration for Demo Bank. Easily accept credit card, ACH, and international payments directly into your Demo Bank account. Leverage Stripe\'s powerful features like Radar for fraud detection and Connect for platform payments.', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z', permissions: ['Create and manage payment requests', 'Deposit funds into accounts', 'Read customer information', 'Access Stripe account data'], screenshots: ['/img/screenshots/ps1.png', '/img/screenshots/ps2.png', '/img/screenshots/ps3.png'], tags: ['payments', 'invoicing', 'ecommerce', 'credit card', 'stripe'], trendingScore: 98, changelog: [{version: '5.1.0', date: '2023-11-10T18:00:00Z', changes: ['Added support for Stripe Connect', 'Updated API to latest version']}], securityCompliance: ['PCI-DSS', 'SOC2', 'GDPR']},
    { id: 6, name: 'HR Fusion', category: 'Human Resources', categoryId: 'cat-06', installs: 600, rating: 4.5, developerId: 'dev-006', version: '2.1.3', lastUpdated: '2023-10-20T11:45:00Z', pricing: 'Paid', featured: false, description: 'Streamline payroll and HR management.', longDescription: 'Connect HR Fusion to Demo Bank to automate payroll, tax filings, and benefits administration. Manage employee records, time tracking, and expense reimbursements all in one place, with seamless integration for direct deposits.', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a3.004 3.004 0 014.288 0M10 16a3 3 0 11-6 0 3 3 0 016 0zm10-6a3 3 0 11-6 0 3 3 0 016 0zM7 10a3 3 0 11-6 0 3 3 0 016 0z', permissions: ['Initiate payroll payments', 'Read account balance for payroll funding', 'Manage employee bank details'], screenshots: [], tags: ['hr', 'payroll', 'benefits', 'employees'], trendingScore: 65, changelog: [{version: '2.1.3', date: '2023-10-20T11:45:00Z', changes: ['Updated tax tables for 2023', 'Improved performance of payroll runs']}], securityCompliance: ['GDPR']},
    { id: 7, name: 'Salesforce Sync', category: 'Marketing & CRM', categoryId: 'cat-07', installs: 8800, rating: 4.8, developerId: 'dev-011', version: '3.0.0', lastUpdated: '2023-11-08T16:20:00Z', pricing: 'Paid', featured: false, description: 'Connect sales data from Salesforce to Demo Bank.', longDescription: 'Create a two-way sync between your Demo Bank transactions and your Salesforce CRM. Automatically associate payments with opportunities, create new leads from incoming payments, and get a complete 360-degree view of your customer\'s financial interactions.', icon: 'M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z', permissions: ['Read and write transaction data', 'Access and modify Salesforce customer records'], screenshots: ['/img/screenshots/ms1.png'], tags: ['marketing', 'crm', 'automation', 'roi', 'salesforce'], trendingScore: 91, changelog: [{version: '3.0.0', date: '2023-11-08T16:20:00Z', changes: ['Complete UI overhaul', 'Support for custom objects in Salesforce']}], securityCompliance: ['SOC2', 'GDPR']},
    { id: 8, name: 'Jira Project Budgeting', category: 'Project Management', categoryId: 'cat-08', installs: 4950, rating: 4.7, developerId: 'dev-012', version: '2.5.0', lastUpdated: '2023-10-28T08:00:00Z', pricing: 'Paid', featured: false, description: 'Track project budgets and expenses seamlessly in Jira.', longDescription: 'Integrate your project management with your finances. This app links Jira projects with your Demo Bank account to automatically track expenses against project budgets. Assign transactions to issues, generate real-time budget reports inside Jira, and simplify client billing.', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', permissions: ['Read transaction data', 'Categorize transactions', 'Generate financial reports', 'Access Jira project data'], screenshots: ['/img/screenshots/pr1.png', '/img/screenshots/pr2.png'], tags: ['project management', 'budgeting', 'expenses', 'jira'], trendingScore: 88, changelog: [{version: '2.5.0', date: '2023-10-28T08:00:00Z', changes: ['Added support for Jira Cloud', 'New dashboard gadgets for budget tracking']}], securityCompliance: ['SOC2']},
    { id: 9, name: 'Adobe Creative Cloud Assets', category: 'Developer Tools', categoryId: 'cat-09', installs: 1400, rating: 4.6, developerId: 'dev-014', version: '1.2.0', lastUpdated: '2023-09-15T14:00:00Z', pricing: 'Freemium', description: 'Bill clients for Adobe CC asset usage automatically.', longDescription: 'For creative agencies and freelancers. This tool monitors your Adobe Creative Cloud asset usage per project and automatically generates invoices or line items in your accounting software connected to Demo Bank. Track stock photo licenses, font usage, and more.', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4', permissions: ['Read Adobe CC usage data via API', 'Create invoices and payment requests'], screenshots: [], tags: ['developer', 'creative', 'adobe', 'billing'], trendingScore: 72, changelog: [{version: '1.2.0', date: '2023-09-15T14:00:00Z', changes: ['Support for Adobe Fonts', 'Integration with QuantumBooks']}], securityCompliance: []},
    { id: 10, name: 'HealthMetrics', category: 'Human Resources', categoryId: 'cat-06', installs: 250, rating: 4.3, developerId: 'dev-010', version: '1.0.5', lastUpdated: '2023-08-30T10:00:00Z', pricing: 'Contact Us', featured: false, description: 'Simplify medical billing and insurance claims.', longDescription: 'HealthMetrics is designed for healthcare providers. It integrates with Demo Bank to streamline patient billing, process insurance claims, and manage payments. It helps reduce administrative overhead and ensures HIPAA-compliant financial transactions.', icon: 'M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z', permissions: ['Process payments from patients and insurers', 'Manage healthcare-related financial data', 'Generate billing reports'], screenshots: ['/img/screenshots/hm1.png', '/img/screenshots/hm2.png'], tags: ['healthcare', 'medical billing', 'hipaa'], trendingScore: 55, changelog: [{version: '1.0.5', date: '2023-08-30T10:00:00Z', changes: ['Initial release']}], securityCompliance: ['HIPAA']},
    { id: 11, name: 'CarbonTrack', category: 'Analytics & BI', categoryId: 'cat-03', installs: 550, rating: 4.8, developerId: 'dev-003', version: '1.3.0', lastUpdated: '2023-11-10T11:00:00Z', pricing: 'Freemium', featured: false, description: 'Monitor the carbon footprint of your spending.', longDescription: 'CarbonTrack analyzes your Demo Bank transactions to estimate the carbon footprint of your purchases. Get insights into your environmental impact, discover sustainable alternatives, and contribute to carbon offset projects directly from the app.', icon: 'M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7.014A8.003 8.003 0 0121 12c0 4.418-3.582 8-8 8h-2.657zM22 12a10 10 0 11-20 0 10 10 0 0120 0z', permissions: ['Read transaction data for analysis'], screenshots: [], tags: ['sustainability', 'carbon footprint', 'eco-friendly'], trendingScore: 75, changelog: [{version: '1.3.0', date: '2023-11-10T11:00:00Z', changes: ['Improved accuracy of carbon calculations', 'Added new offset projects']}], securityCompliance: [] },
    { id: 12, name: 'SubscriptionShark', category: 'Productivity & Automation', categoryId: 'cat-02', installs: 4500, rating: 4.9, developerId: 'dev-002', version: '2.2.0', lastUpdated: '2023-10-29T19:00:00Z', pricing: 'Free', featured: false, description: 'Track and manage all your recurring subscriptions.', longDescription: 'Never get surprised by a subscription charge again. SubscriptionShark scans your transaction history to identify all your recurring payments. It lists them in a clean dashboard, reminds you before a payment is due, and helps you manage them effectively.', icon: 'M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2z', permissions: ['Read transaction history to identify subscriptions'], screenshots: ['/img/screenshots/ss1.png', '/img/screenshots/ss2.png'], tags: ['subscriptions', 'money management', 'productivity'], trendingScore: 89, changelog: [{version: '2.2.0', date: '2023-10-29T19:00:00Z', changes: ['Added calendar integration for payment reminders', 'UI improvements']}], securityCompliance: ['GDPR']},
];

export const mockReviews: Review[] = [
    { id: 'rev-001', appId: 1, author: 'Alice', authorProfile: 'Owner, Alice\'s Bakery', avatarUrl: '/avatars/alice.png', rating: 5, title: 'Game Changer!', comment: 'QuantumBooks automated everything for me. My accounting is now effortless. Highly recommend!', date: '2023-10-20T14:48:00Z', isVerifiedPurchase: true, helpfulVotes: 15 },
    { id: 'rev-002', appId: 1, author: 'Bob', authorProfile: 'Freelance Designer', avatarUrl: '/avatars/bob.png', rating: 4, title: 'Very Solid App', comment: 'Good features, but the UI could be a bit more intuitive. Still, it saves me a lot of time.', date: '2023-10-18T10:22:00Z', isVerifiedPurchase: true, helpfulVotes: 7 },
    { id: 'rev-003', appId: 2, author: 'Charlie', authorProfile: 'CEO, Tech Startup', avatarUrl: '/avatars/charlie.png', rating: 5, title: 'Incredibly Powerful', comment: 'The possibilities with ConnectFlow are endless. I have automated so many parts of my business.', date: '2023-11-02T09:15:00Z', isVerifiedPurchase: true, helpfulVotes: 22 },
    { id: 'rev-004', appId: 3, author: 'Diana', authorProfile: 'Marketing Manager', avatarUrl: '/avatars/diana.png', rating: 5, title: 'Beautiful Visualizations', comment: 'Finally, I can actually understand my financial data. The charts are amazing.', date: '2023-10-16T11:05:00Z', isVerifiedPurchase: true, helpfulVotes: 12 },
    { id: 'rev-005', appId: 4, author: 'Eve', authorProfile: 'E-commerce Store Owner', avatarUrl: '/avatars/eve.png', rating: 5, title: 'Peace of Mind', comment: 'I feel so much safer with SecureVault watching over my account. The instant alerts are fantastic.', date: '2023-11-06T18:30:00Z', isVerifiedPurchase: true, helpfulVotes: 31 },
    { id: 'rev-006', appId: 1, author: 'Frank', authorProfile: 'Consultant', avatarUrl: '/avatars/frank.png', rating: 4, title: 'Good but needs more integrations', comment: 'I love the core product, but I wish it connected to my CRM.', date: '2023-09-11T12:00:00Z', isVerifiedPurchase: false, helpfulVotes: 3 },
    { id: 'rev-007', appId: 2, author: 'Grace', authorProfile: 'Operations Director', avatarUrl: '/avatars/grace.png', rating: 5, title: 'A Must-Have for Efficiency', comment: 'If you want to save time, get ConnectFlow. It paid for itself in the first week.', date: '2023-10-25T16:45:00Z', isVerifiedPurchase: true, helpfulVotes: 18 },
    { id: 'rev-008', appId: 5, author: 'Heidi', authorProfile: 'Online Retailer', avatarUrl: '/avatars/heidi.png', rating: 5, title: 'The Standard for a Reason', comment: 'The Stripe integration is flawless. It was easy to set up and it just works. Never have to worry about payments.', date: '2023-11-11T10:00:00Z', isVerifiedPurchase: true, helpfulVotes: 45},
    { id: 'rev-009', appId: 7, author: 'Ivan', authorProfile: 'Sales Team Lead', avatarUrl: '/avatars/ivan.png', rating: 5, title: 'Finally, a single source of truth!', comment: 'Having our transaction data appear automatically in Salesforce has been a revelation for our sales team. No more manual entry!', date: '2023-11-09T14:20:00Z', isVerifiedPurchase: true, helpfulVotes: 25},
    // ... many more reviews would be here in a real application
];


export const MockApiService = {
    fetchPaginatedApps: async ({ page = 1, limit = 9, categoryId, searchTerm, sortBy, filters }: { page: number; limit: number; categoryId?: string; searchTerm?: string; sortBy?: SortOption, filters: Record<string, any> }): Promise<{ apps: App[]; total: number }> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    let filteredApps = [...mockApps];

                    if (categoryId && categoryId !== 'all') {
                        filteredApps = filteredApps.filter(app => app.categoryId === categoryId);
                    }

                    if (searchTerm) {
                        const lowercasedTerm = searchTerm.toLowerCase();
                        filteredApps = filteredApps.filter(app =>
                            app.name.toLowerCase().includes(lowercasedTerm) ||
                            app.description.toLowerCase().includes(lowercasedTerm) ||
                            app.tags.some(tag => tag.toLowerCase().includes(lowercasedTerm))
                        );
                    }
                    
                    if (filters.pricing && filters.pricing.length > 0) {
                        filteredApps = filteredApps.filter(app => filters.pricing.includes(app.pricing));
                    }
                    if (filters.isVerified) {
                        const verifiedDevIds = new Set(mockDevelopers.filter(d => d.isVerified).map(d => d.id));
                        filteredApps = filteredApps.filter(app => verifiedDevIds.has(app.developerId));
                    }


                    // Sorting logic
                    filteredApps.sort((a, b) => {
                        switch (sortBy) {
                            case 'installs': return b.installs - a.installs;
                            case 'rating': return b.rating - a.rating;
                            case 'trending': return b.trendingScore - a.trendingScore;
                            case 'newest': return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
                            case 'name': default: return a.name.localeCompare(b.name);
                        }
                    });

                    const total = filteredApps.length;
                    const paginatedApps = filteredApps.slice((page - 1) * limit, page * limit);

                    resolve({ apps: paginatedApps, total });
                } catch (error) {
                    reject({ message: 'Failed to fetch apps.' });
                }
            }, 800); // Simulate network delay
        });
    },

    fetchAppDetails: async (appId: number): Promise<{ app: App; developer: Developer; reviews: Review[] }> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const app = mockApps.find(a => a.id === appId);
                if (!app) return reject({ message: `App with ID ${appId} not found.` });
                const developer = mockDevelopers.find(d => d.id === app.developerId);
                const reviews = mockReviews.filter(r => r.appId === appId).sort((a, b) => b.helpfulVotes - a.helpfulVotes);
                if (!developer) return reject({ message: `Developer for App ID ${appId} not found.` });
                resolve({ app, developer, reviews });
            }, 500);
        });
    },

    fetchCategories: async (): Promise<Category[]> => new Promise(resolve => setTimeout(() => resolve(mockCategories), 300)),
    installApp: async (appId: number): Promise<{ success: boolean }> => new Promise(resolve => setTimeout(() => resolve({ success: true }), 1200)),
    uninstallApp: async (appId: number): Promise<{ success: boolean }> => new Promise(resolve => setTimeout(() => resolve({ success: true }), 700)),

    // AI-powered services
    fetchAIReviewSummary: async (appId: number): Promise<AIReviewSummary> => {
        return new Promise(resolve => {
            setTimeout(() => {
                // In a real app, this would call a generative AI model with all reviews.
                resolve({
                    pros: ["Easy to set up and use", "Saves significant amount of time", "Powerful automation features", "Excellent customer support"],
                    cons: ["Can be expensive for larger teams", "UI feels a bit dated", "Steep learning curve for advanced features"],
                    sentiment: 'Mostly Positive',
                    overallSummary: "Users overwhelmingly praise this app for its time-saving automations and powerful feature set. While some find the pricing to be high and the user interface to have a learning curve, the general consensus is that it provides excellent value and transforms business workflows."
                });
            }, 1500);
        });
    },
    fetchAIPermissionAnalysis: async (permissions: string[]): Promise<AIPermissionAnalysis> => {
         return new Promise(resolve => {
            setTimeout(() => {
                 resolve({
                    level: 'Medium Risk',
                    summary: 'This app requests access to read financial data and perform actions on your behalf. While necessary for its functionality, ensure you trust the developer before granting these permissions.',
                    details: permissions.map(p => ({
                        permission: p,
                        explanation: `This allows the app to ${p.toLowerCase().replace('(with user approval)', '')}.`,
                        risk: p.toLowerCase().includes('payments') || p.toLowerCase().includes('manage') ? 'High' : 'Medium'
                    }))
                });
            }, 1000);
        });
    },
    fetchAIRecommendations: async (userId: string): Promise<App[]> => {
        // Simulates fetching personalized recommendations for a user.
        return new Promise(resolve => setTimeout(() => resolve([mockApps[4], mockApps[6], mockApps[11]]), 1200));
    }
};

// ===================================================================================
// UTILITY/HELPER FUNCTIONS
// ===================================================================================

export const useDebounce = <T>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
};

export const formatInstalls = (installs: number): string => {
    if (installs >= 1000000) return `${(installs / 1000000).toFixed(1)}m`;
    if (installs >= 1000) return `${Math.floor(installs / 1000)}k`;
    return installs.toString();
};

export const timeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
};

// ===================================================================================
// REUSABLE UI COMPONENTS
// ===================================================================================

export const AppIcon: React.FC<{ icon: string; className?: string }> = ({ icon, className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
    </svg>
);

export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg'}> = ({ size = 'md' }) => {
    const sizeClasses = {
        sm: 'h-8 w-8',
        md: 'h-16 w-16',
        lg: 'h-24 w-24'
    };
    return (
        <div className="flex justify-center items-center p-8">
            <div className={`animate-spin rounded-full border-t-2 border-b-2 border-cyan-500 ${sizeClasses[size]}`}></div>
        </div>
    );
};

export const AppCardSkeleton: React.FC = () => (
    <div className="bg-gray-800/50 p-4 rounded-lg animate-pulse">
        <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gray-700 rounded-lg"></div>
            <div className="flex-1">
                <div className="h-5 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-1/4"></div>
            </div>
        </div>
        <div className="h-4 bg-gray-700 rounded w-full mt-4"></div>
        <div className="h-4 bg-gray-700 rounded w-5/6 mt-2"></div>
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-700/50">
            <div className="h-4 bg-gray-700 rounded w-1/3"></div>
            <div className="h-8 bg-gray-700 rounded-lg w-1/4"></div>
        </div>
    </div>
);


export const RatingStars: React.FC<{ rating: number; totalStars?: number }> = ({ rating, totalStars = 5 }) => (
    <div className="flex items-center">
        {[...Array(totalStars)].map((_, i) => (
            <svg key={i} className={`w-4 h-4 ${i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ))}
    </div>
);

export const AppCard: React.FC<{ app: App; onInstall: (appId: number) => void; onUninstall: (appId: number) => void; isInstalled: boolean; isProcessing: boolean; onClick: (app: App) => void }> = ({ app, onInstall, onUninstall, isInstalled, isProcessing, onClick }) => {
    const handleButtonClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isInstalled) onUninstall(app.id);
        else onInstall(app.id);
    };
    
    return (
        <Card variant="interactive" className="flex flex-col cursor-pointer h-full" onClick={() => onClick(app)}>
            <div className="flex-grow">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center text-cyan-300 flex-shrink-0">
                        <AppIcon icon={app.icon} className="w-7 h-7" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white">{app.name}</h3>
                        <p className="text-xs text-cyan-400">{app.category}</p>
                    </div>
                </div>
                <p className="text-sm text-gray-400 mt-4 h-10 overflow-hidden text-ellipsis">{app.description}</p>
            </div>
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-700/50">
                <div className="flex items-center gap-2">
                    <RatingStars rating={app.rating} />
                    <p className="text-xs text-gray-500">({formatInstalls(app.installs)})</p>
                </div>
                <button
                    onClick={handleButtonClick}
                    disabled={isProcessing}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-200 transform hover:scale-105 ${
                        isProcessing
                            ? 'bg-gray-500 text-gray-400 cursor-not-allowed'
                            : isInstalled
                            ? 'bg-red-900/50 hover:bg-red-800/60 text-red-300'
                            : 'bg-cyan-600/50 hover:bg-cyan-600/80 text-white'
                    }`}
                >
                    {isProcessing ? '...' : isInstalled ? 'Uninstall' : 'Install'}
                </button>
            </div>
        </Card>
    );
};

export const AppDetailModal: React.FC<{
    app: App | null;
    developer: Developer | null;
    reviews: Review[];
    isOpen: boolean;
    onClose: () => void;
    onInstall: (appId: number) => void;
    onUninstall: (appId: number) => void;
    isInstalled: boolean;
    isProcessing: boolean;
}> = ({ app, developer, reviews, isOpen, onClose, onInstall, onUninstall, isInstalled, isProcessing }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [aiSummary, setAiSummary] = useState<AIReviewSummary | null>(null);
    const [aiSummaryStatus, setAiSummaryStatus] = useState<ApiStatus>('idle');

    useEffect(() => {
        if (isOpen && app && reviews.length > 0 && activeTab === 'reviews' && !aiSummary) {
            setAiSummaryStatus('loading');
            MockApiService.fetchAIReviewSummary(app.id)
                .then(summary => {
                    setAiSummary(summary);
                    setAiSummaryStatus('succeeded');
                })
                .catch(() => setAiSummaryStatus('failed'));
        }
        if (!isOpen) {
            setActiveTab('overview');
            setAiSummary(null);
            setAiSummaryStatus('idle');
        }
    }, [isOpen, app, activeTab, reviews, aiSummary]);

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) onClose();
    };
    
    if (!isOpen || !app) return null;
    
    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xl font-semibold text-white mb-2">Description</h3>
                            <p className="text-gray-300 whitespace-pre-wrap">{app.longDescription}</p>
                        </div>
                        {app.screenshots.length > 0 && (
                            <div>
                                <h3 className="text-xl font-semibold text-white mb-2">Screenshots</h3>
                                <div className="flex gap-4 overflow-x-auto p-1 rounded-lg bg-black/20">
                                    {app.screenshots.map((src, index) => (
                                        <img key={index} src={src} alt={`Screenshot ${index + 1}`} className="h-48 rounded-md border border-gray-700" />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                );
            case 'reviews':
                return (
                    <div>
                        <h3 className="text-xl font-semibold text-white mb-4">Reviews ({reviews.length})</h3>
                        {aiSummaryStatus === 'loading' && <LoadingSpinner size="sm"/>}
                        {aiSummaryStatus === 'succeeded' && aiSummary && (
                             <Card variant="outline" className="mb-6 bg-gray-900/30">
                                <h4 className="text-lg font-semibold text-cyan-300 mb-2">AI-Powered Summary</h4>
                                <p className="text-sm text-gray-400 mb-4">{aiSummary.overallSummary}</p>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <h5 className="font-semibold text-green-400 mb-2">Pros</h5>
                                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                                            {aiSummary.pros.map((pro, i) => <li key={i}>{pro}</li>)}
                                        </ul>
                                    </div>
                                    <div className="flex-1">
                                        <h5 className="font-semibold text-red-400 mb-2">Cons</h5>
                                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                                            {aiSummary.cons.map((con, i) => <li key={i}>{con}</li>)}
                                        </ul>
                                    </div>
                                </div>
                            </Card>
                        )}
                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                            {reviews.map(review => (
                                <div key={review.id} className="bg-gray-900/50 p-4 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <img src={review.avatarUrl} alt={review.author} className="w-8 h-8 rounded-full" />
                                            <div>
                                                <span className="font-semibold text-white">{review.author}</span>
                                                <span className="text-xs text-gray-500 block">{review.authorProfile}</span>
                                            </div>
                                            {review.isVerifiedPurchase && <span className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full">Verified</span>}
                                        </div>
                                        <span className="text-xs text-gray-500">{timeAgo(review.date)}</span>
                                    </div>
                                    <RatingStars rating={review.rating} />
                                    <h4 className="font-semibold text-gray-200 mt-2">{review.title}</h4>
                                    <p className="text-sm text-gray-400 mt-1">{review.comment}</p>
                                    <div className="text-xs text-gray-500 mt-2">{review.helpfulVotes} people found this helpful</div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'changelog':
                return (
                    <div className="space-y-4">
                        {app.changelog.map(entry => (
                            <div key={entry.version}>
                                <h4 className="font-semibold text-white">Version {entry.version} <span className="text-sm text-gray-500 font-normal">- {timeAgo(entry.date)}</span></h4>
                                <ul className="list-disc list-inside mt-2 text-gray-300 space-y-1">
                                    {entry.changes.map((change, i) => <li key={i}>{change}</li>)}
                                </ul>
                            </div>
                        ))}
                    </div>
                );
            default: return null;
        }
    }


    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-opacity duration-300" onClick={handleBackdropClick}>
            <div ref={modalRef} className="bg-gray-800/90 border border-gray-700 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale">
                <style>{`
                    @keyframes fade-in-scale {
                        0% { transform: scale(0.95); opacity: 0; }
                        100% { transform: scale(1); opacity: 1; }
                    }
                    .animate-fade-in-scale { animation: fade-in-scale 0.3s forwards; }
                `}</style>
                <div className="p-6 border-b border-gray-700 flex justify-between items-start">
                    <div className="flex items-start gap-5">
                        <div className="w-20 h-20 bg-cyan-500/10 rounded-lg flex items-center justify-center text-cyan-300 flex-shrink-0">
                            <AppIcon icon={app.icon} className="w-10 h-10" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-white">{app.name}</h2>
                            <p className="text-sm text-cyan-400">by {developer?.name}</p>
                            <div className="flex items-center gap-4 mt-2">
                                <RatingStars rating={app.rating} />
                                <span className="text-sm text-gray-400">{app.rating.toFixed(1)} stars</span>
                                <span className="text-sm text-gray-400">{formatInstalls(app.installs)} installs</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
                </div>
                
                <div className="flex-grow overflow-y-auto p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                             <div className="border-b border-gray-700 mb-4">
                                <nav className="flex space-x-4">
                                    {['overview', 'reviews', 'changelog'].map(tab => (
                                        <button key={tab} onClick={() => setActiveTab(tab)}
                                            className={`px-3 py-2 text-sm font-medium capitalize transition-colors ${activeTab === tab ? 'border-b-2 border-cyan-400 text-cyan-300' : 'border-b-2 border-transparent text-gray-400 hover:text-white'}`}>
                                            {tab}
                                        </button>
                                    ))}
                                </nav>
                            </div>
                            {renderTabContent()}
                        </div>
                        <div className="space-y-6">
                            <div>
                                <button onClick={() => isInstalled ? onUninstall(app.id) : onInstall(app.id)} disabled={isProcessing}
                                    className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors duration-200 ${
                                        isProcessing ? 'bg-gray-600 text-gray-400 cursor-not-allowed' :
                                        isInstalled ? 'bg-red-600 hover:bg-red-700 text-white' :
                                        'bg-cyan-600 hover:bg-cyan-700 text-white'}`}>
                                    {isProcessing ? 'Processing...' : isInstalled ? 'Uninstall App' : 'Install App'}
                                </button>
                            </div>
                             <div>
                                <h3 className="text-lg font-semibold text-white mb-2">Information</h3>
                                <ul className="text-sm text-gray-400 space-y-2">
                                    <li className="flex justify-between"><span>Version:</span> <span className="text-gray-200">{app.version}</span></li>
                                    <li className="flex justify-between"><span>Updated:</span> <span className="text-gray-200">{timeAgo(app.lastUpdated)}</span></li>
                                    <li className="flex justify-between"><span>Pricing:</span> <span className="text-gray-200">{app.pricing}</span></li>
                                    <li className="flex justify-between"><span>Category:</span> <span className="text-gray-200">{app.category}</span></li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2">Permissions Required</h3>
                                <ul className="text-sm text-gray-400 list-disc list-inside space-y-1">
                                    {app.permissions.map((p, i) => <li key={i}>{p}</li>)}
                                </ul>
                            </div>
                            {app.securityCompliance.length > 0 && <div>
                                <h3 className="text-lg font-semibold text-white mb-2">Security & Compliance</h3>
                                <div className="flex flex-wrap gap-2">
                                    {app.securityCompliance.map(sc => <span key={sc} className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">{sc}</span>)}
                                </div>
                            </div>}
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2">Developer</h3>
                                <ul className="text-sm text-gray-400 space-y-2">
                                    <li>{developer?.name} {developer?.isVerified && <span className="text-xs text-blue-300">(Verified)</span>}</li>
                                    <li><a href={developer?.website} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Website</a></li>
                                    <li><a href={`mailto:${developer?.supportEmail}`} className="text-cyan-400 hover:underline">Support</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const CategorySidebar: React.FC<{
    categories: Category[];
    selectedCategory: string;
    onSelectCategory: (categoryId: string) => void;
}> = ({ categories, selectedCategory, onSelectCategory }) => {
    return (
        <Card className="w-full md:w-64 flex-shrink-0">
            <h3 className="text-xl font-semibold text-white mb-4">Categories</h3>
            <ul className="space-y-1">
                <li>
                    <button onClick={() => onSelectCategory('all')} className={`w-full flex items-center gap-3 text-left px-3 py-2 rounded-md text-sm transition-colors ${selectedCategory === 'all' ? 'bg-cyan-500/20 text-cyan-300' : 'text-gray-300 hover:bg-gray-700/50'}`}>
                        All Apps
                    </button>
                </li>
                {categories.map(cat => (
                    <li key={cat.id}>
                        <button onClick={() => onSelectCategory(cat.id)} className={`w-full flex items-center gap-3 text-left px-3 py-2 rounded-md text-sm transition-colors ${selectedCategory === cat.id ? 'bg-cyan-500/20 text-cyan-300' : 'text-gray-300 hover:bg-gray-700/50'}`}>
                           <AppIcon icon={cat.icon} className="w-5 h-5 flex-shrink-0" />
                           <span>{cat.name}</span>
                        </button>
                    </li>
                ))}
            </ul>
        </Card>
    );
};

export const Pagination: React.FC<{
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}> = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="flex justify-center items-center gap-2 mt-8">
            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 bg-gray-700/50 rounded-md disabled:opacity-50 hover:bg-gray-600">Prev</button>
            {pageNumbers.map(num => (
                <button key={num} onClick={() => onPageChange(num)} className={`px-3 py-1 rounded-md ${currentPage === num ? 'bg-cyan-600 text-white' : 'bg-gray-700/50 hover:bg-gray-600'}`}>{num}</button>
            ))}
            <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1 bg-gray-700/50 rounded-md disabled:opacity-50 hover:bg-gray-600">Next</button>
        </div>
    );
};


// ===================================================================================
// MAIN MARKETPLACE VIEW COMPONENT
// This is the orchestrator component that ties everything together.
// ===================================================================================

const DemoBankAppMarketplaceView: React.FC = () => {
    // State for app data and UI status
    const [apps, setApps] = useState<App[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [totalApps, setTotalApps] = useState(0);
    const [status, setStatus] = useState<ApiStatus>('idle');
    const [error, setError] = useState<string | null>(null);

    // State for filtering, sorting, and pagination
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState<SortOption>('trending');
    const [currentPage, setCurrentPage] = useState(1);
    const APPS_PER_PAGE = 9;

    // State for app installation management
    const [installedApps, setInstalledApps] = useState<Set<number>>(new Set([2])); // Pre-install one app
    const [processingAppId, setProcessingAppId] = useState<number | null>(null);

    // State for the modal detail view
    const [selectedApp, setSelectedApp] = useState<App | null>(null);
    const [selectedAppDetails, setSelectedAppDetails] = useState<{ developer: Developer; reviews: Review[] } | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    // Fetch categories on component mount
    useEffect(() => {
        MockApiService.fetchCategories()
            .then(setCategories)
            .catch(() => console.error("Failed to fetch categories"));
    }, []);

    // Fetch apps whenever filters or page change
    useEffect(() => {
        const fetchApps = async () => {
            setStatus('loading');
            setError(null);
            try {
                const response = await MockApiService.fetchPaginatedApps({
                    page: currentPage,
                    limit: APPS_PER_PAGE,
                    categoryId: selectedCategory,
                    searchTerm: debouncedSearchTerm,
                    sortBy,
                    filters: {}, // Placeholder for future advanced filters
                });
                setApps(response.apps);
                setTotalApps(response.total);
                setStatus('succeeded');
            } catch (err) {
                const apiError = err as ApiError;
                setError(apiError.message);
                setStatus('failed');
            }
        };

        fetchApps();
    }, [currentPage, selectedCategory, debouncedSearchTerm, sortBy]);

    // Handlers for user interactions
    const handleCategoryChange = useCallback((categoryId: string) => {
        setSelectedCategory(categoryId);
        setCurrentPage(1);
    }, []);

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortBy(e.target.value as SortOption);
        setCurrentPage(1);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleInstall = useCallback(async (appId: number) => {
        setProcessingAppId(appId);
        try {
            await MockApiService.installApp(appId);
            setInstalledApps(prev => new Set(prev).add(appId));
        } catch (e) {
            console.error(`Failed to install app ${appId}`);
        } finally {
            setProcessingAppId(null);
        }
    }, []);

    const handleUninstall = useCallback(async (appId: number) => {
        setProcessingAppId(appId);
        try {
            await MockApiService.uninstallApp(appId);
            setInstalledApps(prev => {
                const newSet = new Set(prev);
                newSet.delete(appId);
                return newSet;
            });
        } catch (e) {
            console.error(`Failed to uninstall app ${appId}`);
        } finally {
            setProcessingAppId(null);
        }
    }, []);

    const openAppModal = useCallback(async (app: App) => {
        setSelectedApp(app);
        setIsModalOpen(true);
        try {
            const details = await MockApiService.fetchAppDetails(app.id);
            setSelectedAppDetails(details);
        } catch (e) {
            console.error("Failed to load app details");
        }
    }, []);

    const closeAppModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedApp(null);
        setSelectedAppDetails(null);
    }, []);
    
    const featuredApps = useMemo(() => mockApps.filter(app => app.featured).slice(0, 3), []);

    return (
        <div className="space-y-8 p-4 md:p-6">
            <header>
                <h1 className="text-4xl font-extrabold text-white tracking-tight">App Marketplace</h1>
                <p className="text-gray-400 mt-2 max-w-2xl">Extend the power of Demo Bank by connecting to third-party applications. All apps are reviewed for security and compliance.</p>
            </header>
            
            <Card>
                <h2 className="text-2xl font-bold text-white mb-4">Featured Apps</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredApps.map(app => (
                        <AppCard
                            key={`featured-${app.id}`}
                            app={app}
                            onInstall={handleInstall}
                            onUninstall={handleUninstall}
                            isInstalled={installedApps.has(app.id)}
                            isProcessing={processingAppId === app.id}
                            onClick={openAppModal}
                        />
                    ))}
                </div>
            </Card>

            <main className="flex flex-col md:flex-row gap-8">
                <aside>
                    <CategorySidebar 
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onSelectCategory={handleCategoryChange}
                    />
                </aside>
                
                <div className="flex-grow">
                    <Card className="mb-6">
                        <div className="flex flex-col sm:flex-row gap-4 justify-between">
                            <input
                                type="text"
                                placeholder="Search apps by name, tag, or description..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="w-full sm:w-2/3 bg-gray-900/50 border border-gray-700 rounded-md px-4 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                            />
                            <select
                                value={sortBy}
                                onChange={handleSortChange}
                                className="w-full sm:w-1/3 bg-gray-900/50 border border-gray-700 rounded-md px-4 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                            >
                                <option value="trending">Trending</option>
                                <option value="installs">Most Installs</option>
                                <option value="rating">Highest Rated</option>
                                <option value="newest">Newest</option>
                                <option value="name">Alphabetical</option>
                            </select>
                        </div>
                    </Card>

                    {status === 'loading' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(APPS_PER_PAGE)].map((_, i) => <AppCardSkeleton key={i} />)}
                        </div>
                    )}
                    {status === 'failed' && <p className="text-red-400 text-center py-10">{error}</p>}
                    {status === 'succeeded' && (
                        apps.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {apps.map(app => (
                                        <AppCard
                                            key={app.id}
                                            app={app}
                                            onInstall={handleInstall}
                                            onUninstall={handleUninstall}
                                            isInstalled={installedApps.has(app.id)}
                                            isProcessing={processingAppId === app.id}
                                            onClick={openAppModal}
                                        />
                                    ))}
                                </div>
                                <Pagination 
                                    currentPage={currentPage}
                                    totalItems={totalApps}
                                    itemsPerPage={APPS_PER_PAGE}
                                    onPageChange={handlePageChange}
                                />
                            </>
                        ) : (
                            <Card>
                                <p className="text-center text-gray-400 py-10">No apps found matching your criteria.</p>
                            </Card>
                        )
                    )}
                </div>
            </main>

            <AppDetailModal
                app={selectedApp}
                developer={selectedAppDetails?.developer ?? null}
                reviews={selectedAppDetails?.reviews ?? []}
                isOpen={isModalOpen}
                onClose={closeAppModal}
                onInstall={handleInstall}
                onUninstall={handleUninstall}
                isInstalled={selectedApp ? installedApps.has(selectedApp.id) : false}
                isProcessing={selectedApp ? processingAppId === selectedApp.id : false}
            />
        </div>
    );
};

export default DemoBankAppMarketplaceView;