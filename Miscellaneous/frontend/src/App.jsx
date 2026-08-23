import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, RefreshCw, AlertCircle, FileText, FileCode, FileSpreadsheet, Bot } from 'lucide-react';
import Navbar from './components/Navbar';
import ImagePasteZone from './components/ImagePasteZone';
import QuickPrompts from './components/QuickPrompts';
import ChatMessage from './components/ChatMessage';
import { getInstalledModels, sendChatMessage } from './services/ollamaApi';

export default function App() {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [isOllamaConnected, setIsOllamaConnected] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Chat State
  const [messages, setMessages] = useState([]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [isOcrRunning, setIsOcrRunning] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Initial load
  const fetchModels = async () => {
    setIsRefreshing(true);
    setErrorMsg('');
    try {
      const modelList = await getInstalledModels();
      if (modelList && modelList.length > 0) {
        setModels(modelList);
        setIsOllamaConnected(true);
        if (!selectedModel || !modelList.some((m) => m.name === selectedModel)) {
          const preferred = modelList.find(
            (m) => m.name.includes('llama3.2') || m.name.includes('qwen3.5') || m.name.includes('gemma')
          );
          setSelectedModel(preferred ? preferred.name : modelList[0].name);
        }
      } else {
        setIsOllamaConnected(false);
        setErrorMsg('No local Ollama models found. Please ensure Ollama is running (`ollama serve`).');
      }
    } catch (err) {
      console.error(err);
      setIsOllamaConnected(false);
      setErrorMsg('Failed to connect to local Ollama.');
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  const handleExtractedText = (text, imgMeta) => {
    setExtractedText(text);
    if (!inputPrompt.trim()) {
      setInputPrompt('Please extract and format all text from this screenshot into structured sections.');
    }
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setExtractedText('');
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear the chat history?')) {
      setMessages([]);
      handleClearImage();
      setInputPrompt('');
    }
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();

    const userPrompt = inputPrompt.trim();
    if (!userPrompt && !selectedImage && !extractedText) return;
    if (isStreaming || isOcrRunning) return;

    if (!selectedModel) {
      setErrorMsg('Please select a local Ollama model first.');
      return;
    }

    setErrorMsg('');

    const userMsgObj = {
      role: 'user',
      content: userPrompt || 'Extract and format the content from this image.',
      image: selectedImage ? { ...selectedImage } : null,
      extractedText: extractedText || null,
      timestamp: new Date().toISOString(),
    };

    let fullUserPrompt = userPrompt;
    if (extractedText) {
      fullUserPrompt = `[Extracted Screenshot OCR Text]:\n"""\n${extractedText}\n"""\n\n[User Instructions]:\n${userPrompt || 'Format and extract all relevant information clearly, preserving all special characters, slashes (/), colons (:), URLs, and technical symbols with exact fidelity.'}`;
    }

    const conversationHistory = messages.map((m) => ({
      role: m.role,
      content: m.content,
      images: m.image?.base64 ? [m.image.base64] : undefined,
    }));

    const ollamaMessages = [
      {
        role: 'system',
        content:
          'You are an expert AI vision and OCR document processing assistant. When presented with extracted OCR text or images, structure the information clearly using Markdown headings, bullet points, code blocks, or tables. CRITICAL: Always preserve and accurately reconstruct technical symbols, URLs (https://, /workspace/, etc.), slashes, colons, hyphens, dots, and code syntax without omitting any special characters.',
      },
      ...conversationHistory,
      {
        role: 'user',
        content: fullUserPrompt,
        images: selectedImage?.base64 ? [selectedImage.base64] : undefined,
      },
    ];

    setMessages((prev) => [...prev, userMsgObj]);
    setInputPrompt('');
    handleClearImage();

    const assistantMsgObj = {
      role: 'assistant',
      model: selectedModel,
      content: '',
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, assistantMsgObj]);
    setIsStreaming(true);

    try {
      abortControllerRef.current = new AbortController();

      await sendChatMessage({
        model: selectedModel,
        messages: ollamaMessages,
        signal: abortControllerRef.current.signal,
        onChunk: (chunk, fullText) => {
          setMessages((prev) => {
            const updated = [...prev];
            const lastIdx = updated.length - 1;
            if (lastIdx >= 0 && updated[lastIdx].role === 'assistant') {
              updated[lastIdx] = {
                ...updated[lastIdx],
                content: fullText,
              };
            }
            return updated;
          });
        },
      });
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Inference Error:', err);
        setErrorMsg(`Generation error: ${err.message}`);
        setMessages((prev) => {
          const updated = [...prev];
          const lastIdx = updated.length - 1;
          if (lastIdx >= 0 && updated[lastIdx].role === 'assistant') {
            updated[lastIdx] = {
              ...updated[lastIdx],
              content: `⚠️ Error during local inference: ${err.message}. Please check if Ollama model '${selectedModel}' is loaded.`,
            };
          }
          return updated;
        });
      }
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="app-container">
      {/* Top Navigation */}
      <Navbar
        models={models}
        selectedModel={selectedModel}
        onSelectModel={setSelectedModel}
        onRefreshModels={fetchModels}
        onClearHistory={handleClearHistory}
        isOllamaConnected={isOllamaConnected}
        isRefreshing={isRefreshing}
      />

      {/* Main Workspace */}
      <main className="main-content">
        {/* Error Alert */}
        {errorMsg && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: '12px',
              padding: '12px 16px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#fca5a5',
              fontSize: '0.85rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} color="#f87171" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={fetchModels}
              className="quick-chip"
              style={{ padding: '4px 10px', fontSize: '0.75rem' }}
            >
              <RefreshCw size={12} /> Retry
            </button>
          </div>
        )}

        {/* Hero State (When Empty) */}
        {messages.length === 0 ? (
          <div className="hero-state">
            <div className="hero-icon">
              <Bot size={34} />
            </div>
            <h2 className="hero-title">
              Paste Any Screenshot & Extract to <span className="gradient-text">TXT, MD, or DOCX</span>
            </h2>
            <p className="hero-desc">
              Powered by local Ollama LLMs with instant OCR extraction. Paste with{' '}
              <kbd className="kbd-badge">Ctrl + V</kbd> or drag and drop any image.
            </p>

            {/* 3 Format Cards */}
            <div className="format-cards-grid">
              <div className="format-card">
                <div className="format-card-icon txt">
                  <FileText size={18} />
                </div>
                <div className="format-card-title">Plain Text (.TXT)</div>
                <div className="format-card-text">Clean raw text formatted for notes and quick clipboard copying.</div>
              </div>

              <div className="format-card">
                <div className="format-card-icon md">
                  <FileCode size={18} />
                </div>
                <div className="format-card-title">Markdown (.MD)</div>
                <div className="format-card-text">Rich markdown with headings, tables, code blocks, and lists.</div>
              </div>

              <div className="format-card">
                <div className="format-card-icon docx">
                  <FileSpreadsheet size={18} />
                </div>
                <div className="format-card-title">MS Word (.DOCX)</div>
                <div className="format-card-text">Ready-to-share Word documents with styled typography & tables.</div>
              </div>
            </div>
          </div>
        ) : (
          /* Active Chat Thread */
          <div className="chat-thread">
            {messages.map((msg, idx) => (
              <ChatMessage
                key={idx}
                message={msg}
                isStreaming={isStreaming && idx === messages.length - 1 && msg.role === 'assistant'}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Bottom Floating Input Dock */}
        <div className="input-dock">
          <div className="dock-card">
            {/* Screenshot Dropzone */}
            <ImagePasteZone
              selectedImage={selectedImage}
              onImageSelected={setSelectedImage}
              onClearImage={handleClearImage}
              onExtractedText={handleExtractedText}
              isOcrRunning={isOcrRunning}
              setIsOcrRunning={setIsOcrRunning}
            />

            {/* Quick Action Chips */}
            <QuickPrompts
              onSelectPrompt={(p) => setInputPrompt(p)}
              disabled={isStreaming || isOcrRunning}
            />

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="input-form-row">
              <textarea
                ref={textareaRef}
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  selectedImage
                    ? 'Ask questions or instruct how to structure the extracted text (Press Enter to Send)...'
                    : 'Type your message or paste screenshot anywhere (Ctrl+V)...'
                }
                rows={2}
                className="chat-textarea"
              />

              <button
                type="submit"
                disabled={
                  isStreaming ||
                  isOcrRunning ||
                  (!inputPrompt.trim() && !selectedImage && !extractedText)
                }
                className="btn-send"
              >
                {isStreaming || isOcrRunning ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    <span>Send</span>
                    <Send size={15} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
