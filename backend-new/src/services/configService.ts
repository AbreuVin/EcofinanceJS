import * as configRepo from '../repositories/configRepository';
import { assetTypologySchema, managedOptionSchema } from '../schemas/esgSchemas';

// --- ASSET TYPOLOGIES ---

export const getTypologies = async (unitId?: number, sourceType?: string) => {
    return configRepo.findTypologies({ unitId, sourceType });
};

export const createTypology = async (rawData: unknown) => {
    // Zod handles validation AND the transformation of assetFields object -> JSON string
    const cleanData = assetTypologySchema.parse(rawData);

    // Type casting needed here because Zod output structure matches DB expectation
    // but Typescript might need a nudge to match Prisma generated types exactly
    return configRepo.createTypology(cleanData as any);
};

export const deleteTypology = async (id: number) => {
    return configRepo.deleteTypology(id);
};

// --- MANAGED OPTIONS ---

export const getOptions = async (fieldKey: string) => {
    return configRepo.findOptions(fieldKey);
};

export const createOption = async (rawData: unknown) => {
    const cleanData = managedOptionSchema.parse(rawData);
    return configRepo.createOption(cleanData as any);
};