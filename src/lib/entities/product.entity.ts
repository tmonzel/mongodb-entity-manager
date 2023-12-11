import type { Entity } from '$admin/types';

export type Product = {
  name: string;
  variants: ProductVariant[];
}

export type ProductVariant = {
  name: string;
  price: number;
}

export const ProductEntity: Entity = {
  type: 'Product',
  description: 'Goods which can be purchased by customers',
  renderAs: '{title}',
  
  attributes: {
    name: {
      label: 'Name',
      type: 'text',
      validations: {
        required: true
      }
    },

    variants: {
      type: 'embed',
      entity: {
        type: 'ProductVariant',
        attributes: {
          name: {
            type: 'text',
            label: 'Name'
          },

          price: {
            type: 'number',
            label: 'Price'
          }
        },

        collection: {
          title: 'Variants'
        }
      }
    }
  },

  collection: {
    title: 'Products',
    columns: ['name']
  }
}
