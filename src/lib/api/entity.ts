import { DataSource, getCollection } from '$lib/data';
import { createRouter, publicProcedure } from '$lib/rpc';
import type { Entity, EntityInput } from '$lib/types';
import { ObjectId } from 'mongodb';
import { schema } from './schema';

export const entities = createRouter({
	load: publicProcedure.input((name: unknown) => {
      if (typeof name === 'string') return name;

      throw new Error(`Invalid input: ${typeof name}`);
    }).query(async({ input }) => {

    const collection = getCollection(input);

		return {
      name: input,
      schema: schema[input],
      documents: await collection.findAll()
    } as Entity;
	}),

  loadDocument: publicProcedure.input((input: unknown) => {
    if (typeof input === 'object') return input as { id: string; name: string };
      throw new Error(`Invalid input: ${typeof input}`);
    }).query(async({ input }) => {

    
    const collection = DataSource.getCollection(input.name);
  
    return collection.findOne({ _id: new ObjectId(input.id) });
  }),

  saveDocument: publicProcedure
		.input((data: unknown) => {
			if (typeof data === 'object') return data as EntityInput;

			throw new Error(`Invalid input: ${typeof data}`);
		})
		.mutation(async ({ input }) => {
      const collection = DataSource.getCollection(input.name);
      
      
      if(input.data.id) {
        // Update
        await collection.updateOne({ _id: new ObjectId(input.data.id) }, { $set: input.data });
      } else {
        // Insert
        await collection.insertOne(input.data);
      }
		})
});