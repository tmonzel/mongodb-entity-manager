<script lang="ts">
	import { isActionAllowed } from '$admin';
  import { page } from '$app/stores';
	import type { LayoutData } from './$types';

  export let data: LayoutData;

  const id = data.entity.identifiedBy ? data.document[data.entity.identifiedBy] : data.document.id;
</script>

<div class="page-options d-flex justify-content-between">
  <div class="d-flex">
    <a class="btn btn-light d-flex me-2" href="{$page.url}/..">
      <span class="material-icons me-2">chevron_left</span>
      {data.entity.title}
    </a>

    <!--
      Loop nested schemata
      <a class="btn btn-success d-flex me-2" href="{$page.url}/">
        {s.collection.title}
      </a>
    -->
  </div>

  {#if isActionAllowed(data.entity, 'update')}
  <a 
    class="btn btn-primary" 
    href="{$page.url}/edit"
  >
    Edit {data.entity.type}
  </a> 
  {/if}
</div>

<h1 class="mb-4">{data.entity.type}#{id}</h1>

{#if data.entity.detail}
  {#if data.entity.detail.attributes}
    <ul class="list-group">
    {#each data.entity.detail.attributes as name}
      {@const attr = data.entity.attributes[name]}
      <li class="list-group-item" style="width: fit-content">
        <strong>{attr?.label}</strong>: {data.document[name]}
      </li>
    {/each}
    </ul>
  {/if}
{:else}
<div class="alert alert-info">
  No detailed view defined
</div>
{/if}

