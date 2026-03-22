import api from "@/api/api"; // Ajuste o caminho se necessário

export interface ReportSummary {
    id: number;
    year: number;
    period: string;
    createdAt: string;
    // Opcionais que dependem do módulo, mas úteis na tabela
    consumption?: number;
    quantity?: number;
    distance?: number;
}

export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface PaginatedReportsResponse {
    data: ReportSummary[];
    meta: PaginationMeta;
}

export const AdminReportService = {
    // Task 4.1: Busca a lista leve com paginação
    getPaginated: async (sourceType: string, unitId: string, page: number, limit: number): Promise<PaginatedReportsResponse> => {
        // Assumindo que a rota base do seu esg.routes.ts seja /esg
        const { data } = await api.get(`/esg/data/admin/${sourceType}/units/${unitId}/reports?page=${page}&limit=${limit}`);
        return data;
    },

    // Task 4.2: Busca o payload completo e detalhado de um reporte
    getDetail: async (sourceType: string, reportId: number): Promise<any> => {
        const { data } = await api.get(`/esg/data/admin/${sourceType}/reports/${reportId}`);
        return data;
    },

    // Busca todos os reportes de uma fonte para TODAS as unidades de uma empresa
    getByCompany: async (sourceType: string, companyId: string): Promise<any[]> => {
        const { data } = await api.get(`/esg/data/admin/${sourceType}/companies/${companyId}/reports`);
        return data;
    },

    // Busca reportes de MÚLTIPLAS fontes para uma empresa (em paralelo)
    getAllSourcesByCompany: async (sourceTypes: string[], companyId: string) => {
        const results = await Promise.all(
            sourceTypes.map(async (sourceType) => {
                try {
                    const { data } = await api.get(`/esg/data/admin/${sourceType}/companies/${companyId}/reports`);
                    return { sourceType, data: data as any[] };
                } catch {
                    return { sourceType, data: [] as any[] };
                }
            })
        );
        return results;
    }
};