<script lang="ts">
	import type { FormControl } from '$lib/form';
	import { onDestroy, onMount } from 'svelte';
	import type { EntitySchema, RelationshipAttribute } from '../types';
	import { useEntity } from '$lib/actions';
	import type { Document } from 'mongodb';
	import { derived, writable } from 'svelte/store';

  export let control: FormControl<string[]>;
  export let attribute: RelationshipAttribute;
  export let relatedEntity: EntitySchema;

  const relatedName = attribute.target ?? attribute.name;
  const selectedIds = writable<string[]>(control.value);

  const { list, store, loadAllIfNecessary } = useEntity(relatedName);

  function renderRelatedDocument(doc: Document): string {
    if(!doc) {
      return 'loading...';
    }

    if(!relatedEntity.renderAs) {
      return doc.id;
    }

    return relatedEntity.renderAs.replace(/(\{([a-zA-Z]+)\})+/g, (match, ...groups) => {
        const attrName = groups[1];
        
        return doc[attrName];
    });
  }

  function handleChange(event: Event) {
    const target = event.currentTarget as HTMLSelectElement;
    selectedIds.set([...control.value, target.value]);
    
    target.value = '';
  }

  function removeRelatedDocument(id: string): void {
    selectedIds.update(ids => ids.filter(_id => _id !== id));
  }

  const unsubscribeWatchIds = selectedIds.subscribe(ids => {
    control.setValue(ids);
    control = control;
  });

  onMount(async() => {
    loadAllIfNecessary();
  });

  onDestroy(() => {
    unsubscribeWatchIds();
  })

  const selectedDocuments = derived([selectedIds, store], ([ids, entity]) => {
    return ids.map(id => entity.documents[id])
  });

  const availableDocuments = derived([list, selectedIds], ([documents, selectedIds]) => {
    return documents.filter(doc => selectedIds.find(id => id === doc.id) === undefined);
  })
</script>

<div class="form-label mb-2">
  {attribute.label ?? relatedEntity?.list.title}
</div>

{#if $selectedDocuments.length > 0}
<div class="form-control d-flex mb-3 px-1">
  {#each $selectedDocuments as doc}
    <span class="badge bg-light text-dark fs-6 me-1">
      {renderRelatedDocument(doc)} 
      <button class="btn p-0 material-icons fs-5 text-danger" on:click={() => removeRelatedDocument(doc.id)}>
        cancel
      </button>
    </span>
  {/each}
</div>
{:else}
  <div class="alert alert-info d-flex align-items-center" role="alert">
    <span class="material-icons me-2">info</span>
    <div>
      No {attribute.label ?? relatedEntity?.list.title} referenced
    </div>
  </div>
{/if}

<select class="form-select" on:change={handleChange}>
  <option value={''}>Add {relatedEntity?.name}</option>
  {#each $availableDocuments as doc}
    <option value={doc.id}>{renderRelatedDocument(doc)}</option>
  {/each}
</select>