<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="row">
	{#each Object.entries(data.schema) as [name, schema]}
	<div class="col-md-4 mb-4">
		<a class="card" href="/entity/{name}">
			<div class="card-body">
				<h5 class="card-title">{schema.name}</h5>
				<!--<h6 class="card-subtitle mb-2 text-body-secondary">{name}</h6>-->
				{#if schema.description}
					<p class="card-text">{schema.description}</p>
				{/if}
				<!--<a href="/entity/{name}/documents" class="btn btn-primary btn-sm">Documents</a>-->
			</div>
		</a>
	</div>
	{/each}
</div>
