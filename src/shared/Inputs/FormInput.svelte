<script>
	import { onMount } from 'svelte';
	import { nanoid } from 'nanoid';

	export let label = 'input name';
	export let value;
	let id = nanoid();
</script>

<div class="form-group">
	<label for="for{id}">{label}</label>
	<input {...$$props} id="for{id}" bind:value />
</div>
