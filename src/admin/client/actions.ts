import { RPC_URL } from '$admin/constants';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { Router } from '../router';

const Actions = createTRPCProxyClient<Router>({
	links: [
		httpBatchLink({
			url: RPC_URL
		})
	]
});

export const EntityActions = {
	loadAll: Actions.documents.loadAll.query,
	loadEmbed: Actions.documents.loadEmbed.query,
  create: Actions.documents.create.mutate,
  updateOne: Actions.documents.updateOne.mutate,
  deleteOne: Actions.documents.deleteOne.mutate
}
