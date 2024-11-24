<script>
    import TextInput from "$lib/TextInput.svelte";
    import CircularProgress from '$lib/CircularProgress.svelte';
    import { enhance } from '$app/forms';

    let { wishName, recipient, price, description, wishId } = $props();

    let loading = $state(false);
</script>

<h2 class="flex items-center gap-2 text-xl font-semibold leading-tight tracking-wide text-gray-900 dark:text-gray-100">
    🎁 Update Wish
</h2>

<form method="POST" action="?/updateWish" use:enhance={() => {
    loading = true;
    return async ({ update }) => {
        await update();
        loading = false;
        updateWishDialog.close();
    }
}}>
    <TextInput title="Wish" id="wish" value={wishName} ></TextInput>
    <TextInput title="For" id="wishowner" value={recipient} ></TextInput>
    <fieldset class="w-full space-y-1 text-slate-700 dark:text-slate-400">
        <label for="price" class="block text-sm font-medium">Estimated price</label>
        <div class="flex">
            <input type="text" name="price" id="price" placeholder="25,00" value={price} class="peer flex flex-1 text-right focus:outline-none focus:border-indigo-400 sm:text-sm rounded-l-md focus:ring-0 border-gray-700 bg-zinc-50 dark:bg-zinc-800 ">
            <span class="flex items-center px-3 pointer-events-none sm:text-sm rounded-r-md border border-gray-700 peer-focus:bg-indigo-400 peer-focus:dark:bg-indigo-600">€</span>
        </div>
    </fieldset>
    <TextInput title="Description" id="wishdescription" value={description}></TextInput>
    <input type="hidden" id="wishId" name="wishId" value={wishId}>
    <div class="flex flex-col justify-end gap-3 mt-6 sm:flex-row">
        {#if loading}
            <CircularProgress/>
        {:else}
            <button disabled={loading} class="px-6 py-2 rounded-sm shadow-sm dark:bg-indigo-600 dark:text-gray-50 disabled:bg-indigo-300/50">Update</button>
        {/if}
    </div>
</form>