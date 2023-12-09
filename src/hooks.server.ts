import type { Dict } from '@trpc/server';
import { resolveHTTPResponse } from '@trpc/server/http';
import { router } from '$admin/router';
import { RPC_URL } from '$admin/constants';
import { initializeAdmin } from '$admin/server';
import { CustomerEntity } from '$lib/entities/customer.entity';
import { ProductEntity } from '$lib/entities/product.entity';
import { OrderEntity } from '$lib/entities/order.entity';

// Setup all admin data
initializeAdmin({
	schema: {
		customers: CustomerEntity,
		products: ProductEntity,
		orders: OrderEntity,
	},

	dashboard: ['customers', 'products', 'orders']
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
