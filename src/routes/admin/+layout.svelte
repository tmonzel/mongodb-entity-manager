<script lang="ts">
	import Notification from '$admin/notification/Notification.svelte';
	import { setContext } from 'svelte';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	setContext('schema', data.schema);
</script>

<svelte:head>
	<link
		href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
		rel="stylesheet"
		integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN"
		crossorigin="anonymous"
	/>

	<link href="https://cdn.jsdelivr.net/npm/material-icons@1.13.12/iconfont/material-icons.min.css" rel="stylesheet">

	<style>
		body {
			font-family: 'Jetbrains Mono', sans-serif;
		}

		a.card {
			text-decoration: none;
		}

		.page-options {
			margin-bottom: 1.5rem;
			display: flex;
		}
	</style>
</svelte:head>

<Notification />

<main class="p-5">
	<slot />
</main>
