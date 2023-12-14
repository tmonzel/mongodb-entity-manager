<script lang="ts">
	import { FormSelect, type FormControl } from '$admin/form';
	import type { RelationshipAttribute } from './types';
	import { EntityActions, humanize, renderEntityDocument } from '$admin';

  export let key: string;
  export let control: FormControl<string | string[]>;
  export let attribute: RelationshipAttribute;

  const ref = attribute.ref ?? key;
</script>

{#await EntityActions.find({ entityName: ref })}
  Loading relation attribute...
{:then result} 
  <FormSelect 
    options={result.data.map(doc => ({ name: renderEntityDocument(ref, doc), value: doc.id }))} 
    label={attribute.label ?? humanize(key)} 
    multiple={attribute.type === 'relationship:belongs_to_many'}
    bind:control={control} 
  />
{/await}
