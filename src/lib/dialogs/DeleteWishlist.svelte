<script>
    import CircularProgress from '$lib/CircularProgress.svelte';
    import { enhance } from '$app/forms';

    let { selectedList = $bindable(), listId, listName } = $props();

    let loading = $state(false);
</script>

<h2 class="flex items-center gap-2 text-xl font-semibold leading-tight tracking-wide text-gray-900 dark:text-gray-100">
    📋 Delete Wishlist
</h2>

<form method="POST" action="/wishlists?/deleteList" use:enhance={() => {
    loading = true;
    return async ({ update }) => {
        await update();
        loading = false;
        selectedList = null;
        deleteWishlistDialog.close();
    }
}}>
    <p class="flex-1 text-sm text-slate-700 dark:text-slate-400 font-light">Are you sure you want to delete the wishlist <b>{listName}</b>? This can't be undone.</p>
    <input type="hidden" id="listId" name="listId" value={listId}>
    <div class="flex flex-col justify-end gap-3 mt-6 sm:flex-row">
        {#if loading}
            <CircularProgress/>
        {:else}
            <button class="px-6 py-2 rounded-sm shadow-sm dark:bg-indigo-600 dark:text-gray-50">Delete</button>
        {/if}
    </div>
</form>