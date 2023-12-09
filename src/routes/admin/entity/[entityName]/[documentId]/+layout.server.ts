
import { defaultCaller } from '$admin/router';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
	const document = await (await defaultCaller(event)).documents.loadOne({ 
		id: event.params.documentId, 
		name: event.params.entityName 
	});

	if(!document) {
		throw error(404, 'Document not found');
	}

	return { document };
}
