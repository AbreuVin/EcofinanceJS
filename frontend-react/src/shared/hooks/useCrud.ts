import { useState } from "react";

interface BaseItem {
    id: string | number;
}

interface CrudOptions<T extends BaseItem, TCreate, TUpdate = TCreate> {
    createFn: (data: TCreate) => Promise<T>;
    updateFn: (args: { id: T['id']; data: TUpdate }) => Promise<T>;
    deleteFn: (id: T['id']) => Promise<void>;
    itemLabel?: string;
}

export function useCrud<T extends BaseItem, TCreate, TUpdate = TCreate>({
                                                                            createFn,
                                                                            updateFn,
                                                                            deleteFn,
                                                                            itemLabel = "o item",
                                                                        }: CrudOptions<T, TCreate, TUpdate>) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<T | null>(null);

    const toggleForm = () => {
        setIsFormOpen((prev) => !prev);
        setEditingItem(null);
    };

    const handleCancel = () => {
        setIsFormOpen(false);
        setEditingItem(null);
    };

    const handleEdit = (item: T) => {
        setEditingItem(item);
        setIsFormOpen(true);
    };

    const handleDelete = async (item: T) => {
        try {
            if (confirm(`Tem certeza que deseja excluir ${itemLabel}?`)) {
                await deleteFn(item.id);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (data: TCreate) => {
        try {
            if (editingItem) {
                await updateFn({ id: editingItem.id, data: data as unknown as TUpdate });
            } else {
                await createFn(data);
            }
            setIsFormOpen(false);
            setEditingItem(null);
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
    };
}