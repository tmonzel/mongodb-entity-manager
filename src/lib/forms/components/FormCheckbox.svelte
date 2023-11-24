<script lang="ts">
	import type { FormControl } from '../form-control';

  export let label: string;
  export let checked: boolean = false;
  export let control: FormControl<boolean>;
  export let disabled = false;

  const id = crypto.randomUUID();

  function handleChange(e: Event) {
    checked = (e.target as HTMLInputElement).checked;
    control = control.handleChange(checked);
  }

  function handleTouched(e: Event) {
    control.touched = true;
  }
</script>

<div class={$$props.class}>
  <div class="form-check">
    <input 
      id="formField_{id}"
      class="form-check-input" 
      type="checkbox" 
      class:is-invalid={control.touched && !control.valid}
      class:is-valid={control.touched && control.valid}
      on:change={handleChange}
      on:blur={handleTouched}
      {disabled}
      checked={control.value}
    >
    <label class="form-check-label" for="formField_{id}">
      {label}
    </label>
    <div class="invalid-feedback">
      {control.errorMessage} 
    </div>
  </div>
</div>