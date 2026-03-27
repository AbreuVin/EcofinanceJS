import ExcelJS from "exceljs";
import JSZip from "jszip";

interface ColumnDef {
    key: string;
    header: string;
}

interface SourceExportData {
    sourceType: string;
    label: string;
    data: Record<string, any>[];
    columns: ColumnDef[];
}

/**
 * Gera múltiplos arquivos Excel (um por fonte de emissão) e baixa como .zip.
 */
export async function exportAllToZip(
    sources: SourceExportData[],
    zipFileName: string = "reportes_todas_fontes"
) {
    const zip = new JSZip();

    for (const source of sources) {
        const workbook = new ExcelJS.Workbook();
        const sheetName = source.label.substring(0, 31);
        const worksheet = workbook.addWorksheet(sheetName);

        // Define columns
        worksheet.columns = source.columns.map(col => ({
            header: col.header,
            key: col.key,
            width: 20,
        }));

        // Style header row
        const headerRow = worksheet.getRow(1);
        headerRow.font = { bold: true };

        // Add data rows
        for (const item of source.data) {
            const row: Record<string, any> = {};
            for (const col of source.columns) {
                let value = col.key.split(".").reduce((obj: any, k) => obj?.[k], item);
                if (typeof value === "boolean") value = value ? "Sim" : "Não";
                if (value === null || value === undefined) value = "";
                row[col.key] = value;
            }
            worksheet.addRow(row);
        }

        // Converte para buffer binário
        const excelBuffer = await workbook.xlsx.writeBuffer();

        // Adiciona ao ZIP
        const safeFileName = source.label.replace(/\s+/g, "_").toLowerCase();
        zip.file(`${safeFileName}.xlsx`, excelBuffer);
    }

    // Gera o ZIP e faz download
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${zipFileName}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
