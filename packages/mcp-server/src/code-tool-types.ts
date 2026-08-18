// REPOSITORY SOURCE: diplomat-bit/jocall3-node | PATH: diplomat-bit-jocall3-node-fae6abf/packages/mcp-server/src/code-tool-types.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { ClientOptions } from 'jocall3-node';

export type WorkerInput = {
  project_name: string;
  code: string;
  client_opts: ClientOptions;
  intent?: string | undefined;
};
export type WorkerOutput = {
  is_error: boolean;
  result: unknown | null;
  log_lines: string[];
  err_lines: string[];
};
