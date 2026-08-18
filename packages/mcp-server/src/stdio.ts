// REPOSITORY SOURCE: diplomat-bit/jocall3-node | PATH: diplomat-bit-jocall3-node-fae6abf/packages/mcp-server/src/stdio.ts
================================================================================

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { initMcpServer, newMcpServer } from './server';

export const launchStdioServer = async () => {
  const server = newMcpServer();

  initMcpServer({ server });

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('MCP Server running on stdio');
};
