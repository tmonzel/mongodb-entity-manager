import { createResolver } from '$admin/entity/resolver.server';
import type { OrderItem } from './order-item.entity';

export const OrderItemResolver = createResolver<OrderItem>({
  normalize: (item: OrderItem) => {
    return {
      ...item,
      totalPrice: item.price * item.quantity
    };
  },
});