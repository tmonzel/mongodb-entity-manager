import type { Customer } from '../customer/customer.entity';
import { OrderItemEntity, type OrderItem } from './order-item.entity';
import { createEntity } from '$admin/entity';

export type Order = {
  customer: Customer;
  items: OrderItem[];
  createdAt: Date;
}

export const OrderEntity = createEntity({
  type: 'Order',
  key: 'order',
  description: 'Groups of ordered items by customer',

  attributes: {
    customer: {
      type: 'relationship:belongs_to',
      ref: 'customers',
      core: true
    },
  
    items: {
      type: 'embed',
      core: true,
      entity: OrderItemEntity,
    },
  
    createdAt: {
      type: 'text',
    },
  },

  actions: ['update'],

  form: ['customer', 'items'],

  collection: {
    title: 'Orders',
    columns: ['customer', 'totalPrice', 'createdAt']
  },
});
