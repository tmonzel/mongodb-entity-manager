import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { Router } from './router';
import { RPC_URL } from './constants';
import type { Document } from 'mongodb';
import { derived, writable, type Readable, type Writable, get } from 'svelte/store';

export const actions = createTRPCProxyClient<Router>({
	links: [
		httpBatchLink({
			url: RPC_URL
		})
	]
});

interface Entity {
	ids: string[];
	documents: { [id: string]: Document }
	loaded: boolean;
}

interface EntityStore {
	[entityName: string]: Writable<Entity>;
}

const entityStore: EntityStore = {}

export function useEntity(name: string): { 
	store: Writable<Entity>, 
	loadAllIfNecessary: () => void, 
	list: Readable<Document[]> 
} {
	if(!entityStore[name]) {
		entityStore[name] = writable({
			ids: [],
			documents: {},
			loaded: false
		});
	}

	async function loadAllIfNecessary() {
		if(entityStore[name] && get(entityStore[name]).loaded) {
			return;
		}

		const result = await actions.documents.loadAll.query(name);

		const entity: Entity = {
			ids: [],
			documents: {},
			loaded: true
		};
	
		for(const doc of result) {
			entity.ids.push(doc.id);
			entity.documents[doc.id] = doc;
		}

		entityStore[name].set(entity);
	}

	const list = derived(entityStore[name], (store) => {
		return store.ids.map(id => store.documents[id]);
	});

	return {
		store: entityStore[name],
		list,
		loadAllIfNecessary
	};
}