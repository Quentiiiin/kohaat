<script lang="ts">
    import { PUBLIC_FRONTEND_ADDRESS } from "$env/static/public";

    const { gameId }: { gameId: string } = $props();
    import { qr } from "@svelte-put/qr/svg";

    const url = `http://${PUBLIC_FRONTEND_ADDRESS}/${gameId}`;
</script>

<svg
    use:qr={{
        data: url,
        logo: "/favicon.svg",
        shape: "circle",
    }}
/>
