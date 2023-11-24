<script lang="ts">
	import { page } from '$app/stores';
import type { PageData } from './$types';

  export let data: PageData;
</script>

<div class="page-options">
  <a class="btn btn-light d-flex me-2" href="/">
    <span class="material-icons me-2">chevron_left</span>
    Entities
  </a>
  <a class="btn btn-primary" href="./{data.entity.name}/new">+ Add {data.entity.schema.name}</a>
</div>

<h1 class="my-4">{data.entity.schema.name}</h1>
  
<table class="table">
  <thead>
    <tr>
      <th>#</th>
      {#each data.entity.schema.attributes as attr}
      <th>{attr.label}</th>
      {/each}
      <th></th>
    </tr>
  </thead>
  {#if data.entity.documents.length > 0 }
  <tbody>
    {#each data.entity.documents as doc}
    <tr>
      <td style="width: 20%;">{doc.id}</td>
      {#each data.entity.schema.attributes as attr}
      <td>{doc[attr.name] ?? '-'}</td>
      {/each}
      <td style="max-width: 20px">
        <a class="btn p-0 d-flex" href="{$page.url}/{doc.id}/edit">
          <span class="material-icons">edit</span>
        </a>
      </td>
    </tr>
    {/each}
  </tbody>
  {/if}
</table>

{#if data.entity.documents.length === 0 }
<div class="alert alert-warning">
  No entries yet
</div>
{/if}

<!--<Modal bind:this={formDialog} size="lg">
  <svelte:fragment slot="title">
    {#if selectedDocument}
      Edit {data.schema.name}
    {:else}
      Add new {data.schema.name}
    {/if}
  </svelte:fragment>

  <DocumentForm 
    bind:this={form}
    bind:submittable
    schema={data.schema} 
    input={selectedDocument}
    on:success={() => formDialog.close()}
  />
  
  <svelte:fragment slot="footer">
    <button type="button" class="btn btn-secondary" on:click={() => formDialog.close()}>Cancel</button>
    <button 
      type="button" 
      class="btn btn-primary" 
      on:click={() => form.submit()}
      disabled={!submittable}
    >
    {#if selectedDocument}
      Save {data.schema.name}
    {:else}
      Create {data.schema.name}
    {/if}
    </button>
  </svelte:fragment>
</Modal>-->