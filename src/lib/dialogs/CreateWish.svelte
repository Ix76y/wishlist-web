<script>
    import TextInput from "$lib/TextInput.svelte";
    import CircularProgress from '$lib/CircularProgress.svelte';
    import { enhance } from '$app/forms';

    let { username, listId, listName } = $props();

    let loading = $state(false);
</script>


<h2 class="flex items-center gap-2 text-xl font-semibold leading-tight tracking-wide text-gray-900 dark:text-gray-100">
    🎁 New Wish
</h2>
<form method="POST" action="/wishlists?/createWish" use:enhance={() => {
    loading = true;
    return async ({ update }) => {
        await update();
        // createWish = false;
        loading = false; 
        createWishDialog.close();
    }
}}>
    <p class="flex-1 text-sm text-slate-700 dark:text-slate-400 font-light">You can create a new wish for yourself or someone else, the wish will be added to the "{listName}" list.</p>
    <TextInput title="Wish" id="wish" disabled={loading}></TextInput>
    <TextInput title="For" id="wishowner" disabled={loading} value={username}></TextInput>
    <fieldset class="w-full space-y-1 text-slate-700 dark:text-slate-400">
        <label for="price" class="block text-sm font-medium">Estimated price</label>
        <div class="flex">
            <input type="text" name="price" id="price" placeholder="25,00" disabled={loading} class="peer flex flex-1 text-right focus:outline-none focus:border-indigo-400 sm:text-sm rounded-l-md focus:ring-0 border-gray-700 bg-zinc-50 dark:bg-zinc-800 ">
            <span class="flex items-center px-3 pointer-events-none sm:text-sm rounded-r-md border border-gray-700 peer-focus:bg-indigo-400 peer-focus:dark:bg-indigo-600">€</span>
        </div>
    </fieldset>
    <TextInput title="Description" id="wishdescription" disabled={loading}></TextInput>
    <input type="hidden" id="listId" name="listId" value={listId}>
    <div class="flex flex-col justify-end gap-3 mt-6 sm:flex-row">
        {#if loading}
            <CircularProgress/>
        {:else}
            <button disabled={loading} class="px-6 py-2 rounded-sm shadow-sm dark:bg-indigo-600 dark:text-gray-50 disabled:bg-indigo-300/50">Create</button>
        {/if}
    </div>
</form>