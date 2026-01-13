import { useMemo } from 'react';
import type { User } from '@/types/User';

export type ManagerType = 'users' | 'units' | 'companies' | 'sources';

export interface ColumnConfig {
    key: string;
    label: string;
    type: 'text' | 'email' | 'badge' | 'date' | 'boolean';
}

export interface FieldConfig {
    name: string;
    label: string;
    type: 'text' | 'email' | 'select' | 'password' | 'number';
    options?: { label: string; value: string | number }[];
    required?: boolean;
}

export interface ManagerViewConfig {
    title: string;
    description: string;
    isAllowed: boolean; // Simple flag: All or Nothing
    columns: ColumnConfig[];
    fields: FieldConfig[];
}

export const useManagerConfig = (type: ManagerType, user: User | null): ManagerViewConfig => {
    return useMemo(() => {
        // 1. Role Helpers
        const role = user?.role;
        const isMaster = role === 'MASTER';
        const isAdmin = role === 'ADMIN';

        // 2. Define Configuration
        switch (type) {
            case 'companies':
                // RULE: Only MASTER can touch Companies
                if (!isMaster) {
                    return { title: 'Restrito', description: '', isAllowed: false, columns: [], fields: [] };
                }
                return {
                    title: 'Empresas',
                    description: 'Gerencie as empresas (Tenants) do sistema.',
                    isAllowed: true,
                    columns: [
                        { key: 'name', label: 'Nome Empresarial', type: 'text' },
                        { key: 'cnpj', label: 'CNPJ', type: 'text' },
                        { key: 'createdAt', label: 'Data Criação', type: 'date' },
                    ],
                    fields: [
                        { name: 'name', label: 'Nome da Empresa', type: 'text', required: true },
                        { name: 'cnpj', label: 'CNPJ', type: 'text', required: true },
                    ]
                };

            case 'units':
                // RULE: MASTER or ADMIN
                if (!isMaster && !isAdmin) {
                    return { title: 'Restrito', description: '', isAllowed: false, columns: [], fields: [] };
                }
                return {
                    title: 'Unidades',
                    description: 'Gerencie as unidades operacionais.',
                    isAllowed: true,
                    columns: [
                        { key: 'name', label: 'Nome', type: 'text' },
                        { key: 'city', label: 'Cidade', type: 'text' },
                        { key: 'state', label: 'Estado', type: 'text' },
                    ],
                    fields: [
                        { name: 'name', label: 'Nome', type: 'text', required: true },
                        { name: 'city', label: 'Cidade', type: 'text', required: true },
                        { name: 'state', label: 'Estado', type: 'text', required: true },
                        { name: 'numberOfWorkers', label: 'Nº Colaboradores', type: 'number', required: true }
                    ]
                };

            case 'users':
                // RULE: MASTER or ADMIN
                if (!isMaster && !isAdmin) {
                    return { title: 'Restrito', description: '', isAllowed: false, columns: [], fields: [] };
                }
                return {
                    title: 'Usuários',
                    description: 'Gerencie acesso e permissões.',
                    isAllowed: true,
                    columns: [
                        { key: 'name', label: 'Nome', type: 'text' },
                        { key: 'email', label: 'E-mail', type: 'email' },
                        { key: 'role', label: 'Perfil', type: 'badge' },
                    ],
                    fields: [
                        { name: 'name', label: 'Nome', type: 'text', required: true },
                        { name: 'email', label: 'E-mail', type: 'email', required: true },
                        { name: 'password', label: 'Senha', type: 'password', required: true },
                        {
                            name: 'role', label: 'Perfil', type: 'select', options: [
                                { label: 'Admin', value: 'ADMIN' },
                                { label: 'User', value: 'USER' }
                            ], required: true
                        }
                    ]
                };

            case 'sources':
                // RULE: MASTER or ADMIN
                if (!isMaster && !isAdmin) {
                    return { title: 'Restrito', description: '', isAllowed: false, columns: [], fields: [] };
                }
                return {
                    title: 'Fontes de Emissão',
                    description: 'Cadastre máquinas e veículos.',
                    isAllowed: true,
                    columns: [
                        { key: 'description', label: 'Descrição', type: 'text' },
                        { key: 'sourceType', label: 'Tipo', type: 'text' },
                        { key: 'isActive', label: 'Ativo', type: 'boolean' },
                    ],
                    fields: [
                        { name: 'description', label: 'Nome', type: 'text', required: true },
                        {
                            name: 'sourceType', label: 'Tipo', type: 'select', options: [
                                { label: 'Combustão Móvel', value: 'mobile_combustion' },
                                { label: 'Combustão Estacionária', value: 'stationary_combustion' }
                            ], required: true
                        }
                    ]
                };

            default:
                return { title: 'Erro', description: 'Módulo desconhecido', isAllowed: false, columns: [], fields: [] };
        }
    }, [type, user]);
};