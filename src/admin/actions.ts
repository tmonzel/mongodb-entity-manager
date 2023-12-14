import { RPC_URL } from './constants';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { Router } from './router';

const client = createTRPCProxyClient<Router>({
	links: [
		httpBatchLink({
			url: RPC_URL
		})
	]
});

export const EntityActions = {
	find: client.documents.find.query,
	findOne: client.documents.findOne.query,
	loadEmbed: client.documents.loadEmbed.query,
  create: client.documents.create.mutate,
  updateOne: client.documents.updateOne.mutate,
  deleteOne: client.documents.deleteOne.mutate
}
