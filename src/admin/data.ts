import { DB_URL } from '$env/static/private';
import { Collection, Db, MongoClient, type Document } from 'mongodb';

const client = new MongoClient(DB_URL);

export function getDatabase(): Db {
	return client.db();
}

export function getCollection(name: string): Collection<Document> {
	return getDatabase().collection(name);
}

export function establishConnection(): void {
	client.connect().then(():void => {
		console.log("MongoDB started");
	}).catch((e) => {
		console.log("MongoDB failed to start");
		console.log(e);
	});
}
