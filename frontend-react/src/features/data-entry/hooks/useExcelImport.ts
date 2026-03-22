import { toast } from "sonner";
import * as XLSX from "xlsx";
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
    const downloadTemplate = () => {
        const data = periods.map(period => {
            const row: Record<string, any> = { "Período": period };
            if (isSingleField) {
                row[`${fields[0].label} (${unit})`] = "";
            } else {
                fields.forEach(f => {
                    row[f.label] = "";
                });
            }
            return row;
        });

        const ws = XLSX.utils.json_to_sheet(data);
        // Ajusta a largura das colunas para ficar visualmente agradável
        const colWidths = [{ wch: 15 }, ...fields.map(() => ({ wch: 20 }))];
        ws['!cols'] = colWidths;

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Dados de Entrada");

        // Limpa o nome do arquivo para não dar erro no Windows/Mac
        const safeName = asset.description.replace(/[^a-z0-9]/gi, '_');
        XLSX.writeFile(wb, `Template_${safeName}.xlsx`);
    };

    // Função 2: Intercepta o upload, lê e injeta no formulário
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            const data = await file.arrayBuffer();
            const wb = XLSX.read(data);
            const ws = wb.Sheets[wb.SheetNames[0]]; // Pega a primeira aba
            const jsonData = XLSX.utils.sheet_to_json(ws) as any[];

            let successCount = 0;
            let errorCount = 0;

            jsonData.forEach((row) => {
                // Tenta achar a coluna de Período (ignora case e acentos se possível)
                const rawPeriod = row["Período"] || row["Periodo"] || row["PERÍODO"];
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
                let rawValue = row[firstFieldCol];
                if (rawValue === undefined) {
                    const keys = Object.keys(row);
                    const valKey = keys.find(k => k.toUpperCase() !== "PERÍODO" && k.toUpperCase() !== "PERIODO");
                    if (valKey) rawValue = row[valKey];
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