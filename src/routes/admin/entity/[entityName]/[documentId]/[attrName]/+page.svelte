<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="page-options d-flex justify-content-between">
  <div class="d-flex align-items-center">
    <a class="btn btn-light d-flex me-2" href="{$page.url}/..">
      <span class="material-icons me-2">chevron_left</span>
      
    </a>
  </div>

  <a 
    class="btn btn-primary" 
    href="{$page.url}/edit"
  >
    Add 
</a>
</div>

<h1 class="mb-4">Nested entity management</h1>

<div>
  Detailed Info
</div>