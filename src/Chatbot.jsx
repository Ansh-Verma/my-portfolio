import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Recommended free option (better than OpenAI for cost): Groq
 * - Model used below: llama-3.3-70b-versatile
 * - Add in .env: VITE_GROQ_API_KEY=your_groq_api_key
 * - Get key from: https://console.groq.com/keys (has free tier)
 */

const RESUME_DATA = {
  name: 'Ansh Verma',
  contact: {
    email: 'anshverma1.work@gmail.com',
    phone: '+91 6398775442',
    linkedin: 'https://linkedin.com/in/anshverma',
    github: 'https://github.com/Ansh-Verma',
    location: 'Agra, Uttar Pradesh'
  },
  education: [
    {
      institute: 'GLA University',
      degree: 'Bachelor of Technology in Computer Science & Engineering',
      period: '2021 – 2025',
      note: 'CPI: 6.91/10.0'
    },
    {
      institute: "St. Clare's High School",
      degree: 'Intermediate',
      period: '2020 – 2021',
      note: 'Percentage: 79.3%'
    },
    {
      institute: "St. Clare's High School",
      degree: 'High School',
      period: '2018 – 2019',
      note: 'Percentage: 82.5%'
    }
  ],
  experience: [
    {
      role: 'Research Intern',
      org: 'CSIR, CRRI',
      location: 'New Delhi',
      period: 'June 2025 – August 2025',
      bullets: [
        'Designed and implemented end-to-end predictive modeling pipelines in Python to forecast congestion indices on urban expressways.',
        'Achieved test R² of 0.9604 (approx. RMSE 0.0711).',
        'Performed data collection, cleaning, and feature engineering to estimate optimum speed limits.'
      ]
    },
    {
      role: 'Software Developer Intern',
      org: 'DRDO, ADRDE',
      location: 'Agra, Uttar Pradesh',
      period: 'May 2023 – July 2023',
      bullets: [
        'Built a GPS Simulator using C# and .NET framework.',
        'Developed with Visual Studio Professional and Windows Forms to create a user-friendly application interface.'
      ]
    },
    {
      role: 'Machine Learning Trainee',
      org: 'JOVAC, GLA University',
      location: 'Mathura, Uttar Pradesh',
      period: 'June 2022 – July 2022',
      bullets: [
        'Gained proficiency in fundamental concepts in machine learning using Python and relevant libraries.',
        'Processed and analyzed datasets to predict outcomes, improving data-driven decision-making.'
      ]
    }
  ],
  projects: [
    {
      title: 'AI-Based Proctored Examination Portal',
      repo: 'https://github.com/Ansh-Verma/AI-Proctor',
      live: 'https://ai-proctor-ruddy.vercel.app',
      period: 'June 2024 – April 2025',
      bullets: [
        'Engineered an AI-powered exam portal that ensured secure and fair online assessments.',
        'Integrated facial recognition and activity monitoring for real-time proctoring.',
        'Added face authentication, automatic grading, and plagiarism detection for fair assessments.'
      ],
      techStack: ['HTML5', 'CSS3', 'Python', 'scikit-learn', 'MERN']
    }
  ],
  skills: {
    languages: ['Java', 'HTML', 'CSS', 'SQL', 'Markdown'],
    developerTools: ['VS Code', 'Git', 'GitHub', 'MongoDB', 'Docker', 'n8n'],
    technologies: ['.NET', 'ReactJS', 'ExpressJS', 'NodeJS'],
    professional: ['Problem-solving', 'Decision-making', 'Leadership & Team management', 'Adaptability']
  },
  achievements: [
    'Oracle Cloud Infrastructure 2025 Certified Generative AI Professional',
    'Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate',
    'Microsoft Certified: Intelligent Document Processing Solution with Azure AI Document Intelligence',
    'Microsoft Certified: Natural Language Processing Solution with Azure AI Language'
  ],
  cocurricular: {
    role: 'Vice President',
    org: 'Aikyam GLAU Club – GLA University, Mathura',
    bullets: [
      'Led a team of 50 in organizing cultural events and workshops, enhancing campus engagement.',
      'Chaired weekly strategy meetings and optimized team workflow, ensuring efficient event execution.'
    ]
  },
  summary: 'AI Engineer experienced in predictive modeling, building AI-powered systems, and full-stack development.'
};

const RESUME_CONTEXT = JSON.stringify(RESUME_DATA, null, 2);
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

const getFallbackReply = (question) => {
  const q = question.toLowerCase();
  if (q.includes('contact') || q.includes('email') || q.includes('phone')) {
    return `You can reach Ansh at ${RESUME_DATA.contact.email} or ${RESUME_DATA.contact.phone}.\nLinkedIn: ${RESUME_DATA.contact.linkedin}`;
  }
  if (q.includes('project')) {
    return `${RESUME_DATA.projects[0].title}\nRepo: ${RESUME_DATA.projects[0].repo}\nLive: ${RESUME_DATA.projects[0].live}`;
  }
  return "I can answer intelligently once you add VITE_GROQ_API_KEY in your .env file. Right now I'm using limited fallback mode.";
};

async function askGroq(userMessage, chatHistory) {
  if (!GROQ_API_KEY) return getFallbackReply(userMessage);

  const systemPrompt = `You are Ansh Verma's portfolio assistant.\nRules:\n- Answer naturally, concise, helpful, and professional.\n- Use ONLY the provided resume context.\n- If data is missing, say you don't have that info.\n- Never invent facts.\n\nResume context:\n${RESUME_CONTEXT}`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...chatHistory.slice(-8).map((m) => ({ role: m.role, content: m.content })),
    { role: 'user', content: userMessage }
  ];

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      max_tokens: 500,
      messages
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Groq API request failed');
  }

  const data = await response.json();
  return data?.choices?.[0]?.message?.content?.trim() || 'I could not generate a response right now.';
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Hi! I'm Ansh's AI assistant powered by an LLM. Ask me anything about his education, experience, projects, skills, certifications, or contact details."
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input.trim() };
    const nextHistory = [...messages, userMessage];

    setMessages(nextHistory);
    setInput('');
    setIsLoading(true);

    try {
      const reply = await askGroq(userMessage.content, nextHistory);
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (error) {
      console.error('Chat API error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Sorry, I could not reach the AI service right now. Please try again in a moment. If this keeps happening, verify your VITE_GROQ_API_KEY.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
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
            aria-label="AI assistant chat"
          >
            <div className="bg-gradient-to-r from-cyan-500 to-purple-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-white">AI Assistant</h3>
                  <p className="text-xs text-white/80">Powered by Groq (free tier)</p>
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
                          msg.role === 'user'
                            ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white'
                            : 'bg-white/10 text-gray-100'
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
                          <div
                            className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                            style={{ animationDelay: '0.2s' }}
                          />
                          <div
                            className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
                            style={{ animationDelay: '0.4s' }}
                          />
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
