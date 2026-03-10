import { useQuery } from "@tanstack/react-query";
import { AdminCompanyService } from "../api/adminCompany.service";

export const adminCompanyKeys = {
    all: ["adminCompanies"] as const,
    paginated: (page: number, limit: number) => [...adminCompanyKeys.all, page, limit] as const,
};

export const useAdminCompanies = (page: number, limit: number) => {
    return useQuery({
        queryKey: adminCompanyKeys.paginated(page, limit),
        queryFn: () => AdminCompanyService.getPaginated(page, limit),
    });
};