<script lang="ts">
	import { FormCheckbox, type FormControl } from '$admin/form';
	import { renderAttributeLabel } from '../helpers';
	import type { SwitchAttribute } from './types';

  export let control: FormControl<boolean>;

  export let key: string;
  export let attribute: SwitchAttribute;
</script>

<FormCheckbox 
  bind:control 
  label={renderAttributeLabel(attribute, key)}
/>
