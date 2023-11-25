<script lang="ts">
	import { FormControl } from '$lib/forms';
	import { FormInput } from '$lib/forms/components';
	import type { EntityAttribute } from '$lib/types';

  export let control: FormControl | FormControl[];
  export let attribute: EntityAttribute;
</script>

<div class="entity-form-attribute">
  {#if control instanceof FormControl}
    {#if attribute.type === 'text'}
      <FormInput bind:control={control} label={attribute.label}></FormInput>
    {:else if attribute.type === 'number'}
      <FormInput type="number" bind:control={control} label={attribute.label}></FormInput>
    {/if}
  {:else if attribute.children}

    <div class="row">
      {#each attribute.children as attr, i}
        <div class="col">
          <svelte:self bind:control={control[i]} attribute={attr} />
        </div>
      {/each}
    </div>

  {/if}
</div>