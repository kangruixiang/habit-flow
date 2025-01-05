<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';
	let { children } = $props();
</script>

<ModeWatcher />
<div class="mx-auto mb-44 mt-10 max-w-3xl px-4 sm:mt-20">{@render children()}</div>
<img src="frog.png" alt="" class="fixed bottom-0 right-0 -z-10" />
