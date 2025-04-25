import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.PROD ? '${BACKEND_URL}' : 'http://localhost:' + import.meta.env.VITE_BACKEND_PORT,
});

export default axiosInstance;
