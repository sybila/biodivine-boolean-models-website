import { Model } from '../types/data.ts';
import axiosInstance from './base.ts';

export const getAll = async (): Promise<Model[]> => {
    const response = await axiosInstance.get(`/models`);
    return response.data?.data;
};

export const getSpecific = async (id: string): Promise<Model> => {
    const response = await axiosInstance.get(`/models/${id}`);
    return response.data?.data;
};
