<script>
	import '../app.css';
	let { children, data } = $props();

</script>


<div class="flex justify-between mx-4 mt-4">
	<button>WishlistApp</button>
	{#if data.user == null }
		<a href="/user/login">Login</a>
	{:else }
		<div class="flex gap-4">
			<p>Welcome, {data.user.name}</p>
			<form method="POST" action="/user/logout?/logoutUser">
				<button>Logout</button>
			</form>
		</div>
	{/if}
</div>

{@render children()}
