<script lang="ts">
	import type { FormControl } from '$admin/form';
	import { onMount } from 'svelte';

  export let key: string;
  export let control: FormControl<any>;
  export let label: string;

  const id = crypto.randomUUID();
  
  let reader: FileReader;

  function changeFiles(files: FileList) {
    if(files.length === 0) {
      // No files selected
      return;
    }
    
    reader.readAsDataURL(files[0]);
  }

  onMount(() => {
    reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      control = control.handleChange(event.target?.result);
    };
  })
</script>

<label for={id} class="form-label">{label}</label>
<input class="form-control" type="file" id={id} on:change={(e) => changeFiles(e.currentTarget.files ?? new FileList())}>