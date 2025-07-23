<script lang="ts">
	import { onMount, type Snippet } from "svelte";
	import "../app.css";
	import { localGameState } from "$lib/game-state.svelte";
	import type { LayoutData } from "./$types";

	interface Props {
		children: Snippet<[]>;
		data: LayoutData;
	}

	let { children, data }: Props = $props();

	onMount(() => {
		localGameState.userId = data.userId;
	});
</script>

{@render children()}
