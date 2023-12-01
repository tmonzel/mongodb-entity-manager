import type { EntitySchema } from '$admin/types';

export type Person = {
  firstName: string;
  lastName: string;
  address: { 
    street: string; 
    postalCode: string; 
  };
}

export const PersonSchema: EntitySchema = {
  name: 'persons',
  type: 'Person',
  description: 'A normal person with a first and lastname',
  
  attributes: [
    {
      name: 'firstName',
      label: 'First Name',
      type: 'text',
      validations: {
        required: true
      }
    },

    {
      name: 'lastName',
      label: 'Last Name',
      type: 'text',
      validations: {
        required: true
      }
    },

    {
      name: 'address',
      label: 'Address',
      type: 'object',
      renderAs: '{street} {postalCode}',
      attributes: [
        {
          name: 'street',
          label: 'Street',
          type: 'text',
        },
  
        {
          name: 'postalCode',
          label: 'Postal code',
          type: 'text',
        }
      ]
    },

    {
      name: 'projects',
      type: 'relationship:has-many',
    }
  ],

  collection: {
    title: 'Persons',
    columns: ['firstName', 'lastName', 'address']
  }
}
