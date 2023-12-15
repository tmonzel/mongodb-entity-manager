import { createRouter, publicProcedure } from '$admin/rpc';
import type { CreateDocumentInput, FindActionInput, UpdateDocumentInput } from '../types';
import { normalizeEntity, denormalizeEntity } from '$admin/entity/resolver.server';
import { queries } from './queries';
import { mutations } from './mutations';
import { getEntity } from '$admin/entity/map.server';

export const documentRouter = createRouter({

  // Load collection view
	find: publicProcedure.input((input: unknown): FindActionInput => {
    if (!input || typeof input !== 'object') {
      throw new Error(`Input type must be object`);
    }

    if(!('entityName' in input) || typeof input.entityName !== 'string') {
      throw new Error(`No entityName given`);
    }

    return input as FindActionInput;
  }).query(
    ({ input }) => queries.find(input)
  ),

  findOne: publicProcedure.input((input: unknown) => {
    if (!input || typeof input !== 'object') {
      throw new Error(`Invalid input: ${typeof input}`);
    }

    return input as { entityName: string; id: string; };
  }).query(
    ({ input }) => queries.findOne(input)
  ),

  deleteOne: publicProcedure.input((input: unknown) => {
    if (typeof input !== 'object') {
      throw new Error(`Invalid input: ${typeof input}`);
    }

    return input as { entityName: string; id: string; };
  }).mutation(
    ({ input }) => mutations.deleteOne(input)
  ),

  updateOne: publicProcedure.input((input: unknown) => {
    if (typeof input !== 'object') {
      throw new Error(`Invalid input: ${typeof input}`);
    }
			
    return input as UpdateDocumentInput;
  }).mutation(
    ({ input }) => mutations.updateOne(input)
  ),

  create: publicProcedure.input((input: unknown) => {
    if (typeof input === 'object') {
      throw new Error(`Invalid input: ${typeof input}`);
    }

    return input as CreateDocumentInput;
  }).mutation(
    ({ input }) => mutations.create(input)
  ),

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
      const denormalizedDocument = await denormalizeEntity(input.embedName, embedAttribute.entity.attributes, input.data, { type: 'embed' });

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
