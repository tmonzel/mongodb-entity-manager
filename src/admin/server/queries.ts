import type { FindActionInput, FindResult } from '$admin';
import { normalizeEntity } from '$admin/entity/resolver.server';
import { ObjectId } from 'mongodb';
import { getCollection,  } from './data';
import { getEntity } from '$admin/entity/map.server';

async function find(input: FindActionInput): Promise<FindResult> {
  const entity = getEntity(input.entityKey);

  if(!entity) {
    throw new Error(`Entity ${input.entityKey} does not exist`);
  }

  const collection = getCollection(input.entityKey);
  
  const page = input.page ?? 1;
  const filter = input.filter ?? {};
  const pageSize = input.pageSize ?? 0;
  const pageIndex = page - 1;
  
  const totalItems = await collection.countDocuments(filter);
  const documents = await collection.find(filter, { 
    skip: pageIndex * pageSize, 
    limit: pageSize === 0 ? undefined : pageSize 
  }).toArray();
  
  return {
    data: await Promise.all(documents.map(doc => normalizeEntity(entity, doc, { type: 'find' }, 0, entity.includes))),
    totalPages: Math.round(totalItems / pageSize),
    totalItems,
  };
}

async function findOne(input: { entityKey: string; id: string }) {
  const entity = getEntity(input.entityKey);

  if(!entity) {
    throw new Error(`Entity ${input} does not exist`);
  }
  
  const collection = getCollection(input.entityKey);
  const doc = await collection.findOne({ _id: new ObjectId(input.id) });

  if(!doc) {
    throw new Error(`Document not found`);
  }

  return normalizeEntity(entity, doc, { type: 'findOne' }, 0, entity.includes);
}

export const queries = {
  find,
  findOne
}
