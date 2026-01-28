import api from "@/api/api";
import type { EsgModuleType } from "@/types/enums";

export interface EsgDataRecord {
    id: number;
    year: number;
    period: string; // "Janeiro", "Annual", etc.
    unitId: number;
    sourceDescription?: string; // We use this to link to AssetTypology
    [key: string]: any; // Dynamic fields like consumption, fuelType, etc.
}

const BASE_URL = "/esg/data";

export const DataEntryService = {
    // Fetch all records for a specific Module, Unit, and Year
    getByContext: async (
        module: EsgModuleType,
        unitId: number,
        year: number
    ): Promise<EsgDataRecord[]> => {
        const params = new URLSearchParams({
            unitId: String(unitId),
            year: String(year)
        });
        // Endpoint structure matches src/modules/esg/esg.routes.ts
        const { data } = await api.get(`${BASE_URL}/${module}?${params.toString()}`);
        return data;
    },

    // Create a single record
    create: async (module: EsgModuleType, payload: Partial<EsgDataRecord>) => {
        const { data } = await api.post(`${BASE_URL}/${module}`, payload);
        return data;
    },

    // Update a single record
    update: async (module: EsgModuleType, id: number, payload: Partial<EsgDataRecord>) => {
        const { data } = await api.put(`${BASE_URL}/${module}/${id}`, payload);
        return data;
    },

    // Delete a record
    delete: async (module: EsgModuleType, id: number) => {
        await api.delete(`${BASE_URL}/${module}/${id}`);
    }
};