import type { Entity, EntityAttributeMap } from '$admin/types';
import type { Document } from 'mongodb';
import type { Customer } from '../customer/customer.entity';
import type { Product, ProductVariant } from '../product/product.entity';
import type { Mutation } from '$admin/server/types';

export interface Order {
  customer: Customer;
  items: OrderItem[];
  totalPrice: number;
  createdAt: Date;
}

export type OrderItem = {
  product: Product;
  productVariant: ProductVariant;
  quantity: number;
  price: number;
}

const attributes: EntityAttributeMap = {
  customer: {
    type: 'relationship:belongs_to',
    ref: 'customers',
    label: 'Customer' 
  },

  items: {
    type: 'embed',
    core: true,
    entity: {
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
    },
  },

  totalPrice: {
    type: 'number',
    label: 'Total Price',
    core: true,
    virtual: true
  },

  createdAt: {
    type: 'text',
    label: 'Created At',
  },
}

export const OrderEntity: Entity = {
  type: 'Order',
  key: 'order',
  description: 'Groups of ordered items by customer',
  renderAs: '{totalPrice}',

  attributes,

  form: ['customer', 'items'],

  collection: {
    title: 'Orders',
    columns: ['customer', 'totalPrice', 'createdAt']
  },
}

export const OrderResolver = {
  normalize: (doc: Document) => {
    const order = doc as Order;

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
}

export const OrderItemResolver = {
  normalize: (doc: Document) => {
    const item = doc as OrderItem;

    return {
      ...item,
      totalPrice: item.price * item.quantity
    };
  },
}