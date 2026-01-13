import { useAuthStore } from "@/store/authStore.ts";
import { useMutation } from "@tanstack/react-query";
import api from "@/api/api.ts";
import type { User } from "@/types/User.ts";

export const useLogin = () => {
    const login = useAuthStore((state) => state.login);

    return useMutation({
        mutationFn: async (credentials: { email: string; password: string }) => {
            const { data } = await api.post('/auth/login', credentials);
            return data;
        },
        onSuccess: (data: { token: string, user: User}) => {
            login(data.token, data.user);
        }
    })
}