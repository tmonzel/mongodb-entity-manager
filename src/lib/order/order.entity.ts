import type { EntityAttributeMap } from '$admin/types';
import type { Document } from 'mongodb';
import type { Customer } from '../customer/customer.entity';
import type { Mutation } from '$admin/server/types';
import { OrderItemEntity, type OrderItem } from './order-item.entity';
import { createEntity, createResolver } from '$admin/server/entity';

export interface Order extends Document {
  customer: Customer;
  items: OrderItem[];
  totalPrice: number;
  createdAt: Date;
}

const attributes: EntityAttributeMap = {
  customer: {
    type: 'relationship:belongs_to',
    ref: 'customers',
  },

  items: {
    type: 'embed',
    core: true,
    entity: OrderItemEntity,
  },

  createdAt: {
    type: 'text',
  },
}

export const OrderEntity = createEntity({
  type: 'Order',
  key: 'order',
  description: 'Groups of ordered items by customer',

  attributes,

  actions: [],

  form: ['customer', 'items'],

  collection: {
    title: 'Orders',
    columns: ['customer', 'totalPrice', 'createdAt']
  },
});

export const OrderResolver = createResolver<Order>({
  normalize: (order: Order) => {
    return {
      ...order,
      totalPrice: order.items.reduce((v, c) => (v + c.price * c.quantity), 0)
    };
  },

  denormalize: (order: Document, mutation: Mutation) => {
    if(mutation.type !== 'create') {
      return order;
    } 

    return {
      ...order,
      createdAt: new Date(Date.now())
    };
  }
})
