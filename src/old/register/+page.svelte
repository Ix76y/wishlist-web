<script>
    import { onMount, tick } from 'svelte';
    import { goto } from '$app/navigation';
	import TextInput from '$lib/TextInput.svelte';

    let { data, form } = $props();

	let username = $state();
	let email = $state();
	let password = $state('');

    onMount(async () => {
        if (form?.success) { 
            goto('/login');
        }
    });

</script>

<div class="max-w-md gap-2 p-6 rounded-md shadow-md dark:bg-gray-50 dark:text-gray-800 mx-auto mt-8">
    <div class="mb-8 text-center">
        <h1 class="my-3 text-4xl font-bold">Register</h1>
        <p class="text-sm dark:text-gray-600">Create your account</p>
    </div>
    <form novalidate="" method="POST" class="space-y-12">
        <div class="space-y-4">
            <TextInput title="Email address" id="email" type="email"></TextInput>
            <TextInput title="Password" placeholder="********" id="password" type="password"></TextInput>
            <TextInput title="Nickname" id="username"></TextInput>
        </div>
        <div class="space-y-2">
            <div>
                <button type="submit" class="w-full px-8 py-3 font-semibold rounded-md dark:bg-violet-600 dark:text-gray-50">Sign up</button>
            </div>
            <p class="px-6 text-sm text-center dark:text-gray-600">Already have an account?
                <a rel="noopener noreferrer" href="/login" class="hover:underline dark:text-violet-600">Sign in</a>.
            </p>
        </div>
    </form>		
</div>

{#if form != null && !form?.success}
    <p>Error logging in!</p>
{/if}