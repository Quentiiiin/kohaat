<script lang="ts">
    import { Circle, Diamond, Square, Triangle } from "lucide-svelte";

    interface Props {
        answers: string[];
        showAnswers: boolean;
        onClick: (i: number) => void;
    }

    const { answers, showAnswers, onClick }: Props = $props();
</script>

<div
    class={`grid space-x-1 ${answers.length > 2 ? "grid-cols-2 grid-rows-2" : "grid-rows-1 grid-cols-2"}`}
>
    {#each answers as answer, index}
        {@render AnswerButton(answer, index)}
    {/each}
</div>

{#snippet AnswerButton(answer: string, index: number)}
    <div class=" bg-red-500 m-2 text-2xl">
        <button
            onclick={() => {
                onClick(index);
            }}
            class=" nb-border w-full"
            class:bg-red-300={index === 0}
            class:bg-blue-300={index === 1}
            class:bg-yellow-300={index === 2}
            class:bg-green-300={index === 3}
        >
            <div class=" flex items-center justify-start w-full h-24">
                {#if index === 0}
                    <Triangle fill="white" class=" h-12 w-12" />
                {:else if index === 1}
                    <Diamond fill="white" class=" h-12 w-12" />
                {:else if index === 2}
                    <Circle fill="white" class=" h-12 w-12" />
                {:else if index === 3}
                    <Square fill="white" class=" h-12 w-12" />
                {/if}
                {#if showAnswers}
                    {answer}
                {/if}
            </div>
        </button>
    </div>
{/snippet}

<style>
    @reference "$lib/../app.css";

    button {
        @apply px-25 py-10 text-white flex justify-center;
    }
</style>
