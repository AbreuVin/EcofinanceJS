import type { Unit } from "@/types/Unit.ts";
import type { User } from "@/types/User.ts";
import type { Company } from "@/types/Company.ts";

export interface AssetTypology {
    id: number;
    companyId: string;
    unitId: number | null;
    sourceType: string;
    description: string;
    assetFields: string | Record<string, any>; // JSON string
    isActive: boolean;
    responsibleContactId: string | undefined;
    reportingFrequency: "Mensal" | "Anual";
    userContact: User;
    unit?: Unit;
    company?: Company;
}