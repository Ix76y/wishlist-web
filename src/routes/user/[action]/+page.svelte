<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { page, navigating } from '$app/stores';
    import { enhance } from '$app/forms';
    import { fly, slide } from 'svelte/transition';

    let { data, form } = $props();

    // let login = $state(true);

	//let token = $state();
	let email = $state('iz@barracudabyte.com');
	let password = $state('');
    let username = $state();

    onMount(async () => {
        if (form?.success) { 
            goto('/login');
        } 
    });

</script>

<div class="max-w-md gap-2 p-6 rounded-md shadow-md dark:bg-gray-50 dark:text-gray-800 mx-auto mt-8">
    {#if $page.params.action == 'login' }
    <div class="mb-8 text-center">
        <h1 class="my-3 text-4xl font-bold">Sign in</h1>
        <p class="text-sm dark:text-gray-600">Sign in to access your account</p>
    </div>
    <form novalidate="" method="POST" action="?/loginUser" use:enhance class="space-y-12">
        <div class="space-y-4">
            <div>
                <label for="email" class="block mb-2 text-sm">Email address</label>
                <input type="email" name="email" id="email" value={email} placeholder="leroy@jenkins.com" class="w-full px-3 py-2 border rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800">
            </div>
            <div>
                <div class="flex justify-between mb-2">
                    <label for="password" class="text-sm">Password</label>
                    <a rel="noopener noreferrer" href="#" class="text-xs hover:underline dark:text-gray-600">Forgot password?</a>
                </div>
                <input type="password" name="password" id="password" bind:value={password} placeholder="*****" class="w-full px-3 py-2 border rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800">
            </div>
        </div>
        <div class="space-y-2">
            <div><!-- onclick={getToken} -->
                <button type="submit" class="w-full px-8 py-3 font-semibold rounded-md dark:bg-violet-600 dark:text-gray-50">Sign in</button>
            </div>
            <p class="px-6 text-sm text-center dark:text-gray-600">Don't have an account yet?
                <a rel="noopener noreferrer" href="/user/register" class="hover:underline dark:text-violet-600">Sign up</a>.
            </p>
        </div>
    </form>	
    {:else if $page.params.action == 'register' }
    <div class="mb-8 text-center">
        <h1 class="my-3 text-4xl font-bold">Register</h1>
        <p class="text-sm dark:text-gray-600">Create your account</p>
    </div>
    <form novalidate="" method="POST" action="?/registerUser" class="space-y-12">
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
                <a rel="noopener noreferrer" href="/user/login" class="hover:underline dark:text-violet-600">Sign in</a>.
            </p>
        </div>
    </form>	
    {/if}
</div>

{#if form != null && !form?.success}
    <p>Error logging in!</p>
{/if}