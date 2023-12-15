<script lang="ts">
	import { page } from '$app/stores';
	import Dialog from '$admin/components/Dialog.svelte';
	import { isActionAllowed } from '$admin/helpers';
	import { notify } from '$admin/notification';
	import { EntityActions } from '$admin/actions';
	import EntityDataTable from '$admin/components/EntityDataTable.svelte';
	import { getContext, onMount } from 'svelte';
	import type { EntityContext } from '$admin/types';

  const { entity, searchTerm, result, find } = getContext<EntityContext>('entity');
  
  let deleteDialog: Dialog;

  async function deleteDocument(id: string): Promise<void> {
    await EntityActions.deleteOne({ id, entityName: $page.params.entityName });

    notify({ 
      type: 'success', 
      message: `${entity.type}#${id} removed` 
    });

    deleteDialog.close();

    // Reload data
    find({});
  }

  onMount(() => {
    find({});
  });
  
</script>

<div class="page-options justify-content-between">
  <a class="btn btn-light d-flex me-2" href="{$page.url}/../..">
    <span class="material-icons me-2">chevron_left</span>
    Entities
  </a>
  {#if isActionAllowed(entity, 'create')}
  <a class="btn btn-primary" href="{$page.url}/new">+ New {entity.type}</a>
  {/if}
</div>

<h1>{entity.collection.title}</h1>
<p class="lead mb-4">{entity.description}</p>

{#if entity.collection.search}
<div class="mb-4">
  <input 
    type="text" 
    id="documentSearchInput" 
    class="form-control" 
    placeholder="Search by {entity.collection.search}"
    on:input={(e) => find({ term: e.currentTarget.value, page: 1 }, 200)}
    value={$searchTerm}
  >
</div>
{/if}

<nav class="d-flex justify-content-end">
  {#if $result.totalPages > 1}
  <ul class="pagination pagination mb-0">
    {#each { length: $result.totalPages } as _, i}
      {@const page = i + 1}
      <li class="page-item" class:active={$result.page === page}>
        <button class="page-link" on:click={() => find({ page })}>{page}</button>
      </li>
    {/each}
  </ul>
  {/if}
</nav>

<EntityDataTable entity={entity} data={$result.data}>
  <svelte:fragment slot="options" let:document>
    <a class="btn p-0 d-flex me-2" href="{$page.url}/{document.id}">
      <span class="material-icons">arrow_right_alt</span>
    </a>
    {#if isActionAllowed(entity, 'update')}
    <a class="btn p-0 d-flex me-2" href="{$page.url}/{document.id}/edit">
      <span class="material-icons">edit</span>
    </a>
    {/if}
    {#if isActionAllowed(entity, 'delete')}
    <button class="btn p-0 d-flex" on:click={() => deleteDialog.open(document)}>
      <span class="material-icons">delete</span>
    </button>
    {/if}
  </svelte:fragment>
</EntityDataTable>

<Dialog bind:this={deleteDialog} let:data>
  <svelte:fragment slot="title">
    Confirm delete
  </svelte:fragment>
  Are you really want to delete <strong>{data?.id}</strong>?
  <svelte:fragment slot="footer" let:data>
    <button type="button" class="btn btn-secondary" on:click={() => deleteDialog.close()}>No</button>
    <button 
      type="button" 
      class="btn btn-danger" 
      on:click={() => deleteDocument(data?.id)} 
    >
    Yes, delete!
    </button>
  </svelte:fragment>
</Dialog>
