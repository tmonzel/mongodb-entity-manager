import type { EntitySchema } from '$lib/entity/types';

export const MarketModel: EntitySchema = {
  name: 'markets',
  type: 'Market',
  description: 'Stores with SAP identification',
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

  nestedSchemata: [
    {
      name: 'customers',
      type: 'Customer',

      attributes: [
        {
          name: 'firstName',
          label: 'First Name',
          type: 'text',
          validations: {
            required: true
          }
        },
  
        {
          name: 'lastName',
          label: 'Last Name',
          type: 'text',
          validations: {
            required: true
          }
        }
      ],

      collection: {
        title: 'Customers'
      }
    }
  ],

  collection: {
    title: 'Markets',
    columns: ['name', 'published', 'state']
  },
}
