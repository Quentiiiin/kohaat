<script>
    import { localGameState } from "$lib/game-state.svelte";
</script>

<div>
    {#if localGameState.connected}
        <div>
            rtt: {localGameState.latency}
        </div>
    {:else}
        connection lost
    {/if}
</div>
