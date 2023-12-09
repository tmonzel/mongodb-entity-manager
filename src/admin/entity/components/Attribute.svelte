<script lang="ts">
	import { FormControl } from '$admin/form';
	import { FormInput, FormSelect } from '$admin/form/components';
	import type { EntityAttribute } from '$admin/types';
	import FormCheckbox from '$admin/form/components/FormCheckbox.svelte';
	import { FormGroup } from '$admin/form/types';
	import RelationshipAttribute from './RelationshipAttribute.svelte';
	import EmbedAttributeForm from './EmbedAttributeForm.svelte';

  export let key: string;
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
        multiple={attribute.multiple}
        options={attribute.options} 
        label={attribute.label} 
      />

    {:else if attribute.type === 'switch'}

      <FormCheckbox 
        bind:control 
        label={attribute.label}
      />

    {:else if attribute.type === 'embed'}

      <EmbedAttributeForm bind:control entity={attribute.entity} />

    {:else if attribute.type === 'relationship:has-many'}

      <RelationshipAttribute bind:control {key} {attribute} />

    {:else if attribute.type === 'relationship:has-one'}

      <!--<FormSelect 
        bind:control 
        label={attribute.label} 
      />-->
       
    {/if}
  
  {:else if control instanceof FormGroup && attribute.type === 'object'}
    
    <div class="bg-light p-3">
      <div class="mb-2">
        <small class="text-muted">{attribute.label}</small>
      </div>
      <div class="row">
        {#each Object.entries(attribute.attributes) as [key, attr]}
          <div class="col">
            <svelte:self bind:control={control[key]} {key} attribute={attr} />
          </div>
        {/each}
      </div>
    </div>

  {/if}
</div>