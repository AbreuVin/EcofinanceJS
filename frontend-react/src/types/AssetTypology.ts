import type { ReportingFrequency } from "@/types/enums.ts";
import type { Unit } from "@/types/Unit.ts";

export interface AssetTypology {
    id: number;
    unitId: number;
    sourceType: string;
    description: string;
    assetFields: string; // JSON string
    isActive: boolean;
    responsibleContactId: number | null;
    reportingFrequency: ReportingFrequency;
    unit?: Unit;
}