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
  key: 'product',
  description: 'Goods which can be purchased by customers',
  renderAs: '{name}',
  
  attributes: {
    name: {
      label: 'Name',
      type: 'text',
      validations: {
        required: true
      },
      core: true
    },

    categories: {
      type: 'select',
      label: 'Categories',
      multiple: true,
      options: [
        {
          name: 'Clothes',
          value: 'clothes'
        },
        {
          name: 'Tools',
          value: 'tools'
        }
      ]
    },

    variants: {
      type: 'embed',
      entity: {
        type: 'ProductVariant',
        key: 'productVariant',

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
