<script lang="ts">
	import { page } from '$app/stores';
  import type { LayoutData } from './$types';
	import Dialog from '$admin/components/Dialog.svelte';
	import { isActionAllowed } from '$admin/client/helpers';
	import { invalidateAll } from '$app/navigation';
	import { notify } from '$admin/notification';
	import { EntityActions } from '$admin/client';
	import EntityDataTable from '$admin/components/EntityDataTable.svelte';

  export let data: LayoutData;

  let deleteDialog: Dialog;

  async function deleteDocument(id: string): Promise<void> {
    await EntityActions.deleteOne({ id, name: $page.params.entityName });

    notify({ 
      type: 'success', 
      message: `${data.entity.type}#${id} removed` 
    });

    deleteDialog.close();
    invalidateAll();
  }
</script>

<div class="page-options justify-content-between">
  <a class="btn btn-light d-flex me-2" href="{$page.url}/../..">
    <span class="material-icons me-2">chevron_left</span>
    Entities
  </a>
  {#if isActionAllowed(data.entity, 'create')}
  <a class="btn btn-primary" href="{$page.url}/new">+ New {data.entity.type}</a>
  {/if}
</div>

<h1>{data.entity.collection.title}</h1>
<p class="lead mb-4">{data.entity.description}</p>

<EntityDataTable entity={data.entity} documents={data.documents}>
  <svelte:fragment slot="options" let:document>
    <a class="btn p-0 d-flex me-2" href="{$page.url}/{document.id}">
      <span class="material-icons">arrow_right_alt</span>
    </a>
    {#if isActionAllowed(data.entity, 'update')}
    <a class="btn p-0 d-flex me-2" href="{$page.url}/{document.id}/edit">
      <span class="material-icons">edit</span>
    </a>
    {/if}
    {#if isActionAllowed(data.entity, 'delete')}
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
