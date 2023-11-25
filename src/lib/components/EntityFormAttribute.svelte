<script lang="ts">
	import { FormControl } from '$lib/forms';
	import { FormInput } from '$lib/forms/components';
	import { FormGroup } from '$lib/forms/form-group';
	import type { EntityAttribute } from '$lib/types';

  export let control: FormControl | FormControl[] | FormGroup;
  export let attribute: EntityAttribute;
</script>

<div class="entity-form-attribute">
  {#if control instanceof FormControl}
    {#if attribute.type === 'text'}
      <FormInput bind:control={control} label={attribute.label}></FormInput>
    {:else if attribute.type === 'number'}
      <FormInput type="number" bind:control={control} label={attribute.label}></FormInput>
    {/if}
  {:else if attribute.children && attribute.type === 'object' && control instanceof FormGroup}

    <div class="row">
      {#each attribute.children as attr, i}
        <div class="col">
          <svelte:self bind:control={control.controls[attr.name]} attribute={attr} />
        </div>
      {/each}
    </div>

  {/if}
</div>