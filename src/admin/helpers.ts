import type { Document } from 'mongodb';
import { getContext } from 'svelte';
import type { Entity, EntitySchema } from './entity';

export function humanize(str: string) {
  return str
      .replace(/^[\s_]+|[\s_]+$/g, '')
      .replace(/[_\s]+/g, ' ')
      .replace(/([a-z]+)([A-Z]+)/g, '$1 $2')
      .replace(/^[a-z]/, (m) => m.toUpperCase());
}

export function extractMimeFromBase64(str: string) {
  return str.match(/^data:([\w/]+);/)?.[1];
}

export function renderDocument(str: string, doc: Document): string {
  return str.replace(/(\{([a-zA-Z]+)\})+/g, (match, ...groups) => {
    const attrName = groups[1];
    
    return doc && doc[attrName] ? doc[attrName] : '-';
  })
}

export function renderEntityDocument(entityName: string, doc: Document): string {
  const schema = getContext<EntitySchema>('schema');
  const entity = schema[entityName];

  if(!entity || !entity.renderAs) {
    return doc.id;
  }

  return renderDocument(entity.renderAs, doc);
}

export function renderAttributeColumn(entity: Entity, key: string): string {
  if(entity.labels && entity.labels[key]) {
    return entity.labels[key];
  }
  
  return humanize(key); 
}

export function isActionAllowed(entity: Entity, actionName: string): boolean {
  return entity.actions ? entity.actions.indexOf(actionName) !== -1 : false;
}
