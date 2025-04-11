import { getConfig } from '../utils/config.js';
import { withClient } from '../utils/mcp.js';
import { Request, Response } from 'express';

toolRoute.route = '/:identifier/:name' as const;

export async function toolRoute(req: Request, res: Response) {
  try {
    const settings = JSON.parse((req.headers['x-lobe-plugin-settings'] as string) ?? '{}');
    const { identifier, name } = req.params;
    const config = getConfig(identifier, {
      env: process.env,
      ...settings,
    });

    const args = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    const result = await withClient(config, (client) =>
      client?.callTool({ name, arguments: args })
    );

    if (!result) {
      return res.status(500).json({ error: 'Failed to call tool' });
    }

    if ('isError' in result && result.isError) {
      return res.status(400).json(result);
    }

    if ('content' in result && Array.isArray(result.content)) {
      if (result.content.length !== 1) {
        return res.status(200).json(result.content);
      }
      const content = result.content[0];
      if ('type' in content && content.type === 'text') {
        return res.status(200).end(content.text);
      }
    }

    res.status(200).json(result);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
