import type { ColumnDef } from "@tanstack/react-table";
import { CheckCircle2, MoreHorizontal, Pencil, Trash, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { AssetTypology } from "@/types/AssetTypology";
import { ESG_MODULES } from "@/types/enums";

interface AssetColumnsProps {
    onEdit: (asset: AssetTypology) => void;
    onDelete: (asset: AssetTypology) => void;
}

export const getAssetColumns = ({ onEdit, onDelete }: AssetColumnsProps): ColumnDef<AssetTypology>[] => [
    {
        accessorKey: "description",
        header: "Descrição / Identificação",
        cell: ({ row }) => <span className="font-medium">{row.original.description}</span>,
    },
    {
        accessorKey: "sourceType",
        header: "Tipo de Fonte",
        cell: ({ row }) => {
            const typeValue = row.original.sourceType;
            const moduleOpt = ESG_MODULES.find((m) => m.value === typeValue);
            return (
                <Badge variant="outline" className="font-normal">
                    {moduleOpt ? moduleOpt.label : typeValue}
                </Badge>
            );
        },
    },
    {
        accessorKey: "unit.name",
        header: "Unidade",
        cell: ({ row }) => row.original.unit?.name || <span>Global</span>,
    },
    {
        accessorKey: "userContact.name",
        header: "Responsável",
        cell: ({ row }) => row.original.userContact?.name || <span className="text-muted-foreground">-</span>,
    },
    {
        accessorKey: "reportingFrequency",
        header: "Frequência",
        cell: ({ row }) => (
            <span className="capitalize">{row.original.reportingFrequency}</span>
        ),
    },
    {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                {row.original.isActive ? (
                    <>
                        <CheckCircle2 className="size-4 text-green-600"/>
                        <span className="text-xs text-muted-foreground">Ativo</span>
                    </>
                ) : (
                    <>
                        <XCircle className="size-4 text-red-500"/>
                        <span className="text-xs text-muted-foreground">Inativo</span>
                    </>
                )}
            </div>
        ),
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const asset = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Menu</span>
                            <MoreHorizontal className="size-4"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onEdit(asset)} className="cursor-pointer">
                            <Pencil className="mr-2 size-4"/> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => onDelete(asset)}
                            className="text-destructive focus:text-destructive cursor-pointer"
                        >
                            <Trash className="mr-2 size-4"/> Excluir
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

const getField = (row: AssetTypology, key: string) => (row.assetFields as any)?.[key] || "-";
const getBoolean = (row: AssetTypology, key: string) => (row.assetFields as any)?.[key] === 'true' || (row.assetFields as any)?.[key] === true ? "Sim" : "Não";

export const SPECIFIC_COLUMNS: Record<string, ColumnDef<AssetTypology>[]> = {

    // 1. Área de Conservação
    conservation_area: [
        { header: "Bioma", accessorFn: (row) => getField(row, "biome") },
        { header: "Fitofisionomia", accessorFn: (row) => getField(row, "phytophysiognomy") },
        { header: "Plantada?", accessorFn: (row) => getBoolean(row, "isPlanted") }
    ],

    // 2. Área de Floresta Plantada
    planted_forest: [
        { header: "Espécie", accessorFn: (row) => getField(row, "species") },
        { header: "Área Total", accessorFn: (row) => getField(row, "areaSize") ? `${getField(row, "areaSize")} ha` : "-" }
    ],

    // 3. Bens de Capital (Sem campos específicos)
    capital_goods: [],

    // 4. Bens e Serviços Comprados
    purchased_goods: [
        { header: "Tipo", accessorFn: (row) => getField(row, "itemType") },
        { header: "Comprado por Terceiros?", accessorFn: (row) => getBoolean(row, "isPurchasedByThirdParty") }
    ],

    // 5. Combustão Estacionária
    stationary_combustion: [
        { header: "Combustível", accessorFn: (row) => getField(row, "fuelType") },
        { header: "Unid. Consumo", accessorFn: (row) => getField(row, "unitMeasure") },
        { header: "Controlado?", accessorFn: (row) => getBoolean(row, "isCompanyControlled") }
    ],

    // 6. Combustão Móvel
    mobile_combustion: [
        { header: "Combustível", accessorFn: (row) => getField(row, "fuelType") },
        { header: "Reporte", accessorFn: (row) => getField(row, "reportType") }
    ],

    // 7. Compra de Eletricidade
    electricity_purchase: [
        { header: "Fonte / Tipo", accessorFn: (row) => getField(row, "sourceType") || "Grid Nacional" },
        { header: "Registro", accessorFn: (row) => getField(row, "registryNumber") }
    ],

    // 8. Dados de Produção e Venda
    production_sales: [
        { header: "Produto", accessorFn: (row) => getField(row, "productName") },
        { header: "Unid. Medida", accessorFn: (row) => getField(row, "unitMeasure") }
    ],

    // 9. Efluentes Controlados
    effluents_controlled: [
        { header: "Destino/Tratamento", accessorFn: (row) => getField(row, "treatmentOrDest") },
        { header: "Detalhe", accessorFn: (row) => getField(row, "treatmentType") || getField(row, "finalDestType") },
        { header: "Unidade", accessorFn: (row) => getField(row, "standardUnit") }
    ],

    // 10. Efluentes Domésticos
    domestic_effluents: [
        { header: "Trabalhador", accessorFn: (row) => getField(row, "workerType") },
        { header: "Fossa Séptica?", accessorFn: (row) => getBoolean(row, "hasSepticTank") }
    ],

    // 11. Emissões Fugitivas
    fugitive_emissions: [
        { header: "Gás Padrão", accessorFn: (row) => getField(row, "gasType") },
        { header: "Controlado?", accessorFn: (row) => getBoolean(row, "isCompanyControlled") }
    ],

    // 12. Fertilizantes
    fertilizers: [
        { header: "Tipo", accessorFn: (row) => getField(row, "fertilizerType") },
        { header: "% Nitrogênio", accessorFn: (row) => getField(row, "nitrogenPercent") ? `${getField(row, "nitrogenPercent")}%` : "-" },
        { header: "% Carbonato", accessorFn: (row) => getField(row, "carbonatePercent") ? `${getField(row, "carbonatePercent")}%` : "-" },
        { header: "Controlado?", accessorFn: (row) => getBoolean(row, "isCompanyControlled") }
    ],

    // 13. Geração de Energia
    energy_generation: [
        { header: "Tecnologia", accessorFn: (row) => getField(row, "technology") },
        { header: "Capacidade Instalada", accessorFn: (row) => getField(row, "installedCapacity") }
    ],

    // 14. Home Office
    home_office: [
        { header: "Funcionários", accessorFn: (row) => getField(row, "totalEmployees") },
        { header: "% Remoto", accessorFn: (row) => getField(row, "percentRemote") ? `${getField(row, "percentRemote")}%` : "-" }
    ],

    // 15. IPPU - Lubrificantes
    lubricants_ippu: [
        { header: "Produto", accessorFn: (row) => getField(row, "lubricantType") },
        { header: "Unidade", accessorFn: (row) => getField(row, "unitMeasure") }
    ],

    // 16. Logística de Insumo
    upstream_transport: [
        { header: "Modal", accessorFn: (row) => getField(row, "transportMode") },
        { header: "Reporte", accessorFn: (row) => getField(row, "reportType") }
    ],

    // 17. Logística de Produto Final
    downstream_transport: [
        { header: "Modal", accessorFn: (row) => getField(row, "transportMode") },
        { header: "Reporte", accessorFn: (row) => getField(row, "reportType") }
    ],

    // 18. Logística de Resíduos (Sem Modal)
    waste_transport: [
        { header: "Reporte", accessorFn: (row) => getField(row, "reportType") }
    ],

    // 19. Mudança do Uso do Solo
    land_use_change: [
        { header: "Uso Anterior", accessorFn: (row) => getField(row, "previousLandUse") }
    ],

    // 20. Resíduos Sólidos
    solid_waste: [
        { header: "Resíduo", accessorFn: (row) => getField(row, "wasteType") },
        { header: "Destino", accessorFn: (row) => getField(row, "wasteDestination") },
        { header: "Controlado?", accessorFn: (row) => getBoolean(row, "isCompanyControlled") }
    ],

    // 21. Transporte de Funcionários
    employee_commuting: [
        { header: "Meio", accessorFn: (row) => getField(row, "transportMode") },
        { header: "Reporte", accessorFn: (row) => getField(row, "reportType") }
    ],

    // 22. Viagens a Negócios Terrestres
    business_travel_land: [
        { header: "Reembolso?", accessorFn: (row) => getBoolean(row, "reimbursement") }
    ],

    // 23. Viagens Aéreas (Sem campos específicos)
    air_travel: [],
};