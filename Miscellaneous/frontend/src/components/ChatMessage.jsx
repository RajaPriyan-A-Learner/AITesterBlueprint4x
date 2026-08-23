import React, { useState } from 'react';
import { Bot, User, Code2, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ExportToolbar from './ExportToolbar';
import { copyToClipboard } from '../services/exportService';

export default function ChatMessage({ message, isStreaming }) {
  const isUser = message.role === 'user';
  const [showRaw, setShowRaw] = useState(false);
  const [extractedExpanded, setExtractedExpanded] = useState(false);
  const [extractedCopied, setExtractedCopied] = useState(false);

  return (
    <div className={`chat-bubble ${isUser ? 'user' : 'assistant'}`}>
      {/* Avatar */}
      <div className="bubble-avatar">
        {isUser ? <User size={18} /> : <Bot size={18} />}
      </div>

      {/* Bubble Body */}
      <div className="bubble-body">
        <div className="bubble-header">
          <div>
            <span className="sender-name">
              {isUser ? 'You' : `Assistant (${message.model || 'Local Ollama'})`}
            </span>
            <span className="message-time">
              {message.timestamp
                ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : ''}
            </span>
          </div>

          {!isUser && message.content && (
            <button
              onClick={() => setShowRaw(!showRaw)}
              className="quick-chip"
              style={{ padding: '3px 8px', fontSize: '0.72rem' }}
            >
              <Code2 size={12} />
              <span>{showRaw ? 'Rendered Markdown' : 'Raw Text'}</span>
            </button>
          )}
        </div>

        {/* User Attached Image */}
        {isUser && message.image && (
          <div className="image-preview-badge">
            <img src={message.image.dataUrl} alt="Attached screenshot" />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>
              <span>{message.image.name}</span>
              <span>{(message.image.size / 1024).toFixed(1)} KB</span>
            </div>
          </div>
        )}

        {/* Extracted Text Box */}
        {isUser && message.extractedText && (
          <div className="extracted-box">
            <div className="extracted-box-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>📄 Extracted OCR Text:</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={async () => {
                    await copyToClipboard(message.extractedText);
                    setExtractedCopied(true);
                    setTimeout(() => setExtractedCopied(false), 2000);
                  }}
                  style={{
                    background: extractedCopied ? 'rgba(52, 211, 153, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                    border: `1px solid ${extractedCopied ? 'rgba(52, 211, 153, 0.4)' : 'rgba(255, 255, 255, 0.15)'}`,
                    borderRadius: '6px',
                    color: extractedCopied ? '#34d399' : '#e2e8f0',
                    cursor: 'pointer',
                    fontSize: '0.72rem',
                    padding: '3px 8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.2s ease',
                  }}
                  title="Copy extracted OCR text to clipboard"
                >
                  {extractedCopied ? (
                    <>
                      <Check size={12} color="#34d399" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setExtractedExpanded(!extractedExpanded)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#818cf8',
                    cursor: 'pointer',
                    fontSize: '0.72rem',
                    textDecoration: 'underline',
                  }}
                >
                  {extractedExpanded ? 'Collapse' : 'Expand full text'}
                </button>
              </div>
            </div>
            <div className={`extracted-box-text ${extractedExpanded ? 'expanded' : ''}`}>
              {message.extractedText}
            </div>

            {/* Quick Export for Raw Extracted OCR Text */}
            <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <ExportToolbar
                content={message.extractedText}
                title={`Extracted_OCR_${message.image?.name || 'Text'}`}
              />
            </div>
          </div>
        )}

        {/* User Prompt Text */}
        {isUser && (
          <div className="user-text-content">
            {message.content}
          </div>
        )}

        {/* Assistant Markdown Content */}
        {!isUser && (
          <div>
            {showRaw ? (
              <pre style={{ background: '#060911', padding: '12px', borderRadius: '8px', overflowX: 'auto', fontSize: '0.82rem' }}>
                <code>{message.content}</code>
              </pre>
            ) : (
              <div className="markdown-body">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.content || ''}
                </ReactMarkdown>
                {isStreaming && (
                  <span style={{ display: 'inline-block', width: '8px', height: '16px', background: '#6366f1', marginLeft: '4px', verticalAlign: 'middle' }} />
                )}
              </div>
            )}

            {/* 3-Format Multi-Export Toolbar */}
            {!isStreaming && message.content && (
              <ExportToolbar
                content={message.content}
                title={`Extraction_${message.model || 'Ollama'}`}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
