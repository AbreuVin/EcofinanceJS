import type { ColumnDef } from "@tanstack/react-table";
import type { ColumnConfig } from "../hooks/useManagerConfig";
import { Badge } from "@/components/ui/badge";
import { Check, X, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("pt-BR");
};

export const generateColumns = (
    configColumns: ColumnConfig[],
    onEdit: (item: any) => void,
    onDelete: (item: any) => void
): ColumnDef<any>[] => {

    const generated: ColumnDef<any>[] = configColumns.map((col) => ({
        accessorKey: col.key, // This works for "company.name"
        header: col.label,
        // FIX: Use 'info' to get the value, not 'row.getValue'
        cell: (info) => {
            const value = info.getValue() as string | boolean | number | null;

            switch (col.type) {
                case 'boolean':
                    return value ? (
                        <div className="flex justify-start"><Check className="size-4 text-green-600" /></div>
                    ) : (
                        <div className="flex justify-start"><X className="size-4 text-red-400" /></div>
                    );

                case 'badge':
                    return (
                        <Badge variant={value === 'USER' ? 'secondary' : 'default'}>
                            {String(value)}
                        </Badge>
                    );

                case 'date':
                    return <span className="text-muted-foreground">{formatDate(String(value))}</span>;

                case 'email':
                    return <a href={`mailto:${value}`} className="text-blue-600 hover:underline">{String(value)}</a>;

                default:
                    return <span className="font-medium">{String(value ?? '-')}</span>;
            }
        }
    }));

    // Actions Column
    generated.push({
        id: "actions",
        cell: ({ row }) => {
            const item = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="size-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onEdit(item)}>
                            <Pencil className="mr-2 size-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(item)} className="text-red-600 focus:text-red-600">
                            <Trash className="mr-2 size-4" /> Excluir
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    });

    return generated;
};