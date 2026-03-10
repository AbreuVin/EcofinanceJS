import api from "@/api/api"; // Seguindo o padrão do seu asset.service.ts

// Tipagens
export interface CompanyWithCounts {
    id: string;
    name: string;
    cnpj?: string;
    _count: {
        units: number;
    };
}

export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface PaginatedCompaniesResponse {
    data: CompanyWithCounts[];
    meta: PaginationMeta;
}

const ENDPOINT = "/companies/admin"; // Ajuste se o prefixo da sua API for diferente

export const AdminCompanyService = {
    getPaginated: async (page: number, limit: number): Promise<PaginatedCompaniesResponse> => {
        const { data } = await api.get(`${ENDPOINT}?page=${page}&limit=${limit}`);
        return data;
    }
};