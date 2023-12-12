import type { Document, ObjectId } from 'mongodb';
import { getCollection, getEntity, getResolver } from '.';
import type { AbstractEntity, EmbedAttribute, Entity, EntityAttributeMap, RelationshipAttribute } from '$admin/types';
import type { Query } from './types';

function extractCoreFields(attributes: EntityAttributeMap) {
  return Object.entries(attributes)
    .filter(([, attr]) => attr.core && attr.core === true)
    .map(([key]) => key);
}

async function normalizeRelationshipAttribute(entity: AbstractEntity, attribute: RelationshipAttribute, key: string, doc: Document, query: Query): Promise<Document | Document[]> {
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

export async function normalizeEmbedAttribute(attr: EmbedAttribute, value: any, query: Query): Promise<Document[]> {
  if(!Array.isArray(value)) {
    return [];
  }

  return await Promise.all(
    (value as Document[]).map(
      (doc) => {
        return normalizeEntity(attr.entity, doc, query, extractCoreFields(attr.entity.attributes));
      }
    )
  );
}

export async function normalizeEntity(entity: Entity, doc: Document, query: Query, fields: string[] = []): Promise<Document> {
  const resultDoc: Document = {};

  for(const [key, attribute] of Object.entries(entity.attributes)) {
    if(fields.indexOf(key) === -1) {
      continue;
    }

    switch(attribute.type) {
      case 'relationship:has_many':
      case 'relationship:belongs_to_many':
      case 'relationship:belongs_to':
        resultDoc[key] = await normalizeRelationshipAttribute(entity, attribute, key, doc, query);
        break;
      case 'embed':
        resultDoc[key] = await normalizeEmbedAttribute(attribute, doc[key], query);
        break;
      default:
        resultDoc[key] = doc[key];
    }
  }
  
  if(doc['_id'] !== undefined) {
    resultDoc['id'] = doc['_id'] + '';
  }

  const resolver = entity ? getResolver(entity.type) : null;

  return resolver && resolver.normalize ? resolver.normalize(resultDoc, query) : resultDoc;
}
