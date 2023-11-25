<script lang="ts">
	import { actions } from '$lib/actions';
	import { FormControl, Validators, createForm } from '$lib/forms';
	import type { Validator } from '$lib/forms/types';
	import type { Entity, EntityAttribute } from '$lib/types';
	import type { Document } from 'mongodb';
	import { createEventDispatcher } from 'svelte';
	import EntityFormAttribute from './EntityFormAttribute.svelte';

  export let entity: Entity;
  export let submittable = true;
  export let data: Document = {};

  type EntityFormModel = {
    [name: string]: FormControl | FormControl[];
  }

  function mapAttributeGroup(attributes: EntityAttribute[], value: any = {}) {
    const result: EntityFormModel = {};

    for(const attr of attributes) {
      if(attr.children) {
        result[attr.name] = attr.children.map((child, i) => mapAttribute(child, value[i] ? value[i][child.name] : undefined));
      } else {
        result[attr.name] = mapAttribute(attr, value[attr.name]);
      }
    }

    return result;
  }

  function mapAttribute(attr: EntityAttribute, value: any): any {
    const validations = attr.validations 
        ? Object.entries(attr.validations).map(([name, config]) => {
          switch(name) {
            case 'required':
              return Validators.required();
          }
        }) as Validator[]
        : [];

    return new FormControl(value ?? '', validations)
  }

  const { form, state, markAllAsTouched } = createForm<EntityFormModel, Document>(
    mapAttributeGroup(entity.schema.attributes, data)
  );

  const dispatch = createEventDispatcher();

  export const submit = async() => {
    if(!$state.valid) {
      markAllAsTouched();
      return;
    }

    await actions.entities.saveDocument.mutate({ 
      name: entity.name, 
      data: $state.value 
    });

    dispatch('saved', data);
  }

  $: submittable = $state.submittable;
</script>

<div>
  {#each entity.schema.attributes as attr}
    <div class="mb-4">
      <EntityFormAttribute bind:control={$form[attr.name]} attribute={attr} />
    </div>
  {/each}
</div>