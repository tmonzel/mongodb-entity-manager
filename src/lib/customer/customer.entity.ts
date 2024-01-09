import { createEntity } from '$admin/entity';
import type { Order } from '$lib/order/order.entity';

export type Customer = {
  firstName: string;
  lastName: string;
  address: { 
    street: string; 
    postalCode: string; 
  };
  
  orders: Order[];
}

export const CustomerEntity = createEntity({
  type: 'Customer',

  title: 'Customers',
  description: 'Can purchase products',

  renderAs: '{lastName}, {firstName}',
  
  attributes: {
    firstName: {
      type: 'text',
      editable: true,
      validations: {
        required: true
      },
    },

    lastName: {
      type: 'text',
      editable: true,
      validations: {
        required: true
      }
    },

    orders: {
      type: 'relationship:has_many',
      foreignKey: 'customer'
    },

    address: {
      type: 'object',
      editable: true,
      renderAs: '{street}, {postalCode} {city}',
      attributes: {
        street: {
          type: 'text',
          validations: {
            required: true
          }
        },
  
        postalCode: {
          type: 'text',
        },

        city: {
          type: 'text'
        }
      }
    }
  },

  actions: [
    'create', 
    'update', 
    'delete'
  ],

  includes: ['orders'],

  columns: ['firstName', 'lastName', 'address', 'totalOrders'],
  search: 'firstName'
});
