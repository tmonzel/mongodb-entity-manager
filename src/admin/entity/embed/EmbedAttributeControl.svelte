<script lang="ts">
	import { markAllAsTouched, type FormControl, getFormState, createForm } from '$admin/form';
	import type { Document } from 'mongodb';
	import Dialog from '../../components/Dialog.svelte';
	import EntityForm from '../EntityForm.svelte';
	import type { EmbedAttribute } from './types';
	import AttributeValue from '../AttributeValue.svelte';
	import { EntityActions, renderAttributeColumn } from '$admin';
	import { page } from '$app/stores';

  export let key: string;
  export let attribute: EmbedAttribute;
  export let control: FormControl<Document[]>;
  export let value: Document[];
  
  const form = createForm();

  let documents: Document[] = value ?? [];
  let createDialog: Dialog;
  let updateDialog: Dialog;
  let selectedIndex: number | null = null;
  let columns = attribute.entity.columns ?? Object.keys(attribute.entity.attributes);

  $: editableDocument = selectedIndex != null ? documents[selectedIndex] : undefined;

  async function save() {
    if(!formState.valid) {
      markAllAsTouched(form);
      return;
    }

    const doc = await EntityActions.loadEmbed({ 
      entityKey: $page.params.entityName, 
      embedName: key,
      data: formState.value
    });

    if(selectedIndex !== null) {
      documents = documents.map((value, index) => {
        if(index === selectedIndex) {
          return doc;
        }

        return value;
      });

      control.value[selectedIndex] = formState.value;
      control = control;
      
      updateDialog.close();
    } else {
      documents = [...documents, doc];
      control = control.handleChange([ 
        ...control.value, 
        formState.value
      ]);
      
      createDialog.close();
    }
  }

  function removeByIndex(index: number): void {
    documents = documents.filter((value, i) => {
      return i !== index;
    });

    control = control.handleChange(control.value.filter((value, i) => {
      return i !== index;
    }));
  }

  $: formState = getFormState($form);
</script>

<div class="bg-light p-3">
  <div class="mb-2">
    <small class="text-muted">{attribute.label}</small>
  </div>

  <table class="table">
    <thead>
      <tr>
        {#each columns as col}
        <th>{renderAttributeColumn(attribute.entity, col)}</th>
        {/each}
        <th></th>
      </tr>
    </thead>
    {#if documents.length > 0 }
    <tbody>
      {#each documents as value, index}
      <tr>
        {#each columns as col}
          {#if attribute.entity.attributes[col] !== undefined}
            <td><AttributeValue attribute={attribute.entity.attributes[col]} key={col} value={value[col]} /></td>
          {:else}
            <td>{value[col]}</td>
          {/if}
        {/each}
        <td style="width: 1%">
          <div class="d-flex">
            <button class="btn material-icons p-0 me-2" on:click={() => selectedIndex = index}>
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

  {#if documents.length === 0 }
  <div class="alert alert-warning">
    No entries yet
  </div>
  {/if}

  <button class="btn btn-success" on:click={() => createDialog.open()}>Add</button>

  <!-- Update Dialog -->
  <Dialog bind:this={updateDialog} opened={!!editableDocument} on:close={() => selectedIndex = null}>
    <svelte:fragment slot="title">
      Update {attribute.entity.type}
    </svelte:fragment>
    
    <EntityForm bind:form={$form} entity={attribute.entity} value={editableDocument} />

    <svelte:fragment slot="footer">
      <button class="btn btn-primary" disabled={!formState.submittable} on:click={() => save()}>
        Update
      </button>
    </svelte:fragment>
  </Dialog>

  <!-- Create Dialog -->
  <Dialog bind:this={createDialog}>
    <svelte:fragment slot="title">
      Create {attribute.entity.type}
    </svelte:fragment>

    <EntityForm bind:form={$form} entity={attribute.entity} />

    <svelte:fragment slot="footer">
      <button class="btn btn-primary" disabled={!formState.submittable} on:click={() => save()}>
        Create
      </button>
    </svelte:fragment>
  </Dialog>
</div>

