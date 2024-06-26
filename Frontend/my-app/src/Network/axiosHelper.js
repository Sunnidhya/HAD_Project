import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8080'
axios.defaults.headers.post["Content-type"] = 'application/json'

export const getAuthToken = () => {
    return window.localStorage.getItem("authentication_token");
}

export const setAuthToken = (token) => {
    window.localStorage.setItem("authentication_token", token)
}

export const request = (method, url, data) => {
    let headerVal = {}
    if(getAuthToken() !== null && getAuthToken() !== "null"){
        headerVal = {"Authorization":`Bearer ${getAuthToken()}`}
    }
    return axios({
        method: method,
        headers: headerVal,
        url: url,
        data: data
    })
};