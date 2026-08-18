// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/weaver_core/generativeContent/marketingCampaignGenerator.ts
================================================================================

```typescript
import OpenAI from "openai";
import { v4 as uuidv4 } from 'uuid';

// Assuming you have your API key stored securely.  Consider using environment variables.
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
    console.warn("OPENAI_API_KEY is not set. Marketing campaign generation may be unavailable.");
}

const openai = new OpenAI({ apiKey });

interface CampaignElement {
    id: string;
    type: 'headline' | 'body' | 'imagePrompt' | 'callToAction' | 'platform' | 'targetAudience';
    content: string;
}

interface MarketingCampaign {
    id: string;
    name: string;
    elements: CampaignElement[];
    overallStrategy: string;
    targetMetrics: { [key: string]: string };
    budgetAllocation: { [key: string]: number }; // Platform: Percentage of budget
}


/**
 * Generates marketing campaign content based on provided context.
 */
export class MarketingCampaignGenerator {


    /**
     * Generates a complete marketing campaign.
     * @param businessDescription - A description of the business or product.
     * @param targetAudience - The target audience for the campaign.
     * @param campaignGoal - The primary goal of the campaign (e.g., increase sales, brand awareness).
     * @returns A promise that resolves with a MarketingCampaign object.
     */
    async generateCampaign(
        businessDescription: string,
        targetAudience: string,
        campaignGoal: string
    ): Promise<MarketingCampaign | null> {

        if (!openai.apiKey) {
            console.error("OpenAI API Key is missing or invalid. Please configure it.");
            return null;
        }

        const campaignName = `Campaign for ${businessDescription.substring(0, 20)}... aiming to ${campaignGoal}`;

        try {

            const prompt = `
            You are an expert marketing strategist tasked with creating a comprehensive marketing campaign.  Your goal is to generate engaging and effective marketing materials.

            Business Description: ${businessDescription}
            Target Audience: ${targetAudience}
            Campaign Goal: ${campaignGoal}

            Instructions:

            1.  Develop an overall marketing strategy that aligns with the campaign goal and target audience. Be concise and strategic, outlining the core approach.

            2.  Generate compelling marketing elements for the following categories. Each element should be distinct, creative, and tailored to the specific category:

                *   **Headline (3 variations):**  Catchy and attention-grabbing headlines that clearly communicate the value proposition.
                *   **Body Copy (2 variations):**  Detailed descriptions that expand on the headline and provide more information about the product/service.
                *   **Image Prompt (3 variations):** Detailed prompts for generating images that visually represent the campaign's message.  Be descriptive - include style, mood, and key elements.
                *   **Call to Action (3 variations):**  Clear and concise calls to action that encourage the target audience to take the desired action.
                *   **Platform (Recommended):** Specify the platforms where each content variation would perform best (e.g., Facebook, Instagram, LinkedIn, Email).
                *   **Target Audience Segment (Specific):** Define a more specific segment of the target audience for each content variation.

            3.  Suggest target metrics for the campaign. Provide specific, measurable, achievable, relevant, and time-bound (SMART) metrics to track the campaign's success. (e.g., Website Conversion Rate: Increase from 2% to 4% in 3 months)

            4.  Allocate a hypothetical budget across different platforms (e.g., Social Media, Search Engine Marketing, Email Marketing). Express allocations as percentages (totaling 100%). Justify each budget allocation.

            Output Format:

            Overall Strategy: [A concise description of the overall marketing strategy]

            Headline 1: [Headline text]
            Body Copy 1: [Body copy text]
            Image Prompt 1: [Image prompt text]
            Call to Action 1: [Call to action text]
            Platform: [Recommended platform]
            Target Audience Segment: [Specific audience segment]

            Headline 2: [Headline text]
            Body Copy 2: [Body copy text]
            Image Prompt 2: [Image prompt text]
            Call to Action 2: [Call to action text]
            Platform: [Recommended platform]
            Target Audience Segment: [Specific audience segment]

            ... and so on for all variations.

            Target Metrics:
            Website Conversion Rate: [SMART metric]
            Social Media Engagement: [SMART metric]
            ... etc.

            Budget Allocation:
            Social Media: [Percentage] - [Justification]
            Search Engine Marketing: [Percentage] - [Justification]
            ... etc.
            `;


            const completion = await openai.chat.completions.create({
                messages: [{ role: "user", content: prompt }],
                model: "gpt-4-turbo-preview", // Or another suitable model
            });

            const rawContent = completion.choices[0].message?.content;

            if (!rawContent) {
                console.warn("No content returned from OpenAI.");
                return null;
            }

            const parsedCampaign = this.parseCampaignContent(rawContent);

            if(!parsedCampaign){
                console.warn("Failed to parse marketing campaign content.");
                return null;
            }

            const campaignId = uuidv4();
            return {
                id: campaignId,
                name: campaignName,
                elements: parsedCampaign.elements,
                overallStrategy: parsedCampaign.overallStrategy,
                targetMetrics: parsedCampaign.targetMetrics,
                budgetAllocation: parsedCampaign.budgetAllocation
            };


        } catch (error) {
            console.error("Error generating marketing campaign:", error);
            return null;
        }
    }


    private parseCampaignContent(rawContent: string): {elements: CampaignElement[], overallStrategy: string, targetMetrics: {[key: string]: string}, budgetAllocation: {[key: string]: number}} | null {
        try {
            const elements: CampaignElement[] = [];
            let overallStrategy = '';
            const targetMetrics: { [key: string]: string } = {};
            const budgetAllocation: { [key: string]: number } = {};

            // Extract overall strategy
            const strategyMatch = rawContent.match(/Overall Strategy:\s*(.*?)(?=\n\n|\nTarget Metrics:)/s);
            if (strategyMatch) {
                overallStrategy = strategyMatch[1].trim();
            }

            // Split the content into sections for each element type
            const elementSections = rawContent.split(/(Headline \d+:|Body Copy \d+:|Image Prompt \d+:|Call to Action \d+:|Platform:|Target Audience Segment:)/).filter(Boolean);

            // Iterate through sections and extract element data
            for (let i = 0; i < elementSections.length; i += 2) {
                const elementTypeHeader = elementSections[i].trim();
                const elementContent = elementSections[i + 1]?.trim() || '';

                if (elementTypeHeader.startsWith('Headline')) {
                    elements.push({ id: uuidv4(), type: 'headline', content: elementContent });
                } else if (elementTypeHeader.startsWith('Body Copy')) {
                    elements.push({ id: uuidv4(), type: 'body', content: elementContent });
                } else if (elementTypeHeader.startsWith('Image Prompt')) {
                    elements.push({ id: uuidv4(), type: 'imagePrompt', content: elementContent });
                } else if (elementTypeHeader.startsWith('Call to Action')) {
                    elements.push({ id: uuidv4(), type: 'callToAction', content: elementContent });
                } else if (elementTypeHeader === 'Platform:') {
                    elements.push({ id: uuidv4(), type: 'platform', content: elementContent });
                } else if (elementTypeHeader === 'Target Audience Segment:') {
                     elements.push({ id: uuidv4(), type: 'targetAudience', content: elementContent });
                }
            }


            // Extract target metrics
             const metricsMatch = rawContent.match(/Target Metrics:\s*([\s\S]*?)(?=\n\n|\nBudget Allocation:)/);
            if (metricsMatch) {
                const metricsText = metricsMatch[1].trim();
                const metricsLines = metricsText.split('\n').filter(Boolean);
                metricsLines.forEach(line => {
                    const [metricName, metricValue] = line.split(':').map(s => s.trim());
                    if (metricName && metricValue) {
                        targetMetrics[metricName] = metricValue;
                    }
                });
            }



            // Extract budget allocation
            const budgetMatch = rawContent.match(/Budget Allocation:\s*([\s\S]*)/);
            if (budgetMatch) {
                const budgetText = budgetMatch[1].trim();
                const budgetLines = budgetText.split('\n').filter(Boolean);
                budgetLines.forEach(line => {
                    const [platform, allocation] = line.split(':').map(s => s.trim());
                    if (platform && allocation) {
                        const percentageMatch = allocation.match(/(\d+(\.\d+)?)%/);
                        if (percentageMatch) {
                            const percentage = parseFloat(percentageMatch[1]);
                            budgetAllocation[platform] = percentage;
                        }
                    }
                });
            }

            return { elements, overallStrategy, targetMetrics, budgetAllocation };

        } catch (error) {
            console.error("Error parsing campaign content:", error);
            return null;
        }
    }
}
```