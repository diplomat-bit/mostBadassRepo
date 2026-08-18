// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/src/services/corporate-service/src/services/compliance.service.ts
================================================================================

import { Injectable, Inject, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Cron, CronExpression } from '@nestjs/schedule';

// --- Constants for Dependency Injection ---
export const SANCTION_SCREENING_PROVIDERS = 'SANCTION_SCREENING_PROVIDERS';
export const FRAUD_RULE_REPOSITORY = 'FRAUD_RULE_REPOSITORY';
export const AUDIT_LOG_REPOSITORY = 'AUDIT_LOG_REPOSITORY';
export const COMPANY_REPOSITORY = 'COMPANY_REPOSITORY';

// --- Interfaces and Types ---

// Sanction Screening
export type ScreenableEntityType = 'individual' | 'company' | 'crypto_address';

export interface ScreenableEntity {
    id: string;
    type: ScreenableEntityType;
    data: {
        name?: string;
        dob?: string; // YYYY-MM-DD
        country?: string; // ISO 3166-1 alpha-2
        address?: string;
        walletAddress?: string;
        asset?: string; // e.g., 'BTC', 'ETH'
    };
}

export interface ScreeningResult {
    provider: string;
    status: 'clear' | 'match' | 'pending_review' | 'error';
    riskScore?: number; // 0-100
    matches: Array<{
        matchId: string;
        reason: string;
        details: Record<string, any>;
    }>;
    rawResponse?: any;
}

export interface AggregatedScreeningResult {
    entityId: string;
    overallStatus: 'clear' | 'match' | 'pending_review';
    highestRiskScore: number;
    providerResults: ScreeningResult[];
    timestamp: Date;
}

export interface ISanctionScreeningProvider {
    readonly name: string;
    supports(entityType: ScreenableEntityType): boolean;
    screen(entity: ScreenableEntity): Promise<ScreeningResult>;
}

// Fraud Rules
export interface FraudRule {
    id: string;
    name: string;
    description: string;
    // Using a simplified condition format. A real implementation might use a DSL or JSON-based rule engine.
    // Example: "transaction.amount > 10000 && transaction.country === 'NG'"
    condition: string;
    action: 'flag' | 'block' | 'alert' | 'allow';
    priority: number; // Lower number = higher priority
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export type CreateFraudRuleDto = Omit<FraudRule, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateFraudRuleDto = Partial<CreateFraudRuleDto>;

export interface FraudEvaluationResult {
    transactionId: string;
    riskScore: number; // 0-100
    triggeredRules: Pick<FraudRule, 'id' | 'name' | 'action' | 'priority'>[];
    finalAction: 'allow' | 'flag' | 'block';
}

// Compliance Audits
export interface AuditLog {
    id: string;
    companyId: string;
    timestamp: Date;
    status: 'passed' | 'failed' | 'requires_review';
    summary: string;
    details: Array<{
        checkName: string;
        status: 'passed' | 'failed' | 'not_applicable';
        message: string;
        data?: any;
    }>;
}

// --- Mock Repository Interfaces (to be implemented in data layer) ---

export interface IFraudRuleRepository {
    create(dto: CreateFraudRuleDto): Promise<FraudRule>;
    findById(id: string): Promise<FraudRule | null>;
    findAllActive(): Promise<FraudRule[]>;
    update(id: string, dto: UpdateFraudRuleDto): Promise<FraudRule>;
    delete(id: string): Promise<void>;
}

export interface IAuditLogRepository {
    create(log: Omit<AuditLog, 'id'>): Promise<AuditLog>;
    findByCompanyId(companyId: string, limit: number): Promise<AuditLog[]>;
}

export interface ICompanyRepository {
    // A real implementation would have more methods
    findById(id: string): Promise<{ id: string; name: string; directors: ScreenableEntity[] } | null>;
    findAllIds(): Promise<string[]>;
}


// --- Mock Sanction Screening Providers (for demonstration) ---

@Injectable()
export class ComplyAdvantageProvider implements ISanctionScreeningProvider {
    readonly name = 'ComplyAdvantage';

    supports(entityType: ScreenableEntityType): boolean {
        return entityType === 'individual' || entityType === 'company';
    }

    async screen(entity: ScreenableEntity): Promise<ScreeningResult> {
        Logger.log(`Screening ${entity.type} ${entity.id} with ComplyAdvantage`, 'ComplyAdvantageProvider');
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 300));

        if (entity.data.name?.toLowerCase().includes('sanctioned')) {
            return {
                provider: this.name,
                status: 'match',
                riskScore: 95,
                matches: [{
                    matchId: `ca-${uuidv4()}`,
                    reason: 'Name match on OFAC sanctions list.',
                    details: { name: entity.data.name, list: 'OFAC' }
                }],
            };
        }

        return {
            provider: this.name,
            status: 'clear',
            riskScore: 5,
            matches: [],
        };
    }
}

@Injectable()
export class ChainalysisProvider implements ISanctionScreeningProvider {
    readonly name = 'Chainalysis';

    supports(entityType: ScreenableEntityType): boolean {
        return entityType === 'crypto_address';
    }

    async screen(entity: ScreenableEntity): Promise<ScreeningResult> {
        Logger.log(`Screening crypto address ${entity.data.walletAddress} with Chainalysis`, 'ChainalysisProvider');
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 400));

        if (entity.data.walletAddress?.startsWith('0xbad')) {
            return {
                provider: this.name,
                status: 'match',
                riskScore: 100,
                matches: [{
                    matchId: `chain-${uuidv4()}`,
                    reason: 'Address associated with known illicit activity.',
                    details: { address: entity.data.walletAddress, category: 'Darknet Market' }
                }],
            };
        }

        return {
            provider: this.name,
            status: 'clear',
            riskScore: 10,
            matches: [],
        };
    }
}


// --- Main Compliance Service ---

@Injectable()
export class ComplianceService {
    private readonly logger = new Logger(ComplianceService.name);

    constructor(
        @Inject(SANCTION_SCREENING_PROVIDERS)
        private readonly screeningProviders: ISanctionScreeningProvider[],
        @Inject(FRAUD_RULE_REPOSITORY)
        private readonly fraudRuleRepository: IFraudRuleRepository,
        @Inject(AUDIT_LOG_REPOSITORY)
        private readonly auditLogRepository: IAuditLogRepository,
        @Inject(COMPANY_REPOSITORY)
        private readonly companyRepository: ICompanyRepository,
    ) {
        this.logger.log(`Initialized with ${screeningProviders.length} sanction screening providers.`);
    }

    // --- Sanction Screening Methods ---

    /**
     * Screens an entity (individual, company, or crypto address) against all relevant sanction screening providers.
     * @param entity The entity to screen.
     * @returns An aggregated result from all applicable providers.
     */
    async screenEntity(entity: ScreenableEntity): Promise<AggregatedScreeningResult> {
        const applicableProviders = this.screeningProviders.filter(p => p.supports(entity.type));

        if (applicableProviders.length === 0) {
            this.logger.warn(`No sanction screening provider found for entity type: ${entity.type}`);
            return {
                entityId: entity.id,
                overallStatus: 'clear',
                highestRiskScore: 0,
                providerResults: [],
                timestamp: new Date(),
            };
        }

        const screeningPromises = applicableProviders.map(provider =>
            provider.screen(entity).catch(error => {
                this.logger.error(`Screening failed for provider ${provider.name}`, error.stack);
                return {
                    provider: provider.name,
                    status: 'error',
                    matches: [],
                    rawResponse: { error: error.message },
                } as ScreeningResult;
            })
        );

        const providerResults = await Promise.all(screeningPromises);

        return this.aggregateScreeningResults(entity.id, providerResults);
    }

    private aggregateScreeningResults(entityId: string, results: ScreeningResult[]): AggregatedScreeningResult {
        let overallStatus: 'clear' | 'match' | 'pending_review' = 'clear';
        let highestRiskScore = 0;

        for (const result of results) {
            if (result.status === 'match') {
                overallStatus = 'match';
            } else if (result.status === 'pending_review' && overallStatus !== 'match') {
                overallStatus = 'pending_review';
            }

            if (result.riskScore && result.riskScore > highestRiskScore) {
                highestRiskScore = result.riskScore;
            }
        }

        return {
            entityId,
            overallStatus,
            highestRiskScore,
            providerResults: results,
            timestamp: new Date(),
        };
    }

    // --- Fraud Rule Management ---

    async createFraudRule(dto: CreateFraudRuleDto): Promise<FraudRule> {
        this.logger.log(`Creating new fraud rule: ${dto.name}`);
        return this.fraudRuleRepository.create(dto);
    }

    async getFraudRule(id: string): Promise<FraudRule> {
        const rule = await this.fraudRuleRepository.findById(id);
        if (!rule) {
            throw new NotFoundException(`Fraud rule with ID "${id}" not found.`);
        }
        return rule;
    }

    async updateFraudRule(id: string, dto: UpdateFraudRuleDto): Promise<FraudRule> {
        this.logger.log(`Updating fraud rule: ${id}`);
        await this.getFraudRule(id); // Ensure it exists
        return this.fraudRuleRepository.update(id, dto);
    }

    async deleteFraudRule(id: string): Promise<void> {
        this.logger.log(`Deleting fraud rule: ${id}`);
        await this.getFraudRule(id); // Ensure it exists
        return this.fraudRuleRepository.delete(id);
    }

    /**
     * Evaluates a transaction against all active fraud rules.
     * @param transaction The transaction data to evaluate.
     * @returns A fraud evaluation result with a risk score and triggered rules.
     */
    async evaluateTransaction(transaction: Record<string, any> & { id: string }): Promise<FraudEvaluationResult> {
        const activeRules = await this.fraudRuleRepository.findAllActive();
        const triggeredRules: FraudRule[] = [];

        // This is a simplified rule engine. A real implementation would use a library
        // like `json-rules-engine` for complex, safe evaluations.
        for (const rule of activeRules) {
            try {
                // DANGER: Using `eval` or `new Function` is unsafe. This is for demonstration only.
                // A production system MUST use a sandboxed rule engine.
                const isTriggered = new Function('transaction', `return ${rule.condition}`)(transaction);
                if (isTriggered) {
                    triggeredRules.push(rule);
                }
            } catch (error) {
                this.logger.error(`Error evaluating fraud rule ${rule.id}: ${error.message}`);
            }
        }

        // Sort by priority to determine the final action
        triggeredRules.sort((a, b) => a.priority - b.priority);

        const finalAction = triggeredRules.find(r => r.action === 'block')?.action
            || triggeredRules.find(r => r.action === 'flag')?.action
            || 'allow';

        // Simple risk score calculation
        const riskScore = Math.min(100, triggeredRules.reduce((acc, rule) => acc + (100 / (rule.priority || 10)), 0));

        return {
            transactionId: transaction.id,
            riskScore: Math.round(riskScore),
            triggeredRules: triggeredRules.map(({ id, name, action, priority }) => ({ id, name, action, priority })),
            finalAction,
        };
    }

    // --- Automated Compliance Audits ---

    /**
     * Runs a comprehensive, automated compliance audit for a given company.
     * @param companyId The ID of the company to audit.
     * @returns The result of the audit, which is also persisted.
     */
    async runAutomatedAudit(companyId: string): Promise<AuditLog> {
        this.logger.log(`Starting automated compliance audit for company: ${companyId}`);
        const company = await this.companyRepository.findById(companyId);
        if (!company) {
            throw new NotFoundException(`Company with ID "${companyId}" not found for audit.`);
        }

        const auditDetails: AuditLog['details'] = [];
        let overallStatus: AuditLog['status'] = 'passed';

        // 1. Re-screen company and directors
        const entitiesToScreen: ScreenableEntity[] = [
            { id: company.id, type: 'company', data: { name: company.name } },
            ...company.directors,
        ];

        for (const entity of entitiesToScreen) {
            const screeningResult = await this.screenEntity(entity);
            const check = {
                checkName: `Sanction Screening: ${entity.type} - ${entity.data.name || entity.id}`,
                status: screeningResult.overallStatus === 'clear' ? 'passed' : 'failed',
                message: `Overall status: ${screeningResult.overallStatus}. Highest risk: ${screeningResult.highestRiskScore}.`,
                data: screeningResult,
            };
            auditDetails.push(check);
            if (check.status === 'failed') overallStatus = 'failed';
        }

        // 2. Placeholder for document verification check
        // In a real system, this would check for required documents in a document service.
        auditDetails.push({
            checkName: 'Document Verification (KYB)',
            status: 'passed', // Mocked result
            message: 'All required corporate documents are present and valid.',
        });

        // 3. Placeholder for transaction monitoring summary
        // This would analyze recent transactions for suspicious patterns.
        auditDetails.push({
            checkName: 'Transaction Monitoring Analysis',
            status: 'passed', // Mocked result
            message: 'No unusual transaction patterns detected in the last 90 days.',
        });

        if (overallStatus === 'failed') {
            // A failed check might just require review instead of being an outright failure.
            // Business logic would determine this.
            overallStatus = 'requires_review';
        }

        const auditLog: Omit<AuditLog, 'id'> = {
            companyId,
            timestamp: new Date(),
            status: overallStatus,
            summary: `Audit completed with status: ${overallStatus}. ${auditDetails.filter(d => d.status !== 'passed').length} checks require attention.`,
            details: auditDetails,
        };

        const savedLog = await this.auditLogRepository.create(auditLog);
        this.logger.log(`Audit for company ${companyId} completed and logged with ID ${savedLog.id}`);
        return savedLog;
    }

    async getAuditHistory(companyId: string, limit = 10): Promise<AuditLog[]> {
        return this.auditLogRepository.findByCompanyId(companyId, limit);
    }

    /**
     * Scheduled task to run audits on all companies.
     * Runs daily at 2 AM server time.
     */
    @Cron(CronExpression.EVERY_DAY_AT_2AM)
    async handlePeriodicAudits() {
        this.logger.log('Starting scheduled periodic compliance audits for all companies.');
        const companyIds = await this.companyRepository.findAllIds();
        this.logger.log(`Found ${companyIds.length} companies to audit.`);

        for (const companyId of companyIds) {
            try {
                await this.runAutomatedAudit(companyId);
            } catch (error) {
                this.logger.error(`Failed to run scheduled audit for company ${companyId}`, error.stack);
            }
        }
        this.logger.log('Finished scheduled periodic compliance audits.');
    }
}