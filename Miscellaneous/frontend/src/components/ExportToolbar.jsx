import React, { useState } from 'react';
import { FileText, FileCode, FileSpreadsheet, Copy, Check, Download } from 'lucide-react';
import { exportToTxt, exportToMd, exportToDocx, copyToClipboard } from '../services/exportService';

export default function ExportToolbar({ content, title = 'Extracted Document' }) {
  const [copied, setCopied] = useState(false);
  const [isExportingDocx, setIsExportingDocx] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(content);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExportTxt = () => {
    const safeName = title.toLowerCase().replace(/[^a-z0-9]/g, '_');
    exportToTxt(content, `${safeName}_extracted.txt`);
  };

  const handleExportMd = () => {
    const safeName = title.toLowerCase().replace(/[^a-z0-9]/g, '_');
    exportToMd(content, `${safeName}_extracted.md`);
  };

  const handleExportDocx = async () => {
    try {
      setIsExportingDocx(true);
      const safeName = title.toLowerCase().replace(/[^a-z0-9]/g, '_');
      await exportToDocx(content, title, `${safeName}_extracted.docx`);
    } finally {
      setIsExportingDocx(false);
    }
  };

  if (!content) return null;

  return (
    <div className="export-toolbar">
      <span className="export-label">Export as:</span>

      {/* 1. TXT */}
      <button
        type="button"
        onClick={handleExportTxt}
        title="Download Plain Text (.txt)"
        className="btn-export txt"
      >
        <FileText size={14} />
        <span>.TXT</span>
        <Download size={12} style={{ opacity: 0.6 }} />
      </button>

      {/* 2. MD */}
      <button
        type="button"
        onClick={handleExportMd}
        title="Download Markdown (.md)"
        className="btn-export md"
      >
        <FileCode size={14} />
        <span>.MD</span>
        <Download size={12} style={{ opacity: 0.6 }} />
      </button>

      {/* 3. DOCX */}
      <button
        type="button"
        onClick={handleExportDocx}
        disabled={isExportingDocx}
        title="Download Microsoft Word (.docx)"
        className="btn-export docx"
      >
        <FileSpreadsheet size={14} />
        <span>{isExportingDocx ? 'Generating...' : '.DOCX'}</span>
        <Download size={12} style={{ opacity: 0.6 }} />
      </button>

      {/* Copy Clipboard */}
      <button
        type="button"
        onClick={handleCopy}
        title="Copy text to clipboard"
        className="btn-export copy"
      >
        {copied ? (
          <>
            <Check size={14} color="#34d399" />
            <span style={{ color: '#34d399' }}>Copied!</span>
          </>
        ) : (
          <>
            <Copy size={14} />
            <span>Copy</span>
          </>
        )}
      </button>
    </div>
  );
}
