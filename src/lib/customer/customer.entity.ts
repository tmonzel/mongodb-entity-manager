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
  key: 'customer',

  description: 'Can purchase products',
  renderAs: '{lastName}, {firstName}',
  
  attributes: {
    firstName: {
      type: 'text',
      core: true,
      validations: {
        required: true
      },
    },

    lastName: {
      type: 'text',
      core: true,
      validations: {
        required: true
      }
    },

    orders: {
      type: 'relationship:has_many'
    },

    address: {
      type: 'object',
      renderAs: '{street}, {postalCode} {city}',
      attributes: {
        street: {
          type: 'text',
        },
  
        postalCode: {
          type: 'text',
        },

        city: {
          type: 'text'
        }
      }
    },
  },

  labels: {
    totalOrders: 'Order count',
  },

  actions: ['create', 'update', 'delete'],

  // Configurate Detail View
  detail: {},

  // Configurate Collection View
  collection: {
    title: 'Customers',
    columns: ['firstName', 'lastName', 'address', 'totalOrders'],
    search: 'firstName'
  }
});
