
import { defaultCaller } from '$lib/api/router';
import { mapDocument } from '$lib/data';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
	const document = await (await defaultCaller(event)).entities.loadDocument({ 
		id: event.params.documentId, 
		name: event.params.entityName 
	});

	if(document) {
		return {
			document: mapDocument(document)
		};
	}

	throw error(404, 'Document not found');
}