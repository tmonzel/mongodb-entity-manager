import type { RequestEvent } from '@sveltejs/kit';
import { createRouter, publicProcedure } from '../rpc';
import { schema } from './schema';
import { entities } from './entity';

export const router = createRouter({
	loadSchema: publicProcedure.query(() => schema),
	entities
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function createContext(event: RequestEvent) {
	return {};
}

export async function defaultCaller(event: RequestEvent) {
	return router.createCaller(await createContext(event));
}

export type Router = typeof router;
