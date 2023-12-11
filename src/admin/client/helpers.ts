import type { Entity } from '$admin/types';
import type { Document } from 'mongodb';
import { getEntitySchema } from './context';

export function humanize(str: string) {
  return str
      .replace(/^[\s_]+|[\s_]+$/g, '')
      .replace(/[_\s]+/g, ' ')
      .replace(/^[a-z]/, (m) => m.toUpperCase());
}

export function renderDocument(str: string, doc: Document): string {
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