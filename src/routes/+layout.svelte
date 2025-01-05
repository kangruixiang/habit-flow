<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';
	let { children } = $props();
</script>

<ModeWatcher />
<div class="mx-auto my-20 max-w-3xl px-4">{@render children()}</div>
