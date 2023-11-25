<script lang="ts">
	import { page } from '$app/stores';
	import type { EntityAttribute } from '$lib/types';
	import type { Document } from 'mongodb';
  import type { PageData } from './$types';

  export let data: PageData;

  let entity = data.entity;
  let schema = data.entity.schema;

  let attributesByName: { [name: string]: EntityAttribute } = {}

  for(const attr of schema.attributes) {
    attributesByName[attr.name] = attr;
  }

  function renderCell(column: string, doc: Document): string {
    const attr = attributesByName[column];

    if(attr.render) {
      return attr.render.replace(/(\{([a-zA-Z]+)\})+/g, (match, ...groups) => {
        const attrName = groups[1];
        
        return doc[column] && doc[column][attrName] ? doc[column][attrName] : '-';
      });
    }

    return doc[column] ?? '-'
  }
</script>

<div class="page-options">
  <a class="btn btn-light d-flex me-2" href="/">
    <span class="material-icons me-2">chevron_left</span>
    Entities
  </a>
  <a class="btn btn-primary" href="./{entity.name}/new">+ Add {schema.name}</a>
</div>

<h1 class="my-4">{schema.name}</h1>
  
<table class="table">
  <thead>
    <tr>
      <th>#</th>
      {#each schema.list.columns as col}
      <th>{attributesByName[col].label}</th>
      {/each}
      <th></th>
    </tr>
  </thead>
  {#if entity.documents.length > 0 }
  <tbody>
    {#each entity.documents as doc}
    <tr>
      <td style="width: 20%;">{doc.id}</td>
      {#each schema.list.columns as col}
      <td>{renderCell(col, doc)}</td>
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

{#if entity.documents.length === 0 }
<div class="alert alert-warning">
  No entries yet
</div>
{/if}
