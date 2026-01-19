import api from "@/api/api";
import type { User } from "@/types/User";
import type { UserFormValues } from "../schemas/user.schema";

export const UserService = {
    getAll: async (): Promise<User[]> => {
        const { data } = await api.get("/users");
        return data;
    },

    create: async (payload: UserFormValues): Promise<User> => {
        const { data } = await api.post("/users", payload);
        return data;
    },

    update: async (id: string, payload: UserFormValues): Promise<User> => {
        const { data } = await api.put(`/users/${id}`, payload);
        return data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/users/${id}`);
    },
};