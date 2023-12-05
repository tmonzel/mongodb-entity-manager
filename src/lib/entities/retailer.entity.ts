import type { EntitySchema } from '$admin/types';

export const RetailerSchema: EntitySchema = {
  name: 'retailers',
  type: 'Retailer',
  description: 'Ownes markets',

  attributes: [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      validations: {
        required: true
      }
    },

    {
      name: 'markets',
      label: 'Markets',
      type: 'relationship:has-many',
    }
  ],

  collection: {
    title: 'Retailers'
  }
}
