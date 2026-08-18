// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/src/services/account-service/main.ts
================================================================================

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { expressjwt, GetVerificationKey } from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import 'express-async-errors'; // A library to handle async errors in express automatically

import { config, validateConfig } from './config';
import { logger } from './utils/logger';
import { AppError } from './utils/errors';
import { connectToDatabase } from './database/client';
import { connectToMessageQueue } from './message-queue/client';
import { initializePlaidClient } from './lib/plaid';

// Import API route handlers
import plaidRoutes from './api/v1/plaidRoutes';
import accountRoutes from './api/v1/accountRoutes';
import webhookRoutes from './api/v1/webhookRoutes';

/**
 * The main bootstrap function for the Account Service.
 * It initializes configurations, database connections, message queues,
 * the web server, and sets up all middleware and routes.
 */
async function bootstrap() {
    // Load environment variables from .env file
    dotenv.config();

    // Validate that all required environment variables are set
    validateConfig();
    logger.info('Configuration loaded and validated.');

    // Initialize external service clients
    initializePlaidClient();
    logger.info('Plaid client initialized.');

    // Establish connections to downstream services
    try {
        await connectToDatabase();
        await connectToMessageQueue();
    } catch (error) {
        logger.fatal('Failed to connect to downstream services on startup.', { error });
        process.exit(1);
    }

    const app: Express = express();

    // --- Core Middleware Setup ---

    // Apply security best practices
    app.use(helmet());

    // Enable CORS with configurable origin
    app.use(cors({ origin: config.corsOrigin, methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] }));

    // Parse incoming JSON requests
    app.use(express.json());

    // Custom request logging middleware
    app.use((req: Request, res: Response, next: NextFunction) => {
        const start = Date.now();
        res.on('finish', () => {
            const duration = Date.now() - start;
            logger.info('HTTP Request', {
                method: req.method,
                url: req.originalUrl,
                status: res.statusCode,
                duration_ms: duration,
                ip: req.ip,
            });
        });
        next();
    });

    // --- Authentication Middleware (Auth0 JWT Verification) ---
    const checkJwt = expressjwt({
        secret: jwksRsa.expressJwtSecret({
            cache: true,
            rateLimit: true,
            jwksRequestsPerMinute: 5,
            jwksUri: `https://${config.auth0.domain}/.well-known/jwks.json`,
        }) as GetVerificationKey,
        audience: config.auth0.audience,
        issuer: `https://${config.auth0.domain}/`,
        algorithms: ['RS256'],
    });

    // --- API Routes ---

    // Public health check endpoint
    app.get('/health', (req: Request, res: Response) => {
        res.status(200).json({
            status: 'UP',
            service: 'account-service',
            timestamp: new Date().toISOString(),
        });
    });

    // Webhook routes (may have different authentication, e.g., signature verification)
    app.use('/api/v1/webhooks', webhookRoutes);

    // Version 1 of the API, protected by JWT authentication
    const apiV1Router = express.Router();
    apiV1Router.use(checkJwt); // Apply authentication to all v1 routes
    apiV1Router.use('/plaid', plaidRoutes);
    apiV1Router.use('/accounts', accountRoutes);
    app.use('/api/v1', apiV1Router);

    // --- Error Handling Middleware ---

    // Catch-all for 404 Not Found errors
    app.use((req: Request, res: Response) => {
        res.status(404).json({
            error: {
                message: 'Not Found',
                path: req.originalUrl,
            },
        });
    });

    // Centralized error handler
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        if (err instanceof AppError) {
            logger.warn(`Application Error: ${err.message}`, {
                statusCode: err.statusCode,
                details: err.details,
                path: req.originalUrl,
            });
            return res.status(err.statusCode).json({
                error: {
                    message: err.message,
                    details: err.details,
                },
            });
        }

        // Specific handling for JWT authentication errors
        if (err.name === 'UnauthorizedError') {
            logger.warn('JWT Authentication Error', {
                message: err.message,
                path: req.originalUrl,
            });
            return res.status(401).json({
                error: {
                    message: 'Invalid or expired token provided.',
                    code: 'UNAUTHORIZED',
                },
            });
        }

        // Handle unexpected, internal server errors
        logger.error('Internal Server Error', {
            message: err.message,
            stack: err.stack,
            path: req.originalUrl,
        });

        // Avoid leaking stack traces in production
        const responseMessage = config.nodeEnv === 'production'
            ? 'An unexpected internal error occurred.'
            : err.message;

        res.status(500).json({
            error: {
                message: responseMessage,
            },
        });
    });

    // --- Server Startup ---
    const server = app.listen(config.port, () => {
        logger.info(`🚀 Account Service is running on http://localhost:${config.port}`);
    });

    // --- Graceful Shutdown Logic ---
    const shutdown = (signal: string) => {
        logger.info(`Received ${signal}. Shutting down gracefully...`);
        server.close(async () => {
            logger.info('HTTP server closed.');
            // Add cleanup logic here (e.g., close database connections)
            // await prisma.$disconnect();
            // await messageQueueConnection.close();
            logger.info('Downstream connections closed. Exiting.');
            process.exit(0);
        });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
}

// --- Application Entry Point ---
bootstrap().catch(error => {
    // Log fatal errors that prevent the service from starting
    logger.fatal('A fatal error occurred during service bootstrap', {
        error: error instanceof Error ? error.stack : String(error),
    });
    process.exit(1);
});