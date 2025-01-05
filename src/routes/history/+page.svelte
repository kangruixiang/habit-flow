<script lang="ts">
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import { RotateCw } from 'lucide-svelte';

	import { enhance } from '$app/forms';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/';
	import Separator from '@/components/ui/separator/separator.svelte';
	import { ScrollArea } from '$lib/components/ui/scroll-area/';
	import * as PopOver from '$lib/components/ui/popover';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/';

	import type { BaseProp, History } from '$lib/types';
	import { goto } from '$app/navigation';
	import { fly } from 'svelte/transition';

	let { data, form }: BaseProp = $props();

	let histories = $derived(data.histories);
	let events = $derived(data.events);

	dayjs.extend(relativeTime);

	let lastOccurence: string;
	let averageOccurence: number;
	let nextOccurence: string;
	let deleteBoxOpen = $state(false);

	function getLastOccurence() {
		if (histories.length == 0) {
			return;
		}
		if (histories[0].historyDate == dayjs(new Date()).format('YYYY-MM-DD')) {
			lastOccurence = 'today.';
			return lastOccurence;
		}
		lastOccurence = dayjs().to(histories[0].historyDate);
		return lastOccurence;
	}

	function getAverageOccurence() {
		if (histories.length == 0) {
			return;
		}
		const differences: number[] = [];
		for (let i = 1; i < histories.length; i++) {
			const day1 = dayjs(histories[i].historyDate);
			const day2 = dayjs(histories[i - 1].historyDate);
			const diff = Math.abs(day1.diff(day2, 'days'));
			differences.push(diff);
		}

		const totalDiff = differences.reduce((sum, diff) => sum + diff, 0);
		const averageDiff = Math.round(totalDiff / differences.length);
		averageOccurence = averageDiff;
		return averageOccurence;
	}

	function getNextOccurence() {
		if (histories.length == 0) {
			return;
		}
		const nextDate = dayjs(histories[0].historyDate).add(averageOccurence, 'day');
		nextOccurence = nextDate.fromNow();
		return nextOccurence;
	}
</script>

<div class="flex w-full flex-col gap-4">
	<Card.Root>
		<Card.Header class="mb-12 mt-4 text-center">
			<Card.Title>{events[0].eventName}</Card.Title>
		</Card.Header>
	</Card.Root>

	<Card.Root>
		{#if form?.duplicate}
			<Card.Content>
				<p class="text-center text-red-700">You've already done this today.</p>
			</Card.Content>
		{/if}
		<form method="POST" class="w-full" action="?/newHistory" use:enhance>
			<button
				type="submit"
				class="group flex w-full cursor-pointer justify-center rounded-lg border p-8 transition-colors hover:bg-accent"
			>
				<input type="hidden" name="event_id" bind:value={events[0].id} />
				<RotateCw size={50} class="transition-transform group-hover:rotate-180" />
			</button>
		</form>
	</Card.Root>

	<Card.Root>
		<Card.Content>
			<div class="order-last grid w-full grid-cols-2 justify-between sm:order-first">
				<div>Next prediction</div>
				<div class="text-right">{getNextOccurence() ? getNextOccurence() : '-'}</div>
				<div>Last occurence</div>
				<div class="text-right">{getLastOccurence() ? getLastOccurence() : '-'}</div>
				<div>Average last 10</div>
				<div class="text-right">
					every {getAverageOccurence() ? getAverageOccurence() : '-'} days
				</div>
			</div>
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Content>
			<h2 class="mb-2 pb-2">Most recent 10 occurences:</h2>
			<ScrollArea class="h-56">
				<div class="relative flex flex-col gap-y-2 px-2">
					{#each histories as history (history.id)}
						<div in:fly={{ y: -20, duration: 200 }} class="flex justify-between">
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
										Are you sure?<Button
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
				<Button class="w-full" variant="destructive">Delete Event</Button>
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
						<AlertDialog.Action type="submit" onclick={() => goto('/')}>
							<input type="hidden" name="event_id" bind:value={events[0].id} />
							Delete
						</AlertDialog.Action>
					</form>
				</AlertDialog.Footer>
			</AlertDialog.Content>
		</AlertDialog.Root>
	</Card.Root>
</div>
