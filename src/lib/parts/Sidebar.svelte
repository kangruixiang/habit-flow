<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar';
	import { House, Upload } from 'lucide-svelte';

	const items = [
		{
			title: 'Home',
			url: '/',
			icon: House
		},
		{
			title: 'Upload',
			url: '/upload',
			icon: Upload
		}
	];
</script>

<Sidebar.Root>
	<Sidebar.Header class="px-4 py-4 text-lg">Memoirs of a Frog</Sidebar.Header>
	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.Menu>
				{#each items as item (item.title)}
					<Sidebar.MenuItem>
						<Sidebar.MenuButton class="flex items-center gap-x-4 px-4 py-6 text-base">
							{#snippet child({ props })}
								<a href={item.url} {...props}>
									<item.icon />
									<span>{item.title}</span></a
								>
							{/snippet}
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
				{/each}
			</Sidebar.Menu>
		</Sidebar.Group>
	</Sidebar.Content>
	<Sidebar.Footer />
</Sidebar.Root>
