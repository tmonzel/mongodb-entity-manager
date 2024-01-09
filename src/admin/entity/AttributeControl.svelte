<script lang="ts">
	import { FormControl, FormGroup } from '$admin/form';
	import type { EntityAttribute } from './types';
	import { renderAttributeLabel } from './helpers';
	import { attributeModuleDict } from './modules';

  export let key: string;
  export let control: FormControl | FormGroup | FormControl[];
  export let attribute: EntityAttribute;
  export let value: any;
</script>

<div class="entity-form-attribute">
  {#if control instanceof FormControl}
  
    {#if attribute.type in attributeModuleDict}
      <svelte:component this={attributeModuleDict[attribute.type].edit} {attribute} {key} bind:control={control} {value} />
    {/if}
  
  {:else if control instanceof FormGroup && attribute.type === 'object'}
    
    <div class="bg-light p-3">
      <div class="mb-2">
        <small class="text-muted">{renderAttributeLabel(attribute, key)}</small>
      </div>
      <div class="row">
        {#each Object.entries(attribute.attributes) as [k, attr]}
          <div class="col">
            <svelte:self bind:control={control[k]} key={k} attribute={attr} value={value ? value[k] : undefined} />
          </div>
        {/each}
      </div>
    </div>

  {/if}
</div>