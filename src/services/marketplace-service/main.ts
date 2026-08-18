// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/src/services/marketplace-service/main.ts
================================================================================

import 'dotenv/config';
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import http from 'http';
import compression from 'compression';

import { config } from './config';
import { logger } from './utils/logger';
import { connectDatabase } from './database';
import { connectCache } from './lib/cache';
import { initializePartnerIntegrations } from './integrations';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { NotFoundError } from './utils/errors';
import v1Routes from './api/v1';

/**
 * Initializes all external services like database, cache, and partner integrations.
 * Exits the process if any critical service fails to initialize.
 */
const initializeServices = async (): Promise<void> => {
    try {
        logger.info('Initializing core services...');
        await connectDatabase();
        await connectCache();
        await initializePartnerIntegrations();
        logger.info('Core services initialized successfully.');
    } catch (error) {
        logger.error('Fatal: Failed to initialize core services.', { error });
        process.exit(1);
    }
};

/**
 * Creates and configures the Express application instance.
 * @returns {Application} The configured Express application.
 */
const createApplication = (): Application => {
    const app: Application = express();

    // --- Core Middleware ---
    // Trust proxy headers for environments like Heroku, AWS ELB, etc., to get correct IP addresses.
    app.set('trust proxy', 1);

    // Set security-related HTTP response headers.
    app.use(helmet());

    // Enable Cross-Origin Resource Sharing.
    app.use(cors({
        origin: config.cors.origin, // Restrict to specific origins in production
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        credentials: true,
    }));

    // Gzip compression for responses to reduce bandwidth.
    app.use(compression());

    // Parse incoming JSON requests.
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Log incoming HTTP requests.
    app.use(requestLogger);

    // --- API Routes ---
    // Health check endpoint for monitoring services (e.g., load balancers).
    app.get('/health', (req: Request, res: Response) => {
        res.status(200).json({
            status: 'UP',
            timestamp: new Date().toISOString(),
            service: 'Marketplace-Service',
        });
    });

    // Mount Version 1 of the API routes.
    app.use('/api/v1', v1Routes);

    // --- Error Handling ---
    // Handle 404 for routes that are not found.
    app.use((req: Request, res: Response, next: NextFunction) => {
        next(new NotFoundError(`Route not found: ${req.method} ${req.originalUrl}`));
    });

    // Global error handler middleware. This must be the last middleware added.
    app.use(errorHandler);

    return app;
};

/**
 * The main function to start the server.
 * It initializes services, creates the application, and starts the HTTP server.
 * It also sets up graceful shutdown and global error handlers.
 */
const startServer = async (): Promise<void> => {
    await initializeServices();
    const app = createApplication();
    const server = http.createServer(app);

    server.listen(config.port, () => {
        logger.info(`🚀 Marketplace Service listening on port ${config.port}`);
        logger.info(`Environment: ${config.env}`);
    });

    const gracefulShutdown = (signal: string) => {
        logger.info(`Received ${signal}. Shutting down gracefully...`);
        server.close(() => {
            logger.info('HTTP server closed.');
            // Here you would add cleanup for database, cache, etc.
            // e.g., database.disconnect().then(() => cache.disconnect())
            process.exit(0);
        });

        // Force shutdown after a timeout if graceful shutdown fails.
        setTimeout(() => {
            logger.error('Could not close connections in time, forcing shutdown.');
            process.exit(1);
        }, 10000); // 10 seconds
    };

    // Listen for termination signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Global error handlers for uncaught exceptions and unhandled rejections
    process.on('unhandledRejection', (reason: Error, promise: Promise<any>) => {
        logger.error('Unhandled Rejection at:', { promise, reason: reason.stack || reason });
        // It's often safer to crash and let a process manager (like PM2 or Kubernetes) restart the service.
        // throw reason;
    });

    process.on('uncaughtException', (error: Error) => {
        logger.error('Uncaught Exception:', { error: error.stack || error });
        // This is a critical error. The application state is unknown.
        // It's mandatory to exit.
        process.exit(1);
    });
};

// --- Start the application ---
startServer().catch(error => {
    logger.error('Fatal: Failed to start the server.', { error: error.stack || error });
    process.exit(1);
});