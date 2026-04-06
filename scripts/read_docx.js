const mammoth = require('mammoth');
const path = require('path');
const fs = require('fs');

const filePath = path.join(__dirname, '..', 'Comentários_2026.03.25 (1).docx');

mammoth.extractRawText({path: filePath})
  .then(result => {
    const outputPath = path.join(__dirname, '..', 'comentarios_extracted.txt');
    fs.writeFileSync(outputPath, result.value, 'utf-8');
    console.log('Text extracted to:', outputPath);
    console.log('Length:', result.value.length, 'chars');
  })
  .catch(err => console.error('Error:', err));
