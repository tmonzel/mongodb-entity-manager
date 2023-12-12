<script lang="ts">
	import type { Document } from 'mongodb';
	import type { AbstractEntity, EntityAttribute } from '$admin/types';
	import { FormGroup, type Validator } from '$admin/form/types';
	import { FormControl, Validators } from '$admin/form';
  
	import Attribute from './Attribute.svelte';

  export let entity: AbstractEntity;
  export let value: Document = {};
  export let form: FormGroup;

  const attributeKeys = entity.form ?? Object.keys(entity.attributes);
  
  let validators: Validator[] = [];

	function createControlFromAttribute(name: string, attr: EntityAttribute, value: any): FormControl | FormGroup {
		switch(attr.type) {
      case 'object':
				return new FormGroup(createControlsFromAttributes(attr.attributes, value ?? {}));
      
      case 'relationship:has_many':
      case 'relationship:belongs_to_many':
        return new FormControl<string[]>(value ? (value as Document[]).map(obj => obj.id) : []);
      
      case 'relationship:belongs_to':
        return new FormControl<string | null>(value ? value.id : null);
      case 'switch':
        return new FormControl<boolean>(value ?? (attr.default ?? false));
      case 'select':
        return new FormControl(value ?? (attr.default ?? null));
      case 'array':
        return new FormControl(value ?? []);
      case 'embed':
        return new FormControl(value ?? []);
      case 'text': 
      case 'number':
        if(attr.validations) {
          validators = Object.entries(attr.validations).map(([n]) => {
            switch(n) {
              case 'required':
                return Validators.required();
            }
          }) as Validator[]
        }

        return new FormControl(value ?? attr.default, validators);
      default:
        return new FormControl(value);
		}
	}

	function createControlsFromAttributes(attributes: { [name: string]: EntityAttribute }, value: Document) {
		const controls: { [key: string]: FormControl | FormControl[] | FormGroup } = {};

		for(const [name, attr] of Object.entries(attributes)) {
			controls[name] = createControlFromAttribute(name, attr, value[name]);
		}

		return controls;
	}

  Object.assign(form, createControlsFromAttributes(entity.attributes, value));
</script>

{#each attributeKeys as key}
  <div class="mb-4">
    <Attribute bind:control={form[key]} {key} attribute={entity.attributes[key]} />
  </div>
{/each}