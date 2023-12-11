import { getCollection } from './data';
import { createRouter, publicProcedure } from '$admin/rpc';
import { getEntity } from '$admin/server';
import type { CreateDocumentInput, UpdateDocumentInput } from './types';
import { ObjectId } from 'mongodb';
import { normalizeDocument } from './normalizer';
import { denormalizeDocument } from './denormalizer';

export const documentRouter = createRouter({
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
