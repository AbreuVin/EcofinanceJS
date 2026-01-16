import api from "@/api/api";
import type { Unit } from "@/types/Unit";
import type { UnitFormValues } from "../schemas/unit.schema";

export const UnitService = {
    getAll: async (): Promise<Unit[]> => {
        const { data } = await api.get("/units");
        return data;
    },

    create: async (payload: UnitFormValues): Promise<Unit> => {
        const { data } = await api.post("/units", payload);
        return data;
    },

    update: async (id: number | string, payload: UnitFormValues): Promise<Unit> => {
        const { data } = await api.put(`/units/${id}`, payload);
        return data;
    },

    delete: async (id: number | string): Promise<void> => {
        await api.delete(`/units/${id}`);
    },
};