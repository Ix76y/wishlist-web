<script>
    import TextInput from "$lib/TextInput.svelte";
    import CircularProgress from '$lib/CircularProgress.svelte';
    import { enhance } from '$app/forms';

    let loading = $state(false);
</script>


<h2 class="flex items-center gap-2 text-xl font-semibold leading-tight tracking-wide text-gray-900 dark:text-gray-100">
    📋 New Wishlist
</h2>

<form method="POST" action="/wishlists?/createList" use:enhance={() => {
    loading = true;
    return async ({ update }) => {
        await update();
        loading = false;
        createWishlistDialog.close();
    }
}}>
    <p class="flex-1 text-sm text-slate-700 dark:text-slate-400 font-light">Create a new wishlist. You can share it with others or just create one for yourself.</p>
    <TextInput title="Wishlist" id="wishlist" placeholder=""></TextInput>
    <TextInput title="Description" id="description"></TextInput>
    
    <div class="flex flex-col justify-end gap-3 mt-6 sm:flex-row">
        {#if loading}
            <CircularProgress/>
        {:else}
            <button class="px-6 py-2 rounded-sm shadow-sm dark:bg-indigo-600 dark:text-gray-50">Create</button>
        {/if}
    </div>
</form>
<div class="my-2 flex items-center gap-4 before:h-px before:flex-1 before:bg-gray-300  before:content-[''] after:h-px after:flex-1 after:bg-gray-300  after:content-['']">Or</div>
<form method="POST" action="/wishlists?/joinList" use:enhance>
    <p class="flex-1 text-sm text-slate-700 dark:text-slate-400 font-light mb-2">Join an existing wishlist.</p>
    <div class="flex gap-3 sm:flex-row">
        <TextInput title="Wishlist ID" id="sharedWishlist" placeholder=""></TextInput>
        <button class="px-6 py-2 mt-6 rounded-sm shadow-sm dark:bg-indigo-600 dark:text-gray-50">Join</button>
    </div>
</form>