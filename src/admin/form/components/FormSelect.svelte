<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { FormControl } from '../form-control';

  export let label: string | null = null;
  export let control: FormControl;
  export let options: { value: any; name: string; }[] = [];

  const id = crypto.randomUUID();
  const dispatch = createEventDispatcher<{
    change: string
  }>();

  function handleChange(e: Event) {
    let val = (e.target as any).value;

    if(val === '') {
      val = null;
    }

    control = control.handleChange(val);
    dispatch('change', val);
  }

  function handleTouched(e: Event) {
    control.touched = true;
  }
</script>

{#if label}
<label for="formField_{id}" class="form-label">{label}</label>
{/if}
<select 
  id="formField_{id}"  
  class="form-select"
  class:is-invalid={control.touched && !control.valid}
  class:is-valid={control.touched && control.valid}
  on:change={handleChange} 
  on:blur={handleTouched}
>
  {#each options as opt}
    <option value={opt.value} selected={opt.value === control.value}>{opt.name}</option>
  {/each}
</select>
<div class="invalid-feedback">
  {control.errorMessage} 
</div>