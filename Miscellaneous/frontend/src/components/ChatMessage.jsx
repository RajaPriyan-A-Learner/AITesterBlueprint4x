import React, { useState } from 'react';
import { Bot, User, Code2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ExportToolbar from './ExportToolbar';

export default function ChatMessage({ message, isStreaming }) {
  const isUser = message.role === 'user';
  const [showRaw, setShowRaw] = useState(false);
  const [extractedExpanded, setExtractedExpanded] = useState(false);

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
              <span>📄 Extracted OCR Text:</span>
              <button
                onClick={() => setExtractedExpanded(!extractedExpanded)}
                style={{ background: 'none', border: 'none', color: '#818cf8', cursor: 'pointer', fontSize: '0.72rem' }}
              >
                {extractedExpanded ? 'Collapse' : 'Expand full text'}
              </button>
            </div>
            <div className={`extracted-box-text ${extractedExpanded ? 'expanded' : ''}`}>
              {message.extractedText}
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
