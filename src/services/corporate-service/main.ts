// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/src/services/corporate-service/main.ts
================================================================================

/**
 * @file src/services/corporate-service/main.ts
 * @description The main entry point for the Corporate Finance Service.
 * This service is the backbone of our corporate finance offerings, handling
 * corporate card issuance and management, real-time compliance checks,
 * and advanced treasury management solutions. It's designed for high availability,
 * scalability, and deep integration with a multitude of third-party services
 * like Plaid, Stripe, Auth0, AWS, and GCP to provide a superior, unified financial platform.
 */

// --- Core Node & Framework Imports ---
import express, { Express, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import http from 'http';

// --- Configuration ---
import { config } from './config';

// --- Utilities & Core Services ---
import { logger } from './utils/logger';
import { connectToDatabase } from './config/database';
import { initializeMessageQueue } from './services/message-queue.service';
import { initializeCloudServices } from './services/cloud.service';
import { initializePlaidClient } from './services/plaid.service';
import { initializeStripeClient } from './services/stripe.service';
import { initializeCache } from './config/cache';

// --- API Documentation ---
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';

// --- Middleware ---
import { errorHandler } from './middleware/errorHandler';
import { authMiddleware } from './middleware/authMiddleware';
import { rateLimiter } from './middleware/rateLimiter';
import { correlationIdMiddleware } from './middleware/correlationIdMiddleware';

// --- API Routers ---
import healthRouter from './api/routes/health.routes';
import corporateCardRouter from './api/routes/corporate-card.routes';
import treasuryRouter from './api/routes/treasury.routes';
import complianceRouter from './api/routes/compliance.routes';
import integrationRouter from './api/routes/integration.routes';
import reportingRouter from './api/routes/reporting.routes';
import transactionRouter from './api/routes/transaction.routes';

/**
 * Main application class for the Corporate Finance Service.
 * Encapsulates server setup, middleware, routes, and lifecycle management.
 */
class CorporateFinanceService {
    public app: Express;
    private readonly port: number;
    private server: http.Server;

    constructor() {
        this.app = express();
        this.port = config.port;
        this.server = http.createServer(this.app);

        this.initializeApp().catch(error => {
            logger.error('Fatal application initialization error:', { error: error.stack || error });
            process.exit(1);
        });
    }

    private async initializeApp(): Promise<void> {
        logger.info('-------------------------------------------------------');
        logger.info('--- Initializing Corporate Finance Service ---');
        logger.info(`--- Environment: ${config.nodeEnv} | Version: ${config.appVersion} ---`);
        logger.info('-------------------------------------------------------');

        // 1. Connect to essential services
        await this.connectServices();

        // 2. Configure middleware
        this.setupMiddleware();

        // 3. Setup API routes
        this.setupRoutes();

        // 4. Setup API documentation
        this.setupApiDocs();

        // 5. Setup global error handling
        this.setupErrorHandling();
    }

    private async connectServices(): Promise<void> {
        logger.info('Connecting to dependent services...');
        
        // The order can be important. E.g., Cache before DB if ORM uses it.
        await initializeCache();
        logger.info('Cache (Redis) connection established successfully.');

        await connectToDatabase();
        logger.info('Database (PostgreSQL) connection established successfully.');

        await initializeMessageQueue();
        logger.info('Message Queue (RabbitMQ/Kafka) initialized successfully.');

        initializeCloudServices();
        logger.info('Cloud services (AWS, GCP) SDKs initialized successfully.');

        initializePlaidClient();
        logger.info('Plaid client initialized successfully.');

        initializeStripeClient();
        logger.info('Stripe client (for card issuing) initialized successfully.');

        logger.info('All dependent services connected and initialized.');
    }

    private setupMiddleware(): void {
        logger.info('Configuring middleware...');
        
        // Add a correlation ID to each request for better tracing
        this.app.use(correlationIdMiddleware);

        // Security headers
        this.app.use(helmet());

        // Enable CORS
        this.app.use(cors({ origin: config.corsOrigin, credentials: true }));

        // Gzip compression for response bodies
        this.app.use(compression());

        // JSON body parser with strict limits
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

        // HTTP request logger (using our custom logger)
        this.app.use(morgan(config.morganFormat, {
            stream: { write: (message) => logger.http(message.trim()) },
            skip: (req) => req.originalUrl.startsWith('/api/v1/health'), // Don't log health checks
        }));

        // Apply rate limiting to all requests
        this.app.use(rateLimiter);
        logger.info('Middleware configured.');
    }

    private setupRoutes(): void {
        logger.info('Setting up API routes...');
        const apiPrefix = '/api/v1';

        // Public health check endpoint
        this.app.use(`${apiPrefix}/health`, healthRouter);

        // --- Protected Routes ---
        // All subsequent routes will require a valid JWT from our auth provider (e.g., Auth0)
        this.app.use(authMiddleware);

        this.app.use(`${apiPrefix}/cards`, corporateCardRouter);
        this.app.use(`${apiPrefix}/treasury`, treasuryRouter);
        this.app.use(`${apiPrefix}/compliance`, complianceRouter);
        this.app.use(`${apiPrefix}/integrations`, integrationRouter);
        this.app.use(`${apiPrefix}/reporting`, reportingRouter);
        this.app.use(`${apiPrefix}/transactions`, transactionRouter);

        logger.info('API routes configured.');
    }

    private setupApiDocs(): void {
        if (config.isDevelopment) {
            logger.info('Setting up API documentation...');
            this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
            logger.info(`API documentation available at http://localhost:${this.port}/api-docs`);
        }
    }

    private setupErrorHandling(): void {
        // Catch-all for 404 Not Found errors
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            const error = new Error(`API endpoint not found: ${req.method} ${req.originalUrl}`);
            res.status(404);
            next(error);
        });

        // Global error handler middleware - must be the last middleware
        this.app.use(errorHandler);
        logger.info('Global error handler configured.');
    }

    public start(): void {
        this.server.listen(this.port, () => {
            logger.info(`🚀 Corporate Finance Service is running on port ${this.port}`);
        });

        const gracefulShutdown = (signal: string) => {
            logger.warn(`${signal} signal received. Shutting down gracefully...`);
            this.server.close(() => {
                logger.info('HTTP server closed.');
                // Add logic to gracefully close database connections, message queues, etc.
                // e.g., database.close(), messageQueue.disconnect()
                process.exit(0);
            });
        };

        // Listen for termination signals
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));

        // Global exception handlers
        process.on('unhandledRejection', (reason: Error, promise: Promise<any>) => {
            logger.error('Unhandled Rejection at:', { promise, reason: reason.stack || reason });
            // In a real-world scenario, you might want to gracefully shut down here
            // throw reason; // This will be caught by uncaughtException handler
        });

        process.on('uncaughtException', (error: Error) => {
            logger.error('Uncaught Exception thrown:', { error: error.stack || error });
            // It's critical to exit after an uncaught exception as the application state is unknown
            process.exit(1);
        });
    }
}

// Instantiate and start the service
const corporateFinanceService = new CorporateFinanceService();
corporateFinanceService.start();