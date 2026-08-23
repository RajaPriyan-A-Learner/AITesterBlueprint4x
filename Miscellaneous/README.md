# Local Vision OCR Chatbot (Ollama + Multi-Format Export)

An intelligent, privacy-first local AI assistant that extracts text from pasted screenshots/images and formats them using your local **Ollama** LLMs into **3 different formats**: `.txt`, `.md`, and `.docx`.

---

## 📁 Project Structure

```
Miscellaneous/
├── backend/                  # Node.js/Express service
│   ├── server.js             # Ollama proxy, DOCX export API, health check
│   ├── utils/
│   │   └── docxGenerator.js  # Word .docx builder
│   └── package.json
├── frontend/                 # Modern React + Vite Web App
│   ├── src/
│   │   ├── components/       # ImagePasteZone, ExportToolbar, ChatMessage, Navbar, QuickPrompts
│   │   ├── services/         # Tesseract OCR, Ollama API client, Multi-Format Exporters
│   │   ├── App.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── run_app.bat               # 1-Click Windows Launcher
├── implementation_plan.md
└── walkthrough.md
```

---

## 🚀 Quick Start

### Option 1: 1-Click Launch (Windows)
Double-click `run_app.bat` in the `Miscellaneous` folder.

### Option 2: Manual Launch

#### 1. Start the Backend:
```bash
cd Miscellaneous/backend
npm install
npm start
```
*Backend runs on `http://localhost:5001`*

#### 2. Start the Frontend:
```bash
cd Miscellaneous/frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`*

---

## ✨ Features

- 📋 **Universal Screenshot Paste**: Press `Ctrl + V` anywhere to paste a screenshot directly from your clipboard or drag and drop any image.
- ⚡ **Instant OCR Extraction**: Immediately recognizes and extracts all text from images using built-in OCR.
- 🦙 **Local Ollama Integration**: Seamlessly queries your installed models (`gemma3:1b`, `qwen3.5:9b`, `llama3.2:latest`, etc.) with zero data leaving your machine.
- 📦 **3-Way Multi-Format Export**:
  - 📄 **TXT Format (.txt)**: Clean plain text download & instant clipboard copy.
  - 📑 **Markdown Format (.md)**: Rendered markdown with headings, code highlighting, tables, and `.md` file download.
  - 📘 **Microsoft Word Format (.docx)**: Stylized Word document download with formatted headings, bullet points, and sections.
- 💡 **Quick Prompts**: One-click actions for formatting as Markdown tables, QA bug reports, JSON schemas, executive summaries, or OCR typo corrections.
