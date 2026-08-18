// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/platform/DemoBankCommerceView.tsx
================================================================================

import React, { useState, useEffect, useCallback, useMemo, createContext, useContext, useReducer, useRef } from 'react';
import Card from '../../Card';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, Legend, CartesianGrid, ComposedChart } from 'recharts';
import { FaUser, FaBox, FaShoppingCart, FaChartBar, FaCog, FaBell, FaSearch, FaPlus, FaEdit, FaTrash, FaTimes, FaCheck, FaSave, FaListAlt, FaCalendarAlt, FaDollarSign, FaCreditCard, FaTruck, FaFileInvoice, FaTag, FaEnvelope, FaPhone, FaMapMarkerAlt, FaGlobe, FaArrowRight, FaArrowLeft, FaSortUp, FaSortDown, FaFilter, FaRedo, FaUpload, FaDownload, FaPrint, FaEye, FaExclamationTriangle, FaInfoCircle, FaCheckCircle, FaSpinner, FaChevronDown, FaChevronUp, FaUsers, FaClipboardList, FaPercent, FaRobot, FaLightbulb, FaBrain, FaChartLine, FaShieldAlt, FaWarehouse, FaUndo, FaCogs, FaMoon, FaSun, FaCommentDots } from 'react-icons/fa';

/**
 * =========================================================================
 *  SECTION 1: CORE UTILITY FUNCTIONS AND DATA HELPERS
 * =========================================================================
 * This section defines fundamental helper functions for unique ID generation,
 * data formatting, asynchronous operations, and basic data manipulation.
 */

/**
 * Type alias for a unique identifier string.
 * This ensures consistency across all entity IDs within the application.
 */
export type EntityId = string;

/**
 * Generates a unique ID string using a combination of random numbers and base-36 encoding.
 * This is suitable for client-side unique ID generation for mock data.
 * @returns {EntityId} A new unique identifier string.
 */
export const generateId = (): EntityId => `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

/**
 * Formats a number as currency using `Intl.NumberFormat` for internationalization.
 * @param {number} amount - The numeric value to be formatted as currency.
 * @param {string} currency - The three-letter ISO 4217 currency code. Defaults to 'USD'.
 * @param {string} locale - The locale string. Defaults to 'en-US'.
 * @returns {string} The formatted currency string.
 */
export const formatCurrency = (amount: number, currency: string = 'USD', locale: string = 'en-US'): string => {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
};

/**
 * Formats a date object or date string into a human-readable string.
 * @param {Date | string} dateInput - The date object or string to format.
 * @param {Intl.DateTimeFormatOptions} options - Formatting options.
 * @param {string} locale - The locale string. Defaults to 'en-US'.
 * @returns {string} The formatted date string.
 */
export const formatDate = (
    dateInput: Date | string,
    options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' },
    locale: string = 'en-US'
): string => {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(date.getTime())) {
        return 'Invalid Date';
    }
    return new Intl.DateTimeFormat(locale, options).format(date);
};

/**
 * Formats a number with thousands separators for improved readability.
 * @param {number} value - The number to format.
 * @param {string} locale - The locale string. Defaults to 'en-US'.
 * @returns {string} The formatted number string.
 */
export const formatNumber = (value: number, locale: string = 'en-US'): string => {
    return new Intl.NumberFormat(locale).format(value);
};

/**
 * Capitalizes the first letter of a given string.
 * @param {string} str - The input string.
 * @returns {string} The string with its first letter capitalized.
 */
export const capitalize = (str: string): string => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Simulates a network delay using `setTimeout` to mimic asynchronous API calls.
 * @param {number} ms - The delay duration in milliseconds.
 * @returns {Promise<void>} A promise that resolves after the specified delay.
 */
export const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

/**
 * Generates a random integer within a specified inclusive range.
 * @param {number} min - The minimum possible integer value.
 * @param {number} max - The maximum possible integer value.
 * @returns {number} A random integer between `min` and `max`.
 */
export const getRandomInt = (min: number, max: number): number => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Generates a random Date object between two specified dates.
 * @param {Date} start - The earliest possible date.
 * @param {Date} end - The latest possible date.
 * @returns {Date} A random Date object.
 */
export const getRandomDate = (start: Date, end: Date): Date => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

/**
 * Performs a deep clone of an object using JSON serialization.
 * @template T The type of the object to clone.
 * @param {T} obj - The object to be deep-cloned.
 * @returns {T} A deep copy of the input object.
 */
export const deepClone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));


/**
 * =========================================================================
 *  SECTION 2: DATA MODELS AND INTERFACES
 * =========================================================================
 * This section defines the TypeScript interfaces for all major entities
 * and data structures used throughout the commerce application.
 */

export interface Address {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
}

export interface User {
    id: EntityId;
    username: string;
    email: string;
    role: 'admin' | 'manager' | 'viewer';
    createdAt: Date;
    lastLogin: Date;
    isActive: boolean;
}

export interface Customer {
    id: EntityId;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address: Address;
    totalOrders: number;
    totalSpent: number;
    registrationDate: Date;
    lastActivity: Date;
    status: 'active' | 'inactive' | 'vip';
    notes?: string;
}

export interface Product {
    id: EntityId;
    name: string;
    description: string;
    price: number;
    cost: number;
    sku: string;
    category: string;
    stock: number;
    imageUrl: string;
    weightKg?: number;
    dimensionsCm?: { length: number; width: number; height: number; };
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface OrderItem {
    productId: EntityId;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

export interface Order {
    id: EntityId;
    customerId: EntityId;
    customerName: string;
    orderDate: Date;
    items: OrderItem[];
    subtotal: number;
    shippingCost: number;
    taxAmount: number;
    discountAmount: number;
    totalAmount: number;
    status: OrderStatus;
    shippingAddress: Address;
    billingAddress: Address;
    paymentMethod: 'credit_card' | 'paypal' | 'bank_transfer';
    paymentStatus: 'paid' | 'unpaid' | 'pending';
    trackingNumber?: string;
    shippingCarrier?: string;
    notes?: string;
}

export interface AIInsight {
    id: EntityId;
    title: string;
    description: string;
    severity: 'info' | 'warning' | 'critical';
    category: 'Sales' | 'Inventory' | 'Customer' | 'Marketing';
    recommendation: string;
    timestamp: Date;
}

export interface MonthlySalesData {
    name: string;
    sales: number;
    profit: number;
    orders: number;
}

export type Theme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// ... Additional interfaces can be added here for shipments, invoices, etc.

/**
 * =========================================================================
 *  SECTION 3: MOCK DATA GENERATION
 * =========================================================================
 * In a real application, this data would come from a backend API.
 * For this demo, we generate realistic mock data on the client side.
 */

const MOCK_DATA = {
    firstNames: ["John", "Jane", "Alex", "Emily", "Chris", "Katie", "Michael", "Sarah"],
    lastNames: ["Smith", "Doe", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis"],
    productNouns: ["Quantum", "Hyper", "Nano", "Cyber", "Astro", "Geo", "Eco"],
    productTypes: ["Processor", "Drive", "Coolant", "Framework", "API", "SDK", "Module"],
    categories: ["Hardware", "Software", "Services", "Cloud", "AI"],
    cities: ["New York", "London", "Tokyo", "Sydney", "Paris", "Berlin"],
    states: ["NY", "CA", "TX", "FL", "IL", "GB", "NSW"],
    countries: ["USA", "UK", "Japan", "Australia", "France", "Germany"],
    streets: ["Main St", "High St", "Park Ave", "Oak St", "Elm St"],
};

const getRandomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const generateMockAddress = (): Address => ({
    street: `${getRandomInt(100, 9999)} ${getRandomElement(MOCK_DATA.streets)}`,
    city: getRandomElement(MOCK_DATA.cities),
    state: getRandomElement(MOCK_DATA.states),
    zip: `${getRandomInt(10000, 99999)}`,
    country: getRandomElement(MOCK_DATA.countries),
});

let mockProducts: Product[] = [];
const generateMockProducts = (count: number): Product[] => {
    if (mockProducts.length > 0) return mockProducts;
    const products: Product[] = [];
    for (let i = 0; i < count; i++) {
        const name = `${getRandomElement(MOCK_DATA.productNouns)} ${getRandomElement(MOCK_DATA.productTypes)} v${getRandomInt(1, 5)}.${getRandomInt(0, 9)}`;
        const cost = getRandomInt(50, 1000);
        const price = Math.round(cost * (1 + getRandomInt(30, 100) / 100));
        products.push({
            id: generateId(),
            name,
            description: `A high-performance ${name} designed for enterprise-level applications. Features advanced AI-driven optimization and quantum-proof encryption.`,
            price,
            cost,
            sku: `SKU-${getRandomInt(100000, 999999)}`,
            category: getRandomElement(MOCK_DATA.categories),
            stock: getRandomInt(0, 500),
            imageUrl: `https://picsum.photos/seed/${name.replace(/\s/g, '')}/400/300`,
            isActive: Math.random() > 0.1,
            createdAt: getRandomDate(new Date(2022, 0, 1), new Date()),
            updatedAt: new Date(),
        });
    }
    mockProducts = products;
    return products;
};

let mockCustomers: Customer[] = [];
const generateMockCustomers = (count: number): Customer[] => {
    if (mockCustomers.length > 0) return mockCustomers;
    const customers: Customer[] = [];
    for (let i = 0; i < count; i++) {
        const firstName = getRandomElement(MOCK_DATA.firstNames);
        const lastName = getRandomElement(MOCK_DATA.lastNames);
        customers.push({
            id: generateId(),
            firstName,
            lastName,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${getRandomInt(1, 99)}@example.com`,
            address: generateMockAddress(),
            totalOrders: 0,
            totalSpent: 0,
            registrationDate: getRandomDate(new Date(2022, 0, 1), new Date()),
            lastActivity: new Date(),
            status: getRandomElement(['active', 'vip', 'inactive']),
        });
    }
    mockCustomers = customers;
    return customers;
};

let mockOrders: Order[] = [];
const generateMockOrders = (count: number, customers: Customer[], products: Product[]): Order[] => {
    if (mockOrders.length > 0) return mockOrders;
    const orders: Order[] = [];
    for (let i = 0; i < count; i++) {
        const customer = getRandomElement(customers);
        const items: OrderItem[] = [];
        const numItems = getRandomInt(1, 5);
        let subtotal = 0;

        for (let j = 0; j < numItems; j++) {
            const product = getRandomElement(products);
            const quantity = getRandomInt(1, 3);
            const totalPrice = product.price * quantity;
            items.push({
                productId: product.id,
                productName: product.name,
                quantity,
                unitPrice: product.price,
                totalPrice,
            });
            subtotal += totalPrice;
        }

        const shippingCost = getRandomInt(10, 50);
        const taxAmount = subtotal * 0.08;
        const discountAmount = Math.random() > 0.7 ? subtotal * 0.1 : 0;
        const totalAmount = subtotal + shippingCost + taxAmount - discountAmount;

        orders.push({
            id: `ORD-${getRandomInt(10000, 99999)}`,
            customerId: customer.id,
            customerName: `${customer.firstName} ${customer.lastName}`,
            orderDate: getRandomDate(customer.registrationDate, new Date()),
            items,
            subtotal,
            shippingCost,
            taxAmount,
            discountAmount,
            totalAmount,
            status: getRandomElement(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
            shippingAddress: deepClone(customer.address),
            billingAddress: deepClone(customer.address),
            paymentMethod: getRandomElement(['credit_card', 'paypal', 'bank_transfer']),
            paymentStatus: 'paid',
            trackingNumber: `1Z${getRandomInt(1000000000000000, 9999999999999999)}`,
            shippingCarrier: getRandomElement(['FedEx', 'UPS', 'DHL']),
        });

        // Update customer aggregates
        const customerToUpdate = mockCustomers.find(c => c.id === customer.id);
        if (customerToUpdate) {
            customerToUpdate.totalOrders++;
            customerToUpdate.totalSpent += totalAmount;
            customerToUpdate.lastActivity = orders[orders.length - 1].orderDate;
        }
    }
    mockOrders = orders;
    return orders;
};

const generateAIInsights = (count: number): AIInsight[] => {
    const insights: AIInsight[] = [];
    const insightTemplates = [
        {
            title: "Low Stock Alert for '{PRODUCT}'",
            description: "Inventory for '{PRODUCT}' is critically low ({STOCK} units remaining). This product is a top seller this month.",
            severity: 'critical', category: 'Inventory',
            recommendation: "Reorder from supplier immediately to avoid stockout and potential loss of sales."
        },
        {
            title: "Sales Surge in '{CATEGORY}' Category",
            description: "The '{CATEGORY}' category has seen a {PERCENT}% increase in sales over the past 7 days, driven by new product additions.",
            severity: 'info', category: 'Sales',
            recommendation: "Consider launching a targeted marketing campaign for this category to capitalize on the momentum."
        },
        {
            title: "High Cart Abandonment Rate for VIP Customers",
            description: "VIP customers have a {PERCENT}% higher cart abandonment rate compared to other segments. The primary drop-off point is the shipping cost calculation step.",
            severity: 'warning', category: 'Customer',
            recommendation: "Offer free or flat-rate shipping for VIP customers to reduce friction and improve conversion."
        },
        {
            title: "Sales Forecast: Upward Trend Expected",
            description: "Our predictive model forecasts a {PERCENT}% increase in total sales next month, based on seasonal trends and recent marketing performance.",
            severity: 'info', category: 'Marketing',
            recommendation: "Ensure marketing budgets are allocated and inventory is sufficient to meet the expected demand."
        }
    ];

    for (let i = 0; i < count; i++) {
        const template = getRandomElement(insightTemplates);
        const product = getRandomElement(mockProducts);
        const category = getRandomElement(MOCK_DATA.categories);
        const filledInsight = {
            id: generateId(),
            title: template.title.replace('{PRODUCT}', product.name).replace('{CATEGORY}', category),
            description: template.description
                .replace('{PRODUCT}', product.name)
                .replace('{STOCK}', String(product.stock))
                .replace('{CATEGORY}', category)
                .replace('{PERCENT}', String(getRandomInt(15, 50))),
            severity: template.severity as any,
            category: template.category as any,
            recommendation: template.recommendation,
            timestamp: getRandomDate(new Date(new Date().setDate(new Date().getDate() - 7)), new Date())
        };
        insights.push(filledInsight);
    }
    return insights.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

const generateMonthlySalesData = (): MonthlySalesData[] => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data: MonthlySalesData[] = [];
    let lastMonthSales = 100000;
    for (const month of months) {
        const sales = lastMonthSales * (1 + (Math.random() - 0.4));
        const profit = sales * (getRandomInt(20, 40) / 100);
        const orders = Math.floor(sales / getRandomInt(500, 1500));
        data.push({ name: month, sales, profit, orders });
        lastMonthSales = sales;
    }
    return data;
};

// Initial data generation
generateMockProducts(50);
generateMockCustomers(100);
generateMockOrders(200, mockCustomers, mockProducts);

/**
 * =========================================================================
 *  SECTION 4: MOCK API SERVICE
 * =========================================================================
 * This class simulates a backend API, providing methods to fetch and
 * manipulate data. It uses `delay` to mimic network latency.
 */
class CommerceAPIService {
    private static instance: CommerceAPIService;
    private products: Product[] = [];
    private customers: Customer[] = [];
    private orders: Order[] = [];
    private insights: AIInsight[] = [];
    private monthlySales: MonthlySalesData[] = [];

    private constructor() {
        this.products = generateMockProducts(50);
        this.customers = generateMockCustomers(100);
        this.orders = generateMockOrders(200, this.customers, this.products);
        this.insights = generateAIInsights(5);
        this.monthlySales = generateMonthlySalesData();
    }

    public static getInstance(): CommerceAPIService {
        if (!CommerceAPIService.instance) {
            CommerceAPIService.instance = new CommerceAPIService();
        }
        return CommerceAPIService.instance;
    }

    async fetchDashboardData() {
        await delay(getRandomInt(500, 1500));
        const totalRevenue = this.orders.reduce((sum, order) => sum + order.totalAmount, 0);
        const totalOrders = this.orders.length;
        const totalCustomers = this.customers.length;
        const topProducts = [...this.products]
            .sort((a, b) => b.price * b.stock - a.price * a.stock) // simplistic "sales" metric
            .slice(0, 5);
        return {
            kpis: {
                totalRevenue,
                totalOrders,
                totalCustomers,
                avgOrderValue: totalRevenue / totalOrders,
            },
            monthlySales: this.monthlySales,
            topProducts,
            recentOrders: this.orders.slice(0, 5),
        };
    }
    
    async fetchProducts() { await delay(500); return deepClone(this.products); }
    async fetchCustomers() { await delay(500); return deepClone(this.customers); }
    async fetchOrders() { await delay(500); return deepClone(this.orders); }
    async fetchAIInsights() { await delay(700); return deepClone(this.insights); }

    async addProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) {
        await delay(1000);
        const newProduct: Product = {
            ...productData,
            id: generateId(),
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        this.products.unshift(newProduct);
        return newProduct;
    }

    async updateProduct(productId: EntityId, updates: Partial<Product>) {
        await delay(1000);
        const index = this.products.findIndex(p => p.id === productId);
        if (index === -1) throw new Error("Product not found");
        this.products[index] = { ...this.products[index], ...updates, updatedAt: new Date() };
        return this.products[index];
    }
    
    async deleteProduct(productId: EntityId) {
        await delay(1000);
        this.products = this.products.filter(p => p.id !== productId);
        return true;
    }

    async updateOrderStatus(orderId: EntityId, status: OrderStatus) {
        await delay(800);
        const index = this.orders.findIndex(o => o.id === orderId);
        if (index === -1) throw new Error("Order not found");
        this.orders[index].status = status;
        return this.orders[index];
    }
    
    async generateAIDescription(productName: string, category: string): Promise<string> {
        await delay(1500); // Simulate AI processing time
        return `Introducing the revolutionary ${productName}, the pinnacle of modern ${category}. Engineered with our proprietary Quantum-Link technology, it delivers unparalleled performance and reliability. Its sleek, ergonomic design is not only visually stunning but also optimized for efficiency. Perfect for professionals and enthusiasts alike who demand the very best in the ${category} space. Elevate your workflow and unlock new possibilities with the ${productName}.`;
    }
}

const api = CommerceAPIService.getInstance();


/**
 * =========================================================================
 *  SECTION 5: STATE MANAGEMENT (CONTEXT & REDUCER)
 * =========================================================================
 * Manages the application's global state using React's Context API and
 * a useReducer hook for predictable state transitions.
 */

// Theme Context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

const ThemeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>('dark');
    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    useEffect(() => {
        document.body.className = theme;
    }, [theme]);

    const value = { theme, toggleTheme };

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// ... UI Components will be defined in the next section

/**
 * =========================================================================
 *  SECTION 6: UI COMPONENTS
 * =========================================================================
 * A collection of reusable and specific UI components that form the
 * building blocks of the commerce dashboard.
 */

const KpiCard: React.FC<{ title: string; value: string | number; icon: React.ReactElement; change?: string; changeType?: 'increase' | 'decrease' }> = ({ title, value, icon, change, changeType }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className={`p-4 rounded-lg shadow-md flex items-start justify-between ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
            <div>
                <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{title}</p>
                <p className="text-2xl font-bold">{typeof value === 'number' ? formatCurrency(value) : value}</p>
                {change && (
                    <p className={`text-xs mt-1 ${changeType === 'increase' ? 'text-green-500' : 'text-red-500'}`}>
                        {change} vs last month
                    </p>
                )}
            </div>
            <div className={`p-3 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                {React.cloneElement(icon, { className: `h-6 w-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}` })}
            </div>
        </div>
    );
};

const DashboardHeader: React.FC<{ title: string; onAction: () => void; actionLabel: string }> = ({ title, onAction, actionLabel }) => {
    const { theme, toggleTheme } = useTheme();
    return (
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">{title}</h1>
            <div className="flex items-center space-x-4">
                 <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700">
                    {theme === 'light' ? <FaMoon /> : <FaSun />}
                </button>
                <button onClick={onAction} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2">
                    <FaPlus />
                    <span>{actionLabel}</span>
                </button>
            </div>
        </div>
    );
};

const SalesChart: React.FC<{ data: MonthlySalesData[] }> = ({ data }) => {
    const { theme } = useTheme();
    return (
        <Card>
            <h3 className="text-lg font-semibold mb-4">Monthly Sales Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#4A5568' : '#E2E8F0'}/>
                    <XAxis dataKey="name" stroke={theme === 'dark' ? '#A0AEC0' : '#4A5568'}/>
                    <YAxis yAxisId="left" stroke={theme === 'dark' ? '#A0AEC0' : '#4A5568'} tickFormatter={(value) => `$${Number(value) / 1000}k`} />
                    <YAxis yAxisId="right" orientation="right" stroke={theme === 'dark' ? '#A0AEC0' : '#4A5568'} />
                    <Tooltip
                        contentStyle={{ backgroundColor: theme === 'dark' ? '#2D3748' : '#FFFFFF', border: '1px solid #4A5568' }}
                        labelStyle={{ color: theme === 'dark' ? '#FFFFFF' : '#000000' }}
                        formatter={(value, name) => [name === 'sales' || name === 'profit' ? formatCurrency(Number(value)) : value, capitalize(String(name))]}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="sales" fill="#4299E1" name="Sales"/>
                    <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#38B2AC" name="Orders" />
                </ComposedChart>
            </ResponsiveContainer>
        </Card>
    );
};

const AIInsightCard: React.FC<{ insight: AIInsight }> = ({ insight }) => {
    const severityColors = {
        info: 'blue',
        warning: 'yellow',
        critical: 'red',
    };
    const severityIcon = {
        info: <FaInfoCircle />,
        warning: <FaExclamationTriangle />,
        critical: <FaShieldAlt />,
    };

    return (
        <div className={`p-4 rounded-lg border-l-4 border-${severityColors[insight.severity]}-500 bg-gray-100 dark:bg-gray-800 shadow-sm`}>
            <div className="flex items-start">
                <div className={`mr-3 text-${severityColors[insight.severity]}-500 text-xl`}>{severityIcon[insight.severity]}</div>
                <div>
                    <h4 className="font-bold">{insight.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{insight.description}</p>
                    <div className="mt-3 p-3 bg-gray-200 dark:bg-gray-700 rounded-md">
                        <p className="text-sm font-semibold flex items-center">
                            <FaLightbulb className="mr-2 text-yellow-400" /> Recommendation
                        </p>
                        <p className="text-sm mt-1">{insight.recommendation}</p>
                    </div>
                     <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 text-right">{formatDate(insight.timestamp, { dateStyle: 'medium', timeStyle: 'short' })}</p>
                </div>
            </div>
        </div>
    );
};

const ProductModal: React.FC<{ product: Partial<Product> | null; onClose: () => void; onSave: (product: Product) => Promise<void>; }> = ({ product, onClose, onSave }) => {
    const [formData, setFormData] = useState<Partial<Product>>(product || {});
    const [isSaving, setIsSaving] = useState(false);
    const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
    const { theme } = useTheme();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isNumber = type === 'number';
        setFormData(prev => ({ ...prev, [name]: isNumber ? parseFloat(value) : value }));
    };

    const handleGenerateDescription = async () => {
        if (!formData.name || !formData.category) {
            alert("Please provide a product name and category first.");
            return;
        }
        setIsGeneratingDesc(true);
        try {
            const description = await api.generateAIDescription(formData.name, formData.category);
            setFormData(prev => ({ ...prev, description }));
        } catch (error) {
            console.error("Failed to generate description:", error);
            alert("Failed to generate description.");
        } finally {
            setIsGeneratingDesc(false);
        }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            // Basic validation
            if (!formData.name || !formData.price || !formData.category || !formData.stock) {
                alert("Please fill all required fields.");
                setIsSaving(false);
                return;
            }
            await onSave(formData as Product);
            onClose();
        } catch (error) {
            console.error("Failed to save product:", error);
            alert("Failed to save product.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className={`p-8 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">{product?.id ? 'Edit Product' : 'Add New Product'}</h2>
                    <button onClick={onClose}><FaTimes className="text-2xl" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input name="name" value={formData.name || ''} onChange={handleChange} placeholder="Product Name" className="w-full p-2 border rounded bg-gray-200 dark:bg-gray-700 border-gray-600" required />
                        <input name="sku" value={formData.sku || ''} onChange={handleChange} placeholder="SKU" className="w-full p-2 border rounded bg-gray-200 dark:bg-gray-700 border-gray-600" />
                    </div>
                     <div className="relative">
                        <textarea name="description" value={formData.description || ''} onChange={handleChange} placeholder="Description" rows={4} className="w-full p-2 border rounded bg-gray-200 dark:bg-gray-700 border-gray-600" />
                         <button type="button" onClick={handleGenerateDescription} disabled={isGeneratingDesc} className="absolute bottom-2 right-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold py-1 px-2 rounded flex items-center disabled:opacity-50">
                            {isGeneratingDesc ? <FaSpinner className="animate-spin mr-1" /> : <FaRobot className="mr-1" />}
                            {isGeneratingDesc ? 'Generating...' : 'AI Generate'}
                         </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input name="price" type="number" value={formData.price || ''} onChange={handleChange} placeholder="Price" className="w-full p-2 border rounded bg-gray-200 dark:bg-gray-700 border-gray-600" required />
                        <input name="cost" type="number" value={formData.cost || ''} onChange={handleChange} placeholder="Cost" className="w-full p-2 border rounded bg-gray-200 dark:bg-gray-700 border-gray-600" />
                        <input name="stock" type="number" value={formData.stock || ''} onChange={handleChange} placeholder="Stock" className="w-full p-2 border rounded bg-gray-200 dark:bg-gray-700 border-gray-600" required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <select name="category" value={formData.category || ''} onChange={handleChange} className="w-full p-2 border rounded bg-gray-200 dark:bg-gray-700 border-gray-600" required>
                            <option value="">Select Category</option>
                            {MOCK_DATA.categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                         <select name="isActive" value={String(formData.isActive ?? true)} onChange={(e) => setFormData(prev => ({...prev, isActive: e.target.value === 'true' }))} className="w-full p-2 border rounded bg-gray-200 dark:bg-gray-700 border-gray-600">
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>
                    </div>
                    <div className="flex justify-end space-x-4 mt-6">
                        <button type="button" onClick={onClose} className="py-2 px-4 rounded bg-gray-500 hover:bg-gray-600 text-white">Cancel</button>
                        <button type="submit" disabled={isSaving} className="py-2 px-4 rounded bg-blue-600 hover:bg-blue-700 text-white flex items-center disabled:opacity-50">
                             {isSaving ? <FaSpinner className="animate-spin mr-2" /> : <FaSave className="mr-2" />}
                            {isSaving ? 'Saving...' : 'Save Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const DataTable: React.FC<{ columns: any[]; data: any[]; onEdit?: (item: any) => void; onDelete?: (item: any) => void; }> = ({ columns, data, onEdit, onDelete }) => {
    const { theme } = useTheme();
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        {columns.map(col => <th key={col.key} scope="col" className="px-6 py-3">{col.header}</th>)}
                        {(onEdit || onDelete) && <th scope="col" className="px-6 py-3">Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {data.map(item => (
                        <tr key={item.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            {columns.map(col => (
                                <td key={`${item.id}-${col.key}`} className="px-6 py-4">
                                    {col.render ? col.render(item) : item[col.key]}
                                </td>
                            ))}
                            {(onEdit || onDelete) && (
                                <td className="px-6 py-4 space-x-2">
                                    {onEdit && <button onClick={() => onEdit(item)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline"><FaEdit /></button>}
                                    {onDelete && <button onClick={() => onDelete(item)} className="font-medium text-red-600 dark:text-red-500 hover:underline"><FaTrash /></button>}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


/**
 * =========================================================================
 *  SECTION 7: VIEW COMPONENTS
 * =========================================================================
 * These are the main page-level components for each tab of the dashboard.
 */

const DashboardView: React.FC<{ onAction: () => void; }> = ({ onAction }) => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [insights, setInsights] = useState<AIInsight[]>([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [dashboardData, aiInsights] = await Promise.all([
                    api.fetchDashboardData(),
                    api.fetchAIInsights(),
                ]);
                setData(dashboardData);
                setInsights(aiInsights);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) return <div className="flex justify-center items-center h-64"><FaSpinner className="animate-spin text-4xl text-blue-500" /></div>;
    if (!data) return <div className="text-center text-red-500">Failed to load dashboard data.</div>;

    return (
        <div className="space-y-6">
            <DashboardHeader title="Commerce Dashboard" onAction={onAction} actionLabel="Add New Product" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard title="Total Revenue" value={data.kpis.totalRevenue} icon={<FaDollarSign />} change="+5.2%" changeType="increase" />
                <KpiCard title="Total Orders" value={formatNumber(data.kpis.totalOrders)} icon={<FaShoppingCart />} change="+3.1%" changeType="increase" />
                <KpiCard title="Total Customers" value={formatNumber(data.kpis.totalCustomers)} icon={<FaUsers />} change="+1.5%" changeType="increase" />
                <KpiCard title="Avg. Order Value" value={data.kpis.avgOrderValue} icon={<FaChartBar />} change="-0.8%" changeType="decrease" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <SalesChart data={data.monthlySales} />
                </div>
                <div>
                    <Card>
                        <h3 className="text-lg font-semibold mb-4 flex items-center"><FaBrain className="mr-2" /> AI-Powered Insights</h3>
                        <div className="space-y-4">
                            {insights.map(insight => <AIInsightCard key={insight.id} insight={insight} />)}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

const ProductManagementView: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

    const loadProducts = useCallback(async () => {
        setLoading(true);
        try {
            const data = await api.fetchProducts();
            setProducts(data);
        } catch (error) {
            console.error("Failed to fetch products:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    const handleSaveProduct = async (product: Product) => {
        if (product.id) {
            await api.updateProduct(product.id, product);
        } else {
            await api.addProduct(product);
        }
        await loadProducts();
    };

    const handleDeleteProduct = async (product: Product) => {
        if (window.confirm(`Are you sure you want to delete ${product.name}?`)) {
            await api.deleteProduct(product.id);
            await loadProducts();
        }
    };

    const productColumns = [
        { key: 'name', header: 'Product Name', render: (p: Product) => (
            <div className="flex items-center">
                <img src={p.imageUrl} alt={p.name} className="w-10 h-10 rounded-md mr-4 object-cover" />
                <div>
                    <div className="font-medium text-gray-900 dark:text-white">{p.name}</div>
                    <div className="text-sm text-gray-500">{p.sku}</div>
                </div>
            </div>
        ) },
        { key: 'category', header: 'Category' },
        { key: 'price', header: 'Price', render: (p: Product) => formatCurrency(p.price) },
        { key: 'stock', header: 'Stock', render: (p: Product) => (
            <span className={p.stock < 10 ? 'text-red-500 font-bold' : ''}>{formatNumber(p.stock)}</span>
        ) },
        { key: 'isActive', header: 'Status', render: (p: Product) => (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${p.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                {p.isActive ? 'Active' : 'Inactive'}
            </span>
        ) },
    ];

    return (
        <div className="space-y-6">
             <DashboardHeader title="Product Management" onAction={() => setEditingProduct({})} actionLabel="Add New Product" />
            <Card>
                {loading ? <FaSpinner className="animate-spin text-2xl" /> : <DataTable columns={productColumns} data={products} onEdit={setEditingProduct} onDelete={handleDeleteProduct} />}
            </Card>
            {editingProduct && <ProductModal product={editingProduct} onClose={() => setEditingProduct(null)} onSave={handleSaveProduct} />}
        </div>
    );
};

const OrderManagementView: React.FC = () => {
    // ... Similar implementation to ProductManagementView with order data and columns
    return <Card><div className="p-8 text-center">Order Management View - Coming Soon!</div></Card>;
};
const CustomerManagementView: React.FC = () => {
    // ... Similar implementation to ProductManagementView with customer data and columns
    return <Card><div className="p-8 text-center">Customer Management View - Coming Soon!</div></Card>;
};


/**
 * =========================================================================
 *  SECTION 8: MAIN DEMOBANK COMMERCE VIEW COMPONENT
 * =========================================================================
 * This is the root component for the commerce dashboard. It orchestrates
 * state, renders the layout with tabs, and brings all other components together.
 */
type Tab = 'dashboard' | 'products' | 'orders' | 'customers' | 'settings';

const DemoBankCommerceView: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('dashboard');
    const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
    const { theme } = useTheme();

    const renderTabContent = () => {
        switch (activeTab) {
            case 'dashboard': return <DashboardView onAction={() => { setEditingProduct({}); setActiveTab('products'); }} />;
            case 'products': return <ProductManagementView />;
            case 'orders': return <OrderManagementView />;
            case 'customers': return <CustomerManagementView />;
            default: return <DashboardView onAction={() => { setEditingProduct({}); setActiveTab('products'); }} />;
        }
    };

    const TabButton: React.FC<{ tabId: Tab; icon: React.ReactElement; label: string; }> = ({ tabId, icon, label }) => (
        <button
            onClick={() => setActiveTab(tabId)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tabId
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
        >
            {icon}
            <span>{label}</span>
        </button>
    );

    return (
        <div className={`min-h-screen p-4 sm:p-6 lg:p-8 ${theme === 'dark' ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-800'}`}>
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <div className="flex space-x-2 border-b border-gray-300 dark:border-gray-700 pb-2">
                        <TabButton tabId="dashboard" icon={<FaChartBar />} label="Dashboard" />
                        <TabButton tabId="products" icon={<FaBox />} label="Products" />
                        <TabButton tabId="orders" icon={<FaShoppingCart />} label="Orders" />
                        <TabButton tabId="customers" icon={<FaUsers />} label="Customers" />
                        <TabButton tabId="settings" icon={<FaCog />} label="Settings" />
                    </div>
                </div>
                <main>
                    {renderTabContent()}
                </main>
            </div>
            {/* Editing modal needs to be accessible from Dashboard 'Add Product' button */}
            {activeTab === 'products' && editingProduct && <ProductModal product={editingProduct} onClose={() => setEditingProduct(null)} onSave={async () => { /* Logic is inside ProductManagementView */ }} />}
        </div>
    );
};

// The final export must wrap the main component in its providers.
const DemoBankCommerceViewWrapper: React.FC = () => {
    return (
        <ThemeProvider>
            <DemoBankCommerceView />
        </ThemeProvider>
    );
};

export default DemoBankCommerceViewWrapper;