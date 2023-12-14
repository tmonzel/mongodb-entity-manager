<script lang="ts">
	import type { Document } from 'mongodb';
	import type { AbstractEntity, EntityAttribute, EntityAttributeMap } from './types';
	import { FormControl, FormGroup } from '$admin/form';
  
	import AttributeControl from './AttributeControl.svelte';
	import { attributeModuleDict } from './modules';

  export let entity: AbstractEntity;
  export let value: Document = {};
  export let form: FormGroup;

  const attributeKeys = entity.form ?? Object.keys(entity.attributes);

	function createControlFromAttribute(attr: EntityAttribute, value: any): FormControl | FormGroup {
    if(attr.type === 'object') {
      return new FormGroup(createControlsFromAttributes(attr.attributes, value ?? {}));
    }

    if(attr.type in attributeModuleDict) {
      const module = attributeModuleDict[attr.type];

      if(module.createControl) {
        return module.createControl(value, attr)
      }
    }
    
    return new FormControl(value);
	}

	function createControlsFromAttributes(attributes: EntityAttributeMap, value: Document) {
		const controls: { [key: string]: FormControl | FormControl[] | FormGroup } = {};

		for(const [name, attr] of Object.entries(attributes)) {
			controls[name] = createControlFromAttribute(attr, value[name]);
		}

		return controls;
	}

  Object.assign(form, createControlsFromAttributes(entity.attributes, value));
</script>

{#each attributeKeys as key}
  <div class="mb-4">
    <AttributeControl bind:control={form[key]} {key} attribute={entity.attributes[key]} />
  </div>
{/each}