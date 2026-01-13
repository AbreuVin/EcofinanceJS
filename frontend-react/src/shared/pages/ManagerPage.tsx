import { useMemo, useState } from 'react';
import { Link, useParams } from 'wouter';
import { useAuthStore } from '@/store/authStore';
import { type ManagerType, useManagerConfig } from '@/features/managers/hooks/useManagerConfig';
import { useManagerData } from '@/features/managers/hooks/useManagerData';
import { useManagerMutations } from '@/features/managers/hooks/useManagerMutation';

import { Button } from '@/components/ui/button';
import { Plus, ShieldAlert } from 'lucide-react';
import { GenericTable } from '@/shared/components/ui/GenericTable';
import { generateColumns } from '@/features/managers/components/ManagerColumns';
import { ManagerAccordion } from '@/features/managers/components/ManagerAccordion';

export default function ManagerPage() {
    const { type } = useParams<{ type: string }>();
    const { user } = useAuthStore();

    // 1. Load Strategy (Brain)
    const config = useManagerConfig(type as ManagerType, user);

    // 2. Fetch Data (Heart)
    const { data, isLoading: isDataLoading, isError, deleteItem } = useManagerData(type as ManagerType);

    // 3. UI State
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);

    // 4. Mutations (Hands)
    // We close the form automatically on success
    const { createItem, updateItem, isSaving } = useManagerMutations(
        type as ManagerType,
        () => {
            setIsFormOpen(false);
            setSelectedItem(null);
        }
    );

    // 5. Handlers
    const handleCreate = () => {
        // If form is already open in "Create" mode, close it. Otherwise open it.
        if (isFormOpen && !selectedItem) {
            setIsFormOpen(false);
        } else {
            setSelectedItem(null); // Clear selection for create mode
            setIsFormOpen(true);
        }
    };

    const handleEdit = (item: any) => {
        setSelectedItem(item); // Set item for edit mode
        setIsFormOpen(true);   // Expand accordion

        // Smooth scroll to top to show the form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (item: any) => {
        if (confirm(`Tem certeza que deseja excluir: ${item.name || item.description || 'este item'}?`)) {
            await deleteItem(item.id);
        }
    };

    const handleSubmit = async (formData: any) => {
        const { company, unit, children, parent, id, ...cleanData } = formData;

        if (selectedItem) {
            // Update Mode
            await updateItem({ id: selectedItem.id, data: cleanData });
        } else {
            // Create Mode
            await createItem(cleanData);
        }
    };

    // const handleCancel = () => {
    //     setIsFormOpen(false);
    //     setSelectedItem(null);
    // }

    // 6. Generate Columns
    const tableColumns = useMemo(() =>
            generateColumns(config.columns, handleEdit, handleDelete),
        [config.columns, deleteItem]
    );

    // --- RENDER ---

    // Security Gate
    if (!config.isAllowed) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
                <div className="bg-red-100 p-4 rounded-full">
                    <ShieldAlert className="size-10 text-red-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Acesso Restrito</h2>
                <p className="text-muted-foreground">Você não tem permissão para acessar este módulo.</p>
                <Link href="/home">
                    <Button variant="outline">Voltar para Dashboard</Button>
                </Link>
            </div>
        );
    }

    // API Error
    if (isError) {
        return <div className="p-8 text-center text-red-500">Erro ao carregar dados. Verifique sua conexão.</div>;
    }

    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{config.title}</h1>
                    <p className="text-muted-foreground">{config.description}</p>
                </div>

                {/* Toggle Button */}
                {!isFormOpen && (
                    <Button
                        onClick={handleCreate}
                        variant={isFormOpen && !selectedItem ? "secondary" : "default"}
                    >
                        <>
                            <Plus className="mr-2 size-4" /> Novo Registro
                        </>
                    </Button>
                )}
            </div>

            {/* ACCORDION FORM */}
            <ManagerAccordion
                isOpen={isFormOpen}
                setIsOpen={(open) => {
                    setIsFormOpen(open);
                    if (!open) setSelectedItem(null); // Clear selection on close
                }}
                fields={config.fields}
                initialData={selectedItem}
                onSubmit={handleSubmit}
                isLoading={isSaving}
            />

            {/* DATA TABLE */}
            <GenericTable
                columns={tableColumns}
                data={data}
                isLoading={isDataLoading}
            />
        </div>
    );
}