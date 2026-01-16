import { useState } from "react";

interface CrudOptions<_TData, TFormValues> {
    createFn: (data: TFormValues) => Promise<any>;
    updateFn: (args: { id: string; data: TFormValues }) => Promise<any>;
    deleteFn: (id: string) => Promise<any>;
    itemLabel?: string;
}

export function useCrud<TData extends { id: string }, TFormValues>(
    {
        createFn,
        updateFn,
        deleteFn,
        itemLabel = "registro",
    }: CrudOptions<TData, TFormValues>
) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<TData | null>(null);

    const closeForm = () => {
        setIsFormOpen(false);
        setEditingItem(null);
    };

    const openCreate = () => {
        setEditingItem(null);
        setIsFormOpen(true);
    };

    const toggleForm = () => {
        if (isFormOpen && !editingItem) {
            closeForm();
        } else {
            openCreate();
        }
    };

    const handleCancel = () => {
        closeForm();
    };

    const handleEdit = (item: TData) => {
        setEditingItem(item);
        setIsFormOpen(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (item: TData) => {
        const name = (item as any).name || (item as any).description || itemLabel;

        if (confirm(`Tem certeza que deseja excluir ${itemLabel} "${name}"?`)) {
            await deleteFn(item.id);
            if (editingItem?.id === item.id) closeForm();
        }
    };

    const handleSubmit = async (values: TFormValues) => {
        try {
            if (editingItem) {
                await updateFn({ id: editingItem.id, data: values });
            } else {
                await createFn(values);
            }
            closeForm();
        } catch (error) {
            console.error(error);
        }
    };

    return {
        isFormOpen,
        editingItem,
        toggleForm,
        handleCancel,
        handleEdit,
        handleDelete,
        handleSubmit,
        setIsFormOpen,
    };
}