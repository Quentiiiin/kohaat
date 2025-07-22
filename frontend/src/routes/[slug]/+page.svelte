<script lang="ts">
    import type { PageData } from "./$types";

    const { data }: { data: PageData } = $props();

    import AnswerButtons from "$lib/components/AnswerButtons.svelte";
    import Timer from "$lib/components/Timer.svelte";
    import { localGameState } from "$lib/game-state.svelte";
    import "$lib/socket";
    import { initGame, submitAnswer } from "$lib/socket";
    import { onMount, tick } from "svelte";

    const showButtons = $derived.by(() => {
        if (!localGameState.state) return false;
        if (localGameState.state.phase !== "PLAY") return false;
        if (localGameState.state.questionEndTime < new Date().getTime())
            return false;
        const player = localGameState.state.players.find(
            (p) => p.id === localGameState.userId,
        );
        if (!player || player.submittedAnswer) return false;
        console.log(4);
        return true;
    });

    onMount(async () => {
        await tick();
        initGame();
    });
</script>

<div>
    {JSON.stringify(data)}
    connected: {localGameState.connected}
</div>
{#if localGameState.state?.questionEndTime}
    <Timer endTime={localGameState.state.questionEndTime} />
{/if}
{JSON.stringify(localGameState.state)}

{#if showButtons}
    <AnswerButtons
        possibleAnswerCount={(localGameState.state?.questions[
            localGameState.state.currentQuestionIndex
        ].answers.length as 2 | 3 | 4) ?? 4}
        onClick={(i) => {
            submitAnswer(i);
        }}
    />
{/if}
