import type { EntitySchema } from '$admin/types';

export const ProjectModel: EntitySchema = {
  name: 'projects',
  type: 'Project',
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

  collection: {
    title: 'Projects'
  }
}
