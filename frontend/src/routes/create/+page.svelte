<script>
    import { enhance } from "$app/forms";
    import { localGameState } from "$lib/game-state.svelte";
</script>

<form method="POST" use:enhance>
    <input type="hidden" name="userId" id="userId" value={localGameState.userId} />
    <button type="submit"> Create game </button>
</form>
