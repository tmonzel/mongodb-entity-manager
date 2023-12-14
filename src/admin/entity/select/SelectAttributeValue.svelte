<script lang="ts">
	import type { SelectAttribute } from './types';

  export let key: string;
  export let attribute: SelectAttribute;
  export let value: any | any[];
</script>

{#if Array.isArray(value)}
  {#each value as v, i}
    {@const opt = attribute.options.find(opt => opt.value === v)}

    {#if i > 0}, {/if}

    {#if opt}
      {opt.name}
    {/if}
    
  {/each}
{:else}
  -
{/if}
