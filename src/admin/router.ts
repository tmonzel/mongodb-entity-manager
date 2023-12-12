import type { MaybePromise, RequestEvent, ResolveOptions } from '@sveltejs/kit';
import { createRouter } from './rpc';
import { documentRouter } from './server/document.router';
import { RPC_URL } from './constants';
import type { Dict } from '@trpc/server';
import { resolveHTTPResponse } from '@trpc/server/http';

export const router = createRouter({
	documents: documentRouter
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function createContext(event: RequestEvent) {
	return {};
}

export async function defaultCaller(event: RequestEvent) {
	return router.createCaller(await createContext(event));
}

export function createHttpHandle() {
  return async(input: {
    event: RequestEvent;
    resolve(event: RequestEvent, opts?: ResolveOptions): MaybePromise<Response>;
  }) => {
    const { event, resolve } = input;

    if (event.url.pathname.startsWith(RPC_URL + '/')) {
      const request = event.request as Request & {
        headers: Dict<string | string[]>;
      };
      
      const req = {
        method: request.method,
        headers: request.headers,
        query: event.url.searchParams,
        body: await request.text()
      };
  
      const httpResponse = await resolveHTTPResponse({
        router,
        req,
        path: event.url.pathname.substring(RPC_URL.length + 1),
        createContext: async () => {
          return {};
        }
        //responseMeta,
        //onError: onError as any
      });
  
      const { status, headers, body } = httpResponse as {
        status: number;
        headers: Record<string, string>;
        body: string;
      };
  
      return new Response(body, { status, headers });
    }
  
    return resolve(event);
  }
}

export type Router = typeof router;
