import type { Mutation } from '$admin';
import { createResolver } from '$admin/entity/resolver.server';
import type { Order } from './order.entity';

export const OrderResolver = createResolver<Order>({
  normalize: (order: Order) => {
    return {
      ...order,
      totalPrice: order.items.reduce((v, c) => (v + c.price * c.quantity), 0)
    };
  },

  denormalize: (order: Partial<Order>, mutation: Mutation) => {
    if(mutation.type !== 'create') {
      return order;
    } 

    return {
      ...order,
      createdAt: new Date(Date.now())
    };
  }
});
