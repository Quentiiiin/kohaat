<script lang="ts">
	import { onMount, type Snippet } from "svelte";
	import "../app.css";
	import { localGameState } from "$lib/game-state.svelte";
	import type { LayoutData } from "./$types";
    import GridBackground from "$lib/components/GridBackground.svelte";

	interface Props {
		children: Snippet<[]>;
		data: LayoutData;
	}

	let { children, data }: Props = $props();

	onMount(() => {
		localGameState.userId = data.userId;
	});
</script>

<GridBackground />
{@render children()}
