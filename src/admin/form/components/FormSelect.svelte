<script lang="ts">
	import { derived, writable } from 'svelte/store';
	import type { FormControl } from '../form-control';
	import { onDestroy } from 'svelte';

  type Option = { name: string; value: any; };

  export let options: Option[];
  export let label: string | undefined;
  export let control: FormControl;
  export let multiple = false;

  export let compareWith = (a: any, b: any): boolean => {
    return a === b;
  }
  
  const id = crypto.randomUUID();
  const store = writable(options);
  const input = writable<string>();
  const value = writable(control.value ?? (multiple ? [] : null));

  $: {
    // Update options store on property change
    store.set(options);
  }
  
  let selectionMode = false;
  let inputElement: HTMLInputElement;

  function handleChange(value: any) {
    control = control.handleChange(value);
  }

  function selectItem(item: Option) {
    value.update(value => {
      if(multiple) {
        return [...value, item.value];
      }
      
      return item.value;
    });
    
    if($input !== '' || !multiple) {
      $input = '';
      selectionMode = false;
      inputElement.blur();
    }
  }

  function removeItem(item: Option) {
    value.update(value => {
      if(multiple && Array.isArray(value)) {
        return value.filter((v: any) => !compareWith(item.value, v))
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

  function isItemSelected(item: Option): boolean {
    if(Array.isArray($value)) {
      return $value.find(v => compareWith(item.value, v)) !== undefined
    }

    return compareWith(item.value, $value);
  }

  const unsubscribeWatchItems = value.subscribe(handleChange);

  onDestroy(() => {
    unsubscribeWatchItems();
  });

  $: {
    if(!selectionMode) {
      $input = '';
    }
  }

  $: selectedOptions = derived([store, value], ([options, value]) => {
    const values = Array.isArray(value) ? value : [value];
    return options.filter(opt => values.find(v => compareWith(opt.value, v)) !== undefined)
  })

  $: filteredItems = derived([store, input, value], ([items, input, value]) => {
    if(input === '') {
      return items;
    }

    return items.filter(item => item.name.match(new RegExp(input, 'i')) !== null);
  });
</script>

<label for={id} class="form-label">{label}</label>
<div class="form-item-select">
  <div 
    class="form-control d-flex align-items-center" 
    role="button" 
    tabindex="0" 
    class:is-invalid={control.touched && !control.valid}
    class:is-valid={control.touched && control.valid}
    on:click={() => inputElement.focus()} 
    on:keydown={() => inputElement.focus()}
  >
    <div>
      {#each $selectedOptions as opt, i}
        {#if opt}
          {#if i > 0}, {/if}{opt.name}<!--<button class="btn p-0 material-icons fs-5 text-danger" on:click|stopPropagation={() => removeItem(item)}>
            cancel
          </button>-->
        {/if}
      {/each}
    </div>
    <input 
      bind:this={inputElement}
      class="border-0 flex-grow-1"
      style="outline: none;"
      id={id}
      placeholder={multiple && $selectedOptions.length === 0 ? `None selected` : ''}
      bind:value={$input}
      on:keydown={onInputKeyDown}
      on:focusin={() => selectionMode = true}
      on:focusout={() => selectionMode = false}
    >
  </div>
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
              {item.name}
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
