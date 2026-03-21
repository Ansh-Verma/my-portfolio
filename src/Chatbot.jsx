// src/Chatbot.jsx
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { MessageCircle, X, Send, Minimize2, RotateCcw, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const INITIAL_MESSAGE = {
  role: 'assistant',
  content:
    "Hi there! 👋 I'm Ansh's portfolio assistant. Ask me about his **education**, **projects**, **experience**, **skills**, **certifications**, or **contact** details.",
  timestamp: Date.now()
};

const SUGGESTION_CHIPS = [
  { label: '📚 Education', query: 'Tell me about Ansh\'s education' },
  { label: '💼 Experience', query: 'What work experience does Ansh have?' },
  { label: '🛠️ Skills', query: 'What are Ansh\'s technical skills?' },
  { label: '📂 Projects', query: 'Tell me about Ansh\'s projects' },
  { label: '📜 Certifications', query: 'What certifications does Ansh have?' },
  { label: '📧 Contact', query: 'How can I reach Ansh?' }
];

const ERROR_PHRASES = [
  'temporarily unavailable',
  'trouble connecting',
  'trouble right now',
  'try again'
];

// ─── Lightweight markdown renderer ──────────────────────────────────────────
function renderMarkdown(text) {
  if (!text) return null;

  const lines = text.split('\n');
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      elements.push(<div key={i} className="h-2" />);
      i++;
      continue;
    }

    if (/^[\s]*[-*]\s/.test(line)) {
      const items = [];
      while (i < lines.length && /^[\s]*[-*]\s/.test(lines[i])) {
        items.push(lines[i].replace(/^[\s]*[-*]\s/, ''));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="list-disc list-inside space-y-1 ml-1">
          {items.map((item, j) => (
            <li key={j} className="text-sm leading-relaxed">{renderInline(item)}</li>
          ))}
        </ul>
      );
      continue;
    }

    if (/^\d+\.\s/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, ''));
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="list-decimal list-inside space-y-1 ml-1">
          {items.map((item, j) => (
            <li key={j} className="text-sm leading-relaxed">{renderInline(item)}</li>
          ))}
        </ol>
      );
      continue;
    }

    elements.push(
      <p key={i} className="text-sm leading-relaxed">{renderInline(line)}</p>
    );
    i++;
  }

  return <>{elements}</>;
}

function renderInline(text) {
  if (!text) return text;

  const parts = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    const codeMatch = remaining.match(/`([^`]+)`/);
    const italicMatch = remaining.match(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/);
    const mdLinkMatch = remaining.match(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/);
    const rawUrlMatch = remaining.match(/(?<!\]\()(?<!\()https?:\/\/[^\s)>,]+/);

    const matches = [
      boldMatch ? { type: 'bold', match: boldMatch } : null,
      codeMatch ? { type: 'code', match: codeMatch } : null,
      italicMatch ? { type: 'italic', match: italicMatch } : null,
      mdLinkMatch ? { type: 'mdlink', match: mdLinkMatch } : null,
      rawUrlMatch ? { type: 'rawurl', match: rawUrlMatch } : null
    ].filter(Boolean).sort((a, b) => a.match.index - b.match.index);

    if (matches.length === 0) {
      parts.push(<span key={key++}>{remaining}</span>);
      break;
    }

    const first = matches[0];
    const idx = first.match.index;

    if (idx > 0) {
      parts.push(<span key={key++}>{remaining.slice(0, idx)}</span>);
    }

    if (first.type === 'bold') {
      parts.push(<strong key={key++} className="font-semibold" style={{ color: 'var(--text-primary)' }}>{first.match[1]}</strong>);
    } else if (first.type === 'code') {
      parts.push(
        <code key={key++} className="px-1.5 py-0.5 rounded text-xs font-mono"
          style={{ background: 'var(--bg-secondary)', color: 'var(--accent-primary)' }}>
          {first.match[1]}
        </code>
      );
    } else if (first.type === 'italic') {
      parts.push(<em key={key++} className="italic" style={{ color: 'var(--text-secondary)' }}>{first.match[1]}</em>);
    } else if (first.type === 'mdlink') {
      parts.push(
        <a key={key++} href={first.match[2]} target="_blank" rel="noopener noreferrer"
          className="underline underline-offset-2 transition-colors"
          style={{ color: 'var(--accent-primary)' }}>
          {first.match[1]}
        </a>
      );
    } else if (first.type === 'rawurl') {
      const url = first.match[0];
      let label = url;
      try {
        const parsed = new URL(url);
        label = parsed.hostname.replace('www.', '') + (parsed.pathname.length > 1 ? parsed.pathname.slice(0, 20) + (parsed.pathname.length > 20 ? '…' : '') : '');
      } catch { label = url.length > 40 ? url.slice(0, 38) + '…' : url; }
      parts.push(
        <a key={key++} href={url} target="_blank" rel="noopener noreferrer"
          className="underline underline-offset-2 transition-colors"
          style={{ color: 'var(--accent-primary)' }}>
          🔗 {label}
        </a>
      );
    }

    remaining = remaining.slice(idx + first.match[0].length);
  }

  return <>{parts}</>;
}

function formatTime(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function isErrorReply(content) {
  const lower = (content || '').toLowerCase();
  return ERROR_PHRASES.some(p => lower.includes(p));
}

// ─── Component ──────────────────────────────────────────────────────────────
export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showChips, setShowChips] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, isMinimized]);

  const hasUserMessages = useMemo(
    () => messages.some(m => m.role === 'user'),
    [messages]
  );

  const callServerless = useCallback(async (message, history) => {
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: String(message).slice(0, 4000),
          history: (history || []).slice(-8).map((m) => ({
            role: m.role,
            content: String(m.content).slice(0, 2000)
          }))
        })
      });

      if (res.status === 429) {
        return "You're sending messages too quickly. Please wait a moment and try again.";
      }

      const body = await res.json();
      return (body && body.reply) || 'Sorry — the assistant is temporarily unavailable.';
    } catch (err) {
      console.error('Client error calling /api/chat:', err);
      return "I'm having trouble connecting right now. Please try again in a moment.";
    }
  }, []);

  const sendMessage = useCallback(async (messageText) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage = { role: 'user', content: messageText.trim(), timestamp: Date.now() };
    const history = [...messages, userMessage];

    setMessages(history);
    setInput('');
    setIsLoading(true);
    setShowChips(false);

    const reply = await callServerless(userMessage.content, history);
    setMessages((prev) => [...prev, {
      role: 'assistant',
      content: reply,
      timestamp: Date.now()
    }]);
    setIsLoading(false);
  }, [messages, isLoading, callServerless]);

  const handleSend = useCallback(() => {
    sendMessage(input);
  }, [input, sendMessage]);

  const handleChipClick = useCallback((query) => {
    sendMessage(query);
  }, [sendMessage]);

  const handleRetry = useCallback((msgIndex) => {
    for (let i = msgIndex - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        const trimmed = messages.slice(0, i);
        setMessages(trimmed);
        sendMessage(messages[i].content);
        return;
      }
    }
  }, [messages, sendMessage]);

  const handleClearChat = useCallback(() => {
    setMessages([{ ...INITIAL_MESSAGE, timestamp: Date.now() }]);
    setShowChips(true);
    setInput('');
  }, []);

  const charCount = input.length;

  return (
    <>
      {/* ── FAB Button ─────────────────────────────────────────── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl shadow-lg transition-shadow duration-300"
            style={{
              background: 'var(--accent-primary)',
              color: '#0a0a0a',
              boxShadow: '0 4px 20px rgba(245, 158, 11, 0.3)',
            }}
            aria-label="Open chat"
          >
            <MessageCircle size={24} />
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 animate-pulse"
              style={{ background: 'var(--accent-success)', borderColor: 'var(--bg-primary)' }} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Chat Window ────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`fixed z-50 ${
              isMinimized
                ? 'bottom-6 right-6 w-80'
                : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100%-2rem)] sm:w-[420px]'
            } rounded-2xl shadow-2xl overflow-hidden flex flex-col`}
            style={{
              maxHeight: isMinimized ? 'auto' : 'min(600px, calc(100vh - 2rem))',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-color)',
            }}
            role="dialog"
            aria-label="Assistant chat"
          >
            {/* ── Header ───────────────────────────────────── */}
            <div className="px-4 py-3 flex items-center justify-between shrink-0 border-b"
              style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'var(--accent-primary)', color: '#0a0a0a' }}>
                  <MessageCircle size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Portfolio Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--accent-success)' }} />
                    <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>Online · Ask anything</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleClearChat}
                  className="p-2 rounded-lg transition-colors"
                  style={{ color: 'var(--text-tertiary)' }}
                  aria-label="Clear chat"
                  title="Clear chat"
                >
                  <Trash2 size={14} />
                </button>
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 rounded-lg transition-colors"
                  style={{ color: 'var(--text-tertiary)' }}
                  aria-label={isMinimized ? 'Restore chat' : 'Minimize chat'}
                >
                  <Minimize2 size={14} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg transition-colors"
                  style={{ color: 'var(--text-tertiary)' }}
                  aria-label="Close chat"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* ── Messages ──────────────────────────────── */}
                <div
                  className="flex-1 overflow-y-auto p-4 space-y-3"
                  aria-live="polite"
                >
                  {messages.map((msg, idx) => (
                    <motion.div
                      key={`${idx}-${msg.timestamp}`}
                      initial={{ opacity: 0, y: 12, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.3, delay: idx === messages.length - 1 ? 0.05 : 0 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className="flex flex-col gap-1 max-w-[85%]">
                        <div
                          className="p-3 rounded-2xl"
                          style={msg.role === 'user' ? {
                            background: 'var(--accent-primary)',
                            color: '#0a0a0a',
                            borderBottomRightRadius: '6px',
                          } : {
                            background: 'var(--bg-card)',
                            color: 'var(--text-primary)',
                            borderBottomLeftRadius: '6px',
                            border: '1px solid var(--border-color)',
                          }}
                        >
                          {msg.role === 'assistant' ? (
                            <div className="space-y-1.5">{renderMarkdown(msg.content)}</div>
                          ) : (
                            <p className="text-sm whitespace-pre-line">{msg.content}</p>
                          )}
                        </div>

                        <div className={`flex items-center gap-2 px-1 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{formatTime(msg.timestamp)}</span>
                          {msg.role === 'assistant' && isErrorReply(msg.content) && (
                            <button
                              onClick={() => handleRetry(idx)}
                              className="flex items-center gap-1 text-[10px] transition-colors"
                              style={{ color: 'var(--accent-primary)' }}
                              title="Retry"
                            >
                              <RotateCcw size={10} />
                              Retry
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Suggestion chips */}
                  {showChips && !hasUserMessages && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex flex-wrap gap-2 pt-1"
                    >
                      {SUGGESTION_CHIPS.map((chip) => (
                        <motion.button
                          key={chip.label}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleChipClick(chip.query)}
                          className="pill text-xs cursor-pointer"
                        >
                          {chip.label}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}

                  {/* Typing indicator */}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="p-3 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderBottomLeftRadius: '6px' }}>
                        <div className="flex items-center gap-1.5">
                          {[0, 1, 2].map((dot) => (
                            <motion.div
                              key={dot}
                              className="w-2 h-2 rounded-full"
                              style={{ background: 'var(--accent-primary)' }}
                              animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
                              transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                delay: dot * 0.15,
                                ease: 'easeInOut'
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* ── Input Area ──────────────────────────────── */}
                <div className="p-3 border-t shrink-0" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                        placeholder="Ask anything about Ansh..."
                        maxLength={4000}
                        className="w-full rounded-xl px-4 py-2.5 text-sm transition-all"
                        style={{
                          background: 'var(--bg-secondary)',
                          border: '1px solid var(--border-color)',
                          color: 'var(--text-primary)',
                        }}
                        aria-label="Type your message"
                      />
                      <AnimatePresence>
                        {charCount > 200 && (
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px]"
                            style={{ color: charCount > 3500 ? 'var(--accent-danger)' : 'var(--text-tertiary)' }}
                          >
                            {charCount}/4000
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleSend}
                      disabled={!input.trim() || isLoading}
                      className="p-2.5 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{
                        background: 'var(--accent-primary)',
                        color: '#0a0a0a',
                      }}
                      aria-label="Send message"
                    >
                      <Send size={16} />
                    </motion.button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}