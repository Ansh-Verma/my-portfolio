// src/Chatbot.jsx
import React, { useState, useRef, useEffect, useCallback, useMemo, memo } from 'react';
import { MessageCircle, X, Send, Minimize2, RotateCcw, Trash2, Copy, Check, Square } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════════════════════════════════ */

const INITIAL_MESSAGE = {
  role: 'assistant',
  content:
    "Hi there! 👋 I'm Ansh's portfolio assistant. Ask me about his **education**, **projects**, **experience**, **skills**, **certifications**, or **contact** details.",
  timestamp: Date.now(),
  source: 'local',
};

const SUGGESTION_CHIPS = [
  { label: '📚 Education', query: "Tell me about Ansh's education" },
  { label: '💼 Experience', query: 'What work experience does Ansh have?' },
  { label: '🛠️ Skills', query: "What are Ansh's technical skills?" },
  { label: '📂 Projects', query: "Tell me about Ansh's projects" },
  { label: '📜 Certifications', query: 'What certifications does Ansh have?' },
  { label: '📧 Contact', query: 'How can I reach Ansh?' },
];

const SESSION_KEY = 'portfolio-chat-history';

/* ═══════════════════════════════════════════════════════════════════════════
   SAFE HREF CHECK — block javascript: and data: URIs
   ═══════════════════════════════════════════════════════════════════════════ */
function isSafeHref(url) {
  if (!url) return false;
  const trimmed = url.trim().toLowerCase();
  return trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('mailto:');
}

/* ═══════════════════════════════════════════════════════════════════════════
   LIGHTWEIGHT MARKDOWN RENDERER
   ═══════════════════════════════════════════════════════════════════════════ */
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

    // Unordered list
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

    // Ordered list
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
      rawUrlMatch ? { type: 'rawurl', match: rawUrlMatch } : null,
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
      parts.push(
        <strong key={key++} className="font-semibold" style={{ color: 'var(--text-primary)' }}>
          {first.match[1]}
        </strong>
      );
    } else if (first.type === 'code') {
      parts.push(
        <code key={key++} className="px-1.5 py-0.5 rounded text-xs font-mono"
          style={{ background: 'var(--bg-secondary)', color: 'var(--accent-primary)' }}>
          {first.match[1]}
        </code>
      );
    } else if (first.type === 'italic') {
      parts.push(
        <em key={key++} className="italic" style={{ color: 'var(--text-secondary)' }}>
          {first.match[1]}
        </em>
      );
    } else if (first.type === 'mdlink') {
      const href = first.match[2];
      if (isSafeHref(href)) {
        parts.push(
          <a key={key++} href={href} target="_blank" rel="noopener noreferrer"
            className="underline underline-offset-2 transition-colors"
            style={{ color: 'var(--accent-primary)' }}>
            {first.match[1]}
          </a>
        );
      } else {
        // Render as plain text if URL is unsafe
        parts.push(<span key={key++}>{first.match[1]}</span>);
      }
    } else if (first.type === 'rawurl') {
      const url = first.match[0];
      if (isSafeHref(url)) {
        let label = url;
        try {
          const parsed = new URL(url);
          label = parsed.hostname.replace('www.', '') +
            (parsed.pathname.length > 1
              ? parsed.pathname.slice(0, 20) + (parsed.pathname.length > 20 ? '…' : '')
              : '');
        } catch { label = url.length > 40 ? url.slice(0, 38) + '…' : url; }
        parts.push(
          <a key={key++} href={url} target="_blank" rel="noopener noreferrer"
            className="underline underline-offset-2 transition-colors"
            style={{ color: 'var(--accent-primary)' }}>
            🔗 {label}
          </a>
        );
      } else {
        parts.push(<span key={key++}>{url}</span>);
      }
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

/* ═══════════════════════════════════════════════════════════════════════════
   SESSION STORAGE — persist chat across page refreshes
   ═══════════════════════════════════════════════════════════════════════════ */
function loadChatHistory() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch { /* ignore corrupted data */ }
  return [{ ...INITIAL_MESSAGE, timestamp: Date.now() }];
}

function saveChatHistory(messages) {
  try {
    // Only keep last 50 messages to avoid storage limits
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(messages.slice(-50)));
  } catch { /* ignore quota errors */ }
}

/* ═══════════════════════════════════════════════════════════════════════════
   MEMOIZED MESSAGE BUBBLE — avoids re-render on input keystrokes
   ═══════════════════════════════════════════════════════════════════════════ */
const MessageBubble = memo(function MessageBubble({ msg, idx, isLast, onRetry, onCopy }) {
  const [copied, setCopied] = useState(false);
  const isError = msg.source === 'error';
  const isUser = msg.role === 'user';

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(msg.content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  }, [msg.content]);

  // Memoize markdown render — only re-parse when content changes
  const renderedContent = useMemo(() => {
    if (isUser) return <p className="text-sm whitespace-pre-line">{msg.content}</p>;
    return <div className="space-y-1.5">{renderMarkdown(msg.content)}</div>;
  }, [msg.content, isUser]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, delay: isLast ? 0.05 : 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} group`}
    >
      <div className="flex flex-col gap-1 max-w-[85%]">
        <div
          className={`p-3 rounded-2xl relative ${isError ? 'chat-error-pulse' : ''}`}
          style={isUser ? {
            background: 'var(--accent-primary)',
            color: '#0a0a0a',
            borderBottomRightRadius: '6px',
          } : {
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            borderBottomLeftRadius: '6px',
            border: `1px solid ${isError ? 'var(--accent-danger)' : 'var(--border-color)'}`,
          }}
        >
          {renderedContent}
        </div>

        {/* Action row — timestamp, copy, retry */}
        <div className={`flex items-center gap-2 px-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
          <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
            {formatTime(msg.timestamp)}
          </span>

          {/* Copy button — assistant messages only */}
          {!isUser && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-[10px] transition-all opacity-0 group-hover:opacity-100"
              style={{ color: copied ? 'var(--accent-success)' : 'var(--text-tertiary)' }}
              title={copied ? 'Copied!' : 'Copy message'}
            >
              {copied ? <Check size={10} /> : <Copy size={10} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          )}

          {/* Retry button — error replies only */}
          {!isUser && isError && (
            <button
              onClick={() => onRetry(idx)}
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
  );
});

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN CHATBOT COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */
export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState(loadChatHistory);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null); // AbortController for cancellation

  // ── Auto-scroll to bottom on new messages ──
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // ── Focus input when opened ──
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, isMinimized]);

  // ── Persist to sessionStorage on message change ──
  useEffect(() => {
    saveChatHistory(messages);
  }, [messages]);

  // ── Derived state ──
  const hasUserMessages = useMemo(
    () => messages.some((m) => m.role === 'user'),
    [messages]
  );

  const showChips = !hasUserMessages && messages.length <= 1;

  // Last assistant message for minimized preview
  const lastBotMessage = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'assistant') return messages[i].content;
    }
    return '';
  }, [messages]);

  // ── API call with AbortController support ──
  const callServerless = useCallback(async (message, history, signal) => {
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: String(message).slice(0, 4000),
          history: (history || []).slice(-8).map((m) => ({
            role: m.role,
            content: String(m.content).slice(0, 2000),
          })),
        }),
        signal, // AbortController signal
      });

      if (res.status === 429) {
        return {
          content: "You're sending messages too quickly. Please wait a moment and try again.",
          source: 'rate-limit',
        };
      }

      const body = await res.json();
      return {
        content: (body && body.reply) || 'Sorry — the assistant is temporarily unavailable.',
        source: body?.source || 'unknown',
      };
    } catch (err) {
      if (err.name === 'AbortError') {
        return { content: 'Message cancelled.', source: 'cancelled' };
      }
      console.error('Client error calling /api/chat:', err);
      return {
        content: "I'm having trouble connecting right now. Please try again in a moment.",
        source: 'error',
      };
    }
  }, []);

  // ── Send message — uses functional updater to avoid stale closures ──
  const sendMessage = useCallback(async (messageText, overrideHistory) => {
    const trimmed = (messageText || '').trim();
    if (!trimmed || isLoading) return;

    const userMessage = { role: 'user', content: trimmed, timestamp: Date.now() };

    // Use functional updater to always get fresh state
    let historySnapshot;
    setMessages((prev) => {
      historySnapshot = overrideHistory || [...prev, userMessage];
      return historySnapshot;
    });

    setInput('');
    setIsLoading(true);

    // Create abort controller for this request
    const controller = new AbortController();
    abortRef.current = controller;

    // Wait a tick for state to flush before reading historySnapshot
    await new Promise((r) => setTimeout(r, 0));

    const result = await callServerless(trimmed, historySnapshot, controller.signal);

    abortRef.current = null;

    // Only append reply if not cancelled
    if (result.source !== 'cancelled') {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: result.content,
          timestamp: Date.now(),
          source: result.source,
        },
      ]);
    }

    setIsLoading(false);
  }, [isLoading, callServerless]);

  // ── Cancel in-flight request ──
  const handleCancel = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setIsLoading(false);
  }, []);

  // ── Input handlers ──
  const handleSend = useCallback(() => {
    sendMessage(input);
  }, [input, sendMessage]);

  const handleChipClick = useCallback((query) => {
    sendMessage(query);
  }, [sendMessage]);

  // ── Retry — properly reconstructs history ──
  const handleRetry = useCallback((msgIndex) => {
    setMessages((prev) => {
      // Find the last user message before the failed reply
      for (let i = msgIndex - 1; i >= 0; i--) {
        if (prev[i].role === 'user') {
          const userContent = prev[i].content;
          const trimmedHistory = prev.slice(0, i);
          // We schedule the sendMessage outside the updater
          setTimeout(() => sendMessage(userContent, [...trimmedHistory, { role: 'user', content: userContent, timestamp: Date.now() }]), 0);
          return trimmedHistory;
        }
      }
      return prev;
    });
  }, [sendMessage]);

  // ── Clear chat ──
  const handleClearChat = useCallback(() => {
    setMessages([{ ...INITIAL_MESSAGE, timestamp: Date.now() }]);
    setInput('');
    try { sessionStorage.removeItem(SESSION_KEY); } catch {}
  }, []);

  const charCount = input.length;

  return (
    <>
      {/* ══ FAB Button ══════════════════════════════════════════════════ */}
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
            <span
              className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 animate-pulse"
              style={{ background: 'var(--accent-success)', borderColor: 'var(--bg-primary)' }}
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ══ Chat Window ═════════════════════════════════════════════════ */}
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
            <div
              className="px-4 py-3 flex items-center justify-between shrink-0 border-b"
              style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'var(--accent-primary)', color: '#0a0a0a' }}
                >
                  <MessageCircle size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                    Portfolio Assistant
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{
                        background: isLoading ? 'var(--accent-primary)' : 'var(--accent-success)',
                        animation: isLoading ? 'pulse 1.5s infinite' : 'none',
                      }}
                    />
                    <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
                      {isLoading ? 'Thinking…' : 'Online · Ask anything'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleClearChat}
                  className="p-2 rounded-lg transition-colors hover:bg-white/5"
                  style={{ color: 'var(--text-tertiary)' }}
                  aria-label="Clear chat"
                  title="Clear chat"
                >
                  <Trash2 size={14} />
                </button>
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 rounded-lg transition-colors hover:bg-white/5"
                  style={{ color: 'var(--text-tertiary)' }}
                  aria-label={isMinimized ? 'Restore chat' : 'Minimize chat'}
                >
                  <Minimize2 size={14} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg transition-colors hover:bg-white/5"
                  style={{ color: 'var(--text-tertiary)' }}
                  aria-label="Close chat"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* ── Minimized preview ─────────────────────────── */}
            {isMinimized && lastBotMessage && (
              <div
                className="px-4 py-2.5 cursor-pointer"
                onClick={() => setIsMinimized(false)}
                style={{ color: 'var(--text-secondary)' }}
              >
                <p className="text-xs truncate">{lastBotMessage.slice(0, 80)}…</p>
              </div>
            )}

            {!isMinimized && (
              <>
                {/* ── Messages ──────────────────────────────── */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3" aria-live="polite">
                  {messages.map((msg, idx) => (
                    <MessageBubble
                      key={`${idx}-${msg.timestamp}`}
                      msg={msg}
                      idx={idx}
                      isLast={idx === messages.length - 1}
                      onRetry={handleRetry}
                    />
                  ))}

                  {/* ── Suggestion chips ─────────────────────── */}
                  {showChips && (
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

                  {/* ── Typing indicator + cancel ────────────── */}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="p-3 rounded-2xl"
                          style={{
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-color)',
                            borderBottomLeftRadius: '6px',
                          }}
                        >
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
                                  ease: 'easeInOut',
                                }}
                              />
                            ))}
                          </div>
                        </div>
                        <button
                          onClick={handleCancel}
                          className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg transition-colors"
                          style={{
                            color: 'var(--text-tertiary)',
                            border: '1px solid var(--border-color)',
                          }}
                          title="Cancel request"
                        >
                          <Square size={10} />
                          Stop
                        </button>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* ── Input Area ──────────────────────────────── */}
                <div
                  className="p-3 border-t shrink-0"
                  style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}
                >
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
                        disabled={isLoading}
                        className="w-full rounded-xl px-4 py-2.5 text-sm transition-all disabled:opacity-60"
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
                            style={{
                              color: charCount > 3500 ? 'var(--accent-danger)' : 'var(--text-tertiary)',
                            }}
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