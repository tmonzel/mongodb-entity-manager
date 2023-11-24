<script lang="ts">
	import { actions } from '$lib/actions';
	import { FormControl, Validators, createForm } from '$lib/forms';
	import FormInput from '$lib/forms/components/FormInput.svelte';
	import type { Entity } from '$lib/types';
	import type { Document } from 'mongodb';
	import { createEventDispatcher } from 'svelte';

  export let entity: Entity;
  export let submittable = true;
  export let data: Document = {};

  type EntityFormModel = {
    attributes: FormControl[]
  }

  const { form, state, markAllAsTouched } = createForm<EntityFormModel>({
    attributes: entity.schema.attributes.map(attr => {
      return new FormControl(data ? data[attr.name] : '', attr.required ? Validators.required() : []);
    })
  });

  const dispatch = createEventDispatcher();

  export const submit = async() => {
    if(!$state.valid) {
      markAllAsTouched();
      return;
    }

    entity.schema.attributes.forEach((attr, i) => {
      data[attr.name] = $state.value.attributes[i];
    });

    await actions.entities.saveDocument.mutate({ name: entity.name, data });

    dispatch('saved', data);
  }

  $: submittable = $state.submittable;
</script>

<div>
  {#each $form.attributes as attr, i}
    {@const type = entity.schema.attributes[i]?.type}

    {#if type === 'text'}
    <div class="mb-3">
      <FormInput bind:control={attr} label={entity.schema.attributes[i]?.label}></FormInput>
    </div>
    {:else if type === 'number'}
    <div class="mb-3">
      <FormInput type="number" bind:control={attr} label={entity.schema.attributes[i]?.label}></FormInput>
    </div>
    {/if}
  {/each}
</div>