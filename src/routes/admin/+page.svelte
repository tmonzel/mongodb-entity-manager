<script lang="ts">
	import { page } from '$app/stores';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
</script>

<div class="row">
	{#each data.schemata as entity}
	<div class="col-md-4 mb-4">
		<a class="card" href="{$page.url}/entity/{entity.name}">
			<div class="card-body">
				<h5 class="card-title">{entity.type}</h5>
				<!--<h6 class="card-subtitle mb-2 text-body-secondary">{name}</h6>-->
				{#if entity.description}
					<p class="card-text">{entity.description}</p>
				{/if}
				<!--<a href="/entity/{name}/documents" class="btn btn-primary btn-sm">Documents</a>-->
			</div>
		</a>
	</div>
	{/each}
</div>

<style>
	.card:hover {
		background-color: var(--bs-light);
	}
</style>
