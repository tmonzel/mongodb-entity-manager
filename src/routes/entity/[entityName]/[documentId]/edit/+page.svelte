<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import EntityForm from '$lib/components/EntityForm.svelte';

  let form: EntityForm;
  let submittable = true;
  let entity = $page.data.entity;
  let document = $page.data.document;
</script>

<div class="page-options">
  <a class="btn btn-light d-flex me-2" href="{$page.url + '/../..'}">
    <span class="material-icons me-2">chevron_left</span>
    List
  </a>
  <button class="btn btn-primary" on:click={() => form.submit()} disabled={!submittable}>Save changes</button>
</div>

<h5>Edit {entity.schema.name}</h5>

<EntityForm 
  bind:this={form} 
  bind:submittable 
  on:saved={() => {
    goto($page.url + '/../..', { invalidateAll: true })
  }}

  {entity} 
  data={document}
/>