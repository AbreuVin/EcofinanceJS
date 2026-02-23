import type { Unit } from "@/types/Unit.ts";
import type { User } from "@/types/User.ts";
import type { Company } from "@/types/Company.ts";

export interface AssetTypology {
    id: number;
    companyId: string;
    sourceType: string;
    description: string;
    assetFields: string | Record<string, any>; // JSON string
    isActive: boolean;
    responsibleContactId: string | undefined;
    reportingFrequency: "Mensal" | "Anual";
    // Rastreabilidade Interna
    traceabilityResponsible?: string;
    traceabilityEmail?: string;
    traceabilitySector?: string;
    traceabilityLocation?: string;
    // Relacionamentos
    units?: { unit: Unit; unitId: number }[];
    userContact: User;
    company?: Company;
}