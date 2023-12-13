import type { AbstractAttribute, AbstractEntity, Entity, EntityAttribute } from '$admin/types';
import type { Document } from 'mongodb';
import { getEntitySchema } from './context';

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

  if(attr.type === 'select') {
    if(!Array.isArray(doc[name]) || doc[name].length === 0) {
      return '-';
    }

    return (doc[name] as string[])
      .map(v => attr.options.find(opt => opt.value === v))
      .map(p => p?.name)
      .join(', ');
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

export function renderAttributeLabel(attr: AbstractAttribute, key: string): string {
  return attr.label ?? humanize(key); 
}

export function renderAttributeColumn(entity: AbstractEntity, key: string): string {
  if(entity.labels && entity.labels[key]) {
    return entity.labels[key];
  }
  
  return humanize(key); 
}

export function isActionAllowed(entity: Entity, actionName: string): boolean {
  return entity.actions ? entity.actions.indexOf(actionName) !== -1 : false;
}
