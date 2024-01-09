import { createEntity } from '$admin/entity';
import type { Product } from '$lib/product/product.entity';
import type { Customer } from '../customer/customer.entity';

export type Order = {
  customer: Customer;
  items: OrderItem[];
  createdAt: Date;
}

export type OrderItem = {
  product: Product;
  quantity: number;
  price: number;
}

export const OrderEntity = createEntity({
  type: 'Order',
  description: 'Groups of ordered items by customer',

  attributes: {
    customer: {
      type: 'relationship:belongs_to',
      ref: 'customers',
      editable: true
    },
  
    items: {
      type: 'embedded',
      label: 'Items',
      editable: true,

      entity: {
        type: 'OrderItem',
        attributes: {
          product: {
            type: 'relationship:belongs_to',
            ref: 'products',
            label: 'Product',
            renderAs: '{name}',
          },
      
          quantity: {
            type: 'number',
            default: 1,
          },
      
          price: {
            type: 'number',
            default: 0.0,
          },
        },

        includes: ['product'],
        columns: ['product', 'quantity', 'price', 'totalPrice']
      }
    },
  
    createdAt: {
      type: 'text',
    },
  },

  actions: [
    'update', 
    'create', 
    'delete'
  ],

  form: [
    'customer', 
    'items'
  ],

  includes: ['customer'],

  title: 'Orders',
  columns: ['customer', 'totalPrice', 'createdAt']
});
