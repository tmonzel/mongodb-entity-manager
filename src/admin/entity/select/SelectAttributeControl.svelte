<script lang="ts">
	import { FormSelect, type FormControl } from '$admin/form';
	import { renderAttributeLabel } from '../helpers';
	import type { SelectAttribute } from './types';

  export let key: string;
  export let control: FormControl<any | any[]>;
  export let attribute: SelectAttribute;
</script>

<FormSelect 
  bind:control 
  multiple={attribute.multiple}
  options={attribute.options} 
  label={renderAttributeLabel(attribute, key)} 
/>
