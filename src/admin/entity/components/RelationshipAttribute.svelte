<script lang="ts">
	import type { FormControl } from '$admin/form';
	import { getContext, onMount } from 'svelte';
	import type { EntitySchema, RelationshipAttribute } from '../../types';
	import { useEntity } from '$admin/actions';
	import FormItemSelect from '$admin/form/components/FormItemSelect.svelte';

  export let control: FormControl<string[]>;
  export let attribute: RelationshipAttribute;

  const relatedName = attribute.target ?? attribute.name;

  const { list, loadAllIfNecessary } = useEntity(relatedName);
  

  const schemata = getContext<EntitySchema[]>('schemata');
  const relatedEntity = schemata.find(s => s.name === attribute.name);

  onMount(() => {
    loadAllIfNecessary();
  });
</script>

<!--<div class="form-label mb-2">
  {attribute.label ?? relatedEntity?.collection.title}
</div>-->

{#if relatedEntity}
  <FormItemSelect items={$list} label={relatedEntity.collection.title} bind:control={control} />
{/if}