<script lang="ts">
	import { renderAttributeColumn, renderAttributeValue } from '$admin/client/helpers';
	import type { Entity } from '$admin/types';
	import type { Document } from 'mongodb';

  export let entity: Entity;
  export let data: Document[];

  const columns: string[] = entity.collection.columns ?? Object.keys(entity.attributes);
</script>

<table class="table">
  <thead>
    <tr>
      <th>#</th>
      {#each columns as col}
      <th>{renderAttributeColumn(entity, col)}</th>
      {/each}
      <th></th>
    </tr>
  </thead>
  {#if data.length > 0 }
  <tbody>
    {#each data as doc}
    <tr>
      <td style="width: 20%;">{doc.id}</td>
      
      {#each columns as col}
        {#if entity.attributes[col] !== undefined}
          <td>{renderAttributeValue(entity.attributes[col], col, doc)}</td>
        {:else}
          <td>{doc[col]}</td>
        {/if}
      {/each}

      <td style="width: 1%">
        <div class="d-flex">
          <slot name="options" document={doc}></slot>
        </div>
      </td>
    </tr>
    {/each}
  </tbody>
  {/if}
</table>

{#if data.length === 0 }
<div class="alert alert-warning">
  No entries found
</div>
{/if}