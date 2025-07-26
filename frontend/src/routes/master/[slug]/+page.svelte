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

{#if localGameState.state}
    <TopBarContainer>
        {localGameState.state?.phase}
        {#if localGameState.state?.questionEndTime}
            <Timer endTime={localGameState.state.questionEndTime} />
        {/if}
        <div class=" flex w-full justify-end mr-1">
            {#if localGameState.state.phase === "WAITING"}
                <button
                    class=" bg-green-400 nb-button"
                    onclick={() => {
                        sendMessage({ kind: "START_GAME" });
                    }}
                >
                    START
                </button>
            {/if}
        </div>
    </TopBarContainer>

    {#if showButtons}
        <div>
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
            </div>
            <PlayerLobby
                players={localGameState.state.players}
                kickPlayer={(id) =>
                    sendMessage({ kind: "KICK_PLAYER", payload: id })}
            />
        </div>
    {/if}
{/if}
