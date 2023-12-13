import { createEntity } from '$admin/server/entity';

export type ProductVariant = {
  name: string;
  price: number;
}

export const ProductVariantEntity = createEntity({
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
});
