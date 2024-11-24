<script>
    import TextInput from "$lib/TextInput.svelte";
    import CircularProgress from '$lib/CircularProgress.svelte';
	import Wishlists from '$lib/Wishlists.svelte';
	import CreateWish from "$lib/dialogs/CreateWish.svelte";
	import ShareWishlist from "$lib/dialogs/ShareWishlist.svelte";
	import UpdateWishlist from "$lib/dialogs/UpdateWishlist.svelte";
	import DeleteWishlist from "$lib/dialogs/DeleteWishlist.svelte";
	import UpdateWish from "$lib/dialogs/UpdateWish.svelte";
	import ReserveWish from "$lib/dialogs/ReserveWish.svelte";
	import DeleteWish from "$lib/dialogs/DeleteWish.svelte";

    import { page, navigating } from '$app/stores';
    import { goto } from '$app/navigation';
    import { enhance } from '$app/forms';
    import { fly, slide } from 'svelte/transition';
    import { onMount } from 'svelte';
	import CreateWishlist from "../../lib/dialogs/CreateWishlist.svelte";

	let { data, children, form } = $props();

    var selectedList = $state(null);
    let selectedWish = $state();

    var loading = $state(false);

    /*function updateSelected(wishlists) {
        selectedList = wishlists.find((l) => l.uuid == $page.params.listId);
    }*/

    function isApproved() {
        if (selectedList == null) {
            return true;
        }
        for (var u of data.shared) {
            if (u.wishlist_id == selectedList.uuid && u.user_id == data.user.id) {
                return u.approved;
            }
        }
        return true;
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
            <!--<button type="button" onclick={() => createList = true }  class="px-6 py-2 mx-auto font-semibold text-xl text-indigo-600 dark:text-indigo-500 hover:text-indigo-500 hover:dark:text-indigo-600 rounded">+</button>-->
            <!-- Create Wishlist -->
            <button aria-label="Add Wishlist" class="px-6 py-2 mx-auto font-semibold text-xl text-indigo-600 dark:text-indigo-500 hover:text-indigo-500 hover:dark:text-indigo-600 rounded" onclick={() => {createWishlistDialog.showModal();}}><ion-icon name="add-outline"></ion-icon></button>
            <dialog id="createWishlistDialog" class="modal">
                <div class="modal-box">
                    <form method="dialog">
                        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <CreateWishlist />
                </div>
            </dialog>
        </div>

        {#each data.wishlists as wishlist}
            {#if selectedList && wishlist.uuid == selectedList.uuid}
                <div class="flex gap-2 justify-center mt-1 italic text-sm text-slate-700 dark:text-slate-400 font-light">
                    {#if wishlist.description}
                        <p><ion-icon name="document-text-outline"></ion-icon> {wishlist.description}</p>
                    {/if}
                    {#if wishlist.due}
                        <p><ion-icon name="calendar-outline"></ion-icon> {new Date(wishlist.due).toDateString()}</p>
                    {/if}
                    {#if wishlist.shared_users.length > 0 }
                        <div class="flex gap-2">
                            <p><ion-icon name="people-outline"></ion-icon> Shared with: </p>
                            {#each wishlist.shared_users as user }
                                {#if user.approved }
                                    {#if user.id == data.user.id}
                                        <p class="">Me</p>
                                    {:else if user.id == wishlist.user_id }
                                        <p class="">{user.name} (Owner)</p>
                                    {:else }
                                        <p class="">{user.name}</p>
                                    {/if}
                                {:else}
                                    {#if user.id == data.user.id}
                                        <p class="">Me (Pending Approval)</p>
                                    {:else}
                                        <form method="POST" action="?/approveUser">
                                            <div class="flex text-amber-600 dark:text-amber-500">
                                                <p class="">{user.name}</p>
                                                <input type="hidden" id="listId" name="listId" value={selectedList.uuid}>
                                                <input type="hidden" id="userId" name="userId" value={user.id}>
                                                <button class="text-lime-500">✔</button>
                                            </div>
                                        </form>
                                    {/if}
                                {/if}
                            {/each}
                        </div>
                    {/if}
                </div>
                {#if isApproved()}
                    <div class="flex items-center w-full">
                        <!--<button type="button" onclick={() => createWish = true } class="px-6 py-2 mx-auto my-4 font-semibold text-sm text-indigo-600 dark:text-indigo-500 hover:text-indigo-500 hover:dark:text-indigo-600 rounded border-4 border-indigo-500 hover:border-indigo-600">Add Wish</button>-->
                        <button class="btn bg-indigo-500 text-white mx-auto my-4  hover:bg-indigo-600 hover:dark:bg-indigo-400" onclick={() => createWishDialog.showModal()}>Add Wish</button>
                        <dialog id="createWishDialog" class="modal">
                            <div class="modal-box">
                                <form method="dialog">
                                    <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                </form>
                                <CreateWish username={data.user.name} listId={selectedList.uuid} listName={selectedList.name}/>
                            </div>
                        </dialog>
                    </div>
                {/if}
            {/if}
            {#if selectedList && wishlist.uuid == selectedList.uuid}
                {#if !isApproved()}
                    <p class="italic text-sm text-slate-700 dark:text-slate-400 font-light text-center w-full my-4">The owner of the wishlist first has to approve you, before you can see items.</p>
                {:else if wishlist.items.length == 0}
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
                                            {#if wish.recipient != data.user.name}
                                                {#if !wish.reserved }
                                                     <!-- Reserve Wish -->
                                                    <button class="btn btn-outline btn-sm" onclick={() => {selectedWish = wish; reserveWishDialog.showModal();}}><ion-icon name="bookmark-outline"></ion-icon> Reserve</button>
                                                    <dialog id="reserveWishDialog" class="modal">
                                                        <div class="modal-box">
                                                            <form method="dialog">
                                                                <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                                            </form>
                                                            <ReserveWish wishName={wish.name} wishId={wish.id} />
                                                        </div>
                                                    </dialog>
                                                {:else }
                                                    <p class="text-sm text-slate-700 dark:text-slate-400 font-light pt-2">Reserved by: {getUserNameById(wishlist, wish.reserved_by)}</p>
                                                {/if}
                                            {/if}
                                            <!-- Update Wish -->
                                            <button class="btn btn-outline btn-sm" onclick={() => {selectedWish = wish; updateWishDialog.showModal();}}><ion-icon name="create-outline"></ion-icon> Update</button>
                                            <dialog id="updateWishDialog" class="modal">
                                                <div class="modal-box">
                                                    <form method="dialog">
                                                        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                                    </form>
                                                    <UpdateWish wishName={wish.name} wishId={wish.id} recipient={wish.recipient} price={wish.price} description={wish.description}/>
                                                </div>
                                            </dialog>
                                            <!-- Delete Wish -->
                                            <button class="btn btn-outline btn-sm btn-error" onclick={() => {selectedWish = wish; deleteWishDialog.showModal();}}><ion-icon name="trash-bin-outline"></ion-icon> Delete</button>
                                            <dialog id="deleteWishDialog" class="modal">
                                                <div class="modal-box">
                                                    <form method="dialog">
                                                        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                                    </form>
                                                    <DeleteWish wishName={wish.name} wishId={wish.id} bind:selectedWish={selectedWish}/>
                                                </div>
                                            </dialog>
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

        {#if selectedList && isApproved() }
            <div class="flex gap-4 justify-center mt-4">
                <!-- Share -->
                <button class="btn btn-outline border border-indigo-500 text-indigo-500 my-4 hover:border-indigo-600 hover:dark:border-indigo-400" onclick={() => shareWishDialog.showModal()}><ion-icon name="share-social-outline"></ion-icon> Share</button>
                <dialog id="shareWishDialog" class="modal">
                    <div class="modal-box">
                        <form method="dialog">
                            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        </form>
                        <ShareWishlist listId={selectedList.uuid}/>
                    </div>
                </dialog>
                {#if data.user.id == selectedList.user_id}
                    <!-- Update -->
                    <button class="btn btn-outline border border-indigo-500 text-indigo-500 my-4 hover:border-indigo-600 hover:dark:border-indigo-400" onclick={() => updateWishlistDialog.showModal()}><ion-icon name="create-outline"></ion-icon> Update</button>
                    <dialog id="updateWishlistDialog" class="modal">
                        <div class="modal-box">
                            <form method="dialog">
                                <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                            </form>
                            <UpdateWishlist listId={selectedList.uuid} listName={selectedList.name} listDescription={selectedList.description}/>
                        </div>
                    </dialog>
                    <!-- Delete -->
                    <button class="btn btn-outline border border-indigo-500 text-indigo-500 my-4 hover:border-indigo-600 hover:dark:border-indigo-400" onclick={() => deleteWishlistDialog.showModal()}><ion-icon name="trash-bin-outline"></ion-icon> Delete</button>
                    <dialog id="deleteWishlistDialog" class="modal">
                        <div class="modal-box">
                            <form method="dialog">
                                <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                            </form>
                            <DeleteWishlist listId={selectedList.uuid} listName={selectedList.name} bind:selectedList={selectedList}/>
                        </div>
                    </dialog>
                    <!--<button class="hover:text-indigo-500" onclick={() => updateList = true } ><ion-icon name="create-outline"></ion-icon> Update</button>
                    <button class="hover:text-indigo-500" onclick={() => deleteList = true }><ion-icon name="trash-bin-outline"></ion-icon> Delete</button>-->
                {/if}
            </div>
        {/if}

        {#if data.wishlists.length == 0}
            <div class="w-full text-center mx-auto mt-12">
                <h3 class="font-black text-xl text-gray-400 dark:text-gray-600">No Wishlists 😢</h3>
                <p>You don't have a wishlist yet, create a new one or join an existing one!</p>
                <button onclick={() => {createWishlistDialog.showModal();}} class="px-6 py-2 mx-auto my-4 font-semibold text-sm text-indigo-600 dark:text-indigo-500 hover:text-indigo-500 hover:dark:text-indigo-600 rounded border-4 border-indigo-500 hover:border-indigo-600">Create Wishlist</button>
            </div>
        {/if}
    <!--{:catch error}
        <p>error loading lists: {error.message}</p>
    {/await}-->
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


