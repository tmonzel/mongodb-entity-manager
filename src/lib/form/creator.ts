import { derived, writable } from 'svelte/store';
import type { FormHandler, FormState } from './types';
import type { FormGroup } from './form-group';

export function createForm<T extends FormGroup, ValueType = any>(group: T): FormHandler<T, ValueType> {
  const store = writable<T>(group);
  const state = derived(store, (g) => {
    const errors = g.getErrors();
    const valid = errors.length === 0;
    const touched = g.isTouched();
    const dirty = g.isDirty();
    const submittable = !touched || valid;
    const value = g.getValue();

    return {
      valid,
      touched,
      dirty,
      value,
      submittable
    } satisfies FormState<ValueType> as FormState<ValueType>;
  });

  function markAllAsTouched(): void {
    store.update(g => {
      g.markAllAsTouched();
      return g;
    })
  }

  return { form: { ...store, markAllAsTouched }, state };
}
