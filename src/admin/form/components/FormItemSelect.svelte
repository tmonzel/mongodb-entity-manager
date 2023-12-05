<script lang="ts">
	import type { Document } from 'mongodb';
	import { derived, writable } from 'svelte/store';
	import type { FormControl } from '../form-control';
	import { onDestroy } from 'svelte';

  type Item = Document | string | number;

  export let items: Item[] = [];
  export let label: string;
  export let control: FormControl;
  export let multiple = Array.isArray(control.value) ? true : false;

  export let getItemValue = (item: Item) => {
    if(typeof item === 'object' && item.id) {
      // Use id property as default for object type items
      return item.id;
    }

    return item;
  }

  export let renderItem = (item: Item) => {
    if(typeof item === 'object' && item.name) {
      // Render name property as default for object type items
      return item.name;
    }

    return item;
  }

  export let compareItem = (a: Item, b: Item): boolean => {
    return getItemValue(a) === getItemValue(b);
  }
  
  const id = crypto.randomUUID();
  const store = writable(items);
  const input = writable<string>();
  const value = writable(control.value ?? (multiple ? [] : null));

  $: {
    // Update items store on property change
    store.set(items);
  }
  
  let selectionMode = false;
  let inputElement: HTMLInputElement;

  function handleChange(value: any) {
    control = control.handleChange(value);
  }

  function selectItem(item: Item) {
    value.update(value => {
      if(multiple) {
        return [...value, getItemValue(item)];
      }
      
      return value;
    });

    if(!multiple) {
      $input = renderItem(item);
      selectionMode = false;
    }
  }

  function removeItem(item: Item) {
    value.update(value => {
      if(multiple) {
        return value.filter((v: any) => !compareItem(item, v))
      }

      return null;
    });
  }

  function onInputKeyDown(event: KeyboardEvent) {
    if(!multiple) {
      return;
    }

    const inputElement = event.currentTarget as HTMLInputElement;
    
    if(inputElement.value === '' && event.key === 'Backspace') {
      // Remove last selected item

      value.update(values => {
        values.pop();
        return values;
      })
    }
  }

  function isItemSelected(item: Item): boolean {
    if(Array.isArray($value)) {
      return $value.find(v => compareItem(item, v)) !== undefined
    }

    return compareItem(item, $value);
  }

  const unsubscribeWatchItems = value.subscribe(handleChange);

  onDestroy(() => {
    unsubscribeWatchItems();
  });

  $: selectedItems = derived([store, value], ([items, value]) => {
    return (value as any[]).map(v => items.find(item => (getItemValue(item) === v)))
  })

  $: filteredItems = derived([store, input, value], ([items, input, value]) => {
    if(input === '') {
      return items;
    }

    return items.filter(item => renderItem(item).match(new RegExp(input, 'i')) !== null);
  });


  $: hasValue = derived(value, (value) => {
    if(multiple) {
      return (value as any[]).length > 0;
    }

    if(value === '') {
      return false;
    }

    return value != null;
  });
</script>

<div class="form-item-select form-floating">
  {#if !selectionMode && !$hasValue}
  <label for={id}>{label}</label>
  {/if}
  <div 
    class="form-control d-flex align-items-center" 
    role="button" 
    tabindex="0" 
    on:click={() => inputElement.focus()} 
    on:keydown={() => inputElement.focus()}
  >
    {#if multiple}
    <div>
      {#each $selectedItems as item, i}
        {#if item}
          {#if i > 0}, {/if}{renderItem(item)}<!--<button class="btn p-0 material-icons fs-5 text-danger" on:click|stopPropagation={() => removeItem(item)}>
            cancel
          </button>-->
        {/if}
      {/each}
    </div>
    {/if}
    <input 
      bind:this={inputElement}
      class="border-0 flex-grow-1"
      style="outline: none;"
      id={id}
      bind:value={$input}
      on:keydown={onInputKeyDown}
      on:focusin={() => selectionMode = true}
      on:focusout={() => selectionMode = false}
    >
  </div>
  {#if selectionMode || $hasValue}
  <label for={id}>{label}</label>
  {/if}
  <div class="position-relative pt-1">
    {#if selectionMode}
      {#if $filteredItems.length > 0}
        <ul class="list-group w-100 position-absolute shadow-sm">
          {#each $filteredItems as item}
          {@const selected = isItemSelected(item)}
          <li class="list-group-item d-flex p-0" class:active={selected}>
            <button 
              class="dropdown-item p-2" 
              on:mousedown|preventDefault={() => selected ? removeItem(item) : selectItem(item)}
            >
              {#if multiple}
              <input 
                class="form-check-input" 
                type="checkbox" checked={selected}
                style="pointer-events: none;"
              >
              {/if}
              {renderItem(item)}
            </button>
          </li>
          {/each}
        </ul>
      {:else if $input !== ''}
        <div class="alert alert-warning px-2 py-1 position-absolute w-100">
          Search '<strong>{$input}</strong>' has no results
        </div>
      {/if}
    {/if}
  </div>
</div>

<style>
  .list-group-item.active {
    background-color: #eee;
    border-color: #aaa;
    font-weight: 600;
    color: inherit;
  }
</style>
