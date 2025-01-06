<script>
	import { Label } from '$lib/components/ui/label/';
	import { Button } from '$lib/components/ui/button/';
	import { Input } from '$lib/components/ui/input/';

	let { form } = $props();
</script>

<form method="POST" action="?/uploadDB" enctype="multipart/form-data" class="grid gap-4">
	<Label for="file">Upload Periodically Database</Label>
	<Input type="file" name="db_file" accept=".db" id="file" required />
	<Button type="submit">Upload</Button>
</form>

{#if form?.error}
	<p class="error">
		{form.error}
		{form.message}
	</p>
{/if}
