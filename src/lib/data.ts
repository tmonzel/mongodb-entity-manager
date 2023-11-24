import { DB_URL } from '$env/static/private';
import { Db, MongoClient, type Document, Collection } from 'mongodb';

const client = new MongoClient(DB_URL);

export const DataSource = {
	async connect(): Promise<void> {
		await client.connect();
	},

	async disconnect(): Promise<void> {
		await client.close();
	},

	getDB(): Db {
		return client.db();
	},

	getCollection(name: string): Collection<Document> {
		return this.getDB().collection(name);
	}
}

export function getCollection(name: string) {
	const collection = DataSource.getCollection(name);
	const defaultPipeline = [
		{ $addFields: { id: { $toString: "$_id" } } },
		{ $project: { _id: 0 } }
	];

	async function findAll(): Promise<Document[]> {
		return collection.aggregate(defaultPipeline).toArray()
	}

	return {
		findAll
	}
}

export function mapDocument(doc: Document): Document {
  if(doc['_id'] !== undefined) {
    doc['id'] = doc['_id'] + '';
    delete doc['_id'];
  }

  return doc;
}