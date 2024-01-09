import { createEntity } from '$admin/entity';

export const MediaObjectEntity = createEntity({
  type: 'MediaObject',

  title: 'Media Objects',
  description: 'Can store binary data',

  attributes: {
    file: {
      type: 'file',
    }
  },

  actions: ['create', 'delete'],
});
