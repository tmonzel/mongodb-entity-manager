<script lang="ts">
	import { markAllAsTouched, type FormControl, getFormState, createForm } from '$lib/form';
	import { get, writable } from 'svelte/store';
	import type { EntityAttribute } from '../types';
	import EntityAttributesForm from './EntityAttributesForm.svelte';
	import type { Document } from 'mongodb';
	import { onDestroy } from 'svelte';
	import Dialog from '$lib/components/Dialog.svelte';

  export let attributes: EntityAttribute[];
  export let control: FormControl<Document[]>;
  export let label: string = '';
  
  const form = createForm();
  const values = writable<Document[]>(control.value);
  
  let formDialog: Dialog;

  function openFormDialog(doc: Document = {}) {
    formDialog.open(doc);
  }

  function submit() {
    if(!formState.valid) {
      markAllAsTouched(form);
      return;
    }
    
    values.update(v => ([...v, formState.value]));
    
    formDialog.close();
  }

  const unsubscribeWatchIds = values.subscribe(vals => {
    control.setValue(vals);
    control = control;
  });

  onDestroy(() => {
    unsubscribeWatchIds();
  });

  $: formState = getFormState($form);
</script>

<div class="bg-light p-3">
  <div class="mb-2">
    <small class="text-muted">{label}</small>
  </div>

  <table class="table">
    <thead>
      <tr>
        {#each attributes as attr}
        <th>{attr.label}</th>
        {/each}
        <th></th>
      </tr>
    </thead>
    {#if $values.length > 0 }
    <tbody>
      {#each $values as doc}
      <tr>
        {#each attributes as attr}
        <td>{doc[attr.name]}</td>
        {/each}
        <td style="width: 1%">
          <div class="d-flex">
            <button class="btn material-icons p-0 me-2" on:click={() => openFormDialog(doc)}>
              edit
            </button>
            <button class="btn material-icons p-0">
              delete
            </button>
          </div>
        </td>
      </tr>
      {/each}
    </tbody>
    {/if}
  </table>

  {#if $values.length === 0 }
  <div class="alert alert-warning">
    No entries yet
  </div>
  {/if}

  <button class="btn btn-success" on:click={() => openFormDialog()}>Add</button>

  <Dialog bind:this={formDialog} let:data>
    <svelte:fragment slot="title">
      Add object
    </svelte:fragment>
    <EntityAttributesForm bind:form={$form} {attributes} value={data} />
    <svelte:fragment slot="footer">
      <button class="btn btn-primary" disabled={!formState.submittable} on:click={submit}>Add</button>
    </svelte:fragment>
  </Dialog>
</div>

