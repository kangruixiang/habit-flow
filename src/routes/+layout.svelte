<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import AppSidebar from '$lib/parts/Sidebar.svelte';
	import { Separator } from '$lib/components/ui/separator/';
	import { Button } from '$lib/components/ui/button/';
	import { Home } from 'lucide-svelte';

	let { children } = $props();
</script>

<ModeWatcher />
<Sidebar.Provider open={false}>
	<AppSidebar />

	<main class="relative w-full">
		<div class="sticky top-0 z-10 flex h-14 items-center border-b bg-background">
			<Sidebar.Trigger size="lg" class="h-14" />

			<Separator orientation="vertical" />
			<a href="/">
				<Button class="h-14 w-14" variant="ghost" size="icon">
					<Home />
				</Button></a
			>
			<Separator orientation="vertical" />
		</div>
		<div class="mx-auto mb-20 mt-10 max-w-3xl px-4">
			{@render children()}
		</div>
	</main>
	<img src="frog.png" alt="" class="fixed bottom-0 right-0 -z-10 w-1/2 sm:w-1/4" />
</Sidebar.Provider>
