import { createEntity } from '$admin';
import { ProductVariantEntity, type ProductVariant } from './product-variant.entity';

export type Product = {
  name: string;
  variants: ProductVariant[];
}

export const ProductEntity = createEntity({
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
      entity: ProductVariantEntity,
      core: true
    }
  },

  actions: ['create', 'update', 'delete'],

  collection: {
    title: 'Products',
    columns: ['name', 'categories'],
    search: 'name'
  }
});
