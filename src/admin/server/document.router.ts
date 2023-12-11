import { getCollection } from './data';
import { createRouter, publicProcedure } from '$admin/rpc';
import { getEntity, getResolver } from '$admin/server';
import type { CreateDocumentInput, UpdateDocumentInput } from './types';
import { ObjectId, type Document } from 'mongodb';
import type { Mutations, Queries } from './types';
import type { EntityAttributeMap } from '../types';

async function loadHasMany(entityName: string, ids: ObjectId[], query: Queries): Promise<Document[]> {
  const entity = getEntity(entityName);
  const collection = getCollection(entityName);
  const documents = await collection.find({ _id: { $in: ids }}).toArray();

  return documents.map(doc => normalizeDocument(entityName, entity.attributes, doc, query));
}

async function loadHasOne(entityName: string, id: ObjectId, query: Queries): Promise<Document> {
  const entity = getEntity(entityName);
  const collection = getCollection(entityName);
  const document = await collection.findOne({ _id: id });

  if(!document) {
    throw new Error('Related document not found');
  }

  return normalizeDocument(entityName, entity.attributes, document, query);
}

export async function normalizeDocument(entityName: string, attributes: EntityAttributeMap, doc: Document, query: Queries): Promise<Document> {
  for(const [key, attribute] of Object.entries(attributes)) {
    switch(attribute.type) {
      case 'relationship:has-many':
        doc[key] = await loadHasMany(attribute.target ?? key, doc[key] as ObjectId[], query);
        break;
      case 'relationship:has-one':
        doc[key] = await loadHasOne(attribute.target ?? key, doc[key] as ObjectId, query);
        break;
      case 'embed':
        if(!Array.isArray(doc[key])) {
          doc[key] = [];
        }
        
        doc[key] = (doc[key] as Document[]).map(doc => normalizeDocument(key, attribute.entity.attributes, doc, query));

        break;
    }
  }

  if(doc['_id'] !== undefined) {
    doc['id'] = doc['_id'] + '';
    delete doc['_id'];
  }

  const resolver = getResolver(entityName);

  return resolver && resolver.normalize ? resolver.normalize(doc, query) : doc;
}

export function denormalizeDocument(entityName: string, attributes: EntityAttributeMap, data: any, mutation: Mutations): Document {
  const result: Document = {};

  for(const [key, attr] of Object.entries(attributes)) {
    switch(attr.type) {
      case 'relationship:has-many':
        result[key] = (data[key] as string[]).map(id => new ObjectId(id))
        break;
      case 'relationship:has-one':
        result[key] = new ObjectId(data[key])
        break;
      case 'number':
        result[key] = parseFloat(data[key]);
        break;
      case 'embed':
        result[key] = (data[key] as Document[]).map(doc => denormalizeDocument(key, attr.entity.attributes, doc, mutation));
        break;
      default:
        result[key] = data[key]
    }
  }

  const resolver = getResolver(entityName);

  return resolver && resolver.denormalize ? resolver.denormalize(result, mutation) : result;
}

export const documents = createRouter({
	loadAll: publicProcedure.input((name: unknown) => {
      if (typeof name === 'string') return name;

      throw new Error(`Invalid input: ${typeof name}`);
    }).query(async({ input }) => {

    const collection = getCollection(input);
    const documents = await collection.find({}).toArray();
    const entity = getEntity(input);

		return Promise.all(documents.map(doc => normalizeDocument(input, entity.attributes, doc, 'loadAll')));
	}),

  loadOne: publicProcedure.input((input: unknown) => {
    if (typeof input === 'object') return input as { id: string; name: string };
      throw new Error(`Invalid input: ${typeof input}`);
    }).query(async({ input }) => {

    
    const collection = getCollection(input.name);
    const doc = await collection.findOne({ _id: new ObjectId(input.id) });

    if(!doc) {
      throw new Error(`Document not found`);
    }

    const entity = getEntity(input.name);
  
    return normalizeDocument(input.name, entity.attributes, doc, 'loadOne');
  }),

  deleteOne: publicProcedure.input((input: unknown) => {
    if (typeof input === 'object') return input as { id: string; name: string };
      throw new Error(`Invalid input: ${typeof input}`);
    }).mutation(async({ input }) => {

    
    const collection = getCollection(input.name);
  
    await collection.deleteOne({ _id: new ObjectId(input.id) });
  }),

  updateOne: publicProcedure
		.input((data: unknown) => {
			if (typeof data === 'object') return data as UpdateDocumentInput;

			throw new Error(`Invalid input: ${typeof data}`);
		})
		.mutation(async ({ input }) => {
      const entity = getEntity(input.entityName);
      const collection = getCollection(input.entityName);
      
      await collection.updateOne(
        { _id: new ObjectId(input.id) }, 
        { $set: denormalizeDocument(input.entityName, entity.attributes, input.changes, 'updateOne') }
      );
		}),

  create: publicProcedure
		.input((data: unknown) => {
			if (typeof data === 'object') return data as CreateDocumentInput;

			throw new Error(`Invalid input: ${typeof data}`);
		})
		.mutation(async ({ input }) => {
      const entity = getEntity(input.entityName);
      const collection = getCollection(input.entityName);
      
      await collection.insertOne(denormalizeDocument(input.entityName, entity.attributes, input.data, 'create'));
		})
});
