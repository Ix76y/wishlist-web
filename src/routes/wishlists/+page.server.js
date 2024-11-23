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
    return fetch('https://wishlist-api-sage.vercel.app/lists/all', requestOptions).then((response) => response.json())
}

export async function load({ cookies }) {
	let token = cookies.get('token');
	console.log(`Server Main: Token from Cookies ${token}`);
	if (!token || token == null) {
		redirect(307, '/login');
	}
    let data = await getWishlists(token);
    let shared = data.shared;
    for (var wishlist of data.wishlists) {
        for (var user of wishlist.shared_users) {
            let x = shared.find((u) => u.user_id == user.id && u.wishlist_id == wishlist.uuid);
            user['approved'] = x.approved;
        }
    }
    return data;
}


export const actions = {
	createList: async ({ cookies, request }) => {
        let token = cookies.get('token');
        console.log(`Server Main: Token from Cookies ${token}`);
        if (!token) {
            redirect(307, '/user/login');
        }

        const data = await request.formData();
		const name = data.get('wishlist');
		const description = data.get('description');

        const headers = new Headers();
        headers.append("Access-Control-Allow-Origin", "https://wishlist-api-sage.vercel.app");
        headers.append("Authorization", "Bearer " + token);
        headers.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            name: name,
            description: description,
            due: null
        });
    
        const requestOptions = {
            method: "POST",
            body: raw,
            headers: headers,
            redirect: "follow"
        };
    

		var r = null;
        console.log(`Making the request to the API to create a list.`);
        const response = await fetch('https://wishlist-api-sage.vercel.app/lists/', requestOptions) // https://wishlist-api-sage.vercel.app/token
            .then((response) => response.json())
            .then((result) => r = result)
            .catch((err) => {console.error(err); return { success: false, error: err } });
    
        console.log(`Date from API: ${JSON.stringify(r)}`);
        
        return {success: true}
	},


	updateList: async ({ cookies, request }) => {
        let token = cookies.get('token');
        console.log(`Server Main: Token from Cookies ${token}`);
        if (!token) {
            redirect(307, '/user/login');
        }

        const data = await request.formData();
		const name = data.get('wishlist');
		const description = data.get('description');
        const listId = data.get('listId');

        const headers = new Headers();
        headers.append("Access-Control-Allow-Origin", "https://wishlist-api-sage.vercel.app");
        headers.append("Authorization", "Bearer " + token);
        headers.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            name: name,
            description: description,
            due: null
        });
    
        const requestOptions = {
            method: "PATCH",
            body: raw,
            headers: headers,
            redirect: "follow"
        };
    

		var r = null;
        console.log(`Making the request to the API to create a list.`);
        const response = await fetch(`https://wishlist-api-sage.vercel.app/lists/${listId}`, requestOptions) // https://wishlist-api-sage.vercel.app/token
            .then((response) => response.json())
            .then((result) => r = result)
            .catch((err) => {console.error(err); return { success: false, error: err } });
    
        console.log(`Date from API: ${JSON.stringify(r)}`);
        
        return {success: true}
	},


    joinList: async ({ cookies, request }) => {
        let token = cookies.get('token');
        console.log(`Server Main: Token from Cookies ${token}`);
        if (!token) {
            redirect(307, '/user/login');
        }

        const data = await request.formData();
		const listId = data.get('sharedWishlist');

        const headers = new Headers();
        headers.append("Access-Control-Allow-Origin", "https://wishlist-api-sage.vercel.app");
        headers.append("Authorization", "Bearer " + token);
    
        const requestOptions = {
            method: "PUT",
            headers: headers,
            redirect: "follow"
        };
    

		var r = null;
        console.log(`Server: Adding user to shared list.`);
        const response = await fetch(`https://wishlist-api-sage.vercel.app/lists/${listId}/user`, requestOptions) // https://wishlist-api-sage.vercel.app/token
            .then((response) => response.json())
            .then((result) => r = result)
            .catch((err) => {console.error(err); return { success: false, error: err } });
    
        console.log(`Data from API: ${JSON.stringify(r)}`);
        
        return {success: true}
	},

    approveUser: async ({ cookies, request }) => {
        let token = cookies.get('token');
        console.log(`Server Main: Token from Cookies ${token}`);
        if (!token) {
            redirect(307, '/user/login');
        }

        const data = await request.formData();
		const listId = data.get('listId');
		const userId = data.get('userId');

        const headers = new Headers();
        headers.append("Access-Control-Allow-Origin", "https://wishlist-api-sage.vercel.app");
        headers.append("Authorization", "Bearer " + token);
    
        const requestOptions = {
            method: "PATCH",
            headers: headers,
            redirect: "follow"
        };
    

		var r = null;
        console.log(`Server: Approving user to list.`);
        const response = await fetch(`https://wishlist-api-sage.vercel.app/lists/${listId}/user/${userId}`, requestOptions) // https://wishlist-api-sage.vercel.app/token
            .then((response) => response.json())
            .then((result) => r = result)
            .catch((err) => {console.error(err); return { success: false, error: err } });
    
        console.log(`Data from API: ${JSON.stringify(r)}`);
        
        return {success: true}
	},

    deleteList: async ({ cookies, request }) => {
        let token = cookies.get('token');
        console.log(`Server Main: Token from Cookies ${token}`);
        if (!token) {
            redirect(307, '/user/login');
        }

        const data = await request.formData();
		const listId = data.get('listId');

        const headers = new Headers();
        headers.append("Access-Control-Allow-Origin", "https://wishlist-api-sage.vercel.app");
        headers.append("Authorization", "Bearer " + token);
    
        const requestOptions = {
            method: "DELETE",
            headers: headers,
            redirect: "follow"
        };
    

		var r = null;
        console.log(`Server: Deleting Wishlist: ${listId}`);
        const response = await fetch(`https://wishlist-api-sage.vercel.app/lists/${listId}`, requestOptions) // https://wishlist-api-sage.vercel.app/token
            .then((response) => {var l = response.json(); console.log(`DATA: ${l}`); return l;})
            .then((result) => r = result)
            .catch((err) => {console.error(err); return { success: false, error: err } });
    
        console.log(`Data from API: ${JSON.stringify(r)}`);
        return {success: true}
	},

    createWish: async ({ cookies, request, params }) => {
        let token = cookies.get('token');
        console.log(`Server Main: Token from Cookies ${token}`);
        if (!token) {
            redirect(307, '/user/login');
        }

        const data = await request.formData();
		const listId = data.get('listId');
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
        console.log(`Server: Creating a wish`);
        const response = await fetch(`https://wishlist-api-sage.vercel.app/lists/${listId}/wish`, requestOptions) // https://wishlist-api-sage.vercel.app/token
            .then((response) => response.json())
            .then((result) => r = result)
            .catch((err) => {console.error(err); return { success: false, error: err } });
    
        console.log(`Date from API: ${JSON.stringify(r)}`);
        
        //redirect(303, `/wishlists/${params.listId}`);
        return {success: true}
	},

    updateWish: async ({ cookies, request, params }) => {
        let token = cookies.get('token');
        console.log(`Server Main: Token from Cookies ${token}`);
        if (!token) {
            redirect(307, '/user/login');
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
        
        //redirect(303, `/wishlists/${params.listId}`);
        return {success: true}
	},

    reserveWish: async ({ cookies, request, params }) => {
        let token = cookies.get('token');
        console.log(`Server Main: Token from Cookies ${token}`);
        if (!token) {
            redirect(307, '/user/login');
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
            redirect(307, '/user/login');
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
        console.log(`Server: Deleting Wish ${wishId}`);
        const response = await fetch(`https://wishlist-api-sage.vercel.app/wishes/${wishId}`, requestOptions) // https://wishlist-api-sage.vercel.app/token
            .then((response) => response.json())
            .then((result) => r = result)
            .catch((err) => {console.error(err); return { success: false, error: err } });
    
        console.log(`Date from API: ${JSON.stringify(r)}`);
        // redirect(303, `/wishlists/${params.listId}`);
        return {success: true}
	}
};
