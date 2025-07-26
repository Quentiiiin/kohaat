<script lang="ts">
    const { children } = $props();
</script>

<div
    class="w-screen bg-red-300 border-t-2 fixed bottom-0 left-0 text-2xl p-1 flex items-center justify-between"
>
    {@render children()}
</div>
