// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/middleware/SecurityMiddleware.ts
================================================================================

```typescript
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

/**
 * SecurityMiddleware.ts
 * 
 * This module provides enterprise-grade security middleware for the application's
 * API layer. It handles JWT verification, Role-Based Access Control (RBAC),
 * request sanitization, and security event logging.
 * 
 * Integrated with the project's 'QuantumShield' security protocols.
 */

// --- Configuration & Constants ---

const JWT_SECRET = process.env.JWT_SECRET || 'dev-quantum-secret-key-change-in-prod';
const JWT_ISSUER = process.env.JWT_ISSUER || 'Allocatra-Quantum-Auth-Authority';
const JWT_ALGORITHM = 'HS256';

// Map of high-risk routes that require stricter validation
const HIGH_SECURITY_ZONES = [
    '/api/admin',
    '/api/financial/transfers',
    '/api/quantum/decrypt'
];

// Role definitions based on project hierarchy
export enum UserRole {
    GUEST = 'guest',
    USER = 'user',
    PREMIUM_USER = 'premium_user',
    DATA_SCIENTIST = 'data_scientist',
    ADMIN = 'admin',
    SYSTEM_OVERLORD = 'system_overlord' // Root access
}

// Interface for the decoded JWT payload
export interface QuantumUserPayload {
    userId: string;
    email: string;
    role: UserRole;
    scopes: string[];
    mfaVerified: boolean;
    biometricSignature?: string; // Link to biometric-quantum-authentication.yaml
    iat: number;
    exp: number;
    iss: string;
}

// Augment Express Request to include user info
declare global {
    namespace Express {
        interface Request {
            user?: QuantumUserPayload;
            requestId?: string;
            securityContext?: {
                ip: string;
                userAgent: string;
                riskScore: number;
            };
        }
    }
}

/**
 * SecurityMiddleware Class
 * 
 * Static methods to be used in route definitions.
 */
export class SecurityMiddleware {

    /**
     * Middleware to validate JSON Web Tokens (JWT).
     * Extracts the token from the Authorization header (Bearer schema).
     */
    public static async verifyToken(req: Request, res: Response, next: NextFunction): Promise<void> {
        const requestId = uuidv4();
        req.requestId = requestId;

        try {
            const authHeader = req.headers.authorization;

            if (!authHeader) {
                SecurityMiddleware.logSecurityEvent(req, 'MISSING_AUTH_HEADER', 'Authorization header required');
                res.status(401).json({ 
                    success: false, 
                    error: 'Authentication Required', 
                    code: 'AUTH_MISSING_TOKEN',
                    requestId 
                });
                return;
            }

            const tokenParts = authHeader.split(' ');
            if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
                SecurityMiddleware.logSecurityEvent(req, 'INVALID_AUTH_FORMAT', 'Invalid Authorization header format');
                res.status(400).json({ 
                    success: false, 
                    error: 'Invalid Token Format', 
                    code: 'AUTH_INVALID_FORMAT',
                    requestId 
                });
                return;
            }

            const token = tokenParts[1];

            // Verify the token
            // In a real scenario, this would check against a blacklist/revocation list (e.g., Redis)
            jwt.verify(token, JWT_SECRET, { algorithms: [JWT_ALGORITHM], issuer: JWT_ISSUER }, (err, decoded) => {
                if (err) {
                    const message = err.name === 'TokenExpiredError' ? 'Token has expired' : 'Invalid token signature';
                    SecurityMiddleware.logSecurityEvent(req, 'TOKEN_VERIFICATION_FAILED', message);
                    
                    return res.status(401).json({ 
                        success: false, 
                        error: 'Authentication Failed', 
                        message: message,
                        code: err.name === 'TokenExpiredError' ? 'AUTH_TOKEN_EXPIRED' : 'AUTH_TOKEN_INVALID',
                        requestId
                    });
                }

                if (!decoded) {
                    return res.status(500).json({ success: false, error: 'Internal Auth Error' });
                }

                // Attach payload to request
                req.user = decoded as QuantumUserPayload;

                // Basic Risk Assessment based on user agent and IP (Simulated)
                req.securityContext = {
                    ip: req.ip || req.socket.remoteAddress || 'unknown',
                    userAgent: req.headers['user-agent'] || 'unknown',
                    riskScore: SecurityMiddleware.calculateRiskScore(req, req.user)
                };

                // Check for high security zones requiring MFA
                if (SecurityMiddleware.isHighSecurityZone(req.path) && !req.user.mfaVerified) {
                    SecurityMiddleware.logSecurityEvent(req, 'MFA_REQUIRED_ACCESS_ATTEMPT', 'User attempted high sec access without MFA');
                    return res.status(403).json({
                        success: false,
                        error: 'Multi-Factor Authentication Required',
                        code: 'AUTH_MFA_REQUIRED',
                        requestId
                    });
                }

                next();
            });

        } catch (error) {
            console.error('Critical Security Middleware Error:', error);
            res.status(500).json({ success: false, error: 'Security Service Unavailable', requestId });
        }
    }

    /**
     * Middleware factory to enforce Role-Based Access Control (RBAC).
     * @param allowedRoles List of UserRoles that are permitted to access the resource.
     */
    public static requireRole(allowedRoles: UserRole[]) {
        return (req: Request, res: Response, next: NextFunction) => {
            if (!req.user) {
                return res.status(401).json({ success: false, error: 'User context not found' });
            }

            if (allowedRoles.includes(req.user.role)) {
                next();
            } else {
                SecurityMiddleware.logSecurityEvent(req, 'INSUFFICIENT_PRIVILEGES', `User role ${req.user.role} tried to access restricted resource`);
                res.status(403).json({ 
                    success: false, 
                    error: 'Access Denied', 
                    message: 'Insufficient privileges for this resource',
                    code: 'AUTH_FORBIDDEN',
                    requestId: req.requestId
                });
            }
        };
    }

    /**
     * Middleware factory to enforce specific permission scopes.
     * @param requiredScope The scope string required (e.g., 'read:finance').
     */
    public static requireScope(requiredScope: string) {
        return (req: Request, res: Response, next: NextFunction) => {
            if (!req.user) {
                return res.status(401).json({ success: false, error: 'User context not found' });
            }

            // Assume wildcard support for admin
            if (req.user.role === UserRole.ADMIN || req.user.role === UserRole.SYSTEM_OVERLORD) {
                return next();
            }

            if (req.user.scopes && req.user.scopes.includes(requiredScope)) {
                next();
            } else {
                SecurityMiddleware.logSecurityEvent(req, 'MISSING_SCOPE', `Missing required scope: ${requiredScope}`);
                res.status(403).json({ 
                    success: false, 
                    error: 'Access Denied', 
                    message: `Missing required permission scope: ${requiredScope}`,
                    code: 'AUTH_SCOPE_MISSING',
                    requestId: req.requestId
                });
            }
        };
    }

    /**
     * Input Sanitization Middleware.
     * Protects against basic XSS and SQL Injection by scrubbing request body and query params.
     */
    public static sanitizeInput(req: Request, res: Response, next: NextFunction) {
        // Helper to recursively clean strings
        const sanitize = (obj: any): any => {
            if (typeof obj === 'string') {
                // Remove generic script tags and dangerous SQL characters
                return obj.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "")
                          .replace(/['";]+/g, ''); 
            } else if (Array.isArray(obj)) {
                return obj.map(sanitize);
            } else if (typeof obj === 'object' && obj !== null) {
                Object.keys(obj).forEach(key => {
                    obj[key] = sanitize(obj[key]);
                });
            }
            return obj;
        };

        if (req.body) req.body = sanitize(req.body);
        if (req.query) req.query = sanitize(req.query);
        if (req.params) req.params = sanitize(req.params);

        next();
    }

    /**
     * Calculates a dynamic risk score for the request based on QuantumShield heuristics.
     */
    private static calculateRiskScore(req: Request, user: QuantumUserPayload): number {
        let score = 0;
        
        // Example Heuristics
        const ip = req.ip || '';
        const userAgent = req.headers['user-agent'] || '';

        // Check if IP is from a known suspicious range (Simulated)
        if (ip.startsWith('192.168.0.')) score += 0; // Local trust
        else score += 10;

        // Check for headless browsers or bots
        if (userAgent.includes('Headless') || userAgent.includes('Bot')) {
            score += 50;
        }

        // Check recent anomaly status from simulated external service
        // import { anomalies } from '../data/anomalies'; -> mock check
        // if (anomalies.has(user.userId)) score += 80;

        return score;
    }

    private static isHighSecurityZone(path: string): boolean {
        return HIGH_SECURITY_ZONES.some(zone => path.startsWith(zone));
    }

    /**
     * Logs security events to the console and potentially an audit database.
     */
    private static logSecurityEvent(req: Request, type: string, message: string) {
        const payload = {
            timestamp: new Date().toISOString(),
            type: `SEC_EVENT_${type}`,
            requestId: req.requestId,
            ip: req.ip,
            path: req.path,
            method: req.method,
            userId: req.user?.userId || 'anonymous',
            details: message,
            riskScore: req.securityContext?.riskScore || 0
        };

        // In production, this would go to ELK Stack, Splunk, or Datadog
        // For this project, we console log with a specific format for the 'admin/auditTrails.ts' to parse later
        console.warn(`[QuantumShield Audit] ${JSON.stringify(payload)}`);
    }
}

/**
 * Helper to generate tokens for testing or internal use.
 * @param user User data to encode
 * @param expiresIn Expiration time (string)
 */
export const generateSimulationToken = (user: Partial<QuantumUserPayload>, expiresIn: string = '1h'): string => {
    const payload: Partial<QuantumUserPayload> = {
        userId: user.userId || uuidv4(),
        email: user.email || 'simulated@allocatra.com',
        role: user.role || UserRole.USER,
        scopes: user.scopes || ['read:profile'],
        mfaVerified: user.mfaVerified || false,
        iss: JWT_ISSUER
    };
    
    return jwt.sign(payload, JWT_SECRET, { expiresIn, algorithm: JWT_ALGORITHM });
};

export default SecurityMiddleware;
```