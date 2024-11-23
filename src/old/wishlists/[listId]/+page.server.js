import { error } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

async function getWishes(token, listId) {
    const headers = new Headers();
	headers.append("Access-Control-Allow-Origin", "https://wishlist-api-sage.vercel.app");
    headers.append("Authorization", "Bearer " + token);

    const requestOptions = {
        method: "GET",
        headers: headers,
        redirect: "follow"
    };

    console.log(`Server: Getting wishes of wishlist: ${listId}`);
    return fetch(`https://wishlist-api-sage.vercel.app/lists/${listId}/items`, requestOptions).then((response) => response.json())
}

async function getUsers(token, listId) {
    const headers = new Headers();
	headers.append("Access-Control-Allow-Origin", "https://wishlist-api-sage.vercel.app");
    headers.append("Authorization", "Bearer " + token);

    const requestOptions = {
        method: "GET",
        headers: headers,
        redirect: "follow"
    };

    console.log(`Server: Getting users of wishlist: ${listId}`);
    return fetch(`https://wishlist-api-sage.vercel.app/lists/${listId}/user`, requestOptions).then((response) => response.json())
}

export async function load({ params, cookies }) {
    let token = cookies.get('token');
	console.log(`Server Main: Token from Cookies ${token}`);
	if (!token) {
		redirect(307, '/login');
	}

    return {
        wishes: await getWishes(token, params.listId),
        users: await getUsers(token, params.listId)
    }
    
    var data = null;
    await fetch(`https://wishlist-api-sage.vercel.app/lists/${params.listId}/items`, requestOptions) // https://wishlist-api-sage.vercel.app/token
        .then((response) => response.json())
        .then((result) => data = result)
        .catch((error) => {console.error(error); error(404)});

    console.log(`Date from API: ${JSON.stringify(data)}`);
    if (Array.isArray(data)) {
	    return { success: true, wishes: data }
    } else {
        error(404);
    }
}


export const actions = {
	createWish: async ({ cookies, request, params }) => {
        let token = cookies.get('token');
        console.log(`Server Main: Token from Cookies ${token}`);
        if (!token) {
            redirect(307, '/login');
        }

        const data = await request.formData();
		const name = data.get('wish');
		const recipient = data.get('wishowner');
		const price = data.get('price');
		const description = data.get('wishdescription');

        const headers = new Headers();
        headers.append("Access-Control-Allow-Origin", "https://wishlist-api-sage.vercel.app");
        headers.append("Authorization", "Bearer " + token);
        headers.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            name: name,
            description: description == "" ? null : description,
            recipient: recipient,
            price: price == "" ? null : parseFloat(price.replaceAll(",", ".")),
        });
    
        const requestOptions = {
            method: "POST",
            body: raw,
            headers: headers,
            redirect: "follow"
        };
    

		var r = null;
        console.log(`Making the request to the API to create a wish.`);
        const response = await fetch(`https://wishlist-api-sage.vercel.app/lists/${params.listId}/wish`, requestOptions) // https://wishlist-api-sage.vercel.app/token
            .then((response) => response.json())
            .then((result) => r = result)
            .catch((err) => {console.error(err); return { success: false, error: err } });
    
        console.log(`Date from API: ${JSON.stringify(r)}`);
        
        redirect(303, `/wishlists/${params.listId}`);
        //return {success: true}
	},

    updateWish: async ({ cookies, request, params }) => {
        let token = cookies.get('token');
        console.log(`Server Main: Token from Cookies ${token}`);
        if (!token) {
            redirect(307, '/login');
        }

        const data = await request.formData();
        const wishId = data.get('wishId');
		const name = data.get('wish');
		const recipient = data.get('wishowner');
		const price = data.get('price');
		const description = data.get('wishdescription');

        const headers = new Headers();
        headers.append("Access-Control-Allow-Origin", "https://wishlist-api-sage.vercel.app");
        headers.append("Authorization", "Bearer " + token);
        headers.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            name: name,
            description: description == "" ? null : description,
            recipient: recipient,
            price: price == "" ? null : parseFloat(price.replaceAll(",", ".")),
        });
    
        const requestOptions = {
            method: "PATCH",
            body: raw,
            headers: headers,
            redirect: "follow"
        };
    

		var r = null;
        console.log(`Server: Updating Wish`);
        const response = await fetch(`https://wishlist-api-sage.vercel.app/wishes/${wishId}`, requestOptions) // https://wishlist-api-sage.vercel.app/token
            .then((response) => response.json())
            .then((result) => r = result)
            .catch((err) => {console.error(err); return { success: false, error: err } });
    
        console.log(`Date from API: ${JSON.stringify(r)}`);
        
        redirect(303, `/wishlists/${params.listId}`);
        return {success: true}
	},

    reserveWish: async ({ cookies, request, params }) => {
        let token = cookies.get('token');
        console.log(`Server Main: Token from Cookies ${token}`);
        if (!token) {
            redirect(307, '/login');
        }

        const data = await request.formData();
        const wishId = data.get('wishId');
        const reserved = data.get('reserve')

        const headers = new Headers();
        headers.append("Access-Control-Allow-Origin", "https://wishlist-api-sage.vercel.app");
        headers.append("Authorization", "Bearer " + token);
        headers.append("Content-Type", "application/json");
    
        const requestOptions = {
            method: "PATCH",
            headers: headers,
            redirect: "follow"
        };
    

		var r = null;
        console.log(`Server: Reserving Wish: ${reserved}`);
        const response = await fetch(`https://wishlist-api-sage.vercel.app/wishes/${wishId}/reserve?reserved=${reserved}`, requestOptions) // https://wishlist-api-sage.vercel.app/token
            .then((response) => response.json())
            .then((result) => r = result)
            .catch((err) => {console.error(err); return { success: false, error: err } });
    
        console.log(`Date from API: ${JSON.stringify(r)}`);
        return {success: true}
	},

    deleteWish: async ({ cookies, request, params }) => {
        let token = cookies.get('token');
        console.log(`Server Main: Token from Cookies ${token}`);
        if (!token) {
            redirect(307, '/login');
        }

        const data = await request.formData();
        const wishId = data.get('wishId');

        const headers = new Headers();
        headers.append("Access-Control-Allow-Origin", "https://wishlist-api-sage.vercel.app");
        headers.append("Authorization", "Bearer " + token);
        headers.append("Content-Type", "application/json");
    
        const requestOptions = {
            method: "DELETE",
            headers: headers,
            redirect: "follow"
        };
    

		var r = null;
        console.log(`Server: Deleting Wish`);
        const response = await fetch(`https://wishlist-api-sage.vercel.app/wishes/${wishId}`, requestOptions) // https://wishlist-api-sage.vercel.app/token
            .then((response) => response.json())
            .then((result) => r = result)
            .catch((err) => {console.error(err); return { success: false, error: err } });
    
        console.log(`Date from API: ${JSON.stringify(r)}`);
        redirect(303, `/wishlists/${params.listId}`);
        return {success: true}
	}
};