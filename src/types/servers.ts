import { PluginSchema } from '@lobehub/chat-plugin-sdk';

interface Meta {
  avatar: string;
  title: string;
  description?: string;
  tags?: string[];
  category?: string;
}

interface ServerBase {
  author: string;
  createdAt: string;
  homepage: string;
  systemRole?: string;
  settings?: PluginSchema;
  onConnectSettings?: Record<string, unknown>;
  meta: Meta;
  gateway?: boolean;
  [localeMeta: `meta:${string}`]: Partial<Meta>;
}

interface OpenApiServer extends ServerBase {
  type: 'openapi';
  openapi: string;
}

interface McpSseServer extends ServerBase {
  type: 'mcp:sse';
  url: string;
  options: {
    eventSourceInit: RequestInit & { withCredentials?: boolean };
    requestInit: RequestInit;
  };
}

interface McpCommandServer extends ServerBase {
  type: 'mcp:command';
  command: string;
  args: string[];
  env: Record<string, string>;
}

export type IServer = OpenApiServer | McpSseServer | McpCommandServer;
