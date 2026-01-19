import api from "@/api/api";
import type { Company } from "@/types/Company";
import type { CompanyFormValues } from "../schemas/company.schema";

export const CompanyService = {
    getAll: async (): Promise<Company[]> => {
        const { data } = await api.get("/companies");
        return data;
    },

    create: async (payload: CompanyFormValues): Promise<Company> => {
        const { data } = await api.post("/companies", payload);
        return data;
    },

    update: async (id: string, payload: CompanyFormValues): Promise<Company> => {
        const { data } = await api.put(`/companies/${id}`, payload);
        return data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/companies/${id}`);
    },
};