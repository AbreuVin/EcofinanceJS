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

// Helper to format dates consistently
const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("pt-BR");
};

export const generateColumns = (
    configColumns: ColumnConfig[],
    onEdit: (item: any) => void,
    onDelete: (item: any) => void
): ColumnDef<any>[] => {

    // 1. Map dynamic columns from config
    const generated: ColumnDef<any>[] = configColumns.map((col) => ({
        accessorKey: col.key,
        header: col.label,
        cell: ({ row }) => {
            const value = row.getValue(col.key);

            switch (col.type) {
                case 'boolean':
                    return value ? (
                        <div className="flex justify-center"><Check className="size-4 text-green-600" /></div>
                    ) : (
                        <div className="flex justify-center"><X className="size-4 text-red-400" /></div>
                    );

                case 'badge':
                    // Simple logic: If value is 'ADMIN' or 'MASTER', color it.
                    // You can make this smarter later.
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

    // 2. Add the "Actions" column automatically
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