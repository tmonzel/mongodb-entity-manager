import { createEntity } from '$admin/entity';
import type { Product } from '$lib/product/product.entity';

export type OrderItem = {
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
