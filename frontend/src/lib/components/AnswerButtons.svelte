<script lang="ts">
    import { Circle, Diamond, Square, Triangle } from "lucide-svelte";

    interface Props {
        possibleAnswerCount: 2 | 3 | 4;
        onClick: (i: number) => void;
    }

    const { possibleAnswerCount, onClick }: Props = $props();
</script>

<div
    class={`grid ${possibleAnswerCount > 2 ? "grid-cols-2 grid-rows-2" : "grid-rows-1 grid-cols-2"}`}
>
    <button onclick={() => {onClick(0)}} class=" bg-red-500">
        <Triangle fill="white" class=" h-12 w-12" />
    </button>
    
    <button onclick={() => {onClick(1)}} class=" bg-blue-500">
        <Diamond fill="white" class=" h-12 w-12" />
    </button>
    {#if possibleAnswerCount > 2}
        <button onclick={() => {onClick(2)}} class=" bg-yellow-500">
            <Circle fill="white" class=" h-12 w-12" />
        </button>
    {/if}
    {#if possibleAnswerCount > 3}
        <button onclick={() => {onClick(3)}} class=" bg-green-500">
            <Square fill="white" class=" h-12 w-12" />
        </button>
    {/if}
</div>

<style>
    @reference "$lib/../app.css";

    button {
        @apply px-25 py-10 text-white flex justify-center;
    }
</style>
