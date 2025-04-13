import { LobeChatPluginManifest, PluginSchema } from '@lobehub/chat-plugin-sdk';
import { getConfig } from '../utils/config.js';
import { withClient } from '../utils/mcp.js';
import { Request, Response } from 'express';
import { port } from '../index.js';

manifestRoute.route = '/:identifier/manifest.json' as const;

export async function manifestRoute(req: Request, res: Response) {
  const { identifier } = req.params;
  const { onConnectSettings = {} } = getConfig(identifier, { env: process.env });
  const config = getConfig(identifier, { env: process.env, ...onConnectSettings });
  const serverUrl = getConfig().publicUrl ?? `${req.protocol}://${req.headers.host}`;

  const { tools } = await withClient(config, async (c) => c?.listTools() || { tools: [] });

  for (const lang of req.headers['accept-language']?.split(',') ?? []) {
    const langCode = lang.split(';')[0].trim();
    config.meta = { ...config.meta, ...(config[`meta:${langCode}`] ?? {}) };
  }
  const { author, createdAt, homepage, systemRole, settings, meta, gateway = true } = config;

  const api = tools.map((tool) => ({
    name: tool.name,
    description: tool.description ?? '',
    parameters: tool.inputSchema as PluginSchema,
    url: `${gateway ? `http://127.0.0.1:${port}` : `${serverUrl}`}/${identifier}/${tool.name}`,
  }));

  const result = {
    api,
    gateway: gateway ? `${serverUrl}/gateway` : undefined,
    identifier,
    meta,
    author,
    createdAt,
    homepage,
    systemRole,
    settings,
    type: 'default',
  } satisfies LobeChatPluginManifest;

  res.status(200).json(result);
}
