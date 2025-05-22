import axios from "axios"
// const axios = require('axios');

const api = axios.create({
    baseURL: import.meta.env.PROD ? '/api' : import.meta.env.VITE_BASE_API,
    withCredentials: true
});

// module.exports = api;
export default api;