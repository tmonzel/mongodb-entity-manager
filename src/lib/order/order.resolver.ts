import type { Mutation } from '$admin';
import { createResolver } from '$admin/entity/resolver.server';
import type { Order, OrderItem } from './order.entity';

export const OrderResolver = createResolver<Order>({
  output: (order: Order) => {
    return {
      ...order,
      totalPrice: order.items.reduce((v, c) => (v + c.price * c.quantity), 0)
    };
  },

  input: (order: Partial<Order>, mutation: Mutation) => {
    if(mutation.type !== 'create') {
      return order;
    } 

    return {
      ...order,
      createdAt: new Date(Date.now())
    };
  }
});

export const OrderItemResolver = createResolver<OrderItem>({
  output: (item: OrderItem) => {
    return {
      ...item,
      totalPrice: item.quantity * item.price
    };
  },
});
