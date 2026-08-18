// REPOSITORY SOURCE: diplomat-bit/jocall3-node | PATH: diplomat-bit-jocall3-node-fae6abf/packages/mcp-server/src/headers.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { IncomingMessage } from 'node:http';
import { ClientOptions } from 'jocall3-node';

export const parseAuthHeaders = (req: IncomingMessage): Partial<ClientOptions> => {
  if (req.headers.authorization) {
    const scheme = req.headers.authorization.split(' ')[0]!;
    const value = req.headers.authorization.slice(scheme.length + 1);
    switch (scheme) {
      case 'Bearer':
        return { apiKey: req.headers.authorization.slice('Bearer '.length) };
      default:
        throw new Error(
          'Unsupported authorization scheme. Expected the "Authorization" header to be a supported scheme (Bearer).',
        );
    }
  }

  const apiKey =
    Array.isArray(req.headers['x-jocall3-api-key']) ?
      req.headers['x-jocall3-api-key'][0]
    : req.headers['x-jocall3-api-key'];
  const geminiAPIKey =
    Array.isArray(req.headers['x-goog-api-key']) ?
      req.headers['x-goog-api-key'][0]
    : req.headers['x-goog-api-key'];
  return { apiKey, geminiAPIKey };
};
