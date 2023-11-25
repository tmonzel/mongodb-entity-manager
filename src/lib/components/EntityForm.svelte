<script lang="ts">
	import { actions } from '$lib/actions';
	import { FormControl, Validators, createForm } from '$lib/forms';
	import type { Validator } from '$lib/forms/types';
	import type { Entity, EntityAttribute } from '$lib/types';
	import type { Document } from 'mongodb';
	import { createEventDispatcher } from 'svelte';
	import EntityFormAttribute from './EntityFormAttribute.svelte';
	import { FormGroup } from '$lib/forms/form-group';

  export let entity: Entity;
  export let submittable = true;
  export let data: Document = {};

  function mapAttributeGroup(attributes: EntityAttribute[], value: any = {}): FormGroup {
    const group = new FormGroup();

    for(const attr of attributes) {
      if(attr.children) {
        if(attr.type === 'object') {
          const controls: { [key: string]: FormControl } = {};

          for(const k in attr.children) {
            const child = attr.children[k];
            
            controls[child.name] = getControlFromAttribute(child, value[attr.name] ? value[attr.name][child.name] : undefined)
          }
          group.setControl(attr.name, new FormGroup(controls));

        } else {
          //group.setControl(attr.name, attr.children.map((child, i) => getControlFromAttribute(child, value[i] ? value[i][child.name] : undefined)))
        }

        
      } else {
        group.setControl(attr.name, getControlFromAttribute(attr, value[attr.name]))
      }
    }

    return group;
  }

  function getControlFromAttribute(attr: EntityAttribute, value: any): FormControl {
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

  const { form, state } = createForm<FormGroup, Document>(
    mapAttributeGroup(entity.schema.attributes, data)
  );

  const dispatch = createEventDispatcher();

  export const submit = async() => {
    if(!$state.valid) {
      form.markAllAsTouched();
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
      <EntityFormAttribute bind:control={$form.controls[attr.name]} attribute={attr} />
    </div>
  {/each}
</div>