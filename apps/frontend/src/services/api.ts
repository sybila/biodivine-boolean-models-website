import { BooleanModel } from '@database/generated/client';
import axiosInstance from './base.ts';

export const getAll = async (): Promise<BooleanModel[]> => {
    const response = await axiosInstance.get(`/models`);
    return response.data?.data;
};

export const getSpecific = async (id: string): Promise<BooleanModel> => {
    const response = await axiosInstance.get(`/models/${id}`);
    return response.data?.data;
};
