import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { User } from "@/types/User";

interface UserColumnsProps {
    onEdit: (user: User) => void;
    onDelete: (user: User) => void;
}

export const getUserColumns = ({ onEdit, onDelete }: UserColumnsProps): ColumnDef<User>[] => [
    {
        accessorKey: "name",
        header: "Nome",
    },
    {
        accessorKey: "email",
        header: "E-mail",
        cell: ({ row }) => <a href={`mailto:${row.original.email}`} className="text-blue-600 hover:underline">{row.original.email}</a>,
    },
    {
        accessorKey: "role",
        header: "Perfil",
        cell: ({ row }) => (
            <Badge variant={row.original.role === 'USER' ? 'secondary' : 'default'}>
                {row.original.role}
            </Badge>
        ),
    },
    // TODO: Campo de Unidade oculto a pedido do cliente - descomentar se necessário
    // {
    //     accessorKey: "unit.name",
    //     header: "Unidade",
    //     cell: ({ row }) => row.original.unit?.name || <span className="text-muted-foreground">-</span>,
    // },
    {
        id: "actions",
        cell: ({ row }) => {
            const user = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Menu</span>
                            <MoreHorizontal className="size-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onEdit(user)} className="cursor-pointer">
                            <Pencil className="mr-2 size-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(user)} className="text-destructive cursor-pointer">
                            <Trash className="mr-2 size-4" /> Excluir
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];