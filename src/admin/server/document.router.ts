import { getCollection } from './data';
import { createRouter, publicProcedure } from '$admin/rpc';
import { getEntity } from '$admin/server';
import type { CreateDocumentInput, UpdateDocumentInput } from './types';
import { ObjectId } from 'mongodb';
import { normalizeEntity } from './normalizer';
import { denormalizeDocument } from './denormalizer';

export const documentRouter = createRouter({

  // Load collection view
	loadAll: publicProcedure.input((name: unknown) => {
      if (typeof name === 'string') return name;

      throw new Error(`Invalid input: ${typeof name}`);
    }).query(async({ input }) => {

    const collection = getCollection(input);
    const documents = await collection.find({}).toArray();
    const entity = getEntity(input);

    if(!entity) {
      throw new Error(`Entity ${input} does not exist`);
    }

    // Include all toplevel fields for now
    const fields = Object.keys(entity.attributes);

		return Promise.all(documents.map(doc => normalizeEntity(entity, doc, { type: 'loadAll' }, fields)));
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

    if(!entity) {
      throw new Error(`Entity ${input} does not exist`);
    }

    // Include all toplevel fields for now
    const fields = Object.keys(entity.attributes);
  
    return normalizeEntity(entity, doc, { type: 'loadOne' }, fields);
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
