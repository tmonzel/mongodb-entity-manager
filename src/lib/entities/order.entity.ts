import type { Entity } from '$admin/types';
import type { Customer } from './customer.entity';
import type { ProductVariant } from './product.entity';

export type Order = {
  customer: Customer;
  items: OrderItem[];
  createdAt: Date;
}

export type OrderItem = {
  productVariant: ProductVariant;
}

export const OrderEntity: Entity = {
  type: 'Order',
  description: 'Can be created by customers',

  attributes: {
    customer: {
      type: 'relationship:has-one',
      target: 'customers',
      label: 'Customer'
    },

    createdAt: {
      type: 'text',
      label: 'Erstellt am',
    },
  },

  collection: {
    title: 'Orders',
    columns: ['customer', 'createdAt']
  },
}
