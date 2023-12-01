<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { actions } from '$lib/actions';
	import EntityForm from '$lib/entity/components/EntityForm.svelte';
	import { createForm, getFormState, markAllAsTouched } from '$lib/form';
	import { notify } from '$lib/notification';
	import { readSchema } from '$lib/schema';

  const form = createForm();
  const schema = readSchema();
  const entity = schema[$page.params.entityName];
  const document = $page.data.document;

  export const submit = async() => {
    if(!formState.valid) {
      markAllAsTouched(form);
      return;
    }

    await actions.documents.updateOne.mutate({ 
      entityName: $page.params.entityName, 
      id: document.id,
      changes: formState.value as Partial<Document> 
    });

    notify({ 
      type: 'success', 
      message: entity.name + ' saved' 
    });

    goto($page.url + '/../..', { invalidateAll: true });
  }

  let selectedSchema = entity;

  $: formState = getFormState($form);
</script>

<div class="page-options">
  <a class="btn btn-light d-flex me-2" href="{$page.url + '/../..'}">
    <span class="material-icons me-2">chevron_left</span>
    List
  </a>

  <button 
    class="btn btn-primary" 
    on:click={submit} 
    disabled={!formState.submittable}
  >
    Save changes
  </button>
</div>

<h1 class="mb-5">Edit {entity.name}</h1>

{#if entity.nestedSchemata}
<ul class="nav nav-tabs mb-4">
  <li class="nav-item">
    <a class="nav-link active" aria-current="page" href="#">General</a>
  </li>
  {#each entity.nestedSchemata as s}
  <li class="nav-item">
    <a class="nav-link" href="#" on:click={() => selectedSchema = s}>{s.label}</a>
  </li>
  {/each}
</ul>
{/if}

<EntityForm 
  bind:form={$form} 
  schema={selectedSchema} 
  value={document} 
/>