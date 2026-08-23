# Implementation Plan - Local Ollama Vision & OCR Chatbot with Multi-Format Export (TXT, MD, DOCX)

Build a local-first, privacy-focused web chatbot application inside `c:\Users\rajap\OneDrive\เอกสาร\LEARNINGAITESTER4X\Miscellaneous` powered by local Ollama LLMs and OCR capabilities. It allows users to paste screenshots or upload images directly, extracts the text instantly, interacts with local Ollama models according to user instructions, and exports the result in 3 distinct formats: **Plain Text (.txt)**, **Markdown (.md)**, and **Microsoft Word (.docx)**.

## User Review Required

> [!IMPORTANT]
> - **Ollama Integration**: The app connects to your local Ollama instance at `http://localhost:11434`. It automatically discovers all installed models (`gemma3:1b`, `qwen3.5:9b`, `llama3.2:latest`, etc.).
> - **Dual Extraction Strategy**: 
>   1. Built-in OCR extraction (Tesseract.js/server OCR) to extract text from screenshots even with non-vision local LLMs (`llama3.2`, `qwen3.5`, `gemma3`).
>   2. Direct multimodal vision support for Ollama vision models (`llama3.2-vision`, `llava`, etc.).
> - **Folder Architecture**: Clean two-folder structure inside `Miscellaneous/`:
>   - `frontend/` (Modern React + Vite UI with instant paste handling, live preview, chat interface, export generators)
>   - `backend/` (Node.js/Express service for Ollama proxying, server-side DOCX/formatting processing, and CORS handling)

---

## Proposed Changes

```
Miscellaneous/
├── backend/
│   ├── package.json
│   ├── server.js              # Ollama API proxy, DOCX export generator, health check
│   └── utils/
│       └── docxGenerator.js   # Rich .docx builder with formatting, tables, headings
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── src/
│   │   ├── App.jsx            # Main Chatbot Shell & Layout
│   │   ├── index.css          # Premium Dark/Light Glassmorphism Theme
│   │   ├── main.jsx
│   │   ├── components/
│   │   │   ├── ChatInterface.jsx     # Message list, conversational timeline
│   │   │   ├── ImagePasteZone.jsx    # Drag-and-drop & clipboard paste listener (Ctrl+V)
│   │   │   ├── ModelSelector.jsx     # Dynamic Ollama model dropdown
│   │   │   ├── ExportToolbar.jsx     # 1-Click TXT, MD, DOCX download & copy triggers
│   │   │   ├── QuickPrompts.jsx      # Instant template prompts (Extract All, Table, Bug Report, etc.)
│   │   │   └── SettingsModal.jsx     # Ollama URL & temperature settings
│   │   └── services/
│   │       ├── ollamaApi.js          # Ollama REST client & streaming handler
│   │       ├── ocrService.js         # Fast client-side OCR extraction
│   │       └── exportService.js      # Client-side TXT, MD, and DOCX generators
├── implementation_plan.md
└── walkthrough.md
```

### Backend (`Miscellaneous/backend`)

#### [NEW] `package.json`
- Minimal Express server with `cors`, `docx`, `multer`, `dotenv`.

#### [NEW] `server.js` & `utils/docxGenerator.js`
- Proxies requests to `http://localhost:11434` to prevent browser CORS issues.
- Provides `/api/models` to fetch installed Ollama models.
- Provides `/api/chat` with streaming and image multimodal support.
- Provides `/api/export-docx` for styled Word document generation.

---

### Frontend (`Miscellaneous/frontend`)

#### [NEW] `package.json` & `vite.config.js`
- React 18, Vite, Lucide React icons, TailwindCSS / Vanilla Modern CSS, `tesseract.js`, `docx`, `file-saver`, `react-markdown`, `remark-gfm`.

#### [NEW] `src/components/ImagePasteZone.jsx`
- Global & focused clipboard paste listener (`window.addEventListener('paste')`).
- Screenshot drag-and-drop and file upload with instant image thumbnail preview, OCR progress bar, and image zoom modal.

#### [NEW] `src/components/ChatInterface.jsx` & `src/components/ExportToolbar.jsx`
- Interactive chat conversation flow with message bubbles showing extracted text, user prompt, and LLM structured response.
- Dedicated Export Bar for each message response offering:
  1. **TXT Format**: Raw clean text download (.txt) + Copy to clipboard.
  2. **Markdown Format**: Formatted markdown (.md) download + rendered preview with code highlighting.
  3. **DOCX Format**: Styled Microsoft Word (.docx) document download with headers, bold text, lists, and tables.

#### [NEW] `src/services/ocrService.js` & `src/services/ollamaApi.js`
- Immediate OCR text extraction upon image paste.
- Seamless combination of extracted text + user query sent to the selected local Ollama model.

---

## Verification Plan

### Automated / Build Verification
- Build frontend: `npm run build` inside `Miscellaneous/frontend`
- Start backend server and test health endpoint `/api/health` and `/api/models`

### Manual Verification
1. Launch the application (`npm run dev` in frontend, `node server.js` in backend).
2. Paste a screenshot from clipboard (`Ctrl+V`) into the chat zone.
3. Verify immediate OCR text extraction and image preview.
4. Send a prompt to local Ollama (e.g. `llama3.2:latest`, `qwen3.5:9b`, or `gemma3:1b`).
5. Verify response generation.
6. Test downloading the result in all 3 formats:
   - Click **Download .txt** -> Verify `.txt` file contents.
   - Click **Download .md** -> Verify `.md` file formatting.
   - Click **Download .docx** -> Open and verify Microsoft Word document structure.
