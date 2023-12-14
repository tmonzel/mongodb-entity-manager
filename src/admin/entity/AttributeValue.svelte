<script lang="ts">
	import type { Entity } from './types';
	import { attributeModuleDict } from './modules';
	import { renderDocument } from '$admin';

  export let entity: Entity;
  export let key: string;
  export let value: any;
  
  const attribute = entity.attributes[key];
</script>

{#if attribute.type in attributeModuleDict && attributeModuleDict[attribute.type].value}
  <svelte:component this={attributeModuleDict[attribute.type].value} {attribute} {key} {value} />
{:else if attribute.type === 'object' && attribute.renderAs}
  {renderDocument(attribute.renderAs, value)}
{:else}
  {value}
{/if}
