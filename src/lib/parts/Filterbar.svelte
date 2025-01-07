<script lang="ts">
	import * as Select from '$lib/components/ui/select/';
	import { Input } from '$lib/components/ui/input/';
	import { Search } from 'lucide-svelte';

	let selectValue = $state('');
</script>

<div class="flex gap-x-4">
	<div class="relative grow">
		<Search class="absolute left-2 top-[50%] h-5 translate-y-[-50%] text-muted-foreground" />
		<Input placeholder="Search" class="pl-10"></Input>
	</div>

	<div class="flex items-center gap-x-2 text-nowrap">
		<Select.Root type="single" bind:value={selectValue}>
			<Select.Trigger class="w-40">{selectValue ? selectValue : 'Sort by'}</Select.Trigger>
			<Select.Content>
				<Select.Item value="Name">Name</Select.Item>
				<Select.Item value="Last Updated">Last Updated</Select.Item>
				<Select.Item value="Due Date">Due Date</Select.Item>
			</Select.Content>
		</Select.Root>
	</div>
</div>
