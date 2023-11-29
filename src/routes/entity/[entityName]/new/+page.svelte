<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import EntityForm from '$lib/entity/components/EntityForm.svelte';
	import { notify } from '$lib/notification';
	import { readSchema } from '$lib/schema';

  let form: EntityForm;
  let submittable = true;
  let schema = readSchema();
  
  $: entity = schema[$page.params.entityName];
</script>

<div class="page-options">
  <a class="btn btn-light d-flex me-2" href="{$page.url + '/..'}">
    <span class="material-icons me-2">chevron_left</span>
    List
  </a>
  <button class="btn btn-primary" on:click={() => form.submit()} disabled={!submittable}>Create</button>
</div>

<h1 class="mb-5">Create {entity.name}</h1>

<EntityForm 
  bind:this={form} 
  bind:submittable 
  on:saved={() => {
    notify({ 
      type: 'success', 
      message: entity.name + ' created' 
    });

    goto($page.url + '/..', { invalidateAll: true });
  }}

  entityName={$page.params.entityName}
  attributes={entity.attributes} 
/>