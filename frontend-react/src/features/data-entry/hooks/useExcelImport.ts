import { toast } from "sonner";
import ExcelJS from "exceljs";
import type { UseFormSetValue } from "react-hook-form";
import { MONTHS } from "@/features/assets/constants/esg-options";
import type { AssetTypology } from "@/types/AssetTypology";
import { getModuleFields } from "../config/module-fields";

interface UseExcelImportProps {
    asset: AssetTypology;
    setValue: UseFormSetValue<any>;
    moduleType?: string | null;
}

export function useExcelImport({ asset, setValue, moduleType }: UseExcelImportProps) {
    const isMensal = asset.reportingFrequency?.toLowerCase() === "mensal";
    const periods = isMensal ? MONTHS : ["Annual"];

    // Extrai a configuração do ativo para pegar a unidade de medida
    const assetConfig = typeof asset.assetFields === 'string'
        ? JSON.parse(asset.assetFields || '{}')
        : (asset.assetFields || {});

    const unit = assetConfig.unitMeasure || "Unidades";

    // Campos dinâmicos do módulo
    const fields = moduleType ? getModuleFields(moduleType) : [{ name: 'consumption', label: 'Valor', type: 'number' as const }];
    const isSingleField = fields.length === 1;

    // Função 1: Gera e baixa a planilha em branco com os cabeçalhos corretos
    const downloadTemplate = async () => {
        const workbook = new ExcelJS.Workbook();
        const ws = workbook.addWorksheet("Dados de Entrada");

        // Define headers
        const headers = ["Período"];
        if (isSingleField) {
            headers.push(`${fields[0].label} (${unit})`);
        } else {
            fields.forEach(f => headers.push(f.label));
        }

        // Add header row
        const headerRow = ws.addRow(headers);
        headerRow.font = { bold: true };

        // Set column widths
        ws.getColumn(1).width = 15;
        for (let i = 2; i <= headers.length; i++) {
            ws.getColumn(i).width = 20;
        }

        // Add data rows (one per period)
        for (const period of periods) {
            const rowData = [period, ...fields.map(() => "")];
            ws.addRow(rowData);
        }

        // Generate and download
        const { saveAs } = await import("file-saver");
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const safeName = asset.description.replace(/[^a-z0-9]/gi, '_');
        saveAs(blob, `Template_${safeName}.xlsx`);
    };

    // Função 2: Intercepta o upload, lê e injeta no formulário
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            const arrayBuffer = await file.arrayBuffer();
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(arrayBuffer);
            const ws = workbook.worksheets[0]; // Pega a primeira aba

            if (!ws) {
                toast.error("Planilha vazia ou inválida.");
                return;
            }

            // Read header row to build column mapping
            const headerRow = ws.getRow(1);
            const colMap: Record<string, number> = {};
            headerRow.eachCell((cell, colNumber) => {
                const val = String(cell.value || "").trim();
                if (val) colMap[val] = colNumber;
            });

            let successCount = 0;
            let errorCount = 0;

            // Iterate data rows (skip header)
            ws.eachRow((row, rowNumber) => {
                if (rowNumber <= 1) return; // Pula header

                // Tenta achar a coluna de Período
                const periodCol = colMap["Período"] || colMap["Periodo"] || colMap["PERÍODO"] || 1;
                const rawPeriod = row.getCell(periodCol).value;
                if (!rawPeriod) return;

                const periodStr = String(rawPeriod).trim().toUpperCase();

                // Verifica se o período digitado na planilha existe na nossa lista de meses/anual
                const matchedPeriod = periods.find(p => p.toUpperCase() === periodStr);

                if (!matchedPeriod) {
                    errorCount++;
                    return;
                }

                // Pega o valor (tenta pela chave exata do primeiro campo ou faz fallback para a 2ª coluna)
                const firstFieldCol = isSingleField ? `${fields[0].label} (${unit})` : fields[0].label;
                let rawValue = colMap[firstFieldCol] ? row.getCell(colMap[firstFieldCol]).value : undefined;
                if (rawValue === undefined || rawValue === null) {
                    // Fallback: pega a segunda coluna
                    rawValue = row.getCell(2).value;
                }

                if (rawValue !== undefined && rawValue !== null && rawValue !== "") {
                    // Força a conversão para número
                    const numValue = Number(rawValue);
                    if (!isNaN(numValue)) {
                        // Injeta no React Hook Form com o nome do campo certo
                        setValue(`entries.${matchedPeriod}.${fields[0].name}`, numValue, {
                            shouldValidate: true,
                            shouldDirty: true,
                        });
                        successCount++;
                    } else {
                        errorCount++;
                    }
                }
            });

            // Feedback visual para o usuário
            if (successCount > 0) {
                toast.success(`${successCount} registros importados! Confira os dados antes de salvar.`);
            }
            if (errorCount > 0) {
                toast.warning(`${errorCount} linhas ignoradas (formato de número inválido ou mês incorreto).`);
            }
            if (successCount === 0 && errorCount === 0) {
                toast.info("Nenhum dado válido encontrado na planilha.");
            }

        } catch (error) {
            console.error("Erro ao ler Excel:", error);
            toast.error("Falha ao ler o arquivo Excel. Verifique se ele está corrompido.");
        } finally {
            // Limpa o input para permitir subir o mesmo arquivo novamente se o usuário corrigir os erros
            event.target.value = '';
        }
    };

    return { downloadTemplate, handleFileUpload };
}