import type { Readable, Writable } from 'svelte/store';
import type { FormControl } from './form-control';
import type { FormGroup } from './form-group';

export type FieldValidation = { 
  valid: boolean; 
  name: string;
  errorMessage: string;
};

export type Validator = (value: unknown) => FieldValidation;

export interface FormSchema {
  [name: string]: FormControl | FormControl[] | FormSchema | FormGroup;
}

export interface FormValidationError {
  name: string;
  message: string;
}

export interface FormState<T> {
  valid: boolean;
  touched: boolean;
  dirty: boolean;
  submittable: boolean;
  value: T;
}

export interface Form<T> extends Writable<T> {
  markAllAsTouched: () => void;
}

export interface FormHandler<T, V> {
  form: Form<T>,
  state: Readable<FormState<V>>;
}