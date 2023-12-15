import type { FindActionInput, FindResult } from '$admin';
import { normalizeEntity } from '$admin/entity/resolver.server';
import { ObjectId } from 'mongodb';
import { getCollection,  } from './data';
import { getEntity } from '$admin/entity/map.server';

async function find(input: FindActionInput): Promise<FindResult> {
  const collection = getCollection(input.entityName);
  const entity = getEntity(input.entityName);

  if(!entity) {
    throw new Error(`Entity ${input} does not exist`);
  }
  
  const page = input.page ?? 1;
  const filter = input.filter ?? {};
  const pageSize = input.pageSize ?? 0;
  const pageIndex = page - 1;
  
  const totalItems = await collection.countDocuments(filter);
  const documents = await collection.find(filter, { 
    skip: pageIndex * pageSize, 
    limit: pageSize === 0 ? undefined : pageSize 
  }).toArray();

  // Include all toplevel fields for now
  const fields = Object.keys(entity.attributes);

  return {
    data: await Promise.all(documents.map(doc => normalizeEntity(entity, doc, { type: 'find' }, fields))),
    totalPages: Math.round(totalItems / pageSize),
    totalItems,
  };
}

async function findOne(input: { entityName: string; id: string }) {
  const collection = getCollection(input.entityName);
  const doc = await collection.findOne({ _id: new ObjectId(input.id) });

  if(!doc) {
    throw new Error(`Document not found`);
  }

  const entity = getEntity(input.entityName);

  if(!entity) {
    throw new Error(`Entity ${input} does not exist`);
  }

  // Include all toplevel fields for now
  const fields = Object.keys(entity.attributes);

  return normalizeEntity(entity, doc, { type: 'findOne' }, fields);
}

export const queries = {
  find,
  findOne
}
