// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/src/libs/auth-lib/jwt_validator.ts
================================================================================

import { createRemoteJWKSet, jwtVerify, JWTPayload, JWTVerifyResult, JWTVerifyOptions } from 'jose';
import { URL } from 'url';

/**
 * Configuration for the JWT Validator.
 */
export interface JwtValidatorConfig {
  /**
   * The expected issuer (`iss` claim) of the JWT.
   * @example "https://your-auth-provider.com/"
   */
  issuer: string;

  /**
   * The expected audience (`aud` claim) of the JWT.
   * This should identify the recipient the JWT is intended for (e.g., your API's unique identifier).
   */
  audience: string | string[];

  /**
   * The URL of the JSON Web Key Set (JWKS) endpoint.
   * The validator will fetch public keys from this URL to verify the JWT signature.
   * @example "https://your-auth-provider.com/.well-known/jwks.json"
   */
  jwksUri: string;

  /**
   * A list of allowed signing algorithms. It's a security best practice to be explicit.
   * @default ['RS256']
   */
  algorithms?: string[];

  /**
   * Optional additional options to pass to the underlying `jwtVerify` function from the 'jose' library.
   * This allows for advanced configurations like custom clock tolerance.
   */
  verifyOptions?: JWTVerifyOptions;
}

/**
 * Base class for all JWT validation errors, allowing for easy catching of auth-related issues.
 */
export class JwtValidationError extends Error {
  public readonly code: string;

  constructor(message: string, code: string = 'JWT_VALIDATION_ERROR') {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    // This is for V8 environments (like Node.js) to capture the stack trace correctly
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Error thrown when the token is malformed, expired, has an invalid signature, or fails a claim check.
 */
export class InvalidTokenError extends JwtValidationError {
  constructor(message: string, public readonly cause?: Error) {
    super(message, 'INVALID_TOKEN');
  }
}

/**
 * Error thrown when the Authorization header is missing or malformed.
 */
export class MissingAuthHeaderError extends JwtValidationError {
  constructor(message: string = 'Authorization header is missing or malformed.') {
    super(message, 'MISSING_AUTH_HEADER');
  }
}

/**
 * A function that validates a JWT and returns its payload and protected header.
 * @template T - The expected type of the JWT payload, extending the standard JWTPayload.
 * @param {string | undefined | null} authHeader - The full 'Authorization' header value (e.g., "Bearer eyJ...").
 * @returns {Promise<JWTVerifyResult<T>>} A promise that resolves with the verification result, including the typed payload.
 * @throws {MissingAuthHeaderError} If the auth header is missing or not in the "Bearer <token>" format.
 * @throws {InvalidTokenError} If the token is invalid, expired, has a bad signature, or fails any claim check.
 */
export type JwtValidator<T extends JWTPayload = JWTPayload> = (
  authHeader: string | undefined | null
) => Promise<JWTVerifyResult<T>>;

/**
 * Creates a reusable JWT validation function based on the provided configuration.
 * This factory function sets up the JWKS fetching and caching mechanism provided by the 'jose' library.
 *
 * @template T - The expected type of the JWT payload. Defaults to the base JWTPayload.
 * @param {JwtValidatorConfig} config - The configuration for the validator.
 * @returns {JwtValidator<T>} An async function that takes an Authorization header and returns the validated payload.
 */
export function createJwtValidator<T extends JWTPayload = JWTPayload>(
  config: JwtValidatorConfig
): JwtValidator<T> {
  if (!config.issuer || !config.audience || !config.jwksUri) {
    throw new Error('JWT Validator configuration is incomplete. `issuer`, `audience`, and `jwksUri` are required.');
  }

  // createRemoteJWKSet handles caching of the JWKS for performance.
  const jwks = createRemoteJWKSet(new URL(config.jwksUri));

  return async (authHeader: string | undefined | null): Promise<JWTVerifyResult<T>> => {
    if (!authHeader) {
      throw new MissingAuthHeaderError('Authorization header is missing.');
    }

    const tokenParts = authHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0].toLowerCase() !== 'bearer') {
      throw new MissingAuthHeaderError('Authorization header must be in the format "Bearer <token>".');
    }

    const token = tokenParts[1];
    if (!token) {
        throw new MissingAuthHeaderError('Token is missing from Authorization header.');
    }

    try {
      const result = await jwtVerify(token, jwks, {
        issuer: config.issuer,
        audience: config.audience,
        algorithms: config.algorithms ?? ['RS256'],
        ...config.verifyOptions, // Allow overriding with advanced options
      });

      // The caller is responsible for ensuring T matches the actual payload structure.
      // This cast provides type safety for the consumer of the validator.
      return result as JWTVerifyResult<T>;
    } catch (error: unknown) {
      // The 'jose' library throws specific error types (e.g., 'ERR_JWT_EXPIRED', 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED').
      // We wrap them in a consistent InvalidTokenError for the application layer to handle uniformly.
      const errorMessage = error instanceof Error ? error.message : 'Unknown token validation error';
      throw new InvalidTokenError(`Token validation failed: ${errorMessage}`, error instanceof Error ? error : undefined);
    }
  };
}

/**
 * =============================================================================
 * Example Usage (for documentation and testing purposes)
 * =============================================================================
 *
 * // 1. Define your expected JWT payload structure by extending the base JWTPayload
 * interface CustomPayload extends JWTPayload {
 *   scope?: string;
 *   permissions?: string[];
 *   // Add any other custom claims from your token
 * }
 *
 * // 2. Configure the validator for a specific identity provider (e.g., Auth0)
 * const auth0Validator = createJwtValidator<CustomPayload>({
 *   issuer: 'https://your-tenant.auth0.com/',
 *   audience: 'https://api.yourapp.com',
 *   jwksUri: 'https://your-tenant.auth0.com/.well-known/jwks.json',
 * });
 *
 * // 3. Use the validator in your application's middleware or route handler (e.g., in an Express app)
 *
 * // import { Request, Response, NextFunction } from 'express';
 * //
 * // async function authMiddleware(req: Request, res: Response, next: NextFunction) {
 * //   try {
 * //     const authHeader = req.headers.authorization;
 * //     const { payload } = await auth0Validator(authHeader);
 * //
 * //     // Attach user information to the request object for downstream handlers
 * //     // @ts-ignore (extending the Express Request type is a good practice here)
 * //     req.user = payload;
 * //
 * //     console.log(`Request authenticated for user: ${payload.sub}`);
 * //     next();
 * //   } catch (error) {
 * //     if (error instanceof JwtValidationError) {
 * //       // Log the specific auth error
 * //       console.warn(`Authentication failed: ${error.message} (Code: ${error.code})`);
 * //       res.status(401).json({ error: 'Unauthorized', message: error.message });
 * //     } else {
 * //       // Handle unexpected errors
 * //       console.error('An unexpected error occurred during authentication:', error);
 * //       res.status(500).json({ error: 'Internal Server Error' });
 * //     }
 * //   }
 * // }
 */