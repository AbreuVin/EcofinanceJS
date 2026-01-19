import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ESG_MODULES } from "@/types/enums";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PermissionsMatrixProps {
    value: string[];
    onChange: (value: string[]) => void;
}

export function PermissionsMatrix({ value = [], onChange }: PermissionsMatrixProps) {
    const handleToggle = (moduleValue: string, checked: boolean) => {
        if (checked) {
            onChange([...value, moduleValue]);
        } else {
            onChange(value.filter((v) => v !== moduleValue));
        }
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            onChange(ESG_MODULES.map((m) => m.value));
        } else {
            onChange([]);
        }
    };

    const isAllSelected = ESG_MODULES.length > 0 && value.length === ESG_MODULES.length;

    return (
        <div className="border rounded-md p-4 bg-muted/10">
            <div className="flex items-center justify-between mb-4 pb-2 border-b">
                <Label className="text-base font-semibold">Permissões de Módulos ESG</Label>
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="select-all"
                        checked={isAllSelected}
                        onCheckedChange={(checked) => handleSelectAll(!!checked)}
                    />
                    <Label htmlFor="select-all" className="cursor-pointer">Selecionar Todos</Label>
                </div>
            </div>

            <ScrollArea className="h-[200px] pr-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {ESG_MODULES.map((mod) => (
                        <div key={mod.value} className="flex items-center space-x-2">
                            <Checkbox
                                id={`perm-${mod.value}`}
                                checked={value.includes(mod.value)}
                                onCheckedChange={(checked) => handleToggle(mod.value, !!checked)}
                            />
                            <Label htmlFor={`perm-${mod.value}`} className="font-normal cursor-pointer text-muted-foreground">
                                {mod.label}
                            </Label>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}