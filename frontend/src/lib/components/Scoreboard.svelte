<script lang="ts">
    import type { QuizPlayerLight } from "$shared/schema";

    interface Props {
        players: QuizPlayerLight[];
    }
    const { players }: Props = $props();

</script>

<ol>
    {#each Array.from(players).sort((a, b) => b.score - a.score) as player}
        <li>
            <span>
                {player.name}
            </span>
            <span>
                {player.score}
            </span>
        </li>
    {/each}
</ol>