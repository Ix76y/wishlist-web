<script>
    import TextInput from "$lib/TextInput.svelte";
    import { page, navigating } from '$app/stores';
    import { enhance } from '$app/forms';
    import { onMount } from 'svelte';
    import { fly, slide } from 'svelte/transition';

    let { data, form } = $props();

    let createWish = $state(false);
    let updateWish = $state(false);
    let deleteWish = $state(false);
    let reserveWish = $state(false);
    let selectedWish = $state();
    var loading = $state(false);

    var selectedList = $state(null);
    

    function updateSelected(wishlists) {
        selectedList = wishlists.find((l) => l.uuid == $page.params.listId);
    }

    /*var wishesGrouped = $derived.by(() => {
        if (Array.isArray(data.wishes)) {
            function sortCallback({ recipient }) {
                return recipient;
            }

            // Group by recipient
            const result = Object.groupBy(data.wishes, sortCallback);

            // Display Results
            console.log(`Wishes grouped: ${JSON.stringify(result)}`);
            return result;
            }
        return null;
    });*/


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

    onMount(async () => {
        console.log("onMount in list");
    });
</script>

{#if createWish}
    <div class="flex flex-col max-w-md gap-2 p-6 rounded-md shadow-md bg-gray-50 dark:bg-gray-800 dark:text-gray-800 mx-auto mt-8">
        <div class="flex justify-between">
            <h2 class="flex items-center gap-2 text-xl font-semibold leading-tight tracking-wide text-gray-900 dark:text-gray-100">
                🎁 New Wish
            </h2>
            <button type="button" onclick={() => createWish = false } style="top: -4px;" class="relative pb-2 font-semibold text-xl text-indigo-600 dark:text-indigo-500 hover:text-indigo-500 hover:dark:text-indigo-600 rounded">𝘅</button>
        </div>
        <form method="POST" action="?/createWish" use:enhance={ () => {
            loading = true;
            return async ({ update }) => {
                await update();
                loading = false;
                createWish = false;
            };
        }} >
            <p class="flex-1 text-sm text-slate-700 dark:text-slate-400 font-light">You can create a new wish for yourself or someone else, the wish will be added to the "{selectedList.name}" list.</p>
            <TextInput title="Wish" id="wish" placeholder="Book" disabled={loading}></TextInput>
            <TextInput title="For" id="wishowner" disabled={loading}></TextInput>
            <fieldset class="w-full space-y-1 text-slate-700 dark:text-slate-400">
                <label for="price" class="block text-sm font-medium">Estimated price</label>
                <div class="flex">
                    <input type="text" name="price" id="price" placeholder="25,00" disabled={loading} class="peer flex flex-1 text-right focus:outline-none focus:border-indigo-400 sm:text-sm rounded-l-md focus:ring-0 border-gray-700 bg-gray-50 dark:bg-gray-800 ">
                    <span class="flex items-center px-3 pointer-events-none sm:text-sm rounded-r-md border border-gray-700 peer-focus:bg-indigo-400 peer-focus:dark:bg-indigo-600">€</span>
                </div>
            </fieldset>
            <TextInput title="Description" id="wishdescription" disabled={loading}></TextInput>
            <input type="hidden" id="wishlistId" name="wishlistId" value={selectedList.uuid}>
            <div class="flex flex-col justify-end gap-3 mt-6 sm:flex-row">
                <button disabled={loading} class="px-6 py-2 rounded-sm shadow-sm dark:bg-indigo-600 dark:text-gray-50 disabled:bg-indigo-300/50">Create</button>
            </div>
        </form>
    </div>
{:else if updateWish}
    <div class="flex flex-col max-w-md gap-2 p-6 rounded-md shadow-md bg-gray-50 dark:bg-gray-800 dark:text-gray-800 mx-auto mt-8">
        <div class="flex justify-between">
            <h2 class="flex items-center gap-2 text-xl font-semibold leading-tight tracking-wide text-gray-900 dark:text-gray-100">
                🎁 Update Wish
            </h2>
            <button type="button" onclick={() => updateWish = false } style="top: -4px;" class="relative pb-2 font-semibold text-xl text-indigo-600 dark:text-indigo-500 hover:text-indigo-500 hover:dark:text-indigo-600 rounded">𝘅</button>
        </div>
        <form method="POST" action="?/updateWish" use:enhance>
            <TextInput title="Wish" id="wish" value={selectedWish.name} ></TextInput>
            <TextInput title="For" id="wishowner" value={selectedWish.recipient} ></TextInput>
            <fieldset class="w-full space-y-1 text-slate-700 dark:text-slate-400">
                <label for="price" class="block text-sm font-medium">Estimated price</label>
                <div class="flex">
                    <input type="text" name="price" id="price" placeholder="25,00" value={selectedWish.price} class="peer flex flex-1 text-right focus:outline-none focus:border-indigo-400 sm:text-sm rounded-l-md focus:ring-0 border-gray-700 bg-gray-50 dark:bg-gray-800 ">
                    <span class="flex items-center px-3 pointer-events-none sm:text-sm rounded-r-md border border-gray-700 peer-focus:bg-indigo-400 peer-focus:dark:bg-indigo-600">€</span>
                </div>
            </fieldset>
            <TextInput title="Description" id="wishdescription" value={selectedWish.description}></TextInput>
            <input type="hidden" id="wishId" name="wishId" value={selectedWish.id}>
            <div class="flex flex-col justify-end gap-3 mt-6 sm:flex-row">
                <button class="px-6 py-2 rounded-sm shadow-sm dark:bg-indigo-600 dark:text-gray-50">Update</button>
            </div>
        </form>
    </div>
{:else if reserveWish }
    <div class="flex flex-col max-w-md gap-2 p-6 rounded-md shadow-md dark:bg-gray-50 dark:text-gray-800 mx-auto mt-8">
        <div class="flex justify-between">
            <h2 class="flex items-center gap-2 text-xl font-semibold leading-tight tracking-wide text-gray-900 dark:text-gray-100">
                🎁 Reserve Wish
            </h2>
            <button type="button" onclick={() => reserveWish = false } style="top: -4px;" class="relative pb-2 font-semibold text-xl text-indigo-600 dark:text-indigo-500 hover:text-indigo-500 hover:dark:text-indigo-600 rounded">𝘅</button>
        </div>
        
        <form method="POST" action="?/reserveWish" use:enhance>
            <p class="flex-1 text-sm text-slate-700 dark:text-slate-400 font-light">Do you want to reserve the wish <b>{selectedWish.name}</b>? This will indicate to everyone else that you will get this wish.</p>
            <input type="hidden" id="reserve" name="reserve" value=true>
            <input type="hidden" id="wishId" name="wishId" value={selectedWish.id}>
            <div class="flex flex-col justify-end gap-3 mt-6 sm:flex-row">
                <button class="px-6 py-2 rounded-sm shadow-sm dark:bg-indigo-600 dark:text-gray-50">I will get it!</button>
            </div>
        </form>
    </div>
{:else if deleteWish}
    <div class="flex flex-col max-w-md gap-2 p-6 rounded-md shadow-md dark:bg-gray-50 dark:text-gray-800 mx-auto mt-8">
        <div class="flex justify-between">
            <h2 class="flex items-center gap-2 text-xl font-semibold leading-tight tracking-wide text-gray-900 dark:text-gray-100">
                🎁 Delete Wish
            </h2>
            <button type="button" onclick={() => deleteWish = false } style="top: -4px;" class="relative pb-2 font-semibold text-xl text-indigo-600 dark:text-indigo-500 hover:text-indigo-500 hover:dark:text-indigo-600 rounded">𝘅</button>
        </div>
        
        <form method="POST" action="?/deleteWish">
            <p class="flex-1 text-sm text-slate-700 dark:text-slate-400 font-light">Are you sure you want to delete the wish <b>{selectedWish.name}</b>? This can't be undone.</p>
            <input type="hidden" id="wishId" name="wishId" value={selectedWish.id}>
            <div class="flex flex-col justify-end gap-3 mt-6 sm:flex-row">
                <button class="px-6 py-2 rounded-sm shadow-sm dark:bg-indigo-600 text-red-500 dark:text-red-400">Delete</button>
            </div>
        </form>
    </div>
{:else}
    <div class="flex flex-col gap-2 p-6 mx-auto my-2 text-center">
        {#if $navigating }
            <p>Loading content...</p>
        {:else }
            {#if data.users.length > 1 }
            <div class="flex gap-4">
                <p class="italic text-sm text-slate-700 dark:text-slate-400 font-light">List shared with:</p>
                {#each data.users as user}
                    {#if user.name != data.user.name}
                        {#if user.approved }
                            <div class="flex text-indigo-600 dark:text-indigo-500 italic text-sm font-light">
                                <p class="">{user.name}</p>
                            </div>
                        {:else}
                        <div class="flex text-gray-600 dark:text-gray-500 italic text-sm font-light">
                            <p class="">{user.name}</p>
                            <button class="text-lime-500" onclick={() => approveUser(user.id, true) }>✔</button>
                            <button class="text-red-500" onclick={() => approveUser(user.id, false) }>ⅹ</button>
                        </div>
                        {/if}
                    {/if}
                {/each}
            </div>
            {/if}
            {#if data.wishes.length == 0}
                <p class="italic text-sm text-slate-700 dark:text-slate-400 font-light">This wishlist is currently empty. Get started by adding a new wish to it!</p>
            {:else}
                <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
                    {#each Object.entries(groupWishesByUser(data.wishes)) as [user, wishes]}
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
                                        {#if !wish.reserved}
                                            <button onclick={() => {selectedWish = wish; reserveWish = true; }} class="text-sm text-indigo-500 font-light" >Reserve</button>
                                        {/if}
                                        <button onclick={() => {selectedWish = wish; deleteWish = true; }} class="text-sm text-red-500 font-light" >Delete</button>
                                    </div>
                                </div>
                            {/each}
                        </div>  
                    {/each}
                </div>
                <p class="italic text-sm text-slate-700 dark:text-slate-400 font-light">There {#if data.wishes.length == 1}is{:else}are{/if} {data.wishes.length} {#if data.wishes.length == 1}wish{:else}wishes{/if} in this wishlist.</p>
            {/if}

            <div class="flex items-center w-full">
                <button type="button" onclick={() => {createWish = true; updateSelected(data.wishlists)} } class="px-6 py-2 mx-auto my-4 font-semibold text-sm text-indigo-600 dark:text-indigo-500 hover:text-indigo-500 hover:dark:text-indigo-600 rounded border-4 border-indigo-500 hover:border-indigo-600">Add Wish</button>
            </div>
        {/if}
    </div>
{/if}