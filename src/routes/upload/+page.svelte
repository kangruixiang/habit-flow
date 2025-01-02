<script>
	let { form } = $props();
</script>

<form method="POST" action="?/uploadDB" enctype="multipart/form-data">
	<label for="file">Upload your file</label>
	<input type="text" name="name" />
	<input type="file" name="db_file" accept=".db" id="file" required />
	<button type="submit">Upload</button>
</form>

{#if form?.error}<p class="error">
		{form.error}
		{form.message}
	</p>{/if}
