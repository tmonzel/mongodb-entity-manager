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
        required: true
      },

      {
        name: 'lastName',
        label: 'Last Name',
        type: 'text',
        required: true
      }
    ]
  },

  projects: {
    name: 'Project',
    description: 'A task which a person can do',
    attributes: []
  }
}
