import React from 'react';
import { Bot, RefreshCw, Trash2, Cpu } from 'lucide-react';

export default function Navbar({
  models,
  selectedModel,
  onSelectModel,
  onRefreshModels,
  onClearHistory,
  isOllamaConnected,
  isRefreshing,
}) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Left: Brand Identity */}
        <div className="brand-section">
          <div className="brand-logo">
            <Bot size={22} />
          </div>
          <div className="brand-title-wrap">
            <div className="brand-title-row">
              <span className="brand-title">Vision OCR Chatbot</span>
              <span className="brand-badge">Local LLM</span>
            </div>
            <span className="brand-subtitle">
              Instant Screenshot OCR & 3-Format Multi-Exporter (TXT, MD, DOCX)
            </span>
          </div>
        </div>

        {/* Right: Status & Model Controls */}
        <div className="navbar-controls">
          {/* Status Pill */}
          <div className={`status-pill ${isOllamaConnected ? '' : 'offline'}`}>
            <span className="status-dot" />
            <span>{isOllamaConnected ? 'Ollama Online' : 'Connecting...'}</span>
          </div>

          {/* Model Selector Dropdown */}
          <div className="model-selector-wrap">
            <Cpu size={16} color="#818cf8" />
            <select
              value={selectedModel}
              onChange={(e) => onSelectModel(e.target.value)}
            >
              {models.length > 0 ? (
                models.map((m) => (
                  <option key={m.name} value={m.name}>
                    {m.name} {m.size ? `(${(m.size / (1024 * 1024 * 1024)).toFixed(1)} GB)` : ''}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No models found
                </option>
              )}
            </select>
          </div>

          {/* Refresh Button */}
          <button
            onClick={onRefreshModels}
            disabled={isRefreshing}
            className="icon-btn"
            title="Refresh local models"
          >
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
          </button>

          {/* Clear History Button */}
          <button
            onClick={onClearHistory}
            className="icon-btn danger"
            title="Clear Chat History"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
