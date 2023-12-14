import { createEntity } from '$admin';

export const MediaObjectEntity = createEntity({
  type: 'MediaObject',
  key: 'mediaObject',
  description: 'Can store binary data',

  attributes: {
    file: {
      type: 'file',
    }
  },

  actions: ['create', 'delete'],

  collection: {
    title: 'Media Objects'
  }
});
