import axios from "axios";

const axiosInstance = axios.create({
    baseURL: '${BACKEND_URL}',
});

export default axiosInstance;
