import { establishConnection } from './data';
import type { AdminConfig, Entity } from './types';

let configuration: AdminConfig;

export function getConfig(): AdminConfig {
  return configuration;
}

export function getEntity(name: string): Entity {
  return configuration.schema[name];
}

export function initializeAdmin(config: AdminConfig) {
  // Establish connection to MongoDB
  establishConnection();

  configuration = config;
}
