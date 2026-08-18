// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/platform/DemoBankERPView.tsx
================================================================================

import React, { useState, useMemo } from 'react';
import Card from '../../Card';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area, ComposedChart, CartesianGrid, Scatter, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts'; // Added ComposedChart, CartesianGrid, Scatter, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis

// --- START OF NEW CODE ---

// SECTION 1: Interfaces and Types - Expanded significantly for more realism and detail
// This section will be extensive.

export interface Product {
    id: string;
    name: string;
    sku: string;
    description: string;
    category: string;
    subCategory: string;
    brand: string;
    manufacturer: string;
    price: number;
    cost: number;
    markupPercentage: number;
    stock: number;
    minStockLevel: number;
    maxStockLevel: number;
    reorderQuantity: number;
    supplierId: string; // Foreign key to Vendor.id
    warehouseLocation: string; // Foreign key to Warehouse.id
    weight: number; // in kg
    dimensions: { length: number; width: number; height: number; unit: 'cm' | 'inch'; };
    isActive: boolean;
    imageUrl: string;
    barcode: string;
    taxRate: number; // as a decimal, e.g., 0.08 for 8%
    unitsSoldLastMonth: number;
    unitsSoldLastQuarter: number;
    averageRating: number; // out of 5
    reviewCount: number;
    warrantyMonths: number;
    tags: string[];
    createdAt: string;
    updatedAt: string;
    leadTimeDays: number;
    seasonalityScore: number; // 0-1 (e.g., 0.8 means 80% more demand in peak season)
    hazardousMaterial: boolean;
    shelfLifeDays?: number; // For perishable goods
    batchNumber?: string; // For tracking specific production batches
    lastRestockDate?: string;
}

export interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: {
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
    };
    shippingAddresses: Array<{ label: string; street: string; city: string; state: string; zip: string; country: string; }>; // Multiple shipping addresses
    companyName?: string;
    customerType: 'Individual' | 'Business';
    totalOrders: number;
    totalSpent: number;
    loyaltyPoints: number;
    lastOrderDate: string;
    firstOrderDate: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    paymentTerms: string; // e.g., 'Net 30', 'Due on receipt'
    creditLimit: number;
    accountBalance: number; // Positive means customer owes, negative means credit
    notes: string;
    segment: 'Bronze' | 'Silver' | 'Gold' | 'Platinum'; // Customer segmentation
    preferredContactMethod: 'Email' | 'Phone' | 'SMS';
    marketingOptIn: boolean;
}

export interface Vendor {
    id: string;
    name: string;
    contactPerson: string;
    email: string;
    phone: string;
    address: {
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
    };
    paymentTerms: string;
    creditDays: number;
    totalPurchased: number;
    lastPurchaseDate: string;
    productsSupplied: string[]; // Product IDs
    rawMaterialsSupplied: string[]; // RawMaterial IDs
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    contractStartDate: string;
    contractEndDate: string;
    rating: number; // out of 5
    onTimeDeliveryRate: number; // %
    qualityScore: number; // %
    notes: string;
    vendorCategory: 'Primary' | 'Secondary' | 'Tertiary';
    minimumOrderValue?: number;
}

export interface SalesOrder {
    id: string;
    customerId: string;
    customerName: string;
    orderDate: string;
    status: 'Draft' | 'Pending Approval' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Returned' | 'On Hold';
    totalAmount: number;
    items: { productId: string; productName: string; sku: string; quantity: number; unitPrice: number; total: number; }[];
    shippingAddress: {
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
    };
    billingAddress: {
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
    };
    shippingCost: number;
    taxRate: number; // applied to subtotal
    taxAmount: number;
    discountPercentage: number;
    discountAmount: number;
    subtotal: number;
    expectedDeliveryDate: string;
    actualDeliveryDate?: string;
    paymentStatus: 'Paid' | 'Pending' | 'Partially Paid' | 'Refunded' | 'Overdue';
    invoiceId?: string;
    salesRepId: string; // Employee ID
    notes: string;
    fulfillmentProgress: number; // 0-100%
    priority: 'Low' | 'Medium' | 'High' | 'Urgent';
    channel: 'Online' | 'Direct' | 'Reseller';
}

export interface PurchaseOrder {
    id: string;
    vendorId: string;
    vendorName: string;
    orderDate: string;
    status: 'Draft' | 'Pending Approval' | 'Ordered' | 'Received' | 'Partially Received' | 'Cancelled' | 'On Hold';
    totalAmount: number;
    items: { productId: string; productName: string; quantity: number; unitPrice: number; total: number; }[];
    expectedDeliveryDate: string;
    actualDeliveryDate?: string;
    paymentTerms: string;
    invoiceId?: string;
    purchasingAgentId: string; // Employee ID
    notes: string;
    receivingProgress: number; // 0-100%
    priority: 'Low' | 'Medium' | 'High' | 'Urgent';
    paymentStatus: 'Paid' | 'Pending' | 'Partially Paid' | 'Overdue';
}

export interface Invoice {
    id: string;
    orderId: string; // Can be SalesOrder or PurchaseOrder ID
    orderType: 'Sales' | 'Purchase';
    customerId?: string;
    customerName?: string;
    vendorId?: string;
    vendorName?: string;
    invoiceDate: string;
    dueDate: string;
    totalAmount: number;
    amountPaid: number;
    balanceDue: number;
    status: 'Paid' | 'Partially Paid' | 'Due' | 'Overdue' | 'Cancelled' | 'Refunded';
    paymentHistory: { date: string; amount: number; method: string; transactionId?: string; }[];
    lineItems: { description: string; quantity: number; unitPrice: number; total: number; productId?: string; }[];
    taxAmount: number;
    discountAmount: number;
    currency: string;
    notes: string;
    relatedDocumentIds: string[]; // e.g., shipment IDs, credit memos
}

export interface Shipment {
    id: string;
    orderId: string; // SalesOrder ID
    trackingNumber: string;
    carrier: string;
    serviceType: string; // e.g., 'Standard', 'Express', 'Freight'
    status: 'Pending' | 'Scheduled' | 'In Transit' | 'Out for Delivery' | 'Delivered' | 'Failed Attempt' | 'Exception' | 'Cancelled';
    originAddress: { street: string; city: string; state: string; zip: string; country: string; };
    destinationAddress: { street: string; city: string; state: string; zip: string; country: string; };
    shippedDate: string;
    estimatedDeliveryDate: string;
    actualDeliveryDate?: string;
    itemsShipped: { productId: string; quantity: number; }[];
    cost: number;
    weight: number; // total weight
    dimensions: { length: number; width: number; height: number; unit: 'cm' | 'inch'; };
    notes: string;
    signatureRequired: boolean;
    packagingType: 'Box' | 'Pallet' | 'Envelope';
    lastUpdated: string; // Timestamp of last status update
}

export interface Employee {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    position: string;
    department: string;
    hireDate: string;
    salary: number;
    status: 'Active' | 'On Leave' | 'Terminated' | 'Suspended';
    managerId?: string;
    managerName?: string;
    birthDate: string;
    address: {
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
    };
    employmentType: 'Full-time' | 'Part-time' | 'Contractor';
    emergencyContact: {
        name: string;
        relationship: string;
        phone: string;
    };
    annualLeaveDays: number;
    sickLeaveDays: number;
    leaveTakenYTD: number;
    performanceRating: number; // 1-5
    skills: string[];
    certifications: string[];
    employeeBenefits: { healthInsurance: boolean; dentalInsurance: boolean; retirementPlan: boolean; };
    lastPerformanceReview: string;
    nextPerformanceReview: string;
}

export interface FinancialTransaction {
    id: string;
    type: 'Revenue' | 'Expense' | 'Transfer' | 'Adjustment';
    category: string; // e.g., 'Sales', 'Rent', 'Salaries', 'Supplies', 'Bank Charges'
    subCategory?: string;
    amount: number;
    date: string;
    description: string;
    accountId: string; // e.g., 'Cash', 'Bank A', 'Bank B' (GLAccount ID)
    relatedEntityId?: string; // e.g., SalesOrder ID, PurchaseOrder ID, Invoice ID
    status: 'Cleared' | 'Pending' | 'Reconciled' | 'Voided';
    currency: string;
    notes: string;
    paymentMethod?: string; // 'Bank Transfer', 'Credit Card', 'Cash', 'Check'
    transactionRef?: string; // Bank transaction ID
    recordedBy: string; // Employee ID
}

export interface GLAccount {
    id: string;
    name: string;
    accountNumber: string;
    type: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
    subType: string; // e.g., 'Current Asset', 'Long-term Liability', 'Operating Expense'
    balance: number;
    isActive: boolean;
    description: string;
    isControlAccount: boolean; // e.g., Accounts Receivable, Accounts Payable
    normalBalance: 'Debit' | 'Credit';
    createdAt: string;
    updatedAt: string;
}

export interface Warehouse {
    id: string;
    name: string;
    location: {
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
    };
    capacity: number; // in cubic meters
    currentUtilization: number; // percentage
    managerId: string; // Employee ID
    contactPhone: string;
    isClimateControlled: boolean;
    operatingHours: string;
}

export interface ManufacturingOrder {
    id: string;
    productId: string; // Product being manufactured
    productName: string;
    quantityToProduce: number;
    status: 'Planned' | 'In Progress' | 'Completed' | 'On Hold' | 'Cancelled';
    startDate: string;
    expectedCompletionDate: string;
    actualCompletionDate?: string;
    billOfMaterialsId: string;
    workstation: string;
    assignedTo: string; // Employee ID
    notes: string;
    costEstimate: number;
    actualCost?: number;
}

export interface BillOfMaterials {
    id: string;
    productId: string;
    name: string;
    description: string;
    items: {
        componentId: string; // Could be another Product or a RawMaterial
        componentName: string;
        quantity: number;
        unit: 'pcs' | 'kg' | 'm' | 'liter';
    }[];
    version: number;
    isActive: boolean;
    createdAt: string;
}

// SECTION 2: MOCK DATA
// Extensive mock data to simulate a real-world enterprise environment.

const mockProducts: Product[] = [
    {
        id: 'PROD-001', name: 'Quantum Laptop X1', sku: 'QL-X1-PRO', description: 'Next-gen laptop with quantum processing.', category: 'Electronics', subCategory: 'Laptops', brand: 'QuantumLeap', manufacturer: 'Core Systems',
        price: 2499.99, cost: 1200.00, markupPercentage: 108.33, stock: 150, minStockLevel: 50, maxStockLevel: 200, reorderQuantity: 75, supplierId: 'VEND-001', warehouseLocation: 'WH-001',
        weight: 1.8, dimensions: { length: 32, width: 22, height: 1.5, unit: 'cm' }, isActive: true, imageUrl: 'https://example.com/ql-x1.jpg', barcode: '1234567890123', taxRate: 0.08,
        unitsSoldLastMonth: 45, unitsSoldLastQuarter: 130, averageRating: 4.8, reviewCount: 88, warrantyMonths: 24, tags: ['premium', 'quantum', 'laptop'], createdAt: '2022-01-15T09:30:00Z', updatedAt: '2023-05-20T14:00:00Z',
        leadTimeDays: 14, seasonalityScore: 0.6, hazardousMaterial: false, lastRestockDate: '2023-05-10T00:00:00Z',
    },
    {
        id: 'PROD-002', name: 'Eco-Friendly Water Bottle', sku: 'EF-WB-500', description: '500ml bottle made from recycled materials.', category: 'Lifestyle', subCategory: 'Drinkware', brand: 'GreenLife', manufacturer: 'EcoWares Inc.',
        price: 19.99, cost: 5.50, markupPercentage: 263.45, stock: 1200, minStockLevel: 300, maxStockLevel: 1500, reorderQuantity: 500, supplierId: 'VEND-002', warehouseLocation: 'WH-002',
        weight: 0.2, dimensions: { length: 7, width: 7, height: 22, unit: 'cm' }, isActive: true, imageUrl: 'https://example.com/ef-wb.jpg', barcode: '9876543210987', taxRate: 0.05,
        unitsSoldLastMonth: 850, unitsSoldLastQuarter: 2500, averageRating: 4.5, reviewCount: 450, warrantyMonths: 6, tags: ['eco', 'recycled', 'bpa-free'], createdAt: '2021-08-01T11:00:00Z', updatedAt: '2023-05-25T18:00:00Z',
        leadTimeDays: 7, seasonalityScore: 0.8, hazardousMaterial: false, shelfLifeDays: undefined, lastRestockDate: '2023-05-01T00:00:00Z',
    },
    // ... Add at least 10-15 more product entries for realism
];


const mockCustomers: Customer[] = [
    {
        id: 'CUST-001', name: 'John Smith', email: 'john.smith@example.com', phone: '555-123-4567',
        address: { street: '123 Main St', city: 'Anytown', state: 'CA', zip: '12345', country: 'USA' },
        shippingAddresses: [{ label: 'Home', street: '123 Main St', city: 'Anytown', state: 'CA', zip: '12345', country: 'USA' }],
        customerType: 'Individual', totalOrders: 5, totalSpent: 3500.75, loyaltyPoints: 1250, lastOrderDate: '2023-05-15T00:00:00Z', firstOrderDate: '2022-03-01T00:00:00Z',
        isActive: true, createdAt: '2022-02-28T00:00:00Z', updatedAt: '2023-05-15T00:00:00Z', paymentTerms: 'Due on receipt', creditLimit: 0, accountBalance: 0,
        notes: 'VIP customer, interested in new tech.', segment: 'Gold', preferredContactMethod: 'Email', marketingOptIn: true
    },
    {
        id: 'CUST-002', name: 'Innovate Corp', email: 'purchasing@innovate.com', phone: '555-987-6543',
        address: { street: '456 Innovation Dr', city: 'Techville', state: 'TX', zip: '67890', country: 'USA' },
        shippingAddresses: [
            { label: 'HQ', street: '456 Innovation Dr', city: 'Techville', state: 'TX', zip: '67890', country: 'USA' },
            { label: 'Lab', street: '789 Research Pkwy', city: 'Techville', state: 'TX', zip: '67891', country: 'USA' },
        ],
        companyName: 'Innovate Corp', customerType: 'Business', totalOrders: 28, totalSpent: 150000.00, loyaltyPoints: 75000, lastOrderDate: '2023-04-20T00:00:00Z', firstOrderDate: '2020-01-10T00:00:00Z',
        isActive: true, createdAt: '2020-01-09T00:00:00Z', updatedAt: '2023-04-20T00:00:00Z', paymentTerms: 'Net 30', creditLimit: 50000, accountBalance: 12500.00,
        notes: 'Large B2B client. Always pays on time.', segment: 'Platinum', preferredContactMethod: 'Phone', marketingOptIn: false
    },
    // ... Add at least 10-15 more customer entries
];

const mockSalesOrders: SalesOrder[] = [
    {
        id: 'SO-1001', customerId: 'CUST-002', customerName: 'Innovate Corp', orderDate: '2023-05-20T10:00:00Z', status: 'Processing', totalAmount: 51299.79,
        items: [{ productId: 'PROD-001', productName: 'Quantum Laptop X1', sku: 'QL-X1-PRO', quantity: 20, unitPrice: 2499.99, total: 49999.80 }],
        shippingAddress: { street: '456 Innovation Dr', city: 'Techville', state: 'TX', zip: '67890', country: 'USA' },
        billingAddress: { street: '456 Innovation Dr', city: 'Techville', state: 'TX', zip: '67890', country: 'USA' },
        shippingCost: 300.00, taxRate: 0.08, taxAmount: 3999.98, discountPercentage: 0.05, discountAmount: 2500.00, subtotal: 49999.80,
        expectedDeliveryDate: '2023-06-01T00:00:00Z', paymentStatus: 'Partially Paid', salesRepId: 'EMP-003', notes: 'Urgent order for new R&D team.', fulfillmentProgress: 25,
        priority: 'High', channel: 'Direct'
    },
    // ... Add multiple sales orders for different time periods
];

// ... Add extensive mock data for all other interfaces (Vendors, PurchaseOrders, Invoices, etc.)

// SECTION 3: HELPER FUNCTIONS & UTILITIES

const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case 'processing':
        case 'in progress':
        case 'ordered':
            return 'bg-blue-100 text-blue-800';
        case 'shipped':
        case 'in transit':
            return 'bg-yellow-100 text-yellow-800';
        case 'delivered':
        case 'completed':
        case 'paid':
        case 'received':
            return 'bg-green-100 text-green-800';
        case 'cancelled':
        case 'terminated':
            return 'bg-red-100 text-red-800';
        case 'pending':
        case 'pending approval':
        case 'on hold':
            return 'bg-gray-100 text-gray-800';
        case 'overdue':
        case 'urgent':
            return 'bg-orange-100 text-orange-800';
        default:
            return 'bg-gray-200 text-gray-900';
    }
};


// SECTION 4: UI SUB-COMPONENTS

const KpiCard = ({ title, value, change, changeType, icon }: { title: string, value: string, change: string, changeType: 'increase' | 'decrease', icon: React.ReactNode }) => (
    <Card title="">
        <div className="flex items-start justify-between">
            <div>
                <h3 className="text-sm font-medium text-gray-500">{title}</h3>
                <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-full">
                {icon}
            </div>
        </div>
        <div className={`mt-4 flex items-center text-sm ${changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
            {changeType === 'increase' ? '▲' : '▼'}
            <span className="ml-1">{change} vs last month</span>
        </div>
    </Card>
);

const AIInsightCard = ({ title, insight, model = "Gemini Pro" }: { title: string, insight: string, model?: string }) => (
    <Card title={title}>
        <p className="text-gray-700">{insight}</p>
        <div className="text-right text-xs text-gray-400 mt-4">
            ✨ Powered by {model}
        </div>
    </Card>
);

const SalesDashboard = ({ salesData }: { salesData: SalesOrder[] }) => {
    const monthlySales = useMemo(() => {
        const salesByMonth: { [key: string]: number } = {};
        salesData.forEach(order => {
            const month = new Date(order.orderDate).toLocaleString('default', { month: 'short', year: '2-digit' });
            if (!salesByMonth[month]) {
                salesByMonth[month] = 0;
            }
            salesByMonth[month] += order.totalAmount;
        });
        // Transform to array and sort
        return Object.entries(salesByMonth).map(([name, sales]) => ({ name, sales })).reverse();
    }, [salesData]);
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="col-span-1 md:col-span-2 lg:col-span-4">
                <Card title="Monthly Sales Revenue">
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={monthlySales}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis tickFormatter={(value) => formatCurrency(value as number)} />
                            <Tooltip formatter={(value) => formatCurrency(value as number)} />
                            <Legend />
                            <Area type="monotone" dataKey="sales" stroke="#8884d8" fill="#8884d8" name="Revenue"/>
                        </AreaChart>
                    </ResponsiveContainer>
                </Card>
            </div>
            <div className="col-span-1 md:col-span-2 lg:col-span-2">
                 <AIInsightCard 
                    title="AI Sales Anomaly Detection"
                    insight="Detected an unusual 80% spike in 'Quantum Laptop X1' sales in the Texas region this month. Recommend investigating marketing campaigns or competitor stock issues. Potential for a targeted upsell campaign."
                 />
            </div>
             <div className="col-span-1 md:col-span-2 lg:col-span-2">
                 <AIInsightCard 
                    title="AI Customer Churn Prediction"
                    insight="Customer 'Innovate Corp' shows a 65% probability of reduced purchasing in the next quarter based on order frequency and support ticket analysis. Recommend proactive engagement from their account manager."
                 />
            </div>
            <div className="col-span-full">
                <Card title="Recent Sales Orders">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                             <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {salesData.slice(0, 5).map(order => (
                                    <tr key={order.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customerName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(order.orderDate)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(order.totalAmount)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );
};


// ... Create similar detailed dashboard components for Inventory, Finance, HR, Purchasing etc.

// SECTION 5: MAIN ERP VIEW COMPONENT

const DemoBankERPView = () => {
    const [activeTab, setActiveTab] = useState('Sales');
    const tabs = ['Dashboard', 'Sales', 'Purchasing', 'Inventory', 'Finance', 'Human Resources', 'Manufacturing', 'Analytics'];

    const renderContent = () => {
        switch (activeTab) {
            case 'Sales':
                return <SalesDashboard salesData={mockSalesOrders} />;
            // In a real app, each case would render a dedicated component with relevant data
            // case 'Inventory':
            //     return <InventoryDashboard productData={mockProducts} />;
            // case 'Finance':
            //      return <FinanceDashboard transactions={mockFinancialTransactions} />;
            default:
                return (
                    <div className="text-center p-8 bg-gray-50 rounded-lg">
                        <h2 className="text-2xl font-semibold text-gray-700">Welcome to the {activeTab} Module</h2>
                        <p className="mt-2 text-gray-500">This module is under construction. Please select another module from the navigation.</p>
                        <div className="mt-6">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h5l4 4v10a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
            <header className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900">Enterprise Resource Planning (ERP)</h1>
                <p className="mt-2 text-lg text-gray-600">Unified view of core business processes, powered by AI.</p>
            </header>

            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`${
                                activeTab === tab
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>

            <main className="mt-8">
                {renderContent()}
            </main>
        </div>
    );
};

export default DemoBankERPView;