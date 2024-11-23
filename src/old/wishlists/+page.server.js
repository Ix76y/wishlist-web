import { error } from '@sveltejs/kit';

export const actions = {
	createList: async ({ cookies, request }) => {
        let token = cookies.get('token');
        console.log(`Server Main: Token from Cookies ${token}`);
        if (!token) {
            redirect(307, '/login');
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


    joinList: async ({ cookies, request }) => {
        let token = cookies.get('token');
        console.log(`Server Main: Token from Cookies ${token}`);
        if (!token) {
            redirect(307, '/login');
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

    deleteList: async ({ cookies, request }) => {
        let token = cookies.get('token');
        console.log(`Server Main: Token from Cookies ${token}`);
        if (!token) {
            redirect(307, '/login');
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
	}
};
