import { useQuery } from "@tanstack/react-query";
import { AdminUnitService } from "../api/adminUnit.service";

export const adminUnitKeys = {
    all: ["adminUnits"] as const,
    paginated: (companyId: string, page: number, limit: number, search: string) =>
        [...adminUnitKeys.all, companyId, page, limit, search] as const,
};

export const useAdminUnits = (companyId: string, page: number, limit: number, search: string) => {
    return useQuery({
        queryKey: adminUnitKeys.paginated(companyId, page, limit, search),
        queryFn: () => AdminUnitService.getPaginated(companyId, page, limit, search),
        enabled: !!companyId, // Só roda se tiver o ID da empresa
    });
};