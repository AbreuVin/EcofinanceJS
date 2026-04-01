const d = require('./analysis_result.json');
const fs = require('fs');

const summary = d.map(f => {
    return {
        file: f.file,
        sheets: f.sheets.map(s => {
            const hRow = s.rows.find(r => r.num === 4);
            return {
                name: s.name,
                state: s.state,
                rowCount: s.rowCount,
                colCount: s.columnCount,
                commentsCount: s.comments.length,
                columnWidths: Object.fromEntries(s.columns.map(c => [c.letter, { w: c.width, hidden: c.hidden }])),
                rowHeights: Object.fromEntries(s.rows.map(r => [r.num, r.height])),
                headers: hRow ? hRow.cells.map(c => ({ ref: c.ref, val: c.val })) : [],
                mergedCells: s.mergedCells,
                comments: s.comments.map(c => ({ cell: c.cell, note: c.note.substring(0, 200) })),
                titleRow1: s.rows.find(r => r.num === 1)?.cells?.[0]?.val || '',
                instructionRow2: s.rows.find(r => r.num === 2)?.cells?.[0]?.val || '',
                detailRow3: s.rows.find(r => r.num === 3)?.cells?.[0]?.val || '',
                dataRow5Sample: (s.rows.find(r => r.num === 5)?.cells || []).map(c => ({ ref: c.ref, val: c.val })),
            };
        }),
    };
});

fs.writeFileSync('./summary.json', JSON.stringify(summary, null, 2), 'utf8');
console.log('Summary saved');
