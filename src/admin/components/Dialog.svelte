<script lang="ts">
	import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';

  export let opened = false;
  export let size = 'md';
  export let data: { [key: string]: any } | undefined = undefined;

  const dispatch = createEventDispatcher<{ close: void }>();

  export function open(d?: { [key: string]: any }): void {
    data = d;
    opened = true;
  }

  export function close(): void {
    opened = false;
    dispatch('close');
  }
</script>

{#if opened}
<div class="modal" tabindex="-1" role="dialog" aria-hidden={false}>
    <div class="modal-dialog modal-{size}" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title"><slot name="title" {data}></slot></h5>
          <button type="button" class="btn-close" aria-label="Close" on:click={close}></button>
        </div>
        <div class="modal-body">
          <slot {data} />
        </div>
        <div class="modal-footer">
          <slot name="footer" {data}></slot>
        </div>
      </div>
    </div>
  </div>
  <div class="modal-backdrop show" transition:fade={{ duration: 100 }}></div>
{/if}

<style>
  .modal {
    display: block;
  }
</style>