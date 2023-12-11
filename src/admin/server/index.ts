import { establishConnection } from './data';
import type { DocumentResolver } from './types';
import type { AdminConfig, Entity } from '../types';

export * from './data';

let configuration: AdminConfig;

export function getConfig(): AdminConfig {
  return configuration;
}

export function getEntity(name: string): Entity {
  return configuration.schema[name];
}

export function getResolver(name: string): DocumentResolver | undefined {
  return configuration.resolvers ? configuration.resolvers[name] : undefined;
}

export function initializeAdmin(config: AdminConfig) {
  // Establish connection to MongoDB
  establishConnection();

  configuration = config;
}
