import express from 'express';
import cors from 'cors';
import { Packer } from 'docx';
import { generateDocxFromText } from './utils/docxGenerator.js';

const app = express();
const PORT = process.env.PORT || 5001;
const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434';

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Local Ollama Vision & OCR Chatbot Backend',
    ollamaHost: OLLAMA_HOST,
    timestamp: new Date().toISOString(),
  });
});

// Get available models from local Ollama
app.get('/api/models', async (req, res) => {
  try {
    const response = await fetch(`${OLLAMA_HOST}/api/tags`);
    if (!response.ok) {
      throw new Error(`Ollama returned status ${response.status}`);
    }
    const data = await response.json();
    const models = (data.models || []).map((m) => ({
      name: m.name,
      model: m.model,
      size: m.size,
      modified_at: m.modified_at,
      details: m.details,
      capabilities: m.capabilities || [],
    }));
    res.json({ success: true, models });
  } catch (error) {
    console.error('Error fetching Ollama models:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to connect to local Ollama. Please ensure Ollama is running (`ollama serve`).',
      details: error.message,
    });
  }
});

// Chat endpoint (proxies to Ollama /api/chat with streaming or non-streaming)
app.post('/api/chat', async (req, res) => {
  try {
    const { model, messages, stream = false, options = {} } = req.body;

    if (!model || !messages || !Array.isArray(messages)) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: model and messages array.',
      });
    }

    const payload = {
      model,
      messages,
      stream,
      options,
    };

    const ollamaResponse = await fetch(`${OLLAMA_HOST}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!ollamaResponse.ok) {
      const errText = await ollamaResponse.text();
      throw new Error(`Ollama error (${ollamaResponse.status}): ${errText}`);
    }

    if (stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const reader = ollamaResponse.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        res.write(`data: ${chunk}\n\n`);
      }
      res.end();
    } else {
      const data = await ollamaResponse.json();
      res.json({ success: true, data });
    }
  } catch (error) {
    console.error('Chat error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// DOCX Generation Endpoint
app.post('/api/export-docx', async (req, res) => {
  try {
    const { title = 'Extracted Document', content = '' } = req.body;

    if (!content) {
      return res.status(400).json({ success: false, error: 'Content cannot be empty.' });
    }

    const doc = generateDocxFromText(title, content);
    const buffer = await Packer.toBuffer(doc);

    const safeFilename = `${(title || 'Document').replace(/[^a-zA-Z0-9_-]/g, '_')}_${Date.now()}.docx`;

    res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.send(buffer);
  } catch (error) {
    console.error('Docx generation error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to generate Word document.',
      details: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Ollama Vision & OCR Backend running on port ${PORT}`);
  console.log(`🔗 Connected to Ollama at ${OLLAMA_HOST}`);
  console.log(`====================================================`);
});
