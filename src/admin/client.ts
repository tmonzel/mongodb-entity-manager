import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { Router } from './router';
import { RPC_URL } from './constants';
import type { Document } from 'mongodb';
import type { Entity, EntitySchema } from './types';
import { getContext } from 'svelte';
import { humanize } from './entity/utils';

export const actions = createTRPCProxyClient<Router>({
	links: [
		httpBatchLink({
			url: RPC_URL
		})
	]
});

function renderDocument(str: string, doc: Document): string {
  return str.replace(/(\{([a-zA-Z]+)\})+/g, (match, ...groups) => {
    const attrName = groups[1];
    
    return doc && doc[attrName] ? doc[attrName] : '-';
  })
}

export function renderAttributeValue(entity: Entity, name: string, doc: Document): string {
  const attr = entity.attributes[name];

  if(attr.type === 'object' && attr.renderAs) {
    return renderDocument(attr.renderAs, doc[name]);
  }

  if(attr.type === 'relationship:has-one') {
    const schema = getEntitySchema();
    const relatedSchema = schema[attr.target ?? name];

    return relatedSchema.renderAs ? renderDocument(relatedSchema.renderAs, doc[name]) : doc.name;
  }

  if(attr.type === 'relationship:has-many') {
    const schema = getEntitySchema();
    const relatedSchema = schema[attr.target ?? name];

    if(Array.isArray(doc[name])) {
      if(doc[name].length === 0) {
        return '[]';
      }

      return doc[name].map((d: Document) => {
        return relatedSchema.renderAs ? renderDocument(relatedSchema.renderAs, d) : d.name
      })
    }

    return relatedSchema.renderAs ? renderDocument(relatedSchema.renderAs, doc[name]) : '';
  }

  return doc[name] ?? '-'
}

export function renderAttributeLabel(entity: Entity, key: string): string {
  const attr = entity.attributes[key];
  
  return attr.label ?? humanize(key); 
}

export function getEntitySchema(): EntitySchema {
  return getContext<EntitySchema>('schema');
}
