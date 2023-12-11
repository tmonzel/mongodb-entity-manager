import type { Entity } from '$admin/types';

export type Customer = {
  firstName: string;
  lastName: string;
  address: { 
    street: string; 
    postalCode: string; 
  };
}

export const CustomerEntity: Entity = {
  type: 'Customer',
  description: 'Can purchase products',
  renderAs: '{lastName}, {firstName}',
  
  attributes: {
    firstName: {
      label: 'First Name',
      type: 'text',
      validations: {
        required: true
      }
    },

    lastName: {
      label: 'Last Name',
      type: 'text',
      validations: {
        required: true
      }
    },

    address: {
      label: 'Address',
      type: 'object',
      renderAs: '{street}, {postalCode} {city} ',
      attributes: {
        street: {
          label: 'Street',
          type: 'text',
        },
  
        postalCode: {
          label: 'Postal code',
          type: 'text',
        },

        city: {
          label: 'City',
          type: 'text'
        }
      }
    },
  },

  // Configurate Detail View
  detail: {},

  // Configurate Collection View
  collection: {
    title: 'Customers',
    columns: ['firstName', 'lastName', 'address']
  }
}
