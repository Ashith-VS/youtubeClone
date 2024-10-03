import axios from "axios";
import { baseUrl, UrlEndPoint } from "./apiConfig";
import { useNavigate } from "react-router-dom";
const navigate=useNavigate
axios.defaults.withCredentials = true

let activeRequests = 0;

const networkRequest = async ({ url, method = 'GET', data = {}, headers = {} }, dispatch) => {
    activeRequests++;
    // dispatch(showLoader(true))
    const accessToken = localStorage.getItem('auth_token');

    const config = {
        url: baseUrl + url,
        method: method.toUpperCase(),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Accept-Language": "en",
            Authorization: accessToken ? `Bearer ${accessToken}` : null,
            ...headers,
        },
        data,

    };

    // console.log("config:", config);

    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios(config);
            resolve(response.data);
        } catch (error) {
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                const newAccessToken = await refreshAccessToken()
                if (newAccessToken) {
                    // console.log('newAccessToken: ', newAccessToken);
                    localStorage.setItem('auth_token', newAccessToken)
                    config.headers.Authorization = `Bearer ${newAccessToken}`;
                    const retryResponse = await axios(config);  // Retry the request with new token
                    resolve(retryResponse.data);
                } else {
                    // Handle expired token || unauthorized access 
                    logout();
                    navigate('/login')
                }
            }else{
                reject(new Error(error.message|| 'An error occurred'));
            }
        } finally {
            activeRequests--;
            // console.log(`Request finished. Active requests: ${activeRequests}`);
            if (activeRequests === 0) {
                // dispatch(showLoader(false));
            }
        }
    })
}

const refreshAccessToken = async () => {
    try {
        // Call your backend to refresh the access token
        const response = await axios.get(baseUrl + UrlEndPoint.refreshToken, { withCredentials: true })
        return response.data.accessToken;
    } catch (error) {
        console.error('Refresh token expired or invalid', error);
        throw new Error('Failed to refresh access token');
    }

};

const logout = async () => {
    try {
        const res = await axios.post(baseUrl + UrlEndPoint.logOut, {}, { withCredentials: true })
        console.log('reslogout: ', res);
        localStorage.removeItem('auth_token');
        // localStorage.clear();
        window.location.reload();
    } catch (error) {
        console.error(error)
    }
};

export default networkRequest;