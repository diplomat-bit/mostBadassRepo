// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/types/models/platform/employee.ts
================================================================================

// types/models/platform/employee.ts
export interface Employee {
    id: string;
    name: string;
    department: 'Engineering' | 'Sales' | 'Marketing' | 'HR';
    role: string;
}