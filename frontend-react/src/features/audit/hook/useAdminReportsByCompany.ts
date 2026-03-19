import { useQuery } from "@tanstack/react-query";
import { AdminReportService } from "../api/adminReport.service";

export const adminReportsByCompanyKeys = {
    all: ["adminReportsByCompany"] as const,
    byCompany: (sourceType: string, companyId: string) =>
        [...adminReportsByCompanyKeys.all, sourceType, companyId] as const,
};

export const useAdminReportsByCompany = (sourceType: string, companyId: string) => {
    return useQuery({
        queryKey: adminReportsByCompanyKeys.byCompany(sourceType, companyId),
        queryFn: () => AdminReportService.getByCompany(sourceType, companyId),
        enabled: !!sourceType && !!companyId,
    });
};
