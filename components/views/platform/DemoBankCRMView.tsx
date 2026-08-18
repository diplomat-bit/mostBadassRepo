// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/platform/DemoBankCRMView.tsx
================================================================================

import React, { useState, useEffect, useMemo, useCallback, FC, ReactNode, memo } from 'react';
import Card from '../../Card';
import { FunnelChart, Funnel, Tooltip, ResponsiveContainer, LabelList, BarChart, Bar, XAxis, YAxis, Legend, LineChart, Line, CartesianGrid, AreaChart, Area, PieChart, Pie, Cell, Sector } from 'recharts';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 1. ENHANCED TYPE DEFINITIONS FOR A REAL-WORLD CRM
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

export type CustomerStatus = 'Active' | 'Prospect' | 'Churn Risk' | 'Lost';
export type TaskStatus = 'Not Started' | 'In Progress' | 'Completed' | 'Blocked';
export type InteractionType = 'Call' | 'Email' | 'Meeting' | 'Note' | 'Demo';
export type LeadSource = 'Website' | 'Referral' | 'Cold Call' | 'Trade Show' | 'Advertisement' | 'Partner';
export type ProductType = 'Investment Account' | 'Business Loan' | 'Credit Line' | 'Wealth Management' | 'Treasury Services' | 'Forex';
export type TaskPriority = 'High' | 'Medium' | 'Low';
export type LeadStage = 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Negotiation';
export type AIInsightType = 'Opportunity' | 'Risk' | 'Efficiency' | 'Data Quality';

export interface Interaction {
  id: string;
  type: InteractionType;
  date: string;
  notes: string;
  salespersonId: number;
  outcome: string;
}

export interface ProductHolding {
  productType: ProductType;
  value: number;
  openDate: string;
  status: 'Active' | 'Closed';
}

export interface Customer {
  id: number;
  name: string;
  LTV: number;
  status: CustomerStatus;
  joinDate: string;
  primaryContact: {
    name: string;
    email: string;
    phone: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  industry: string;
  assignedSalespersonId: number;
  interactions: Interaction[];
  productHoldings: ProductHolding[];
  npsScore?: number; // Net Promoter Score
  engagementScore: number; // 0-100, AI calculated
  aiNextBestAction: string;
}

export interface Salesperson {
  id: number;
  name:string;
  email: string;
  region: 'North' | 'South' | 'East' | 'West';
  avatarUrl: string;
}

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo: number; // salespersonId
  relatedCustomerId?: number;
}

export interface DashboardMetrics {
  newLeads30d: number;
  conversionRate: number;
  customerSatisfaction: number;
  pipelineValue: number;
  monthlyRecurringRevenue: number;
  churnRate: number;
  avgResponseTimeHours: number;
  teamQuotaAttainment: number;
}

export interface Lead {
  id: string;
  companyName: string;
  contactPerson: string;
  contactEmail: string;
  estimatedValue: number;
  source: LeadSource;
  status: LeadStage;
  createdDate: string;
  leadScore: number; // 0-100 AI-generated score
  aiSummary: string;
}

export interface AIInsight {
  id: string;
  type: AIInsightType;
  title: string;
  description: string;
  severity: 'High' | 'Medium' | 'Low';
  relatedEntityId?: number | string; // Customer or Lead ID
  actionable: boolean;
}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 2. MOCK DATA GENERATION
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

const FIRST_NAMES = ['Aiden', 'Bella', 'Caleb', 'Daisy', 'Elijah', 'Fiona', 'Gavin', 'Hazel', 'Isaac', 'Jade'];
const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
const COMPANY_SUFFIXES = ['Corp', 'Inc.', 'Solutions', 'Group', 'LLC', 'Enterprises', 'Innovations', 'Partners'];
const COMPANY_PREFIXES = ['Global', 'Apex', 'Synergy', 'Quantum', 'Stellar', 'Dynamic', 'Future', 'Pinnacle', 'NextGen'];
const INDUSTRIES = ['Technology', 'Finance', 'Healthcare', 'Manufacturing', 'Retail', 'Real Estate', 'Consulting'];
const STREET_NAMES = ['Main St', 'Oak Ave', 'Pine Ln', 'Maple Dr', 'Cedar Blvd'];
const CITIES = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego'];
const STATES = ['NY', 'CA', 'IL', 'TX', 'AZ', 'PA'];
const INTERACTION_NOTES = [
    'Discussed Q3 financial planning and potential for new credit line. Follow-up required next week.',
    'Initial discovery call completed. Client interested in Wealth Management services. Proposal to be sent.',
    'Demo of the new Treasury Services platform was successful. Client is impressed with the features.',
    'Followed up on invoice #12345. Payment confirmed.',
    'Quarterly business review held. Client satisfaction is high, discussed expanding service usage.'
];
const AI_ACTIONS = [
    'Schedule a QBR to discuss expanding services.',
    'Offer a discount on Treasury Services to preempt churn.',
    'Introduce new Forex trading features.',
    'Send a personalized follow-up email regarding their recent positive feedback.',
    'Propose a consolidation of their business loans for a better rate.'
];

const getRandomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomDate = (start: Date, end: Date): Date => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
const getRandomNumber = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

export const salesTeam: Salesperson[] = [
    { id: 101, name: 'Alice Johnson', email: 'alice.j@demobank.com', region: 'North', avatarUrl: `https://i.pravatar.cc/150?u=101` },
    { id: 102, name: 'Bob Williams', email: 'bob.w@demobank.com', region: 'South', avatarUrl: `https://i.pravatar.cc/150?u=102` },
    { id: 103, name: 'Charlie Brown', email: 'charlie.b@demobank.com', region: 'East', avatarUrl: `https://i.pravatar.cc/150?u=103` },
    { id: 104, name: 'Diana Miller', email: 'diana.m@demobank.com', region: 'West', avatarUrl: `https://i.pravatar.cc/150?u=104` },
];

export const generateRandomInteractions = (count: number): Interaction[] => Array.from({ length: count }, (_, i) => ({
    id: `int_${Date.now()}_${i}`,
    type: getRandomElement<InteractionType>(['Call', 'Email', 'Meeting', 'Note', 'Demo']),
    date: getRandomDate(new Date(2022, 0, 1), new Date()).toISOString(),
    notes: getRandomElement(INTERACTION_NOTES),
    salespersonId: getRandomElement(salesTeam).id,
    outcome: getRandomElement(['Positive', 'Neutral', 'Negative', 'Pending']),
}));

export const generateRandomProductHoldings = (): ProductHolding[] => {
  const holdings: ProductHolding[] = [];
  const numHoldings = getRandomNumber(1, 3);
  const productTypes: ProductType[] = ['Investment Account', 'Business Loan', 'Credit Line', 'Wealth Management', 'Treasury Services', 'Forex'];
  const usedTypes: Set<ProductType> = new Set();
  
  for (let i = 0; i < numHoldings; i++) {
    let productType = getRandomElement(productTypes);
    while (usedTypes.has(productType)) {
      productType = getRandomElement(productTypes);
    }
    usedTypes.add(productType);
    
    holdings.push({
      productType,
      value: getRandomNumber(50000, 1000000),
      openDate: getRandomDate(new Date(2020, 0, 1), new Date()).toISOString(),
      status: 'Active',
    });
  }
  return holdings;
};

export const generateRandomCustomers = (count: number): Customer[] => Array.from({ length: count }, (_, i) => {
    const firstName = getRandomElement(FIRST_NAMES);
    const lastName = getRandomElement(LAST_NAMES);
    return {
      id: 2000 + i,
      name: `${getRandomElement(COMPANY_PREFIXES)} ${lastName} ${getRandomElement(COMPANY_SUFFIXES)}`,
      LTV: getRandomNumber(50000, 500000),
      status: getRandomElement<CustomerStatus>(['Active', 'Prospect', 'Churn Risk', 'Lost']),
      joinDate: getRandomDate(new Date(2020, 0, 1), new Date()).toISOString(),
      primaryContact: {
        name: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
        phone: `555-${getRandomNumber(100, 999)}-${getRandomNumber(1000, 9999)}`,
      },
      address: {
        street: `${getRandomNumber(100, 9999)} ${getRandomElement(STREET_NAMES)}`,
        city: getRandomElement(CITIES),
        state: getRandomElement(STATES),
        zip: `${getRandomNumber(10000, 99999)}`,
      },
      industry: getRandomElement(INDUSTRIES),
      assignedSalespersonId: getRandomElement(salesTeam).id,
      interactions: generateRandomInteractions(getRandomNumber(5, 15)),
      productHoldings: generateRandomProductHoldings(),
      npsScore: getRandomNumber(1, 10),
      engagementScore: getRandomNumber(30, 98),
      aiNextBestAction: getRandomElement(AI_ACTIONS),
    };
});

export const generateRandomTasks = (count: number, customers: Customer[]): Task[] => Array.from({ length: count }, (_, i) => ({
    id: `task_${Date.now()}_${i}`,
    title: getRandomElement(['Follow up on Q4 proposal', 'Schedule discovery call', 'Prepare annual review', 'Onboard new contact', 'Resolve support ticket']),
    dueDate: getRandomDate(new Date(), new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)).toISOString(),
    status: getRandomElement<TaskStatus>(['Not Started', 'In Progress', 'Completed']),
    priority: getRandomElement<TaskPriority>(['High', 'Medium', 'Low']),
    assignedTo: getRandomElement(salesTeam).id,
    relatedCustomerId: getRandomElement(customers).id,
}));

export const generateLeads = (count: number): Lead[] => Array.from({ length: count }, (_, i) => {
    const firstName = getRandomElement(FIRST_NAMES);
    const lastName = getRandomElement(LAST_NAMES);
    return {
        id: `lead_${Date.now()}_${i}`,
        companyName: `${getRandomElement(COMPANY_PREFIXES)} ${lastName} ${getRandomElement(COMPANY_SUFFIXES)}`,
        contactPerson: `${firstName} ${lastName}`,
        contactEmail: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@newbiz.com`,
        estimatedValue: getRandomNumber(10000, 100000),
        source: getRandomElement<LeadSource>(['Website', 'Referral', 'Cold Call', 'Trade Show', 'Advertisement', 'Partner']),
        status: getRandomElement<LeadStage>(['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation']),
        createdDate: getRandomDate(new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), new Date()).toISOString(),
        leadScore: getRandomNumber(40, 99),
        aiSummary: 'High-growth tech company with recent funding. Strong match for our wealth management and treasury services. Key decision-maker is the CFO.'
    };
});

export const generateAIInsights = (customers: Customer[], leads: Lead[]): AIInsight[] => ([
    { id: 'ai_1', type: 'Risk', title: 'High Churn Risk Detected', description: `${customers[2].name} shows decreased engagement and a low NPS score. Proactive outreach recommended.`, severity: 'High', relatedEntityId: customers[2].id, actionable: true },
    { id: 'ai_2', type: 'Opportunity', title: 'Upsell Opportunity', description: `${customers[0].name} has high LTV and engagement. Ideal candidate for our new Forex services.`, severity: 'High', relatedEntityId: customers[0].id, actionable: true },
    { id: 'ai_3', type: 'Efficiency', title: 'Automate Follow-ups', description: 'You have 5 leads in "Contacted" for over 7 days. Consider creating an automated email sequence.', severity: 'Medium', actionable: true },
    { id: 'ai_4', type: 'Data Quality', title: 'Missing Contact Info', description: 'Lead "${leads[5].companyName}" is missing a phone number, which may impact conversion.', severity: 'Low', relatedEntityId: leads[5].id, actionable: true }
]);

let mockCustomers: Customer[] = generateRandomCustomers(200);
let mockTasks: Task[] = generateRandomTasks(50, mockCustomers);
let mockLeads: Lead[] = generateLeads(75);
let mockAIInsights: AIInsight[] = generateAIInsights(mockCustomers, mockLeads);

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 3. MOCK API SERVICE
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

export const apiService = {
  fetchDashboardMetrics: async (): Promise<DashboardMetrics> => new Promise(resolve => setTimeout(() => resolve({
        newLeads30d: 125, conversionRate: 16, customerSatisfaction: 91, pipelineValue: 1500000,
        monthlyRecurringRevenue: 450000, churnRate: 2.3, avgResponseTimeHours: 8, teamQuotaAttainment: 85,
    }), 500)),
  fetchCustomers: async ({ page, limit, sort, filters }: { page: number, limit: number, sort: { key: keyof Customer, order: 'asc' | 'desc'}, filters: Record<string, string> }): Promise<{ customers: Customer[], total: number }> => {
    return new Promise(resolve => {
        let filteredCustomers = [...mockCustomers];
        if (filters.name) {
            filteredCustomers = filteredCustomers.filter(c => c.name.toLowerCase().includes(filters.name.toLowerCase()));
        }
        if (filters.status) {
            filteredCustomers = filteredCustomers.filter(c => c.status === filters.status);
        }
        if (filters.salespersonId) {
            filteredCustomers = filteredCustomers.filter(c => c.assignedSalespersonId === parseInt(filters.salespersonId));
        }
        if (filters.query) { // For AI Command Bar
            const query = filters.query.toLowerCase();
            filteredCustomers = filteredCustomers.filter(c => 
                c.name.toLowerCase().includes(query) ||
                c.industry.toLowerCase().includes(query) ||
                c.primaryContact.name.toLowerCase().includes(query)
            );
        }

        filteredCustomers.sort((a, b) => {
            const valA = a[sort.key];
            const valB = b[sort.key];
            if (valA < valB) return sort.order === 'asc' ? -1 : 1;
            if (valA > valB) return sort.order === 'asc' ? 1 : -1;
            return 0;
        });
        
        const start = (page - 1) * limit;
        const end = start + limit;
        setTimeout(() => resolve({ customers: filteredCustomers.slice(start, end), total: filteredCustomers.length }), 700);
    });
  },
  fetchTasks: async (): Promise<Task[]> => new Promise(resolve => setTimeout(() => resolve([...mockTasks].sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())), 600)),
  fetchLeads: async (): Promise<Lead[]> => new Promise(resolve => setTimeout(() => resolve([...mockLeads]), 400)),
  fetchAIInsights: async (): Promise<AIInsight[]> => new Promise(resolve => setTimeout(() => resolve([...mockAIInsights]), 900)),
  updateTaskStatus: async (taskId: string, status: TaskStatus): Promise<Task> => new Promise((resolve, reject) => {
        setTimeout(() => {
            const taskIndex = mockTasks.findIndex(t => t.id === taskId);
            if (taskIndex !== -1) {
                mockTasks[taskIndex].status = status;
                resolve(mockTasks[taskIndex]);
            } else {
                reject(new Error('Task not found'));
            }
        }, 300);
    }),
  updateLeadStatus: async (leadId: string, newStatus: LeadStage): Promise<Lead> => new Promise((resolve, reject) => {
    setTimeout(() => {
        const leadIndex = mockLeads.findIndex(l => l.id === leadId);
        if (leadIndex !== -1) {
            mockLeads[leadIndex].status = newStatus;
            resolve(mockLeads[leadIndex]);
        } else {
            reject(new Error('Lead not found'));
        }
    }, 400)
  }),
  createLead: async (leadData: Omit<Lead, 'id' | 'createdDate' | 'leadScore' | 'aiSummary'>): Promise<Lead> => new Promise(resolve => {
      setTimeout(() => {
          const newLead: Lead = {
              ...leadData,
              id: `lead_${Date.now()}`,
              createdDate: new Date().toISOString(),
              leadScore: getRandomNumber(40, 99),
              aiSummary: 'AI summary pending for this new lead.'
          };
          mockLeads.unshift(newLead);
          resolve(newLead);
      }, 800)
  })
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 4. UTILITY FUNCTIONS
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

export const formatCurrency = (amount: number, currency = 'USD'): string => new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
export const formatDate = (dateString: string): string => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
export const getStatusChipClass = (status: CustomerStatus): string => ({
    'Active': 'bg-green-500/20 text-green-300', 'Prospect': 'bg-blue-500/20 text-blue-300',
    'Churn Risk': 'bg-yellow-500/20 text-yellow-300', 'Lost': 'bg-red-500/20 text-red-300',
}[status] || 'bg-gray-500/20 text-gray-300');
export const getPriorityClass = (priority: TaskPriority): string => ({
    'High': 'text-red-400', 'Medium': 'text-yellow-400', 'Low': 'text-gray-400',
}[priority] || 'text-gray-400');
export const getInsightChipClass = (type: AIInsightType): string => ({
    'Opportunity': 'bg-sky-500/20 text-sky-300', 'Risk': 'bg-red-500/20 text-red-300',
    'Efficiency': 'bg-purple-500/20 text-purple-300', 'Data Quality': 'bg-amber-500/20 text-amber-300',
}[type]);

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 5. SVG ICON COMPONENTS
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

export const IconSearch: FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>);
export const IconFilter: FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 12.414V19a1 1 0 01-.293.707l-4 4A1 1 0 019 23v-6.586l-5.707-5.707A1 1 0 013 10V4z" /></svg>);
export const IconChevronDown: FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>);
export const IconChevronUp: FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>);
export const IconClose: FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>);
export const IconBolt: FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>);
export const IconLightBulb: FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-11.25a6.01 6.01 0 00-1.5-11.25a6.01 6.01 0 00-1.5 11.25a6.01 6.01 0 001.5 11.25M12 18a2.25 2.25 0 01-2.25-2.25H9.75a2.25 2.25 0 012.25-2.25m0 0a2.25 2.25 0 002.25-2.25h.008a2.25 2.25 0 00-2.25-2.25M12 18V9.75" /></svg>);

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 6. UI COMPONENTS
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// 6.1. Generic Components
export const LoadingSpinner: FC = () => (<div className="flex justify-center items-center p-8"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div></div>);
export interface Notification { id: number; message: string; type: 'success' | 'error'; }
export const NotificationToast: FC<{ notification: Notification | null; onDismiss: (id: number) => void }> = ({ notification, onDismiss }) => {
  if (!notification) return null;
  const baseClasses = "fixed top-5 right-5 p-4 rounded-lg shadow-lg text-white z-50 transition-opacity duration-300";
  const typeClasses = notification.type === 'success' ? 'bg-green-600' : 'bg-red-600';
  return (<div className={`${baseClasses} ${typeClasses}`}><span>{notification.message}</span><button onClick={() => onDismiss(notification.id)} className="ml-4 font-bold">X</button></div>);
};
export const Pagination: FC<{ currentPage: number; totalItems: number; itemsPerPage: number; onPageChange: (page: number) => void; }> = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages <= 1) return null;
  return (<nav className="flex justify-center items-center space-x-2 mt-4">{/* ... pagination logic */}</nav>);
};
export const Modal: FC<{ isOpen: boolean; onClose: () => void; title: string; children: ReactNode }> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-40 flex justify-center items-center" onClick={onClose}>
            <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="flex justify-between items-center p-4 border-b border-gray-700"><h3 className="text-xl font-bold text-white">{title}</h3><button onClick={onClose} className="text-gray-400 hover:text-white"><IconClose className="h-6 w-6" /></button></header>
                <main className="p-6 overflow-y-auto">{children}</main>
            </div>
        </div>
    );
};

// 6.2. Feature-Specific Components
export type CustomerSortKey = keyof Customer;
export type SortOrder = 'asc' | 'desc';
export type CustomerFilters = { name: string; status: CustomerStatus | ''; salespersonId: string; query?: string; };

export const AICommandBar: FC<{ onCommand: (query: string) => void }> = ({ onCommand }) => {
    const [query, setQuery] = useState('');
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            onCommand(query);
        }
    }
    return (
        <div className="relative mb-6">
            <IconSearch className="absolute h-5 w-5 text-gray-400 top-3.5 left-4" />
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="AI Command: e.g., 'Show all active customers in Technology' or search by name..."
                className="w-full bg-gray-900 border border-gray-700 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
             <div className="absolute top-2.5 right-3.5 flex items-center space-x-2 text-xs text-gray-500">
                <IconBolt className="h-4 w-4 text-cyan-400" />
                <span>AI Powered</span>
            </div>
        </div>
    );
};

export const AdvancedFilters: FC<{ filters: CustomerFilters; onFilterChange: (filters: CustomerFilters) => void; onReset: () => void; }> = ({ filters, onFilterChange, onReset }) => {
    // ... filter component implementation as before ...
    return (<Card>{/* Filter inputs */}</Card>);
};

export const CustomerTable: FC<{ customers: Customer[]; onSort: (key: CustomerSortKey) => void; sortConfig: { key: CustomerSortKey; order: SortOrder }; onRowClick: (customer: Customer) => void; }> = ({ customers, onSort, sortConfig, onRowClick }) => {
  const SortableHeader: FC<{ columnKey: CustomerSortKey; children: ReactNode }> = ({ columnKey, children }) => {
    const isSorted = sortConfig.key === columnKey;
    return (
      <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => onSort(columnKey)}>
        <div className="flex items-center">{children}{isSorted ? (sortConfig.order === 'asc' ? <IconChevronUp className="h-4 w-4 ml-1" /> : <IconChevronDown className="h-4 w-4 ml-1" />) : null}</div>
      </th>
    );
  };
  return (
    <Card title="Customer Database">
      <div className="overflow-x-auto"><table className="w-full text-sm text-left text-gray-400"><thead className="text-xs text-gray-300 uppercase bg-gray-900/30"><tr>
        <SortableHeader columnKey="name">Customer Name</SortableHeader><SortableHeader columnKey="LTV">LTV</SortableHeader>
        <SortableHeader columnKey="status">Status</SortableHeader><SortableHeader columnKey="engagementScore">Engagement</SortableHeader>
        <th scope="col" className="px-6 py-3">Industry</th></tr></thead>
      <tbody>{customers.map(customer => (
        <tr key={customer.id} className="border-b border-gray-800 hover:bg-gray-800/50 cursor-pointer" onClick={() => onRowClick(customer)}>
          <td className="px-6 py-4 font-medium text-white">{customer.name}</td>
          <td className="px-6 py-4 font-mono">{formatCurrency(customer.LTV)}</td>
          <td className="px-6 py-4"><span className={`px-2 py-1 text-xs rounded-full ${getStatusChipClass(customer.status)}`}>{customer.status}</span></td>
          <td className="px-6 py-4"><div className="flex items-center"><div className="w-20 h-2 bg-gray-700 rounded-full"><div className="h-2 bg-cyan-500 rounded-full" style={{ width: `${customer.engagementScore}%` }}></div></div><span className="ml-2 text-xs">{customer.engagementScore}</span></div></td>
          <td className="px-6 py-4">{customer.industry}</td>
        </tr>))}</tbody></table></div></Card>
  );
};

export const CustomerDetailView: FC<{ customer: Customer | null }> = ({ customer }) => {
    const [activeTab, setActiveTab] = useState('summary');
    if (!customer) return null;
    const assignedSalesperson = salesTeam.find(s => s.id === customer.assignedSalespersonId);
    
    const renderTabContent = () => {
        switch (activeTab) {
            case 'ai_assistant': return <AISalesAssistant customer={customer} />;
            case 'interactions': return <InteractionHistory interactions={customer.interactions} />;
            case 'products': return <ProductHoldingsList holdings={customer.productHoldings} />;
            case 'summary':
            default: return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1 space-y-4">
                        <div><h4 className="font-bold text-white">Contact Info</h4><p>{customer.primaryContact.name}</p><p className="text-cyan-400">{customer.primaryContact.email}</p><p>{customer.primaryContact.phone}</p></div>
                        <div><h4 className="font-bold text-white">Address</h4><p>{customer.address.street}</p><p>{customer.address.city}, {customer.address.state} {customer.address.zip}</p></div>
                    </div>
                    <div className="md:col-span-1 space-y-4">
                        <div><h4 className="font-bold text-white">Assigned To</h4><div className="flex items-center space-x-2 mt-1"><img src={assignedSalesperson?.avatarUrl} alt={assignedSalesperson?.name} className="h-8 w-8 rounded-full" /><span>{assignedSalesperson?.name}</span></div></div>
                        <div><h4 className="font-bold text-white">NPS Score</h4><p className="text-2xl font-bold text-white">{customer.npsScore || 'N/A'}/10</p></div>
                        <div><h4 className="font-bold text-white">Engagement Score</h4><p className="text-2xl font-bold text-cyan-400">{customer.engagementScore}/100</p></div>
                    </div>
                    <div className="md:col-span-1">
                        <AISalesAssistant customer={customer} concise />
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="text-gray-300">
            <div className="flex border-b border-gray-700 mb-6">
                {['summary', 'products', 'interactions', 'ai_assistant'].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 capitalize font-semibold transition-colors ${activeTab === tab ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400 hover:text-white'}`}>{tab.replace('_', ' ')}</button>
                ))}
            </div>
            {renderTabContent()}
        </div>
    );
};

export const AISalesAssistant: FC<{customer: Customer, concise?: boolean}> = ({customer, concise}) => (
    <div className="p-4 bg-gray-800/50 rounded-lg border border-cyan-500/30">
        <h4 className="font-bold text-white text-lg flex items-center"><IconBolt className="h-5 w-5 mr-2 text-cyan-400" /> AI Sales Assistant</h4>
        {!concise && <p className="text-sm text-gray-400 mt-1 mb-4">Real-time suggestions to maximize customer value.</p>}
        <div className="space-y-4">
            <div><h5 className="font-semibold text-cyan-400 text-sm">Next Best Action</h5><p>{customer.aiNextBestAction}</p></div>
            {!concise && <>
                <div><h5 className="font-semibold text-cyan-400 text-sm">Draft Follow-up Email</h5><textarea className="input-style w-full mt-1 text-sm" rows={4} defaultValue={`Hi ${customer.primaryContact.name.split(' ')[0]},\n\nJust checking in to see if you had any questions about our last conversation...\n\nBest,\n${salesTeam.find(s=>s.id === customer.assignedSalespersonId)?.name.split(' ')[0]}`}></textarea></div>
                <div><h5 className="font-semibold text-cyan-400 text-sm">Interaction Summary</h5><p className="text-sm">Customer has shown high interest in treasury services. Recent interactions are positive. Engagement is trending upwards. Key focus should be on demonstrating ROI of new products.</p></div>
            </>}
        </div>
    </div>
);
const ProductHoldingsList: FC<{holdings: ProductHolding[]}> = ({holdings}) => (<div>{/* ... implementation */}</div>)
const InteractionHistory: FC<{interactions: Interaction[]}> = ({interactions}) => (<div>{/* ... implementation */}</div>)

export const ActivityFeed: FC<{ tasks: Task[]; onTaskStatusChange: (taskId: string, status: TaskStatus) => void; }> = ({ tasks, onTaskStatusChange }) => {
    return (<Card title="My Upcoming Tasks">{/* ... implementation */}</Card>);
};
export const LeadCaptureForm: FC<{ onLeadSubmit: (lead: Omit<Lead, 'id' | 'createdDate' | 'leadScore' | 'aiSummary'>) => Promise<void>, isSubmitting: boolean }> = ({ onLeadSubmit, isSubmitting }) => {
    return (<Card title="Add New Lead">{/* ... implementation */}</Card>);
};
export const TeamPerformanceChart: FC = () => (
    <Card title="Sales Team Performance (YTD)"><ResponsiveContainer width="100%" height={300}>{/* ... chart */}</ResponsiveContainer></Card>
);
export const RevenueGrowthChart: FC = () => (
    <Card title="Monthly Recurring Revenue (MRR)"><ResponsiveContainer width="100%" height={300}>{/* ... chart */}</ResponsiveContainer></Card>
);

export const LeadKanbanBoard: FC<{ leads: Lead[]; onLeadStatusChange: (leadId: string, newStatus: LeadStage) => void; }> = ({ leads, onLeadStatusChange }) => {
    const columns: Record<LeadStage, Lead[]> = {
        'New': [], 'Contacted': [], 'Qualified': [], 'Proposal': [], 'Negotiation': []
    };
    leads.forEach(lead => { if(columns[lead.status]) columns[lead.status].push(lead); });

    const onDragEnd = (result: DropResult) => {
        const { source, destination, draggableId } = result;
        if (!destination) return;
        if (source.droppableId !== destination.droppableId) {
            onLeadStatusChange(draggableId, destination.droppableId as LeadStage);
        }
    };
    
    return (
        <Card title="Lead Pipeline">
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="grid grid-cols-5 gap-4">
                    {Object.entries(columns).map(([stage, stageLeads]) => (
                        <Droppable key={stage} droppableId={stage}>
                            {(provided) => (
                                <div ref={provided.innerRef} {...provided.droppableProps} className="bg-gray-800/50 p-3 rounded-lg min-h-[400px]">
                                    <h4 className="font-bold text-center text-white mb-4">{stage}</h4>
                                    <div className="space-y-3">
                                        {stageLeads.map((lead, index) => (
                                            <Draggable key={lead.id} draggableId={lead.id} index={index}>
                                                {(provided) => (
                                                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="bg-gray-900 p-3 rounded-md shadow-lg border-l-4 border-cyan-500">
                                                        <div className="flex justify-between items-center"><p className="font-bold text-sm text-white">{lead.companyName}</p><div className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full">{lead.leadScore}</div></div>
                                                        <p className="text-xs text-gray-400 mt-1">{lead.contactPerson}</p>
                                                        <p className="text-sm font-mono mt-2 text-green-400">{formatCurrency(lead.estimatedValue)}</p>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>
        </Card>
    );
};

export const AIInsightsPanel: FC<{ insights: AIInsight[], onInsightClick: (insight: AIInsight) => void; }> = ({ insights, onInsightClick }) => {
    return (
        <Card title="AI-Powered Insights">
            <div className="space-y-3 max-h-96 overflow-y-auto">
                {insights.map(insight => (
                    <div key={insight.id} onClick={() => onInsightClick(insight)} className="p-3 bg-gray-800/50 rounded-md cursor-pointer hover:bg-gray-800/80 transition-colors">
                        <div className="flex justify-between items-start">
                            <span className={`px-2 py-0.5 text-xs rounded-full ${getInsightChipClass(insight.type)}`}>{insight.type}</span>
                            <span className={`text-xs font-bold ${insight.severity === 'High' ? 'text-red-400' : 'text-yellow-400'}`}>{insight.severity}</span>
                        </div>
                        <p className="font-semibold text-white mt-2">{insight.title}</p>
                        <p className="text-xs text-gray-400">{insight.description}</p>
                    </div>
                ))}
            </div>
        </Card>
    );
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 7. MAIN VIEW COMPONENT
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

const DemoBankCRMView: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [leads, setLeads] = useState<Lead[]>([]);
    const [insights, setInsights] = useState<AIInsight[]>([]);
    const [totalCustomers, setTotalCustomers] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState<{ key: CustomerSortKey; order: SortOrder }>({ key: 'LTV', order: 'desc' });
    const [filters, setFilters] = useState<CustomerFilters>({ name: '', status: '', salespersonId: '' });
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const ITEMS_PER_PAGE = 10;
    
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [metricsData, customerData, tasksData, leadsData, insightsData] = await Promise.all([
                    apiService.fetchDashboardMetrics(),
                    apiService.fetchCustomers({ page: currentPage, limit: ITEMS_PER_PAGE, sort: sortConfig, filters }),
                    apiService.fetchTasks(),
                    apiService.fetchLeads(),
                    apiService.fetchAIInsights(),
                ]);
                setMetrics(metricsData);
                setCustomers(customerData.customers);
                setTotalCustomers(customerData.total);
                setTasks(tasksData);
                setLeads(leadsData);
                setInsights(insightsData);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [currentPage, sortConfig, filters]);

    const addNotification = useCallback((message: string, type: 'success' | 'error') => {
        const newNotif = { id: Date.now(), message, type };
        setNotifications(prev => [...prev, newNotif]);
        setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== newNotif.id)), 5000);
    }, []);
    
    const handleSort = (key: CustomerSortKey) => setSortConfig(prev => ({ key, order: prev.key === key && prev.order === 'asc' ? 'desc' : 'asc' }));
    const handleFilterChange = useCallback((newFilters: CustomerFilters) => { setCurrentPage(1); setFilters(newFilters); }, []);
    const handleCommandSearch = useCallback((query: string) => { setCurrentPage(1); setFilters(f => ({...f, query})); }, []);
    const handleInsightClick = (insight: AIInsight) => {
        if (insight.relatedEntityId) {
            const customer = mockCustomers.find(c => c.id === insight.relatedEntityId);
            if (customer) setSelectedCustomer(customer);
        }
    };
    const handleLeadStatusChange = async (leadId: string, newStatus: LeadStage) => {
        const originalLeads = [...leads];
        setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
        try {
            await apiService.updateLeadStatus(leadId, newStatus);
        } catch (error) {
            setLeads(originalLeads);
            addNotification('Failed to update lead.', 'error');
        }
    };

    return (
        <div className="space-y-6">
            {notifications.map(n => <NotificationToast key={n.id} notification={n} onDismiss={() => setNotifications(prev => prev.filter(notif => notif.id !== n.id))} />)}
            <Modal isOpen={!!selectedCustomer} onClose={() => setSelectedCustomer(null)} title={selectedCustomer?.name || 'Customer Details'}>
                <CustomerDetailView customer={selectedCustomer} />
            </Modal>
            <h2 className="text-3xl font-bold text-white tracking-wider">Demo Bank CRM Dashboard</h2>
            <AICommandBar onCommand={handleCommandSearch} />
            
            {isLoading && !metrics ? <LoadingSpinner /> : metrics && (
                 <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
                    <Card className="text-center"><p className="text-3xl font-bold text-white">{metrics.newLeads30d}</p><p className="text-sm text-gray-400 mt-1">New Leads (30d)</p></Card>
                    <Card className="text-center"><p className="text-3xl font-bold text-white">{formatCurrency(metrics.pipelineValue)}</p><p className="text-sm text-gray-400 mt-1">Pipeline Value</p></Card>
                    <Card className="text-center"><p className="text-3xl font-bold text-white">{formatCurrency(metrics.monthlyRecurringRevenue)}</p><p className="text-sm text-gray-400 mt-1">MRR</p></Card>
                    <Card className="text-center"><p className="text-3xl font-bold text-white">{metrics.teamQuotaAttainment}%</p><p className="text-sm text-gray-400 mt-1">Team Quota Attainment</p></Card>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <RevenueGrowthChart />
                </div>
                <div className="lg:col-span-1 space-y-6">
                    <AIInsightsPanel insights={insights} onInsightClick={handleInsightClick} />
                </div>
            </div>

            <div className="space-y-6">
                 <LeadKanbanBoard leads={leads} onLeadStatusChange={handleLeadStatusChange} />
            </div>

            <div className="space-y-6">
                {isLoading && customers.length === 0 ? <LoadingSpinner /> : 
                <>
                    <CustomerTable 
                        customers={customers} 
                        onSort={handleSort} 
                        sortConfig={sortConfig} 
                        onRowClick={(customer) => setSelectedCustomer(customer)} 
                    />
                    <Pagination
                        currentPage={currentPage}
                        totalItems={totalCustomers}
                        itemsPerPage={ITEMS_PER_PAGE}
                        onPageChange={(p) => setCurrentPage(p)}
                    />
                </>
                }
            </div>
        </div>
    );
};

export default DemoBankCRMView;