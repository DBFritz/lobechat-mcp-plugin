import { IServer } from './servers.js';

export interface IConfig {
  upstream: string[];
  publicUrl: string;
  servers: Record<string, IServer>;
}
