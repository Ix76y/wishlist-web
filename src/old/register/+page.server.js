import { redirect } from '@sveltejs/kit';
import { CREATE_KEY } from '$env/static/private';

export const actions = {
    default: async ({ request }) => {
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
	}
}