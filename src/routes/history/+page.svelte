<script lang="ts">
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';

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

	function getAverageOccurence(historyDates: History[]) {
		const differences: number[] = [];
		for (let i = 1; i < historyDates.length; i++) {
			const day1 = dayjs(historyDates[i].historyDate);
			const day2 = dayjs(historyDates[i - 1].historyDate);
			const diff = Math.abs(day1.diff(day2, 'days'));
			differences.push(diff);
		}

		const totalDiff = differences.reduce((sum, diff) => sum + diff, 0);
		const averageDiff = Math.round(totalDiff / differences.length);
		return averageDiff;
	}

	const lastOccurence = $derived(dayjs().to(histories[0].historyDate));
	const averageOccurence = $derived(getAverageOccurence(histories));
	const nextOccurence = $derived(dayjs(histories[0].historyDate).add(averageOccurence, 'day'));
	const timeToNext = $derived(nextOccurence.fromNow());
</script>

<Card.Root>
	<Card.Header class="mb-8">
		<Card.Title>{events[0].eventName}</Card.Title>
	</Card.Header>
	<Separator />
	<Card.Content>
		<ul>
			<li>
				Next prediction: {timeToNext}
			</li>
			<li>
				Last occurence: {lastOccurence}.
			</li>

			<li>
				Average occurences: every {averageOccurence} days.
			</li>
		</ul>
	</Card.Content>
	<Separator />
	<Card.Content>
		<ScrollArea class="h-96">
			<div class="relative flex flex-col gap-y-2">
				<h2 class="sticky top-0 mb-2 bg-card pb-2">Most recent 10 occurences:</h2>
				{#each histories as history}
					<div class="flex justify-between">
						<div>
							<p>{dayjs(history.historyDate).format('MM-DD-YYYY')}</p>
						</div>
						<form method="POST" action="?/deleteHistory" use:enhance>
							<input type="hidden" name="history_id" value={history.id} />
							<PopOver.Root>
								<PopOver.Trigger>
									<Button variant="ghost">Delete</Button>
								</PopOver.Trigger>
								<PopOver.Content class="flex w-52 items-center justify-between"
									>Are you sure?<Button variant="destructive" type="submit">Delete</Button
									></PopOver.Content
								>
							</PopOver.Root>
						</form>
					</div>
				{/each}
			</div>
		</ScrollArea>
	</Card.Content>
</Card.Root>
