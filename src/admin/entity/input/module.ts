import { FormControl, Validators, type Validator } from '$admin/form';
import type { EntityAttributeModule } from '../types';
import type { InputAttribute } from './types';
import InputAttributeControl from './InputAttributeControl.svelte';

export const InputAttributeModule: EntityAttributeModule<InputAttribute> = {
  createControl(value: any, attr: InputAttribute) {
    const validators = Object.entries(attr.validations ?? {}).map(([n]) => {
      switch(n) {
        case 'required':
          return Validators.required();
      }
    }) as Validator[];

    return new FormControl<any>(value ?? attr.default, validators);
  },

  edit: InputAttributeControl,
}
