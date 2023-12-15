import type { Query } from '$admin';
import { getCollection } from '$admin/server';
import type { Document, ObjectId } from 'mongodb';
import type { AbstractEntity, EntityAttributeResolver, EntityNormalizer } from '../types';
import type { RelationshipAttribute } from './types';
import { getEntity } from '../map.server';
import { getCoreFieldsFromAttributes } from '../helpers';

export const RelationshipAttributeResolver: EntityAttributeResolver<RelationshipAttribute> = {
  async normalize(
    doc: Document, 
    attribute: RelationshipAttribute, 
    entity: AbstractEntity, 
    key: string, 
    query: Query, 
    normalizer: EntityNormalizer
  ): Promise<Document | Document[]> {
    const ref = attribute.ref ?? key;
    const refEntity = getEntity(ref);
  
    if(!refEntity) {
      return doc[key];
    }
  
    const refCollection = getCollection(ref);
    const refCoreFields = getCoreFieldsFromAttributes(refEntity.attributes);
  
    if(attribute.type === 'relationship:has_many') {
      const documents = await refCollection.find({
        [entity.key]: doc['_id']
      }).toArray();
  
      return Promise.all(documents.map(doc => normalizer(refEntity, doc, query, refCoreFields)));
    }
  
    if(attribute.type === 'relationship:belongs_to_many') {
      const documents = await refCollection.find({ 
        _id: { 
          $in: doc[key] as ObjectId[] 
        }
      }).toArray();
  
      return Promise.all(documents.map(doc => normalizer(refEntity, doc, query, refCoreFields)));
    }
  
    if(attribute.type === 'relationship:belongs_to') {
      const document = await refCollection.findOne({ _id: doc[key] as ObjectId });
  
      if(!document) {
        throw new Error('Related document not found');
      }
  
      return normalizer(refEntity, document, query, refCoreFields);
    }
  
    return doc[key];
  }
}
