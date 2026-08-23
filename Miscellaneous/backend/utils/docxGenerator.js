import { Document, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle } from 'docx';

/**
 * Converts markdown/text content into DOCX document structure
 * @param {string} title
 * @param {string} content
 * @returns {Document}
 */
export function generateDocxFromText(title, content) {
  const lines = content.split('\n');
  const docElements = [];

  // Add Document Header
  docElements.push(
    new Paragraph({
      text: title || 'Extracted & Processed Content',
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 300 },
    })
  );

  // Timestamp metadata
  docElements.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `Generated on: ${new Date().toLocaleString()} | Powered by Local Ollama & Vision OCR`,
          italics: true,
          color: '666666',
          size: 18,
        }),
      ],
      spacing: { after: 400 },
    })
  );

  let inCodeBlock = false;
  let codeBlockLines = [];

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Code block detection
    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        // End code block
        docElements.push(
          new Paragraph({
            children: [
              new TextRun({
                text: codeBlockLines.join('\n'),
                font: 'Consolas',
                size: 20,
                color: '2D3748',
              }),
            ],
            spacing: { before: 150, after: 150 },
          })
        );
        codeBlockLines = [];
        inCodeBlock = false;
      } else {
        // Start code block
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockLines.push(rawLine);
      continue;
    }

    // Headings
    if (trimmed.startsWith('### ')) {
      docElements.push(
        new Paragraph({
          text: trimmed.replace('### ', ''),
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 240, after: 120 },
        })
      );
    } else if (trimmed.startsWith('## ')) {
      docElements.push(
        new Paragraph({
          text: trimmed.replace('## ', ''),
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300, after: 140 },
        })
      );
    } else if (trimmed.startsWith('# ')) {
      docElements.push(
        new Paragraph({
          text: trimmed.replace('# ', ''),
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 360, after: 160 },
        })
      );
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      // Bullet list
      docElements.push(
        new Paragraph({
          children: parseFormattedRuns(trimmed.substring(2)),
          bullet: { level: 0 },
          spacing: { after: 100 },
        })
      );
    } else if (/^\d+\.\s/.test(trimmed)) {
      // Numbered list
      const text = trimmed.replace(/^\d+\.\s/, '');
      docElements.push(
        new Paragraph({
          children: parseFormattedRuns(text),
          bullet: { level: 0 },
          spacing: { after: 100 },
        })
      );
    } else if (trimmed.length > 0) {
      // Regular paragraph
      docElements.push(
        new Paragraph({
          children: parseFormattedRuns(trimmed),
          spacing: { after: 140 },
        })
      );
    } else {
      // Empty line spacer
      docElements.push(
        new Paragraph({
          text: '',
          spacing: { after: 100 },
        })
      );
    }
  }

  return new Document({
    sections: [
      {
        properties: {},
        children: docElements,
      },
    ],
  });
}

/**
 * Basic markdown bold/italic/code parser for TextRuns
 * @param {string} text
 * @returns {TextRun[]}
 */
function parseFormattedRuns(text) {
  const runs = [];
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);

  for (const part of parts) {
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      runs.push(new TextRun({ text: part.slice(2, -2), bold: true }));
    } else if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
      runs.push(new TextRun({ text: part.slice(1, -1), italics: true }));
    } else if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      runs.push(new TextRun({ text: part.slice(1, -1), font: 'Consolas', color: 'C7254E' }));
    } else if (part.length > 0) {
      runs.push(new TextRun({ text: part }));
    }
  }

  return runs.length > 0 ? runs : [new TextRun({ text })];
}
