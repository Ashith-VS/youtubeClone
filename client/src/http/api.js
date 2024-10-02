import axios from "axios";
import { baseUrl, UrlEndPoint } from "./apiConfig";

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
            let errorMessage = 'An error occurred';
            if (error.response) {
                errorMessage = error.response.data.message || errorMessage;
                if (error.response.status === 401 || error.response.status === 403) {
                   
                    //  console.log('newAccessToken: ', newAccessToken);
                    // Handle unauthorized access (e.g., logout user)
                    // logout();
                                        // // Attempt to refresh the access token
                                        // const newAccessToken = await fetchRefreshToken();
                                        // if (newAccessToken) {
                                        //     // Retry the original request with the new access token
                                        //     config.headers.Authorization = `Bearer ${newAccessToken}`;
                                        //     const retryResponse = await axios(config);
                                        //     resolve(retryResponse.data);
                                        // } else {
                                        //     // If refresh failed, log out
                                        //     logout();
                                        // }
                    
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


// const fetchRefreshToken = async()=>{
//     try {
//         const url =UrlEndPoint.refreshToken
//         // const res=await networkRequest({url,method:"post"})
//         // console.log('res: ', res);
        
//     } catch (error) {
//         console.error('Failed to refresh access token:', error);
//         logout(); // Log out the user if refresh fails
//         return null
//     }
// }

const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.clear();
    window.location.reload();
};

export default networkRequest;