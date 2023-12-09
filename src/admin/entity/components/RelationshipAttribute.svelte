<script lang="ts">
	import type { FormControl } from '$admin/form';
	import type { RelationshipAttribute } from '../../types';
	import { FormSelect } from '$admin/form/components';
	import { actions } from '$admin/client';
	import { humanize } from '../utils';

  export let key: string;
  export let control: FormControl<string[]>;
  export let attribute: RelationshipAttribute;

  const relatedName = attribute.target ?? key;
  const loadAll = actions.documents.loadAll.query(relatedName);
</script>

{#await loadAll}
  Loading relation attribute...
{:then documents} 
  <FormSelect 
    options={documents.map(item => ({ name: item.name, value: item.id }))} 
    label={humanize(relatedName)} 
    multiple={attribute.type === 'relationship:has-many'}
    bind:control={control} 
  />
{/await}
