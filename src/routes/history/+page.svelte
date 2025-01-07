<script lang="ts">
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import { RotateCw, CircleAlert, CircleCheckBig } from 'lucide-svelte';

	import { enhance } from '$app/forms';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/';
	import Separator from '@/components/ui/separator/separator.svelte';
	import { ScrollArea } from '$lib/components/ui/scroll-area/';
	import * as PopOver from '$lib/components/ui/popover';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/';

	import type { Props } from '$lib/types';
	import { goto } from '$app/navigation';
	import { fade, fly } from 'svelte/transition';

	let { data, form }: Props = $props();

	let histories = $derived(data.histories);
	let event = $derived(data.events[0]);

	dayjs.extend(relativeTime);

	let deleteBoxOpen = $state(false);
</script>

<div in:fly={{ y: 30, duration: 300 }} class="flex w-full flex-col gap-4">
	<Card.Root>
		<Card.Header class="mb-12 mt-4 text-center">
			<Card.Title>{event.eventName}</Card.Title>
		</Card.Header>
	</Card.Root>

	<form method="POST" class="w-full" action="?/newHistory" use:enhance>
		<button
			type="submit"
			disabled={dayjs(event.eventLastDate).isSame(dayjs(), 'day')}
			class="flex w-full justify-center rounded-lg border p-8 transition-colors hover:bg-accent active:scale-[98%] disabled:hover:bg-background disabled:active:scale-[100%]"
		>
			<input type="hidden" name="event_id" bind:value={event.id} />
			{#if dayjs(event.eventLastDate).isSame(dayjs(), 'day')}
				<CircleCheckBig size={50} color={'green'} />
			{:else if event.eventPredictionDate == ''}
				<RotateCw size={50} class="transition-transform  group-hover:rotate-180" />
			{:else if dayjs(event.eventPredictionDate).isBefore(dayjs())}
				<CircleAlert size={50} color={'orange'} />
			{:else}
				<RotateCw size={50} class="transition-transform  group-hover:rotate-180" />
			{/if}
		</button>
	</form>

	<Card.Root>
		<Card.Content>
			<div class="order-last grid w-full grid-cols-2 justify-between sm:order-first">
				<div>Next prediction</div>

				<div class="text-right">{event.eventPredictionRelativeDate}</div>

				<div>Last occurence</div>
				<div class="text-right">{event.eventLastRelativeDate}</div>
				<div>Average last 10</div>
				<div class="text-right">
					every {event.eventAverageOccurence} days
				</div>
			</div>
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Content>
			<h2 class="mb-2 pb-2">Most recent 10 occurences:</h2>
			<ScrollArea class="h-56 rounded-lg bg-accent/30 p-4">
				<div class="relative flex flex-col gap-y-2">
					{#each histories as history (history.id)}
						<div in:fly={{ y: -20, duration: 200 }} class="flex items-center justify-between">
							<div>
								<p>{dayjs(history.historyDate).format('MM-DD-YYYY')}</p>
							</div>

							<PopOver.Root>
								<PopOver.Trigger>
									<Button variant="outline">Delete</Button>
								</PopOver.Trigger>

								<PopOver.Content class="w-56">
									<form
										method="POST"
										action="?/deleteHistory"
										class="flex items-center justify-between"
										use:enhance
									>
										<input type="hidden" name="history_id" bind:value={history.id} />
										<input type="hidden" name="event_id" bind:value={event.id} />
										Are you sure?

										<Button
											variant="destructive"
											type="submit"
											onclick={() => (deleteBoxOpen = false)}>Delete</Button
										>
									</form>
								</PopOver.Content>
							</PopOver.Root>
						</div>
					{/each}
				</div>
			</ScrollArea>
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<AlertDialog.Root>
			<AlertDialog.Trigger class="w-full">
				<Button class="w-full">Delete Event</Button>
			</AlertDialog.Trigger>
			<AlertDialog.Content>
				<AlertDialog.Header>
					<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
					<AlertDialog.Description>
						This action cannot be undone. This will permanently delete this events and all of its
						histories.
					</AlertDialog.Description>
				</AlertDialog.Header>
				<AlertDialog.Footer>
					<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
					<form method="POST" action="?/deleteEvent" use:enhance>
						<AlertDialog.Action
							class="w-full bg-destructive text-destructive-foreground hover:bg-destructive/80"
							type="submit"
							onclick={() => goto('/')}
						>
							<input type="hidden" name="event_id" bind:value={event.id} />
							Delete
						</AlertDialog.Action>
					</form>
				</AlertDialog.Footer>
			</AlertDialog.Content>
		</AlertDialog.Root>
	</Card.Root>
</div>
