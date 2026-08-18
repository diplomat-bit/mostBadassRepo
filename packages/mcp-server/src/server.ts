// REPOSITORY SOURCE: diplomat-bit/jocall3-node | PATH: diplomat-bit-jocall3-node-fae6abf/packages/mcp-server/src/server.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { ClientOptions } from 'jocall3-node';
import Jocall3 from 'jocall3-node';
import { codeTool } from './code-tool';
import { McpOptions } from './options';
import { HandlerFunction, McpTool } from './types';

export { McpOptions } from './options';
export { ClientOptions } from 'jocall3-node';

export const newMcpServer = () =>
  new McpServer(
    {
      name: 'jocall3_node_api',
      version: '0.0.1',
    },
    { capabilities: { tools: {}, logging: {} } },
  );

// Create server instance
export const server = newMcpServer();

/**
 * Initializes the provided MCP Server with the given tools and handlers.
 * If not provided, the default client, tools and handlers will be used.
 */
export function initMcpServer(params: {
  server: Server | McpServer;
  clientOptions?: ClientOptions;
  mcpOptions?: McpOptions;
}) {
  const server = params.server instanceof McpServer ? params.server.server : params.server;

  const client = new Jocall3({
    ...{ environment: (readEnv('JOCALL3_ENVIRONMENT') || undefined) as any },

    ...params.clientOptions,
    defaultHeaders: {
      ...params.clientOptions?.defaultHeaders,
      'X-Stainless-MCP': 'true',
    },
  });

  const providedTools = selectTools(params.mcpOptions);
  const toolMap = Object.fromEntries(providedTools.map((mcpTool) => [mcpTool.tool.name, mcpTool]));

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: providedTools.map((mcpTool) => mcpTool.tool),
    };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    const mcpTool = toolMap[name];
    if (!mcpTool) {
      throw new Error(`Unknown tool: ${name}`);
    }

    return executeHandler(mcpTool.handler, client, args);
  });
}

/**
 * Selects the tools to include in the MCP Server based on the provided options.
 */
export function selectTools(options?: McpOptions): McpTool[] {
  const includedTools = [codeTool()];

  return includedTools;
}

/**
 * Runs the provided handler with the given client and arguments.
 */
export async function executeHandler(
  handler: HandlerFunction,
  client: Jocall3,
  args: Record<string, unknown> | undefined,
) {
  return await handler(client, args || {});
}

export const readEnv = (env: string): string | undefined => {
  if (typeof (globalThis as any).process !== 'undefined') {
    return (globalThis as any).process.env?.[env]?.trim();
  } else if (typeof (globalThis as any).Deno !== 'undefined') {
    return (globalThis as any).Deno.env?.get?.(env)?.trim();
  }
  return;
};

export const readEnvOrError = (env: string): string => {
  let envValue = readEnv(env);
  if (envValue === undefined) {
    throw new Error(`Environment variable ${env} is not set`);
  }
  return envValue;
};

export const requireValue = <T>(value: T | undefined, description: string): T => {
  if (value === undefined) {
    throw new Error(`Missing required value: ${description}`);
  }
  return value;
};
