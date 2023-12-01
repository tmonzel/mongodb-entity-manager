import type { EntitySchema } from '$admin/types';

export const RetailerModel: EntitySchema = {
  name: 'retailers',
  type: 'Retailer',
  description: 'Ownes markets',

  attributes: [
    {
      name: 'name',
      label: 'Name',
      type: 'text'
    }
  ],

  collection: {
    title: 'Retailers'
  }
}