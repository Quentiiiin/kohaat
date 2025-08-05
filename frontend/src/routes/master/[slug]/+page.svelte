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
    import TopBarContainer from "$lib/components/TopBarContainer.svelte";
    import { PUBLIC_FRONTEND_ADDRESS } from "$env/static/public";
    import Scoreboard from "$lib/components/Scoreboard.svelte";
    import GameQr from "$lib/components/GameQr.svelte";

    const showButtons = $derived(
        localGameState.state &&
            !(localGameState.state.questionEndTime < new Date().getTime()) &&
            !localGameState.state.showScoreboard,
    );

    onMount(async () => {
        await tick();
        if (data.error || !data.gameId) return;
        initGame(true, data.gameId);
    });
</script>

{#snippet greenButton(text: string, onClick: () => void)}
    <button class=" bg-green-400 nb-button ml-2" onclick={onClick}>
        {text}
    </button>
{/snippet}

{#if localGameState.state}
    <TopBarContainer>
        <div class=" flex w-full justify-end mr-1 items-center">
            {#if showButtons}
                <Timer endTime={localGameState.state.questionEndTime} />
            {/if}
            {#if localGameState.state.phase === "WAITING"}
                {@render greenButton("Start", () => {
                    sendMessage({ kind: "START_GAME" });
                })}
            {/if}
            {#if localGameState.state.phase === "PLAY"}
                {@render greenButton("Next", () => {
                    sendMessage({ kind: "NEXT_QUESTION" });
                })}
            {/if}
        </div>
    </TopBarContainer>

    {#if showButtons}
        <div class=" text-4xl mx-4">
            {localGameState.state?.questions[
                localGameState.state.currentQuestionIndex
            ].question}
        </div>
        <AnswerButtons
            showAnswers={true}
            answers={localGameState.state.questions[
                localGameState.state.currentQuestionIndex
            ].answers}
            onClick={() => {}}
        />
    {/if}
    {#if localGameState.state.showScoreboard}
        <Scoreboard players={localGameState.state.players} />
    {/if}

    {#if localGameState.state?.phase === "WAITING"}
        <div class="flex justify-center flex-col items-center">
            <div
                class=" bg-green-300 nb-border text-2xl flex flex-col items-center w-96 m-2 p-2"
            >
                <h2 class=" text-3xl">WAITING FOR PLAYERS</h2>
                <h3>{PUBLIC_FRONTEND_ADDRESS}</h3>
                <div>
                    Gamecode: <span class=" font-black text-3xl"
                        >{localGameState.state.id}</span
                    >
                </div>
                <GameQr gameId={localGameState.state.id} />
            </div>
            <PlayerLobby
                players={localGameState.state.players}
                kickPlayer={(id) =>
                    sendMessage({ kind: "KICK_PLAYER", payload: id })}
            />
        </div>
    {/if}
{/if}
