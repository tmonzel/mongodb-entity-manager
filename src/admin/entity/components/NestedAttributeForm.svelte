<script lang="ts">
	import { markAllAsTouched, type FormControl, getFormState, createForm } from '$admin/form';
	import { writable } from 'svelte/store';
	import type { EntityAttribute } from '../../types';
	import type { Document } from 'mongodb';
	import { onDestroy } from 'svelte';
	import Dialog from '$admin/components/Dialog.svelte';
	import AttributeForm from './AttributeForm.svelte';

  export let attributes: EntityAttribute[];
  export let control: FormControl<Document[]>;
  export let label: string = '';
  
  const form = createForm();
  const values = writable<Document[]>(control.value);
  
  let formDialog: Dialog;
  let selectedIndex = writable<number | null>();

  $: editableDocument = $selectedIndex != null ? $values[$selectedIndex] : undefined;

  function save() {
    if(!formState.valid) {
      markAllAsTouched(form);
      return;
    }
    
    if(editableDocument) {
      values.update(v => v.map((value, index) => {
        if(index === $selectedIndex) {
          return formState.value;
        }

        return value;
      }));

      $selectedIndex = null;

    } else {
      values.update(v => ([...v, formState.value]));
    
      formDialog.close();
    }
  }

  function removeByIndex(index: number): void {
    values.update(v => v.filter((value, i) => {
      return i !== index;
    }));
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
      {#each $values as value, index}
      <tr>
        {#each attributes as attr}
        <td>{value[attr.name]}</td>
        {/each}
        <td style="width: 1%">
          <div class="d-flex">
            <button class="btn material-icons p-0 me-2" on:click={() => $selectedIndex = index}>
              edit
            </button>
            <button class="btn material-icons p-0" on:click={() => removeByIndex(index)}>
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

  <button class="btn btn-success" on:click={() => formDialog.open()}>Add</button>

  <!-- Update Dialog -->
  <Dialog opened={!!editableDocument} on:close={() => $selectedIndex = null}>
    <svelte:fragment slot="title">
      Update Prop
    </svelte:fragment>

    <AttributeForm bind:form={$form} {attributes} value={editableDocument} />

    <svelte:fragment slot="footer">
      <button class="btn btn-primary" disabled={!formState.submittable} on:click={() => save()}>
        Update
      </button>
    </svelte:fragment>
  </Dialog>

  <!-- Create Dialog -->
  <Dialog bind:this={formDialog}>
    <svelte:fragment slot="title">
      Create Prop
    </svelte:fragment>

    <AttributeForm bind:form={$form} {attributes} />

    <svelte:fragment slot="footer">
      <button class="btn btn-primary" disabled={!formState.submittable} on:click={() => save()}>
        Create
      </button>
    </svelte:fragment>
  </Dialog>
</div>

