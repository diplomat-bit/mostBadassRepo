// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/types/models/corporate/invoice.ts
================================================================================

// types/models/corporate/invoice.ts
import type { InvoiceStatus } from './invoice-status';

export interface Invoice {
    id: string;
    invoiceNumber: string;
    counterpartyName: string;
    dueDate: string;
    amount: number;
    status: InvoiceStatus;
}