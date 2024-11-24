<script>
	import '../app.css';
	let { children, data } = $props();

</script>


<div class="flex justify-between mx-4 mt-4">
	<div class="flex gap-4 ">
		<a href="/" class="hover:text-indigo-500 font-black">WishlistApp</a>
		{#if data.user != null }
			<a href="/wishlists" class="hover:text-indigo-500 font-light">Wishlists</a>
		{/if}
	</div>
	{#if data.user == null }
		<a href="/user/login" class="hover:text-indigo-500 font-light">Login</a>
	{:else }
		<div class="flex gap-4">
			<p class="font-light italic">Welcome, {data.user.name}</p>
			<div class="hover:text-indigo-500 font-light">
				<form method="POST" action="/user/logout?/logoutUser">
					<button >Logout</button>
				</form>
			</div>
		</div>
	{/if}
</div>

{@render children()}
