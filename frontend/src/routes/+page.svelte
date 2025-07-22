<script lang="ts">
    import AnswerButtons from "$lib/components/AnswerButtons.svelte";
    import Timer from "$lib/components/Timer.svelte";
    import { localGameState } from "$lib/game-state.svelte";
    import "$lib/socket";
    import { submitAnswer } from "$lib/socket";
</script>

<div>
    connected: {localGameState.connected}
</div>
{#if localGameState.state?.questionEndTime}
    <Timer endTime={localGameState.state.questionEndTime} />
{/if}
{JSON.stringify(localGameState.state)}

<AnswerButtons
    possibleAnswerCount={4}
    onClick={(i) => {
        submitAnswer(i);
    }}
/>
