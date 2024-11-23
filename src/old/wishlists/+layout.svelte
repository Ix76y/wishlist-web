<script>
	// import DatePicker from '$lib/DatePicker.svelte';
    import TextInput from "$lib/TextInput.svelte";
	import Wishlists from '$lib/Wishlists.svelte';

    import { page, navigating } from '$app/stores';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

	let { data, children, form } = $props();
    let createList = $state(false);
    let updateList = $state(false);
    let deleteList = $state(false);
    let shareList = $state(false);
    let valueCopied = $state(false);
    
    var selectedList = $state(null);
    /*$derived.by(() => {
        data.wishlists.then((result) => {
            if (Array.isArray(result)) {
                return result.find((l) => l.uuid == $page.params.listId);
            }
            return null;
        })
    });*/

    function updateSelected(wishlists) {
        selectedList = wishlists.find((l) => l.uuid == $page.params.listId);
    }

    function copyListId() {
        navigator.clipboard.writeText($page.params.listId);
        valueCopied = true;
    }

    onMount(async () => {
        if (form?.success) { 
            goto('/wishlists');
        } 
    });

</script>

<div class="container mx-auto m-4">
    <!--{#await data.wishlists }-->
    {#if $navigating }
        <p>Loading Lists...</p>
    <!--{:then wishlists}-->
    {:else}
        <div class="flex items-center -mx-4 space-x-2 overflow-x-auto overflow-y-hidden sm:justify-center flex-nowrap">
            {#each data.wishlists as wishlist}
                {#if wishlist.uuid == $page.params.listId}
                    <button rel="noopener noreferrer" class="text-lg text-indigo-600 dark:text-indigo-500 font-light flex items-center flex-shrink-0 px-5 py-2 border-b-4 border-indigo-600 dark:border-indigo-400">{wishlist.name}</button>
                {:else}
                    <a rel="noopener noreferrer" href="/wishlists/{wishlist.uuid}"  class="text-lg text-gray-900 dark:text-gray-100 font-light flex items-center flex-shrink-0 px-5 py-2 border-b-4 border-gray-700 dark:border-gray-300">{wishlist.name}</a>
                {/if}
            {/each}
            <button type="button" onclick={() => createList = true }  class="px-6 py-2 mx-auto font-semibold text-xl text-indigo-600 dark:text-indigo-500 hover:text-indigo-500 hover:dark:text-indigo-600 rounded">+</button>
        </div>

        {#each data.wishlists as wishlist}
            <div class="flex gap-2 justify-center mt-1 italic text-sm text-slate-700 dark:text-slate-400 font-light">
                {#if wishlist.uuid == $page.params.listId}
                    {#if wishlist.description}
                        <p>📝 {wishlist.description}</p>
                    {/if}
                    {#if wishlist.due}
                        <p>⏰ {new Date(wishlist.due).toDateString()}</p>
                    {/if}
                {/if}
            </div>
        {/each}

        <div class="flex gap-2 justify-center mt-4">
            <button onclick={() => shareList = true } >🔗 Share</button>
            <button onclick={() => {updateList = true; updateSelected(data.wishlists);} } >📑 Update</button>
            <button onclick={() => {deleteList = true; updateSelected(data.wishlists);} }>🗑️ Delete</button>
        </div>
    <!--{:catch error}
        <p>error loading lists: {error.message}</p>
    {/await}-->
    {/if}

    {#if createList }
        <div class="flex flex-col max-w-md gap-2 p-6 rounded-md shadow-md dark:bg-gray-50 dark:text-gray-800 mx-auto mt-8">
            <div class="flex justify-between">
                <h2 class="flex items-center gap-2 text-xl font-semibold leading-tight tracking-wide text-gray-900 dark:text-gray-100">
                    📋 New Wishlist
                </h2>
                <button type="button" onclick={() => createList = false } style="top: -4px;" class="relative pb-2 font-semibold text-xl text-indigo-600 dark:text-indigo-500 hover:text-indigo-500 hover:dark:text-indigo-600 rounded">𝘅</button>
            </div>
            
            <form method="POST" action="/wishlists?/createList">
                <p class="flex-1 text-sm text-slate-700 dark:text-slate-400 font-light">Create a new wishlist. You can share it with others or just create one for yourself.</p>
                <TextInput title="Wishlist" id="wishlist" placeholder=""></TextInput>
                <TextInput title="Description" id="description"></TextInput>
                
                <div class="flex flex-col justify-end gap-3 mt-6 sm:flex-row">
                    <button class="px-6 py-2 rounded-sm shadow-sm dark:bg-indigo-600 dark:text-gray-50">Create</button>
                </div>
            </form>
            <div class="my-2 flex items-center gap-4 before:h-px before:flex-1 before:bg-gray-300  before:content-[''] after:h-px after:flex-1 after:bg-gray-300  after:content-['']">Or</div>
            <form method="POST" action="/wishlists?/joinList">
                <p class="flex-1 text-sm text-slate-700 dark:text-slate-400 font-light mb-2">Join an existing wishlist.</p>
                <div class="flex gap-3 sm:flex-row">
                    <TextInput title="Wishlist ID" id="sharedWishlist" placeholder=""></TextInput>
                    <button class="px-6 py-2 mt-6 rounded-sm shadow-sm dark:bg-indigo-600 dark:text-gray-50">Join</button>
                </div>
            </form>
        </div>
    {:else if updateList}
        <div class="flex flex-col max-w-md gap-2 p-6 rounded-md shadow-md dark:bg-gray-50 dark:text-gray-800 mx-auto mt-8">
            <div class="flex justify-between">
                <h2 class="flex items-center gap-2 text-xl font-semibold leading-tight tracking-wide text-gray-900 dark:text-gray-100">
                    📋 Update Wishlist
                </h2>
                <button type="button" onclick={() => updateList = false } style="top: -4px;" class="relative pb-2 font-semibold text-xl text-indigo-600 dark:text-indigo-500 hover:text-indigo-500 hover:dark:text-indigo-600 rounded">𝘅</button>
            </div>
            
            <form method="POST" action="/wishlists?/updateList">
                <TextInput title="Wishlist" id="wishlist" placeholder="" value={selectedList.name}></TextInput>
                <TextInput title="Description" id="description" value={selectedList.description}></TextInput>
                
                <div class="flex flex-col justify-end gap-3 mt-6 sm:flex-row">
                    <button class="px-6 py-2 rounded-sm shadow-sm dark:bg-indigo-600 dark:text-gray-50">Update</button>
                </div>
            </form>
        </div>
    {:else if deleteList }
        <div class="flex flex-col max-w-md gap-2 p-6 rounded-md shadow-md dark:bg-gray-50 dark:text-gray-800 mx-auto mt-8">
            <div class="flex justify-between">
                <h2 class="flex items-center gap-2 text-xl font-semibold leading-tight tracking-wide text-gray-900 dark:text-gray-100">
                    📋 Delete Wishlist
                </h2>
                <button type="button" onclick={() => deleteList = false } style="top: -4px;" class="relative pb-2 font-semibold text-xl text-indigo-600 dark:text-indigo-500 hover:text-indigo-500 hover:dark:text-indigo-600 rounded">𝘅</button>
            </div>
            
            <form method="POST" action="/wishlists?/deleteList">
                <p class="flex-1 text-sm text-slate-700 dark:text-slate-400 font-light">Are you sure you want to delete the wishlist <b>{selectedList.name}</b>? This can't be undone.</p>
                <input type="hidden" id="listId" name="listId" value={$page.params.listId}>
                <div class="flex flex-col justify-end gap-3 mt-6 sm:flex-row">
                    <button class="px-6 py-2 rounded-sm shadow-sm dark:bg-indigo-600 text-red-500 dark:text-red-400">Delete</button>
                </div>
            </form>
        </div>
    {:else if shareList }
        <div class="flex flex-col max-w-md gap-2 p-6 rounded-md shadow-md dark:bg-gray-50 dark:text-gray-800 mx-auto mt-8">
            <div class="flex justify-between">
                <h2 class="flex items-center gap-2 text-xl font-semibold leading-tight tracking-wide text-gray-900 dark:text-gray-100">
                    📋 Share Wishlist
                </h2>
                <button type="button" onclick={() => { shareList = false; valueCopied = false; } } style="top: -4px;" class="relative pb-2 font-semibold text-xl text-indigo-600 dark:text-indigo-500 hover:text-indigo-500 hover:dark:text-indigo-600 rounded">𝘅</button>
            </div>
            
            <p class="flex-1 text-sm text-slate-700 dark:text-slate-400 font-light">Click on the code below to copy it and send it to anyone you would like to share this list with.</p>
            <button class="cursor-copy" onclick={() => copyListId() }>
                <code>
                    {$page.params.listId}
                </code>
            </button>
            {#if valueCopied}
                <p class="flex-1 text-sm text-lime-600 dark:text-lime-400 font-light">Copied to clipboard</p>
            {/if}

        </div>
    {:else}
        {@render children()}
    {/if}
    {#if form != null && !form?.success}
        <p>Error creating new list!</p>
    {/if}
</div>
<!--
<div class="container mx-auto m-4">
	<div class="flex items-center -mx-4 space-x-2 overflow-x-auto overflow-y-hidden sm:justify-center flex-nowrap">
        {#each data.wishlists as wishlist}
            {#if wishlist.uuid == selectedList}
                <button rel="noopener noreferrer" class="text-lg text-indigo-600 dark:text-indigo-500 font-light flex items-center flex-shrink-0 px-5 py-2 border-b-4 border-indigo-600 dark:border-indigo-400">{wishlist.name}</button>
            {:else}
                <button rel="noopener noreferrer" onclick={() => selectList(wishlist) } class="text-lg text-gray-900 dark:text-gray-100 font-light flex items-center flex-shrink-0 px-5 py-2 border-b-4 border-gray-700 dark:border-gray-300">{wishlist.name}</button>
            {/if}
        {/each}
        <button type="button" class="px-6 py-2 mx-auto font-semibold text-xl text-indigo-600 dark:text-indigo-500 hover:text-indigo-500 hover:dark:text-indigo-600 rounded">+</button>
    </div>
</div>
-->


