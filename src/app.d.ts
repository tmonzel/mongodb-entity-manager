// See https://kit.svelte.dev/docs/types#app

import type { Entity } from '$lib/types';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		interface PageData {
			entity: Entity
		}
		// interface Platform {}
	}
}

export {};
