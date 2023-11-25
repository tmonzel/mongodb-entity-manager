import { derived, writable } from 'svelte/store';
import type { Form, FormSchema, FormState, FormValidationError } from './types';
import { FormControl } from './form-control';

function walkControls(schema: FormSchema, writer: (control: FormControl, path: string) => FormControl): any {
  const result: any = {};

  for(const [name, entry] of Object.entries(schema)) {
    if(Array.isArray(entry)) {
      result[name] = entry.map((v) => {
        return v instanceof FormControl ? writer(v, name) : walkControls(v, writer);
      });
    } else if(entry instanceof FormControl) {
      // Is concrete FormControl
      result[name] = writer(entry, name);
    } else if(typeof entry === 'object') {
      result[name] = walkControls(entry as FormSchema, writer);
    } else {
      // Do nothing atm
    }
  }

  return result;
}

export function extractValue(schema: FormSchema): any {
  return walkControls(schema, (control) => {
    return control.value;
  });
}

export function createForm<T extends FormSchema, ValueType = any>(schema: T): Form<T, ValueType> {
  const form = writable<T>(schema);
  const state = derived(form, (schema) => {
    let errors: FormValidationError[] = [];
    let touched = false;
    let dirty = false;
    let submittable = true;

    const value = walkControls(schema, (control, path) => {
      if(control.errorMessage) {
        errors = [...errors, { name: path, message: control.errorMessage! }]
      }

      if(control.dirty) {
        dirty = true;
      }
      
      if(control.touched) {
        touched = true;

        if(!control.valid) {
          submittable = false;
        }
      }

      return control.value;
    });

    return {
      valid: errors.length === 0,
      touched,
      dirty,
      value,
      submittable
    } satisfies FormState<ValueType> as FormState<ValueType>;
  });

  function walkForm(walker: (control: FormControl) => FormControl): void {
    form.update(schema => walkControls(schema, walker))
  }

  function markAllAsTouched(): void {
    walkForm((control) => {
      control.touched = true;
      return control;
    });
  }

  return {
    form,
    state,
    markAllAsTouched,
  };
}
