<script lang="ts">
    import type { PageData } from "./$types";
    import AnswerButtons from "$lib/components/AnswerButtons.svelte";
    import Timer from "$lib/components/Timer.svelte";
    import { localGameState } from "$lib/game-state.svelte";
    import "$lib/socket";
    import { initGame, submitAnswer } from "$lib/socket";
    import { onMount } from "svelte";
    import TopBarContainer from "$lib/components/TopBarContainer.svelte";
    import NetworkIndicator from "$lib/components/NetworkIndicator.svelte";
    import BottomBar from "$lib/components/BottomBar.svelte";

    const { data }: { data: PageData } = $props();

    let username: string | null = $state(null);
    let hasSubmittedName: boolean = $state(false);

    const showButtons = $derived.by(() => {
        if (!localGameState.state) return false;
        if (localGameState.state.phase !== "PLAY") return false;
        if (localGameState.state.questionEndTime < new Date().getTime())
            return false;
        const player = localGameState.state.players.find(
            (p) => p.id === localGameState.userId,
        );
        if (!player || player.submittedAnswer) return false;
        return true;
    });

    onMount(() => {
        if (data.gameId && data.userFound) {
            initGame(false, data.gameId);
        }
    });
</script>

<TopBarContainer>
    <NetworkIndicator />
</TopBarContainer>

{#if !data.userFound && !hasSubmittedName && data.phase === "WAITING"}
    <div class=" flex items-center justify-center flex-col">
        <h2 class=" text-4xl py-10">
            JOIN game
            <span class=" font-black">
                {data.gameId}
            </span>
        </h2>
        <form
            class=" bg-red-300 nb-border flex w-fit text-2xl m-1 p-2"
            onsubmit={(event) => {
                event.preventDefault();
                if (username) {
                    initGame(false, data.gameId, username);
                    username = "";
                    hasSubmittedName = true;
                }
            }}
        >
            <input
                maxlength="16"
                class=" focus:outline-0 mx-1"
                bind:value={username}
                type="text"
                placeholder="your nickname"
            />
            <button class=" nb-button bg-green-300 mx-1">JOIN</button>
        </form>
    </div>
{/if}

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

{#if localGameState.state}
    {#if localGameState.state.phase === "WAITING"}
        <div class=" text-3xl flex justify-center">
            See your name on the screen?
        </div>
    {/if}
{/if}

<BottomBar>
    {localGameState.state?.players.find((p) => p.id === localGameState.userId)
        ?.name}
    <div class=" bg-amber-50 px-1 nb-border m-1">
        {localGameState.state?.players.find(
            (p) => p.id === localGameState.userId,
        )?.score}
    </div>
</BottomBar>
