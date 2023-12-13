import { createEntity, createResolver } from '$admin/server/entity';
import type { Product } from '$lib/product/product.entity';
import type { Document } from 'mongodb';

export interface OrderItem extends Document {
  product: Product;
  quantity: number;
  price: number;
}

export const OrderItemEntity = createEntity({
  type: 'OrderItem',
  key: 'orderItem',

  attributes: {
    product: {
      type: 'relationship:belongs_to',
      ref: 'products',
      label: 'Product',
      core: true
    },

    quantity: {
      type: 'number',
      default: 1,
      core: true
    },

    price: {
      type: 'number',
      default: 0.0,
      core: true
    },

    totalPrice: {
      type: 'number',
      label: 'Total Price',
      core: true,
      virtual: true
    }
  },

  form: [
    'product', 
    'quantity', 
    'price'
  ],

  collection: {
    title: 'Items'
  }
});

export const OrderItemResolver = createResolver<OrderItem>({
  normalize: (item: OrderItem) => {
    return {
      ...item,
      totalPrice: item.price * item.quantity
    };
  },
});
