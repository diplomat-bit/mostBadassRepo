// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/weaver_core/generativeInfra/iacGenerator.ts
================================================================================

```typescript
// weaver_core/generativeInfra/iacGenerator.ts

import { geminiService } from '../../features/geminiService'; // Assuming a central AI service

// --- Type Definitions ---

/**
 * Supported cloud providers for Infrastructure as Code generation.
 */
export enum IaCProvider {
    AWS = 'aws',
    GCP = 'gcp',
    AZURE = 'azure',
}

/**
 * Supported Infrastructure as Code (IaC) tools.
 */
export enum IaCTool {
    TERRAFORM = 'terraform',
    CLOUDFORMATION = 'cloudformation',
    PULUMI = 'pulumi',
    BICEP = 'bicep',
    ARM = 'arm',
}

/**
 * Represents a single component of the desired infrastructure.
 * This structured format helps the AI understand the specific requirements.
 */
export interface InfrastructureComponent {
    type: 'vpc' | 'subnet' | 'security_group' | 'compute' | 'database' | 'storage_bucket' | 'load_balancer' | 'auto_scaling_group' | 'kubernetes_cluster' | 'serverless_function' | 'cdn' | 'dns_zone' | 'iam_role' | 'message_queue';
    name: string;
    properties: { [key: string]: any };
}

/**
 * Defines the high-level requirements for generating an IaC script.
 */
export interface InfrastructureRequirements {
    provider: IaCProvider;
    tool: IaCTool;
    region: string;
    projectName: string;
    environment: 'development' | 'staging' | 'production';
    /** A natural language description of the overall goal. */
    description: string;
    /** A structured list of components for more precise generation. */
    components: InfrastructureComponent[];
}

/**
 * The result of an IaC generation operation.
 */
export interface IaCGenerationResult {
    success: boolean;
    /** The generated Infrastructure as Code script. */
    code: string;
    /** A dictionary of files if multiple files are generated (e.g., variables.tf). */
    files?: Record<string, string>;
    /** Informational messages or suggestions for the user. */
    warnings: string[];
    /** Errors that occurred during generation. */
    errors: string[];
    /** Metadata about the generation process, like tokens used. */
    metadata?: {
        aiModel: string;
        promptTokens?: number;
        completionTokens?: number;
        totalTokens?: number;
    };
}


// --- Prompt Engineering Constants & Templates ---

const BASE_SYSTEM_PROMPT = `
You are an elite DevOps Architect and Infrastructure as Code (IaC) specialist with decades of experience designing and deploying robust, scalable, and secure cloud infrastructure for Fortune 500 companies. Your task is to generate a complete, production-ready IaC script based on the user's requirements.

You must adhere to the following non-negotiable principles:

1.  **Security First**:
    *   Implement the principle of least privilege for all IAM roles and security group rules.
    *   Encrypt all data at rest and in transit.
    *   Never hardcode secrets, credentials, or sensitive data. Use placeholders and references to a secret management service (e.g., AWS Secrets Manager \`aws_secretsmanager_secret\`, Azure Key Vault \`azurerm_key_vault_secret\`, GCP Secret Manager \`google_secret_manager_secret_version\`).
    *   Disable public access to all resources (databases, storage buckets, etc.) by default, unless explicitly required and specified by the user.
    *   Use dedicated service accounts/roles for resources, avoiding default or overly permissive ones.

2.  **Modularity and Reusability**:
    *   For Terraform, structure the code into logical files (\`main.tf\`, \`variables.tf\`, \`outputs.tf\`, \`providers.tf\`). You MUST generate the content for each of these files.
    *   For complex requirements, suggest a modular structure, but generate the complete, self-contained code for this request.
    *   Use variables for all configurable parameters (e.g., region, instance types, CIDR blocks, environment names).

3.  **Production-Grade Quality**:
    *   Include comprehensive resource tagging for cost allocation and governance (e.g., 'Project', 'Environment', 'Owner', 'ManagedBy').
    *   Configure basic but essential monitoring and logging (e.g., AWS CloudWatch Alarms for CPU/Memory, GCP Monitoring, Azure Monitor).
    *   Define clear outputs for critical resource identifiers (e.g., load balancer DNS, database endpoint, public IP addresses).
    *   Ensure a state backend is configured (e.g., S3 for Terraform, Azure Storage Account). Provide a commented-out example configuration.
    *   Specify required provider versions to ensure deterministic behavior.

4.  **Clarity and Maintainability**:
    *   Add comments to explain complex logic, non-obvious configurations, or important security considerations.
    *   Use a consistent and clean naming convention for all resources. The convention should be \`\${var.project_name}-\${var.environment}-\${resource_name}\`.

5.  **Output Format**:
    *   You must generate the code in a JSON object format: \`{ "files": { "filename.ext": "file content", ... } }\`.
    *   Do NOT include any conversational text, explanations, or markdown formatting outside of the JSON object. The response MUST be a single, valid JSON object.
`;

const getTerraformAWSPrompt = (req: InfrastructureRequirements): string => `
Generate a set of Terraform files for AWS infrastructure.

**Project Details:**
*   Project Name: ${req.projectName}
*   Environment: ${req.environment}
*   AWS Region: ${req.region}

**High-Level Goal:**
${req.description}

**Structured Components:**
${JSON.stringify(req.components, null, 2)}

**Instructions:**
*   Use the 'aws' Terraform provider.
*   Create \`main.tf\`, \`variables.tf\`, \`outputs.tf\`, and \`providers.tf\`.
*   In \`providers.tf\`, configure the AWS provider with the specified region and include a commented-out S3 backend configuration for state management.
*   In \`variables.tf\`, define variables for all configurable values with sensible defaults. Include variables for project_name, environment, and aws_region.
*   In \`main.tf\`, define the resources as described.
*   In \`outputs.tf\`, export crucial resource attributes.
*   Follow all the principles outlined in the system prompt.
`;


const getCloudFormationPrompt = (req: InfrastructureRequirements): string => `
Generate a CloudFormation template in YAML format for AWS infrastructure.

**Project Details:**
*   Project Name: ${req.projectName}
*   Environment: ${req.environment}
*   AWS Region: ${req.region}

**High-Level Goal:**
${req.description}

**Structured Components:**
${JSON.stringify(req.components, null, 2)}

**Instructions:**
*   Generate a single, valid CloudFormation YAML template.
*   Use Parameters for all configurable values (e.g., ProjectName, Environment, InstanceType). Provide sensible defaults.
*   Use Mappings for environment-specific configurations where appropriate (e.g., AMIs per region).
*   Use Outputs to expose important resource identifiers.
*   Use standard CloudFormation resource types (e.g., 'AWS::EC2::Instance', 'AWS::RDS::DBInstance').
*   Follow all the principles outlined in the system prompt. The final output JSON should be \`{ "files": { "template.yaml": "..." } }\`.
`;

const getTerraformGCPPrompt = (req: InfrastructureRequirements): string => `
Generate a set of Terraform files for Google Cloud Platform (GCP) infrastructure.

**Project Details:**
*   Project Name: ${req.projectName}
*   Environment: ${req.environment}
*   GCP Region: ${req.region}

**High-Level Goal:**
${req.description}

**Structured Components:**
${JSON.stringify(req.components, null, 2)}

**Instructions:**
*   Use the 'google' Terraform provider.
*   Create \`main.tf\`, \`variables.tf\`, \`outputs.tf\`, and \`providers.tf\`.
*   In \`providers.tf\`, configure the Google provider with the specified region/project and include a commented-out GCS backend configuration.
*   In \`variables.tf\`, define variables for project_name, environment, gcp_region, and gcp_project_id.
*   In \`main.tf\`, define the resources. Use resource types like \`google_compute_instance\`, \`google_sql_database_instance\`, etc.
*   Follow all the principles outlined in the system prompt.
`;

const getTerraformAzurePrompt = (req: InfrastructureRequirements): string => `
Generate a set of Terraform files for Microsoft Azure infrastructure.

**Project Details:**
*   Project Name: ${req.projectName}
*   Environment: ${req.environment}
*   Azure Region: ${req.region}

**High-Level Goal:**
${req.description}

**Structured Components:**
${JSON.stringify(req.components, null, 2)}

**Instructions:**
*   Use the 'azurerm' Terraform provider.
*   Create \`main.tf\`, \`variables.tf\`, \`outputs.tf\`, and \`providers.tf\`.
*   In \`providers.tf\`, configure the Azure provider and include a commented-out Azure Storage backend configuration.
*   In \`variables.tf\`, define variables for project_name, environment, and location (for the Azure region).
*   In \`main.tf\`, define the resources. Start by creating a resource group for the project. Use resource types like \`azurerm_resource_group\`, \`azurerm_virtual_network\`, \`azurerm_linux_virtual_machine\`, etc.
*   Follow all the principles outlined in the system prompt.
`;


// --- Core Service Class ---

/**
 * A service for generating Infrastructure as Code scripts using AI.
 * This class orchestrates prompt generation, AI interaction, and result parsing.
 */
export class IaCGeneratorService {

    /**
     * Validates the incoming infrastructure requirements.
     * @param req - The infrastructure requirements object.
     * @returns An array of error messages. Empty if valid.
     */
    private validateRequirements(req: InfrastructureRequirements): string[] {
        const errors: string[] = [];
        if (!req.provider || !Object.values(IaCProvider).includes(req.provider)) {
            errors.push('A valid provider (aws, gcp, azure) is required.');
        }
        if (!req.tool || !Object.values(IaCTool).includes(req.tool)) {
            errors.push('A valid tool (terraform, cloudformation, etc.) is required.');
        }
        if (!req.region) {
            errors.push('A region/location is required.');
        }
        if (!req.projectName) {
            errors.push('A project name is required.');
        }
        if (!req.description && (!req.components || req.components.length === 0)) {
            errors.push('Either a natural language description or a list of components is required.');
        }
        if(req.provider === IaCProvider.AWS && req.tool === IaCTool.BICEP) {
             errors.push('Bicep is an Azure-specific tool and cannot be used with AWS.');
        }
        if(req.provider !== IaCProvider.AWS && req.tool === IaCTool.CLOUDFORMATION) {
             errors.push('CloudFormation is an AWS-specific tool.');
        }
        // Add more complex validation rules here
        return errors;
    }

    /**
     * Selects and builds the appropriate prompt for the AI model.
     * @param req - The infrastructure requirements object.
     * @returns The generated prompt string.
     * @throws {Error} if the provider/tool combination is not supported.
     */
    private buildPrompt(req: InfrastructureRequirements): string {
        switch (req.provider) {
            case IaCProvider.AWS:
                if (req.tool === IaCTool.TERRAFORM) return getTerraformAWSPrompt(req);
                if (req.tool === IaCTool.CLOUDFORMATION) return getCloudFormationPrompt(req);
                break;
            case IaCProvider.GCP:
                if (req.tool === IaCTool.TERRAFORM) return getTerraformGCPPrompt(req);
                break;
            case IaCProvider.AZURE:
                if (req.tool === IaCTool.TERRAFORM) return getTerraformAzurePrompt(req);
                // Can add Bicep/ARM prompt builders here
                break;
        }
        throw new Error(`Unsupported combination: Provider '${req.provider}' and Tool '${req.tool}'`);
    }

    /**
     * Parses the AI model's JSON response.
     * @param rawResponse - The raw string response from the AI.
     * @returns A parsed IaCGenerationResult object.
     */
    private parseAIResponse(rawResponse: string): Omit<IaCGenerationResult, 'errors' | 'warnings'> {
        try {
            // The AI might return the JSON wrapped in markdown, so we extract it.
            const jsonMatch = rawResponse.match(/```json\n([\s\S]*?)\n```/);
            const jsonString = jsonMatch ? jsonMatch[1] : rawResponse;
            
            const parsed = JSON.parse(jsonString);

            if (parsed.files && typeof parsed.files === 'object') {
                 // The main code can be considered the content of main.tf or the first file found.
                const firstFileName = Object.keys(parsed.files)[0] || '';
                const mainCode = parsed.files[firstFileName] || '';
                
                return {
                    success: true,
                    code: mainCode,
                    files: parsed.files,
                };
            }
            throw new Error("AI response did not contain a 'files' object.");
        } catch (error) {
            console.error("Failed to parse AI response:", error);
            // Return the raw response as code so the user can see what went wrong.
            return {
                success: false,
                code: `// Failed to parse AI response. Raw output:\n${rawResponse}`,
            };
        }
    }


    /**
     * Generates an Infrastructure as Code script based on high-level requirements.
     * This is the main public method of the service.
     * @param req - The high-level infrastructure requirements.
     * @returns A promise that resolves to an IaCGenerationResult object.
     */
    public async generate(req: InfrastructureRequirements): Promise<IaCGenerationResult> {
        const validationErrors = this.validateRequirements(req);
        if (validationErrors.length > 0) {
            return {
                success: false,
                code: '',
                errors: validationErrors,
                warnings: [],
            };
        }

        try {
            const userPrompt = this.buildPrompt(req);
            
            // This assumes a centralized Gemini service as seen in the project structure
            const aiResponse = await geminiService.generateContent({
                systemInstruction: BASE_SYSTEM_PROMPT,
                prompt: userPrompt,
                model: 'gemini-1.5-pro-latest', // Use a powerful model for this task
                responseMimeType: 'application/json'
            });

            if (!aiResponse.success || !aiResponse.text) {
                 throw new Error(aiResponse.error || 'AI service returned an empty response.');
            }

            const parsedResult = this.parseAIResponse(aiResponse.text);

            return {
                ...parsedResult,
                errors: parsedResult.success ? [] : ['Failed to parse AI response into the expected format.'],
                warnings: [], // Could add a post-processing step to find potential issues
                metadata: {
                    aiModel: 'gemini-1.5-pro-latest',
                    // Token counts would ideally come from the aiService response
                    promptTokens: undefined,
                    completionTokens: undefined,
                    totalTokens: aiResponse.usage?.totalTokens,
                }
            };

        } catch (error: any) {
            console.error('Error during IaC generation:', error);
            return {
                success: false,
                code: '',
                errors: [error.message || 'An unknown error occurred during AI generation.'],
                warnings: [],
            };
        }
    }
}

// Export a singleton instance for easy use throughout the application
export const iacGenerator = new IaCGeneratorService();
```