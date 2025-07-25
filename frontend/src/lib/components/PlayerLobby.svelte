<script lang="ts">
    import type { QuizPlayerLight } from "$shared/schema";

    interface Props {
        players: QuizPlayerLight[];
        kickPlayer: (id: string) => void;
    }

    const { players, kickPlayer }: Props = $props();
</script>

<div class="p-4 flex justify-center flex-wrap">
    {#each players as player}
        {#each { length: 1 }, a}
            <button
                class=" hover:line-through nb-button bg-red-300 text-2xl m-1"
                onclick={() => {
                    kickPlayer(player.id);
                }}
            >
                {player.name}
            </button>
        {/each}
    {/each}
</div>
