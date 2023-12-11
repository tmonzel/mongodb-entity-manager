import type { Entity } from '$admin/types';
import type { Document } from 'mongodb';
import type { Customer } from './customer.entity';
import type { Product, ProductVariant } from './product.entity';
import type { Mutations } from '$admin/server/types';

export type Order = {
  customer: Customer;
  items: OrderItem[];
  totalPrice: number;
  createdAt: Date;
}

export type OrderItem = {
  product: Product;
  productVariant: ProductVariant;
  price: number;
}

export const OrderEntity: Entity = {
  type: 'Order',
  description: 'Groups of ordered items by customer',

  attributes: {
    customer: {
      type: 'relationship:has-one',
      target: 'customers',
      label: 'Customer' 
    },

    items: {
      type: 'embed',
      entity: {
        type: 'OrderItem',
        attributes: {
          product: {
            type: 'relationship:has-one',
            target: 'products',
            label: 'Products'
          }
        },

        collection: {
          title: 'Items'
        }
      }
    },

    totalPrice: {
      type: 'number',
      label: 'Total Price'
    },

    createdAt: {
      type: 'text',
      label: 'Created At',
    },
  },

  form: ['customer', 'items'],

  collection: {
    title: 'Orders',
    columns: ['customer', 'totalPrice', 'createdAt']
  },
}

export const OrderResolver = {
  normalize: (order: Document) => {
    return {
      ...order,
      totalPrice: 20
    };
  },

  denormalize: (order: Document, mutation: Mutations) => {
    if(mutation !== 'create') {
      return order;
    } 

    return {
      ...order,
      createdAt: new Date(Date.now())
    };
  }
}
