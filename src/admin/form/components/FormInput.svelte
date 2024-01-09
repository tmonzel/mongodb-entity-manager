<script lang="ts">
	import type { FormControl } from '../form-control';

  export let label: string | null = null;
  export let placeholder: string | null = null;
  export let type = 'text';
  export let size = 'md';
  export let value: any = null;
  export let control: FormControl;
  export let disabled = false;
  export let readonly = false;
  export let hint: string | null = null;

  const id = crypto.randomUUID();

  function handleChange(e: Event) {
    value = (e.target as HTMLInputElement).value;

    if(type === 'number') {
      value = parseFloat(value);
    }

    control = control.handleChange(value);
  }

  function handleTouched(e: Event) {
    control.touched = true;
  }
</script>

<div class={$$props.class}>
  {#if label}
  <label for="formField_{id}" class="form-label">{label}</label>
  {/if}
  <input 
    id="formField_{id}" 
    {type} 
    class="form-control form-control-{size}"
    class:is-invalid={control.touched && !control.valid}
    class:is-valid={control.touched && control.valid}
    on:input={handleChange}
    on:change={handleChange}
    on:blur={handleTouched}
    {disabled}
    {readonly}
    value={control.value ?? null} 
    placeholder={placeholder}
  >
  <div class="invalid-feedback">
    {control.errorMessage} 
  </div>
  {#if hint}
  <div class="form-text">
    {hint}
  </div>
  {/if}
</div>