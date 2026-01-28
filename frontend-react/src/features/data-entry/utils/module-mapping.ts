import { ESG_MODULES, type EsgModuleType } from "@/types/enums";

export const normalizeSlugToType = (slug: string): EsgModuleType | null => {
    const directMatch = ESG_MODULES.find(m => m.value === slug);
    if (directMatch) return directMatch.value;

    const snakeCase = slug.replace(/-/g, '_');
    const convertedMatch = ESG_MODULES.find(m => m.value === snakeCase);

    return convertedMatch ? convertedMatch.value : null;
};

export const getModuleLabel = (type: EsgModuleType): string => {
    return ESG_MODULES.find(m => m.value === type)?.label || type;
};