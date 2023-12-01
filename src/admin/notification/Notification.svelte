<script lang="ts">
	import { notifications } from './';
</script>

<div class="fixed-top d-flex justify-content-center">
  {#each $notifications as notification}
	<div class="toast show align-items-center text-bg-{notification.type} border-0 mt-3" role="alert" aria-live="assertive" aria-atomic="true">
		<div class="d-flex">
			<div class="toast-body">
				{notification.message}
			</div>
			<button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
		</div>
	</div>
  {/each}
</div>

<style>
	.toast {
		width: fit-content;
	}
</style>