import * as XLSX from "xlsx";

interface ExportOptions {
    data: Record<string, any>[];
    columns: { key: string; header: string }[];
    fileName: string;
    sheetName?: string;
}

export function exportToExcel({ data, columns, fileName, sheetName = "Dados" }: ExportOptions) {
    const rows = data.map((item) => {
        const row: Record<string, any> = {};
        for (const col of columns) {
            let value = col.key.split(".").reduce((obj: any, k) => obj?.[k], item);
            if (typeof value === "boolean") value = value ? "Sim" : "Não";
            if (value === null || value === undefined) value = "";
            row[col.header] = value;
        }
        return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
}
