import api from "@/api/api";

export interface UnitPaginated {
    id: number;
    name: string;
    city: string;
    state?: string;
    country: string;
    numberOfWorkers?: number;
}

export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface PaginatedUnitsResponse {
    data: UnitPaginated[];
    meta: PaginationMeta;
}

export const AdminUnitService = {
    getPaginated: async (companyId: string, page: number, limit: number, search: string = ""): Promise<PaginatedUnitsResponse> => {
        const { data } = await api.get(`/units/admin/companies/${companyId}?page=${page}&limit=${limit}&search=${search}`);
        return data;
    }
};