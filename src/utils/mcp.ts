import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { IServer } from '../types/servers.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';
import type { EventSourceInit } from 'eventsource';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';

async function getTransport(config: IServer) {
  if (config.type === 'mcp:command') {
    return new StdioClientTransport(config);
  }
  if (config.type !== 'mcp:sse') throw new Error('Invalid transport type');
  const url = new URL(config.url);
  const { eventSourceInit, requestInit } = config.options ?? {};

  const sourceInit: EventSourceInit = {
    fetch: (url, init) => fetch(url, { ...init, ...eventSourceInit }),
    withCredentials: eventSourceInit?.withCredentials,
  };

  return new SSEClientTransport(url, {
    eventSourceInit: eventSourceInit ? sourceInit : undefined,
    requestInit,
  });
}

const name = process.env.npm_package_name ?? 'lobechat-mcp-plugin';
const version = process.env.npm_package_version ?? '1.0.0';

// Caching client to avoid creating a new client for each request since it's expensive
const connections = new Map<string, Client>();
const connectionTimeout = process.env.MCP_CONNECTION_TIMEOUT
  ? +process.env.MCP_CONNECTION_TIMEOUT
  : 60 * 1000;

export const withClient = async <T>(
  config: IServer,
  callback: (client: Client | undefined) => T
): Promise<T> => {
  if (config?.type === 'openapi') return await callback(undefined);
  const connectionKey = JSON.stringify(config);
  const client = new Client({ name, version });

  if (connections.has(connectionKey)) {
    return await callback(connections.get(connectionKey));
  }

  try {
    const transport = await getTransport(config);
    await client.connect(transport);
    connections.set(connectionKey, client);
    return await callback(client);
  } finally {
    setTimeout(async () => {
      connections.delete(connectionKey);
      await client.close();
    }, connectionTimeout);
  }
};
