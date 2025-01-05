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

	import type { BaseProp, History } from '$lib/types';

	let { data }: BaseProp = $props();

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

<!-- {#if histories.length > 0} -->
<Card.Root>
	<Card.Header class="mb-8">
		<Card.Title>{events[0].eventName}</Card.Title>
	</Card.Header>
	<Separator />
	<Card.Content class="flex items-center justify-between">
		<div>
			<ul>
				<li>
					Next prediction: {getNextOccurence() ? getNextOccurence() : '-'}.
				</li>
				<li>
					Last occurence: {getLastOccurence() ? getLastOccurence() : '-'}.
				</li>

				<li>
					Average last 10 occurences: every {getAverageOccurence() ? getAverageOccurence() : '-'} days.
				</li>
			</ul>
		</div>
		<form method="POST" action="?/newHistory" use:enhance>
			<button
				type="submit"
				class="group cursor-pointer rounded-lg border p-8 transition-colors hover:bg-accent"
			>
				<input type="hidden" name="event_id" bind:value={events[0].id} />
				<RotateCw size={50} class="transition-transform group-hover:rotate-180" />
			</button>
		</form>
	</Card.Content>
	<Separator />
	<Card.Content>
		<ScrollArea class="h-96">
			<div class="relative flex flex-col gap-y-2">
				<h2 class="sticky top-0 mb-2 bg-card pb-2">Most recent 10 occurences:</h2>
				{#each histories as history (history.id)}
					<div class="flex justify-between">
						<div>
							<p>{dayjs(history.historyDate).format('MM-DD-YYYY')}</p>
						</div>

						<PopOver.Root>
							<PopOver.Trigger>
								<Button variant="ghost">Delete</Button>
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
	<Card.Footer class="flex justify-end">
		<Button variant="destructive">Delete Event</Button>
	</Card.Footer>
</Card.Root>
<!-- {:else}
	<Card.Root>
		<Card.Footer class="flex justify-end">
			<Button variant="destructive">Delete Event</Button>
		</Card.Footer>
	</Card.Root>
{/if} -->
