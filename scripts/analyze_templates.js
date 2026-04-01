/**
 * Script to analyze client Excel templates — outputs JSON to a file.
 */

const path = require('path');
const fs = require('fs');

const excelJsPath = path.resolve(__dirname, '..', 'frontend-react', 'node_modules', 'exceljs');
const ExcelJS = require(excelJsPath);

const ROOT_DIR = path.resolve(__dirname, '..');

const TEMPLATE_FILES = [
    'Escopo 1 - Combustão Estacionária.xlsx',
    'Escopo 1 - Combustão Móvel.xlsx',
    'Escopo 1 - Emissões Fugitivas.xlsx',
];

function getColLetter(colNum) {
    let result = '';
    while (colNum > 0) {
        const rem = (colNum - 1) % 26;
        result = String.fromCharCode(65 + rem) + result;
        colNum = Math.floor((colNum - 1) / 26);
    }
    return result;
}

async function analyzeTemplate(filePath) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);

    const result = { file: path.basename(filePath), sheets: [] };

    workbook.eachSheet((sheet) => {
        const sheetInfo = {
            name: sheet.name,
            state: sheet.state,
            rowCount: sheet.rowCount,
            columnCount: sheet.columnCount,
            columns: [],
            rows: [],
            mergedCells: [],
            comments: [],
        };

        const maxCol = Math.min(sheet.columnCount || 30, 30);
        for (let i = 1; i <= maxCol; i++) {
            const col = sheet.getColumn(i);
            sheetInfo.columns.push({
                idx: i, letter: getColLetter(i),
                width: col.width, hidden: col.hidden || false,
            });
        }

        const maxRow = Math.min(sheet.rowCount || 15, 15);
        for (let r = 1; r <= maxRow; r++) {
            const row = sheet.getRow(r);
            const rowInfo = { num: r, height: row.height, cells: [] };

            for (let c = 1; c <= maxCol; c++) {
                const cell = row.getCell(c);
                if (cell.value !== null && cell.value !== undefined) {
                    const val = typeof cell.value === 'object' ? JSON.stringify(cell.value) : String(cell.value);
                    const ci = {
                        ref: getColLetter(c) + r,
                        val: val.substring(0, 120),
                    };
                    if (cell.font) ci.font = cell.font;
                    if (cell.alignment) ci.align = cell.alignment;
                    if (cell.fill && cell.fill.type === 'pattern') ci.fill = cell.fill.fgColor;
                    if (cell.border) ci.border = true;
                    if (cell.note) {
                        ci.note = typeof cell.note === 'object' ? JSON.stringify(cell.note).substring(0, 300) : String(cell.note).substring(0, 300);
                        sheetInfo.comments.push({ cell: ci.ref, note: ci.note });
                    }
                    rowInfo.cells.push(ci);
                }
            }
            if (rowInfo.cells.length > 0 || row.height) sheetInfo.rows.push(rowInfo);
        }

        if (sheet._merges) {
            sheetInfo.mergedCells = Object.keys(sheet._merges);
        }

        result.sheets.push(sheetInfo);
    });
    return result;
}

async function main() {
    const allResults = [];
    for (const file of TEMPLATE_FILES) {
        try {
            const analysis = await analyzeTemplate(path.join(ROOT_DIR, file));
            allResults.push(analysis);
        } catch (err) {
            allResults.push({ file, error: err.message });
        }
    }
    const outPath = path.join(__dirname, 'analysis_result.json');
    fs.writeFileSync(outPath, JSON.stringify(allResults, null, 2), 'utf8');
    console.log('Done. Output: ' + outPath);
}

main().catch(console.error);
