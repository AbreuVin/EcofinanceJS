import { Building, Building2, FilePlusCorner, Leaf, type LucideIcon, SquareTerminal, UserPen, } from "lucide-react"
import type { UserRole } from "@/types/enums.ts";

export interface NavItem {
    title: string
    url: string
    icon?: LucideIcon
    allowedRoles?: UserRole[]
    items?: {
        title: string
        url: string
    }[]
}

export const sidebarConfig = {
    brand: {
        name: "EcoFinance",
        plan: "Enterprise",
        logo: SquareTerminal,
    },
    navMain: [
        {
            title: "Dashboard",
            url: "/home",
            icon: SquareTerminal,
            items: [
                { title: "Overview", url: "/home" },
                { title: "Analytics", url: "/analytics" }, // Add your routes here
            ],
        },
        // Master only
        {
            title: "Empresas",
            url: "/managers/companies", // Matches 'units' case in useManagerConfig
            icon: Building,
            allowedRoles: ['MASTER'],
        },

        // Master and Admin
        {
            title: "Unidades Empresariais",
            url: "/managers/units", // Matches 'units' case in useManagerConfig
            icon: Building2,
            allowedRoles: ['MASTER', 'ADMIN'],
        },
        {
            title: "Cadastro de Responsáveis",
            url: "/managers/users", // Matches 'users' case
            icon: UserPen,
            allowedRoles: ['MASTER', 'ADMIN'],
        },
        {
            title: "Cadastro de Fontes",
            url: "/managers/sources", // Matches 'sources' case
            icon: Leaf,
            allowedRoles: ['MASTER', 'ADMIN'],
        },

        // Everyone
        {
            title: "Reporte de Dados",
            url: "/reports",
            icon: FilePlusCorner,
            items: [
                { title: "Área de Conservação", url: "/reports/conservation-area" },
                { title: "Área de Floresta Plantada", url: "/reports/planted-forest" },
                { title: "Bens de Capital", url: "/reports/capital-goods" },
                { title: "Bens e Serviços Comprados", url: "/reports/purchased-goods" },
                { title: "Combustão Estacionária", url: "/reports/stationary-combustion" },
                { title: "Combustão Móvel", url: "/reports/mobile-combustion" },
                { title: "Compra de Eletricidade", url: "/reports/electricity-purchase" },
                { title: "Dados de Produção e Venda", url: "/reports/production-sales" },
                { title: "Efluentes Controlados", url: "/reports/effluents-controlled" },
                { title: "Efluentes Domésticos", url: "/reports/domestic-effluents" },
                { title: "Emissões Fugitivas", url: "/reports/fugitive-emissions" },
                { title: "Fertilizantes", url: "/reports/fertilizers" },
                { title: "Geração de Energia", url: "/reports/energy-generation" },
                { title: "Home Office", url: "/reports/home-office" },
                { title: "IPPU - Lubrificantes", url: "/reports/lubricants-ippu" },
                { title: "Logística de Insumo", url: "/reports/upstream-transport" },
                { title: "Logística de Produto Final", url: "/reports/downstream-transport" },
                { title: "Logística de Resíduos", url: "/reports/waste-transport" },
                { title: "Mudança do Uso do Solo", url: "/reports/land-use-change" },
                { title: "Resíduos Sólidos", url: "/reports/solid-waste" },
                { title: "Transporte de Funcionários", url: "/reports/employee-commuting" },
                { title: "Viagens Aéreas", url: "/reports/air-travel" },
                { title: "Viagens a Negócios Terrestres", url: "/reports/business-travel-land" },
            ],                
        },
    ] as NavItem[],
}