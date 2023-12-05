import type { EntitySchema } from '$admin/types';
import { MarketCustomerSchema } from './market-customer.entity';

export type Market = {
  name: string;
}

export const MarketSchema: EntitySchema = {
  name: 'markets',
  type: 'Market',
  description: 'Stores with SAP identification',
  renderAs: '{name}',

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
      name: 'nestedProps',
      label: 'Properties',
      type: 'array',
      attributes: [
        {
          name: 'key',
          label: 'Key',
          type: 'text',
          validations: {
            required: true
          }
        },
  
        {
          name: 'value',
          label: 'Value',
          type: 'text',
          validations: {
            required: true
          }
        }
      ]
    },

    {
      name: 'state',
      label: 'State',
      type: 'select',
      options: [
        {
          name: 'No State',
          value: null
        },

        {
          name: 'Public',
          value: 'public'
        },

        {
          name: 'Private',
          value: 'private'
        }
      ],
      validations: {
        required: true
      }
    },

    {
      name: 'published',
      label: 'Published',
      type: 'switch',
      value: true,
      validations: {
        required: true
      }
    },

    /*{
      name: 'retailer',
      label: 'Retailer',
      type: 'relationship:has-one',
    }*/
  ],

  nestedSchemata: [MarketCustomerSchema],

  collection: {
    title: 'Markets',
    columns: ['name', 'published', 'state']
  },

  detail: {
    attributes: ['state']
  }
}
