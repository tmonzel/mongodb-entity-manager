<script lang="ts">
	import { renderDocument } from '$admin';
	import type { Entity } from './types';

  export let entity: Entity | undefined;
  export let value: any;
</script>

{#if !entity || !entity.renderAs}
  {value.id}
{:else}
  {renderDocument(entity.renderAs, value)}
{/if}
