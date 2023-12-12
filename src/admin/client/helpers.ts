import type { AbstractEntity, EntityAttribute } from '$admin/types';
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

export function renderEntityDocument(entityName: string, doc: Document): string {
  const schema = getEntitySchema();
  const entity = schema[entityName];

  if(!entity || !entity.renderAs) {
    return doc.id;
  }

  return renderDocument(entity.renderAs, doc);
}

export function renderAttributeValue(attr: EntityAttribute, name: string, doc: Document): string {

  if(attr.type === 'object' && attr.renderAs) {
    return renderDocument(attr.renderAs, doc[name]);
  }

  if(attr.type === 'relationship:belongs_to') {
    return renderEntityDocument(attr.ref ?? name, doc[name]);
  }

  if(attr.type === 'relationship:belongs_to_many' || attr.type === 'relationship:has_many') {
    if(Array.isArray(doc[name])) {
      if(doc[name].length === 0) {
        return '[]';
      }

      return doc[name].map((d: Document) => renderEntityDocument(attr.ref ?? name, d))
    }

    return renderEntityDocument(attr.ref ?? name, doc[name]);
  }

  return doc[name] ?? '-'
}

export function renderAttributeLabel(entity: AbstractEntity, key: string): string {
  const attr = entity.attributes[key];
  
  return attr.label ?? humanize(key); 
}
