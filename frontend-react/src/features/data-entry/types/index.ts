export interface DataEntryRecord {
    id?: number;
    assetId: number;
    year: number;
    month?: number; // 1-12 (Optional if annual)
    value: number;
    unit: string; // The unit used (e.g., "Litros") - snapshot for history
    evidenceUrl?: string; // For file uploads later
    status: "draft" | "submitted" | "approved";
}

// Helper type for the Grid (Front-end state)
export type AssetEntryGrid = {
    [assetId: number]: {
        [month: number]: number | string; // Month 1-12, or 0 for Annual
    };
};

export interface DataEntryFilters {
    unitId: string;
    year: string;
}