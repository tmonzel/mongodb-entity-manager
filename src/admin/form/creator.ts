import { writable, type Writable } from 'svelte/store';
import { FormControl } from './form-control';
import { FormGroup, type FormState } from './types';

export function getFormState(form: FormGroup): FormState {
  const state: FormState = {
    valid: false,
    errors: [],
    touched: false,
    dirty: false,
    submittable: true,
    value: {}
  }

  for(const key in form) {
    const control = form[key];

    if(control instanceof FormControl) {
      if(control.errorMessage) {
        state.errors.push({ name: key, message: control.errorMessage! });
      }

      if(!state.touched && control.touched) {
        state.touched = true;
      }

      if(!state.dirty && control.dirty) {
        state.dirty = true;
      }

      state.value[key] = control.value;

    } else if(control instanceof FormGroup) {
      const childState = getFormState(control);

      if(!childState.valid) {
        state.valid = false;
      }

      if(childState.touched) {
        state.touched = true;
      }

      if(childState.touched) {
        state.touched = true;
      }

      if(childState.dirty) {
        state.dirty = true;
      }
      
      state.errors = [...state.errors, ...childState.errors];
      state.value = { ...state.value, [key]: childState.value };
    }
  }
  
  
  if(state.errors.length === 0) {
    state.valid = true;
  }

  if(state.touched && !state.valid) {
    state.submittable = false;
  }

  return state;
}

export function markAllAsTouched(form: Writable<FormGroup>): void {
  function updater(group: FormGroup): FormGroup {
    for(const key in group) {
      const control = group[key];

      if(control instanceof FormControl) {
        control.touched = true;
      } else if(control instanceof FormGroup) {
        group[key] = updater(control);
      }
    }

    return group;
  }

  form.update(g => updater(g))
}

export function createForm(controls: { [key: string]: FormControl | FormControl[] | FormGroup } = {}): Writable<FormGroup> {
  return writable(new FormGroup(controls));
}
