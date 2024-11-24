<script>
    import TextInput from '$lib/TextInput.svelte';
    import CircularProgress from '$lib/CircularProgress.svelte';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { page, navigating } from '$app/stores';
    import { enhance } from '$app/forms';
    import { fly, slide } from 'svelte/transition';

    let { data, form } = $props();

    let login = $state('');
    let loading = $state(false);

	//let token = $state();
	let email = $state('');
	let password = $state('');
    let username = $state();

    onMount(async () => {
        loading = false;
        login = $page.params.action == 'login';
        if (form?.success) { 
            login = true;
            //goto('/login');
        } 
    });

</script>

<div class="max-w-md gap-2 p-6 rounded-md shadow-md bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white mx-auto mt-8">
    {#if login }
        <div class="mb-8 text-center">
            <h1 class="my-3 text-4xl font-bold">Sign in</h1>
            <p class="text-sm text-gray-600 dark:text-gray-400">Sign in to access your account</p>
        </div>
        <form novalidate="" method="POST" action="?/loginUser" class="space-y-12" use:enhance={() => {
            loading = true;
            return async ({ update }) => {
                await update();
                // loading = false;
            }
        }}>
            <div class="space-y-4">
                
                <TextInput title="Email address" id="email" type="email" required></TextInput>
                <div>
                    <div class="flex justify-between mb-2">
                        <label for="password" class="text-sm">Password</label>
                        <a rel="noopener noreferrer" href="#" class="text-xs hover:underline dark:text-gray-600">Forgot password?</a>
                    </div>
                    <input type="password" name="password" required id="password" disabled={loading} bind:value={password} placeholder="" class="w-full focus:outline-none focus:border-indigo-400 sm:text-sm rounded-md focus:ring-0 border-gray-700 bg-zinc-50 dark:bg-zinc-800 autofill:bg-zinc-50 autofill:dark:bg-zinc-800">
                </div>
            </div>
            <div class="space-y-2">
                <div><!-- onclick={getToken} -->
                    {#if loading}
                        <CircularProgress/>
                    {:else}
                        <button type="submit" disabled={loading} class="w-full px-8 py-3 font-semibold rounded-md dark:bg-indigo-500 dark:text-gray-50">Sign in</button>
                    {/if}
                </div>
            </div>
        </form>	
        <p class="px-6 text-sm text-center text-gray-600 dark:text-gray-400">Don't have an account yet?
            <button onclick={() => login = false}  class="hover:underline text-indigo-600 dark:text-indigo-400">Sign up</button>.
        </p>
    {:else }
        <div class="mb-8 text-center">
            <h1 class="my-3 text-4xl font-bold">Register</h1>
            <p class="text-sm text-gray-600 dark:text-gray-4000">Create your account</p>
        </div>
        <form novalidate="" method="POST" action="?/registerUser" class="space-y-12">
            <div class="space-y-4">
                <TextInput title="Email address" id="email" type="email" required></TextInput>
                <TextInput title="Password" placeholder="********" id="password" type="password" required></TextInput>
                <TextInput title="Nickname" id="username" required></TextInput>
            </div>
            <div class="space-y-2">
                <div>
                    <button type="submit" class="w-full px-8 py-3 font-semibold rounded-md dark:bg-indigo-500 dark:text-gray-50">Sign up</button>
                </div>
            </div>
        </form>	
        <p class="px-6 text-sm text-center text-gray-600 dark:text-gray-400">Already have an account?
            <button onclick={() => login = true }  class="hover:underline text-indigo-600 dark:text-indigo-400">Sign in</button>.
        </p>
    {/if}
</div>

{#if form != null && !form?.success}
    <p>Error logging in!</p>
{/if}