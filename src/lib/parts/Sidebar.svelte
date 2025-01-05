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
	<Sidebar.Header>Memoirs of a Frog</Sidebar.Header>
	<Sidebar.Content>
		<Sidebar.Menu>
			{#each items as item (item.title)}
				<Sidebar.MenuItem>
					<Sidebar.MenuButton>
						{#snippet child({ props })}
							<a href={item.url} {...props}>
								<item.icon></item.icon>
								<span>{item.title}</span></a
							>
						{/snippet}
					</Sidebar.MenuButton>
				</Sidebar.MenuItem>
			{/each}
		</Sidebar.Menu>
	</Sidebar.Content>
	<Sidebar.Footer />
</Sidebar.Root>
