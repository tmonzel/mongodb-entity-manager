<script lang="ts">
	import { FormInput, type FormControl } from '$admin/form';
	import { renderAttributeLabel } from '../helpers';
	import type { InputAttribute } from './types';

  export let key: string;
  export let control: FormControl<number | string>;
  export let attribute: InputAttribute;
</script>

<FormInput 
  bind:control
  type={attribute.type} 
  label={renderAttributeLabel(attribute, key)}
/>
