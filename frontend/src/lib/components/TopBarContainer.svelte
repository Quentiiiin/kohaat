<script lang="ts">
    const { children } = $props();
</script>

<div
    class="select-none m-2 flex items-center bg-amber-300 nb-border text-2xl p-1"
>
    <h1 class=" font-black text-4xl">
        kohaat
    </h1>
    {@render children()}
</div>
