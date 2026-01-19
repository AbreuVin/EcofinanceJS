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
                { title: "Combustão Móvel", url: "/reports/mobile-combustion" },
                { title: "Área de Conservação", url: "/reports/conservation-area" }, // Add your routes here
            ],
        },
    ] as NavItem[],
}