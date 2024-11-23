<script>
    import TextInput from '$lib/TextInput.svelte';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { page, navigating } from '$app/stores';
    import { enhance } from '$app/forms';
    import { fly, slide } from 'svelte/transition';

    let { data, form } = $props();

    let login = $state('');

	//let token = $state();
	let email = $state('');
	let password = $state('');
    let username = $state();

    onMount(async () => {
        login = $page.params.action == 'login';
        if (form?.success) { 
            login = true;
            //goto('/login');
        } 
    });

</script>

<div class="max-w-md gap-2 p-6 rounded-md shadow-md dark:bg-gray-50 dark:text-gray-800 mx-auto mt-8">
    {#if login }
        <div class="mb-8 text-center">
            <h1 class="my-3 text-4xl font-bold">Sign in</h1>
            <p class="text-sm dark:text-gray-600">Sign in to access your account</p>
        </div>
        <form novalidate="" method="POST" action="?/loginUser" use:enhance class="space-y-12">
            <div class="space-y-4">
                <div>
                    <label for="email" class="block mb-2 text-sm">Email address</label>
                    <input type="email" name="email" required id="email" value={email} placeholder="" class="w-full px-3 py-2 border rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800">
                </div>
                <div>
                    <div class="flex justify-between mb-2">
                        <label for="password" class="text-sm">Password</label>
                        <a rel="noopener noreferrer" href="#" class="text-xs hover:underline dark:text-gray-600">Forgot password?</a>
                    </div>
                    <input type="password" name="password" required id="password" bind:value={password} placeholder="" class="w-full px-3 py-2 border rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800">
                </div>
            </div>
            <div class="space-y-2">
                <div><!-- onclick={getToken} -->
                    <button type="submit" class="w-full px-8 py-3 font-semibold rounded-md dark:bg-violet-600 dark:text-gray-50">Sign in</button>
                </div>
            </div>
        </form>	
        <p class="px-6 text-sm text-center dark:text-gray-600">Don't have an account yet?
            <button onclick={() => login = false}  class="hover:underline dark:text-violet-600">Sign up</button>.
        </p>
    {:else }
        <div class="mb-8 text-center">
            <h1 class="my-3 text-4xl font-bold">Register</h1>
            <p class="text-sm dark:text-gray-600">Create your account</p>
        </div>
        <form novalidate="" method="POST" action="?/registerUser" class="space-y-12">
            <div class="space-y-4">
                <TextInput title="Email address" id="email" type="email" required></TextInput>
                <TextInput title="Password" placeholder="********" id="password" type="password" required></TextInput>
                <TextInput title="Nickname" id="username" required></TextInput>
            </div>
            <div class="space-y-2">
                <div>
                    <button type="submit" class="w-full px-8 py-3 font-semibold rounded-md dark:bg-violet-600 dark:text-gray-50">Sign up</button>
                </div>
            </div>
        </form>	
        <p class="px-6 text-sm text-center dark:text-gray-600">Already have an account?
            <button onclick={() => login = true }  class="hover:underline dark:text-violet-600">Sign in</button>.
        </p>
    {/if}
</div>

{#if form != null && !form?.success}
    <p>Error logging in!</p>
{/if}