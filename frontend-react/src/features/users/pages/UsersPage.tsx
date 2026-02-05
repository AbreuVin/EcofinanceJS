import { useMemo } from "react";
import { Plus, UserPen } from "lucide-react";

import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { GenericTable } from "@/shared/components/ui/GenericTable";
import DashboardLayout from "@/shared/layouts/DashboardLayout";
import { useCrud } from "@/shared/hooks/useCrud";

import { useUsers } from "../hooks/useUsers";
import { UserForm } from "../components/UserForm";
import { getUserColumns } from "../components/UserColumns";
import { useUserMutations } from "@/features/users/hooks/useUserMutations.ts";
import type { User } from "@/types/User.ts";
import type { UserFormValues } from "@/features/users/schemas/user.schema.ts";

export default function UsersPage() {
    const { data: users = [], isLoading } = useUsers();
    const { createUser, updateUser, deleteUser, isSaving } = useUserMutations();

    const {
        isFormOpen,
        editingItem,
        toggleForm,
        handleCancel,
        handleEdit,
        handleDelete,
        handleSubmit,
    } = useCrud<User, UserFormValues>({
        createFn: createUser,
        updateFn: updateUser,
        deleteFn: deleteUser,
        itemLabel: "o usuário",
    });

    const columns = useMemo(
        () => getUserColumns({ onEdit: handleEdit, onDelete: handleDelete }),
        [handleEdit, handleDelete]
    );

    return (
        <DashboardLayout>
            <div className="space-y-6 container mx-auto max-w-8xl">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                            <UserPen className="size-6 text-primary"/>
                            Cadastro de Responsáveis
                        </h1>
                        <p className="text-muted-foreground">
                            Cadastre usuários, defina perfis de acesso e permissões.
                        </p>
                    </div>

                    {!isFormOpen && (
                        <Button onClick={toggleForm}>
                            <Plus className="mr-2 size-4"/> Novo Usuário
                        </Button>
                    )}
                </div>

                <Collapsible open={isFormOpen} onOpenChange={(open) => !open && handleCancel()}>
                    <CollapsibleContent className="animate-in slide-in-from-top-2 fade-in duration-300">
                        <UserForm
                            initialData={editingItem}
                            onSubmit={handleSubmit}
                            onCancel={handleCancel}
                            isLoading={isSaving}
                        />
                    </CollapsibleContent>
                </Collapsible>

                <GenericTable columns={columns} data={users} isLoading={isLoading}/>
            </div>
        </DashboardLayout>
    );
}