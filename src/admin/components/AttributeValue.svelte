<script lang="ts">
	import { extractMimeFromBase64, renderAttributeValue } from '$admin/client/helpers';
	import type { Entity } from '$admin/types';

  export let entity: Entity;
  export let key: string;
  export let value: any;

  const attribute = entity.attributes[key];
</script>

{#if attribute.type === 'file'}
  {extractMimeFromBase64(value)}
  <img src={value} alt="" style="max-width: 175px;" />
{:else}
  {renderAttributeValue(attribute, key, value)}
{/if}


