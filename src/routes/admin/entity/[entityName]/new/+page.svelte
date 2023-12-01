<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { actions } from '$lib/actions';
	import EntityForm from '$lib/entity/components/EntityForm.svelte';
	import { createForm, getFormState, markAllAsTouched } from '$lib/form';
	import { notify } from '$lib/notification';
	import type { PageData } from './$types';

  export let data: PageData;

  const form = createForm();
  const entity = data.entity;

  async function submit() {
    if(!formState.valid) {
      markAllAsTouched(form);
      return;
    }

    await actions.documents.create.mutate({ 
      entityName: entity.name, 
      data: formState.value 
    });

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

<h1 class="mb-5">Create {entity.type}</h1>

<EntityForm bind:form={$form} schema={entity} />