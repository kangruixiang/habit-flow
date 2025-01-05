<script lang="ts">
	import { enhance } from '$app/forms';
	import { setContext } from 'svelte';

	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/';
	import { Input } from '@/components/ui/input';
	import * as Dialog from '$lib/components/ui/dialog';

	import { Plus } from 'lucide-svelte';
	import type { BaseProp } from '$lib/types';

	let { data }: BaseProp = $props();
	let events = $derived(data.events);
	let newEventDialogisOpen = $state(false);

	// let history = data.data.history;
</script>

<div class="grid-cols grid gap-4 md:grid-cols-3">
	{#each events as event}
		<Card.Root class="transition-all hover:bg-accent">
			<a href="/history?event_id={event.id}">
				<Card.Header>
					<Card.Title>
						{event.eventName}
					</Card.Title>
				</Card.Header>
				<Card.Content class="flex justify-between">
					<div>{event.eventPredictionDate}</div>
				</Card.Content>
			</a>
		</Card.Root>
	{/each}
	<Card.Root class="backdrop-blur-md transition-all hover:bg-accent/80"
		><Card.Content class="flex cursor-pointer items-center justify-center">
			<Dialog.Root bind:open={newEventDialogisOpen}>
				<Dialog.Trigger><Plus size={64} /></Dialog.Trigger>
				<Dialog.Content>
					<Dialog.Header>
						<Dialog.Title>Enter Event Name</Dialog.Title>
						<Dialog.Description></Dialog.Description>
					</Dialog.Header>
					<form method="POST" action="?/newEvent" class="mt-4 flex gap-x-4" use:enhance>
						<Input name="event_name" required></Input>

						<Button type="submit" onclick={() => (newEventDialogisOpen = false)}
							>Save Changes</Button
						>
					</form>
				</Dialog.Content>
			</Dialog.Root>
		</Card.Content>
	</Card.Root>
</div>
