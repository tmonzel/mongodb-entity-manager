import type { EntitySchema } from '$admin/types';

export const MarketCustomerSchema: EntitySchema = {
  name: 'customers',
  type: 'Customer',

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
    }
  ],

  collection: {
    title: 'Customers'
  }
}