<script lang="ts">
  import { fade } from "svelte/transition";

  export let opened = false;
  export let size = 'md';

  export function open(): void {
    opened = true;
  }

  export function close(): void {
    opened = false;
  }
</script>

{#if opened}
<div class="modal" tabindex="-1" role="dialog" aria-hidden={false}>
    <div class="modal-dialog modal-{size}" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title"><slot name="title"></slot></h5>
          <button type="button" class="btn-close" aria-label="Close" on:click={close}></button>
        </div>
        <div class="modal-body">
          <slot />
        </div>
        <div class="modal-footer">
          <slot name="footer"></slot>
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