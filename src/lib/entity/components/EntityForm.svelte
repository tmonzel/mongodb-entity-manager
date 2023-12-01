<script lang="ts">
	import type { Document } from 'mongodb';
	import type { EntitySchema } from '../types';
	import type { FormGroup } from '$lib/form/types';
	import AttributeForm from './AttributeForm.svelte';

  export let schema: EntitySchema;
  export let value: Document = {};
  export let form: FormGroup;
</script>

<AttributeForm attributes={schema.attributes} {form} {value} />
