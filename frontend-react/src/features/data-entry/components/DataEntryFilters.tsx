import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { useUnits } from "@/features/units/hooks/useUnits.ts";

interface DataEntryFiltersProps {
    year: number;
    unitId: string;
    onYearChange: (y: number) => void;
    onUnitChange: (u: string) => void;
}

export function DataEntryFilters({ year, unitId, onYearChange, onUnitChange }: DataEntryFiltersProps) {
    const { data: units = [] } = useUnits();
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i); // [2026, 2025, ...]

    return (
        <div className="flex gap-3">
            <div className="w-[180px]">
                <Select value={String(year)} onValueChange={(v) => onYearChange(Number(v))}>
                    <SelectTrigger>
                        <SelectValue placeholder="Ano" />
                    </SelectTrigger>
                    <SelectContent>
                        {years.map(y => (
                            <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="w-[250px]">
                <Select value={unitId} onValueChange={onUnitChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="Todas as Unidades" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all_units">Todas as Unidades</SelectItem>
                        {units.map(u => (
                            <SelectItem key={u.id} value={String(u.id)}>{u.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}