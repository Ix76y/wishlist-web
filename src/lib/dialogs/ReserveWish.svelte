<script>
    import CircularProgress from '$lib/CircularProgress.svelte';
    import { enhance } from '$app/forms';

    let { wishId, wishName } = $props();

    let loading = $state(false);
</script>


<h2 class="flex items-center gap-2 text-xl font-semibold leading-tight tracking-wide text-gray-900 dark:text-gray-100">
    🎁 Reserve Wish
</h2>

<form method="POST" action="?/reserveWish"  use:enhance={() => {
    loading = true;
    return async ({ update }) => {
        await update();
        loading = false;
        reserveWishDialog.close();
    }
}}>
    <p class="flex-1 text-sm text-slate-700 dark:text-slate-400 font-light">Do you want to reserve the wish <b>{wishName}</b>? This will indicate to everyone else that you will get this wish.</p>
    <input type="hidden" id="reserve" name="reserve" value=true>
    <input type="hidden" id="wishId" name="wishId" value={wishId}>
    <div class="flex flex-col justify-end gap-3 mt-6 sm:flex-row">
        {#if loading}
            <CircularProgress/>
        {:else}
            <button disabled={loading} class="px-6 py-2 rounded-sm shadow-sm dark:bg-indigo-600 dark:text-gray-50 disabled:bg-indigo-300/50">I will get it!</button>
        {/if}
    </div>
</form>