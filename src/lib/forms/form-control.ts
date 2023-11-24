import type { Validator } from './types';

export class FormControl<T = any> {
  validators: Validator[];
  touched: boolean = false;
  dirty: boolean = false;
  errorMessage?: string;
  valid = true;
  value: T;

  constructor(initialValue: T, validators: Validator | Validator[] = []) {
    this.value = initialValue;
    this.validators = Array.isArray(validators) ? validators : [validators];

    this.setValue(initialValue);
  }

  setValue(value: T): void {
    this.value = value;
    this.valid = true;

    delete this.errorMessage;

    for(const validator of this.validators) {
      const result = validator(value);

      if(!result.valid) {
        this.errorMessage = result.errorMessage;
        this.valid = false;
        break;
      }
    }
  }

  handleChange(value: T): FormControl<T> {
    this.dirty = true;

    this.setValue(value);

    return this;
  }
}