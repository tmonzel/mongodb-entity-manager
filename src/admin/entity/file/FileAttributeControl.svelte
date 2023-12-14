<script lang="ts">
	import type { FormControl } from '$admin/form';
	import { onMount } from 'svelte';
	import type { FileAttribute } from './types';

  export let key: string;
  export let control: FormControl<string>;
  export let attribute: FileAttribute;

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
      control = control.handleChange(event.target?.result as string);
    };
  })
</script>

<label for={id} class="form-label">{attribute.label}</label>
<input class="form-control" type="file" id={id} on:change={(e) => changeFiles(e.currentTarget.files ?? new FileList())}>