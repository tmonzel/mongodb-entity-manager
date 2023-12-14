import type { Query } from '$admin';
import { getCollection, getEntity } from '$admin/server';
import type { Document, ObjectId } from 'mongodb';
import type { AbstractEntity } from '../types';
import type { RelationshipAttribute } from './types';
import { extractCoreFields, normalizeEntity } from '../normalizer.server';

export async function normalizeRelationshipAttribute(entity: AbstractEntity, attribute: RelationshipAttribute, key: string, doc: Document, query: Query): Promise<Document | Document[]> {
  const ref = attribute.ref ?? key;
  const refEntity = getEntity(ref);

  if(!refEntity) {
    return doc[key];
  }

  const refCollection = getCollection(ref);
  const refCoreFields = extractCoreFields(refEntity.attributes);

  if(attribute.type === 'relationship:has_many') {
    const documents = await refCollection.find({
      [entity.key]: doc['_id']
    }).toArray();

    return Promise.all(documents.map(doc => normalizeEntity(refEntity, doc, query, refCoreFields)));
  }

  if(attribute.type === 'relationship:belongs_to_many') {
    const documents = await refCollection.find({ 
      _id: { 
        $in: doc[key] as ObjectId[] 
      }
    }).toArray();

    return Promise.all(documents.map(doc => normalizeEntity(refEntity, doc, query, refCoreFields)));
  }

  if(attribute.type === 'relationship:belongs_to') {
    const document = await refCollection.findOne({ _id: doc[key] as ObjectId });

    if(!document) {
      throw new Error('Related document not found');
    }

    return normalizeEntity(refEntity, document, query, refCoreFields);
  }

  return doc[key];
}
