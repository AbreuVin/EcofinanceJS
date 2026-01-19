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
import type { Company } from "@/types/Company";

interface CompanyColumnsProps {
    onEdit: (company: Company) => void;
    onDelete: (company: Company) => void;
}

export const getCompanyColumns = ({
                                      onEdit,
                                      onDelete,
                                  }: CompanyColumnsProps): ColumnDef<Company>[] => [
    {
        accessorKey: "name",
        header: "Nome Empresarial",
        cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    {
        accessorKey: "cnpj",
        header: "CNPJ",
        cell: ({ row }) => row.original.cnpj || <span className="text-muted-foreground">-</span>,
    },
    {
        accessorKey: "createdAt",
        header: "Data Criação",
        cell: ({ row }) => {
            const date = new Date(row.original.createdAt);
            return <span className="text-muted-foreground">{date.toLocaleDateString("pt-BR")}</span>;
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const company = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menu</span>
                            <MoreHorizontal className="size-4"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onEdit(company)} className="cursor-pointer">
                            <Pencil className="mr-2 size-4"/> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => onDelete(company)}
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