import { getCollection } from '$admin/data';
import { createRouter, publicProcedure } from '$admin/rpc';
import { getEntity } from '$admin/server';
import type { CreateDocumentInput, Entity, UpdateDocumentInput } from '../types';
import { ObjectId, type Document } from 'mongodb';

async function loadRelatedDocuments(targetEntityName: string, doc: Document): Promise<Document[]> {
  const collection = getCollection(targetEntityName);
  const $in = doc[targetEntityName] as ObjectId[];
  const documents = await collection.find({ _id: { $in }}).toArray();

  return documents.map(doc => normalizeDocument(doc));
}

function normalizeDocument(doc: Document): Document {
  if(doc['_id'] !== undefined) {
    doc['id'] = doc['_id'] + '';
    delete doc['_id'];
  }

  return doc;
}

export async function resolveDocument(entity: Entity, doc: Document): Promise<Document> {
  for(const [key, attribute] of Object.entries(entity.attributes)) {
    switch(attribute.type) {
      case 'relationship:has-many':
        doc[key] = await loadRelatedDocuments(attribute.target ?? key, doc);
    }
  }

  return normalizeDocument(doc);
}

export function denormalizeDocument(entity: Entity, data: any): Document {
  const result: Document = {};

  for(const [key, attr] of Object.entries(entity.attributes)) {
    switch(attr.type) {
      case 'relationship:has-many':
        result[key] = (data[key] as string[]).map(id => new ObjectId(id))
        break;
      case 'relationship:has-one':
          result[key] = new ObjectId(data[key])
          break;
      default:
        result[key] = data[key]
    }
  }

  return result;
}

export const documents = createRouter({
	loadAll: publicProcedure.input((name: unknown) => {
      if (typeof name === 'string') return name;

      throw new Error(`Invalid input: ${typeof name}`);
    }).query(async({ input }) => {

    const collection = getCollection(input);
    const documents = await collection.find({}).toArray();
    const entity = getEntity(input);

		return Promise.all(documents.map(doc => resolveDocument(entity, doc)));
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
  
    return await resolveDocument(entity, doc);
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
        { $set: denormalizeDocument(entity, input.changes) }
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
      
      await collection.insertOne(denormalizeDocument(entity, input.data));
		})
});
