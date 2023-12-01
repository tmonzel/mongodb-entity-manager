import type { DataSchema } from './entity/types';

export function readSchema(): DataSchema {
  return {
    persons: {
      name: 'Person',
      description: 'A normal person with a first and lastname',
      
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
        },
  
        {
          name: 'address',
          label: 'Address',
          type: 'object',
          renderAs: '{street} {postalCode}',
          attributes: [
            {
              name: 'street',
              label: 'Street',
              type: 'text',
            },
      
            {
              name: 'postalCode',
              label: 'Postal code',
              type: 'text',
            }
          ]
        },

        {
          name: 'projects',
          type: 'relationship:has-many',
        }
      ],
  
      list: {
        title: 'Persons',
        columns: ['firstName', 'lastName', 'address'],
        search: 'firstName',
        pageSize: 25
      }
    },
  
    projects: {
      name: 'Project',
      description: 'A task which a person can do',
      renderAs: '{title}',
      
      attributes: [
        {
          name: 'title',
          label: 'Title',
          type: 'text',
          validations: {
            required: true
          }
        },
      ],
  
      list: {
        title: 'Projects',
        columns: ['title'],
        search: 'title',
        pageSize: 25
      }
    },

    markets: {
      name: 'Market',
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
          label: 'Customers',
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
          ]
        }
      ],

      list: {
        title: 'Markets',
        columns: ['name', 'published', 'state'],
        pageSize: 25
      },
    },

    retailers: {
      name: 'Retailer',
      description: 'Ownes markets',
      attributes: [
        {
          name: 'name',
          label: 'Name',
          type: 'text'
        }
      ],
      list: {
        title: 'Retailers',
        columns: ['name'],
        pageSize: 25
      }
    }
  };
}