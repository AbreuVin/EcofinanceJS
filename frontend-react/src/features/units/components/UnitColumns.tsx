import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Unit } from "@/types/Unit";

interface UnitColumnsProps {
    onEdit: (unit: Unit) => void;
    onDelete: (unit: Unit) => void;
}

export const getUnitColumns = ({ onEdit, onDelete }: UnitColumnsProps): ColumnDef<Unit>[] => [
    {
        accessorKey: "name",
        header: "Unidade",
        cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    {
        // Deep accessor for the related company name
        accessorKey: "company.name",
        header: "Empresa",
        cell: ({ row }) => row.original.company?.name || <span className="text-muted-foreground">-</span>,
    },
    {
        accessorKey: "city",
        header: "Localização",
        cell: ({ row }) => `${row.original.city}/${row.original.state}`,
    },
    {
        accessorKey: "numberOfWorkers",
        header: "Colaboradores",
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const unit = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menu</span>
                            <MoreHorizontal className="size-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onEdit(unit)} className="cursor-pointer">
                            <Pencil className="mr-2 size-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => onDelete(unit)}
                            className="text-destructive focus:text-destructive cursor-pointer"
                        >
                            <Trash className="mr-2 size-4" /> Excluir
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];