import { error } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

async function getWishlists(token) {
    const headers = new Headers();
	headers.append("Access-Control-Allow-Origin", "https://wishlist-api-sage.vercel.app");
    headers.append("Authorization", "Bearer " + token);

    const requestOptions = {
        method: "GET",
        headers: headers,
        redirect: "follow"
    };

    console.log(`Server: Get wishlists of user`);
    return fetch('https://wishlist-api-sage.vercel.app/lists?filter=combined', requestOptions).then((response) => response.json())
}

export async function load({ cookies }) {
	let token = cookies.get('token');
	console.log(`Server Main: Token from Cookies ${token}`);
	if (!token) {
		redirect(307, '/login');
	}

    return {'wishlists': await getWishlists(token) }
    
    /*await fetch('https://wishlist-api-sage.vercel.app/lists?filter=combined', requestOptions) // https://wishlist-api-sage.vercel.app/token
        .then((response) => response.json())
        .then((result) => data = result)
        .catch((error) => {console.error(error); error(404)});

    console.log(`Data from API: ${JSON.stringify(data)}`);
	
    if (Array.isArray(data)) {
	    return {'wishlists': data} ;
    } else {
        //cookies.delete('token', { path: '/' });
        return error(404);
    }
    */
}

