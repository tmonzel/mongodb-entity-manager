import { FormControl } from '$admin/form';
import type { Document } from 'mongodb';
import type { EntityAttributeMap, EntityAttributeModule } from '../types';
import EmbedAttributeControl from './EmbedAttributeControl.svelte';
import type { EmbedAttribute } from './types';

export function normalizeDocument(attributes: EntityAttributeMap, value: Document): Document {
  const doc: Document = {};

  for(const [name, attr] of Object.entries(attributes)) {
    const attrValue = value[name];
    
    if(attrValue === undefined) {
      continue;
    }

    switch(attr.type) {
      case 'relationship:belongs_to':
        doc[name] = attrValue.id;
        break;
      case 'relationship:belongs_to_many':
        doc[name] = (attrValue as Document[]).map(d => d.id);
        break;
      case 'object':
        doc[name] = normalizeDocument(attr.attributes, attrValue);
        break;
      default:
        doc[name] = attrValue;
    }
  }

  return doc;
}


export const EmbedAttributeModule: EntityAttributeModule<EmbedAttribute> = {
  createControl(value: Document[], attr: EmbedAttribute) {
    
    return new FormControl<Document[]>(
      value 
      ? value.map(doc => normalizeDocument(attr.entity.attributes, doc)) 
      : []
    );
  },

  edit: EmbedAttributeControl,
}
