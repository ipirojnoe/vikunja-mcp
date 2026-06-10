import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { AuthManager } from '../../src/auth/AuthManager';
import type { VikunjaClientFactory } from '../../src/client/VikunjaClientFactory';
import { registerTools } from '../../src/tools';

describe('tools/list integration', () => {
  let client: Client | undefined;
  let server: McpServer | undefined;

  afterEach(async () => {
    await client?.close();
    await server?.close();
  });

  it('serializes every registered tool schema without Zod internals', async () => {
    const authManager = {
      isAuthenticated: jest.fn().mockReturnValue(false),
      getAuthType: jest.fn().mockReturnValue('api-token'),
    } as unknown as AuthManager;
    const clientFactory = {} as VikunjaClientFactory;

    server = new McpServer({ name: 'vikunja-mcp-test', version: '1.0.0' });
    registerTools(server, authManager, clientFactory);

    client = new Client({ name: 'vikunja-mcp-test-client', version: '1.0.0' });
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

    await Promise.all([
      server.connect(serverTransport),
      client.connect(clientTransport),
    ]);

    const result = await client.listTools();

    expect(result.tools.length).toBeGreaterThan(0);
    for (const tool of result.tools) {
      expect(tool.inputSchema).toMatchObject({ type: 'object' });
    }
    expect(JSON.stringify(result.tools)).not.toContain('"_zod"');
  });
});
