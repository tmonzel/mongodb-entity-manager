import type { RequestEvent } from '@sveltejs/kit';
import { createRouter } from './rpc';
import { documents } from './server/document.router';

export const router = createRouter({
	documents
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function createContext(event: RequestEvent) {
	return {};
}

export async function defaultCaller(event: RequestEvent) {
	return router.createCaller(await createContext(event));
}

export type Router = typeof router;
