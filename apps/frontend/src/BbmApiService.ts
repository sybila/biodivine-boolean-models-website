import axios from 'axios';
import { BooleanModel, FileFormat } from './types.ts';

/**
 * During testing, the backend URL is determined by the `VITE_BACKEND_PORT` variable. For production, the URL
 * will be replaced by a script at startup time; hence we only use a `${BACKEND_URL}` placeholder.
 */
export const baseURL = import.meta.env.PROD
    ? '${BACKEND_URL}'
    : 'http://localhost:' + import.meta.env.VITE_BACKEND_PORT;

const axiosInstance = axios.create({
    baseURL: baseURL,
});

/**
 * Fetch the metadata of all BBM models.
 */
export const getAll = async (): Promise<BooleanModel[]> => {
    return (await axiosInstance.get(`/models`)).data?.data;
};

/**
 * Fetch the metadata of a single BBM model.
 */
export const getById = async (id: string): Promise<BooleanModel> => {
    return (await axiosInstance.get(`/models/${id}`)).data?.data;
};

/**
 * Fetch the `.aeon` file data from the API.
 */
export const getAeonData = async (id: string): Promise<string> => {
    return (await axiosInstance.get(getFileUrl(id, 'aeon'))).data;
};

/**
 * Return the API URL which returns raw model file data for the given model ID.
 */
export const getFileUrl = (id: string, format: FileFormat) => {
    return `/models/${id}/${format}`;
};
