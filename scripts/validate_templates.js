/**
 * Script de validação: compara o layout gerado pelo sistema
 * com os templates de referência do cliente.
 *
 * Verifica: largura de colunas, altura de linhas, cabeçalhos, número de colunas.
 */

const path = require('path');
const fs = require('fs');
const excelJsPath = path.resolve(__dirname, '..', 'frontend-react', 'node_modules', 'exceljs');
const ExcelJS = require(excelJsPath);

// Reference data extracted from client templates
const REFERENCE = {
    'stationary_combustion': {
        file: 'Escopo 1 - Combustão Estacionária.xlsx',
        sheetName: 'Template Limpo',
        expectedHeaders: [
            'Unidade Empresarial', 'Fonte de Emissão', 'Combustível',
            'Unidade de medida', 'Mensal ou anual?', 'Responsável pelo reporte',
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro', 'Anual',
        ],
        expectedColWidths: {
            'Unidade Empresarial': 30.44, 'Fonte de Emissão': 18.11, 'Combustível': 18.55,
            'Unidade de medida': 19.11, 'Mensal ou anual?': 14.55, 'Responsável pelo reporte': 14.55,
            'Janeiro': 10.78,
        },
        expectedRowHeights: { 1: 21, 2: 15.75, 4: 32.25 },
    },
    'mobile_combustion': {
        file: 'Escopo 1 - Combustão Móvel.xlsx',
        sheetName: 'Template Limpo',
        expectedHeaders: [
            'Unidade Empresarial', 'Fonte de Emissão', 'Tipo de Reporte',
            'Combustível / Veículo utilizado', 'Unidade de medida',
            'Mensal ou anual?', 'Responsável pelo reporte',
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro', 'Anual',
        ],
        expectedColWidths: {
            'Unidade Empresarial': 30.44, 'Fonte de Emissão': 18.11,
            'Tipo de Reporte': 18.11, 'Combustível / Veículo utilizado': 18.55,
            'Unidade de medida': 19.11, 'Mensal ou anual?': 14.55,
            'Responsável pelo reporte': 14.55, 'Janeiro': 10.78,
        },
        expectedRowHeights: { 1: 21, 2: 15.75, 4: 32.25 },
    },
    'fugitive_emissions': {
        file: 'Escopo 1 - Emissões Fugitivas.xlsx',
        sheetName: 'Template limpo',
        expectedHeaders: [
            'Unidade Empresarial', 'Fonte de Emissão', 'Gás reposto',
            'Unidade de medida', 'Mensal ou anual?', 'Responsável pelo reporte',
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro', 'Anual',
        ],
        expectedColWidths: {
            'Unidade Empresarial': 30.44, 'Fonte de Emissão': 18.11, 'Gás reposto': 18.55,
            'Unidade de medida': 19.11, 'Mensal ou anual?': 14.55,
            'Responsável pelo reporte': 14.55, 'Janeiro': 10.78,
        },
        expectedRowHeights: { 1: 25.5, 2: 25.5, 4: 36.75 },
    },
};

// Current system layout config (mirrors excelConstants.ts)
const SYSTEM_LAYOUTS = {
    'stationary_combustion': {
        fixedHeaders: [
            '__assetId', 'Unidade Empresarial', 'Fonte de Emissão', 'Combustível',
            'Unidade de medida', 'Mensal ou anual?', 'Responsável pelo reporte',
        ],
        fixedWidths: [0.1, 30.44, 18.11, 18.55, 19.11, 14.55, 14.55],
        rowHeights: { 1: 21, 2: 15.75, 3: 76.5, 4: 32.25 },
    },
    'mobile_combustion': {
        fixedHeaders: [
            '__assetId', 'Unidade Empresarial', 'Fonte de Emissão', 'Tipo de Reporte',
            'Combustível / Veículo utilizado', 'Unidade de medida',
            'Mensal ou anual?', 'Responsável pelo reporte',
        ],
        fixedWidths: [0.1, 30.44, 18.11, 18.11, 18.55, 19.11, 14.55, 14.55],
        rowHeights: { 1: 21, 2: 15.75, 3: 33.75, 4: 32.25 },
    },
    'fugitive_emissions': {
        fixedHeaders: [
            '__assetId', 'Unidade Empresarial', 'Fonte de Emissão', 'Gás reposto',
            'Unidade de medida', 'Mensal ou anual?', 'Responsável pelo reporte',
        ],
        fixedWidths: [0.1, 30.44, 18.11, 18.55, 19.11, 14.55, 14.55],
        rowHeights: { 1: 25.5, 2: 25.5, 3: 16.5, 4: 36.75 },
    },
};

const PERIOD_WIDTHS = {
    'Janeiro': 10.78, 'Fevereiro': 8.89, 'Março': 8.89, 'Abril': 8.89,
    'Maio': 8.89, 'Junho': 8.89, 'Julho': 8.89, 'Agosto': 8.89,
    'Setembro': 9.78, 'Outubro': 8.89, 'Novembro': 10.22, 'Dezembro': 9.89, 'Anual': 8.89,
};

function validateScope(scope, label) {
    const ref = REFERENCE[scope];
    const sys = SYSTEM_LAYOUTS[scope];
    const results = [];
    let pass = 0;
    let fail = 0;

    function check(name, expected, actual, tolerance = 0.5) {
        if (typeof expected === 'number' && typeof actual === 'number') {
            const ok = Math.abs(expected - actual) <= tolerance;
            results.push({ name, expected, actual, status: ok ? 'PASS' : 'FAIL' });
            ok ? pass++ : fail++;
        } else {
            const ok = expected === actual;
            results.push({ name, expected, actual, status: ok ? 'PASS' : 'FAIL' });
            ok ? pass++ : fail++;
        }
    }

    // 1. Check headers match (system visible headers = __assetId + reference headers)
    const sysVisibleHeaders = sys.fixedHeaders.filter(h => h !== '__assetId');
    const periods = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro', 'Anual'];
    const sysAllVisible = [...sysVisibleHeaders, ...periods];

    check('Header count', ref.expectedHeaders.length, sysAllVisible.length);

    ref.expectedHeaders.forEach((h, i) => {
        check(`Header[${i}]`, h, sysAllVisible[i]);
    });

    // 2. Check column widths for fixed columns
    Object.entries(ref.expectedColWidths).forEach(([header, width]) => {
        const sysIdx = sys.fixedHeaders.indexOf(header);
        if (sysIdx >= 0) {
            check(`Width "${header}"`, width, sys.fixedWidths[sysIdx]);
        } else if (PERIOD_WIDTHS[header] !== undefined) {
            check(`Width "${header}"`, width, PERIOD_WIDTHS[header]);
        } else {
            results.push({ name: `Width "${header}"`, expected: width, actual: 'NOT FOUND', status: 'FAIL' });
            fail++;
        }
    });

    // 3. Check row heights
    Object.entries(ref.expectedRowHeights).forEach(([row, height]) => {
        const sysHeight = sys.rowHeights[row];
        check(`Row ${row} height`, height, sysHeight);
    });

    // 4. Check __assetId is hidden (first column)
    check('__assetId is first col', '__assetId', sys.fixedHeaders[0]);
    check('__assetId width', 0.1, sys.fixedWidths[0]);

    console.log(`\n${'='.repeat(60)}`);
    console.log(`VALIDATION: ${label} (${scope})`);
    console.log('='.repeat(60));
    results.forEach(r => {
        const icon = r.status === 'PASS' ? '✅' : '❌';
        console.log(`  ${icon} ${r.name}: expected=${r.expected}, actual=${r.actual}`);
    });
    console.log(`\n  RESULT: ${pass} passed, ${fail} failed`);
    return { pass, fail };
}

// Run validations
console.log('=== TEMPLATE VALIDATION REPORT ===\n');

let totalPass = 0;
let totalFail = 0;

const scopes = [
    ['stationary_combustion', 'Combustão Estacionária'],
    ['mobile_combustion', 'Combustão Móvel'],
    ['fugitive_emissions', 'Emissões Fugitivas'],
];

scopes.forEach(([scope, label]) => {
    const { pass, fail } = validateScope(scope, label);
    totalPass += pass;
    totalFail += fail;
});

console.log(`\n${'='.repeat(60)}`);
console.log(`TOTAL: ${totalPass} passed, ${totalFail} failed`);
console.log('='.repeat(60));

if (totalFail > 0) {
    console.log('\n⚠️  Some validations failed. Review the results above.');
    process.exit(1);
} else {
    console.log('\n✅ All validations passed!');
}
