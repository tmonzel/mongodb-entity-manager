<script lang="ts">
	import type { FormControl } from '$admin/form';
	import type { RelationshipAttribute } from '../types';
	import { FormSelect } from '$admin/form/components';
	import { EntityActions } from '$admin/client';
	import { humanize } from '../client/helpers';

  export let key: string;
  export let control: FormControl<string[]>;
  export let attribute: RelationshipAttribute;

  const relatedName = attribute.target ?? key;
  const loadAll = EntityActions.loadAll(relatedName);
</script>

{#await loadAll}
  Loading relation attribute...
{:then documents} 
  <FormSelect 
    options={documents.map(item => ({ name: item.name, value: item.id }))} 
    label={attribute.label ?? humanize(key)} 
    multiple
    bind:control={control} 
  />
{/await}
