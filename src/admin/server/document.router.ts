import { getCollection } from './data';
import { createRouter, publicProcedure } from '$admin/rpc';
import { getEntity } from '$admin/server';
import type { CreateDocumentInput, UpdateDocumentInput } from './types';
import { ObjectId } from 'mongodb';
import { normalizeEntity } from './normalizer';
import { denormalizeDocument } from './denormalizer';
import type { FindActionInput, FindResult } from '$admin/types';

export const documentRouter = createRouter({

  // Load collection view
	find: publicProcedure.input((input: unknown) => {
      if (typeof input === 'object') return input as FindActionInput;

      throw new Error(`Invalid input: ${typeof input}`);
    }).query<FindResult>(async({ input }) => {

    const collection = getCollection(input.entityName);
    const entity = getEntity(input.entityName);

    if(!entity) {
      throw new Error(`Entity ${input} does not exist`);
    }

    const filter = input.filter ?? {};
    const pageSize = input.pageSize ?? 25;
    const pageIndex = input.page - 1;
    
    const totalItems = await collection.countDocuments(filter);
    const documents = await collection.find(filter, { skip: pageIndex * pageSize, limit: pageSize }).toArray();

    // Include all toplevel fields for now
    const fields = Object.keys(entity.attributes);

		return {
      data: await Promise.all(documents.map(doc => normalizeEntity(entity, doc, { type: 'find' }, fields))),
      totalPages: Math.round(totalItems / pageSize),
      totalItems,
    } as FindResult;
	}),

  findOne: publicProcedure.input((input: unknown) => {
    if (typeof input === 'object') return input as { id: string; name: string };
      throw new Error(`Invalid input: ${typeof input}`);
    }).query(async({ input }) => {

    
    const collection = getCollection(input.name);
    const doc = await collection.findOne({ _id: new ObjectId(input.id) });

    if(!doc) {
      throw new Error(`Document not found`);
    }

    const entity = getEntity(input.name);

    if(!entity) {
      throw new Error(`Entity ${input} does not exist`);
    }

    // Include all toplevel fields for now
    const fields = Object.keys(entity.attributes);
  
    return normalizeEntity(entity, doc, { type: 'findOne' }, fields);
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

      if(!entity) {
        throw new Error(`Entity ${input} does not exist`);
      }
      
      await collection.updateOne(
        { _id: new ObjectId(input.id) }, 
        { $set: denormalizeDocument(input.entityName, entity.attributes, input.changes, { type: 'updateOne' }) }
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

      if(!entity) {
        throw new Error(`Entity ${input} does not exist`);
      }
      
      await collection.insertOne(denormalizeDocument(input.entityName, entity.attributes, input.data, { type: 'create' }));
		}),

  loadEmbed: publicProcedure
		.input((data: unknown) => {
			if (typeof data === 'object') return data as any;

			throw new Error(`Invalid input: ${typeof data}`);
		})
		.query(async ({ input }) => {
      const entity = getEntity(input.entityName);

      if(!entity) {
        throw new Error(`Entity ${input} does not exist`);
      }

      const embedAttribute = entity.attributes[input.embedName];

      if(embedAttribute.type !== 'embed') {
        throw new Error(`This attribute is not of type 'embed'`);
      }

      // Include all toplevel fields for now
      const fields = Object.keys(embedAttribute.entity.attributes);

      // Need to find a better solution
      const denormalizedDocument = denormalizeDocument(input.embedName, embedAttribute.entity.attributes, input.data, { type: 'embed' });

      return normalizeEntity(
        embedAttribute.entity, 
        denormalizedDocument, 
        {
          type: 'loadEmbed'
        },
        fields
      );
		})
});
