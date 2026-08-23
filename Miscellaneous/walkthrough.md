# Walkthrough - Local Vision OCR Chatbot (Ollama + TXT / MD / DOCX Export)

Successfully built and verified the local-first **Vision OCR Chatbot** in [`Miscellaneous/`](file:///c:/Users/rajap/OneDrive/เอกสาร/LEARNINGAITESTER4X/Miscellaneous). It features a clean 2-folder architecture (`frontend/` and `backend/`), connects to local Ollama LLMs, accepts screenshots via clipboard paste (`Ctrl+V`) or drag-and-drop, instantly extracts text, and provides 3-way export options: **TXT**, **Markdown (.md)**, and **Microsoft Word (.docx)**.

---

## 📂 Project Architecture

```
Miscellaneous/
├── backend/                       # Node.js Express API & Proxy
│   ├── server.js                  # Ollama /api/tags & /api/chat proxy, DOCX export service
│   ├── utils/
│   │   └── docxGenerator.js       # Formatted Word document generator
│   └── package.json
├── frontend/                      # Modern React 18 + Vite Web App
│   ├── src/
│   │   ├── components/
│   │   │   ├── ImagePasteZone.jsx # Clipboard paste listener (Ctrl+V) & OCR progress bar
│   │   │   ├── ChatMessage.jsx    # Message bubbles with markdown & raw text toggle
│   │   │   ├── ExportToolbar.jsx  # 1-Click .TXT, .MD, .DOCX download & Copy buttons
│   │   │   ├── Navbar.jsx         # Model selector & Ollama status indicator
│   │   │   └── QuickPrompts.jsx   # Ready-made prompt chips (Table, Bug Report, Summary)
│   │   ├── services/
│   │   │   ├── ocrService.js      # Canvas preprocessed Tesseract.js OCR with full character whitelisting
│   │   │   ├── ollamaApi.js       # Streaming Ollama client with multimodal base64 image pass-through
│   │   │   └── exportService.js   # Multi-format document exporters & clipboard copy
│   │   ├── App.jsx                # Main Chatbot interface
│   │   └── index.css              # Custom Vanilla CSS Glassmorphic theme
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── run_app.bat                    # 1-Click Windows Launcher
├── README.md                      # Documentation & instructions
├── implementation_plan.md
└── walkthrough.md
```

---

## 🌟 Key Features & Improvements

1. **High-Fidelity Special Character & Symbol Recognition**:
   - **Canvas Image Preprocessor**: Upscales screenshots by 2.5x and applies contrast boost/luminance filtering so thin strokes like `/`, `:`, `.`, `_`, `-`, `?`, `&` pop clearly.
   - **Full Character Whitelisting**: Explicitly configured Tesseract character sets to include all punctuation, symbols, slashes, and technical characters.
   - **Dual Vision Support**: Passes the raw base64 image directly to Ollama for multimodal vision models.

2. **Refined Vanilla CSS Glassmorphic UI**:
   - Clean alignment for navbar, hero section, 3 export cards, floating input dock, quick chips, and chat bubbles without CSS framework dependencies.

3. **3-Way Multi-Format Export**:
   - 📄 **Plain Text (.txt)**: Clean plain text download + 1-click clipboard copy.
   - 📑 **Markdown (.md)**: Rendered markdown with syntax highlighting, lists, and tables + `.md` file download.
   - 📘 **Microsoft Word (.docx)**: Stylized Word document with headings, bullet points, and section formatting.

---

## 🚀 How to Run

1. Open [**http://localhost:5173**](http://localhost:5173) in your browser.
2. Paste any screenshot with <kbd>Ctrl + V</kbd>.
3. Select your desired prompt and export format!
