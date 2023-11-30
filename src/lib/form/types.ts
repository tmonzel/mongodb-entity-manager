import type { FormControl } from './form-control';

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

export class FormGroup {
  [controlName: string]: FormControl | FormControl[] | FormGroup;

  constructor(controls: { [controlName: string]: FormControl | FormControl[] | FormGroup } = {}) {
    Object.assign(this, controls);
  }
}

export interface FormState {
  valid: boolean;
  errors: FormValidationError[];
  touched: boolean;
  dirty: boolean;
  value: { [prop: string]: unknown };
  submittable: boolean;
}