import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

interface ExportOptions {
    data: Record<string, any>[];
    columns: { key: string; header: string }[];
    fileName: string;
    sheetName?: string;
}

export async function exportToExcel({ data, columns, fileName, sheetName = "Dados" }: ExportOptions) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    // Define headers
    worksheet.columns = columns.map(col => ({
        header: col.header,
        key: col.key,
        width: 20,
    }));

    // Style header row
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.alignment = { vertical: "middle" };

    // Add data rows
    for (const item of data) {
        const row: Record<string, any> = {};
        for (const col of columns) {
            let value = col.key.split(".").reduce((obj: any, k) => obj?.[k], item);
            if (typeof value === "boolean") value = value ? "Sim" : "Não";
            if (value === null || value === undefined) value = "";
            row[col.key] = value;
        }
        worksheet.addRow(row);
    }

    // Generate and download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(blob, `${fileName}.xlsx`);
}
