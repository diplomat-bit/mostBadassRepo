// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/synapse_os_core/knowledgeGraph/ontologistAgent.ts
================================================================================

```typescript
// synapse_os_core/knowledgeGraph/ontologistAgent.ts

// ============================================================================
// == Imports
// ============================================================================
import Graph from 'graphology';
import { v4 as uuidv4 } from 'uuid';
import axios, { AxiosInstance } from 'axios';
import { Pool, PoolClient } from 'pg'; // For a hypothetical PostgreSQL data source
import fs from 'fs/promises';
import path from 'path';

// ============================================================================
// == Constants and Configuration
// ============================================================================

const DEFAULT_GRAPH_PERSISTENCE_PATH = './knowledge_graph.json';
const LOG_LEVELS = {
    DEBUG: 1,
    INFO: 2,
    WARN: 3,
    ERROR: 4,
};

const CURRENT_LOG_LEVEL = LOG_LEVELS.INFO;

// ============================================================================
// == Utility Classes and Functions
// ============================================================================

/**
 * A simple logger for observing agent activities.
 */
class AgentLogger {
    private context: string;

    constructor(context: string) {
        this.context = context;
    }

    private log(level: keyof typeof LOG_LEVELS, message: string, data?: any) {
        if (LOG_LEVELS[level] >= CURRENT_LOG_LEVEL) {
            const timestamp = new Date().toISOString();
            console.log(
                JSON.stringify({
                    timestamp,
                    level,
                    context: this.context,
                    message,
                    ...data,
                })
            );
        }
    }

    debug(message: string, data?: any) {
        this.log('DEBUG', message, data);
    }

    info(message: string, data?: any) {
        this.log('INFO', message, data);
    }

    warn(message: string, data?: any) {
        this.log('WARN', message, data);
    }

    error(message: string, error?: Error | any, data?: any) {
        const errorInfo = error instanceof Error ? { error: error.message, stack: error.stack } : { error };
        this.log('ERROR', message, { ...errorInfo, ...data });
    }
}

/**
 * Generates a consistent hash-based ID for an entity to aid in deduplication.
 * @param entityData - The core attributes of the entity.
 * @returns A string hash.
 */
function generateEntityId(entityData: { type: string; label: string; [key: string]: any }): string {
    // In a real system, this would be a more robust hashing algorithm (e.g., SHA-256)
    // and would normalize the input string.
    const key = `${entityData.type.toLowerCase()}:${entityData.label.toLowerCase().replace(/\s+/g, '')}`;
    return Buffer.from(key).toString('base64');
}


// ============================================================================
// == Core Type Definitions
// ============================================================================

/**
 * Defines the structure for attributes of a node in the knowledge graph.
 */
export interface GraphNodeAttributes {
    id: string; // A unique, stable identifier for the entity.
    label: string; // The human-readable name of the entity.
    type: string; // The ontological type (e.g., 'Company', 'Person', 'Product').
    sources: Array<{ sourceId: string; timestamp: string; confidence: number }>;
    metadata: Record<string, any>; // All other properties of the entity.
    createdAt: string;
    updatedAt: string;
}

/**
 * Defines the structure for attributes of an edge in the knowledge graph.
 */
export interface GraphEdgeAttributes {
    id: string; // Unique ID for the relationship instance.
    label: string; // The type of relationship (e.g., 'WORKS_AT', 'ACQUIRED', 'COMPETES_WITH').
    sourceId: string; // The ID of the data source that asserted this relationship.
    confidence: number; // A score indicating the certainty of this relationship.
    metadata: Record<string, any>; // Properties of the relationship (e.g., start/end dates).
    createdAt: string;
}

/**
 * A standardized representation of an entity extracted from a data source.
 */
export interface ExtractedEntity {
    canonicalId?: string; // Pre-calculated stable ID if possible.
    label: string;
    type: string;
    properties: Record<string, any>;
    confidence: number;
}

/**
 * A standardized representation of a relationship extracted from a data source.
 */
export interface ExtractedRelationship {
    sourceEntityLabel: string;
    sourceEntityType: string;
    targetEntityLabel: string;
    targetEntityType: string;
    relationshipType: string;
    properties: Record<string, any>;
    confidence: number;
}

/**
 * Defines the ontology, specifying allowed node and edge types and their properties.
 */
export interface Ontology {
    nodeTypes: Record<string, { properties: Record<string, string> }>; // e.g., 'Company': { properties: { name: 'string', revenue: 'number' } }
    edgeTypes: Record<string, { properties: Record<string, string> }>; // e.g., 'WORKS_AT': { properties: { role: 'string' } }
}

// ============================================================================
// == Service Interfaces
// ============================================================================

/**
 * Interface for a data source connector. Each connector is responsible for
 * fetching data from a specific source (API, DB, file system, etc.).
 */
export interface IDataSourceConnector {
    readonly id: string;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    fetchData(options?: { lastRun?: Date }): AsyncGenerator<any, void, undefined>;
    getSchema(): Promise<Partial<Ontology>>;
}

/**
 * Interface for a Natural Language Processing service. This service is responsible
 * for extracting structured knowledge (entities and relationships) from raw data.
 */
export interface INLPService {
    extractKnowledge(data: any, context?: string): Promise<{ entities: ExtractedEntity[]; relationships: ExtractedRelationship[] }>;
}


// ============================================================================
// == Concrete Service Implementations (Examples)
// ============================================================================

/**
 * An NLP Service that uses a hypothetical Gemini/OpenAI proxy for knowledge extraction.
 */
export class GeminiOpenAINLPService implements INLPService {
    private apiClient: AxiosInstance;
    private logger = new AgentLogger('GeminiOpenAINLPService');

    constructor(apiKey: string, baseURL: string = 'https://api.gemini-openai-proxy.com/v1') {
        if (!apiKey) {
            throw new Error('API key for Gemini/OpenAI NLP service is required.');
        }
        this.apiClient = axios.create({
            baseURL,
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
        });
    }

    async extractKnowledge(data: any, context?: string): Promise<{ entities: ExtractedEntity[]; relationships: ExtractedRelationship[] }> {
        const prompt = this.constructPrompt(data, context);
        this.logger.debug('Sending data for knowledge extraction', { promptLength: prompt.length });

        try {
            // In a real application, this would be a call to the actual AI service.
            // We simulate the call and response here for demonstration purposes.
            // const response = await this.apiClient.post('/knowledge-extraction', { prompt });
            // return response.data;

            const simulatedResponse = this.simulateAIResponse(data);
            this.logger.info('Successfully extracted knowledge from data chunk.');
            return Promise.resolve(simulatedResponse);

        } catch (error) {
            this.logger.error('Failed to extract knowledge from AI service', error);
            throw new Error('AI-powered knowledge extraction failed.');
        }
    }

    private constructPrompt(data: any, context?: string): string {
        const dataString = typeof data === 'string' ? data : JSON.stringify(data, null, 2);

        return `
            Analyze the following data chunk and extract all entities and their relationships.
            The context for this data is: ${context || 'General Business Information'}.

            **Instructions:**
            1.  Identify entities of types such as 'Company', 'Person', 'Product', 'Location', 'MarketEvent'.
            2.  For each entity, extract its properties (e.g., for a Company, find its revenue, number of employees, headquarters location).
            3.  Identify relationships between these entities (e.g., 'WORKS_AT', 'ACQUIRED', 'COMPETES_WITH', 'LOCATED_IN').
            4.  Assign a confidence score from 0.0 to 1.0 for each extracted entity and relationship.
            5.  Format the output as a single JSON object with two keys: "entities" and "relationships".

            **Example Output Format:**
            {
              "entities": [
                { "label": "InnovateCorp", "type": "Company", "properties": { "revenue": "1B USD" }, "confidence": 0.98 },
                { "label": "John Doe", "type": "Person", "properties": { "title": "CEO" }, "confidence": 0.95 }
              ],
              "relationships": [
                { "sourceEntityLabel": "John Doe", "sourceEntityType": "Person", "targetEntityLabel": "InnovateCorp", "targetEntityType": "Company", "relationshipType": "CEO_OF", "properties": {}, "confidence": 0.99 }
              ]
            }

            **Data to Analyze:**
            ---
            ${dataString}
            ---
        `;
    }

    private simulateAIResponse(data: any): { entities: ExtractedEntity[]; relationships: ExtractedRelationship[] } {
        // This is a very basic simulation. A real AI would perform complex NLP.
        const entities: ExtractedEntity[] = [];
        const relationships: ExtractedRelationship[] = [];

        if (data.companyName) {
            entities.push({
                label: data.companyName,
                type: 'Company',
                properties: { ticker: data.ticker, industry: data.industry, marketCap: data.marketCap },
                confidence: 0.95,
            });
        }
        if (data.ceo) {
            entities.push({
                label: data.ceo.name,
                type: 'Person',
                properties: { title: 'CEO', age: data.ceo.age },
                confidence: 0.92,
            });
            relationships.push({
                sourceEntityLabel: data.ceo.name,
                sourceEntityType: 'Person',
                targetEntityLabel: data.companyName,
                targetEntityType: 'Company',
                relationshipType: 'CEO_OF',
                properties: { startDate: data.ceo.startDate },
                confidence: 0.98
            });
        }
        if (data.headquarters) {
            entities.push({
                label: data.headquarters,
                type: 'Location',
                properties: {},
                confidence: 0.99
            });
            relationships.push({
                sourceEntityLabel: data.companyName,
                sourceEntityType: 'Company',
                targetEntityLabel: data.headquarters,
                targetEntityType: 'Location',
                relationshipType: 'LOCATED_IN',
                properties: {},
                confidence: 1.0
            });
        }
        // Simulate extraction from unstructured text
        if (typeof data === 'string' && data.includes('acquisition')) {
             entities.push({ label: 'TechGiant Inc.', type: 'Company', properties: {}, confidence: 0.88 });
             entities.push({ label: 'StartUp Innovations', type: 'Company', properties: {}, confidence: 0.85 });
             relationships.push({
                 sourceEntityLabel: 'TechGiant Inc.',
                 sourceEntityType: 'Company',
                 targetEntityLabel: 'StartUp Innovations',
                 targetEntityType: 'Company',
                 relationshipType: 'ACQUIRED',
                 properties: { announcedOn: '2023-10-26' },
                 confidence: 0.91
             });
        }


        return { entities, relationships };
    }
}


/**
 * A data source connector for a public REST API (e.g., a stock market data provider).
 */
export class PublicApiDataSource implements IDataSourceConnector {
    readonly id: string = 'PublicMarketDataAPI';
    private apiClient: AxiosInstance;
    private logger = new AgentLogger(this.id);
    private companiesToTrack: string[] = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'];

    constructor(apiKey: string) {
        // Using a public, free API for demonstration
        this.apiClient = axios.create({
            baseURL: 'https://financialmodelingprep.com/api/v3',
            params: { apikey: apiKey }
        });
    }

    async connect(): Promise<void> {
        this.logger.info('Connecting to Public Market Data API.');
        try {
            // Test connection by fetching a simple endpoint
            await this.apiClient.get('/profile/AAPL');
            this.logger.info('Connection successful.');
        } catch (error) {
            this.logger.error('Failed to connect to API.', error);
            throw new Error('PublicApiDataSource connection failed.');
        }
    }

    async disconnect(): Promise<void> {
        this.logger.info('Disconnecting from Public Market Data API.');
        // For HTTP APIs, there's often no explicit disconnect
        return Promise.resolve();
    }

    async *fetchData(options?: { lastRun?: Date }): AsyncGenerator<any, void, undefined> {
        this.logger.info('Starting data fetch cycle.', { since: options?.lastRun?.toISOString() });
        for (const ticker of this.companiesToTrack) {
            try {
                this.logger.debug('Fetching profile data for ticker', { ticker });
                const response = await this.apiClient.get(`/profile/${ticker}`);
                if (response.data && response.data.length > 0) {
                    const profile = response.data[0];
                    // Reformat to a more NLP-friendly structure
                    const formattedData = {
                        companyName: profile.companyName,
                        ticker: profile.symbol,
                        industry: profile.industry,
                        website: profile.website,
                        description: profile.description,
                        ceo: { name: profile.ceo, age: null, startDate: null }, // Assuming API doesn't provide these
                        marketCap: profile.mktCap,
                        headquarters: `${profile.city}, ${profile.state}`,
                    };
                    yield formattedData;
                }
            } catch (error) {
                this.logger.error('Failed to fetch data for ticker', error, { ticker });
            }
        }
    }

    async getSchema(): Promise<Partial<Ontology>> {
        return {
            nodeTypes: {
                'Company': { properties: { name: 'string', ticker: 'string', industry: 'string', marketCap: 'number' } },
                'Person': { properties: { name: 'string', title: 'string' } },
                'Location': { properties: { address: 'string' } },
            },
            edgeTypes: {
                'CEO_OF': { properties: {} },
                'LOCATED_IN': { properties: {} },
            }
        };
    }
}

/**
 * A data source connector for a PostgreSQL database.
 */
export class PostgresDataSource implements IDataSourceConnector {
    readonly id: string = 'CorporateCRM_DB';
    private pool: Pool;
    private client: PoolClient | null = null;
    private logger = new AgentLogger(this.id);

    constructor(connectionString: string) {
        this.pool = new Pool({ connectionString });
    }

    async connect(): Promise<void> {
        this.logger.info('Connecting to PostgreSQL database.');
        try {
            this.client = await this.pool.connect();
            this.logger.info('Database connection successful.');
        } catch (error) {
            this.logger.error('Failed to connect to PostgreSQL database.', error);
            throw error;
        }
    }

    async disconnect(): Promise<void> {
        if (this.client) {
            this.client.release();
            this.logger.info('Database connection released.');
        }
        await this.pool.end();
        this.logger.info('Database pool ended.');
    }

    async *fetchData(options?: { lastRun?: Date }): AsyncGenerator<any, void, undefined> {
        if (!this.client) {
            throw new Error('Database is not connected.');
        }
        const lastRunCondition = options?.lastRun ? `WHERE updated_at > '${options.lastRun.toISOString()}'` : '';
        const query = `
            SELECT 
                c.name as company_name, 
                c.industry, 
                e.first_name || ' ' || e.last_name as employee_name,
                e.title as employee_title,
                d.name as department_name
            FROM companies c
            JOIN employees e ON c.id = e.company_id
            JOIN departments d ON e.department_id = d.id
            ${lastRunCondition}
            LIMIT 1000; -- Use pagination in a real scenario
        `;

        this.logger.info('Fetching data from database.', { lastRun: options?.lastRun?.toISOString() });
        const result = await this.client.query(query);

        for (const row of result.rows) {
            // We can yield raw rows or format them as text for NLP
            const unstructuredText = `${row.employee_name}, the ${row.employee_title} in the ${row.department_name} department, works at ${row.company_name}, an ${row.industry} company.`;
            yield unstructuredText;
        }
    }

    async getSchema(): Promise<Partial<Ontology>> {
        // This could be dynamically generated by inspecting DB tables
        return {
            nodeTypes: {
                'Company': { properties: { name: 'string', industry: 'string' } },
                'Person': { properties: { name: 'string', title: 'string' } },
                'Department': { properties: { name: 'string' } },
            },
            edgeTypes: {
                'WORKS_AT': { properties: {} },
                'PART_OF': { properties: {} },
            }
        };
    }
}


// ============================================================================
// == The Ontologist Agent
// ============================================================================

export interface OntologistAgentConfig {
    nlpService: INLPService;
    initialOntology: Ontology;
    persistencePath?: string;
    // Add other config like API keys, DB connections if not passed in services
}

export class OntologistAgent {
    private knowledgeGraph: Graph;
    private ontology: Ontology;
    private dataSources: Map<string, IDataSourceConnector> = new Map();
    private nlpService: INLPService;
    private persistencePath: string;
    private logger = new AgentLogger('OntologistAgent');
    private isInitialized: boolean = false;
    private maintenanceIntervalId: NodeJS.Timeout | null = null;

    constructor(config: OntologistAgentConfig) {
        this.knowledgeGraph = new Graph({
            multi: true, // Allow multiple edges between same nodes
            allowSelfLoops: false,
            type: 'directed',
        });
        this.nlpService = config.nlpService;
        this.ontology = config.initialOntology;
        this.persistencePath = config.persistencePath || DEFAULT_GRAPH_PERSISTENCE_PATH;
    }

    /**
     * Initializes the agent by loading the knowledge graph from persistence
     * and connecting to all registered data sources.
     */
    async initialize(): Promise<void> {
        this.logger.info('Initializing agent...');
        await this.loadGraph();
        
        for (const connector of this.dataSources.values()) {
            try {
                await connector.connect();
            } catch (error) {
                this.logger.error(`Failed to connect to data source: ${connector.id}`, error);
                // Decide on failure strategy: continue without it, or fail initialization?
            }
        }

        this.isInitialized = true;
        this.logger.info('Agent initialized successfully.', {
            nodeCount: this.knowledgeGraph.order,
            edgeCount: this.knowledgeGraph.size,
            dataSourceCount: this.dataSources.size,
        });
    }

    /**
     * Registers a new data source connector with the agent.
     * @param connector - An instance of a class that implements IDataSourceConnector.
     */
    registerDataSource(connector: IDataSourceConnector): void {
        if (this.dataSources.has(connector.id)) {
            this.logger.warn(`Data source with id '${connector.id}' is already registered.`);
            return;
        }
        this.dataSources.set(connector.id, connector);
        this.logger.info(`Data source '${connector.id}' registered.`);
        
        // Dynamically evolve ontology based on the source's schema
        connector.getSchema().then(schema => this.evolveOntology(schema));
    }
    
    /**
     * Runs a full ingestion cycle, processing all registered data sources.
     */
    async runFullIngestionCycle(): Promise<void> {
        if (!this.isInitialized) {
            throw new Error('Agent is not initialized. Call initialize() first.');
        }

        this.logger.info('Starting full data ingestion cycle...');
        const cycleStartTime = Date.now();
        let totalItemsProcessed = 0;

        for (const [id, connector] of this.dataSources.entries()) {
            this.logger.info(`Processing data source: ${id}`);
            const sourceStartTime = Date.now();
            let sourceItemsProcessed = 0;

            try {
                const dataStream = connector.fetchData();
                for await (const dataItem of dataStream) {
                    const knowledge = await this.nlpService.extractKnowledge(dataItem);
                    this.updateGraph(knowledge.entities, knowledge.relationships, id);
                    sourceItemsProcessed++;
                    totalItemsProcessed++;
                }
                const sourceEndTime = Date.now();
                this.logger.info(`Finished processing data source: ${id}`, {
                    itemsProcessed: sourceItemsProcessed,
                    durationMs: sourceEndTime - sourceStartTime,
                });
            } catch (error) {
                this.logger.error(`Error processing data source ${id}`, error);
            }
        }
        
        const cycleEndTime = Date.now();
        this.logger.info('Full data ingestion cycle complete.', {
            totalItemsProcessed,
            durationMs: cycleEndTime - cycleStartTime,
            newNodeCount: this.knowledgeGraph.order,
            newEdgeCount: this.knowledgeGraph.size,
        });
        
        await this.persistGraph();
    }
    
    /**
     * Updates the knowledge graph with newly extracted entities and relationships.
     * @param entities - An array of extracted entities.
     * @param relationships - An array of extracted relationships.
     * @param sourceId - The ID of the data source providing this information.
     */
    private updateGraph(entities: ExtractedEntity[], relationships: ExtractedRelationship[], sourceId: string): void {
        const now = new Date().toISOString();

        // Step 1: Add or update entities (nodes)
        for (const entity of entities) {
            this.addOrUpdateNode(entity, sourceId, now);
        }

        // Step 2: Add relationships (edges)
        for (const rel of relationships) {
            this.addRelationshipEdge(rel, sourceId, now);
        }
    }

    /**
     * Adds a new node to the graph or updates an existing one with new information.
     * Implements basic knowledge fusion by merging metadata and updating sources.
     * @param entity - The extracted entity.
     * @param sourceId - The ID of the data source.
     * @param timestamp - The timestamp of the update.
     */
    private addOrUpdateNode(entity: ExtractedEntity, sourceId: string, timestamp: string): void {
        const nodeId = entity.canonicalId || generateEntityId(entity);

        if (!this.ontology.nodeTypes[entity.type]) {
            this.logger.warn(`Encountered unknown entity type '${entity.type}'. Consider updating the ontology.`, { label: entity.label });
        }
        
        if (this.knowledgeGraph.hasNode(nodeId)) {
            // Node exists, merge information
            const existingAttrs = this.knowledgeGraph.getNodeAttributes(nodeId) as GraphNodeAttributes;
            
            // Merge metadata: new properties overwrite old ones
            const newMetadata = { ...existingAttrs.metadata, ...entity.properties };
            
            // Update sources list
            const sourceIndex = existingAttrs.sources.findIndex(s => s.sourceId === sourceId);
            if (sourceIndex > -1) {
                existingAttrs.sources[sourceIndex] = { sourceId, timestamp, confidence: entity.confidence };
            } else {
                existingAttrs.sources.push({ sourceId, timestamp, confidence: entity.confidence });
            }

            this.knowledgeGraph.replaceNodeAttributes(nodeId, {
                ...existingAttrs,
                metadata: newMetadata,
                updatedAt: timestamp,
            });
            this.logger.debug('Updated existing node', { nodeId, label: entity.label });
        } else {
            // New node, create it
            const newNodeAttrs: GraphNodeAttributes = {
                id: nodeId,
                label: entity.label,
                type: entity.type,
                sources: [{ sourceId, timestamp, confidence: entity.confidence }],
                metadata: entity.properties,
                createdAt: timestamp,
                updatedAt: timestamp,
            };
            this.knowledgeGraph.addNode(nodeId, newNodeAttrs);
            this.logger.debug('Added new node', { nodeId, label: entity.label });
        }
    }

    /**
     * Adds a new relationship edge to the graph.
     * @param rel - The extracted relationship.
     * @param sourceId - The ID of the data source.
     * @param timestamp - The timestamp of the update.
     */
    private addRelationshipEdge(rel: ExtractedRelationship, sourceId: string, timestamp: string): void {
        const sourceNodeId = generateEntityId({ type: rel.sourceEntityType, label: rel.sourceEntityLabel });
        const targetNodeId = generateEntityId({ type: rel.targetEntityType, label: rel.targetEntityLabel });

        if (!this.knowledgeGraph.hasNode(sourceNodeId) || !this.knowledgeGraph.hasNode(targetNodeId)) {
            this.logger.warn('Skipping relationship due to missing entity node(s).', { relationship: rel });
            return;
        }

        if (!this.ontology.edgeTypes[rel.relationshipType]) {
            this.logger.warn(`Encountered unknown relationship type '${rel.relationshipType}'. Consider updating the ontology.`);
        }

        const edgeId = uuidv4();
        const edgeAttrs: GraphEdgeAttributes = {
            id: edgeId,
            label: rel.relationshipType,
            sourceId: sourceId,
            confidence: rel.confidence,
            metadata: rel.properties,
            createdAt: timestamp,
        };

        try {
            this.knowledgeGraph.addEdgeWithKey(edgeId, sourceNodeId, targetNodeId, edgeAttrs);
            this.logger.debug(`Added new edge '${rel.relationshipType}'`, { from: sourceNodeId, to: targetNodeId });
        } catch (error) {
            this.logger.error('Failed to add edge to graph', error, { relationship: rel });
        }
    }
    
    /**
     * Dynamically updates the agent's ontology.
     * @param newSchema - A partial or full ontology to merge with the existing one.
     */
    evolveOntology(newSchema: Partial<Ontology>): void {
        if (newSchema.nodeTypes) {
            this.ontology.nodeTypes = { ...this.ontology.nodeTypes, ...newSchema.nodeTypes };
        }
        if (newSchema.edgeTypes) {
            this.ontology.edgeTypes = { ...this.ontology.edgeTypes, ...newSchema.edgeTypes };
        }
        this.logger.info('Ontology has evolved.', { 
            nodeTypeCount: Object.keys(this.ontology.nodeTypes).length,
            edgeTypeCount: Object.keys(this.ontology.edgeTypes).length,
        });
    }

    /**
     * Saves the current state of the knowledge graph to a file.
     */
    async persistGraph(): Promise<void> {
        this.logger.info(`Persisting graph to ${this.persistencePath}...`);
        try {
            const serializedGraph = this.knowledgeGraph.export();
            await fs.writeFile(this.persistencePath, JSON.stringify(serializedGraph, null, 2));
            this.logger.info('Graph persisted successfully.');
        } catch (error) {
            this.logger.error('Failed to persist graph.', error);
        }
    }

    /**
     * Loads the knowledge graph from a file.
     */
    async loadGraph(): Promise<void> {
        this.logger.info(`Attempting to load graph from ${this.persistencePath}...`);
        try {
            const fileContent = await fs.readFile(this.persistencePath, 'utf-8');
            const serializedGraph = JSON.parse(fileContent);
            this.knowledgeGraph.import(serializedGraph);
            this.logger.info('Graph loaded successfully from persistence.', {
                nodeCount: this.knowledgeGraph.order,
                edgeCount: this.knowledgeGraph.size,
            });
        } catch (error: any) {
            if (error.code === 'ENOENT') {
                this.logger.warn('Persistence file not found. Starting with an empty graph.');
            } else {
                this.logger.error('Failed to load graph from persistence.', error);
            }
        }
    }

    /**
     * Shuts down the agent gracefully.
     */
    async shutdown(): Promise<void> {
        this.logger.info('Shutting down agent...');
        if(this.maintenanceIntervalId) {
            clearInterval(this.maintenanceIntervalId);
        }
        for (const connector of this.dataSources.values()) {
            await connector.disconnect();
        }
        await this.persistGraph();
        this.logger.info('Agent shutdown complete.');
    }

    /**
     * Schedules a recurring maintenance and ingestion task.
     * @param intervalMs - The interval in milliseconds between runs.
     */
    scheduleMaintenance(intervalMs: number): void {
        if (this.maintenanceIntervalId) {
            this.logger.warn('Maintenance schedule is already active. Clearing old schedule.');
            clearInterval(this.maintenanceIntervalId);
        }
        
        this.logger.info(`Scheduling maintenance and ingestion cycle to run every ${intervalMs / 1000} seconds.`);
        
        this.maintenanceIntervalId = setInterval(() => {
            this.logger.info('Scheduled maintenance task triggered.');
            this.runFullIngestionCycle().catch(error => {
                this.logger.error('Error during scheduled ingestion cycle', error);
            });
        }, intervalMs);
    }
}

// ============================================================================
// == Example Usage
// ============================================================================

async function main() {
    console.log("--- Ontologist Agent Demonstration ---");

    // Retrieve API keys and connection strings from environment variables for security
    const geminiApiKey = process.env.GEMINI_API_KEY || 'dummy-gemini-key';
    const financialApiKey = process.env.FINANCIAL_API_KEY || 'dummy-financial-key';
    const dbConnectionString = process.env.DB_CONNECTION_STRING || 'postgresql://user:password@host:port/database';

    // 1. Define the initial, core ontology for our domain
    const initialOntology: Ontology = {
        nodeTypes: {
            'Person': { properties: { name: 'string', title: 'string', age: 'number' } },
            'Company': { properties: { name: 'string', industry: 'string' } },
            'Product': { properties: { name: 'string' } },
            'Location': { properties: { address: 'string' } },
            'MarketEvent': { properties: { type: 'string', date: 'date' } },
        },
        edgeTypes: {
            'WORKS_AT': { properties: { role: 'string', startDate: 'date' } },
            'CEO_OF': { properties: { startDate: 'date' } },
            'ACQUIRED': { properties: { date: 'date', value: 'number' } },
            'COMPETES_WITH': { properties: {} },
            'LOCATED_IN': { properties: {} },
        }
    };

    // 2. Instantiate the required services
    const nlpService = new GeminiOpenAINLPService(geminiApiKey);
    const marketApiSource = new PublicApiDataSource(financialApiKey);
    // The Postgres source would fail without a real DB, so we'll mock it for the demo
    // const crmDbSource = new PostgresDataSource(dbConnectionString);


    // 3. Configure and create the agent instance
    const agent = new OntologistAgent({
        nlpService: nlpService,
        initialOntology: initialOntology,
        persistencePath: path.join(__dirname, 'universal_knowledge_graph.json'),
    });

    // 4. Register data sources with the agent
    agent.registerDataSource(marketApiSource);
    // agent.registerDataSource(crmDbSource); // This would be included in a real setup

    // Graceful shutdown handling
    process.on('SIGINT', async () => {
        console.log("Caught interrupt signal. Shutting down agent...");
        await agent.shutdown();
        process.exit(0);
    });

    try {
        // 5. Initialize the agent (loads graph, connects to sources)
        await agent.initialize();

        // 6. Run an initial, manual ingestion cycle
        await agent.runFullIngestionCycle();

        // 7. Schedule the agent to run periodically (e.g., every hour)
        agent.scheduleMaintenance(3600 * 1000);

        console.log("--- Agent is now running in the background. Press CTRL+C to stop. ---");
        
    } catch (error) {
        console.error("An error occurred during agent execution:", error);
        await agent.shutdown();
        process.exit(1);
    }
}

// This allows the file to be run directly for testing/demonstration
if (require.main === module) {
    main();
}
```