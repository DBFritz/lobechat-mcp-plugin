import { readFile } from 'fs/promises';
import { readFileSync } from 'fs';
import { IConfig } from '../types/config.js';
import { IServer } from '../types/servers.js';
import { template } from './template.js';
import { watchFile } from 'fs';

const configPath = process.env.CONFIG_PATH ?? './config.json';

let configFileContent = readFileSync(configPath, 'utf8');

watchFile(configPath, async () => {
  // eslint-disable-next-line no-console
  console.log('Config file changed');
  configFileContent = await readFile(configPath, 'utf8');
});

export function getConfig(settings?: Record<string, unknown>): IConfig;
export function getConfig(key: string, settings?: Record<string, unknown>): IServer;
export function getConfig(
  keyOrSettings: string | Record<string, unknown> = {},
  _settings: Record<string, unknown> = {}
) {
  const [key, settings] =
    typeof keyOrSettings === 'string' ? [keyOrSettings, _settings] : [undefined, keyOrSettings];
  const config: IConfig = JSON.parse(template(settings, configFileContent));
  if (key) return config.servers[key];
  return config;
}
