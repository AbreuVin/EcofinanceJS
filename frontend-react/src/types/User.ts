import type { UserRole } from "@/types/enums.ts";
import type { Company } from "@/types/Company.ts";
import type { Unit } from "@/types/Unit.ts";

export interface User {
    id: string;
    email: string;
    name: string;
    phone: string | null;
    role: UserRole;

    // Multi-tenancy & Hierarchy
    companyId: string | null;
    unitId: number | null;
    parentId: string | null;

    // Relations
    company?: Company | null;
    unit?: Unit | null;
    parent?: User | null;
    children?: User[];
    permissions?: UserPermission[];

    createdAt: Date;
    updatedAt: Date;
}

export interface UserPermission {
    id: string;
    userId: string;
    sourceType: string;
    user?: User;
}