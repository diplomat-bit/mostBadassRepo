// REPOSITORY SOURCE: diplomat-bit/almost | PATH: diplomat-bit-almost-93a5466/components/views/corporate/PaymentOrdersView.tsx
================================================================================

// components/views/corporate/PaymentOrdersView.tsx
import React, { useContext, useState, useMemo } from 'react';
import { DataContext } from '../../../context/DataContext';
import Card from '../../Card';
import { PaymentOrder, PaymentOrderStatus } from '../../../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const PaymentOrdersView: React.FC = () => {
    const context = useContext(DataContext);
    const [filter, setFilter] = useState<PaymentOrderStatus | 'all'>('all');
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);

    if (!context) throw new Error("PaymentOrdersView must be within a DataProvider.");
    // FIX: Destructure `updatePaymentOrderStatus` from context to fix property not found error.
    const { paymentOrders, updatePaymentOrderStatus } = context;

    const filteredOrders = useMemo(() => {
        if (filter === 'all') return paymentOrders;
        return paymentOrders.filter(po => po.status === filter);
    }, [paymentOrders, filter]);
    
    const chartData = useMemo(() => {
        const statusCounts = paymentOrders.reduce((acc, po) => {
            acc[po.status] = (acc[po.status] || 0) + po.amount;
            return acc;
        }, {} as Record<PaymentOrderStatus, number>);
        return Object.entries(statusCounts).map(([name, value]) => ({ name: name.replace('_', ' '), value }));
    }, [paymentOrders]);

    const StatusBadge: React.FC<{ status: PaymentOrderStatus }> = ({ status }) => {
        const colors = {
            needs_approval: 'bg-yellow-500/20 text-yellow-300',
            approved: 'bg-cyan-500/20 text-cyan-300',
            processing: 'bg-blue-500/20 text-blue-300',
            completed: 'bg-green-500/20 text-green-300',
            denied: 'bg-red-500/20 text-red-300',
            returned: 'bg-orange-500/20 text-orange-300',
        };
        return <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[status]}`}>{status.replace('_', ' ')}</span>;
    };

    const CreatePaymentOrderModal: React.FC = () => (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={() => setCreateModalOpen(false)}>
            <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full border border-gray-700" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-700">
                    <h3 className="text-lg font-semibold text-white">Create Payment Order</h3>
                </div>
                <div className="p-6 space-y-4">
                    {/* Simplified form for demonstration */}
                    <input type="text" placeholder="Counterparty Name" className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white" />
                    <input type="number" placeholder="Amount (USD)" className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white" />
                    <select className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white">
                        <option>ACH</option>
                        <option>Wire</option>
                        <option>RTP</option>
                    </select>
                    <button onClick={() => { alert('Payment order created!'); setCreateModalOpen(false); }} className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg">Submit for Approval</button>
                </div>
            </div>
        </div>
    );
    
    return (
        <>
            <div className="space-y-6">
                <h2 className="text-3xl font-bold text-white tracking-wider">Payment Orders</h2>
                
                <Card title="Payment Volume by Status">
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={chartData}>
                            <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                            <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(v) => `$${(v/1000)}k`} />
                            <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} formatter={(v: number) => `$${v.toLocaleString()}`}/>
                            <Bar dataKey="value" fill="#8884d8" name="Total Amount" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
                
                <Card>
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex space-x-2 p-1 bg-gray-900/50 rounded-lg">
                            {(['all', 'needs_approval', 'processing', 'completed'] as const).map(status => (
                                <button key={status} onClick={() => setFilter(status)} className={`px-3 py-1 text-sm rounded-md transition-colors ${filter === status ? 'bg-cyan-600 text-white' : 'text-gray-300 hover:bg-gray-700/50'}`}>
                                    {status.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                        <button onClick={() => setCreateModalOpen(true)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium">Create Order</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-400">
                            <thead className="text-xs text-gray-300 uppercase bg-gray-900/30">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Counterparty</th>
                                    <th scope="col" className="px-6 py-3">Amount</th>
                                    <th scope="col" className="px-6 py-3">Type</th>
                                    <th scope="col" className="px-6 py-3">Date</th>
                                    <th scope="col" className="px-6 py-3">Status</th>
                                    <th scope="col" className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map(po => (
                                    <tr key={po.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                        <td className="px-6 py-4 font-medium text-white">{po.counterpartyName}</td>
                                        <td className="px-6 py-4 font-mono text-white">${po.amount.toFixed(2)}</td>
                                        <td className="px-6 py-4">{po.type}</td>
                                        <td className="px-6 py-4">{po.date}</td>
                                        <td className="px-6 py-4"><StatusBadge status={po.status} /></td>
                                        <td className="px-6 py-4">
                                            {po.status === 'needs_approval' && (
                                                <div className="flex gap-2">
                                                    <button onClick={() => updatePaymentOrderStatus(po.id, 'approved')} className="text-xs text-green-300 hover:underline">Approve</button>
                                                    <button onClick={() => updatePaymentOrderStatus(po.id, 'denied')} className="text-xs text-red-300 hover:underline">Deny</button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
            {isCreateModalOpen && <CreatePaymentOrderModal />}
        </>
    );
}

export default PaymentOrdersView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | ORIGINAL PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/corporate/PaymentOrdersView.tsx
================================================================================

// components/views/corporate/PaymentOrdersView.tsx
import React, { useContext, useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { DataContext } from '../../../context/DataContext';
import Card from '../../Card';
import { PaymentOrder, PaymentOrderStatus, PaymentOrderType } from '../../../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { format, parseISO, isValid, differenceInDays } from 'date-fns'; // Added for date formatting and operations
import { v4 as uuidv4 } from 'uuid'; // Added for unique IDs

// region: New Utility Types and Interfaces
// =============================================================================
// This region introduces additional types and interfaces needed for a more
// comprehensive payment order management system, including advanced filtering,
// auditing, scheduling, and user management.
// =============================================================================

export interface PaymentOrderAuditLog {
    id: string;
    orderId: string;
    timestamp: string;
    action: string; // e.g., 'created', 'approved', 'denied', 'updated', 'scheduled', 'processed'
    userId: string;
    userName: string;
    details?: string; // Additional context for the action
}

export interface Counterparty {
    id: string;
    name: string;
    accountNumber: string;
    bankName: string;
    currency: string;
    address: string;
    contactEmail: string;
    swiftCode?: string;
    abaRoutingNumber?: string;
    isVerified: boolean;
}

export interface PaymentSchedule {
    id: string;
    orderId: string;
    scheduledDate: string; // ISO string
    recurrence: 'none' | 'daily' | 'weekly' | 'monthly' | 'annually';
    status: 'scheduled' | 'executed' | 'cancelled' | 'failed';
    lastExecutionDate?: string;
    nextExecutionDate?: string;
    metadata?: Record<string, any>;
}

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'approver' | 'creator' | 'viewer';
    permissions: string[]; // e.g., 'paymentOrder:create', 'paymentOrder:approve', 'paymentOrder:view'
    lastLogin: string;
}

export interface Notification {
    id: string;
    userId: string;
    type: 'info' | 'warning' | 'error' | 'success';
    message: string;
    timestamp: string;
    isRead: boolean;
    relatedEntityId?: string; // e.g., orderId
}

export interface ApprovalRule {
    id: string;
    name: string;
    description: string;
    condition: string; // e.g., "amount > 10000 AND type === 'Wire'"
    approvers: string[]; // User IDs of approvers
    minApprovalsRequired: number;
    isActive: boolean;
}

export interface SystemSettings {
    maxPaymentAmount: number;
    dailyTransactionLimit: number;
    defaultApprovalRuleId: string;
    twoFactorAuthEnabled: boolean;
    notificationPreferences: Record<string, boolean>; // e.g., { 'paymentApproved': true, 'paymentDenied': false }
}

// region: Mock Data Generation and Management
// =============================================================================
// This section provides sophisticated mock data generation functions to simulate
// a rich dataset for a real-world application. It includes utilities to create
// payment orders, counterparties, audit logs, schedules, users, and notifications,
// ensuring the UI has ample data to display and interact with.
// =============================================================================

/**
 * Helper function to generate a random date within a range.
 * @param start - Start date string (YYYY-MM-DD).
 * @param end - End date string (YYYY-MM-DD).
 * @returns ISO date string.
 */
const getRandomDate = (start: string, end: string): string => {
    const startDate = new Date(start).getTime();
    const endDate = new Date(end).getTime();
    const randomTime = startDate + Math.random() * (endDate - startDate);
    return format(new Date(randomTime), 'yyyy-MM-dd HH:mm:ss');
};

/**
 * Generates a random amount within a specified range.
 * @param min - Minimum amount.
 * @param max - Maximum amount.
 * @returns Random amount.
 */
const getRandomAmount = (min: number, max: number): number => {
    return parseFloat((Math.random() * (max - min) + min).toFixed(2));
};

/**
 * Generates a mock Counterparty.
 */
const generateMockCounterparty = (id: string): Counterparty => ({
    id: id,
    name: `Counterparty ${id.substring(0, 4).toUpperCase()}`,
    accountNumber: Math.random().toString().slice(2, 12),
    bankName: `Bank ${['X', 'Y', 'Z'][Math.floor(Math.random() * 3)]}`,
    currency: 'USD',
    address: `${Math.floor(Math.random() * 999)} Main St, Anytown, USA`,
    contactEmail: `contact${id.substring(0, 4)}@example.com`,
    isVerified: Math.random() > 0.5,
    swiftCode: Math.random() > 0.7 ? `SWIFT${Math.floor(Math.random() * 1000)}` : undefined,
    abaRoutingNumber: Math.random() > 0.7 ? Math.random().toString().slice(2, 11) : undefined,
});

/**
 * Generates a mock PaymentOrder.
 */
const generateMockPaymentOrder = (id: string, counterparty: Counterparty, userId: string): PaymentOrder => {
    const statusOptions: PaymentOrderStatus[] = ['needs_approval', 'approved', 'processing', 'completed', 'denied', 'returned'];
    const typeOptions: PaymentOrderType[] = ['ACH', 'Wire', 'RTP', 'Check'];
    const amount = getRandomAmount(100, 500000);
    const date = getRandomDate('2023-01-01', '2024-12-31');
    const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];

    return {
        id: id,
        counterpartyId: counterparty.id,
        counterpartyName: counterparty.name,
        amount: amount,
        type: typeOptions[Math.floor(Math.random() * typeOptions.length)],
        date: date,
        status: status,
        currency: 'USD',
        reference: `REF-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        description: `Payment for services/goods for ${counterparty.name}.`,
        creatorId: userId,
        approvalHistory: [], // Will be filled by audit logs
    };
};

/**
 * Generates a mock PaymentOrderAuditLog.
 */
const generateMockAuditLog = (order: PaymentOrder, user: UserProfile, action: string, details?: string): PaymentOrderAuditLog => ({
    id: uuidv4(),
    orderId: order.id,
    timestamp: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    action: action,
    userId: user.id,
    userName: user.name,
    details: details || `${user.name} ${action.replace('_', ' ')} for payment order ${order.id}.`,
});

/**
 * Generates a mock PaymentSchedule.
 */
const generateMockPaymentSchedule = (order: PaymentOrder): PaymentSchedule => {
    const recurrenceOptions: PaymentSchedule['recurrence'][] = ['none', 'monthly', 'weekly', 'annually'];
    const scheduledDate = format(new Date(new Date().getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd HH:mm:ss');
    const recurrence = recurrenceOptions[Math.floor(Math.random() * recurrenceOptions.length)];

    return {
        id: uuidv4(),
        orderId: order.id,
        scheduledDate: scheduledDate,
        recurrence: recurrence,
        status: Math.random() > 0.8 ? 'failed' : (Math.random() > 0.5 ? 'scheduled' : 'executed'),
        lastExecutionDate: Math.random() > 0.5 && recurrence !== 'none' ? getRandomDate('2023-01-01', scheduledDate) : undefined,
        nextExecutionDate: recurrence !== 'none' && new Date(scheduledDate) < new Date() ? format(new Date(new Date(scheduledDate).setMonth(new Date(scheduledDate).getMonth() + 1)), 'yyyy-MM-dd HH:mm:ss') : undefined,
    };
};

/**
 * Generates mock UserProfile data.
 */
const generateMockUser = (id: string, role: UserProfile['role'], name: string): UserProfile => ({
    id: id,
    name: name,
    email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
    role: role,
    permissions: role === 'admin' ? ['*'] : role === 'approver' ? ['paymentOrder:view', 'paymentOrder:approve', 'paymentOrder:deny'] : ['paymentOrder:view', 'paymentOrder:create'],
    lastLogin: getRandomDate('2024-01-01', '2024-12-31'),
});

/**
 * Generates a mock Notification.
 */
const generateMockNotification = (userId: string, type: Notification['type'], message: string, relatedEntityId?: string): Notification => ({
    id: uuidv4(),
    userId: userId,
    type: type,
    message: message,
    timestamp: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    isRead: Math.random() > 0.7,
    relatedEntityId: relatedEntityId,
});

/**
 * Generates mock SystemSettings.
 */
const generateMockSystemSettings = (): SystemSettings => ({
    maxPaymentAmount: 1000000,
    dailyTransactionLimit: 5000000,
    defaultApprovalRuleId: 'rule_123',
    twoFactorAuthEnabled: true,
    notificationPreferences: {
        paymentApproved: true,
        paymentDenied: true,
        newPaymentOrder: true,
        scheduledPaymentFailed: true,
        accountBlocked: true,
    },
});

/**
 * Generates a set of mock approval rules.
 */
const generateMockApprovalRules = (users: UserProfile[]): ApprovalRule[] => {
    const approverIds = users.filter(u => u.role === 'approver').map(u => u.id);
    return [
        {
            id: 'rule_123',
            name: 'Standard Approval',
            description: 'Approvals for all payments under $10,000.',
            condition: "amount <= 10000",
            approvers: approverIds.slice(0, 1),
            minApprovalsRequired: 1,
            isActive: true,
        },
        {
            id: 'rule_456',
            name: 'High Value Payment Approval',
            description: 'Requires two approvers for payments over $10,000.',
            condition: "amount > 10000 && amount <= 100000",
            approvers: approverIds,
            minApprovalsRequired: 2,
            isActive: true,
        },
        {
            id: 'rule_789',
            name: 'Wire Transfer Approval',
            description: 'Specific approval for wire transfers regardless of amount.',
            condition: "type === 'Wire'",
            approvers: approverIds,
            minApprovalsRequired: 1,
            isActive: true,
        },
    ];
};

// Global mock data store (as if it came from an API context or database)
const mockCounterparties: Counterparty[] = Array.from({ length: 50 }, (_, i) => generateMockCounterparty(uuidv4()));
const mockUsers: UserProfile[] = [
    generateMockUser('user_admin_01', 'admin', 'Alice Admin'),
    generateMockUser('user_approver_01', 'approver', 'Bob Approver'),
    generateMockUser('user_approver_02', 'approver', 'Charlie Approver'),
    generateMockUser('user_creator_01', 'creator', 'Diana Creator'),
    generateMockUser('user_viewer_01', 'viewer', 'Eve Viewer'),
];
const mockApprovalRules: ApprovalRule[] = generateMockApprovalRules(mockUsers);
const mockSystemSettings: SystemSettings = generateMockSystemSettings();

// Generate a large number of payment orders
let mockPaymentOrders: PaymentOrder[] = [];
let mockAuditLogs: PaymentOrderAuditLog[] = [];
let mockPaymentSchedules: PaymentSchedule[] = [];
let mockNotifications: Notification[] = [];

// Simulate data generation for ~500-1000 payment orders for a realistic feel
for (let i = 0; i < 750; i++) {
    const randomCounterparty = mockCounterparties[Math.floor(Math.random() * mockCounterparties.length)];
    const randomCreator = mockUsers[Math.floor(Math.random() * (mockUsers.length - 2)) + 2]; // creator or viewer
    const orderId = uuidv4();
    const order = generateMockPaymentOrder(order

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/views/corporate/PaymentOrdersView.tsx
================================================================================

// components/views/corporate/PaymentOrdersView.tsx
import React, { useContext, useState, useMemo } from 'react';
import { DataContext } from '../../../context/DataContext';
import Card from '../../Card';
import { PaymentOrder, PaymentOrderStatus } from '../../../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const PaymentOrdersView: React.FC = () => {
    const context = useContext(DataContext);
    const [filter, setFilter] = useState<PaymentOrderStatus | 'all'>('all');
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);

    if (!context) throw new Error("PaymentOrdersView must be within a DataProvider.");
    // FIX: Destructure `updatePaymentOrderStatus` from context to fix property not found error.
    const { paymentOrders, updatePaymentOrderStatus } = context;

    const filteredOrders = useMemo(() => {
        if (filter === 'all') return paymentOrders;
        return paymentOrders.filter(po => po.status === filter);
    }, [paymentOrders, filter]);
    
    const chartData = useMemo(() => {
        const statusCounts = paymentOrders.reduce((acc, po) => {
            acc[po.status] = (acc[po.status] || 0) + po.amount;
            return acc;
        }, {} as Record<PaymentOrderStatus, number>);
        return Object.entries(statusCounts).map(([name, value]) => ({ name: name.replace('_', ' '), value }));
    }, [paymentOrders]);

    const StatusBadge: React.FC<{ status: PaymentOrderStatus }> = ({ status }) => {
        const colors = {
            needs_approval: 'bg-yellow-500/20 text-yellow-300',
            approved: 'bg-cyan-500/20 text-cyan-300',
            processing: 'bg-blue-500/20 text-blue-300',
            completed: 'bg-green-500/20 text-green-300',
            denied: 'bg-red-500/20 text-red-300',
            returned: 'bg-orange-500/20 text-orange-300',
        };
        return <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[status]}`}>{status.replace('_', ' ')}</span>;
    };

    const CreatePaymentOrderModal: React.FC = () => (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={() => setCreateModalOpen(false)}>
            <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full border border-gray-700" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-700">
                    <h3 className="text-lg font-semibold text-white">Create Payment Order</h3>
                </div>
                <div className="p-6 space-y-4">
                    {/* Simplified form for demonstration */}
                    <input type="text" placeholder="Counterparty Name" className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white" />
                    <input type="number" placeholder="Amount (USD)" className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white" />
                    <select className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white">
                        <option>ACH</option>
                        <option>Wire</option>
                        <option>RTP</option>
                    </select>
                    <button onClick={() => { alert('Payment order created!'); setCreateModalOpen(false); }} className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg">Submit for Approval</button>
                </div>
            </div>
        </div>
    );
    
    return (
        <>
            <div className="space-y-6">
                <h2 className="text-3xl font-bold text-white tracking-wider">Payment Orders</h2>
                
                <Card title="Payment Volume by Status">
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={chartData}>
                            <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                            <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(v) => `$${(v/1000)}k`} />
                            <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} formatter={(v: number) => `$${v.toLocaleString()}`}/>
                            <Bar dataKey="value" fill="#8884d8" name="Total Amount" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
                
                <Card>
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex space-x-2 p-1 bg-gray-900/50 rounded-lg">
                            {(['all', 'needs_approval', 'processing', 'completed'] as const).map(status => (
                                <button key={status} onClick={() => setFilter(status)} className={`px-3 py-1 text-sm rounded-md transition-colors ${filter === status ? 'bg-cyan-600 text-white' : 'text-gray-300 hover:bg-gray-700/50'}`}>
                                    {status.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                        <button onClick={() => setCreateModalOpen(true)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium">Create Order</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-400">
                            <thead className="text-xs text-gray-300 uppercase bg-gray-900/30">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Counterparty</th>
                                    <th scope="col" className="px-6 py-3">Amount</th>
                                    <th scope="col" className="px-6 py-3">Type</th>
                                    <th scope="col" className="px-6 py-3">Date</th>
                                    <th scope="col" className="px-6 py-3">Status</th>
                                    <th scope="col" className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map(po => (
                                    <tr key={po.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                        <td className="px-6 py-4 font-medium text-white">{po.counterpartyName}</td>
                                        <td className="px-6 py-4 font-mono text-white">${po.amount.toFixed(2)}</td>
                                        <td className="px-6 py-4">{po.type}</td>
                                        <td className="px-6 py-4">{po.date}</td>
                                        <td className="px-6 py-4"><StatusBadge status={po.status} /></td>
                                        <td className="px-6 py-4">
                                            {po.status === 'needs_approval' && (
                                                <div className="flex gap-2">
                                                    <button onClick={() => updatePaymentOrderStatus(po.id, 'approved')} className="text-xs text-green-300 hover:underline">Approve</button>
                                                    <button onClick={() => updatePaymentOrderStatus(po.id, 'denied')} className="text-xs text-red-300 hover:underline">Deny</button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
            {isCreateModalOpen && <CreatePaymentOrderModal />}
        </>
    );
}

export default PaymentOrdersView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/views/corporate/PaymentOrdersView.tsx
================================================================================

// components/views/corporate/PaymentOrdersView.tsx
import React, { useContext, useState, useMemo } from 'react';
import { DataContext } from '../../../context/DataContext';
import Card from '../../Card';
import { PaymentOrder, PaymentOrderStatus } from '../../../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const PaymentOrdersView: React.FC = () => {
    const context = useContext(DataContext);
    const [filter, setFilter] = useState<PaymentOrderStatus | 'all'>('all');
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);

    if (!context) throw new Error("PaymentOrdersView must be within a DataProvider.");
    // FIX: Destructure `updatePaymentOrderStatus` from context to fix property not found error.
    const { paymentOrders, updatePaymentOrderStatus } = context;

    const filteredOrders = useMemo(() => {
        if (filter === 'all') return paymentOrders;
        return paymentOrders.filter(po => po.status === filter);
    }, [paymentOrders, filter]);
    
    const chartData = useMemo(() => {
        const statusCounts = paymentOrders.reduce((acc, po) => {
            acc[po.status] = (acc[po.status] || 0) + po.amount;
            return acc;
        }, {} as Record<PaymentOrderStatus, number>);
        return Object.entries(statusCounts).map(([name, value]) => ({ name: name.replace('_', ' '), value }));
    }, [paymentOrders]);

    const StatusBadge: React.FC<{ status: PaymentOrderStatus }> = ({ status }) => {
        const colors = {
            needs_approval: 'bg-yellow-500/20 text-yellow-300',
            approved: 'bg-cyan-500/20 text-cyan-300',
            processing: 'bg-blue-500/20 text-blue-300',
            completed: 'bg-green-500/20 text-green-300',
            denied: 'bg-red-500/20 text-red-300',
            returned: 'bg-orange-500/20 text-orange-300',
        };
        return <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[status]}`}>{status.replace('_', ' ')}</span>;
    };

    const CreatePaymentOrderModal: React.FC = () => (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={() => setCreateModalOpen(false)}>
            <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full border border-gray-700" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-700">
                    <h3 className="text-lg font-semibold text-white">Create Payment Order</h3>
                </div>
                <div className="p-6 space-y-4">
                    {/* Simplified form for demonstration */}
                    <input type="text" placeholder="Counterparty Name" className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white" />
                    <input type="number" placeholder="Amount (USD)" className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white" />
                    <select className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white">
                        <option>ACH</option>
                        <option>Wire</option>
                        <option>RTP</option>
                    </select>
                    <button onClick={() => { alert('Payment order created!'); setCreateModalOpen(false); }} className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg">Submit for Approval</button>
                </div>
            </div>
        </div>
    );
    
    return (
        <>
            <div className="space-y-6">
                <h2 className="text-3xl font-bold text-white tracking-wider">Payment Orders</h2>
                
                <Card title="Payment Volume by Status">
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={chartData}>
                            <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                            <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(v) => `$${(v/1000)}k`} />
                            <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} formatter={(v: number) => `$${v.toLocaleString()}`}/>
                            <Bar dataKey="value" fill="#8884d8" name="Total Amount" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
                
                <Card>
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex space-x-2 p-1 bg-gray-900/50 rounded-lg">
                            {(['all', 'needs_approval', 'processing', 'completed'] as const).map(status => (
                                <button key={status} onClick={() => setFilter(status)} className={`px-3 py-1 text-sm rounded-md transition-colors ${filter === status ? 'bg-cyan-600 text-white' : 'text-gray-300 hover:bg-gray-700/50'}`}>
                                    {status.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                        <button onClick={() => setCreateModalOpen(true)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium">Create Order</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-400">
                            <thead className="text-xs text-gray-300 uppercase bg-gray-900/30">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Counterparty</th>
                                    <th scope="col" className="px-6 py-3">Amount</th>
                                    <th scope="col" className="px-6 py-3">Type</th>
                                    <th scope="col" className="px-6 py-3">Date</th>
                                    <th scope="col" className="px-6 py-3">Status</th>
                                    <th scope="col" className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map(po => (
                                    <tr key={po.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                        <td className="px-6 py-4 font-medium text-white">{po.counterpartyName}</td>
                                        <td className="px-6 py-4 font-mono text-white">${po.amount.toFixed(2)}</td>
                                        <td className="px-6 py-4">{po.type}</td>
                                        <td className="px-6 py-4">{po.date}</td>
                                        <td className="px-6 py-4"><StatusBadge status={po.status} /></td>
                                        <td className="px-6 py-4">
                                            {po.status === 'needs_approval' && (
                                                <div className="flex gap-2">
                                                    <button onClick={() => updatePaymentOrderStatus(po.id, 'approved')} className="text-xs text-green-300 hover:underline">Approve</button>
                                                    <button onClick={() => updatePaymentOrderStatus(po.id, 'denied')} className="text-xs text-red-300 hover:underline">Deny</button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
            {isCreateModalOpen && <CreatePaymentOrderModal />}
        </>
    );
}

export default PaymentOrdersView;
