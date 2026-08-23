const API_BASE = '/api';

/**
 * Fetch available models from backend or directly from Ollama
 */
export async function getInstalledModels() {
  try {
    const res = await fetch(`${API_BASE}/models`);
    if (res.ok) {
      const data = await res.json();
      if (data.models && data.models.length > 0) {
        return data.models;
      }
    }
  } catch (err) {
    console.warn('Backend proxy /api/models unreachable, trying direct Ollama localhost:11434...', err);
  }

  // Fallback direct call to Ollama (in case backend is down)
  try {
    const directRes = await fetch('http://127.0.0.1:11434/api/tags');
    if (directRes.ok) {
      const directData = await directRes.json();
      return directData.models || [];
    }
  } catch (directErr) {
    console.error('Direct Ollama call failed:', directErr);
  }

  return [];
}

/**
 * Check backend and Ollama connectivity
 */
export async function checkHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    return { status: 'offline', error: e.message };
  }
  return { status: 'offline' };
}

/**
 * Send chat message to local Ollama with streaming support
 * @param {Object} params
 * @param {string} params.model
 * @param {Array} params.messages
 * @param {Function} [params.onChunk]
 * @param {AbortSignal} [params.signal]
 * @returns {Promise<string>}
 */
export async function sendChatMessage({ model, messages, onChunk, signal }) {
  // First try backend proxy
  try {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages,
        stream: true,
      }),
      signal,
    });

    if (!res.ok) {
      const errorJson = await res.json().catch(() => ({}));
      throw new Error(errorJson.error || `Server responded with ${res.status}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const parsed = JSON.parse(line.substring(6));
            const content = parsed.message?.content || parsed.response || '';
            if (content) {
              fullResponse += content;
              if (onChunk) onChunk(content, fullResponse);
            }
          } catch (e) {
            // Ignore partial json parse errors in streaming chunk
          }
        }
      }
    }

    return fullResponse;
  } catch (err) {
    // If backend is unavailable, fallback to direct Ollama call
    console.warn('Backend chat failed, attempting direct Ollama call...', err);

    const directRes = await fetch('http://127.0.0.1:11434/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages,
        stream: true,
      }),
      signal,
    });

    if (!directRes.ok) {
      throw new Error(`Ollama error: ${directRes.statusText}`);
    }

    const reader = directRes.body.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.trim()) {
          try {
            const parsed = JSON.parse(line);
            const content = parsed.message?.content || parsed.response || '';
            if (content) {
              fullResponse += content;
              if (onChunk) onChunk(content, fullResponse);
            }
          } catch (e) {}
        }
      }
    }

    return fullResponse;
  }
}
