<script>
    let { listId } = $props();

    let valueCopied = $state(false);


    function copyListId() {
        navigator.clipboard.writeText(listId);
        valueCopied = true;
    }
</script>

<h2 class="flex items-center gap-2 text-xl font-semibold leading-tight tracking-wide text-gray-900 dark:text-gray-100">
    📋 Share Wishlist
</h2>

<p class="flex-1 text-sm text-slate-700 dark:text-slate-400 font-light">Click on the code below to copy it and send it to anyone you would like to share this list with.</p>
<button class="cursor-copy p-2 border rounded w-full my-1" onclick={() => copyListId() }>
    <code>
        {listId}
    </code>
</button>
{#if valueCopied}
    <p class="flex-1 text-sm text-lime-600 dark:text-lime-400 font-light">Copied to clipboard</p>
{/if}