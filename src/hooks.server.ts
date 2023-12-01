import type { Dict } from '@trpc/server';
import { resolveHTTPResponse } from '@trpc/server/http';
import { router } from '$admin/router';
import { RPC_URL } from '$admin/constants';
import { DataSource } from '$admin/data';

// Connect to MongoDB before starting the server
DataSource.connect().then(():void => {
	console.log("MongoDB started");
}).catch((e) => {
	console.log("MongoDB failed to start");
	console.log(e);
});

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
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
