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

<div class="grid grid-cols-2 gap-4 md:grid-cols-3">
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
				</Card.Content>
			</a>
		</Card.Root>
	{/each}
</div>
