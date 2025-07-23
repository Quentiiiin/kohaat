<script lang="ts">
    import type { QuizPlayerLight } from "$shared/schema";

    interface Props {
        players: QuizPlayerLight[];
        kickPlayer: (id: string) => void;
    }

    const { players, kickPlayer }: Props = $props();
</script>

<div class="">
    {#each players as player}
        <button
            class=" hover:line-through bg-red-200 w-fit px-2 py-1 rounded-md text-xl"
            onclick={() => {
                kickPlayer(player.id);
            }}
        >
            {player.name}
        </button>
    {/each}
</div>
