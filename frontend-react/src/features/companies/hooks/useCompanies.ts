import { useQuery } from "@tanstack/react-query";
import { CompanyService } from "../api/company.service";
import { useAuthStore } from "@/store/authStore";
import { UserRole } from "@/types/enums";

export const companyKeys = {
    all: ["companies"] as const,
};

export const useCompanies = () => {
    const user = useAuthStore((state) => state.user);

    return useQuery({
        queryKey: companyKeys.all,
        queryFn: CompanyService.getAll,
        select: (data) => {
            if (user?.role === UserRole.MASTER) return data;
            
            if (user?.companyId) {
                return data.filter((c) => c.id === user.companyId);
            }
            
            return [];
        },
    });
};
