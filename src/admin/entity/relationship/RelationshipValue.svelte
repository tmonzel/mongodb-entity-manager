<script lang="ts">
	import { getContext } from 'svelte';
	import type { RelationshipAttribute } from './types';
	import EntityValue from '../EntityValue.svelte';
	import type { Document } from 'mongodb';
	import type { EntitySchema } from '../types';
	import { renderDocument } from '$admin';

  const schema = getContext<EntitySchema>('schema');

  export let key: string;
  export let attribute: RelationshipAttribute;
  export let value: Document | Document[];

  const entity = schema[attribute.ref ?? key];
</script>

{#if attribute.type === 'relationship:belongs_to'}


  {#if attribute.renderAs}
    {renderDocument(attribute.renderAs, value)}
  {:else}
    <EntityValue {entity} {value} />
  {/if}

{:else if attribute.type === 'relationship:belongs_to_many' && Array.isArray(value)}

  {#each value as v}
    <EntityValue {entity} value={v} />
  {/each}

{/if}