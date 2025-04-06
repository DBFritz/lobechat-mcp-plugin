import { getConfig } from '../utils/config.js';
import { Request, Response } from 'express';

pluginListRoute.route = /^\/(index.*\.json)?$/;

export async function pluginListRoute(req: Request, res: Response) {
  const config = await getConfig();
  const lang = req.url?.match(/index\.(.+)\.json/)?.[1];

  const baseUrl = config.publicUrl ?? `${req.protocol}://${req.headers.host}`;
  const upstreamData = await Promise.all(
    (config.upstream ?? []).map((server: string) => fetch(server).then((res) => res.json()))
  );

  const newPlugins = Object.entries(config.servers).map(([identifier, config]) => ({
    author: config.author,
    createdAt: config.createdAt,
    homepage: config.homepage,
    identifier,
    manifest: `${baseUrl}/${identifier}/manifest.json`,
    settings: config.settings,
    meta: { ...config.meta, ...(config[`meta:${lang}`] ?? {}) },
  }));
  const newTags = Object.values(config.servers).flatMap((s) => s.meta?.tags ?? []);

  const upstreamPlugins = upstreamData.flatMap((s) => s.plugins);

  const upstreamTags = upstreamData.flatMap((s) => s.tags);

  res.status(200).json({
    schemaVersion: 1,
    plugins: [...newPlugins, ...upstreamPlugins],
    tags: [...new Set([...newTags, ...upstreamTags])],
  });
}
