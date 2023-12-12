<script lang="ts">
	import type { FormControl } from '$admin/form';
	import type { RelationshipAttribute } from '../types';
	import { FormSelect } from '$admin/form/components';
	import { EntityActions } from '$admin/client';
	import { humanize, renderEntityDocument } from '../client/helpers';

  export let key: string;
  export let control: FormControl<string>;
  export let attribute: RelationshipAttribute;

  const ref = attribute.ref ?? key;
</script>

{#await EntityActions.loadAll(ref)}
  Loading relation attribute...
{:then documents} 
  <FormSelect 
    options={documents.map(doc => ({ name: renderEntityDocument(ref, doc), value: doc.id }))} 
    label={attribute.label ?? humanize(key)} 
    bind:control={control} 
  />
{/await}
