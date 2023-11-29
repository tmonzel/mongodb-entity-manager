<script lang="ts">
	import { actions } from '$lib/actions';
	import { FormControl, Validators, createForm } from '$lib/form';
	import type { Validator } from '$lib/form/types';
	import type { EntityAttribute, InputAttribute } from '$lib/entity/types';
	import type { Document } from 'mongodb';
	import { createEventDispatcher } from 'svelte';
	import EntityFormAttribute from './EntityFormAttribute.svelte';
	import { FormGroup } from '$lib/form/form-group';

  export let entityName: string;
  export let attributes: EntityAttribute[];
  export let submittable = true;
  export let data: Document = {};

  function mapAttributeGroup(attributes: EntityAttribute[], value: any = {}): FormGroup {
    const group = new FormGroup();

    for(const attr of attributes) {
      switch(attr.type) {
        case 'object':
          if(attr.children) {
            const controls: { [key: string]: FormControl } = {};

            for(const k in attr.children) {
              const child = attr.children[k];
              
              controls[child.name] = new FormControl(value[attr.name] ? value[attr.name][child.name] : '');
            }
            group.setControl(attr.name, new FormGroup(controls));

          } else {
            //group.setControl(attr.name, attr.children.map((child, i) => getControlFromAttribute(child, value[i] ? value[i][child.name] : undefined)))
          }
          break;
        case 'relationship:has-many':
          group.setControl(attr.name, new FormControl<string[]>(value[attr.name] ?? []));
          break;
        case 'relationship:has-one':
          group.setControl(attr.name, new FormControl<string>(value[attr.name] ?? ''));
          break;
        case 'switch':
          group.setControl(attr.name, new FormControl<boolean>(value[attr.name] ?? (attr.default ?? false)))
          break;
        case 'select':
          group.setControl(attr.name, new FormControl(value[attr.name] ?? attr.default))
          break;
        case 'text': 
        case 'number':
          group.setControl(attr.name, getControlFromAttribute(attr, value[attr.name]))
      }
    }

    return group;
  }

  function getControlFromAttribute(attr: InputAttribute, value: any): FormControl {
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
    mapAttributeGroup(attributes, data)
  );

  const dispatch = createEventDispatcher();

  export const submit = async() => {
    if(!$state.valid) {
      form.markAllAsTouched();
      return;
    }

    if(data && data.id) {
      await actions.documents.updateOne.mutate({ 
        entityName, 
        id: data.id,
        changes: $state.value 
      });
    } else {
      await actions.documents.create.mutate({ 
        entityName, 
        data: $state.value 
      });
    }

    dispatch('saved', data);
  }

  $: submittable = $state.submittable;
</script>

<div>
  {#each attributes as attr}
    <div class="mb-4">
      <EntityFormAttribute bind:control={$form.controls[attr.name]} attribute={attr} />
    </div>
  {/each}
</div>