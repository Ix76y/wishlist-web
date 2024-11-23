<script>
    import { onMount } from 'svelte';
	import TextInput from './TextInput.svelte';

    let wishlists = $state();
    let selectedList = $state();
    let wishes = $state();

    let createWish = $state(true);
    let createList = $state(false);


    onMount(async () => {
        //wishlists = getWishlists();
        wishlists = [{"user_id":"1bc08c02-47a8-48af-b6a3-24f11076a9e3","description":"Big Family Wishlist for Nikolaus & Christmas","name":"Nikolaus / Christmas 2024","due":"2024-12-24T23:59:59","uuid":"20398853-3e11-458f-99cb-39088a7c0381"},{"user_id":"1bc08c02-47a8-48af-b6a3-24f11076a9e3","description":"List to collect ideas","name":"Ideas","due":null,"uuid":"dc73e171-f39b-467a-be5b-d46aa2b2b8cc"}];
        if (wishlists.length) {
            selectedList = wishlists[0];
            getWishes();
        }
    });

    async function getWishlists() {
        await fetch('/wishlists', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		})
        .then((response) => response.json())
		.then((result) => {
            if (Array.isArray(result)) {
                wishlists = result;
            } else {
                error = result.detail;
            }
		})
        .catch((error) => console.error(error));
		
		console.log(`Wishlists: ${wishlists} as str: ${JSON.stringify(wishlist)}`);
    }

    async function getWishes() {
        console.log(`Getting wishes on client side: ${selectedList.uuid}`);
        await fetch('/wishlists/items', {
			method: 'POST',
            body: JSON.stringify({ 'uuid': selectList.uuid }),
			headers: {
				'Content-Type': 'application/json'
			}
		})
        .then((response) => response.json())
		.then((result) => {
            if (Array.isArray(result)) {
                wishes = result;
            } else {
                error = result.detail;
            }
		})
        .catch((error) => console.error(error));
		
		console.log(`Wishlists: ${wishes} as str: ${JSON.stringify(wishes)}`);
    }



    function selectList(wishlist) {
        selectedList = wishlist;
        getWishes(wishlist.uuid);
    }


</script>


<div class="">
    <div class="flex items-center -mx-4 space-x-2 overflow-x-auto overflow-y-hidden sm:justify-center flex-nowrap">
        {#each wishlists as wishlist}
            {#if wishlist == selectedList}
                <button rel="noopener noreferrer" class="text-lg text-indigo-600 dark:text-indigo-500 font-light flex items-center flex-shrink-0 px-5 py-2 border-b-4 border-indigo-600 dark:border-indigo-400">{wishlist.name}</button>
            {:else}
                <button rel="noopener noreferrer" onclick={() => selectList(wishlist) } class="text-lg text-gray-900 dark:text-gray-100 font-light flex items-center flex-shrink-0 px-5 py-2 border-b-4 border-gray-700 dark:border-gray-300">{wishlist.name}</button>
            {/if}
        {/each}
        <button type="button" class="px-6 py-2 mx-auto font-semibold text-xl text-indigo-600 dark:text-indigo-500 hover:text-indigo-500 hover:dark:text-indigo-600 rounded">+</button>
    </div>
    {#if !createWish && !createList && selectedList }
        <div class="mt-4 items-center w-full">
            <p class="mx-auto text-sm text-slate-700 dark:text-slate-400 text-center font-light">📚 {selectedList.description} {#if selectedList.due}· 🗓️ {selectedList.due} {/if}· <button>📝 Update</button></p>
            {#if wishes && wishes.length > 0}
                {#each wishes as wish}
                    <p>{wish.name}</p>
                {/each}
            {:else}
                <p>No wishes currently in this list</p>
            {/if}
            <div class="flex items-center w-full">
                <button type="button" onclick={() => createWish = true } class="px-6 py-2 mx-auto font-semibold text-sm text-indigo-600 dark:text-indigo-500 hover:text-indigo-500 hover:dark:text-indigo-600 rounded border-4 border-indigo-500 hover:border-indigo-600">Add Wish</button>
            </div>
        </div>
    {:else if createWish && selectedList}
        <div class="flex flex-col max-w-md gap-2 p-6 rounded-md shadow-md bg-gray-50 dark:bg-gray-800 dark:text-gray-800 mx-auto mt-8">
            <div class="flex justify-between">
                <h2 class="flex items-center gap-2 text-xl font-semibold leading-tight tracking-wide text-gray-900 dark:text-gray-100">
                    🎁 New Wish
                </h2>
                <button type="button" onclick={() => createWish = false } style="top: -4px;" class="relative pb-2 font-semibold text-xl text-indigo-600 dark:text-indigo-500 hover:text-indigo-500 hover:dark:text-indigo-600 rounded">𝘅</button>
            </div>
            <form method="POST" action="?/createwish">
                <p class="flex-1 text-sm text-slate-700 dark:text-slate-400 font-light">You can create a new wish for yourself or someone else, the wish will be added to the "{selectedList.name}" list.</p>
                <TextInput title="Wish" id="wish" placeholder="Book"></TextInput>
                <TextInput title="For" id="wishowner"></TextInput>
                <fieldset class="w-full space-y-1 text-slate-700 dark:text-slate-400">
                    <label for="price" class="block text-sm font-medium">Estimated price</label>
                    <div class="flex">
                        <input type="text" name="price" id="price" placeholder="25,00" class="peer flex flex-1 text-right focus:outline-none focus:border-indigo-400 sm:text-sm rounded-l-md focus:ring-0 border-gray-700 bg-gray-50 dark:bg-gray-800 ">
                        <span class="flex items-center px-3 pointer-events-none sm:text-sm rounded-r-md border border-gray-700 peer-focus:bg-indigo-400 peer-focus:dark:bg-indigo-600">€</span>
                    </div>
                </fieldset>
                <TextInput title="Description" id="wishdescription"></TextInput>
                <input type="hidden" id="wishlistId" name="wishlistId" value={selectedList.uuid}>
                <div class="flex flex-col justify-end gap-3 mt-6 sm:flex-row">
                    <button class="px-6 py-2 rounded-sm shadow-sm dark:bg-indigo-600 dark:text-gray-50">Create</button>
                </div>
            </form>
        </div>
    {:else if createList && selectedList}
        <div class="flex flex-col max-w-md gap-2 p-6 rounded-md shadow-md dark:bg-gray-50 dark:text-gray-800 mx-auto mt-8">
            <h2 class="flex items-center gap-2 text-xl font-semibold leading-tight tracking-wide">
                📋 New Wishlist
            </h2>
            <p class="flex-1 dark:text-gray-600">"</p>
            <div class="flex flex-col justify-end gap-3 mt-6 sm:flex-row">
                <button class="px-6 py-2 rounded-sm">No</button>
                <button class="px-6 py-2 rounded-sm shadow-sm dark:bg-violet-600 dark:text-gray-50">Yes</button>
            </div>
        </div>
    {/if}
</div>
<!--
<div class="prose">
    <h1>Welcome to Wishlist</h1>
    <p>You are logged in!</p>
    <p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
</div>
-->