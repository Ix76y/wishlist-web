import { error } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

async function getMe(token) {
    const headers = new Headers();
	headers.append("Access-Control-Allow-Origin", "https://wishlist-api-sage.vercel.app");
    headers.append("Authorization", "Bearer " + token);

    const requestOptions = {
        method: "GET",
        headers: headers,
        redirect: "follow"
    };
    var user = null;
    console.log(`Server: Get wishlists of user`);
    await fetch('https://wishlist-api-sage.vercel.app/user/me', requestOptions)
        .then((response) => response.json())
        .then((result) => user = result);
    // console.log(`User: ${JSON.stringify(user)}`);

    return user
}

export async function load({ cookies }) {
	let token = cookies.get('token');
	console.log(`Server Main: Token from Cookies ${token}`);
	if (!token) {
		return {'user': null}
	}
    return {user: await getMe(token) }
}