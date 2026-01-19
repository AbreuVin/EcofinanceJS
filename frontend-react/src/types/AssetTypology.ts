import type { Unit } from "@/types/Unit.ts";
import type { User } from "@/types/User.ts";

export interface AssetTypology {
    id: number;
    unitId: number;
    sourceType: string;
    description: string;
    assetFields: string; // JSON string
    isActive: boolean;
    responsibleContactId: number | null;
    reportingFrequency: "Mensal" | "Anual";
    userContact: User;
    unit?: Unit;
}