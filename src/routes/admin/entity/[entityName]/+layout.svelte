<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import type { LayoutData } from './$types';
	import type { EntityContext, FindActionInput, FindResult } from '$admin/types';
	import { writable } from 'svelte/store';
	import { EntityActions } from '$admin/client';
	import { page } from '$app/stores';

  export let data: LayoutData;
  
  const searchTerm = writable<string | null>(null);
  const result = writable<FindResult & { page: number }>({
    data: [],
    totalItems: 0,
    totalPages: 0,
    page: 1
  });
  
  let debounceTimout: number;

  function find(options: { term?: string; page?: number } = { term: '' }, debounceTime: number = 0) {
    const input: FindActionInput = { 
      entityName: $page.params.entityName,
      pageSize: data.entity.collection.pageSize ?? 25,
      page: options.page ?? 1,
    }

    if(options.term != null) {
      $searchTerm = options.term;
    }

    if(data.entity.collection.search) {
      input.filter = { [data.entity.collection.search]: { $regex: $searchTerm ?? '', $options: 'i' } }
    }

    clearTimeout(debounceTimout);

    debounceTimout = setTimeout(async() => {
      const r = await EntityActions.find(input);
      result.set({
        ...r,
        page: input.page
      });
    }, debounceTime);
  }
  
  setContext<EntityContext>('entity', {
    entity: data.entity,
    searchTerm,
    result,
    find
  });

  onMount(() => {
    find();
  })
</script>

<slot></slot>