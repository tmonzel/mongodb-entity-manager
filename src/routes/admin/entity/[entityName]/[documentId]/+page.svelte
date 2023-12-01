<script lang="ts">
	import { page } from '$app/stores';
	import type { LayoutData } from './$types';

  export let data: LayoutData;
</script>

<div class="page-options d-flex justify-content-between">
  <div class="d-flex">
    <a class="btn btn-light d-flex me-2" href="{$page.url}/..">
      <span class="material-icons me-2">chevron_left</span>
      {data.entity.collection.title}
    </a>

    {#if data.entity.nestedSchemata}
      {#each data.entity.nestedSchemata as s}
      <a class="btn btn-success d-flex me-2" href="{$page.url}/{s.name}">
        {s.collection.title}
      </a>
      {/each}
    {/if}
  </div>

  <a 
    class="btn btn-primary" 
    href="{$page.url}/edit"
  >
    Edit {data.entity.type}
</a>
</div>

<h1 class="mb-4">{data.entity.type}#{data.document.id}</h1>

<div>
  Detailed Info
</div>

