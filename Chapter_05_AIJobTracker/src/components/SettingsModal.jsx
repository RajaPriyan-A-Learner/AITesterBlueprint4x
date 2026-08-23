import { useState } from 'react';
import {
  X,
  Settings,
  Server,
  Cloud,
  CheckCircle,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Sparkles,
  Save,
  Check,
} from 'lucide-react';
import {
  getAISettings,
  saveAISettings,
  testOllamaConnection,
  testCloudConnection,
} from '../services/aiService';

export default function SettingsModal({ isOpen, onClose }) {
  const [settings, setSettings] = useState(() => getAISettings());
  const [activeTab, setActiveTab] = useState(settings.provider === 'ollama' ? 'ollama' : 'cloud');

  // Test states
  const [testingOllama, setTestingOllama] = useState(false);
  const [ollamaResult, setOllamaResult] = useState(null);

  const [testingCloud, setTestingCloud] = useState(false);
  const [cloudResult, setCloudResult] = useState(null);

  const [showApiKey, setShowApiKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleTestOllama = async () => {
    setTestingOllama(true);
    setOllamaResult(null);
    const res = await testOllamaConnection(settings.ollamaUrl, settings.ollamaModel);
    setOllamaResult(res);
    setTestingOllama(false);
  };

  const handleTestCloud = async () => {
    setTestingCloud(true);
    setCloudResult(null);
    const res = await testCloudConnection(
      settings.provider === 'ollama' ? 'gemini' : settings.provider,
      settings.cloudApiKey,
      settings.cloudModel
    );
    setCloudResult(res);
    setTestingCloud(false);
  };

  const handleSave = () => {
    saveAISettings(settings);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />

      {/* Modal Box */}
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl z-10 flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-xs">
              <Settings size={16} />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white text-base">
                AI & Model Settings
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure your Local Ollama server or Cloud AI model API keys.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-4 pb-0 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => {
              setActiveTab('ollama');
              setSettings((s) => ({ ...s, provider: 'ollama' }));
            }}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'ollama'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Server size={14} />
            <span>Local Ollama</span>
            {settings.provider === 'ollama' && (
              <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                Active
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('cloud');
              setSettings((s) => ({ ...s, provider: s.provider === 'ollama' ? 'gemini' : s.provider }));
            }}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'cloud'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Cloud size={14} />
            <span>Cloud Models (Gemini / OpenAI)</span>
            {settings.provider !== 'ollama' && (
              <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                Active
              </span>
            )}
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 space-y-5">
          {activeTab === 'ollama' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Ollama Server URL
                </label>
                <input
                  type="text"
                  value={settings.ollamaUrl}
                  onChange={(e) => setSettings({ ...settings, ollamaUrl: e.target.value })}
                  placeholder="http://localhost:11434"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Default Model Name
                </label>
                <input
                  type="text"
                  value={settings.ollamaModel}
                  onChange={(e) => setSettings({ ...settings, ollamaModel: e.target.value })}
                  placeholder="gemma3:1b, llama3.2, mistral, qwen2.5-coder"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              {/* Ollama Connection Test Button */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleTestOllama}
                  disabled={testingOllama}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 flex items-center gap-2 transition-all cursor-pointer"
                >
                  {testingOllama ? <Loader2 size={13} className="animate-spin" /> : <Server size={13} />}
                  <span>{testingOllama ? 'Testing Connection...' : 'Test Ollama Connection'}</span>
                </button>
              </div>

              {/* Ollama Test Status Display */}
              {ollamaResult && (
                <div
                  className={`p-3 rounded-xl border text-xs space-y-2 animate-in fade-in ${
                    ollamaResult.success
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                      : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold">
                    {ollamaResult.success ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
                    <span>{ollamaResult.success ? 'Connection Successful!' : 'Connection Failed'}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    {ollamaResult.message || ollamaResult.error}
                  </p>

                  {ollamaResult.models?.length > 0 && (
                    <div className="pt-1">
                      <span className="text-[10px] font-bold block mb-1">Installed Models:</span>
                      <div className="flex flex-wrap gap-1">
                        {ollamaResult.models.map((m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setSettings({ ...settings, ollamaModel: m })}
                            className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-all cursor-pointer ${
                              settings.ollamaModel === m
                                ? 'bg-emerald-700 text-white border-emerald-600'
                                : 'bg-white dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                            }`}
                          >
                            {m} {settings.ollamaModel === m && '✓'}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Cloud Provider
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, provider: 'gemini', cloudModel: 'gemini-1.5-flash' })}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      settings.provider === 'gemini'
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <span>Google Gemini</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, provider: 'openai', cloudModel: 'gpt-4o-mini' })}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      settings.provider === 'openai'
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <span>OpenAI (GPT-4o)</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  {settings.provider === 'openai' ? 'OpenAI API Key' : 'Gemini API Key'}
                </label>
                <div className="relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={settings.cloudApiKey}
                    onChange={(e) => setSettings({ ...settings, cloudApiKey: e.target.value })}
                    placeholder={settings.provider === 'openai' ? 'sk-...' : 'AIzaSy...'}
                    className="w-full pl-3.5 pr-10 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showApiKey ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Model Identifier
                </label>
                <input
                  type="text"
                  value={settings.cloudModel}
                  onChange={(e) => setSettings({ ...settings, cloudModel: e.target.value })}
                  placeholder="gemini-1.5-flash, gemini-1.5-pro, gpt-4o-mini"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              {/* Cloud Connection Test Button */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleTestCloud}
                  disabled={testingCloud || !settings.cloudApiKey}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {testingCloud ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
                  <span>{testingCloud ? 'Verifying Key...' : 'Test API Key'}</span>
                </button>
              </div>

              {/* Cloud Test Status Display */}
              {cloudResult && (
                <div
                  className={`p-3 rounded-xl border text-xs space-y-1 animate-in fade-in ${
                    cloudResult.success
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                      : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold">
                    {cloudResult.success ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
                    <span>{cloudResult.success ? 'API Key Valid!' : 'API Test Failed'}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    {cloudResult.message || cloudResult.error}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Footer Save Button */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Active Mode: <strong className="text-indigo-600 dark:text-indigo-400 capitalize">{settings.provider}</strong>
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {savedSuccess ? <Check size={14} /> : <Save size={14} />}
                <span>{savedSuccess ? 'Saved!' : 'Save Settings'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
