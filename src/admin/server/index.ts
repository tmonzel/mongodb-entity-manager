import { establishConnection } from './data';
import type { DocumentResolver } from '../types';
import type { AdminConfig } from '../types';
import type { Entity } from '$admin/entity';

export * from './data';

let configuration: AdminConfig;

export function getConfig(): AdminConfig {
  return configuration;
}

export function getEntity(name: string): Entity | undefined {
  return configuration.schema[name];
}

export function getResolver<T extends Document = any>(type: string): DocumentResolver<T> | undefined {
  return configuration.resolvers ? configuration.resolvers[type] : undefined;
}

export function initializeAdmin(config: AdminConfig) {
  // Establish connection to MongoDB
  establishConnection();

  configuration = config;
}
