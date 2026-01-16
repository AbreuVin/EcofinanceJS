import { useQuery } from "@tanstack/react-query";
import { CompanyService } from "../api/company.service";

export const companyKeys = {
    all: ["companies"] as const,
};

export const useCompanies = () => {
    return useQuery({
        queryKey: companyKeys.all,
        queryFn: CompanyService.getAll,
    });
};
