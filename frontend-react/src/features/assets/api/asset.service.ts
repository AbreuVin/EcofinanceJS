import api from "@/api/api";
import type { AssetTypology } from "@/types/AssetTypology";
import type { AssetFormValues } from "../schemas/asset.schema";

const ENDPOINT = "/config/typologies";

export const AssetService = {
    getAll: async (): Promise<AssetTypology[]> => {
        const { data } = await api.get(ENDPOINT);
        return data;
    },

    create: async (payload: AssetFormValues): Promise<AssetTypology> => {
        const { data } = await api.post(ENDPOINT, payload);
        return data;
    },

    update: async (id: number, payload: AssetFormValues): Promise<AssetTypology> => {
        const { data } = await api.put(`${ENDPOINT}/${id}`, payload);
        return data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`${ENDPOINT}/${id}`);
    },
};