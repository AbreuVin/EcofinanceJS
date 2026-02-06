import { useQuery } from "@tanstack/react-query";
import { UnitService } from "../api/unit.service";
import { useAuthStore } from "@/store/authStore";
import { UserRole } from "@/types/enums";

export const unitKeys = {
    all: ["units"] as const,
};

export const useUnits = () => {
    const user = useAuthStore((state) => state.user);

    return useQuery({
        queryKey: unitKeys.all,
        queryFn: UnitService.getAll,
        select: (data) => {
            if (user?.role === UserRole.MASTER) return data;

            // Filtra unidades que pertencem à empresa do usuário logado
            if (user?.companyId) {
                return data.filter((u) => u.companyId === user.companyId);
            }

            return [];
        },
    });
};