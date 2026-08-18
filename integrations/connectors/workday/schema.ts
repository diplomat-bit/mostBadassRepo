// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/integrations/connectors/workday/schema.ts
================================================================================

import { z } from 'zod';

// --- Workday API Schema Definitions ---

// Basic schema for an Employee
const WorkdayEmployeeSchema = z.object({
    employeeId: z.string().nullable(),
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
    middleName: z.string().nullable(),
    displayName: z.string().nullable(),
    preferredName: z.string().nullable(),
    legalName: z.string().nullable(),
    gender: z.string().nullable(),
    dateOfBirth: z.string().nullable(), // ISO 8601 format
    email: z.string().nullable(),
    personalEmail: z.string().nullable(),
    workEmail: z.string().nullable(),
    phoneNumber: z.string().nullable(),
    mobilePhoneNumber: z.string().nullable(),
    workPhoneNumber: z.string().nullable(),
    country: z.string().nullable(),
    locale: z.string().nullable(),
    timeZone: z.string().nullable(),
    // Add more employee-specific fields as needed, e.g., address, marital status, nationality
});

// Basic schema for a Job Profile
const WorkdayJobProfileSchema = z.object({
    jobProfileId: z.string().nullable(),
    jobProfileName: z.string().nullable(),
    jobProfileDescription: z.string().nullable(),
    jobFamily: z.string().nullable(),
    jobLevel: z.string().nullable(),
    // Add more job profile-specific fields
});

// Basic schema for an Organization
const WorkdayOrganizationSchema = z.object({
    organizationId: z.string().nullable(),
    organizationName: z.string().nullable(),
    organizationType: z.string().nullable(),
    supervisoryOrganizationId: z.string().nullable(),
    supervisoryOrganizationName: z.string().nullable(),
    // Add more organization-specific fields
});

// Basic schema for a Position
const WorkdayPositionSchema = z.object({
    positionId: z.string().nullable(),
    positionTitle: z.string().nullable(),
    filledStatus: z.string().nullable(), // e.g., "Filled", "Unfilled"
    organizationId: z.string().nullable(),
    supervisoryOrganizationId: z.string().nullable(),
    jobProfileId: z.string().nullable(),
    // Add more position-specific fields
});

// Basic schema for a Worker (Employee, Contractor, etc.)
const WorkdayWorkerSchema = z.object({
    workerId: z.string().nullable(),
    workerType: z.string().nullable(), // e.g., "Employee", "Contingent Worker"
    personId: z.string().nullable(),
    employeeRecordId: z.string().nullable(),
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
    displayName: z.string().nullable(),
    workEmail: z.string().nullable(),
    primaryEmail: z.string().nullable(),
    // Consider adding a nested Employee or Contractor object if detailed data is always present
});

// Schema for a specific Employment Instance
const WorkdayEmploymentInstanceSchema = z.object({
    employmentInstanceId: z.string().nullable(),
    workerId: z.string().nullable(),
    legalEmployerId: z.string().nullable(),
    legalEmployerName: z.string().nullable(),
    positionId: z.string().nullable(),
    jobProfileId: z.string().nullable(),
    organizationId: z.string().nullable(),
    managerWorkerId: z.string().nullable(),
    hireDate: z.string().nullable(), // ISO 8601 format
    terminationDate: z.string().nullable(), // ISO 8601 format
    employeeStatus: z.string().nullable(), // e.g., "Active", "Terminated"
    workLocationId: z.string().nullable(),
    workLocationName: z.string().nullable(),
    // Add more employment-specific fields
});

// Schema for a specific Compensation Instance
const WorkdayCompensationInstanceSchema = z.object({
    compensationInstanceId: z.string().nullable(),
    workerId: z.string().nullable(),
    effectiveDate: z.string().nullable(), // ISO 8601 format
    basePayRate: z.object({
        amount: z.number().nullable(),
        currency: z.string().nullable(),
    }).nullable(),
    payGrade: z.string().nullable(),
    payRange: z.string().nullable(),
    // Add more compensation-specific fields (e.g., bonus, equity)
});

// Schema for a specific Period Schedule (e.g., Pay Period)
const WorkdayPeriodScheduleSchema = z.object({
    periodScheduleId: z.string().nullable(),
    periodScheduleName: z.string().nullable(),
    payPeriodLength: z.string().nullable(), // e.g., "Bi-Weekly", "Monthly"
    // Add more period schedule details
});

// Schema for a single Pay Component
const WorkdayPayComponentSchema = z.object({
    payComponentId: z.string().nullable(),
    payComponentName: z.string().nullable(),
    payComponentType: z.string().nullable(), // e.g., "Base Salary", "Bonus", "Allowance"
    amount: z.number().nullable(),
    currency: z.string().nullable(),
    frequency: z.string().nullable(), // e.g., "Hourly", "Annual"
});

// Schema for an Employee's Overall Compensation Details
const WorkdayEmployeeCompensationSchema = z.object({
    workerId: z.string().nullable(),
    periodSchedule: WorkdayPeriodScheduleSchema.nullable(),
    payComponents: z.array(WorkdayPayComponentSchema).nullable(),
});

// --- Internal Data Model Schemas ---

// Schema for a simplified Employee object in our system
export const InternalEmployeeSchema = z.object({
    id: z.string().optional(), // Internal unique identifier
    workdayEmployeeId: z.string().nullable(),
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
    displayName: z.string().nullable(),
    email: z.string().nullable(),
    personalEmail: z.string().nullable(),
    phoneNumber: z.string().nullable(),
    country: z.string().nullable(),
    dateOfBirth: z.date().nullable(),
    gender: z.string().nullable(),
    // Add other relevant fields for internal use
});

// Schema for a simplified Job object
export const InternalJobSchema = z.object({
    id: z.string().optional(), // Internal unique identifier
    workdayJobProfileId: z.string().nullable(),
    title: z.string().nullable(),
    description: z.string().nullable(),
    jobFamily: z.string().nullable(),
    level: z.string().nullable(),
});

// Schema for a simplified Organization object
export const InternalOrganizationSchema = z.object({
    id: z.string().optional(), // Internal unique identifier
    workdayOrganizationId: z.string().nullable(),
    name: z.string().nullable(),
    type: z.string().nullable(),
    parentOrganizationId: z.string().nullable(), // ID of the supervisory organization
    parentOrganizationName: z.string().nullable(),
});

// Schema for a simplified Position object
export const InternalPositionSchema = z.object({
    id: z.string().optional(), // Internal unique identifier
    workdayPositionId: z.string().nullable(),
    title: z.string().nullable(),
    status: z.string().nullable(), // e.g., "filled", "unfilled"
    workdayOrganizationId: z.string().nullable(),
    workdaySupervisoryOrganizationId: z.string().nullable(),
    workdayJobProfileId: z.string().nullable(),
});

// Schema for a simplified Employment record
export const InternalEmploymentSchema = z.object({
    id: z.string().optional(), // Internal unique identifier
    workdayEmploymentInstanceId: z.string().nullable(),
    employeeId: z.string().nullable(), // Foreign key to InternalEmployeeSchema
    workdayWorkerId: z.string().nullable(),
    workdayLegalEmployerId: z.string().nullable(),
    legalEmployerName: z.string().nullable(),
    workdayPositionId: z.string().nullable(),
    workdayJobProfileId: z.string().nullable(),
    workdayOrganizationId: z.string().nullable(),
    managerEmployeeId: z.string().nullable(), // Foreign key to InternalEmployeeSchema
    hireDate: z.date().nullable(),
    terminationDate: z.date().nullable(),
    status: z.string().nullable(), // e.g., "active", "terminated"
    workLocationName: z.string().nullable(),
});

// Schema for a simplified Compensation record
export const InternalCompensationSchema = z.object({
    id: z.string().optional(), // Internal unique identifier
    workdayCompensationInstanceId: z.string().nullable(),
    employeeId: z.string().nullable(), // Foreign key to InternalEmployeeSchema
    effectiveDate: z.date().nullable(),
    baseSalaryAmount: z.number().nullable(),
    baseSalaryCurrency: z.string().nullable(),
    payGrade: z.string().nullable(),
    payRange: z.string().nullable(),
    // Add other compensation components as needed
});

// Schema for a combined Employee Data Transfer Object (DTO)
export const EmployeeDataDTO = z.object({
    employee: InternalEmployeeSchema,
    job: InternalJobSchema.nullable(),
    organization: InternalOrganizationSchema.nullable(),
    position: InternalPositionSchema.nullable(),
    employment: InternalEmploymentSchema.nullable(),
    compensation: InternalCompensationSchema.nullable(),
});

// --- Data Transformation Logic ---

/**
 * Transforms Workday API employee data into our internal Employee schema.
 * This is a simplified example; a real implementation would involve more complex mapping
 * and potentially handling of multiple records or sub-resources.
 *
 * @param workdayData - Raw data object from Workday API (typically a single employee record or a collection).
 * @returns A transformed object conforming to InternalEmployeeSchema or null if essential data is missing.
 */
export const transformWorkdayEmployeeToInternal = (
    workdayData: z.infer<typeof WorkdayEmployeeSchema>
): z.infer<typeof InternalEmployeeSchema> | null => {
    // Basic validation: Ensure essential fields are present
    if (!workdayData.employeeId || !workdayData.firstName || !workdayData.lastName) {
        console.warn("Skipping Workday employee due to missing essential data (employeeId, firstName, lastName).");
        return null;
    }

    try {
        const parsedDateOfBirth = workdayData.dateOfBirth ? new Date(workdayData.dateOfBirth) : null;
        if (workdayData.dateOfBirth && isNaN(parsedDateOfBirth.getTime())) {
            console.warn(`Invalid dateOfBirth format for employee ${workdayData.employeeId}: ${workdayData.dateOfBirth}`);
            // Decide if this should be a critical error or just logged and nullified
            // parsedDateOfBirth = null;
        }

        return {
            workdayEmployeeId: workdayData.employeeId,
            firstName: workdayData.firstName,
            lastName: workdayData.lastName,
            displayName: workdayData.displayName || `${workdayData.firstName} ${workdayData.lastName}`,
            email: workdayData.workEmail || workdayData.email,
            personalEmail: workdayData.personalEmail,
            phoneNumber: workdayData.phoneNumber || workdayData.mobilePhoneNumber,
            country: workdayData.country,
            dateOfBirth: parsedDateOfBirth,
            gender: workdayData.gender,
        };
    } catch (error) {
        console.error(`Error transforming Workday employee data for ID ${workdayData.employeeId}:`, error);
        return null; // Return null or throw an error based on desired error handling
    }
};

/**
 * Transforms Workday API job profile data into our internal Job schema.
 *
 * @param workdayData - Raw data object from Workday API for a job profile.
 * @returns A transformed object conforming to InternalJobSchema or null if essential data is missing.
 */
export const transformWorkdayJobProfileToInternal = (
    workdayData: z.infer<typeof WorkdayJobProfileSchema>
): z.infer<typeof InternalJobSchema> | null => {
    if (!workdayData.jobProfileId) {
        console.warn("Skipping Workday job profile due to missing jobProfileId.");
        return null;
    }

    return {
        workdayJobProfileId: workdayData.jobProfileId,
        title: workdayData.jobProfileName,
        description: workdayData.jobProfileDescription,
        jobFamily: workdayData.jobFamily,
        level: workdayData.jobLevel,
    };
};

/**
 * Transforms Workday API organization data into our internal Organization schema.
 *
 * @param workdayData - Raw data object from Workday API for an organization.
 * @returns A transformed object conforming to InternalOrganizationSchema or null if essential data is missing.
 */
export const transformWorkdayOrganizationToInternal = (
    workdayData: z.infer<typeof WorkdayOrganizationSchema>
): z.infer<typeof InternalOrganizationSchema> | null => {
    if (!workdayData.organizationId) {
        console.warn("Skipping Workday organization due to missing organizationId.");
        return null;
    }

    return {
        workdayOrganizationId: workdayData.organizationId,
        name: workdayData.organizationName,
        type: workdayData.organizationType,
        parentOrganizationId: workdayData.supervisoryOrganizationId,
        parentOrganizationName: workdayData.supervisoryOrganizationName,
    };
};

/**
 * Transforms Workday API position data into our internal Position schema.
 *
 * @param workdayData - Raw data object from Workday API for a position.
 * @returns A transformed object conforming to InternalPositionSchema or null if essential data is missing.
 */
export const transformWorkdayPositionToInternal = (
    workdayData: z.infer<typeof WorkdayPositionSchema>
): z.infer<typeof InternalPositionSchema> | null => {
    if (!workdayData.positionId) {
        console.warn("Skipping Workday position due to missing positionId.");
        return null;
    }

    return {
        workdayPositionId: workdayData.positionId,
        title: workdayData.positionTitle,
        status: workdayData.filledStatus,
        workdayOrganizationId: workdayData.organizationId,
        workdaySupervisoryOrganizationId: workdayData.supervisoryOrganizationId,
        workdayJobProfileId: workdayData.jobProfileId,
    };
};

/**
 * Transforms Workday API employment instance data into our internal Employment schema.
 *
 * @param workdayData - Raw data object from Workday API for an employment instance.
 * @returns A transformed object conforming to InternalEmploymentSchema or null if essential data is missing.
 */
export const transformWorkdayEmploymentInstanceToInternal = (
    workdayData: z.infer<typeof WorkdayEmploymentInstanceSchema>
): z.infer<typeof InternalEmploymentSchema> | null => {
    if (!workdayData.employmentInstanceId || !workdayData.workerId) {
        console.warn("Skipping Workday employment instance due to missing essential data (employmentInstanceId, workerId).");
        return null;
    }

    try {
        const parsedHireDate = workdayData.hireDate ? new Date(workdayData.hireDate) : null;
        const parsedTerminationDate = workdayData.terminationDate ? new Date(workdayData.terminationDate) : null;

        // Validate dates if they exist
        if (workdayData.hireDate && isNaN(parsedHireDate.getTime())) {
            console.warn(`Invalid hireDate format for employment instance ${workdayData.employmentInstanceId}: ${workdayData.hireDate}`);
            // parsedHireDate = null;
        }
        if (workdayData.terminationDate && isNaN(parsedTerminationDate.getTime())) {
            console.warn(`Invalid terminationDate format for employment instance ${workdayData.employmentInstanceId}: ${workdayData.terminationDate}`);
            // parsedTerminationDate = null;
        }

        return {
            workdayEmploymentInstanceId: workdayData.employmentInstanceId,
            employeeId: null, // This will be populated by a lookup service or during a merge process
            workdayWorkerId: workdayData.workerId,
            workdayLegalEmployerId: workdayData.legalEmployerId,
            legalEmployerName: workdayData.legalEmployerName,
            workdayPositionId: workdayData.positionId,
            workdayJobProfileId: workdayData.jobProfileId,
            workdayOrganizationId: workdayData.organizationId,
            managerEmployeeId: null, // This will be populated by a lookup service or during a merge process
            hireDate: parsedHireDate,
            terminationDate: parsedTerminationDate,
            status: workdayData.employeeStatus,
            workLocationName: workdayData.workLocationName,
        };
    } catch (error) {
        console.error(`Error transforming Workday employment instance data for ID ${workdayData.employmentInstanceId}:`, error);
        return null;
    }
};

/**
 * Transforms Workday API compensation instance data into our internal Compensation schema.
 *
 * @param workdayData - Raw data object from Workday API for a compensation instance.
 * @returns A transformed object conforming to InternalCompensationSchema or null if essential data is missing.
 */
export const transformWorkdayCompensationInstanceToInternal = (
    workdayData: z.infer<typeof WorkdayCompensationInstanceSchema>
): z.infer<typeof InternalCompensationSchema> | null => {
    if (!workdayData.compensationInstanceId || !workdayData.workerId) {
        console.warn("Skipping Workday compensation instance due to missing essential data (compensationInstanceId, workerId).");
        return null;
    }

    try {
        const parsedEffectiveDate = workdayData.effectiveDate ? new Date(workdayData.effectiveDate) : null;
        if (workdayData.effectiveDate && isNaN(parsedEffectiveDate.getTime())) {
            console.warn(`Invalid effectiveDate format for compensation instance ${workdayData.compensationInstanceId}: ${workdayData.effectiveDate}`);
            // parsedEffectiveDate = null;
        }

        // Assuming basePayRate is the primary compensation element for simplicity
        const basePay = workdayData.basePayRate;

        return {
            workdayCompensationInstanceId: workdayData.compensationInstanceId,
            employeeId: null, // This will be populated by a lookup service or during a merge process
            effectiveDate: parsedEffectiveDate,
            baseSalaryAmount: basePay?.amount ?? null,
            baseSalaryCurrency: basePay?.currency ?? null,
            payGrade: workdayData.payGrade,
            payRange: workdayData.payRange,
        };
    } catch (error) {
        console.error(`Error transforming Workday compensation instance data for ID ${workdayData.compensationInstanceId}:`, error);
        return null;
    }
};

/**
 * Transforms Workday API worker data into our internal Worker schema (or a simplified version).
 * This can be used for initial employee identification or fetching basic worker details.
 *
 * @param workdayData - Raw data object from Workday API for a worker.
 * @returns A transformed object conforming to a simplified InternalWorkerSchema or null.
 */
export const transformWorkdayWorkerToInternal = (
    workdayData: z.infer<typeof WorkdayWorkerSchema>
): z.infer<typeof InternalEmployeeSchema> | null => { // Reusing InternalEmployeeSchema for simplicity
    if (!workdayData.workerId || !workdayData.personId) {
        console.warn("Skipping Workday worker due to missing essential data (workerId, personId).");
        return null;
    }

    // For a worker, we might not have all the details of an employee directly.
    // This transformation focuses on identifying information.
    return {
        workdayEmployeeId: workdayData.employeeRecordId || workdayData.workerId, // Use employeeRecordId if available, otherwise workerId
        firstName: workdayData.firstName,
        lastName: workdayData.lastName,
        displayName: workdayData.displayName,
        email: workdayData.workEmail || workdayData.primaryEmail,
        // Other fields like personalEmail, phoneNumber, country, dateOfBirth, gender might not be directly available here
        // and would need to be fetched from the Employee endpoint or other related Workday resources.
        personalEmail: null,
        phoneNumber: null,
        country: null,
        dateOfBirth: null,
        gender: null,
    };
};


/**
 * Higher-level transformation function to combine multiple Workday data points into a single EmployeeDataDTO.
 * This function would typically be called after fetching related data from Workday for a single employee.
 *
 * @param employeeData - WorkdayEmployeeSchema object.
 * @param jobData - WorkdayJobProfileSchema object (optional).
 * @param orgData - WorkdayOrganizationSchema object (optional).
 * @param posData - WorkdayPositionSchema object (optional).
 * @param employmentData - WorkdayEmploymentInstanceSchema object (optional).
 * @param compensationData - WorkdayCompensationInstanceSchema object (optional).
 * @returns A combined EmployeeDataDTO object.
 */
export const createEmployeeDataDTO = (
    employeeData: z.infer<typeof WorkdayEmployeeSchema>,
    jobData?: z.infer<typeof WorkdayJobProfileSchema> | null,
    orgData?: z.infer<typeof WorkdayOrganizationSchema> | null,
    posData?: z.infer<typeof WorkdayPositionSchema> | null,
    employmentData?: z.infer<typeof WorkdayEmploymentInstanceSchema> | null,
    compensationData?: z.infer<typeof WorkdayCompensationInstanceSchema> | null
): z.infer<typeof EmployeeDataDTO> => {

    const internalEmployee = transformWorkdayEmployeeToInternal(employeeData);
    const internalJob = jobData ? transformWorkdayJobProfileToInternal(jobData) : null;
    const internalOrganization = orgData ? transformWorkdayOrganizationToInternal(orgData) : null;
    const internalPosition = posData ? transformWorkdayPositionToInternal(posData) : null;
    const internalEmployment = employmentData ? transformWorkdayEmploymentInstanceToInternal(employmentData) : null;
    const internalCompensation = compensationData ? transformWorkdayCompensationInstanceToInternal(compensationData) : null;

    // Post-processing to link IDs if necessary (e.g., employeeId, managerEmployeeId)
    // This would typically involve a service that can look up other transformed entities.
    // For example:
    // if (internalEmployment && internalEmployee) {
    //     internalEmployment.employeeId = internalEmployee.id; // Assuming internalEmployee has been assigned an ID
    // }
    // if (internalEmployment && internalPosition) {
    //     internalEmployment.workdayPositionId = internalPosition.id; // Assuming internalPosition has been assigned an ID
    // }
    // ... and so on for other relationships.

    return {
        employee: internalEmployee ?? { workdayEmployeeId: employeeData.employeeId }, // Ensure at least a basic employee object exists
        job: internalJob,
        organization: internalOrganization,
        position: internalPosition,
        employment: internalEmployment,
        compensation: internalCompensation,
    };
};

// --- Example Usage (for demonstration purposes, typically this would be in a service layer) ---

/*
// Assume you have fetched data from Workday API endpoints
const sampleWorkdayEmployee = {
    employeeId: "12345",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    dateOfBirth: "1990-05-15T00:00:00",
    country: "USA",
    workEmail: "john.doe.work@company.com",
    gender: "Male",
};

const sampleWorkdayJobProfile = {
    jobProfileId: "JP001",
    jobProfileName: "Software Engineer",
    jobFamily: "Technology",
};

const sampleWorkdayOrganization = {
    organizationId: "ORG789",
    organizationName: "Engineering Department",
    organizationType: "Cost Center",
    supervisoryOrganizationId: "SUPERORG123",
    supervisoryOrganizationName: "Technology Division",
};

const sampleWorkdayPosition = {
    positionId: "POS987",
    positionTitle: "Senior Software Engineer",
    filledStatus: "Filled",
    organizationId: "ORG789",
    supervisoryOrganizationId: "SUPERORG123",
    jobProfileId: "JP001",
};

const sampleWorkdayEmploymentInstance = {
    employmentInstanceId: "EI001",
    workerId: "WKR567",
    legalEmployerId: "LEGAL01",
    legalEmployerName: "Example Corp",
    positionId: "POS987",
    jobProfileId: "JP001",
    organizationId: "ORG789",
    managerWorkerId: "WKR001",
    hireDate: "2020-01-10T00:00:00",
    employeeStatus: "Active",
    workLocationName: "New York Office",
};

const sampleWorkdayCompensationInstance = {
    compensationInstanceId: "CI001",
    workerId: "WKR567",
    effectiveDate: "2023-01-01T00:00:00",
    basePayRate: { amount: 120000, currency: "USD" },
    payGrade: "G10",
    payRange: "110000-130000",
};

const employeeDTO = createEmployeeDataDTO(
    sampleWorkdayEmployee,
    sampleWorkdayJobProfile,
    sampleWorkdayOrganization,
    sampleWorkdayPosition,
    sampleWorkdayEmploymentInstance,
    sampleWorkdayCompensationInstance
);

console.log(JSON.stringify(employeeDTO, null, 2));

// Example with missing optional data
const employeeDTO_partial = createEmployeeDataDTO(
    sampleWorkdayEmployee,
    null, // No job data
    sampleWorkdayOrganization
);

console.log("\nPartial DTO:");
console.log(JSON.stringify(employeeDTO_partial, null, 2));

// Example of invalid date transformation
const sampleWorkdayEmployeeInvalidDate = {
    ...sampleWorkdayEmployee,
    dateOfBirth: "invalid-date-format",
};
const employeeDTO_invalidDate = createEmployeeDataDTO(sampleWorkdayEmployeeInvalidDate);
console.log("\nDTO with invalid date:");
console.log(JSON.stringify(employeeDTO_invalidDate, null, 2));
*/

export type WorkdayEmployee = z.infer<typeof WorkdayEmployeeSchema>;
export type WorkdayJobProfile = z.infer<typeof WorkdayJobProfileSchema>;
export type WorkdayOrganization = z.infer<typeof WorkdayOrganizationSchema>;
export type WorkdayPosition = z.infer<typeof WorkdayPositionSchema>;
export type WorkdayWorker = z.infer<typeof WorkdayWorkerSchema>;
export type WorkdayEmploymentInstance = z.infer<typeof WorkdayEmploymentInstanceSchema>;
export type WorkdayCompensationInstance = z.infer<typeof WorkdayCompensationInstanceSchema>;
export type WorkdayPeriodSchedule = z.infer<typeof WorkdayPeriodScheduleSchema>;
export type WorkdayPayComponent = z.infer<typeof WorkdayPayComponentSchema>;
export type WorkdayEmployeeCompensation = z.infer<typeof WorkdayEmployeeCompensationSchema>;

export type InternalEmployee = z.infer<typeof InternalEmployeeSchema>;
export type InternalJob = z.infer<typeof InternalJobSchema>;
export type InternalOrganization = z.infer<typeof InternalOrganizationSchema>;
export type InternalPosition = z.infer<typeof InternalPositionSchema>;
export type InternalEmployment = z.infer<typeof InternalEmploymentSchema>;
export type InternalCompensation = z.infer<typeof InternalCompensationSchema>;
export type EmployeeDataDTO = z.infer<typeof EmployeeDataDTO>;
```