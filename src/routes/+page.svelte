<script lang="ts">
	import { enhance } from '$app/forms';
	import type { BaseProp } from '$lib/types';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/';

	import IcSharpRefresh from 'virtual:icons/ic/sharp-refresh';
	import Label from '@/components/ui/label/label.svelte';

	let { data }: BaseProp = $props();
	let events = $derived(data.events);
	// let history = data.data.history;
</script>

{#each events as event}
	<Card.Root class="transition-all hover:bg-accent/20">
		<a href="/history?event_id={event.id}">
			<Card.Header>
				<Card.Title>
					{event.eventName}
				</Card.Title>
			</Card.Header>
			<Card.Content class="flex justify-between">
				<div>{event.eventLastDate}</div>
				<form method="POST" action="?/newHistory" use:enhance>
					<input type="hidden" name="event_id" value={event.id} />
					<Button
						variant="outline"
						size="lg"
						type="submit"
						onclick={(e) => {
							e.stopPropagation();
						}}
					>
						<IcSharpRefresh style="font-size:2em" />
					</Button>
				</form>
			</Card.Content>
		</a>
	</Card.Root>
{/each}
