<script>
    import { goto } from "$app/navigation";
    import { getGameStatus } from "$lib/client-util";
    import { localGameState } from "$lib/game-state.svelte";
    import { X } from "lucide-svelte";

    let gameId = $state("");
    let codeError = $state("");
</script>

{#if localGameState.showKickedMessage}
    <div class=" flex justify-center">
        <div
            style="width:95vw;"
            class=" nb-border bg-red-500 text-2xl z-10 fixed mt-1 p-2 flex justify-between"
        >
            <span> You got kicked from the game </span>
            <button
                onclick={() => (localGameState.showKickedMessage = false)}
                class=" flex items-center justify-center nb-button mx-1 bg-red-400"
            >
                <X />
            </button>
        </div>
    </div>
{/if}

<div class="bg-red-300 nb-border flex w-fit text-2xl m-1 p-2 flex-col">
    <form
        class=""
        onsubmit={async (event) => {
            event.preventDefault();
            if (gameId) {
                const status = await getGameStatus(
                    gameId,
                    localGameState.userId,
                );
                if (status.found && status.phase === "WAITING") {
                    goto("/" + gameId);
                    gameId = "";
                    codeError = "";
                } else if (
                    status.found &&
                    status.phase === "PLAY" &&
                    status.userFound
                ) {
                    goto("/" + gameId);
                    gameId = "";
                    codeError = "";
                }
                if (!status.found) {
                    codeError = "game not found";
                } else if (status.phase !== "WAITING") {
                    codeError = "game already started";
                }
            }
        }}
    >
        <input
            oninput={() => (codeError = "")}
            maxlength="4"
            class=" focus:outline-0 mx-1"
            bind:value={gameId}
            inputmode="numeric"
            type="text"
            placeholder="game ID"
        />
        <button class=" nb-button bg-green-300 mx-1">JOIN</button>
    </form>
    <div class=" text-xl">
        {codeError}
    </div>
</div>

<a href="/create" class=" nb-button text-2xl bg-green-300"> create game </a>
