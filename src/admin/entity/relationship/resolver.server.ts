import type { Query } from '$admin';
import { getCollection } from '$admin/server';
import { ObjectId, type Document } from 'mongodb';
import type { EntityAttributeResolver, EntityNormalizer } from '../types';
import type { RelationshipAttribute } from './types';
import { getEntity } from '../map.server';

export const RelationshipAttributeResolver: EntityAttributeResolver<RelationshipAttribute> = {
  async normalize(
    doc: Document, 
    attribute: RelationshipAttribute, 
    key: string, 
    query: Query, 
    depth: number,
    normalizer: EntityNormalizer
  ): Promise<Document | Document[] | null> {
    const ref = attribute.ref ?? key;
    const refEntity = getEntity(ref);
  
    if(!refEntity) {
      return doc[key];
    }
  
    const refCollection = getCollection(ref);
    const refIncludes = refEntity.includes;
  
    if(attribute.type === 'relationship:has_many') {
      if(!attribute.foreignKey) {
        throw new Error('Foreign Key missing for has_many relationship');
      }

      const documents = await refCollection.find({
        [attribute.foreignKey]: doc['_id']
      }).toArray();
  
      return Promise.all(documents.map(doc => normalizer(refEntity, doc, query, depth + 1, refIncludes)));
    }
  
    if(attribute.type === 'relationship:belongs_to_many') {
      const documents = await refCollection.find({ 
        _id: { 
          $in: doc[key] as ObjectId[] 
        }
      }).toArray();
  
      return Promise.all(documents.map(doc => normalizer(refEntity, doc, query, depth + 1, refIncludes)));
    }
  
    if(attribute.type === 'relationship:belongs_to') {
      console.log(doc, key);
      
      const document = await refCollection.findOne({ _id: doc[key] as ObjectId });
      
      if(!document) {
        return null;
      }
  
      return normalizer(refEntity, document, query, depth + 1, refIncludes);
    }
  
    return doc[key];
  },

  async denormalize(doc: Document, attribute: RelationshipAttribute, key: string) {
    switch(attribute.type) {
      case 'relationship:belongs_to_many':
        return (doc[key] as string[]).map(id => new ObjectId(id));
      case 'relationship:belongs_to':
        return new ObjectId(doc[key]);
      default:
        return doc[key];
    }
  }
}
