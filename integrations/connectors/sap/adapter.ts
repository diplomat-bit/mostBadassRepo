// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/integrations/connectors/sap/adapter.ts
================================================================================

import axios from 'axios';
import {
    S4HanaSalesOrder,
    S4HanaCustomer,
    S4HanaMaterial,
    S4HanaInvoice,
    NormalizedSalesOrder,
    NormalizedCustomer,
    NormalizedMaterial,
    NormalizedInvoice,
} from './types'; // Assuming types.ts exists in the same directory or a shared types folder

const SAP_API_BASE_URL = process.env.SAP_API_BASE_URL || 'https://my3.sap.cloud.com/sap/opu/odata/sap/';
const SAP_CLIENT_ID = process.env.SAP_CLIENT_ID;
const SAP_CLIENT_SECRET = process.env.SAP_CLIENT_SECRET;
const SAP_TENANT_ID = process.env.SAP_TENANT_ID; // May be needed for some authentication flows

// Placeholder for OAuth token management. In a real-world scenario, this would involve
// a robust token refresh mechanism.
let oauthToken: string | null = null;
let tokenExpiration: Date | null = null;

async function getOAuthToken(): Promise<string> {
    if (oauthToken && tokenExpiration && tokenExpiration > new Date()) {
        return oauthToken;
    }

    try {
        const tokenEndpoint = `https://authentication.sap.cloud.com/oauth/token`; // Adjust if your token endpoint is different
        const tokenParams = new URLSearchParams();
        tokenParams.append('grant_type', 'client_credentials');
        tokenParams.append('client_id', SAP_CLIENT_ID!);
        tokenParams.append('client_secret', SAP_CLIENT_SECRET!);
        tokenParams.append('resource', `https://my3.sap.cloud.com`); // Adjust resource as needed

        const response = await axios.post(tokenEndpoint, tokenParams, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        oauthToken = response.data.access_token;
        tokenExpiration = new Date(Date.now() + response.data.expires_in * 1000);
        return oauthToken;
    } catch (error) {
        console.error('Error obtaining SAP OAuth token:', error);
        throw new Error('Failed to obtain SAP OAuth token.');
    }
}

async function fetchSapData<T>(endpoint: string): Promise<T[]> {
    try {
        const token = await getOAuthToken();
        const response = await axios.get<T>(`${SAP_API_BASE_URL}${endpoint}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Accept': 'application/json',
            },
            params: {
                $format: 'json',
                // Add any other necessary query parameters for pagination, filtering, etc.
            },
        });

        // The response structure might vary. Adjust based on the actual OData response.
        // This example assumes the data is directly in response.data or response.data.d.results
        if (response.data && (response.data as any).d && (response.data as any).d.results) {
            return (response.data as any).d.results as T[];
        } else if (Array.isArray(response.data)) {
            return response.data as T[];
        }
        // Handle cases where data might be nested differently
        return response.data as T[]; // Fallback, might need adjustment
    } catch (error) {
        console.error(`Error fetching SAP data from ${endpoint}:`, error);
        throw new Error(`Failed to fetch SAP data from ${endpoint}.`);
    }
}

export const getSalesOrders = async (startDate?: string, endDate?: string): Promise<NormalizedSalesOrder[]> => {
    // Example endpoint for Sales Orders. Replace with the actual OData service path for sales orders.
    // This might look like: 's4hanacloud/API_SALES_ORDER_SRV/A_SalesOrder'
    const salesOrderEndpoint = 's4hanacloud/API_SALES_ORDER_SRV/A_SalesOrder';
    try {
        const sapSalesOrders = await fetchSapData<S4HanaSalesOrder>(salesOrderEndpoint);

        // Normalize the data
        return sapSalesOrders.map((order): NormalizedSalesOrder => ({
            orderId: order.SalesOrder,
            orderDate: order.CreationDate,
            customer: {
                customerId: order.SoldToParty,
                // Add more customer details if available from this endpoint or fetched separately
            },
            totalAmount: parseFloat(order.TransactionCurrencyAmount || '0'), // Ensure amount is parsed correctly
            currency: order.TransactionCurrency,
            status: order.OverallSDProcessStatus,
            items: [], // Sales order items would typically be fetched from a separate OData entity
            // Add any other relevant fields
        }));
    } catch (error) {
        console.error('Error normalizing SAP sales orders:', error);
        throw error;
    }
};

export const getCustomers = async (customerIds?: string[]): Promise<NormalizedCustomer[]> => {
    const customerEndpoint = 's4hanacloud/API_BUSINESS_PARTNER_SRV/A_BusinessPartner'; // Example endpoint
    try {
        const sapCustomers = await fetchSapData<S4HanaCustomer>(customerEndpoint);

        // Filter by customerIds if provided
        let filteredCustomers = sapCustomers;
        if (customerIds && customerIds.length > 0) {
            filteredCustomers = sapCustomers.filter(customer =>
                customerIds.includes(customer.BusinessPartner)
            );
        }

        // Normalize the data
        return filteredCustomers.map((customer): NormalizedCustomer => ({
            customerId: customer.BusinessPartner,
            name: customer.BusinessPartnerFullName,
            email: customer.BusinessPartnerEmailAddress,
            phone: customer.BusinessPartnerPhoneNumber,
            address: {
                street: customer.StreetName,
                city: customer.CityName,
                postalCode: customer.PostalCode,
                country: customer.Country,
            },
            // Add any other relevant fields
        }));
    } catch (error) {
        console.error('Error normalizing SAP customers:', error);
        throw error;
    }
};

export const getMaterials = async (materialIds?: string[]): Promise<NormalizedMaterial[]> => {
    const materialEndpoint = 's4hanacloud/API_PRODUCT_SRV/A_Product'; // Example endpoint
    try {
        const sapMaterials = await fetchSapData<S4HanaMaterial>(materialEndpoint);

        // Filter by materialIds if provided
        let filteredMaterials = sapMaterials;
        if (materialIds && materialIds.length > 0) {
            filteredMaterials = sapMaterials.filter(material =>
                materialIds.includes(material.Product)
            );
        }

        // Normalize the data
        return filteredMaterials.map((material): NormalizedMaterial => ({
            materialId: material.Product,
            name: material.ProductFullName,
            description: material.ProductDescription,
            unitOfMeasure: material.BaseUnitOfMeasure,
            // Add any other relevant fields
        }));
    } catch (error) {
        console.error('Error normalizing SAP materials:', error);
        throw error;
    }
};

export const getInvoices = async (startDate?: string, endDate?: string): Promise<NormalizedInvoice[]> => {
    // Example endpoint for Customer Invoices. Replace with the actual OData service path.
    // This might look like: 's4hanacloud/API_CUSTOMER_INVOICE_SRV/A_CustomerInvoice'
    const invoiceEndpoint = 's4hanacloud/API_CUSTOMER_INVOICE_SRV/A_CustomerInvoice';
    try {
        const sapInvoices = await fetchSapData<S4HanaInvoice>(invoiceEndpoint);

        // Basic date filtering (assuming dates are in a comparable string format, e.g., YYYY-MM-DD)
        let filteredInvoices = sapInvoices;
        if (startDate) {
            filteredInvoices = filteredInvoices.filter(invoice => invoice.InvoiceDate >= startDate);
        }
        if (endDate) {
            filteredInvoices = filteredInvoices.filter(invoice => invoice.InvoiceDate <= endDate);
        }

        // Normalize the data
        return filteredInvoices.map((invoice): NormalizedInvoice => ({
            invoiceId: invoice.CustomerInvoice,
            invoiceDate: invoice.InvoiceDate,
            customer: {
                customerId: invoice.BillToParty,
                // Add more customer details if available
            },
            totalAmount: parseFloat(invoice.BillingDocumentTotalAmount || '0'),
            currency: invoice.BillingDocumentTotalAmountCurrency,
            status: invoice.BillingDocumentStatus,
            items: [], // Invoice items would typically be fetched from a separate OData entity
            // Add any other relevant fields
        }));
    } catch (error) {
        console.error('Error normalizing SAP invoices:', error);
        throw error;
    }
};

// Add more functions for other SAP entities as needed (e.g., Products, Orders, etc.)
// Each function should:
// 1. Define the OData endpoint for the specific SAP entity.
// 2. Call `fetchSapData` to retrieve raw data.
// 3. Map the raw SAP data to your application's normalized data structure.
// 4. Handle potential errors at each step.

export const sapAdapter = {
    getSalesOrders,
    getCustomers,
    getMaterials,
    getInvoices,
    // Export other adapter functions here
};
