import {
    Building,
    Building2,
    FilePlusCorner,
    Leaf,
    type LucideIcon,
    SquareTerminal,
    UserPen
} from "lucide-react"
import { UserRole } from "@/types/enums.ts";

export interface SubItem {

    title: string

    url: string

}



export interface NavItem {

    title: string

    url: string

    icon?: LucideIcon

    allowedRoles?: UserRole[]

    items?: SubItem[]

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
            allowedRoles: [UserRole.MASTER],
        },

        // Master and Admin
        {
            title: "Unidades Empresariais",
            url: "/managers/units", // Matches 'units' case in useManagerConfig
            icon: Building2,
            allowedRoles: [UserRole.MASTER, UserRole.ADMIN],
        },
        {
            title: "Cadastro de Responsáveis",
            url: "/managers/users", // Matches 'users' case
            icon: UserPen,
            allowedRoles: [UserRole.MASTER, UserRole.ADMIN],
        },
        {
            title: "Cadastro de Fontes",
            url: "/managers/sources", // Matches 'sources' case
            icon: Leaf,
            allowedRoles: [UserRole.MASTER, UserRole.ADMIN],
            items: [
                { title: "Área de Conservação", url: "/managers/sources/conservation-area" },
                { title: "Área de Floresta Plantada", url: "/managers/sources/planted-forest" },
                { title: "Bens de Capital", url: "/managers/sources/capital-goods" },
                { title: "Bens e Serviços Comprados", url: "/managers/sources/purchased-goods" },
                { title: "Combustão Estacionária", url: "/managers/sources/stationary-combustion" },
                { title: "Combustão Móvel", url: "/managers/sources/mobile-combustion" },
                { title: "Compra de Eletricidade", url: "/managers/sources/electricity-purchase" },
                { title: "Dados de Produção e Venda", url: "/managers/sources/production-sales" },
                { title: "Efluentes Controlados", url: "/managers/sources/effluents-controlled" },
                { title: "Efluentes Domésticos", url: "/managers/sources/domestic-effluents" },
                { title: "Emissões Fugitivas", url: "/managers/sources/fugitive-emissions" },
                { title: "Fertilizantes", url: "/managers/sources/fertilizers" },
                { title: "Geração de Energia", url: "/managers/sources/energy-generation" },
                { title: "Home Office", url: "/managers/sources/home-office" },
                { title: "IPPU - Lubrificantes", url: "/managers/sources/lubricants-ippu" },
                { title: "Logística de Insumo", url: "/managers/sources/upstream-transport" },
                { title: "Logística de Produto Final", url: "/managers/sources/downstream-transport" },
                { title: "Logística de Resíduos", url: "/managers/sources/waste-transport" },
                { title: "Mudança do Uso do Solo", url: "/managers/sources/land-use-change" },
                { title: "Resíduos Sólidos", url: "/managers/sources/solid-waste" },
                { title: "Transporte de Funcionários", url: "/managers/sources/employee-commuting" },
                { title: "Viagens Aéreas", url: "/managers/sources/air-travel" },
                { title: "Viagens a Negócios Terrestres", url: "/managers/sources/business-travel-land" },
            ],
        },

        // Everyone
        {
            title: "Reporte de Dados",
            url: "/reports",
            icon: FilePlusCorner,
            // items: [
            //     { title: "Área de Conservação", url: "/reports/conservation-area" },
            //     { title: "Área de Floresta Plantada", url: "/reports/planted-forest" },
            //     { title: "Bens de Capital", url: "/reports/capital-goods" },
            //     { title: "Bens e Serviços Comprados", url: "/reports/purchased-goods" },
            //     { title: "Combustão Estacionária", url: "/reports/stationary-combustion" },
            //     { title: "Combustão Móvel", url: "/reports/mobile-combustion" },
            //     { title: "Compra de Eletricidade", url: "/reports/electricity-purchase" },
            //     { title: "Dados de Produção e Venda", url: "/reports/production-sales" },
            //     { title: "Efluentes Controlados", url: "/reports/effluents-controlled" },
            //     { title: "Efluentes Domésticos", url: "/reports/domestic-effluents" },
            //     { title: "Emissões Fugitivas", url: "/reports/fugitive-emissions" },
            //     { title: "Fertilizantes", url: "/reports/fertilizers" },
            //     { title: "Geração de Energia", url: "/reports/energy-generation" },
            //     { title: "Home Office", url: "/reports/home-office" },
            //     { title: "IPPU - Lubrificantes", url: "/reports/lubricants-ippu" },
            //     { title: "Logística de Insumo", url: "/reports/upstream-transport" },
            //     { title: "Logística de Produto Final", url: "/reports/downstream-transport" },
            //     { title: "Logística de Resíduos", url: "/reports/waste-transport" },
            //     { title: "Mudança do Uso do Solo", url: "/reports/land-use-change" },
            //     { title: "Resíduos Sólidos", url: "/reports/solid-waste" },
            //     { title: "Transporte de Funcionários", url: "/reports/employee-commuting" },
            //     { title: "Viagens Aéreas", url: "/reports/air-travel" },
            //     { title: "Viagens a Negócios Terrestres", url: "/reports/business-travel-land" },
            // ],
        },
    ] as NavItem[],
}