<script lang="ts">
    import type { PageData } from "./$types";

    const { data }: { data: PageData } = $props();

    import AnswerButtons from "$lib/components/AnswerButtons.svelte";
    import Timer from "$lib/components/Timer.svelte";
    import { localGameState } from "$lib/game-state.svelte";
    import "$lib/socket";
    import { initGame, sendMessage } from "$lib/socket";
    import { onMount, tick } from "svelte";
    import PlayerLobby from "$lib/components/PlayerLobby.svelte";

    const showButtons = $derived.by(() => {
        if (!localGameState.state) return false;
        if (localGameState.state.phase !== "PLAY") return false;
        if (localGameState.state.questionEndTime < new Date().getTime())
            return false;
        return true;
    });

    onMount(async () => {
        await tick();
        if (data.error || !data.gameId) return;
        initGame(true, data.gameId);
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
        onClick={() => {}}
    />
{/if}

{#if localGameState.state?.phase === "WAITING"}
    <PlayerLobby
        players={localGameState.state.players}
        kickPlayer={(id) => sendMessage({ kind: "KICK_PLAYER", payload: id })}
    />
{/if}

<button
    class=" bg-green-400"
    onclick={() => {
        sendMessage({ kind: "START_GAME" });
    }}
>
    START
</button>
