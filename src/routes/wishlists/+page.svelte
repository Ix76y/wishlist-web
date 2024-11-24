<script>
    import TextInput from "$lib/TextInput.svelte";
    import CircularProgress from '$lib/CircularProgress.svelte';
	import Wishlists from '$lib/Wishlists.svelte';

    import { page, navigating } from '$app/stores';
    import { goto } from '$app/navigation';
    import { enhance } from '$app/forms';
    import { fly, slide } from 'svelte/transition';
    import { onMount } from 'svelte';

	let { data, children, form } = $props();

    let createList = $state(false);
    let updateList = $state(false);
    let deleteList = $state(false);
    let shareList = $state(false);
    let valueCopied = $state(false);
    var selectedList = $state(null);

    let createWish = $state(false);
    let updateWish = $state(false);
    let deleteWish = $state(false);
    let reserveWish = $state(false);
    let selectedWish = $state();
    var loading = $state(false);

    function updateSelected(wishlists) {
        selectedList = wishlists.find((l) => l.uuid == $page.params.listId);
    }

    function copyListId() {
        navigator.clipboard.writeText(selectedList.uuid);
        valueCopied = true;
    }

    function groupWishesByUser(wishes) {
        const users = [...new Set(wishes.map(item => item.recipient))];

        // Callback function to get the recipient
        function sortCallback({ recipient }) {
            return recipient;
        }

        // Group by recipient
        const result = Object.groupBy(wishes, sortCallback);

        // Display Results
        console.log(JSON.stringify(result));
        return result;
    }

    function getUserNameById(wishlist, reserved_by) {
        for(var user of wishlist.shared_users) {
            if (user.id == reserved_by) {
                return user.name;
            }
        }
        return 'Unknown';
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
    {:else }
        <div class="flex items-center -mx-4 space-x-2 overflow-x-auto overflow-y-hidden sm:justify-center flex-nowrap">
            {#each data.wishlists as wishlist}
                {#if selectedList && wishlist.uuid == selectedList.uuid}
                    <button class="text-lg text-indigo-600 dark:text-indigo-500 font-light flex items-center flex-shrink-0 px-5 py-2 border-b-4 border-indigo-600 dark:border-indigo-400">{wishlist.name}</button>
                {:else}
                    <button onclick={() => {selectedList = wishlist; console.log(`Wishlist Active: ${wishlist.name}. ${JSON.stringify(wishlist)}`);}} class="text-lg text-gray-900 dark:text-gray-100 font-light flex items-center flex-shrink-0 px-5 py-2 border-b-4 border-gray-700 dark:border-gray-300">{wishlist.name}</button>
                {/if}
            {/each}
            <button type="button" onclick={() => createList = true }  class="px-6 py-2 mx-auto font-semibold text-xl text-indigo-600 dark:text-indigo-500 hover:text-indigo-500 hover:dark:text-indigo-600 rounded">+</button>
        </div>

        {#each data.wishlists as wishlist}
            {#if selectedList && wishlist.uuid == selectedList.uuid}
                <div class="flex gap-2 justify-center mt-1 italic text-sm text-slate-700 dark:text-slate-400 font-light">
                    {#if wishlist.description}
                        <p>📝 {wishlist.description}</p>
                    {/if}
                    {#if wishlist.due}
                        <p>⏰ {new Date(wishlist.due).toDateString()}</p>
                    {/if}
                    {#if wishlist.shared_users.length > 0 }
                        <div class="flex gap-2">
                            <p>🧍‍♂️ Shared with: </p>
                            {#each wishlist.shared_users as user }
                                {#if user.approved }
                                    <p class="">{user.name}</p>
                                {:else}
                                    <form method="POST" action="?/approveUser">
                                        <div class="flex text-amber-600 dark:text-amber-500">
                                            <p class="">{user.name} {user.id}</p>
                                            <input type="hidden" id="listId" name="listId" value={selectedList.uuid}>
                                            <input type="hidden" id="userId" name="userId" value={user.id}>
                                            <button class="text-lime-500">✔</button>
                                        </div>
                                    </form>
                                {/if}
                            {/each}
                        </div>
                    {/if}
                </div>
                <div class="flex items-center w-full">
                    <button type="button" onclick={() => createWish = true } class="px-6 py-2 mx-auto my-4 font-semibold text-sm text-indigo-600 dark:text-indigo-500 hover:text-indigo-500 hover:dark:text-indigo-600 rounded border-4 border-indigo-500 hover:border-indigo-600">Add Wish</button>
                </div>
            {/if}
            {#if selectedList && wishlist.uuid == selectedList.uuid}
                {#if wishlist.items.length == 0}
                    <p class="italic text-sm text-slate-700 dark:text-slate-400 font-light text-center w-full my-4">This wishlist is currently empty. Get started by adding a new wish to it!</p>
                {:else}
                    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
                        {#each Object.entries(groupWishesByUser(wishlist.items)) as [user, wishes]}
                            <div>  
                                <p class="italic text-lg text-slate-700 dark:text-slate-400 font-light">{user}</p>
                                {#each wishes as wish}
                                    <div in:fly={{ y:20 }} out:slide class="max-w-full gap-2 p-6 rounded-md shadow-md bg-gray-50 dark:bg-gray-800 dark:text-gray-800mt-8 text-left mb-4">
                                        <div class="flex gap-2">
                                            <h3 class="text-lg text-slate-700 dark:text-slate-400 font-light">▸ {wish.name}</h3>
                                            {#if wish.price }
                                                <p class="text-sm text-slate-700 dark:text-slate-400 font-light my-auto">(~ {wish.price} €)</p>
                                            {/if}
                                        </div>
                                        {#if wish.description }
                                            <p class="text-sm text-slate-700 dark:text-slate-400 font-light">{wish.description}</p>
                                        {/if}
                                        <div class="flex gap-2 mt-1">
                                            <button onclick={() => {selectedWish = wish; updateWish = true; }} class="text-sm text-sky-500 font-light" >Update</button>
                                            {#if wish.recipient != data.user.name}
                                                {#if !wish.reserved }
                                                    <button onclick={() => {selectedWish = wish; reserveWish = true; }} class="text-sm text-indigo-500 font-light" >Reserve</button>
                                                {:else }
                                                    <p class="text-sm text-slate-700 dark:text-slate-400 font-light">Reserved by: {getUserNameById(wishlist, wish.reserved_by)}</p>
                                                {/if}
                                            {/if}
                                            <button onclick={() => {selectedWish = wish; deleteWish = true; }} class="text-sm text-red-500 font-light" >Delete</button>
                                        </div>
                                    </div>
                                {/each}
                            </div>  
                        {/each}
                    </div>
                    <p class="italic text-sm text-slate-700 dark:text-slate-400 font-light text-center">There {#if wishlist.items.length == 1}is{:else}are{/if} {wishlist.items.length} {#if wishlist.items.length == 1}wish{:else}wishes{/if} in this wishlist.</p>
                {/if}
            {/if}
        {/each}
                    
        {#if selectedList }
            <div class="flex gap-4 justify-center mt-4">
                <button class="hover:text-indigo-500" onclick={() => shareList = true } ><ion-icon name="share-social-outline"></ion-icon> Share</button>
                <button class="hover:text-indigo-500" onclick={() => updateList = true } ><ion-icon name="create-outline"></ion-icon> Update</button>
                <button class="hover:text-indigo-500" onclick={() => deleteList = true }><ion-icon name="trash-bin-outline"></ion-icon> Delete</button>
            </div>
        {/if}

        {#if data.wishlists.length == 0}
            <div class="w-full text-center mx-auto mt-12">
                <h3 class="font-black text-xl text-gray-400 dark:text-gray-600">No Wishlists 😢</h3>
                <p>You don't have a wishlist yet, create a new one or join an existing one!</p>
                <button onclick={() => createList = true } class="px-6 py-2 mx-auto my-4 font-semibold text-sm text-indigo-600 dark:text-indigo-500 hover:text-indigo-500 hover:dark:text-indigo-600 rounded border-4 border-indigo-500 hover:border-indigo-600">Create Wishlist</button>
            </div>
        {/if}
    <!--{:catch error}
        <p>error loading lists: {error.message}</p>
    {/await}-->
    {/if}

    {#if createList }
        <div class="flex flex-col max-w-md gap-2 p-6 rounded-md shadow-md bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white mx-auto mt-8">
            <div class="flex justify-between">
                <h2 class="flex items-center gap-2 text-xl font-semibold leading-tight tracking-wide text-gray-900 dark:text-gray-100">
                    📋 New Wishlist
                </h2>
                <button type="button" onclick={() => createList = false } style="top: -4px;" class="relative pb-2 font-semibold text-xl text-indigo-600 dark:text-indigo-500 hover:text-indigo-500 hover:dark:text-indigo-600 rounded">𝘅</button>
            </div>
            
            <form method="POST" action="/wishlists?/createList" use:enhance={() => {
                loading = true;
                return async ({ update }) => {
                    await update();
                    createList = false;
                    loading = false;
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
        </div>
    {:else if updateList && selectedList}
        <div class="flex flex-col max-w-md gap-2 p-6 rounded-md shadow-md bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white mx-auto mt-8">
            <div class="flex justify-between">
                <h2 class="flex items-center gap-2 text-xl font-semibold leading-tight tracking-wide text-gray-900 dark:text-gray-100">
                    📋 Update Wishlist
                </h2>
                <button type="button" onclick={() => updateList = false } style="top: -4px;" class="relative pb-2 font-semibold text-xl text-indigo-600 dark:text-indigo-500 hover:text-indigo-500 hover:dark:text-indigo-600 rounded">𝘅</button>
            </div>
            
            <form method="POST" action="/wishlists?/updateList" use:enhance={() => {
                loading = true;
                return async ({ update }) => {
                    await update();
                    updateList = false;
                    loading = false;
                }
            }}>
                <TextInput title="Wishlist" id="wishlist" placeholder="" value={selectedList.name}></TextInput>
                <TextInput title="Description" id="description" value={selectedList.description}></TextInput>
                <input type="hidden" id="listId" name="listId" value={selectedList.uuid}>
                <div class="flex flex-col justify-end gap-3 mt-6 sm:flex-row">
                    {#if loading}
                        <CircularProgress/>
                    {:else}
                        <button class="px-6 py-2 rounded-sm shadow-sm dark:bg-indigo-600 dark:text-gray-50">Update</button>
                    {/if}
                </div>
            </form>
        </div>
    {:else if deleteList && selectedList }
        <div class="flex flex-col max-w-md gap-2 p-6 rounded-md shadow-md bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white mx-auto mt-8">
            <div class="flex justify-between">
                <h2 class="flex items-center gap-2 text-xl font-semibold leading-tight tracking-wide text-gray-900 dark:text-gray-100">
                    📋 Delete Wishlist
                </h2>
                <button type="button" onclick={() => deleteList = false } style="top: -4px;" class="relative pb-2 font-semibold text-xl text-indigo-600 dark:text-indigo-500 hover:text-indigo-500 hover:dark:text-indigo-600 rounded">𝘅</button>
            </div>
            
            <form method="POST" action="/wishlists?/deleteList" use:enhance={() => {
                loading = true;
                return async ({ update }) => {
                    await update();
                    deleteList = false;
                    loading = false;
                    selectedList = null;
                }
            }}>
                <p class="flex-1 text-sm text-slate-700 dark:text-slate-400 font-light">Are you sure you want to delete the wishlist <b>{selectedList.name}</b>? This can't be undone.</p>
                <input type="hidden" id="listId" name="listId" value={selectedList.uuid}>
                <div class="flex flex-col justify-end gap-3 mt-6 sm:flex-row">
                    {#if loading}
                        <CircularProgress/>
                    {:else}
                        <button class="px-6 py-2 rounded-sm shadow-sm dark:bg-indigo-600 dark:text-gray-50">Delete</button>
                    {/if}
                </div>
            </form>
        </div>
    {:else if shareList && selectedList }
        <div class="flex flex-col max-w-md gap-2 p-6 rounded-md shadow-md bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white mx-auto mt-8">
            <div class="flex justify-between">
                <h2 class="flex items-center gap-2 text-xl font-semibold leading-tight tracking-wide text-gray-900 dark:text-gray-100">
                    📋 Share Wishlist
                </h2>
                <button type="button" onclick={() => { shareList = false; valueCopied = false; } } style="top: -4px;" class="relative pb-2 font-semibold text-xl text-indigo-600 dark:text-indigo-500 hover:text-indigo-500 hover:dark:text-indigo-600 rounded">𝘅</button>
            </div>
            
            <p class="flex-1 text-sm text-slate-700 dark:text-slate-400 font-light">Click on the code below to copy it and send it to anyone you would like to share this list with.</p>
            <button class="cursor-copy" onclick={() => copyListId() }>
                <code>
                    {selectedList.uuid}
                </code>
            </button>
            {#if valueCopied}
                <p class="flex-1 text-sm text-lime-600 dark:text-lime-400 font-light">Copied to clipboard</p>
            {/if}

        </div>
    {:else if createWish && selectedList }
        <div class="flex flex-col max-w-md gap-2 p-6 rounded-md shadow-md bg-gray-50 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white mx-auto mt-8">
            <div class="flex justify-between">
                <h2 class="flex items-center gap-2 text-xl font-semibold leading-tight tracking-wide text-gray-900 dark:text-gray-100">
                    🎁 New Wish
                </h2>
                <button type="button" onclick={() => createWish = false } style="top: -4px;" class="relative pb-2 font-semibold text-xl text-indigo-600 dark:text-indigo-500 hover:text-indigo-500 hover:dark:text-indigo-600 rounded">𝘅</button>
            </div>
            <form method="POST" action="?/createWish" use:enhance={() => {
                loading = true;
                return async ({ update }) => {
                    await update();
                    createWish = false;
                    loading = false; 
                }
            }}>
                <p class="flex-1 text-sm text-slate-700 dark:text-slate-400 font-light">You can create a new wish for yourself or someone else, the wish will be added to the "{selectedList.name}" list.</p>
                <TextInput title="Wish" id="wish" disabled={loading}></TextInput>
                <TextInput title="For" id="wishowner" disabled={loading} value={data.user.name}></TextInput>
                <fieldset class="w-full space-y-1 text-slate-700 dark:text-slate-400">
                    <label for="price" class="block text-sm font-medium">Estimated price</label>
                    <div class="flex">
                        <input type="text" name="price" id="price" placeholder="25,00" disabled={loading} class="peer flex flex-1 text-right focus:outline-none focus:border-indigo-400 sm:text-sm rounded-l-md focus:ring-0 border-gray-700 bg-zinc-50 dark:bg-zinc-800 ">
                        <span class="flex items-center px-3 pointer-events-none sm:text-sm rounded-r-md border border-gray-700 peer-focus:bg-indigo-400 peer-focus:dark:bg-indigo-600">€</span>
                    </div>
                </fieldset>
                <TextInput title="Description" id="wishdescription" disabled={loading}></TextInput>
                <input type="hidden" id="listId" name="listId" value={selectedList.uuid}>
                <div class="flex flex-col justify-end gap-3 mt-6 sm:flex-row">
                    {#if loading}
                        <CircularProgress/>
                    {:else}
                        <button disabled={loading} class="px-6 py-2 rounded-sm shadow-sm dark:bg-indigo-600 dark:text-gray-50 disabled:bg-indigo-300/50">Create</button>
                    {/if}
                </div>
            </form>
        </div>
    {:else if updateWish && selectedList && selectedWish}
        <div class="flex flex-col max-w-md gap-2 p-6 rounded-md shadow-md bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white mx-auto mt-8">
            <div class="flex justify-between">
                <h2 class="flex items-center gap-2 text-xl font-semibold leading-tight tracking-wide text-gray-900 dark:text-gray-100">
                    🎁 Update Wish
                </h2>
                <button type="button" onclick={() => updateWish = false } style="top: -4px;" class="relative pb-2 font-semibold text-xl text-indigo-600 dark:text-indigo-500 hover:text-indigo-500 hover:dark:text-indigo-600 rounded">𝘅</button>
            </div>
            <form method="POST" action="?/updateWish" use:enhance={() => {
                loading = true;
                return async ({ update }) => {
                    await update();
                    updateWish = false;
                    loading = false;
                }
            }}>
                <TextInput title="Wish" id="wish" value={selectedWish.name} ></TextInput>
                <TextInput title="For" id="wishowner" value={selectedWish.recipient} ></TextInput>
                <fieldset class="w-full space-y-1 text-slate-700 dark:text-slate-400">
                    <label for="price" class="block text-sm font-medium">Estimated price</label>
                    <div class="flex">
                        <input type="text" name="price" id="price" placeholder="25,00" value={selectedWish.price} class="peer flex flex-1 text-right focus:outline-none focus:border-indigo-400 sm:text-sm rounded-l-md focus:ring-0 border-gray-700 bg-zinc-50 dark:bg-zinc-800 ">
                        <span class="flex items-center px-3 pointer-events-none sm:text-sm rounded-r-md border border-gray-700 peer-focus:bg-indigo-400 peer-focus:dark:bg-indigo-600">€</span>
                    </div>
                </fieldset>
                <TextInput title="Description" id="wishdescription" value={selectedWish.description}></TextInput>
                <input type="hidden" id="wishId" name="wishId" value={selectedWish.id}>
                <div class="flex flex-col justify-end gap-3 mt-6 sm:flex-row">
                    {#if loading}
                        <CircularProgress/>
                    {:else}
                        <button disabled={loading} class="px-6 py-2 rounded-sm shadow-sm dark:bg-indigo-600 dark:text-gray-50 disabled:bg-indigo-300/50">Update</button>
                    {/if}
                </div>
            </form>
        </div>
    {:else if reserveWish && selectedList && selectedWish }
        <div class="flex flex-col max-w-md gap-2 p-6 rounded-md shadow-md bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white mx-auto mt-8">
            <div class="flex justify-between">
                <h2 class="flex items-center gap-2 text-xl font-semibold leading-tight tracking-wide text-gray-900 dark:text-gray-100">
                    🎁 Reserve Wish
                </h2>
                <button type="button" onclick={() => reserveWish = false } style="top: -4px;" class="relative pb-2 font-semibold text-xl text-indigo-600 dark:text-indigo-500 hover:text-indigo-500 hover:dark:text-indigo-600 rounded">𝘅</button>
            </div>
            
            <form method="POST" action="?/reserveWish"  use:enhance={() => {
                loading = true;
                return async ({ update }) => {
                    await update();
                    reserveWish = false;
                    loading = false;
                }
            }}>
                <p class="flex-1 text-sm text-slate-700 dark:text-slate-400 font-light">Do you want to reserve the wish <b>{selectedWish.name}</b>? This will indicate to everyone else that you will get this wish.</p>
                <input type="hidden" id="reserve" name="reserve" value=true>
                <input type="hidden" id="wishId" name="wishId" value={selectedWish.id}>
                <div class="flex flex-col justify-end gap-3 mt-6 sm:flex-row">
                    {#if loading}
                        <CircularProgress/>
                    {:else}
                        <button disabled={loading} class="px-6 py-2 rounded-sm shadow-sm dark:bg-indigo-600 dark:text-gray-50 disabled:bg-indigo-300/50">I will get it!</button>
                    {/if}
                </div>
            </form>
        </div>
    {:else if deleteWish && selectedList && selectedWish}
        <div class="flex flex-col max-w-md gap-2 p-6 rounded-md shadow-md bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white mx-auto mt-8">
            <div class="flex justify-between">
                <h2 class="flex items-center gap-2 text-xl font-semibold leading-tight tracking-wide text-gray-900 dark:text-gray-100">
                    🎁 Delete Wish
                </h2>
                <button type="button" onclick={() => deleteWish = false } style="top: -4px;" class="relative pb-2 font-semibold text-xl text-indigo-600 dark:text-indigo-500 hover:text-indigo-500 hover:dark:text-indigo-600 rounded">𝘅</button>
            </div>
            
            <form method="POST" action="?/deleteWish"  use:enhance={() => {
                loading = true;
                return async ({ update }) => {
                    await update();
                    deleteWish = false;
                    loading = false;
                }
            }}>
                <p class="flex-1 text-sm text-slate-700 dark:text-slate-400 font-light">Are you sure you want to delete the wish <b>{selectedWish.name}</b>? This can't be undone.</p>
                <input type="hidden" id="wishId" name="wishId" value={selectedWish.id}>
                <div class="flex flex-col justify-end gap-3 mt-6 sm:flex-row">
                    {#if loading}
                        <CircularProgress/>
                    {:else}
                        <button disabled={loading} class="px-6 py-2 rounded-sm shadow-sm dark:bg-indigo-600 dark:text-gray-50 disabled:bg-indigo-300/50">Delete</button>
                    {/if}
                </div>
            </form>
        </div>
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


