<script>
	export let sm = false;
	export let md = false;
	export let bottom = false;
	export let checkbox = false;
	export let name;
</script>

<input
	type={checkbox ? 'checkbox' : 'text'}
	{name}
    required
	class="custom-input"
	class:bottom
	class:sm
	class:md
/>

<style>
	.custom-input {
		width: 300px;
		padding: 5px;
		background-color: white;
		border: 1px solid black;
		color: black;
		text-align: center;
	}

	.sm {
		width: 150px;
	}

	.md {
		width: 200px;
	}

	.bottom {
		border-top: none;
		border-left: none;
		border-right: none;
		border-bottom: 1px solid black;
	}
</style>
