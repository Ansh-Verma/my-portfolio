// src/Chatbot.jsx
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const INITIAL_MESSAGE = {
  role: 'assistant',
  content:
    "Hi — I'm the assistant. Ask me about Ansh's education, projects, experience, skills, or contact details."
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  async function callServerless(message, history) {
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: String(message).slice(0, 4000),
          history: (history || []).slice(-8).map((m) => ({ role: m.role, content: String(m.content).slice(0, 2000) }))
        })
      });

      // Try to parse server response, always expect { reply }
      const body = await res.json();
      // If server returns an object with reply, use it, else fallback
      return (body && body.reply) || 'Sorry - the assistant is temporarily unavailable.';
    } catch (err) {
      console.error('Client error calling /api/chat:', err);
      return 'Sorry - the assistant is temporarily unavailable. Please try again later.';
    }
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input.trim() };
    const history = [...messages, userMessage];

    // add user message to UI immediately
    setMessages(history);
    setInput('');
    setIsLoading(true);

    const reply = await callServerless(userMessage.content, history);
    setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    setIsLoading(false);
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300"
            aria-label="Open chat"
          >
            <MessageCircle size={28} className="text-white" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className={`fixed bottom-6 right-6 z-50 ${isMinimized ? 'w-80' : 'w-96'} bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-cyan-500/30 overflow-hidden`}
            role="dialog"
            aria-label="Assistant chat"
          >
            <div className="bg-gradient-to-r from-cyan-500 to-purple-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-white">Assistant</h3>
                  <p className="text-xs text-white/80">Ask about education, projects, experience, or contact.</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  aria-label={isMinimized ? 'Restore chat' : 'Minimize chat'}
                >
                  <Minimize2 size={16} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  aria-label="Close chat"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                <div className="h-96 overflow-y-auto p-4 space-y-4" aria-live="polite">
                  {messages.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-2xl ${
                          msg.role === 'user' ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white' : 'bg-white/10 text-gray-100'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-line">{msg.content}</p>
                      </div>
                    </motion.div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white/10 p-3 rounded-2xl">
                        <div className="flex gap-2">
                          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                          <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                <div className="p-4 border-t border-white/10">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Ask anything about Ansh..."
                      className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
                      aria-label="Type your message"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!input.trim() || isLoading}
                      className="p-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Send message"
                    >
                      <Send size={20} />
                    </button>
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