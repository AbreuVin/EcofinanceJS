import type { User } from "./User";
import type { Unit } from "@/types/Unit.ts";

export interface Company {
    id: string;
    name: string;
    cnpj: string | null;
    createdAt: Date;
    // Relations
    users?: User[];
    units?: Unit[];
}