import { readonly, writable } from 'svelte/store';

export interface Notification {
  type: 'primary' | 'danger' | 'warning' | 'secondary' | 'success';
  message: string;
}

const store = writable<Notification[]>([]);

export function notify(notification: Notification) {
  store.update(notifications => [notification, ...notifications]);

  setTimeout(() => {
    store.update(notifications => notifications.filter(n => n !== notification));
  }, 1000)
}

export const notifications = readonly(store);
