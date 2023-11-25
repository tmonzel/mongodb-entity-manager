import { FormControl } from './form-control';
import type { FormValidationError } from './types';

export class FormGroup {
  constructor(
    readonly controls: { [key: string]: FormControl | FormControl[] | FormGroup } = {}
  ) {}

  setControl(key: string, control: FormControl | FormGroup): void {
    this.controls[key] = control;
  }

  isDirty(): boolean {
    for(const key in this.controls) {
      const control = this.controls[key];

      if(
        control instanceof FormControl && control.dirty || 
        control instanceof FormGroup && control.isDirty()) 
      {
        return true;
      }
    }

    return false;
  }

  isTouched(): boolean {
    for(const key in this.controls) {
      const control = this.controls[key];

      if(
        control instanceof FormControl && control.touched || 
        control instanceof FormGroup && control.isTouched()) 
      {
        return true;
      }
    }

    return false;
  }

  markAllAsTouched(): void {
    for(const key in this.controls) {
      const control = this.controls[key];

      if(control instanceof FormControl) {
        control.touched = true;
      } else if(control instanceof FormGroup) {
        control.markAllAsTouched();
      }
    }
  }

  getErrors(): FormValidationError[] {
    let errors: FormValidationError[] = [];

    for(const key in this.controls) {
      const control = this.controls[key];

      if(control instanceof FormControl && control.errorMessage) {
        errors = [...errors, { name: key, message: control.errorMessage! }];
      } else if(control instanceof FormGroup) {
        errors = [...errors, ...control.getErrors()];
      }
    }

    return errors;
  }

  getValue(): any {
    const result: { [key: string]: any } = {};

    for(const key in this.controls) {
      const control = this.controls[key];

      if(control instanceof FormControl) {
        result[key] = control.value;
      } else if(control instanceof FormGroup) {
        result[key] = control.getValue();
      }
    }

    return result;
  }
}