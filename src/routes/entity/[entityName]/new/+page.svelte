<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import EntityAttributesForm from '$lib/entity/components/EntityAttributesForm.svelte';
	import { createForm, getFormState } from '$lib/form';
	import { notify } from '$lib/notification';
	import { readSchema } from '$lib/schema';

  const form = createForm();
  const schema = readSchema();
  const entity = schema[$page.params.entityName];

  function submit() {
    notify({ 
      type: 'success', 
      message: entity.name + ' created' 
    });

    goto($page.url + '/..', { invalidateAll: true });
  }

  $: formState = getFormState($form);
</script>

<div class="page-options">
  <a class="btn btn-light d-flex me-2" href="{$page.url + '/..'}">
    <span class="material-icons me-2">chevron_left</span>
    List
  </a>
  <button class="btn btn-primary" on:click={submit} disabled={!formState.submittable}>Create</button>
</div>

<h1 class="mb-5">Create {entity.name}</h1>

<EntityAttributesForm bind:form={$form} attributes={entity.attributes} />