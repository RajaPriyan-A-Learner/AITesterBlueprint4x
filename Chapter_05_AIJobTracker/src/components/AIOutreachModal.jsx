import { useState, useEffect, useCallback } from 'react';
import {
  X,
  Sparkles,
  Copy,
  Check,
  Download,
  FileText,
  MessageSquare,
  Mail,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { generateOutreachMessages } from '../services/aiService';

export default function AIOutreachModal({ isOpen, onClose, job }) {
  const [activeTab, setActiveTab] = useState('coverLetter'); // 'coverLetter' | 'linkedInNote' | 'coldEmail'
  const [tone, setTone] = useState('professional'); // 'professional' | 'direct' | 'enthusiastic'
  const [messages, setMessages] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchMessages = useCallback(async (currentTone) => {
    if (!job) return;
    setGenerating(true);
    try {
      const res = await generateOutreachMessages(job, 'Raja Priyan', currentTone);
      setMessages(res);
    } catch {
      // Fallback
    } finally {
      setGenerating(false);
    }
  }, [job]);

  useEffect(() => {
    if (isOpen && job) {
      setCopied(false);
      fetchMessages(tone);
    }
  }, [isOpen, job, tone, fetchMessages]);

  if (!isOpen || !job) return null;

  const currentContent = messages ? messages[activeTab] || '' : '';

  const handleCopy = async () => {
    if (!currentContent) return;
    try {
      await navigator.clipboard.writeText(currentContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleDownload = () => {
    if (!currentContent) return;
    const blob = new Blob([currentContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${job.company || 'Job'}_${activeTab}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: 'coverLetter', label: 'Cover Letter', icon: FileText },
    { id: 'linkedInNote', label: 'LinkedIn Note (<300 chars)', icon: MessageSquare },
    { id: 'coldEmail', label: 'Hiring Manager Email', icon: Mail },
  ];

  const tones = [
    { id: 'professional', label: '👔 Professional' },
    { id: 'direct', label: '🎯 Direct & Value-First' },
    { id: 'enthusiastic', label: '🔥 High Energy' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />

      {/* Modal Box */}
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl z-10 flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-xs">
              <Sparkles size={16} />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white text-base">
                1-Click AI Outreach Studio
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span>Applying for:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{job.role}</span>
                <span>at</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">{job.company}</span>
              </div>
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

        {/* Toolbar: Tabs + Tone */}
        <div className="px-6 py-3 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between gap-3 flex-wrap">
          {/* Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {tabs.map((t) => {
              const Icon = t.icon;
              const isSelected = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(t.id);
                    setCopied(false);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Icon size={13} />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tone Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-slate-400">Tone:</span>
            <select
              value={tone}
              onChange={(e) => {
                const newTone = e.target.value;
                setTone(newTone);
                fetchMessages(newTone);
              }}
              className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              {tones.map((tn) => (
                <option key={tn.id} value={tn.id}>
                  {tn.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-4 flex-1">
          {generating ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3 text-slate-400">
              <Loader2 size={32} className="animate-spin text-indigo-600" />
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Generating personalized {tabs.find((t) => t.id === activeTab)?.label}...
              </span>
            </div>
          ) : (
            <div className="relative">
              <textarea
                readOnly
                value={currentContent}
                rows={activeTab === 'coverLetter' ? 12 : activeTab === 'coldEmail' ? 9 : 4}
                className="w-full p-4 text-xs font-sans rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 leading-relaxed focus:outline-none resize-none select-text shadow-2xs"
              />
              {activeTab === 'linkedInNote' && (
                <div className="text-[10px] text-slate-400 font-medium mt-1 text-right">
                  {currentContent.length} / 300 characters
                </div>
              )}
            </div>
          )}

          {/* Action Bar */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => fetchMessages(tone)}
              disabled={generating}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <RefreshCw size={12} className={generating ? 'animate-spin' : ''} />
              <span>Regenerate</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownload}
                disabled={generating || !currentContent}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Export as .txt"
              >
                <Download size={13} />
                <span>Download .txt</span>
              </button>

              <button
                type="button"
                onClick={handleCopy}
                disabled={generating || !currentContent}
                className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy to Clipboard'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
