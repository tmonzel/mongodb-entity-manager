<script lang="ts">
	import { page } from '$app/stores';
	import type { EntityAttribute } from '$admin/types';
	import type { Document } from 'mongodb';
  import type { LayoutData } from './$types';
	import Dialog from '$admin/components/Dialog.svelte';
	import { actions } from '$admin/actions';
	import { invalidateAll } from '$app/navigation';

  export let data: LayoutData;

  let deleteDialog: Dialog;
  let attributesByName: { [name: string]: EntityAttribute } = {}
  let columns: string[] = data.entity.collection.columns ?? data.entity.attributes.map(attr => attr.name);
  
  for(const attr of data.entity.attributes) {
    attributesByName[attr.name] = attr;
  }

  function openDeleteDialog(doc: Document): void {
    deleteDialog.open(doc);
  }

  async function deleteDocument(id: string): Promise<void> {
    await actions.documents.deleteOne.mutate({ id, name: data.entity.name });

    deleteDialog.close();
    invalidateAll();
  }

  function renderCell(column: string, doc: Document): string {
    const attr = attributesByName[column];

    if(attr.type === 'object' && attr.renderAs) {
      return attr.renderAs.replace(/(\{([a-zA-Z]+)\})+/g, (match, ...groups) => {
        const attrName = groups[1];
        
        return doc[column] && doc[column][attrName] ? doc[column][attrName] : '-';
      });
    }

    return doc[column] ?? '-'
  }
</script>

<div class="page-options">
  <a class="btn btn-light d-flex me-2" href="{$page.url}/../..">
    <span class="material-icons me-2">chevron_left</span>
    Entities
  </a>
  <a class="btn btn-primary" href="{$page.url}/new">+ Add {data.entity.type}</a>
</div>

<h1>{data.entity.collection.title}</h1>
<p class="lead mb-4">{data.entity.description}</p>
  
<table class="table">
  <thead>
    <tr>
      <th>#</th>
      {#each columns as col}
      <th>{attributesByName[col].label}</th>
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
      <td>{renderCell(col, doc)}</td>
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
