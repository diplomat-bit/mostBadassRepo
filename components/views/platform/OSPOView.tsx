// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/platform/OSPOView.tsx
================================================================================

import React, { useState, useEffect, useMemo, useCallback, createContext, useContext } from 'react';
import Card from '../../Card';

// #region TYPES AND INTERFACES
// This section defines all the data structures for the OSPO Dashboard.

export type UUID = string;

export type ContributionType = 'COMMIT' | 'PULL_REQUEST' | 'ISSUE' | 'COMMENT' | 'REVIEW';
export type LicenseType = 'Permissive' | 'Copyleft' | 'Weakly Protective' | 'Network Protective' | 'Proprietary' | 'Unlicensed';
export type VulnerabilitySeverity = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW' | 'INFO';
export type PolicyStatus = 'ACTIVE' | 'DRAFT' | 'ARCHIVED' | 'IN_REVIEW';
export type ComplianceStatus = 'COMPLIANT' | 'NON_COMPLIANT' | 'PENDING' | 'AT_RISK' | 'UNKNOWN';
export type ProjectType = 'INTERNAL' | 'EXTERNAL_DEPENDENCY' | 'CONTRIBUTED_TO' | 'INNERSOURCE';
export type CiCdStatus = 'SUCCESS' | 'FAILED' | 'IN_PROGRESS' | 'QUEUED';
export type AiInsightCategory = 'RISK' | 'OPPORTUNITY' | 'EFFICIENCY' | 'COMMUNITY';

export interface Contributor {
    id: UUID;
    username: string;
    avatarUrl: string;
    githubUrl: string;
    company: string;
    contributionsCount: number;
    lastContributionDate: string;
    isExternal: boolean;
    teams: string[];
}

export interface Contribution {
    id: UUID;
    type: ContributionType;
    repository: string;
    repositoryUrl: string;
    contributor: Contributor;
    title: string;
    url: string;
    createdAt: string;
    mergedAt?: string;
    closedAt?: string;
    linesAdded: number;
    linesRemoved: number;
    commentsCount: number;
    status: 'OPEN' | 'MERGED' | 'CLOSED' | 'DRAFT';
}

export interface License {
    spdxId: string;
    name: string;
    type: LicenseType;
    isOsiApproved: boolean;
    isFsfLibre: boolean;
    permissions: string[];
    conditions: string[];
    limitations: string[];
    riskScore: number;
    summary: string;
}

export interface Dependency {
    id: UUID;
    name: string;
    version: string;
    license: License;
    manager: 'npm' | 'maven' | 'pip' | 'go' | 'cargo' | 'nuget';
    isDevDependency: boolean;
    path: string;
    complianceStatus: ComplianceStatus;
    vulnerabilityCount: number;
    lastScanned: string;
}

export interface Vulnerability {
    id: UUID;
    cveId: string;
    packageName: string;
    packageVersion: string;
    severity: VulnerabilitySeverity;
    summary: string;
    url: string;
    publishedDate: string;
    remediation?: {
        fixedInVersion: string;
        recommendation: string;
        aiGeneratedSummary: string;
    };
    cwes: string[];
    epssScore?: number; // Exploit Prediction Scoring System
}

export interface Repository {
    id: UUID;
    name: string;
    url: string;
    owner: string;
    description: string;
    language: string;
    stars: number;
    forks: number;
    license: License;
    isArchived: boolean;
    lastCommitDate: string;
    codeCoverage: number;
    ciCdStatus: CiCdStatus;
}

export interface Project {
    id: UUID;
    name: string;
    type: ProjectType;
    repositories: Repository[];
    description: string;
    lead: string;
    team: string;
    complianceStatus: ComplianceStatus;
    securityRiskScore: number;
    dependencies: Dependency[];
    vulnerabilities: Vulnerability[];
    lastScanDate: string;
    budget: {
        total: number;
        spent: number;
        year: number;
    };
    jiraProjectKey?: string;
}

export interface PolicyRule {
    id: UUID;
    type: 'ALLOW_LICENSE' | 'DENY_LICENSE' | 'REQUIRE_CLA' | 'MAX_CRITICAL_VULNERABILITIES' | 'REQUIRE_SECURITY_SCAN' | 'MIN_CODE_COVERAGE';
    value: string | number;
    description: string;
}

export interface Policy {
    id: UUID;
    name: string;
    description: string;
    status: PolicyStatus;
    rules: PolicyRule[];
    createdAt: string;
    updatedAt: string;
    author: string;
}

export interface CommunityHealthMetric {
    date: string;
    newContributors: number;
    issueResponseTimeHours: number;
    prMergeTimeHours: number;
    closedIssues: number;
    openedIssues: number;
    activeContributors: number;
}

export interface ReportTemplate {
    id: UUID;
    name: string;
    description: string;
    format: 'PDF' | 'CSV' | 'JSON' | 'MARKDOWN';
    sections: ('SUMMARY' | 'LICENSES' | 'VULNERABILITIES' | 'CONTRIBUTIONS' | 'PROJECTS' | 'COMMUNITY')[];
}

export interface AIInsight {
    id: UUID;
    category: AiInsightCategory;
    title: string;
    description: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    relatedEntityId?: UUID; // e.g., Project ID
    generatedAt: string;
    actionable: boolean;
    suggestedAction?: string;
}

export interface LicenseCompatibilityResult {
    licenses: string[];
    compatible: boolean;
    reasoning: string;
    conflicts: { licenseA: string, licenseB: string, description: string }[];
}


export interface ApiError {
    message: string;
    statusCode: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}

// #endregion

// #region MOCK DATA AND API SIMULATION
// This section simulates a backend API for fetching OSPO data.

const MOCK_NAMES = ['Alice', 'Bob', 'Charlie', 'Diana', 'Evan', 'Fiona', 'George', 'Hannah', 'Ian', 'Julia'];
const MOCK_PROJECTS = ['Nexus', 'Orion', 'Pegasus', 'Andromeda', 'Cygnus', 'Vela', 'Draco', 'Phoenix', 'Hydra'];
const MOCK_REPOS = ['frontend', 'backend', 'docs', 'infra', 'mobile', 'sdk', 'cli', 'api-gateway', 'data-pipeline'];
const MOCK_COMPANIES = ['Innovate Inc.', 'Future Systems', 'DataCorp', 'Cloudify', 'Quantum Leap', 'Starlight Solutions', 'Momentum AI'];
const MOCK_LANGUAGES = ['TypeScript', 'Python', 'Go', 'Java', 'Rust', 'JavaScript', 'C#', 'Kotlin', 'Scala'];
const MOCK_LICENSES: License[] = [
    { spdxId: 'MIT', name: 'MIT License', type: 'Permissive', isOsiApproved: true, isFsfLibre: true, permissions: ['commercial-use', 'modifications', 'distribution', 'private-use'], conditions: ['include-copyright'], limitations: ['liability', 'warranty'], riskScore: 1, summary: 'A short and simple permissive license with conditions only requiring preservation of copyright and license notices.' },
    { spdxId: 'GPL-3.0-only', name: 'GNU GPL v3.0', type: 'Copyleft', isOsiApproved: true, isFsfLibre: true, permissions: ['commercial-use', 'modifications', 'distribution', 'private-use'], conditions: ['disclose-source', 'same-license', 'state-changes'], limitations: ['liability', 'warranty'], riskScore: 8, summary: 'A strong copyleft license that requires derivatives to be licensed under the same terms. Source code must be made available.' },
    { spdxId: 'Apache-2.0', name: 'Apache License 2.0', type: 'Permissive', isOsiApproved: true, isFsfLibre: true, permissions: ['commercial-use', 'modifications', 'distribution', 'private-use', 'patent-grant'], conditions: ['include-copyright', 'state-changes'], limitations: ['liability', 'warranty', 'trademark-use'], riskScore: 2, summary: 'A permissive license that also provides an express grant of patent rights from contributors to users.' },
    { spdxId: 'BSD-3-Clause', name: 'BSD 3-Clause License', type: 'Permissive', isOsiApproved: true, isFsfLibre: true, permissions: ['commercial-use', 'modifications', 'distribution', 'private-use'], conditions: ['include-copyright'], limitations: ['liability', 'warranty', 'no-endorsement'], riskScore: 2, summary: 'A permissive license that includes a clause restricting the use of the names of contributors for endorsement.' },
    { spdxId: 'Unlicense', name: 'The Unlicense', type: 'Permissive', isOsiApproved: true, isFsfLibre: true, permissions: [], conditions: [], limitations: [], riskScore: 1, summary: 'A public domain equivalent license that grants the right to use the software for any purpose without conditions.' },
    { spdxId: 'AGPL-3.0-only', name: 'GNU AGPL v3.0', type: 'Network Protective', isOsiApproved: true, isFsfLibre: true, permissions: ['commercial-use', 'modifications', 'distribution', 'private-use'], conditions: ['disclose-source', 'same-license', 'network-use-disclose', 'state-changes'], limitations: ['liability', 'warranty'], riskScore: 9, summary: 'A strong copyleft license designed for network software. It requires the source code to be shared with users who interact with it over a network.' },
    { spdxId: 'LGPL-3.0-only', name: 'GNU LGPL v3.0', type: 'Weakly Protective', isOsiApproved: true, isFsfLibre: true, permissions: ['commercial-use', 'modifications', 'distribution', 'private-use'], conditions: ['disclose-source', 'same-license-library', 'state-changes'], limitations: ['liability', 'warranty'], riskScore: 6, summary: 'A copyleft license that allows linking with non-GPL programs. Modified versions of the library must be released under LGPL.' },
];

const getRandomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomDate = (start: Date, end: Date): Date => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
const generateUUID = (): UUID => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
});

export const generateMockContributor = (id: number): Contributor => ({
    id: generateUUID(),
    username: `${getRandomElement(MOCK_NAMES)}${id}`,
    avatarUrl: `https://i.pravatar.cc/40?u=${id}`,
    githubUrl: `https://github.com/${getRandomElement(MOCK_NAMES)}${id}`,
    company: Math.random() > 0.8 ? getRandomElement(MOCK_COMPANIES) : 'YourCompany',
    contributionsCount: Math.floor(Math.random() * 200) + 1,
    lastContributionDate: getRandomDate(new Date(2022, 0, 1), new Date()).toISOString(),
    isExternal: Math.random() > 0.8,
    teams: ['Platform Engineering', 'Frontend Guild'],
});

export const generateMockContribution = (id: number, contributors: Contributor[]): Contribution => ({
    id: generateUUID(),
    type: getRandomElement(['COMMIT', 'PULL_REQUEST', 'ISSUE', 'COMMENT', 'REVIEW']),
    repository: `${getRandomElement(MOCK_PROJECTS)}/${getRandomElement(MOCK_REPOS)}`,
    repositoryUrl: 'https://github.com/example/repo',
    contributor: getRandomElement(contributors),
    title: `Fix: ${Math.random().toString(36).substring(7)}`,
    url: 'https://github.com/example/repo/pull/123',
    createdAt: getRandomDate(new Date(2022, 0, 1), new Date()).toISOString(),
    linesAdded: Math.floor(Math.random() * 500),
    linesRemoved: Math.floor(Math.random() * 200),
    commentsCount: Math.floor(Math.random() * 20),
    status: getRandomElement(['OPEN', 'MERGED', 'CLOSED', 'DRAFT']),
});

export const generateMockDependency = (id: number): Dependency => ({
    id: generateUUID(),
    name: `package-${id}-${Math.random().toString(36).substring(2, 7)}`,
    version: `${Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 20)}`,
    license: getRandomElement(MOCK_LICENSES),
    manager: getRandomElement(['npm', 'maven', 'pip', 'go', 'cargo', 'nuget']),
    isDevDependency: Math.random() > 0.5,
    path: `/src/node_modules/package-${id}`,
    complianceStatus: getRandomElement(['COMPLIANT', 'NON_COMPLIANT', 'PENDING', 'AT_RISK']),
    vulnerabilityCount: Math.floor(Math.random() * 5),
    lastScanned: getRandomDate(new Date(2023, 0, 1), new Date()).toISOString(),
});

export const generateMockVulnerability = (): Vulnerability => ({
    id: generateUUID(),
    cveId: `CVE-2023-${Math.floor(Math.random() * 90000) + 10000}`,
    packageName: `vulnerable-lib-${Math.random().toString(36).substring(7)}`,
    packageVersion: '1.2.3',
    severity: getRandomElement(['CRITICAL', 'HIGH', 'MODERATE', 'LOW']),
    summary: 'A remote code execution vulnerability exists in this package that could allow an attacker to take over the system.',
    url: 'https://nvd.nist.gov/vuln/detail/CVE-2023-12345',
    publishedDate: getRandomDate(new Date(2020, 0, 1), new Date()).toISOString(),
    remediation: {
        fixedInVersion: '1.2.4',
        recommendation: 'Upgrade to version 1.2.4 or later. If unable to upgrade, apply vendor-supplied patches.',
        aiGeneratedSummary: "This is a critical RCE flaw. The simplest fix is to upgrade the package. If that's not possible, specific function calls should be audited for unsanitized input.",
    },
    cwes: [`CWE-${Math.floor(Math.random() * 1000)}`],
    epssScore: Math.random(),
});

export const generateMockRepository = (): Repository => ({
    id: generateUUID(),
    name: getRandomElement(MOCK_REPOS),
    url: 'https://github.com/example/repo',
    owner: 'YourCompany',
    description: 'A repository for doing amazing things with modern technology stacks.',
    language: getRandomElement(MOCK_LANGUAGES),
    stars: Math.floor(Math.random() * 10000),
    forks: Math.floor(Math.random() * 1000),
    license: getRandomElement(MOCK_LICENSES),
    isArchived: Math.random() > 0.9,
    lastCommitDate: getRandomDate(new Date(2023, 0, 1), new Date()).toISOString(),
    codeCoverage: Math.floor(Math.random() * 50) + 50,
    ciCdStatus: getRandomElement(['SUCCESS', 'FAILED', 'IN_PROGRESS']),
});

export const generateMockProject = (id: number): Project => {
    const deps = Array.from({ length: Math.floor(Math.random() * 50) + 10 }, (_, i) => generateMockDependency(i));
    const vulns = Array.from({ length: Math.floor(Math.random() * 10) }, () => generateMockVulnerability());
    return {
        id: generateUUID(),
        name: `${getRandomElement(MOCK_PROJECTS)}-${id}`,
        type: getRandomElement(['INTERNAL', 'EXTERNAL_DEPENDENCY', 'CONTRIBUTED_TO', 'INNERSOURCE']),
        repositories: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, generateMockRepository),
        description: 'This project serves a critical business function by leveraging open source and innersource principles.',
        lead: getRandomElement(MOCK_NAMES),
        team: 'Platform Engineering',
        complianceStatus: getRandomElement(['COMPLIANT', 'NON_COMPLIANT', 'PENDING', 'AT_RISK']),
        securityRiskScore: Math.floor(Math.random() * 100),
        dependencies: deps,
        vulnerabilities: vulns,
        lastScanDate: getRandomDate(new Date(2023, 5, 1), new Date()).toISOString(),
        budget: { total: 50000, spent: Math.floor(Math.random() * 45000), year: 2023 },
        jiraProjectKey: `NEXUS-${id}`,
    };
};

export const generateMockPolicies = (): Policy[] => [
    { id: generateUUID(), name: 'Default Company Policy', status: 'ACTIVE', description: 'Base policy for all new projects. Requires permissive licenses and zero critical vulnerabilities in production.', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), author: 'Alice', rules: [
        { id: generateUUID(), type: 'ALLOW_LICENSE', value: 'MIT', description: 'Allow MIT license' },
        { id: generateUUID(), type: 'ALLOW_LICENSE', value: 'Apache-2.0', description: 'Allow Apache 2.0 license' },
        { id: generateUUID(), type: 'DENY_LICENSE', value: 'AGPL-3.0-only', description: 'Deny AGPL 3.0 without legal review' },
        { id: generateUUID(), type: 'MAX_CRITICAL_VULNERABILITIES', value: 0, description: 'No critical vulnerabilities allowed in production builds' },
        { id: generateUUID(), type: 'REQUIRE_SECURITY_SCAN', value: 'true', description: 'All PRs must pass a security scan' },
    ]},
    { id: generateUUID(), name: 'Internal Tools Policy', status: 'DRAFT', description: 'More relaxed policy for internal tooling, allowing weak copyleft licenses.', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), author: 'Bob', rules: [
        { id: generateUUID(), type: 'ALLOW_LICENSE', value: 'LGPL-3.0-only', description: 'Allow LGPL for internal libraries' },
    ]},
    { id: generateUUID(), name: 'Legacy Services Policy', status: 'ARCHIVED', description: 'Old policy for EOL services, kept for historical purposes.', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), author: 'Charlie', rules: [] },
];

export const generateMockCommunityHealth = (): CommunityHealthMetric[] => {
    let date = new Date();
    date.setMonth(date.getMonth() - 12);
    return Array.from({ length: 12 }).map(() => {
        date.setMonth(date.getMonth() + 1);
        return {
            date: date.toISOString(),
            newContributors: Math.floor(Math.random() * 10),
            issueResponseTimeHours: Math.random() * 48 + 8,
            prMergeTimeHours: Math.random() * 72 + 24,
            closedIssues: Math.floor(Math.random() * 50) + 20,
            openedIssues: Math.floor(Math.random() * 50) + 20,
            activeContributors: Math.floor(Math.random() * 20) + 15,
        };
    });
};

export const generateMockAIInsights = (): AIInsight[] => [
    { id: generateUUID(), category: 'RISK', title: 'High Risk in Project Phoenix', description: "Project Phoenix has 5 new critical vulnerabilities and is using a network-copyleft license (AGPL-3.0) which may violate company policy.", priority: 'HIGH', generatedAt: new Date().toISOString(), actionable: true, suggestedAction: 'Initiate immediate security and legal review for Project Phoenix.' },
    { id: generateUUID(), category: 'OPPORTUNITY', title: 'Growing Dependency on "react-query"', description: 'The library "react-query" is now used in over 80% of frontend projects. Consider creating internal experts or contributing back to the project.', priority: 'MEDIUM', generatedAt: new Date().toISOString(), actionable: true, suggestedAction: 'Form a "react-query" guild and allocate budget for sponsorship.' },
    { id: generateUUID(), category: 'COMMUNITY', title: 'Contributor Churn Risk', description: "Evan, a top external contributor, hasn't had a PR merged in over 6 weeks. Their last review had slow response times from the core team.", priority: 'HIGH', generatedAt: new Date().toISOString(), actionable: true, suggestedAction: 'Have the project lead reach out to Evan personally.'},
    { id: generateUUID(), category: 'EFFICIENCY', title: 'Slow PR Merges in Orion Backend', description: 'The average PR merge time for the Orion backend repository is 96 hours, 200% above the company average. This is slowing down development.', priority: 'MEDIUM', generatedAt: new Date().toISOString(), actionable: false },
];

const MOCK_DB = {
    contributors: Array.from({ length: 50 }, (_, i) => generateMockContributor(i)),
    contributions: [] as Contribution[],
    projects: Array.from({ length: 20 }, (_, i) => generateMockProject(i)),
    policies: generateMockPolicies(),
    communityHealth: generateMockCommunityHealth(),
    aiInsights: generateMockAIInsights(),
};
MOCK_DB.contributions = Array.from({ length: 500 }, (_, i) => generateMockContribution(i, MOCK_DB.contributors));

export class MockOspoApiService {
    private simulateLatency(ms: number = 500): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms + Math.random() * 300));
    }

    async getDashboardStats() {
        await this.simulateLatency();
        return {
            totalProjects: MOCK_DB.projects.length,
            compliantProjects: MOCK_DB.projects.filter(p => p.complianceStatus === 'COMPLIANT').length,
            totalVulnerabilities: MOCK_DB.projects.reduce((acc, p) => acc + p.vulnerabilities.length, 0),
            criticalVulnerabilities: MOCK_DB.projects.reduce((acc, p) => acc + p.vulnerabilities.filter(v => v.severity === 'CRITICAL').length, 0),
            totalContributions: MOCK_DB.contributions.length,
            activeContributors: new Set(MOCK_DB.contributions.map(c => c.contributor.id)).size,
        };
    }

    async getProjects(page: number = 1, limit: number = 10, filter: string = '', sortBy: string = 'name'): Promise<PaginatedResponse<Project>> {
        await this.simulateLatency();
        let filtered = MOCK_DB.projects.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()));
        
        filtered.sort((a, b) => {
            if (sortBy === 'name') return a.name.localeCompare(b.name);
            if (sortBy === 'risk') return b.securityRiskScore - a.securityRiskScore;
            return 0;
        });

        const start = (page - 1) * limit;
        const end = start + limit;
        return {
            data: filtered.slice(start, end),
            total: filtered.length,
            page,
            limit
        };
    }

    async getProjectById(id: UUID): Promise<Project | null> {
        await this.simulateLatency(300);
        return MOCK_DB.projects.find(p => p.id === id) || null;
    }
    
    async getContributions(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Contribution>> {
        await this.simulateLatency(800);
        const start = (page - 1) * limit;
        const end = start + limit;
        return {
            data: MOCK_DB.contributions.slice(start, end),
            total: MOCK_DB.contributions.length,
            page,
            limit
        };
    }

    async getVulnerabilities(page: number = 1, limit: number = 10, severity?: VulnerabilitySeverity): Promise<PaginatedResponse<Vulnerability>> {
        await this.simulateLatency();
        const allVulnerabilities = MOCK_DB.projects.flatMap(p => p.vulnerabilities);
        const filtered = severity ? allVulnerabilities.filter(v => v.severity === severity) : allVulnerabilities;
        const start = (page - 1) * limit;
        const end = start + limit;
        return {
            data: filtered.slice(start, end),
            total: filtered.length,
            page,
            limit
        };
    }
    
    async getPolicies(): Promise<Policy[]> {
        await this.simulateLatency(200);
        return MOCK_DB.policies;
    }
    
    async getCommunityHealth(): Promise<CommunityHealthMetric[]> {
        await this.simulateLatency(600);
        return MOCK_DB.communityHealth;
    }
    
    async getAIInsights(): Promise<AIInsight[]> {
        await this.simulateLatency(1200);
        return MOCK_DB.aiInsights;
    }
    
    async checkLicenseCompatibility(licenses: string[]): Promise<LicenseCompatibilityResult> {
        await this.simulateLatency(1500);
        if (licenses.includes('GPL-3.0-only') && licenses.includes('Apache-2.0')) {
            return {
                licenses,
                compatible: false,
                reasoning: "GPL-3.0 and Apache-2.0 have compatibility issues. Specifically, code licensed under Apache 2.0 can be included in a GPL-3.0 project, but the combined work must be licensed under GPL-3.0. The patent grant and termination clauses can also be complex.",
                conflicts: [{ licenseA: 'GPL-3.0-only', licenseB: 'Apache-2.0', description: "Patent grant and copyleft requirements conflict." }],
            };
        }
        return {
            licenses,
            compatible: true,
            reasoning: "The selected permissive licenses (MIT, Apache-2.0) are compatible with each other and do not impose conflicting requirements on the combined work.",
            conflicts: [],
        };
    }
    
    async askAIPolicyAdvisor(question: string): Promise<string> {
        await this.simulateLatency(2000);
        if (question.toLowerCase().includes("agpl")) {
            return "The AGPL-3.0 license is considered high-risk and is denied by default under the 'Default Company Policy'. Its 'network use disclosure' clause requires that the full source code be made available to anyone interacting with the software over a network. To use an AGPL-3.0 licensed dependency, you must file for an exception with the legal team, providing a strong business justification and a plan for compliance.";
        }
        return "Based on our policies, using permissive licenses like MIT or Apache-2.0 is generally encouraged and pre-approved. They offer flexibility and are low-risk. For any specific questions about copyleft licenses or commercial licenses, please consult the detailed policy documents or file a query with the legal team through the OSPO portal.";
    }
}

export const ospoApi = new MockOspoApiService();
// #endregion

// #region UTILITY FUNCTIONS AND HOOKS

export const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

export const getSeverityColor = (severity: VulnerabilitySeverity): string => {
    const colors: Record<VulnerabilitySeverity, string> = {
        CRITICAL: 'bg-red-500 text-white',
        HIGH: 'bg-orange-500 text-white',
        MODERATE: 'bg-yellow-500 text-black',
        LOW: 'bg-blue-500 text-white',
        INFO: 'bg-gray-500 text-white',
    };
    return colors[severity] || 'bg-gray-200 text-black';
};

export const getComplianceColor = (status: ComplianceStatus): string => {
    const colors: Record<ComplianceStatus, string> = {
        COMPLIANT: 'bg-green-500 text-white',
        NON_COMPLIANT: 'bg-red-500 text-white',
        PENDING: 'bg-yellow-500 text-black',
        AT_RISK: 'bg-orange-500 text-white',
        UNKNOWN: 'bg-gray-400 text-white',
    };
    return colors[status] || 'bg-gray-400 text-white';
};

export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => { setDebouncedValue(value); }, delay);
        return () => { clearTimeout(handler); };
    }, [value, delay]);
    return debouncedValue;
}

export interface ApiDataState<T> {
    data: T | null;
    loading: boolean;
    error: ApiError | null;
    refetch: () => void;
}

export function useApiData<T>(apiCall: () => Promise<T>, deps: React.DependencyList = []): ApiDataState<T> {
    const [state, setState] = useState<Omit<ApiDataState<T>, 'refetch'>>({ data: null, loading: true, error: null });
    const [trigger, setTrigger] = useState(0);

    const refetch = useCallback(() => setTrigger(t => t + 1), []);

    useEffect(() => {
        let isMounted = true;
        setState(s => ({ ...s, loading: true }));
        apiCall()
            .then(data => { if (isMounted) setState({ data, loading: false, error: null }); })
            .catch(error => { if (isMounted) setState({ data: null, loading: false, error: { message: error.message, statusCode: 500 } }); });
        return () => { isMounted = false; };
    }, [...deps, trigger]);

    return { ...state, refetch };
}

// #endregion

// #region GENERIC UI COMPONENTS

const ICONS = {
    PROJECT: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
    CHECK: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
    ALERT: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
    CONTRIBUTION: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
    USER: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
    LICENSE: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
    AI: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
}

export const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg'; text?: string; }> = ({ size = 'md', text }) => {
    const sizeClasses = { sm: 'w-6 h-6 border-2', md: 'w-10 h-10 border-4', lg: 'w-16 h-16 border-4' };
    return (
        <div className="flex flex-col items-center justify-center p-4">
            <div className={`animate-spin rounded-full border-gray-300 border-t-blue-500 ${sizeClasses[size]}`}></div>
            {text && <p className="mt-2 text-gray-400">{text}</p>}
        </div>
    );
};

export const Alert: React.FC<{ type: 'error' | 'success' | 'warning' | 'info'; title: string; message: string; }> = ({ type, title, message }) => {
    const colors = {
        error: 'bg-red-900 border-red-500 text-red-100',
        success: 'bg-green-900 border-green-500 text-green-100',
        warning: 'bg-yellow-900 border-yellow-500 text-yellow-100',
        info: 'bg-blue-900 border-blue-500 text-blue-100',
    };
    return (
        <div className={`border-l-4 p-4 ${colors[type]}`} role="alert">
            <p className="font-bold">{title}</p>
            <p>{message}</p>
        </div>
    );
};

export const Tabs: React.FC<{ tabs: { name: string; content: React.ReactNode }[]; defaultTab?: number; }> = ({ tabs, defaultTab = 0 }) => {
    const [activeTab, setActiveTab] = useState(defaultTab);
    return (
        <div>
            <div className="border-b border-gray-700">
                <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
                    {tabs.map((tab, index) => (
                        <button key={tab.name} onClick={() => setActiveTab(index)}
                            className={`${ index === activeTab ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500' } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
                            {tab.name}
                        </button>
                    ))}
                </nav>
            </div>
            <div className="pt-4">{tabs[activeTab]?.content}</div>
        </div>
    );
};

export const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; size?: 'md' | 'lg' | 'xl' | '2xl' }> = ({ isOpen, onClose, title, children, size = '2xl' }) => {
    if (!isOpen) return null;
    const sizeClasses = { md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-xl', '2xl': 'max-w-2xl' };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center" onClick={onClose}>
            <div className={`bg-gray-800 rounded-lg shadow-xl w-full ${sizeClasses[size]} max-h-[90vh] flex flex-col`} onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h3 className="text-lg font-semibold text-white">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
                </div>
                <div className="p-6 overflow-y-auto">{children}</div>
            </div>
        </div>
    );
};

export const StatCard: React.FC<{ title: string; value: string | number; change?: number; changeType?: 'increase' | 'decrease'; icon: React.ReactNode; }> = ({ title, value, change, changeType, icon }) => {
    const isIncrease = changeType === 'increase';
    const changeColor = changeType ? (isIncrease ? 'text-green-400' : 'text-red-400') : 'text-gray-400';
    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-md flex items-center">
            <div className="bg-gray-700 p-3 rounded-full mr-4 text-white">{icon}</div>
            <div>
                <p className="text-sm text-gray-400">{title}</p>
                <p className="text-2xl font-bold text-white">{value}</p>
                {change !== undefined && ( <p className={`text-xs ${changeColor}`}>{isIncrease ? '▲' : '▼'} {Math.abs(change)}% from last month</p> )}
            </div>
        </div>
    );
};

export interface Column<T> { accessor: keyof T | 'actions'; header: string; cell?: (item: T) => React.ReactNode; sortable?: boolean; }
export type SortConfig<T> = { key: keyof T; direction: 'ascending' | 'descending'; } | null;
export interface DataTableProps<T> { data: T[]; columns: Column<T>[]; loading?: boolean; onRowClick?: (item: T) => void; }

export const DataTable = <T extends { id: UUID }>({ data, columns, loading, onRowClick }: DataTableProps<T>) => {
    const [sortConfig, setSortConfig] = useState<SortConfig<T>>(null);
    const [filterText, setFilterText] = useState('');
    const debouncedFilter = useDebounce(filterText, 300);

    const filteredData = useMemo(() => {
        if (!debouncedFilter) return data;
        return data.filter(item => columns.some(column => {
                if (column.accessor === 'actions') return false;
                const value = item[column.accessor as keyof T];
                return String(value).toLowerCase().includes(debouncedFilter.toLowerCase());
            }));
    }, [data, columns, debouncedFilter]);

    const sortedData = useMemo(() => {
        let sortableItems = [...filteredData];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        return sortableItems;
    }, [filteredData, sortConfig]);

    const requestSort = (key: keyof T) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') direction = 'descending';
        setSortConfig({ key, direction });
    };

    if (loading) return <Spinner text="Loading data..." />;
    return (
        <div className="bg-gray-800 rounded-lg p-4">
            <input type="text" placeholder="Filter table..." value={filterText} onChange={(e) => setFilterText(e.target.value)} className="w-full md:w-1/3 p-2 bg-gray-700 text-white rounded-md mb-4" />
            <div className="overflow-x-auto"><table className="min-w-full divide-y divide-gray-700"><thead className="bg-gray-900"><tr>
                {columns.map(column => (<th key={String(column.accessor)} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    {column.sortable ? (<button onClick={() => requestSort(column.accessor as keyof T)} className="w-full text-left">{column.header} {sortConfig?.key === column.accessor && (sortConfig.direction === 'ascending' ? '▲' : '▼')}</button>) : (column.header)}
                </th>))}
            </tr></thead><tbody className="bg-gray-800 divide-y divide-gray-700">
                {sortedData.map((item) => (<tr key={item.id} className={`hover:bg-gray-700 ${onRowClick ? 'cursor-pointer' : ''}`} onClick={() => onRowClick && onRowClick(item)}>
                    {columns.map(column => (<td key={String(column.accessor)} className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{column.cell ? column.cell(item) : column.accessor === 'actions' ? null : String(item[column.accessor as keyof T])}</td>))}
                </tr>))}
            </tbody></table></div>
            {sortedData.length === 0 && <p className="text-center py-4 text-gray-400">No data available.</p>}
        </div>
    );
};
// #endregion

// #region DASHBOARD SUB-VIEWS

const OverviewDashboard: React.FC = () => {
    const { data: stats, loading: statsLoading, error: statsError } = useApiData(() => ospoApi.getDashboardStats());
    const { data: insights, loading: insightsLoading, error: insightsError } = useApiData(() => ospoApi.getAIInsights());

    if (statsLoading) return <Spinner text="Loading overview..."/>;
    if (statsError) return <Alert type="error" title="Failed to load stats" message={statsError.message} />;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatCard title="Total Projects" value={stats?.totalProjects || 0} icon={ICONS.PROJECT} />
                <StatCard title="Compliant Projects" value={`${Math.round(((stats?.compliantProjects || 0) / (stats?.totalProjects || 1)) * 100)}%`} icon={ICONS.CHECK} />
                <StatCard title="Critical Vulnerabilities" value={stats?.criticalVulnerabilities || 0} change={5} changeType="increase" icon={ICONS.ALERT} />
                <StatCard title="Total Contributions" value={stats?.totalContributions || 0} icon={ICONS.CONTRIBUTION} />
                <StatCard title="Active Contributors" value={stats?.activeContributors || 0} change={2} changeType="decrease" icon={ICONS.USER} />
                <StatCard title="License Scan Coverage" value="98%" icon={ICONS.LICENSE} />
            </div>
            <div className="lg:col-span-1 bg-gray-800 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">{ICONS.AI} <span className="ml-2">AI-Powered Insights</span></h3>
                {insightsLoading && <Spinner size="sm" />}
                {insightsError && <Alert type="error" title="Insights Error" message={insightsError.message} />}
                <div className="space-y-4">
                    {insights?.map(insight => (
                        <div key={insight.id} className={`border-l-4 p-3 rounded-r-lg ${insight.priority === 'HIGH' ? 'border-red-500 bg-red-900/20' : 'border-blue-500 bg-blue-900/20'}`}>
                            <p className="font-semibold text-white">{insight.title}</p>
                            <p className="text-sm text-gray-300">{insight.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const ProjectsView: React.FC = () => {
    const [page, setPage] = useState(1);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const { data: projectsResponse, loading, error } = useApiData(() => ospoApi.getProjects(page, 10), [page]);
    
    const columns: Column<Project>[] = [
        { accessor: 'name', header: 'Project Name', sortable: true },
        { accessor: 'type', header: 'Type', sortable: true },
        { accessor: 'lead', header: 'Lead', sortable: true },
        { accessor: 'complianceStatus', header: 'Compliance', cell: (p) => <span className={`px-2 py-1 rounded-full text-xs ${getComplianceColor(p.complianceStatus)}`}>{p.complianceStatus}</span> },
        { accessor: 'securityRiskScore', header: 'Risk Score', sortable: true },
        { accessor: 'lastScanDate', header: 'Last Scan', cell: (p) => <span>{formatDate(p.lastScanDate)}</span> },
    ];
    
    return (
        <div>
            <h2 className="text-xl font-semibold text-white mb-4">Project Inventory</h2>
            {error && <Alert type="error" title="Failed to load projects" message={error.message} />}
            <DataTable columns={columns} data={projectsResponse?.data || []} loading={loading} onRowClick={(project) => setSelectedProject(project)} />
             <Modal isOpen={!!selectedProject} onClose={() => setSelectedProject(null)} title={selectedProject?.name || ''}>
                {selectedProject && <ProjectDetailView project={selectedProject} />}
            </Modal>
        </div>
    );
};

const ProjectDetailView: React.FC<{ project: Project }> = ({ project }) => {
    const TABS = [
        { name: 'Dependencies', content: <div className="max-h-96 overflow-y-auto bg-gray-900 p-2 rounded">
            {project.dependencies.map(dep => (
                <div key={dep.id} className="flex justify-between items-center p-1 text-sm">
                    <span>{dep.name}@{dep.version}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${getComplianceColor(dep.complianceStatus)}`}>{dep.license.spdxId}</span>
                </div>
            ))}
        </div> },
        { name: 'Vulnerabilities', content: <div className="max-h-96 overflow-y-auto bg-gray-900 p-2 rounded">
            {project.vulnerabilities.map(vuln => (
                <div key={vuln.id} className="flex justify-between items-center p-1 text-sm">
                    <span>{vuln.cveId} ({vuln.packageName})</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${getSeverityColor(vuln.severity)}`}>{vuln.severity}</span>
                </div>
            ))}
        </div> },
        { name: 'Repositories', content: <div className="max-h-96 overflow-y-auto bg-gray-900 p-2 rounded">
            {project.repositories.map(repo => <div key={repo.id} className="p-2 border-b border-gray-700">
                <p className="font-semibold">{repo.name} <span className="text-xs font-normal text-gray-400">({repo.language})</span></p>
                <p className="text-sm">Coverage: {repo.codeCoverage}% | CI/CD: {repo.ciCdStatus}</p>
            </div>)}
        </div> },
    ];

    return (
        <div className="text-gray-300 space-y-4">
            <p><strong>Lead:</strong> {project.lead} | <strong>Team:</strong> {project.team}</p>
            <p><strong>Description:</strong> {project.description}</p>
            <Tabs tabs={TABS} />
        </div>
    );
};

const SecurityView: React.FC = () => {
    const [page, setPage] = useState(1);
    const { data, loading, error } = useApiData(() => ospoApi.getVulnerabilities(page, 15), [page]);
    
    const columns: Column<Vulnerability>[] = [
        { accessor: 'cveId', header: 'CVE ID', sortable: true },
        { accessor: 'packageName', header: 'Package', sortable: true },
        { accessor: 'severity', header: 'Severity', sortable: true, cell: (v) => <span className={`px-2 py-1 rounded-full text-xs ${getSeverityColor(v.severity)}`}>{v.severity}</span> },
        { accessor: 'summary', header: 'Summary', cell: (v) => <p className="truncate w-64">{v.summary}</p> },
        { accessor: 'publishedDate', header: 'Published', cell: (v) => <span>{formatDate(v.publishedDate)}</span> },
    ];
    
    return (
        <div>
            <h2 className="text-xl font-semibold text-white mb-4">Security Vulnerabilities</h2>
            {error && <Alert type="error" title="Failed to load vulnerabilities" message={error.message} />}
            <DataTable columns={columns} data={data?.data || []} loading={loading} />
        </div>
    );
};

const ComplianceView: React.FC = () => {
    const { data: projects, loading } = useApiData(() => ospoApi.getProjects(1, 100));
    const [selectedLicenses, setSelectedLicenses] = useState<string[]>([]);
    const [compatibilityResult, setCompatibilityResult] = useState<LicenseCompatibilityResult | null>(null);
    const [checking, setChecking] = useState(false);

    const licenseUsage = useMemo(() => {
        if (!projects) return {};
        const usage: Record<string, { count: number, type: LicenseType }> = {};
        projects.data.forEach(p => p.dependencies.forEach(d => {
            usage[d.license.name] = { count: (usage[d.license.name]?.count || 0) + 1, type: d.license.type };
        }));
        return usage;
    }, [projects]);
    
    const handleCheckCompatibility = async () => {
        setChecking(true);
        const result = await ospoApi.checkLicenseCompatibility(selectedLicenses);
        setCompatibilityResult(result);
        setChecking(false);
    };

    if (loading) return <Spinner />;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="font-semibold mb-2 text-white">License Distribution</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                    {Object.entries(licenseUsage).sort(([,a],[,b]) => b.count - a.count).map(([name, data]) => (
                        <div key={name} className="flex items-center">
                            <span className="w-1/3 text-gray-300 text-sm truncate">{name}</span>
                            <div className="w-2/3 bg-gray-700 rounded-full h-4"><div className="bg-blue-500 h-4 rounded-full" style={{ width: `${(data.count / Math.max(...Object.values(licenseUsage).map(d => d.count)))*100}%` }}></div></div>
                            <span className="ml-2 text-white text-sm">{data.count}</span>
                        </div>
                    ))}
                </div>
            </div>
             <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="font-semibold mb-2 text-white">AI License Compatibility Checker</h3>
                <p className="text-sm text-gray-400 mb-2">Select licenses to check for compatibility issues.</p>
                <div className="flex flex-wrap gap-2 mb-4">
                    {MOCK_LICENSES.map(l => (
                        <button key={l.spdxId} onClick={() => setSelectedLicenses(s => s.includes(l.spdxId) ? s.filter(id => id !== l.spdxId) : [...s, l.spdxId])} 
                        className={`px-2 py-1 text-xs rounded ${selectedLicenses.includes(l.spdxId) ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-200'}`}>{l.spdxId}</button>
                    ))}
                </div>
                <button onClick={handleCheckCompatibility} disabled={checking || selectedLicenses.length < 2} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-500">
                    {checking ? 'Checking...' : `Check Compatibility (${selectedLicenses.length})`}
                </button>
                {compatibilityResult && <div className={`mt-4 p-3 rounded ${compatibilityResult.compatible ? 'bg-green-900' : 'bg-red-900'}`}>
                    <h4 className="font-bold">{compatibilityResult.compatible ? 'Compatible' : 'Potential Conflict'}</h4>
                    <p className="text-sm">{compatibilityResult.reasoning}</p>
                </div>}
            </div>
        </div>
    );
};

const ContributionsView: React.FC = () => {
    const [page, setPage] = useState(1);
    const { data, loading, error } = useApiData(() => ospoApi.getContributions(page, 15), [page]);
    
    const columns: Column<Contribution>[] = [
        { accessor: 'contributor', header: 'Contributor', cell: (c) => (<div className="flex items-center"><img src={c.contributor.avatarUrl} alt={c.contributor.username} className="w-8 h-8 rounded-full mr-2" /><span>{c.contributor.username}</span></div>)},
        { accessor: 'type', header: 'Type' },
        { accessor: 'repository', header: 'Repository' },
        { accessor: 'title', header: 'Title' },
        { accessor: 'createdAt', header: 'Date', cell: (c) => <span>{formatDate(c.createdAt)}</span> },
    ];
    
    return (
        <div>
            <h2 className="text-xl font-semibold text-white mb-4">Contribution Log</h2>
            {error && <Alert type="error" title="Failed to load contributions" message={error.message} />}
            <DataTable columns={columns} data={data?.data || []} loading={loading} />
        </div>
    );
};

const PoliciesView: React.FC = () => {
    const { data: policies, loading, error } = useApiData(() => ospoApi.getPolicies());

    if (loading) return <Spinner />;
    if (error) return <Alert type="error" title="Failed to load policies" message={error.message} />;

    return (
        <div>
            <h2 className="text-xl font-semibold text-white mb-4">OSPO Policies</h2>
            <div className="space-y-4">
                {policies?.map(policy => (
                    <div key={policy.id} className="bg-gray-800 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-lg text-white">{policy.name}</h3>
                            <span className={`px-3 py-1 text-sm rounded-full ${policy.status === 'ACTIVE' ? 'bg-green-600' : 'bg-gray-600'}`}>{policy.status}</span>
                        </div>
                        <p className="text-gray-400 mt-1">{policy.description}</p>
                        <div className="mt-4 border-t border-gray-700 pt-3">
                            <h4 className="font-semibold text-gray-200">Rules ({policy.rules.length})</h4>
                            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-300">
                                {policy.rules.map(rule => <li key={rule.id}><strong>{rule.type}:</strong> {rule.value.toString()} - <em>{rule.description}</em></li>)}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const AIPolicyAdvisorView: React.FC = () => {
    const [messages, setMessages] = useState<{sender: 'user' | 'ai', text: string}[]>([]);
    const [input, setInput] = useState('');
    const [thinking, setThinking] = useState(false);
    
    const handleSend = async () => {
        if (!input.trim()) return;
        const newMessages = [...messages, { sender: 'user', text: input }];
        setMessages(newMessages);
        setInput('');
        setThinking(true);
        const response = await ospoApi.askAIPolicyAdvisor(input);
        setMessages([...newMessages, { sender: 'ai', text: response }]);
        setThinking(false);
    }

    return (
        <div className="flex flex-col h-[60vh] bg-gray-800 rounded-lg p-4">
            <h2 className="text-xl font-semibold text-white mb-4">AI Policy Advisor</h2>
            <div className="flex-grow overflow-y-auto mb-4 p-2 bg-gray-900 rounded">
                {messages.map((msg, i) => (
                    <div key={i} className={`chat ${msg.sender === 'user' ? 'chat-end' : 'chat-start'}`}>
                        <div className="chat-bubble bg-gray-700 text-white">{msg.text}</div>
                    </div>
                ))}
                {thinking && <div className="chat chat-start"><div className="chat-bubble bg-gray-700 text-white">...</div></div>}
            </div>
            <div className="flex">
                <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSend()} placeholder="Ask about license policies..." className="flex-grow p-2 bg-gray-700 text-white rounded-l-md" />
                <button onClick={handleSend} disabled={thinking} className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-2 rounded-r-md">Send</button>
            </div>
        </div>
    )
}
// #endregion


const OSPOView: React.FC = () => {
    const TABS = [
        { name: 'Dashboard', content: <OverviewDashboard /> },
        { name: 'Projects', content: <ProjectsView /> },
        { name: 'Security', content: <SecurityView /> },
        { name: 'License Compliance', content: <ComplianceView /> },
        { name: 'Contributions', content: <ContributionsView /> },
        { name: 'Policies', content: <PoliciesView /> },
        { name: 'AI Policy Advisor', content: <AIPolicyAdvisorView />},
    ];

    return (
        <Card title="Open Source Program Office (OSPO) Command Center">
            <p className="text-gray-400 mb-6">A centralized dashboard for managing, monitoring, and optimizing the organization's engagement with open source software. Powered by AI-driven insights.</p>
            <Tabs tabs={TABS} />
        </Card>
    );
};

export default OSPOView;