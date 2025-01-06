<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import AppSidebar from '$lib/parts/Sidebar.svelte';
	let { children } = $props();
</script>

<ModeWatcher />
<Sidebar.Provider>
	<AppSidebar />
	<main class="w-full">
		<Sidebar.Trigger />
		<div class="mx-auto mb-20 mt-10 max-w-3xl px-4">
			{@render children()}
		</div>
	</main>
	<img src="frog.png" alt="" class="fixed bottom-0 right-0 -z-10 w-1/2 sm:w-1/4" />
</Sidebar.Provider>
