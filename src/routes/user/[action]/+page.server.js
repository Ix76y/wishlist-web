import { redirect } from '@sveltejs/kit';
import { CREATE_KEY } from '$env/dynamic/private';

export const actions = {
    loginUser: async ({ cookies, request }) => {
        var r = null;
        const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');


        const headers = new Headers();
        headers.append("Access-Control-Allow-Origin", "https://wishlist-api-sage.vercel.app");
        //console.log(`From the Client: ${credentials}`);
        const formdata = new FormData();
        formdata.append("username", email);
        formdata.append("password", password);
        console.log(`Formdata -> ${formdata}`);
    
        const requestOptions = {
            method: "POST",
            body: formdata,
            headers: headers,
            redirect: "follow"
        };
    
        console.log(`Server: Getting user token`);
        const response = await fetch('https://wishlist-api-sage.vercel.app/token', requestOptions) // https://wishlist-api-sage.vercel.app/token
            .then((response) => response.json())
            .then((result) => r = result)
            .catch((err) => {console.error(err); return { success: false, error: err } });
    
        cookies.set('token', r.access_token, { path: '/', maxAge: 60 * 60 * 24 });
        redirect(303, '/wishlists')
        // return {success: true}
    },

    registerUser: async ({ request }) => {
        var r = null;
        const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');
        const username = data.get('username');
    
        const headers = new Headers();
        headers.append("Access-Control-Allow-Origin", "https://wishlist-api-sage.vercel.app");
        headers.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            email: email,
            name: username,
            password: password,
            secret: CREATE_KEY
        });
    
        const requestOptions = {
            method: "POST",
            body: raw,
            headers: headers,
            redirect: "follow"
        };
    
		var r = null;
        console.log(`Server: Creating a new user!`);
        const response = await fetch(`https://wishlist-api-sage.vercel.app/user`, requestOptions) // https://wishlist-api-sage.vercel.app/token
            .then((response) => response.json())
            .then((result) => r = result)
            .catch((err) => {console.error(err); return { success: false, error: err } });
    
        console.log(`Date from API: ${JSON.stringify(r)}`);
        
        return {success: true}
	},

    logoutUser: async ({ cookies, request }) => {
        cookies.delete('token', { path: '/' });
        redirect(303, '/');
	}
}