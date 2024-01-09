<script lang="ts">
	import { attributeModuleDict } from './modules';
	import { renderDocument } from '$admin';
	import type { EntityAttribute } from './types';

  export let attribute: EntityAttribute;
  export let key: string;
  export let value: any;
</script>

{#if attribute.type in attributeModuleDict && attributeModuleDict[attribute.type].value}
  <svelte:component this={attributeModuleDict[attribute.type].value} {attribute} {key} {value} />
{:else if attribute.type === 'object' && attribute.renderAs}
  {renderDocument(attribute.renderAs, value)}
{:else}
  {value}
{/if}
