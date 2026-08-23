import React from 'react';
import { AlignLeft, Table, Sparkles, Bug, FileJson, SpellCheck } from 'lucide-react';

const QUICK_PROMPTS = [
  {
    icon: AlignLeft,
    label: 'Extract & Format Text',
    prompt: 'Please extract all the text clearly and format it with appropriate headings, paragraphs, and bullet points.',
  },
  {
    icon: Table,
    label: 'Convert to Markdown Table',
    prompt: 'Extract the data from this image/screenshot and organize it into a clean, structured Markdown table.',
  },
  {
    icon: Sparkles,
    label: 'Summarize Key Points',
    prompt: 'Extract the content from this image and provide a concise executive summary with top takeaways.',
  },
  {
    icon: Bug,
    label: 'Generate QA Bug Report',
    prompt: 'Based on this screenshot and extracted content, format a structured QA Bug Report including Title, Steps to Reproduce, Expected Result, Actual Result, and Severity.',
  },
  {
    icon: FileJson,
    label: 'Extract as JSON',
    prompt: 'Extract the structured data from this screenshot and present it as valid JSON schema with key-value pairs.',
  },
  {
    icon: SpellCheck,
    label: 'Clean & Fix OCR Errors',
    prompt: 'Review the extracted text, correct any OCR typos or misread characters, and present the polished version.',
  },
];

export default function QuickPrompts({ onSelectPrompt, disabled }) {
  return (
    <div className="quick-prompts-bar">
      <span className="quick-label">Quick Actions:</span>
      {QUICK_PROMPTS.map((item, idx) => {
        const Icon = item.icon;
        return (
          <button
            key={idx}
            type="button"
            disabled={disabled}
            onClick={() => onSelectPrompt(item.prompt)}
            className="quick-chip"
          >
            <Icon size={14} color="#818cf8" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
