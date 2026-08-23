import React, { useRef, useState, useEffect } from 'react';
import { Upload, X, Eye, Loader2, FileScan } from 'lucide-react';
import { extractTextFromImage } from '../services/ocrService';

export default function ImagePasteZone({
  selectedImage,
  onImageSelected,
  onClearImage,
  onExtractedText,
  isOcrRunning,
  setIsOcrRunning,
}) {
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrStatus, setOcrStatus] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  // Global Clipboard Paste Listener (Ctrl+V)
  useEffect(() => {
    const handlePaste = (e) => {
      const target = e.target;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';
      
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            e.preventDefault();
            processImageFile(blob);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const processImageFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target.result;
      const base64Clean = dataUrl.split(',')[1] || '';

      const imageMeta = {
        file,
        name: file.name || `screenshot_${Date.now()}.png`,
        dataUrl,
        base64: base64Clean,
        size: file.size,
      };

      onImageSelected(imageMeta);

      // Trigger Instant OCR
      try {
        setIsOcrRunning(true);
        setOcrProgress(15);
        setOcrStatus('Initializing OCR engine...');

        const result = await extractTextFromImage(dataUrl, (progress) => {
          setOcrProgress(progress);
          setOcrStatus(`Extracting text... ${progress}%`);
        });

        setOcrProgress(100);
        setOcrStatus('Text extracted successfully!');
        onExtractedText(result.text, imageMeta);
      } catch (err) {
        console.error('OCR Error:', err);
        setOcrStatus(`OCR Error: ${err.message}`);
      } finally {
        setIsOcrRunning(false);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0]);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />

      {/* When NO image is selected */}
      {!selectedImage ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`paste-dropzone ${isDragOver ? 'drag-active' : ''}`}
        >
          <div className="dropzone-icon">
            <Upload size={18} />
          </div>
          <div className="dropzone-text">
            <h4>📋 Paste Screenshot (<kbd className="kbd-badge">Ctrl + V</kbd>) or Click / Drop Image</h4>
            <p>Instant text extraction powered by OCR + Local Ollama formatting</p>
          </div>
        </div>
      ) : (
        /* When image IS selected */
        <div className="selected-image-strip">
          <div className="selected-image-info">
            <img
              src={selectedImage.dataUrl}
              alt="Screenshot preview"
              className="selected-image-thumb"
              onClick={() => setPreviewModalOpen(true)}
              title="Click to preview"
            />
            <div className="selected-image-meta">
              <div className="meta-title-row">
                <span className="meta-filename">{selectedImage.name}</span>
                <span className="meta-filesize">{(selectedImage.size / 1024).toFixed(1)} KB</span>
              </div>

              <div className={`meta-ocr-status ${isOcrRunning ? 'running' : 'done'}`}>
                {isOcrRunning ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    <span>{ocrStatus || 'Extracting text...'}</span>
                  </>
                ) : (
                  <>
                    <FileScan size={13} />
                    <span>Text extracted & ready for query</span>
                  </>
                )}
              </div>

              {isOcrRunning && (
                <div className="ocr-progress-track">
                  <div className="ocr-progress-fill" style={{ width: `${ocrProgress}%` }} />
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setPreviewModalOpen(true)}
              className="icon-btn"
              title="Preview Image"
            >
              <Eye size={16} />
            </button>
            <button
              type="button"
              onClick={onClearImage}
              className="icon-btn danger"
              title="Remove Image"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Image Zoom Modal */}
      {previewModalOpen && selectedImage && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setPreviewModalOpen(false)}
        >
          <div
            style={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh',
              background: '#0f172a',
              borderRadius: '16px',
              padding: '16px',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>{selectedImage.name}</span>
              <button onClick={() => setPreviewModalOpen(false)} className="icon-btn">
                <X size={16} />
              </button>
            </div>
            <img
              src={selectedImage.dataUrl}
              alt="Screenshot full view"
              style={{ maxHeight: '75vh', width: 'auto', maxWidth: '100%', borderRadius: '8px', objectFit: 'contain' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
