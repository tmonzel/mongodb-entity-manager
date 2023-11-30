<script lang="ts">
	import type { Document } from 'mongodb';
	import type { EntityAttribute } from '../types';
	import EntityFormAttribute from './EntityFormAttribute.svelte';
	import { createControlsFromAttributes } from '../helpers';
	import type { FormGroup } from '$lib/form/types';

  export let attributes: EntityAttribute[];
  export let value: Document = {};
  export let form: FormGroup;

  Object.assign(form, createControlsFromAttributes(attributes, value));
</script>

{#each attributes as attr}
  <div class="mb-4">
    <EntityFormAttribute bind:control={form[attr.name]} attribute={attr} />
  </div>
{/each}
