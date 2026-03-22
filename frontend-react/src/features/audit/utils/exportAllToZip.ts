import * as XLSX from "xlsx";
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
        // Monta as linhas traduzidas (mesmo padrão do exportToExcel)
        const rows = source.data.map((item) => {
            const row: Record<string, any> = {};
            for (const col of source.columns) {
                let value = col.key.split(".").reduce((obj: any, k) => obj?.[k], item);
                if (typeof value === "boolean") value = value ? "Sim" : "Não";
                if (value === null || value === undefined) value = "";
                row[col.header] = value;
            }
            return row;
        });

        // Gera o workbook em memória
        const worksheet = XLSX.utils.json_to_sheet(rows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, source.label.substring(0, 31));

        // Converte para buffer binário
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

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
