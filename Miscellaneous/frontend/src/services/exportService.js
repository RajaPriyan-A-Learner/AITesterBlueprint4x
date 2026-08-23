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
 * Robust local file downloader that prevents Chrome ERR_FILE_NOT_FOUND blob revocation errors.
 * Saves files directly to the local computer without requiring any cloud storage.
 * 
 * @param {Blob} blob 
 * @param {string} filename 
 */
export function triggerLocalDownload(blob, filename) {
  try {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    // Attach to body and trigger native browser file save
    document.body.appendChild(link);
    link.click();

    // Retain object URL in memory for 2 minutes to prevent ERR_FILE_NOT_FOUND if user clicks open from browser download shelf
    setTimeout(() => {
      if (document.body.contains(link)) {
        document.body.removeChild(link);
      }
      window.URL.revokeObjectURL(url);
    }, 120000);

    triggerSuccessEffect();
    return true;
  } catch (err) {
    console.error('Local file download error:', err);
    return false;
  }
}

/**
 * Export content as Plain Text (.txt) directly to local storage
 * @param {string} content
 * @param {string} [filename]
 */
export function exportToTxt(content, filename = 'extracted_text.txt') {
  const safeName = filename.endsWith('.txt') ? filename : `${filename}.txt`;
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  triggerLocalDownload(blob, safeName);
}

/**
 * Export content as Markdown (.md) directly to local storage
 * @param {string} content
 * @param {string} [filename]
 */
export function exportToMd(content, filename = 'extracted_document.md') {
  const safeName = filename.endsWith('.md') ? filename : `${filename}.md`;
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  triggerLocalDownload(blob, safeName);
}

/**
 * Export content as Microsoft Word Document (.docx) directly to local storage
 * @param {string} content
 * @param {string} [title]
 * @param {string} [filename]
 */
export async function exportToDocx(content, title = 'Extracted Document', filename = 'document.docx') {
  const safeName = filename.endsWith('.docx') ? filename : `${filename}.docx`;

  try {
    // Try backend proxy if active
    const res = await fetch('/api/export-docx', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    });

    if (res.ok) {
      const blob = await res.blob();
      const docxBlob = new Blob([blob], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      triggerLocalDownload(docxBlob, safeName);
      return;
    }
  } catch (err) {
    console.warn('Backend docx export skipped, generating client-side docx:', err);
  }

  // Client-side docx generation fallback
  const lines = (content || '').split('\n');
  const docElements = [];

  // Title
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
  const docxBlob = new Blob([blob], {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  });
  triggerLocalDownload(docxBlob, safeName);
}

/**
 * Copy text to clipboard with modern API and fallback for older environments
 * @param {string} text
 * @returns {Promise<boolean>}
 */
export async function copyToClipboard(text) {
  if (!text) return false;

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      triggerSuccessEffect();
      return true;
    }
  } catch (err) {
    console.warn('navigator.clipboard failed, attempting fallback textarea copy:', err);
  }

  // Fallback for non-secure contexts or permission restrictions
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    if (successful) {
      triggerSuccessEffect();
      return true;
    }
  } catch (err) {
    console.error('Fallback copy to clipboard failed:', err);
  }

  return false;
}

