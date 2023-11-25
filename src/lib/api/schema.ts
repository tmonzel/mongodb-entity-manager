import type { DataSchema } from '$lib/types';


export const schema: DataSchema = {
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
        type: 'object',
        children: [
          {
            name: 'street',
            label: 'Street',
            type: 'text',
            validations: {
              required: true
            }
          },
    
          {
            name: 'postalCode',
            label: 'Postal code',
            type: 'text',
          }
        ]
      }
    ],

    list: {
      title: 'Persons',
      columns: ['firstName', 'lastName'],
      search: 'firstName',
      pageSize: 25
    }
  },

  projects: {
    name: 'Project',
    description: 'A task which a person can do',
    
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
  }
}
