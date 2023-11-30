import { FormControl, Validators } from '$lib/form';
import { FormGroup, type Validator } from '$lib/form/types';
import type { EntityAttribute } from './types';

export function createControlsFromAttributes(attributes: EntityAttribute[], value: any = {}): { [key: string]: FormControl | FormControl[] | FormGroup } {
  const controls: { [key: string]: FormControl | FormControl[] | FormGroup } = {}

  let validators: Validator[] = [];

  for(const attr of attributes) {
    switch(attr.type) {
      case 'object':
        if(attr.attributes) {
          const childControls: FormGroup = {};

          for(const k in attr.attributes) {
            const child = attr.attributes[k];
            
            childControls[child.name] = new FormControl(value[attr.name] ? value[attr.name][child.name] : '');
          }

          controls[attr.name] = new FormGroup(childControls);

        } else {
          //group.setControl(attr.name, attr.children.map((child, i) => getControlFromAttribute(child, value[i] ? value[i][child.name] : undefined)))
        }
        break;
      case 'relationship:has-many':
        controls[attr.name] = new FormControl<string[]>(value[attr.name] ?? []);
        break;
      case 'relationship:has-one':
        controls[attr.name] = new FormControl<string>(value[attr.name] ?? '');
        break;
      case 'switch':
        controls[attr.name] = new FormControl<boolean>(value[attr.name] ?? (attr.default ?? false));
        break;
      
      case 'select':
        controls[attr.name] = new FormControl(value[attr.name] ?? attr.default);
        break;
      
      case 'array':
        controls[attr.name] = new FormControl(value[attr.name] ?? []);
        break;

      case 'text': 
      case 'number':
        if(attr.validations) {
          validators = Object.entries(attr.validations).map(([name]) => {
            switch(name) {
              case 'required':
                return Validators.required();
            }
          }) as Validator[]
        }

        controls[attr.name] = new FormControl(value[attr.name] ?? '', validators);
    }
  }

  return controls;
}
