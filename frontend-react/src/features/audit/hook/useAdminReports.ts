import { useQuery } from "@tanstack/react-query";
import { AdminReportService } from "../api/adminReport.service";

export const adminReportKeys = {
    all: ["adminReports"] as const,
    paginated: (sourceType: string, unitId: string, page: number, limit: number) =>
        [...adminReportKeys.all, sourceType, unitId, page, limit] as const,
    detail: (sourceType: string, reportId: number | null) =>
        [...adminReportKeys.all, "detail", sourceType, reportId] as const,
};

export const useAdminReports = (sourceType: string, unitId: string, page: number, limit: number) => {
    return useQuery({
        queryKey: adminReportKeys.paginated(sourceType, unitId, page, limit),
        queryFn: () => AdminReportService.getPaginated(sourceType, unitId, page, limit),
        enabled: !!unitId && !!sourceType,
    });
};

export const useAdminReportDetail = (sourceType: string, reportId: number | null) => {
    return useQuery({
        queryKey: adminReportKeys.detail(sourceType, reportId),
        queryFn: () => AdminReportService.getDetail(sourceType, reportId as number),
        // Task 4.6: O "Pulo do Gato". A query só dispara se existir um reportId! (Lazy fetch)
        enabled: !!reportId && !!sourceType,
    });
};