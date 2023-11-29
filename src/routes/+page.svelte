<script lang="ts">
	import { readSchema } from '$lib/schema';

	let schema = readSchema();
</script>

<div class="row">
	{#each Object.entries(schema) as [name, entity]}
	<div class="col-md-4 mb-4">
		<a class="card" href="/entity/{name}">
			<div class="card-body">
				<h5 class="card-title">{entity.name}</h5>
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
