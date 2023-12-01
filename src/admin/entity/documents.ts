import { DataSource, mapDocument } from '$admin/data';
import { createRouter, publicProcedure } from '$admin/rpc';
import type { CreateDocumentInput, UpdateDocumentInput } from '../types';
import { ObjectId } from 'mongodb';

export const documents = createRouter({
	loadAll: publicProcedure.input((name: unknown) => {
      if (typeof name === 'string') return name;

      throw new Error(`Invalid input: ${typeof name}`);
    }).query(async({ input }) => {

    const collection = DataSource.getCollection(input);
    const documents = await collection.find({}).toArray();

		return documents.map(doc => mapDocument(doc));
	}),

  loadOne: publicProcedure.input((input: unknown) => {
    if (typeof input === 'object') return input as { id: string; name: string };
      throw new Error(`Invalid input: ${typeof input}`);
    }).query(async({ input }) => {

    
    const collection = DataSource.getCollection(input.name);
  
    return collection.findOne({ _id: new ObjectId(input.id) });
  }),

  deleteOne: publicProcedure.input((input: unknown) => {
    if (typeof input === 'object') return input as { id: string; name: string };
      throw new Error(`Invalid input: ${typeof input}`);
    }).mutation(async({ input }) => {

    
    const collection = DataSource.getCollection(input.name);
  
    await collection.deleteOne({ _id: new ObjectId(input.id) });
  }),

  updateOne: publicProcedure
		.input((data: unknown) => {
			if (typeof data === 'object') return data as UpdateDocumentInput;

			throw new Error(`Invalid input: ${typeof data}`);
		})
		.mutation(async ({ input }) => {
      const collection = DataSource.getCollection(input.entityName);
      
      await collection.updateOne({ _id: new ObjectId(input.id) }, { $set: input.changes });
		}),

  create: publicProcedure
		.input((data: unknown) => {
			if (typeof data === 'object') return data as CreateDocumentInput;

			throw new Error(`Invalid input: ${typeof data}`);
		})
		.mutation(async ({ input }) => {
      const collection = DataSource.getCollection(input.entityName);
      
      
      if(input.data.id) {
        // Update
        await collection.updateOne({ _id: new ObjectId(input.data.id) }, { $set: input.data });
      } else {
        // Insert
        await collection.insertOne(input.data);
      }
		})
});