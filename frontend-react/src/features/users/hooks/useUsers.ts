import { useQuery } from "@tanstack/react-query";
import { UserService } from "../api/user.service";
import { useAuthStore } from "@/store/authStore";
import { UserRole } from "@/types/enums";

export const userKeys = {
    all: ["users"] as const,
};

export const useUsers = () => {
    const user = useAuthStore((state) => state.user);

    return useQuery({
        queryKey: userKeys.all,
        queryFn: UserService.getAll,
        select: (data) => {
            if (user?.role === UserRole.MASTER) return data;

            // Filtra usuários da mesma empresa
            if (user?.companyId) {
                return data.filter((u) => u.companyId === user.companyId);
            }

            return [];
        },
    });
};