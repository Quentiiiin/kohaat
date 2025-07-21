<script lang="ts">
    import { localGameState } from "$lib/game-state.svelte";
    import "$lib/socket"
</script>

{JSON.stringify(localGameState.state)}