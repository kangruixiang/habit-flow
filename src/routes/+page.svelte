<script lang="ts">
	import dayjs from 'dayjs';
	import { enhance } from '$app/forms';

	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/';
	import { Input } from '@/components/ui/input';
	import * as Dialog from '$lib/components/ui/dialog';

	import { Plus, BadgeAlert, BadgeCheck } from 'lucide-svelte';
	import type { Props } from '$lib/types';
	import { fade } from 'svelte/transition';
	import Filterbar from '@/parts/Filterbar.svelte';

	let { data }: Props = $props();
	let events = $state(data.events);
	let searchTerm = $state('');
	let selectValue = $state<'Name' | 'Last Updated' | 'Due Date' | ''>('');

	let newEventDialogisOpen = $state(false);

	function newEvent() {
		console.log('inside filter', data.events);
		events = data.events;
		newEventDialogisOpen = false;
	}

	$effect(() => {
		if (selectValue == 'Name') {
			events.sort((a, b) => a.eventName.localeCompare(b.eventName));
		} else if (selectValue == 'Last Updated') {
			events.sort((a, b) => dayjs(b.eventLastDate).diff(dayjs(a.eventLastDate)));
		} else if (selectValue == 'Due Date') {
			events.sort((a, b) => dayjs(a.eventPredictionDate).diff(dayjs(b.eventPredictionDate)));
		}
	});

	$effect(() => {
		events = data.events.filter((event) => {
			return event.eventName.toLowerCase().includes(searchTerm.toLowerCase());
		});
	});
</script>

<div class="my-8">
	<Filterbar bind:selectValue bind:searchTerm />
</div>

<div in:fade={{ duration: 200 }} class="grid-cols grid gap-2 sm:gap-4 md:grid-cols-2">
	{#each events as event}
		<Card.Root class="transition-all hover:bg-accent">
			<a href="/history?event_id={event.id}">
				<Card.Header>
					<Card.Title>
						{event.eventName}
					</Card.Title>
				</Card.Header>
				<Card.Content class="flex justify-between">
					<div>{event.eventLastRelativeDate}</div>
					{#if event.eventPredictionDate == ''}
						<br />
					{:else if dayjs(event.eventPredictionDate).isBefore(dayjs())}
						<BadgeAlert color={'orange'} />
					{:else}
						<BadgeCheck color={'green'} />
					{/if}
				</Card.Content>
			</a>
		</Card.Root>
	{/each}
	<Card.Root class="flex justify-center backdrop-blur-md transition-all hover:bg-accent/80">
		<Dialog.Root bind:open={newEventDialogisOpen}>
			<Dialog.Trigger class="w-full">
				<Card.Content class="flex grow cursor-pointer items-center justify-center">
					<Plus size={64} />
				</Card.Content>
			</Dialog.Trigger>
			<Dialog.Content>
				<Dialog.Header>
					<Dialog.Title>Enter Event Name</Dialog.Title>
					<Dialog.Description></Dialog.Description>
				</Dialog.Header>
				<form method="POST" action="?/newEvent" class="mt-4 flex gap-x-4" use:enhance>
					<Input name="event_name" required></Input>

					<Button type="submit" onclick={newEvent}>Save Changes</Button>
				</form>
			</Dialog.Content>
		</Dialog.Root>
	</Card.Root>
</div>
