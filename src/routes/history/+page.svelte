<script lang="ts">
	import { enhance } from '$app/forms';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/';

	import type { BaseProp } from '$lib/types';
	import Separator from '@/components/ui/separator/separator.svelte';

	let { data }: BaseProp = $props();

	let histories = $derived(data.histories);
	let events = $derived(data.events);
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>{events[0].eventName}</Card.Title>
		<Card.Description>Card Description</Card.Description>
		<Separator />
	</Card.Header>

	<Card.Content class="flex flex-col gap-y-2">
		{#each data.histories as history}
			<div class="flex justify-between">
				<div>
					<p>{history.historyDate}</p>
				</div>
				<form method="POST" action="?/deleteHistory" use:enhance>
					<input type="hidden" name="history_id" value={history.id} />
					<Button variant="destructive" type="submit">Delete</Button>
				</form>
			</div>
		{/each}
	</Card.Content>
</Card.Root>
