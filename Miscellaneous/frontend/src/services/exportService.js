import { saveAs } from 'file-saver';
import { Document, Paragraph, TextRun, HeadingLevel, Packer } from 'docx';
import confetti from 'canvas-confetti';

/**
 * Triggers a subtle confetti celebration on export/copy
 */
export function triggerSuccessEffect() {
  try {
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.85 },
      colors: ['#6366f1', '#8b5cf6', '#ec4899', '#38bdf8'],
    });
  } catch (e) {
    // Ignore in unsupported environments
  }
}

/**
 * Export content as Plain Text (.txt)
 * @param {string} content
 * @param {string} [filename]
 */
export function exportToTxt(content, filename = 'extracted_text.txt') {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, filename.endsWith('.txt') ? filename : `${filename}.txt`);
  triggerSuccessEffect();
}

/**
 * Export content as Markdown (.md)
 * @param {string} content
 * @param {string} [filename]
 */
export function exportToMd(content, filename = 'extracted_document.md') {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  saveAs(blob, filename.endsWith('.md') ? filename : `${filename}.md`);
  triggerSuccessEffect();
}

/**
 * Export content as Microsoft Word Document (.docx)
 * @param {string} content
 * @param {string} [title]
 * @param {string} [filename]
 */
export async function exportToDocx(content, title = 'Extracted Document', filename = 'document.docx') {
  try {
    // First attempt: call backend proxy for docx buffer
    const res = await fetch('/api/export-docx', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    });

    if (res.ok) {
      const blob = await res.blob();
      saveAs(blob, filename.endsWith('.docx') ? filename : `${filename}.docx`);
      triggerSuccessEffect();
      return;
    }
  } catch (err) {
    console.warn('Backend docx export failed, fallback to client-side docx generator:', err);
  }

  // Fallback: Client-side docx generation
  const lines = content.split('\n');
  const docElements = [];

  // Document Title
  docElements.push(
    new Paragraph({
      text: title,
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 300 },
    })
  );

  // Metadata
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
      spacing: { after: 300 },
    })
  );

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('### ')) {
      docElements.push(
        new Paragraph({
          text: trimmed.replace('### ', ''),
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 200, after: 100 },
        })
      );
    } else if (trimmed.startsWith('## ')) {
      docElements.push(
        new Paragraph({
          text: trimmed.replace('## ', ''),
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 260, after: 120 },
        })
      );
    } else if (trimmed.startsWith('# ')) {
      docElements.push(
        new Paragraph({
          text: trimmed.replace('# ', ''),
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 320, after: 140 },
        })
      );
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      docElements.push(
        new Paragraph({
          text: trimmed.substring(2),
          bullet: { level: 0 },
          spacing: { after: 80 },
        })
      );
    } else if (trimmed.length > 0) {
      docElements.push(
        new Paragraph({
          text: trimmed,
          spacing: { after: 120 },
        })
      );
    }
  }

  const doc = new Document({
    sections: [{ children: docElements }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, filename.endsWith('.docx') ? filename : `${filename}.docx`);
  triggerSuccessEffect();
}

/**
 * Copy text to clipboard
 * @param {string} text
 * @returns {Promise<boolean>}
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    triggerSuccessEffect();
    return true;
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
}
