import axiosInstance from "../services/base";
import {Model} from "../types/data";

export const getAll = async (): Promise<Model[]> => {
    const response = await axiosInstance.get(`/models`);
    return response.data?.data;

}

export const getSpecific = async (id: string): Promise<Model> => {
    const response = await axiosInstance.get(`/models/${id}`);
    return response.data?.data;
}
