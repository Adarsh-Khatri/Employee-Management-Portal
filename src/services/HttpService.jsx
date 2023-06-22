import axios from "axios";

// const baseURL = 'http://localhost:2410';
const baseURL = 'https://employee-managment-portal.onrender.com';

function get(url) {
    return axios.get(baseURL + url)
}

function post(url, obj) {
    return axios.post(baseURL + url, obj)
}

function put(url, obj) {
    return axios.put(baseURL + url, obj)
}

function deleteApi(url) {
    return axios.delete(baseURL + url)
}


export { get, post, put, deleteApi }; 