import { useMemo } from 'react';
import { Link, useParams } from 'wouter';
import { useAuthStore } from '@/store/authStore';
import { type ManagerType, useManagerConfig } from '@/features/managers/hooks/useManagerConfig';
import { Button } from '@/components/ui/button';
import { Plus, ShieldAlert } from 'lucide-react';
import { GenericTable } from '@/shared/components/ui/GenericTable';
import { generateColumns } from '@/features/managers/components/ManagerColumns';
import { useManagerData } from "@/features/managers/hooks/useManagerData.ts";

export default function ManagerPage() {
    const { type } = useParams<{ type: string }>();
    const { user } = useAuthStore();
    const config = useManagerConfig(type as ManagerType, user);

    // 2. Fetch Data (Real API)
    const { data, isLoading, isError, deleteItem } = useManagerData(type as ManagerType);

    // 3. Define Actions
    const handleDelete = async (item: any) => {
        if (confirm(`Tem certeza que deseja excluir: ${item.name || item.description}?`)) {
            await deleteItem(item.id);
        }
    };

    const handleEdit = (item: any) => {
        console.log("Open Edit Modal for:", item);
        // Next Step: We will wire this to a Dynamic Form
    };

    // 4. Generate Columns
    const tableColumns = useMemo(() =>
            generateColumns(config.columns, handleEdit, handleDelete),
        [config.columns]
    );

    // Security Gate
    if (!config.isAllowed) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
                <div className="bg-red-100 p-4 rounded-full">
                    <ShieldAlert className="size-10 text-red-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Acesso Restrito</h2>
                <p className="text-muted-foreground">Você não tem permissão para acessar este módulo.</p>
                <Link href="/home"><Button variant="outline">Voltar</Button></Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{config.title}</h1>
                    <p className="text-muted-foreground">{config.description}</p>
                </div>
                <Button>
                    <Plus className="mr-2 size-4" /> Novo Registro
                </Button>
            </div>

            {!isError && (
                <GenericTable
                    columns={tableColumns}
                    data={data}
                    isLoading={isLoading}
                />
            )}

            {isError && (
                <div className="p-8 text-center text-red-500">
                    Erro ao carregar dados. Verifique sua conexão ou contate o suporte.
                </div>
            )}
        </div>
    );
}