<script lang="ts">
	type User = {
		name: string;
		age: number;
	};
	type Prop = {
		data: {
			users: User[];
		};
	};
	let data: Prop = $props();
	let user = data.data.users[0];

	console.log(data.data.users[0].name);
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

Hi my name is {user.name}. I'm {user.age} years old.
