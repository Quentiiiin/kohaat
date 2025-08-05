<script lang="ts">
    import type { QuizPlayerLight } from "$shared/schema";

    interface Props {
        players: QuizPlayerLight[];
    }
    const { players }: Props = $props();
</script>

<div class="">
    <ol class=" text-4xl mx-10">
        {#each Array.from(players).sort((a, b) => b.score - a.score) as player, index}
            <li
                class:bg-amber-200={index === 0}
                class:bg-blue-200={index === 1}
                class:bg-red-300={index === 2}
                class:bg-zinc-400={index > 2}
                class=" nb-border m-2"
            >
                <div class=" flex items-center py-2 justify-between px-1">
                    <div>
                        <span class="">
                            {index + 1}.
                        </span>
                        <span>
                            {player.name}
                        </span>
                    </div>
                    <span class=" bg-amber-50 nb-border text-2xl">
                        {player.score}
                    </span>
                </div>
            </li>
        {/each}
    </ol>
</div>
