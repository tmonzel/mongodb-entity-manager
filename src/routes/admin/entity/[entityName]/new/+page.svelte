<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { actions } from '$admin/actions';
	import EntityForm from '$admin/entity/components/EntityForm.svelte';
	import { createForm, getFormState, markAllAsTouched } from '$admin/form';
	import { notify } from '$admin/notification';
	import type { PageData } from './$types';

  export let data: PageData;

  const form = createForm();

  async function submit() {
    if(!formState.valid) {
      markAllAsTouched(form);
      return;
    }

    await actions.documents.create.mutate({ 
      entityName: data.entity.name, 
      data: formState.value 
    });

    notify({ 
      type: 'success', 
      message: data.entity.type + ' created' 
    });

    goto($page.url + '/..', { invalidateAll: true });
  }
  
  $: formState = getFormState($form);
</script>

<div class="page-options justify-content-between">
  <a class="btn btn-light d-flex me-2" href="{$page.url + '/..'}">
    <span class="material-icons me-2">chevron_left</span>
    {data.entity.collection.title}
  </a>
  <button class="btn btn-primary" on:click={submit} disabled={!formState.submittable}>Create</button>
</div>

<h1 class="mb-5">New {data.entity.type}</h1>

<EntityForm bind:form={$form} schema={data.entity} />