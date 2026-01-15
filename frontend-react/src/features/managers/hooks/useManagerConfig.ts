import { useMemo } from 'react';
import type { User } from '@/types/User';
import { ESG_MODULES } from "@/types/enums.ts";

const BR_STATES = [
    { label: 'Acre', value: 'AC' }, { label: 'Alagoas', value: 'AL' }, { label: 'Amapá', value: 'AP' },
    { label: 'Amazonas', value: 'AM' }, { label: 'Bahia', value: 'BA' }, { label: 'Ceará', value: 'CE' },
    { label: 'Distrito Federal', value: 'DF' }, { label: 'Espírito Santo', value: 'ES' }, {
        label: 'Goiás',
        value: 'GO'
    },
    { label: 'Maranhão', value: 'MA' }, { label: 'Mato Grosso', value: 'MT' }, {
        label: 'Mato Grosso do Sul',
        value: 'MS'
    },
    { label: 'Minas Gerais', value: 'MG' }, { label: 'Pará', value: 'PA' }, { label: 'Paraíba', value: 'PB' },
    { label: 'Paraná', value: 'PR' }, { label: 'Pernambuco', value: 'PE' }, { label: 'Piauí', value: 'PI' },
    { label: 'Rio de Janeiro', value: 'RJ' }, {
        label: 'Rio Grande do Norte',
        value: 'RN'
    }, { label: 'Rio Grande do Sul', value: 'RS' },
    { label: 'Rondônia', value: 'RO' }, { label: 'Roraima', value: 'RR' }, { label: 'Santa Catarina', value: 'SC' },
    { label: 'São Paulo', value: 'SP' }, { label: 'Sergipe', value: 'SE' }, { label: 'Tocantins', value: 'TO' }
];

export type ManagerType = 'users' | 'units' | 'companies' | 'sources';

export interface ColumnConfig {
    key: string;
    label: string;
    type: 'text' | 'email' | 'badge' | 'date' | 'boolean';
}

export interface FieldConfig {
    name: string;
    label: string;
    type: 'text' | 'email' | 'select' | 'password' | 'number' | 'boolean' | 'permissions-matrix';
    options?: { label: string; value: string | number }[]; // Static options
    dynamicOptions?: 'companies' | 'units'; // NEW: Dynamic Source
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
                    // Task 2: Show Company in Table
                    columns: [
                        { key: 'name', label: 'Nome da Unidade', type: 'text' },
                        { key: 'company.name', label: 'Empresa', type: 'text' }, // <--- Deep Accessor
                        { key: 'city', label: 'Cidade', type: 'text' },
                        { key: 'state', label: 'Estado', type: 'text' },
                        { key: 'numberOfWorkers', label: 'Colaboradores', type: 'text' },
                    ],
                    // Task 1: Fields as per image (inferred)
                    fields: [
                        { name: 'name', label: 'Nome da Unidade', type: 'text', required: true },
                        // Dynamic Select for Company
                        {
                            name: 'companyId',
                            label: 'Empresa',
                            type: 'select',
                            dynamicOptions: 'companies',
                            required: true
                        },
                        { name: 'city', label: 'Cidade', type: 'text', required: true },
                        { name: 'state', label: 'Estado (UF)', type: 'select', options: BR_STATES, required: true },
                        { name: 'country', label: 'País', type: 'text', required: true }, // Added Country
                        { name: 'numberOfWorkers', label: 'Nº Colaboradores', type: 'number', required: true },
                    ]
                };

            case 'users':
                if (!isMaster && !isAdmin) {
                    return { title: 'Restrito', description: '', isAllowed: false, columns: [], fields: [] };
                }
                return {
                    title: 'Gerenciamento de Usuários',
                    description: 'Gerencie o acesso, telefones e permissões.',
                    isAllowed: true,
                    columns: [
                        { key: 'name', label: 'Nome', type: 'text' },
                        { key: 'email', label: 'E-mail', type: 'email' },
                        { key: 'phone', label: 'Telefone', type: 'text' }, // <--- New Column
                        { key: 'role', label: 'Perfil', type: 'badge' },
                        { key: 'company.name', label: 'Empresa', type: 'text' },
                        { key: 'unit.name', label: 'Unidade', type: 'text' },
                    ],
                    fields: [
                        { name: 'name', label: 'Nome Completo', type: 'text', required: true },
                        { name: 'email', label: 'E-mail', type: 'email', required: true },
                        { name: 'phone', label: 'Telefone', type: 'text', required: false },
                        {
                            name: 'role', label: 'Perfil de Acesso', type: 'select', options: [
                                { label: 'Administrador', value: 'ADMIN' },
                                { label: 'Usuário Padrão', value: 'USER' }
                            ], required: true
                        },

                        {
                            name: 'unitId',
                            label: 'Unidade Operacional',
                            type: 'select',
                            dynamicOptions: 'units',
                            required: true
                        },

                        {
                            name: 'permissions',
                            label: 'Permissões de Módulos ESG',
                            type: 'permissions-matrix',
                            options: ESG_MODULES
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