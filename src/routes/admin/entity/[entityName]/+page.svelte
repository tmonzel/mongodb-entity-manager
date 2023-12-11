<script lang="ts">
	import { page } from '$app/stores';
	import type { Document } from 'mongodb';
  import type { LayoutData } from './$types';
	import Dialog from '$admin/components/Dialog.svelte';
	import { renderAttributeLabel, renderAttributeValue } from '$admin/client/helpers';
	import { invalidateAll } from '$app/navigation';
	import { notify } from '$admin/notification';
	import { actions } from '$admin/client';

  export let data: LayoutData;

  const columns: string[] = data.entity.collection.columns ?? Object.keys(data.entity.attributes);

  let deleteDialog: Dialog;

  function openDeleteDialog(doc: Document): void {
    deleteDialog.open(doc);
  }

  async function deleteDocument(id: string): Promise<void> {
    await actions.documents.deleteOne.mutate({ id, name: $page.params.entityName });

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
  <a class="btn btn-primary" href="{$page.url}/new">+ New {data.entity.type}</a>
</div>

<h1>{data.entity.collection.title}</h1>
<p class="lead mb-4">{data.entity.description}</p>
  
<table class="table">
  <thead>
    <tr>
      <th>#</th>
      {#each columns as col}
      <th>{renderAttributeLabel(data.entity, col)}</th>
      {/each}
      <th></th>
    </tr>
  </thead>
  {#if data.documents.length > 0 }
  <tbody>
    {#each data.documents as doc}
    <tr>
      <td style="width: 20%;">{doc.id}</td>
      {#each columns as col}
      <td>{renderAttributeValue(data.entity, col, doc)}</td>
      {/each}
      <td style="width: 1%">
        <div class="d-flex">
          <a class="btn p-0 d-flex me-2" href="{$page.url}/{doc.id}">
            <span class="material-icons">arrow_right_alt</span>
          </a>
          <a class="btn p-0 d-flex me-2" href="{$page.url}/{doc.id}/edit">
            <span class="material-icons">edit</span>
          </a>
          <button class="btn p-0 d-flex" on:click={() => openDeleteDialog(doc)}>
            <span class="material-icons">delete</span>
          </button>
        </div>
      </td>
    </tr>
    {/each}
  </tbody>
  {/if}
</table>

{#if data.documents.length === 0 }
<div class="alert alert-warning">
  No entries yet
</div>
{/if}

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
