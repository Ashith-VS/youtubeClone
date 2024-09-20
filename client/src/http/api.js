import axios from "axios";
import { baseUrl } from "./apiConfig";

let activeRequests = 0;

const networkRequest = async ({ url, method = 'GET', data = {}, headers = {} }, dispatch) => {
activeRequests++;
// dispatch(showLoader(true))

    const config = {
        url: baseUrl + url,
        method: method.toUpperCase(),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Accept-Language": "en",
            Authorization: localStorage.getItem('auth_token') ? `Bearer ${localStorage.getItem('auth_token')}` : null,
            ...headers,
        },
        data,
    };

    // console.log("config:", config);

return new Promise(async(resolve, reject) => {
    try {
        const response = await axios(config);
        resolve(response.data);
    } catch (error) {
        let errorMessage = 'An error occurred';
        if (error.response) {
            errorMessage = error.response.data.message || errorMessage;
            if (error.response.status === 401 || error.response.status === 403) {
                // Handle unauthorized access (e.g., logout user)
                logout();
            }
        } else if (error.request) {
            errorMessage = 'No response received from server';
        }
        else {
            errorMessage = error.message;
        }
        console.error(errorMessage); 
        reject(new Error(errorMessage));
    } finally {
        activeRequests--;
        // console.log(`Request finished. Active requests: ${activeRequests}`);
        if (activeRequests === 0) {
            // dispatch(showLoader(false));
        }
    }
})
}

const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.clear();
    window.location.reload();
};

export default networkRequest;