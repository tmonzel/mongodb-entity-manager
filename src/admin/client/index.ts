import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { Router } from '../router';
import { RPC_URL } from '../constants';

export const actions = createTRPCProxyClient<Router>({
	links: [
		httpBatchLink({
			url: RPC_URL
		})
	]
});
