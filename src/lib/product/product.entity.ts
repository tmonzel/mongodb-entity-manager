import { createEntity } from '$admin/entity';

export type Product = {
  name: string;
  variants: ProductVariant[];
}

export type ProductVariant = {
  name: string;
  price: number;
}

export const ProductEntity = createEntity({
  type: 'Product',
  description: 'Goods which can be purchased by customers',
  renderAs: '{name}',
  
  attributes: {
    name: {
      label: 'Name',
      type: 'text',
      validations: {
        required: true
      },
      editable: true
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
      type: 'embedded',
      entity: {
        type: 'ProductVariant',
        attributes: {
          name: {
            type: 'text',
            label: 'Name',
          },
      
          price: {
            type: 'number',
            label: 'Price',
          }
        },
      }
    }
  },

  actions: ['create', 'update', 'delete'],

  title: 'Products',
  columns: ['name', 'categories'],
  search: 'name'
});
