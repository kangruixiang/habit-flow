<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import AppSidebar from '$lib/parts/Sidebar.svelte';
	import { Separator } from '$lib/components/ui/separator/';
	let { children } = $props();
	// const items = [
	// 	{
	// 		title: 'Home',
	// 		url: '/',
	// 		icon: House
	// 	},
	// 	{
	// 		title: 'Upload',
	// 		url: '/upload',
	// 		icon: Upload
	// 	}
	// ];
</script>

<ModeWatcher />
<Sidebar.Provider>
	<AppSidebar />

	<main class="w-full">
		<div class="bg-background/50">
			<Sidebar.Trigger />
			<Separator orientation="vertical" />
			<!-- <Breadcrumb.Root>
				<Breadcrumb.List>
					<Breadcrumb.Item>
						<Breadcrumb.Link href="/">Home</Breadcrumb.Link>
					</Breadcrumb.Item>
				</Breadcrumb.List>
			</Breadcrumb.Root> -->
		</div>
		<div class="mx-auto mb-20 mt-10 max-w-3xl px-4">
			{@render children()}
		</div>
	</main>
	<img src="frog.png" alt="" class="fixed bottom-0 right-0 -z-10 w-1/2 sm:w-1/4" />
</Sidebar.Provider>
