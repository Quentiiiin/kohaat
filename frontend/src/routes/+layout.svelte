<script lang="ts">
	import { onMount } from "svelte";
	import "../app.css";
    import { localGameState } from "$lib/game-state.svelte";

	let { children } = $props();

	onMount(() => {
		console.log('mount')
		const userId = localStorage.getItem("user-id") ?? crypto.randomUUID();
		localStorage.setItem("user-id", userId);
		localGameState.userId = userId;
		console.log(userId);
	});
</script>

{@render children()}
