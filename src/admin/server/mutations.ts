import { ObjectId } from 'mongodb';
import { getCollection } from './data';
import type { CreateDocumentInput, UpdateDocumentInput } from '$admin';
import { denormalizeEntity } from '$admin/entity/resolver.server';
import { getEntity } from '$admin/entity/map.server';

async function deleteOne(input: { entityKey: string; id: string; }): Promise<boolean> {
  const collection = getCollection(input.entityKey);
  
  await collection.deleteOne({ _id: new ObjectId(input.id) });

  return true;
}

async function updateOne(input: UpdateDocumentInput) {
  const entity = getEntity(input.entityKey);
  const collection = getCollection(input.entityKey);

  if(!entity) {
    throw new Error(`Entity ${input} does not exist`);
  }
  
  await collection.updateOne(
    { _id: new ObjectId(input.id) }, 
    { $set: await denormalizeEntity(entity, input.changes, { type: 'updateOne' }) }
  );
}

async function create(input: CreateDocumentInput) {
  const entity = getEntity(input.entityKey);
  const collection = getCollection(input.entityKey);

  if(!entity) {
    throw new Error(`Entity ${input} does not exist`);
  }
  
  await collection.insertOne(
    await denormalizeEntity(entity, input.data, { type: 'create' })
  );
}

export const mutations = {
  deleteOne,
  updateOne,
  create
}