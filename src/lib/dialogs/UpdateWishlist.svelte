<script>
    import TextInput from "$lib/TextInput.svelte";
    import CircularProgress from '$lib/CircularProgress.svelte';
    import { enhance } from '$app/forms';

    let { listDescription, listId, listName } = $props();

    let loading = $state(false);


</script>

<h2 class="flex items-center gap-2 text-xl font-semibold leading-tight tracking-wide text-gray-900 dark:text-gray-100">
    📋 Update Wishlist
</h2>

<form method="POST" action="/wishlists?/updateList" use:enhance={() => {
    loading = true;
    return async ({ update }) => {
        await update();
        loading = false;
        updateWishlistDialog.close();
    }
}}>
    <TextInput title="Wishlist" id="wishlist" placeholder="" value={listName}></TextInput>
    <TextInput title="Description" id="description" value={listDescription}></TextInput>
    <input type="hidden" id="listId" name="listId" value={listId}>
    <div class="flex flex-col justify-end gap-3 mt-6 sm:flex-row">
        {#if loading}
            <CircularProgress/>
        {:else}
            <button class="px-6 py-2 rounded-sm shadow-sm dark:bg-indigo-600 dark:text-gray-50">Update</button>
        {/if}
    </div>
</form>