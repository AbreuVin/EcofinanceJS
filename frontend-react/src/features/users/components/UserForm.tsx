import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { userFormSchema } from "../schemas/user.schema";
import { PermissionsMatrix } from "./PermissionsMatrix";
import type { User } from "@/types/User";
import { useUnits } from "@/features/units/hooks/useUnits";


interface UserFormProps {
    initialData?: User | null;
    onSubmit: (values: any) => Promise<void>;
    onCancel: () => void;
    isLoading: boolean;
}

export function UserForm({ initialData, onSubmit, onCancel, isLoading }: UserFormProps) {
    const { data: units = [], isLoading: loadingUnits } = useUnits();

    const form = useForm({
        resolver: zodResolver(userFormSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            role: "USER" as const,
            companyId: "",
            unitId: 0,
            permissions: [] as string[],
        },
    });

    useEffect(() => {
        if (initialData) {
            let perms: string[] = [];
            if (Array.isArray(initialData.permissions)) {
                perms = initialData.permissions.map((p: any) =>
                    typeof p === 'string' ? p : p.sourceType
                );
            }

            form.reset({
                name: initialData.name,
                email: initialData.email,
                phone: initialData.phone || "",
                role: initialData.role,
                companyId: initialData.companyId || "",
                unitId: initialData.unitId || 0,
                permissions: perms,
            });
        } else {
            form.reset({
                name: "",
                email: "",
                phone: "",
                role: "USER",
                companyId: "",
                unitId: 0,
                permissions: [],
            });
        }
    }, [initialData, form]);

    return (
        <div className="bg-card p-6 rounded-md border shadow-sm mb-6">
            <h3 className="text-lg font-semibold mb-4">
                {initialData ? "Editar Usuário" : "Novo Usuário"}
            </h3>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome Completo</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>E-mail</FormLabel>
                                    <FormControl><Input type="email" {...field} /></FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Telefone</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Perfil de Acesso</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full"><SelectValue placeholder="Selecione..."/></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="USER">Usuário Padrão</SelectItem>
                                            <SelectItem value="ADMIN">Administrador</SelectItem>
                                            <SelectItem value="MASTER">Master</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="unitId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Unidade</FormLabel>
                                    <Select
                                        onValueChange={(val) => {
                                            field.onChange(Number(val));
                                            const selectedUnit = units.find(u => String(u.id) === val);
                                            if (selectedUnit && selectedUnit.companyId) {
                                                form.setValue("companyId", selectedUnit.companyId);
                                            }
                                        }}
                                        value={field.value ? String(field.value) : undefined}
                                        disabled={loadingUnits}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full"><SelectValue placeholder="Selecione..."/></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {units.map(u => <SelectItem key={u.id}
                                                                        value={String(u.id)}>{u.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                    </div>

                    <FormField
                        control={form.control}
                        name="permissions"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <PermissionsMatrix
                                        value={field.value || []}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                            Salvar
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}