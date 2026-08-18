// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/platform/DemoBankHRISView.tsx
================================================================================

// components/views/platform/DemoBankHRISView.tsx
import React, from 'react';
import { GoogleGenAI } from "@google/genai";
import { DataContext } from '../../../context/DataContext';
import { Employee } from '../../../types';

// --- ENHANCED TYPES FOR REAL-WORLD APPLICATION ---

export type UserRole = 'Admin' | 'HR Manager' | 'Manager' | 'Employee' | 'Recruiter' | 'Finance';
export type EmploymentStatus = 'Full-Time' | 'Part-Time' | 'Contract' | 'Intern' | 'Terminated' | 'On Leave';
export type LeaveType = 'Vacation' | 'Sick Leave' | 'Personal' | 'Parental' | 'Unpaid' | 'Bereavement';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
export type PerformanceRating = 1 | 2 | 3 | 4 | 5;
export type ApplicantStatus = 'Applied' | 'Screening' | 'Interviewing' | 'Offer Extended' | 'Hired' | 'Rejected' | 'On Hold';
export type JobStatus = 'Open' | 'Closed' | 'Draft' | 'Archived';
export type NotificationType = 'success' | 'error' | 'info' | 'warning';
export type GoalStatus = 'On Track' | 'Needs Attention' | 'Completed' | 'Postponed';
export type DocumentCategory = 'Policy' | 'Handbook' | 'Form' | 'Training' | 'Legal';
export type OnboardingTaskStatus = 'Pending' | 'In Progress' | 'Completed' | 'Blocked';
export type BenefitType = 'Health' | 'Dental' | 'Vision' | 'Retirement' | 'Life Insurance';
export type ReportType = 'Headcount' | 'Diversity & Inclusion' | 'Turnover' | 'Compensation' | 'Recruitment Funnel';

export interface Compensation {
    baseSalary: number;
    bonus?: number;
    stockOptions?: number;
    currency: 'USD' | 'EUR' | 'GBP' | 'JPY';
    payFrequency: 'Annual' | 'Monthly' | 'Bi-Weekly' | 'Weekly';
    effectiveDate: string;
    history: Compensation[];
}

export interface EmergencyContact {
    id: string;
    name: string;
    relationship: string;
    phone: string;
    email?: string;
}

export interface BankDetails {
    bankName: string;
    accountNumber: string;
    routingNumber: string;
}

export interface EnhancedEmployee extends Employee {
    email: string;
    phone: string;
    address: string;
    hireDate: string;
    terminationDate?: string;
    dateOfBirth: string;
    employmentStatus: EmploymentStatus;
    managerId?: string;
    directReports?: string[];
    userRole: UserRole;
    avatarUrl?: string;
    compensation: Compensation;
    emergencyContacts: EmergencyContact[];
    bankDetails: BankDetails;
    skills: string[];
    certifications: string[];
    pronouns?: string;
    linkedinProfile?: string;
}

export interface LeaveRequest {
    id: string;
    employeeId: string;
    leaveType: LeaveType;
    startDate: string;
    endDate: string;
    reason: string;
    status: LeaveStatus;
    approverId?: string;
    comments?: string;
    requestedDate: string;
}

export interface Goal {
    id: string;
    description: string;
    status: GoalStatus;
    dueDate: string;
    weight: number; // e.g. 0.2 for 20%
}

export interface PerformanceReview {
    id: string;
    employeeId: string;
    reviewerId: string;
    reviewDate: string;
    periodStartDate: string;
    periodEndDate: string;
    overallRating: PerformanceRating;
    strengths: string;
    areasForImprovement: string;
    employeeComments?: string;
    goals: Goal[];
    feedback360: {
        fromId: string;
        feedback: string;
        isAnonymous: boolean;
    }[];
}

export interface JobOpening {
    id: string;
    title: string;
    department: string;
    location: string;
    isRemote: boolean;
    description: string;
    responsibilities: string[];
    qualifications: string[];
    status: JobStatus;
    postedDate: string;
    hiringManagerId: string;
    salaryRange: { min: number; max: number; currency: 'USD' };
}

export interface Applicant {
    id:string;
    jobOpeningId: string;
    name: string;
    email: string;
    phone: string;
    resumeUrl: string;
    coverLetter?: string;
    status: ApplicantStatus;
    applicationDate: string;
    interviewNotes?: {
        interviewerId: string;
        date: string;
        notes: string;
        rating: PerformanceRating;
    }[];
    aiScreeningScore?: number;
    aiResumeSummary?: string;
}

export interface CompanyDocument {
    id: string;
    name: string;
    category: DocumentCategory;
    url: string;
    lastUpdated: string;
    version: string;
}

export interface SystemNotification {
    id: string;
    message: string;
    type: NotificationType;
    timestamp: number;
    isRead: boolean;
}

export interface OnboardingTask {
    id: string;
    title: string;
    description: string;
    status: OnboardingTaskStatus;
    dueDate: string;
    assigneeId: string; // The new hire
    ownerId: string; // HR or Manager
}

export interface OnboardingPlan {
    id: string;
    employeeId: string;
    startDate: string;
    tasks: OnboardingTask[];
}

export interface BenefitPlan {
    id: string;
    name: string;
    type: BenefitType;
    provider: string;
    description: string;
    monthlyCost: number;
}

export interface EmployeeBenefit {
    employeeId: string;
    planId: string;
    enrollmentDate: string;
    status: 'Enrolled' | 'Waived';
}

export interface Payroll {
    id: string;
    employeeId: string;
    payPeriodStart: string;
    payPeriodEnd: string;
    payDate: string;
    grossPay: number;
    netPay: number;
    taxes: number;
    deductions: number; // for benefits, etc.
}

export interface AIAttritionPrediction {
    employeeId: string;
    riskScore: number; // 0-100
    riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
    keyFactors: string[];
    lastEvaluated: string;
}

export interface OrgChartNode {
    id: string;
    name: string;
    role: string;
    avatarUrl?: string;
    children: OrgChartNode[];
}

// --- MOCK DATA GENERATORS ---

const MOCK_NAMES = ['Alice Johnson', 'Bob Williams', 'Charlie Brown', 'Diana Miller', 'Ethan Davis', 'Fiona Garcia', 'George Rodriguez', 'Hannah Martinez', 'Ivan Hernandez', 'Julia Lopez'];
const MOCK_SKILLS = ['React', 'TypeScript', 'Node.js', 'Team Leadership', 'Agile', 'Python', 'AWS', 'SQL', 'Project Management', 'UI/UX Design', 'Data Analysis'];
const MOCK_RELATIONSHIPS = ['Spouse', 'Parent', 'Sibling', 'Friend', 'Partner'];
const MOCK_DEPARTMENTS = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Design', 'Product'];

export const generateMockEmergencyContacts = (count: number): EmergencyContact[] => Array.from({ length: count }, (_, i) => ({
    id: `ec-${Date.now()}-${i}`,
    name: `Contact Name ${i + 1}`,
    relationship: MOCK_RELATIONSHIPS[i % MOCK_RELATIONSHIPS.length],
    phone: `555-010${i}`,
}));

export const generateMockEnhancedEmployees = (employees: Employee[]): EnhancedEmployee[] => employees.map((emp, index) => ({
    ...emp,
    email: `${emp.name.toLowerCase().replace(' ', '.')}@demobank.com`,
    phone: `555-02${index.toString().padStart(2, '0')}`,
    address: `${100 + index} Market St, San Francisco, CA 94105`,
    hireDate: new Date(2020 + (index % 4), index % 12, (index % 28) + 1).toISOString().split('T')[0],
    dateOfBirth: new Date(1980 + (index % 20), index % 12, (index % 28) + 1).toISOString().split('T')[0],
    employmentStatus: index % 10 === 0 ? 'Part-Time' : index % 15 === 0 ? 'Contract' : 'Full-Time',
    managerId: employees.find(e => e.department === emp.department && e.role.includes('Manager'))?.id,
    directReports: [],
    userRole: emp.role.includes('Manager') ? 'Manager' : emp.department === 'HR' ? 'HR Manager' : 'Employee',
    avatarUrl: `https://i.pravatar.cc/150?u=${emp.id}`,
    pronouns: index % 3 === 0 ? 'they/them' : index % 2 === 0 ? 'she/her' : 'he/him',
    compensation: {
        baseSalary: 80000 + (index * 5000),
        currency: 'USD',
        payFrequency: 'Annual',
        bonus: 5000 + (index * 500),
        effectiveDate: new Date(2023, 0, 1).toISOString(),
        history: [],
    },
    emergencyContacts: generateMockEmergencyContacts(2),
    bankDetails: {
        bankName: 'Demo Bank',
        accountNumber: `****${(1000 + index).toString()}`,
        routingNumber: '121000358',
    },
    skills: MOCK_SKILLS.slice(index % 5, (index % 5) + 4),
    certifications: index % 5 === 0 ? ['Certified Scrum Master', 'AWS Certified Developer'] : [],
}));

export const generateMockLeaveRequests = (employees: EnhancedEmployee[]): LeaveRequest[] => {
    const requests: LeaveRequest[] = [];
    const leaveTypes: LeaveType[] = ['Vacation', 'Sick Leave', 'Personal'];
    const statuses: LeaveStatus[] = ['Pending', 'Approved', 'Rejected'];
    for (let i = 0; i < employees.length * 1.5; i++) {
        const emp = employees[i % employees.length];
        const startDate = new Date(2024, i % 12, (i % 28) + 1);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + (i % 5));
        requests.push({
            id: `lr-${i + 1}`,
            employeeId: emp.id,
            leaveType: leaveTypes[i % leaveTypes.length],
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
            reason: `Requesting time off for ${leaveTypes[i % leaveTypes.length].toLowerCase()}.`,
            status: statuses[i % statuses.length],
            approverId: emp.managerId,
            requestedDate: new Date(startDate.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
        });
    }
    return requests;
};

export const generateMockPerformanceReviews = (employees: EnhancedEmployee[]): PerformanceReview[] => employees
    .filter(emp => emp.managerId)
    .map(emp => ({
        id: `pr-${emp.id}`,
        employeeId: emp.id,
        reviewerId: emp.managerId!,
        reviewDate: new Date(2023, 11, 15).toISOString().split('T')[0],
        periodStartDate: '2023-01-01',
        periodEndDate: '2023-12-31',
        overallRating: (emp.id.charCodeAt(0) % 5 + 1) as PerformanceRating,
        strengths: "Excellent communication and technical skills. A real team player who consistently delivers high-quality work.",
        areasForImprovement: "Could take more initiative on leading new projects and mentor junior team members more proactively.",
        employeeComments: "I agree with the feedback and look forward to taking on more leadership opportunities this year.",
        goals: [
            { id: 'g1', description: 'Launch new feature X', status: 'Completed', dueDate: '2023-06-30', weight: 0.5 },
            { id: 'g2', description: 'Improve API latency by 15%', status: 'On Track', dueDate: '2023-12-31', weight: 0.3 },
            { id: 'g3', description: 'Complete advanced TypeScript course', status: 'Completed', dueDate: '2023-09-30', weight: 0.2 },
        ],
        feedback360: [
            { fromId: employees.find(e => e.department === emp.department && e.id !== emp.id)?.id || 'peer1', feedback: "Always helpful and collaborative.", isAnonymous: true },
        ]
    }));


export const generateMockJobOpenings = (employees: EnhancedEmployee[]): JobOpening[] => [
    {
        id: 'job-1', title: 'Senior Backend Engineer', department: 'Engineering', location: 'Remote', isRemote: true,
        description: 'Join our dynamic engineering team to build the future of finance.',
        responsibilities: ['Design and implement scalable APIs', 'Mentor junior engineers', 'Optimize database performance'],
        qualifications: ['5+ years of experience with Node.js', 'Expertise in microservices architecture', 'Proficient with PostgreSQL'],
        status: 'Open', postedDate: '2024-05-10', hiringManagerId: employees.find(e => e.role === 'Engineering Manager')?.id || '',
        salaryRange: { min: 150000, max: 180000, currency: 'USD' }
    },
    {
        id: 'job-2', title: 'Product Marketing Manager', department: 'Marketing', location: 'New York, NY', isRemote: false,
        description: 'Lead the go-to-market strategy for our innovative fintech products.',
        responsibilities: ['Develop product positioning', 'Create marketing campaigns', 'Analyze market trends'],
        qualifications: ['Experience in B2B SaaS marketing', 'Strong writing skills', 'Data-driven mindset'],
        status: 'Open', postedDate: '2024-05-15', hiringManagerId: employees.find(e => e.role === 'Marketing Manager')?.id || '',
        salaryRange: { min: 120000, max: 140000, currency: 'USD' }
    },
    {
        id: 'job-3', title: 'UX/UI Designer', department: 'Design', location: 'San Francisco, CA', isRemote: false,
        description: 'Craft intuitive and beautiful user experiences for our customers.',
        responsibilities: ['Create wireframes and prototypes', 'Conduct user research', 'Maintain our design system'],
        qualifications: ['Portfolio of previous work', 'Proficiency in Figma', 'Understanding of user-centered design'],
        status: 'Closed', postedDate: '2024-04-01', hiringManagerId: employees.find(e => e.role === 'Design Manager')?.id || '',
        salaryRange: { min: 110000, max: 135000, currency: 'USD' }
    }
];

export const generateMockApplicants = (openings: JobOpening[]): Applicant[] => {
    const applicants: Applicant[] = [];
    const statuses: ApplicantStatus[] = ['Applied', 'Screening', 'Interviewing', 'Offer Extended', 'Hired', 'Rejected'];
    let idCounter = 1;
    for (const job of openings) {
        if (job.status === 'Closed') continue;
        for (let i = 0; i < 15; i++) {
            const status = statuses[(idCounter + i) % statuses.length];
            applicants.push({
                id: `app-${idCounter}`, jobOpeningId: job.id, name: `Applicant ${idCounter}`,
                email: `applicant${idCounter}@example.com`, phone: `555-03${idCounter.toString().padStart(2, '0')}`,
                resumeUrl: '#', status: status,
                applicationDate: new Date(2024, 4, 15 + (i % 15)).toISOString().split('T')[0],
                aiScreeningScore: Math.floor(Math.random() * (98 - 65 + 1) + 65),
                interviewNotes: status === 'Interviewing' || status === 'Offer Extended' ? [{
                    interviewerId: job.hiringManagerId,
                    date: new Date().toISOString(),
                    notes: 'Strong candidate with relevant experience. Excellent problem-solving skills demonstrated.',
                    rating: 4,
                }] : []
            });
            idCounter++;
        }
    }
    return applicants;
};

export const generateMockDocuments = (): CompanyDocument[] => [
    { id: 'doc-1', name: 'Employee Handbook 2024', category: 'Handbook', url: '#', lastUpdated: '2024-01-01', version: '3.0' },
    { id: 'doc-2', name: 'Work From Home Policy', category: 'Policy', url: '#', lastUpdated: '2023-11-15', version: '1.2' },
    { id: 'doc-3', name: 'Expense Reimbursement Form', category: 'Form', url: '#', lastUpdated: '2023-09-01', version: '1.0' },
    { id: 'doc-4', name: 'Cybersecurity Training', category: 'Training', url: '#', lastUpdated: '2024-03-10', version: '2.1' },
    { id: 'doc-5', name: 'Mutual Non-Disclosure Agreement', category: 'Legal', url: '#', lastUpdated: '2022-08-20', version: '1.0' },
];

export const generateMockOnboardingPlans = (employees: EnhancedEmployee[]): OnboardingPlan[] => employees
    .filter(e => new Date(e.hireDate) > new Date('2024-01-01'))
    .map(emp => ({
        id: `onboard-${emp.id}`,
        employeeId: emp.id,
        startDate: emp.hireDate,
        tasks: [
            { id: 't1', title: 'Complete HR Paperwork', description: 'Fill out W4, I9, and direct deposit forms.', status: 'Completed', dueDate: new Date(new Date(emp.hireDate).getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(), assigneeId: emp.id, ownerId: 'hr-1' },
            { id: 't2', title: 'Set up development environment', description: 'Install required software and get access to repositories.', status: 'In Progress', dueDate: new Date(new Date(emp.hireDate).getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(), assigneeId: emp.id, ownerId: emp.managerId! },
            { id: 't3', title: 'Meet the team', description: 'Schedule 1:1s with all team members.', status: 'Pending', dueDate: new Date(new Date(emp.hireDate).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(), assigneeId: emp.id, ownerId: emp.managerId! },
        ]
    }));

export const generateMockBenefits = (): BenefitPlan[] => [
    { id: 'health-p1', name: 'PPO Gold Plan', type: 'Health', provider: 'United Health', description: 'Comprehensive health coverage with low deductibles.', monthlyCost: 450 },
    { id: 'dental-p1', name: 'Dental Premier', type: 'Dental', provider: 'Delta Dental', description: 'Includes two cleanings per year and orthodontic coverage.', monthlyCost: 40 },
    { id: 'retire-p1', name: '401(k) Retirement Plan', type: 'Retirement', provider: 'Fidelity', description: 'Company matches 100% up to 5% of salary.', monthlyCost: 0 },
];

export const generateMockAIAttritionPredictions = (employees: EnhancedEmployee[]): AIAttritionPrediction[] => employees.map(emp => {
    const riskScore = (emp.name.charCodeAt(0) * emp.department.length) % 100;
    let riskLevel: 'Low' | 'Medium' | 'High' | 'Critical' = 'Low';
    if (riskScore > 85) riskLevel = 'Critical';
    else if (riskScore > 70) riskLevel = 'High';
    else if (riskScore > 40) riskLevel = 'Medium';
    return {
        employeeId: emp.id,
        riskScore,
        riskLevel,
        keyFactors: ['Low compensation ratio', 'Lack of recent promotion', 'Manager turnover'],
        lastEvaluated: new Date().toISOString(),
    };
});

// --- UTILITY & HELPER FUNCTIONS ---

export const formatDate = (dateString: string): string => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
export const getInitials = (name: string): string => {
    const parts = name.split(' ');
    return parts.length > 1 ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase() : name.substring(0, 2).toUpperCase();
};
export const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 });
export const useClickOutside = (ref: React.RefObject<HTMLElement>, handler: (event: MouseEvent | TouchEvent) => void) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) return;
      handler(event);
    };
    document.addEventListener('mousedown', listener); document.addEventListener('touchstart', listener);
    return () => { document.removeEventListener('mousedown', listener); document.removeEventListener('touchstart', listener); };
  }, [ref, handler]);
};

// --- ICONS (SVG Components) ---
export const UserIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>);
export const BriefcaseIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>);
export const CalendarIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>);
export const ChartBarIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>);
export const CogIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>);
export const DocumentTextIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>);
export const UsersIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m9 5.197a6 6 0 00-3.75-5.47M9 13.129c.858-.428 1.711-.755 2.584-.962m.834 5.234a6 6 0 01-3.418 0m6.836 0a6 6 0 00-3.418 0" /></svg>);
export const SparklesIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m1-12a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1h-6a1 1 0 01-1-1V6zM15 17a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2z" /></svg>);
export const XIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>);


// --- REUSABLE UI COMPONENTS ---

export interface ModalProps { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; size?: 'sm' | 'md' | 'lg' | 'xl'; }
export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    useClickOutside(modalRef, onClose);
    if (!isOpen) return null;
    const sizeClasses = { sm: 'max-w-sm', md: 'max-w-2xl', lg: 'max-w-4xl', xl: 'max-w-6xl' };
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm transition-opacity duration-300 ease-in-out" onClick={onClose}>
            <div ref={modalRef} className={`bg-gray-800 rounded-lg shadow-2xl w-full border border-gray-700 mx-4 ${sizeClasses[size]}`} onClick={e => e.stopPropagation()}>
                <div className="p-4 flex justify-between items-center border-b border-gray-700">
                    <h3 className="text-lg font-semibold text-white">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><XIcon className="w-6 h-6" /></button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
};

export const Avatar: React.FC<{ employee: EnhancedEmployee; size?: 'sm' | 'md' | 'lg' }> = ({ employee, size = 'md' }) => {
    const sizeMap = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-16 h-16 text-base' };
    return (
        <div className={`relative inline-block`}>
             {employee.avatarUrl ? (<img src={employee.avatarUrl} alt={employee.name} className={`${sizeMap[size]} rounded-full object-cover`} />)
             : (<div className={`${sizeMap[size]} rounded-full bg-cyan-800 flex items-center justify-center text-white font-bold`}>{getInitials(employee.name)}</div>)}
        </div>
    );
};

export const StatusPill: React.FC<{ status: string }> = ({ status }) => {
    const statusClasses: { [key: string]: string } = {
        'Open': 'bg-green-500/20 text-green-300', 'Closed': 'bg-red-500/20 text-red-300', 'Draft': 'bg-yellow-500/20 text-yellow-300',
        'Pending': 'bg-yellow-500/20 text-yellow-300', 'Approved': 'bg-green-500/20 text-green-300', 'Rejected': 'bg-red-500/20 text-red-300',
        'Applied': 'bg-blue-500/20 text-blue-300', 'Screening': 'bg-indigo-500/20 text-indigo-300', 'Interviewing': 'bg-purple-500/20 text-purple-300',
        'Offer Extended': 'bg-teal-500/20 text-teal-300', 'Hired': 'bg-green-500/20 text-green-300', 'Full-Time': 'bg-cyan-500/20 text-cyan-300',
        'Part-Time': 'bg-orange-500/20 text-orange-300', 'Contract': 'bg-gray-500/20 text-gray-300',
    };
    return (<span className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusClasses[status] || 'bg-gray-700 text-gray-200'}`}>{status}</span>);
};

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & {variant?: 'primary' | 'secondary' | 'danger' | 'ghost'}> = ({children, className, variant='primary', ...props}) => {
    const baseClasses = 'px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2';
    const variantClasses = {
        primary: 'bg-cyan-600 hover:bg-cyan-700 text-white',
        secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
        danger: 'bg-red-600 hover:bg-red-700 text-white',
        ghost: 'bg-transparent hover:bg-gray-700 text-gray-300',
    };
    return <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>{children}</button>
}

// --- FEATURE COMPONENTS / VIEWS ---

type NavItem = 'Dashboard' | 'Employees' | 'Recruitment' | 'Time Off' | 'Performance' | 'Reports' | 'Documents' | 'AI Analytics' | 'Settings';

export const HRIS_NAV_ITEMS: { id: NavItem, label: string, icon: React.ElementType }[] = [
    { id: 'Dashboard', label: 'Dashboard', icon: ChartBarIcon }, { id: 'Employees', label: 'Employees', icon: UsersIcon },
    { id: 'Recruitment', label: 'Recruitment', icon: BriefcaseIcon }, { id: 'Time Off', label: 'Time Off', icon: CalendarIcon },
    { id: 'Performance', label: 'Performance', icon: UserIcon }, { id: 'Reports', label: 'Reports', icon: ChartBarIcon },
    { id: 'Documents', label: 'Documents', icon: DocumentTextIcon }, { id: 'AI Analytics', label: 'AI Analytics', icon: SparklesIcon },
    { id: 'Settings', label: 'Settings', icon: CogIcon }
];

export const DashboardView: React.FC<{
    employees: EnhancedEmployee[], leaveRequests: LeaveRequest[], openings: JobOpening[], onNavigate: (view: NavItem) => void;
}> = ({ employees, leaveRequests, openings, onNavigate }) => {
    const pendingLeave = leaveRequests.filter(lr => lr.status === 'Pending').length;
    const openPositions = openings.filter(jo => jo.status === 'Open').length;
    const newHiresThisMonth = employees.filter(e => new Date(e.hireDate).getMonth() === new Date().getMonth() && new Date(e.hireDate).getFullYear() === new Date().getFullYear()).length;

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card title="Total Employees" value={employees.length.toString()} />
                <Card title="Open Positions" value={openPositions.toString()} />
                <Card title="Pending Time Off" value={pendingLeave.toString()} />
                <Card title="New Hires This Month" value={newHiresThisMonth.toString()} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <Card title="Pending Approvals">
                    <ul className="space-y-3">
                        {leaveRequests.filter(lr => lr.status === 'Pending').slice(0, 5).map(lr => (
                            <li key={lr.id} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-800/50">
                                <div>
                                    <p className="text-white font-medium">{employees.find(e => e.id === lr.employeeId)?.name}</p>
                                    <p className="text-xs text-gray-400">{lr.leaveType} | {formatDate(lr.startDate)} - {formatDate(lr.endDate)}</p>
                                </div>
                                <Button size="sm" variant="secondary" onClick={() => onNavigate('Time Off')}>View</Button>
                            </li>
                        ))}
                        {pendingLeave === 0 && <p className="text-gray-400 text-sm">No pending approvals.</p>}
                    </ul>
                </Card>
                 <Card title="Open Job Positions">
                    <ul className="space-y-3">
                        {openings.filter(jo => jo.status === 'Open').slice(0, 5).map(job => (
                             <li key={job.id} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-800/50">
                                <div>
                                    <p className="text-white font-medium">{job.title}</p>
                                    <p className="text-xs text-gray-400">{job.department} | {job.location}</p>
                                </div>
                                <Button size="sm" variant="secondary" onClick={() => onNavigate('Recruitment')}>View</Button>
                            </li>
                        ))}
                    </ul>
                </Card>
            </div>
        </div>
    );
};

export const EmployeeDirectoryView: React.FC<{
    employees: EnhancedEmployee[], onSelectEmployee: (employee: EnhancedEmployee) => void;
}> = ({ employees, onSelectEmployee }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('All');
    const filteredEmployees = useMemo(() => employees.filter(emp => 
        (emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || emp.role.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (departmentFilter === 'All' || emp.department === departmentFilter)
    ), [employees, searchTerm, departmentFilter]);
    const departments = useMemo(() => ['All', ...Array.from(new Set(employees.map(e => e.department)))], [employees]);

    return (
        <Card title="Employee Directory">
            <div className="p-4 bg-gray-900/30 rounded-t-lg flex items-center justify-between space-x-4">
                <input type="text" placeholder="Search by name or role..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-gray-700/50 p-2 rounded text-white w-full md:w-1/3" />
                <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)} className="bg-gray-700/50 p-2 rounded text-white">{departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}</select>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-900/30">
                        <tr><th className="px-6 py-3">Name</th><th className="px-6 py-3">Department</th><th className="px-6 py-3">Role</th><th className="px-6 py-3">Email</th><th className="px-6 py-3">Status</th><th className="px-6 py-3"></th></tr>
                    </thead>
                    <tbody>
                        {filteredEmployees.map(emp => (
                            <tr key={emp.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                <td className="px-6 py-4 font-medium text-white flex items-center space-x-3"><Avatar employee={emp} /><span>{emp.name}</span></td>
                                <td className="px-6 py-4">{emp.department}</td><td className="px-6 py-4">{emp.role}</td><td className="px-6 py-4">{emp.email}</td>
                                <td className="px-6 py-4"><StatusPill status={emp.employmentStatus} /></td>
                                <td className="px-6 py-4"><Button variant="secondary" onClick={() => onSelectEmployee(emp)}>Profile</Button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export const EmployeeProfileView: React.FC<{
    employee: EnhancedEmployee; allEmployees: EnhancedEmployee[]; onBack: () => void;
}> = ({ employee, allEmployees, onBack }) => {
    const manager = allEmployees.find(e => e.id === employee.managerId);
    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <Button onClick={onBack} variant="secondary">&larr; Back to Directory</Button>
                <h2 className="text-3xl font-bold text-white tracking-wider">{employee.name}'s Profile</h2>
            </div>
            <Card>
                <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6 p-6">
                    <Avatar employee={employee} size="lg" />
                    <div>
                        <h3 className="text-2xl font-bold text-white">{employee.name} <span className="text-base font-normal text-gray-400">{employee.pronouns}</span></h3>
                        <p className="text-gray-300">{employee.role} &bull; {employee.department}</p>
                        <p className="text-sm text-gray-400 mt-2">{employee.email} | {employee.phone}</p>
                        {manager && <p className="text-sm text-gray-400">Reports to: <span className="text-cyan-400">{manager.name}</span></p>}
                    </div>
                </div>
                 {/* TODO: Add tabs here for Job Info, Personal, Performance, etc. */}
            </Card>
        </div>
    );
};

export const RecruitmentView: React.FC<{
    jobOpenings: JobOpening[], applicants: Applicant[], employees: EnhancedEmployee[], aiWriter: React.ReactNode
}> = ({ jobOpenings, applicants, employees, aiWriter }) => {
    const [selectedJob, setSelectedJob] = useState<JobOpening | null>(jobOpenings.find(j=>j.status==='Open') || null);
    const applicantsForSelectedJob = useMemo(() => selectedJob ? applicants.filter(a => a.jobOpeningId === selectedJob.id) : [], [applicants, selectedJob]);
    const applicantStages: ApplicantStatus[] = ['Applied', 'Screening', 'Interviewing', 'Offer Extended', 'Hired', 'Rejected'];

    return (
        <div className="space-y-6">
             <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-white tracking-wider">Recruitment</h2>{aiWriter}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <Card title="Job Openings">
                        <ul className="space-y-2 max-h-[70vh] overflow-y-auto">
                           {jobOpenings.map(job => (
                               <li key={job.id} onClick={() => setSelectedJob(job)} className={`p-3 rounded-md cursor-pointer ${selectedJob?.id === job.id ? 'bg-cyan-900/50' : 'hover:bg-gray-800/50'}`}>
                                   <div className="flex justify-between"><p className="font-semibold text-white">{job.title}</p><StatusPill status={job.status} /></div>
                                   <p className="text-sm text-gray-400">{job.department} | {job.location}</p>
                               </li>
                           ))}
                        </ul>
                    </Card>
                </div>
                <div className="lg:col-span-2">
                   <Card title={selectedJob ? `Applicants for ${selectedJob.title}` : 'Select a Job to View Applicants'}>
                       {selectedJob ? (
                           <div className="flex space-x-4 overflow-x-auto p-2 bg-gray-900 rounded-lg">
                               {applicantStages.map(stage => (
                                   <div key={stage} className="w-64 flex-shrink-0 bg-gray-800/50 rounded-lg p-3">
                                       <h4 className="font-semibold text-gray-300 mb-3 text-sm flex items-center justify-between">{stage}<span className="text-xs bg-gray-700 rounded-full px-2 py-0.5">{applicantsForSelectedJob.filter(a => a.status === stage).length}</span></h4>
                                       <div className="space-y-3 h-[60vh] overflow-y-auto">
                                           {applicantsForSelectedJob.filter(a => a.status === stage).map(applicant => (
                                               <div key={applicant.id} className="bg-gray-800 p-3 rounded-md shadow-lg">
                                                   <p className="font-semibold text-white text-sm">{applicant.name}</p>
                                                   <p className="text-xs text-gray-400">{formatDate(applicant.applicationDate)}</p>
                                                   {applicant.aiScreeningScore && <p className="text-xs text-cyan-400 mt-1">AI Match: {applicant.aiScreeningScore}%</p>}
                                               </div>
                                           ))}
                                       </div>
                                   </div>
                               ))}
                           </div>
                       ) : <div className="h-96 flex items-center justify-center"><p className="text-gray-400">No job selected.</p></div>}
                   </Card>
                </div>
            </div>
        </div>
    );
};

export const TimeOffView: React.FC<{ leaveRequests: LeaveRequest[], employees: EnhancedEmployee[] }> = ({ leaveRequests, employees }) => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center"><h2 className="text-3xl font-bold text-white tracking-wider">Time Off Management</h2><Button>Request Time Off</Button></div>
            <Card title="All Leave Requests">
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs text-gray-300 uppercase bg-gray-900/30">
                            <tr><th className="px-6 py-3">Employee</th><th className="px-6 py-3">Leave Type</th><th className="px-6 py-3">Dates</th><th className="px-6 py-3">Status</th><th className="px-6 py-3">Actions</th></tr>
                        </thead>
                        <tbody>
                            {leaveRequests.map(lr => (
                                <tr key={lr.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                    <td className="px-6 py-4 font-medium text-white">{employees.find(e => e.id === lr.employeeId)?.name}</td>
                                    <td className="px-6 py-4">{lr.leaveType}</td><td className="px-6 py-4">{formatDate(lr.startDate)} - {formatDate(lr.endDate)}</td>
                                    <td className="px-6 py-4"><StatusPill status={lr.status} /></td>
                                    <td className="px-6 py-4 space-x-2">{lr.status === 'Pending' && (<><Button variant="primary">Approve</Button><Button variant="danger">Reject</Button></>)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export const DocumentsView: React.FC<{ documents: CompanyDocument[] }> = ({ documents }) => (
    <div className="space-y-6">
        <div className="flex justify-between items-center"><h2 className="text-3xl font-bold text-white tracking-wider">Company Documents</h2><Button>Upload Document</Button></div>
        <Card title="Document Library">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-900/30">
                        <tr><th className="px-6 py-3">Document Name</th><th className="px-6 py-3">Category</th><th className="px-6 py-3">Last Updated</th><th className="px-6 py-3">Version</th><th className="px-6 py-3"></th></tr>
                    </thead>
                    <tbody>
                        {documents.map(doc => (
                            <tr key={doc.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                <td className="px-6 py-4 font-medium text-white">{doc.name}</td>
                                <td className="px-6 py-4">{doc.category}</td><td className="px-6 py-4">{formatDate(doc.lastUpdated)}</td>
                                <td className="px-6 py-4">{doc.version}</td>
                                <td className="px-6 py-4"><a href={doc.url} download className="font-medium text-cyan-500 hover:underline">Download</a></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    </div>
);

// --- MAIN APPLICATION COMPONENT ---

const DemoBankHRISView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("HRISView must be within a DataProvider");
    const { employees: baseEmployees } = context;

    const [activeView, setActiveView] = useState<NavItem>('Dashboard');
    const [selectedEmployee, setSelectedEmployee] = useState<EnhancedEmployee | null>(null);
    const [isWriterOpen, setWriterOpen] = useState(false);
    const [jobTitle, setJobTitle] = useState("Senior Frontend Engineer");
    const [generatedJD, setGeneratedJD] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const enhancedEmployees = useMemo(() => generateMockEnhancedEmployees(baseEmployees), [baseEmployees]);
    const leaveRequests = useMemo(() => generateMockLeaveRequests(enhancedEmployees), [enhancedEmployees]);
    const performanceReviews = useMemo(() => generateMockPerformanceReviews(enhancedEmployees), [enhancedEmployees]);
    const jobOpenings = useMemo(() => generateMockJobOpenings(enhancedEmployees), [enhancedEmployees]);
    const applicants = useMemo(() => generateMockApplicants(jobOpenings), [jobOpenings]);
    const documents = useMemo(() => generateMockDocuments(), []);
    const onboardingPlans = useMemo(() => generateMockOnboardingPlans(enhancedEmployees), [enhancedEmployees]);
    const aiPredictions = useMemo(() => generateMockAIAttritionPredictions(enhancedEmployees), [enhancedEmployees]);

    const handleGenerate = async () => {
        setIsLoading(true); setGeneratedJD('');
        try {
            const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
            if (!apiKey) {
                setGeneratedJD("Error: API key is not configured. Please set REACT_APP_GEMINI_API_KEY.");
                return;
            }
            const ai = new GoogleGenAI({ apiKey });
            const prompt = `Write a professional and engaging job description for a "${jobTitle}" position at a fast-growing fintech company called Demo Bank. Include sections for Responsibilities, Qualifications, and Benefits. Format it with markdown for clarity.`;
            const response = await ai.models.generateContent({ model: 'gemini-pro', contents: prompt });
            setGeneratedJD(response.text);
        } catch (error) {
            console.error("AI Generation Error:", error);
            setGeneratedJD("Error: Could not generate job description. Please check your API key and network connection.");
        } finally { setIsLoading(false); }
    };
    
    const handleSelectEmployee = (employee: EnhancedEmployee) => { setSelectedEmployee(employee); setActiveView('Employees'); };
    const handleBackToDirectory = () => setSelectedEmployee(null);

    const renderActiveView = () => {
        if (activeView === 'Employees' && selectedEmployee) {
            return <EmployeeProfileView employee={selectedEmployee} allEmployees={enhancedEmployees} onBack={handleBackToDirectory} />;
        }

        switch (activeView) {
            case 'Dashboard': return <DashboardView employees={enhancedEmployees} leaveRequests={leaveRequests} openings={jobOpenings} onNavigate={setActiveView} />;
            case 'Employees': return <EmployeeDirectoryView employees={enhancedEmployees} onSelectEmployee={handleSelectEmployee} />;
            case 'Recruitment':
                const aiWriterButton = <Button onClick={() => setWriterOpen(true)}><SparklesIcon className="w-4 h-4" /> AI Job Description Writer</Button>;
                return <RecruitmentView jobOpenings={jobOpenings} applicants={applicants} employees={enhancedEmployees} aiWriter={aiWriterButton} />;
            case 'Time Off': return <TimeOffView leaveRequests={leaveRequests} employees={enhancedEmployees} />;
            case 'Documents': return <DocumentsView documents={documents} />;
            case 'Performance': case 'Reports': case 'AI Analytics': case 'Settings':
            default: return (<Card title={activeView}><div className="h-96 flex items-center justify-center"><p className="text-gray-400">{activeView} module coming soon.</p></div></Card>);
        }
    };
    
    return (
        <div className="flex h-full min-h-screen bg-gray-900 text-white font-sans">
            <nav className="w-64 bg-gray-800/50 border-r border-gray-700 p-4 flex-shrink-0 hidden md:block">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white tracking-wider">Demo Bank HRIS</h1>
                    <p className="text-xs text-gray-400">Human Resources Platform</p>
                </div>
                <ul className="space-y-2">
                    {HRIS_NAV_ITEMS.map(item => (
                        <li key={item.id}>
                            <a href="#" onClick={(e) => { e.preventDefault(); setActiveView(item.id); setSelectedEmployee(null); }}
                                className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${activeView === item.id ? 'bg-cyan-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
                                <item.icon className="w-5 h-5" />
                                <span className="font-medium text-sm">{item.label}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>

            <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
                {renderActiveView()}
            </main>

            <Modal isOpen={isWriterOpen} onClose={() => setWriterOpen(false)} title="AI Job Description Writer">
                 <div className="space-y-4">
                    <input type="text" value={jobTitle} onChange={e => setJobTitle(e.target.value)} placeholder="Enter a job title..." className="w-full bg-gray-700/50 p-2 rounded text-white border border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
                    <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
                        {isLoading ? 'Generating...' : <><SparklesIcon className="w-4 h-4" /> Draft Description</>}
                    </Button>
                    <Card title="Generated Description">
                        <div className="min-h-[15rem] max-h-80 overflow-y-auto text-sm text-gray-300 whitespace-pre-line prose prose-invert max-w-none p-4 bg-gray-900/50 rounded-lg">
                            {isLoading ? (<div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div></div>) : generatedJD}
                        </div>
                    </Card>
                </div>
            </Modal>
        </div>
    );
};

export default DemoBankHRISView;