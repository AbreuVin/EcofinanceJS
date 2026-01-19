import type { ColumnDef } from "@tanstack/react-table";
import { CheckCircle2, MoreHorizontal, Pencil, Trash, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { AssetTypology } from "@/types/AssetTypology";
import { ESG_MODULES } from "@/types/enums";

interface AssetColumnsProps {
    onEdit: (asset: AssetTypology) => void;
    onDelete: (asset: AssetTypology) => void;
}

export const getAssetColumns = ({ onEdit, onDelete }: AssetColumnsProps): ColumnDef<AssetTypology>[] => [
    {
        accessorKey: "description",
        header: "Descrição / Identificação",
        cell: ({ row }) => <span className="font-medium">{row.original.description}</span>,
    },
    {
        accessorKey: "sourceType",
        header: "Tipo de Fonte",
        cell: ({ row }) => {
            const typeValue = row.original.sourceType;
            const moduleOpt = ESG_MODULES.find((m) => m.value === typeValue);
            return (
                <Badge variant="outline" className="font-normal">
                    {moduleOpt ? moduleOpt.label : typeValue}
                </Badge>
            );
        },
    },
    {
        accessorKey: "unit.name",
        header: "Unidade",
        cell: ({ row }) => row.original.unit?.name || <span className="text-muted-foreground">-</span>,
    },
    {
        accessorKey: "userContact.name",
        header: "Responsável",
        cell: ({ row }) => row.original.userContact?.name || <span className="text-muted-foreground">-</span>,
    },
    {
        accessorKey: "reportingFrequency",
        header: "Frequência",
        cell: ({ row }) => (
            <span className="capitalize">{row.original.reportingFrequency}</span>
        ),
    },
    {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                {row.original.isActive ? (
                    <>
                        <CheckCircle2 className="size-4 text-green-600"/>
                        <span className="text-xs text-muted-foreground">Ativo</span>
                    </>
                ) : (
                    <>
                        <XCircle className="size-4 text-red-500"/>
                        <span className="text-xs text-muted-foreground">Inativo</span>
                    </>
                )}
            </div>
        ),
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const asset = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Menu</span>
                            <MoreHorizontal className="size-4"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onEdit(asset)} className="cursor-pointer">
                            <Pencil className="mr-2 size-4"/> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => onDelete(asset)}
                            className="text-destructive focus:text-destructive cursor-pointer"
                        >
                            <Trash className="mr-2 size-4"/> Excluir
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];