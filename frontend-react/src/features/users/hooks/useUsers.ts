import { useQuery } from "@tanstack/react-query";
import { UserService } from "../api/user.service";

export const userKeys = {
    all: ["users"] as const,
};

export const useUsers = () => {
    return useQuery({
        queryKey: userKeys.all,
        queryFn: UserService.getAll,
    });
};