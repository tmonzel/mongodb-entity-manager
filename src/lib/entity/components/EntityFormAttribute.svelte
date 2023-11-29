<script lang="ts">
	import { FormControl } from '$lib/form';
	import { FormInput } from '$lib/form/components';
	import { FormGroup } from '$lib/form/form-group';
	import type { EntityAttribute } from '$lib/entity/types';
	import RelationshipAttribute from './RelationshipAttribute.svelte';
	import FormSelect from '$lib/form/components/FormSelect.svelte';
	import FormCheckbox from '$lib/form/components/FormCheckbox.svelte';

  export let control: FormControl | FormControl[] | FormGroup;
  export let attribute: EntityAttribute;
</script>

<div class="entity-form-attribute">
  {#if control instanceof FormControl}
    {#if attribute.type === 'text' || attribute.type === 'number'}
      
      <FormInput 
        bind:control
        type={attribute.type} 
        label={attribute.label}
      />
    {:else if attribute.type === 'select'}
      
      <FormSelect 
        bind:control
        options={attribute.options}
        label={attribute.label}
      />

    {:else if attribute.type === 'switch'}

      <FormCheckbox 
        bind:control 
        label={attribute.label}
      />

    {:else if attribute.type === 'relationship:has-many'}

      <RelationshipAttribute bind:control attribute={attribute} />

    {:else if attribute.type === 'relationship:has-one'}

      <FormSelect 
        bind:control 
        label={attribute.label} 
      />

      <!--<div class="multiselect">
        <input class="dropdown-toggle">
      
        <ul class="dropdown-menu show">
          <li><a class="dropdown-item" href="#">Action</a></li>
          <li><a class="dropdown-item" href="#">Another action</a></li>
          <li><a class="dropdown-item" href="#">Something else here</a></li>
        </ul>
      </div>-->
    {/if}
  {/if}
  
  {#if control instanceof FormGroup && attribute.type === 'object' && attribute.children}
    
    <div class="bg-light p-3">
      <div class="mb-2">
        <small class="text-muted">{attribute.label}</small>
      </div>
      <div class="row">
        {#each attribute.children as attr, i}
          <div class="col">
            <svelte:self bind:control={control.controls[attr.name]} attribute={attr} />
          </div>
        {/each}
      </div>
    </div>

  {/if}
</div>