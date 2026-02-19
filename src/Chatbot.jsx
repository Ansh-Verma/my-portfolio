import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/*
  Chatbot.jsx
  - Ready to paste (replace your existing Chatbot component file)
  - Uses RESUME_DATA populated from the uploaded resume (see file cite above).
  - Rule-based responses (no external API).
*/

const RESUME_DATA = {
  name: "Ansh Verma",
  contact: {
    email: "anshverma1.work@gmail.com",
    phone: "+91 6398775442",
    linkedin: "https://linkedin.com/in/anshverma",
    github: "https://github.com/Ansh-Verma",
    location: "Agra, Uttar Pradesh"
  },
  education: [
    {
      institute: "GLA University",
      degree: "Bachelor of Technology in Computer Science & Engineering",
      period: "2021 – 2025",
      note: "CPI: 6.91/10.0"
    },
    {
      institute: "St. Clare's High School",
      degree: "Intermediate",
      period: "2020 – 2021",
      note: "Percentage: 79.3%"
    },
    {
      institute: "St. Clare's High School",
      degree: "High School",
      period: "2018 – 2019",
      note: "Percentage: 82.5%"
    }
  ],
  experience: [
    {
      role: "Research Intern",
      org: "CSIR, CRRI",
      location: "New Delhi",
      period: "June 2025 – August 2025",
      bullets: [
        "Designed and implemented end-to-end predictive modeling pipelines in Python to forecast congestion indices on urban expressways.",
        "Achieved test R² of 0.9604 (approx. RMSE 0.0711).",
        "Performed data collection, cleaning, and feature engineering to estimate optimum speed limits."
      ]
    },
    {
      role: "Software Developer Intern",
      org: "DRDO, ADRDE",
      location: "Agra, Uttar Pradesh",
      period: "May 2023 – July 2023",
      bullets: [
        "Built a GPS Simulator using C# and .NET framework.",
        "Developed with Visual Studio Professional and Windows Forms to create a user-friendly application interface."
      ]
    },
    {
      role: "Machine Learning Trainee",
      org: "JOVAC, GLA University",
      location: "Mathura, Uttar Pradesh",
      period: "June 2022 – July 2022",
      bullets: [
        "Gained proficiency in fundamental concepts in machine learning using Python and relevant libraries.",
        "Processed and analyzed datasets to predict outcomes, improving data-driven decision-making."
      ]
    }
  ],
  projects: [
    {
      title: "AI-Based Proctored Examination Portal",
      repo: "https://github.com/Ansh-Verma/AI-Proctor",
      live: "https://ai-proctor-ruddy.vercel.app",
      period: "June 2024 – April 2025",
      bullets: [
        "Engineered an AI-powered exam portal that ensured secure and fair online assessments.",
        "Integrated facial recognition and activity monitoring for real-time proctoring.",
        "Added face authentication, automatic grading, and plagiarism detection for fair assessments."
      ],
      techStack: ["HTML5", "CSS3", "Python", "scikit-learn", "MERN"]
    }
  ],
  skills: {
    languages: ["Java", "HTML", "CSS", "SQL", "Markdown"],
    developerTools: ["VS Code", "Git", "GitHub", "MongoDB", "Docker", "n8n"],
    technologies: [".NET", "ReactJS", "ExpressJS", "NodeJS"],
    professional: ["Problem-solving", "Decision-making", "Leadership & Team management", "Adaptability"]
  },
  achievements: [
    "Oracle Cloud Infrastructure 2025 Certified Generative AI Professional",
    "Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate",
    "Microsoft Certified: Intelligent Document Processing Solution with Azure AI Document Intelligence",
    "Microsoft Certified: Natural Language Processing Solution with Azure AI Language"
  ],
  cocurricular: {
    role: "Vice President",
    org: "Aikyam GLAU Club – GLA University, Mathura",
    bullets: [
      "Led a team of 50 in organizing cultural events and workshops, enhancing campus engagement.",
      "Chaired weekly strategy meetings and optimized team workflow, ensuring efficient event execution."
    ]
  },
  summary: "AI Engineer experienced in predictive modeling, building AI-powered systems, and full-stack development."
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi! I'm Ansh's AI assistant. Ask me about his education, experience, projects, skills, certifications, or contact info. Try: "Tell me about your experience" or "Show project link".`
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Normalize helper
  const normalize = (s = '') => s.toLowerCase().replace(/[^\w\s]/g, '').trim();

  // Build readable blocks from RISUME_DATA
  const formatEducation = () => {
    return RESUME_DATA.education.map(e => `${e.degree} — ${e.institute} (${e.period}) — ${e.note}`).join('\n');
  };

  const formatExperience = () => {
    return RESUME_DATA.experience.map(exp => {
      return `${exp.role} at ${exp.org} — ${exp.period}\n${exp.bullets.map(b => `• ${b}`).join('\n')}`;
    }).join('\n\n');
  };

  const formatProjects = () => {
    return RESUME_DATA.projects.map(p => `${p.title} (${p.period})\nRepo: ${p.repo}\n${p.bullets.map(b => `• ${b}`).join('\n')}\nTech: ${p.techStack.join(', ')}`).join('\n\n');
  };

  const generateResponse = (userMessage) => {
    const msg = normalize(userMessage);

    if (!msg) return "Please type a question about Ansh's education, experience, projects, skills, certifications, or contact.";

    // Greetings
    if (/\b(hi|hello|hey|good morning|good afternoon|good evening)\b/.test(msg)) {
      return `Hello — I'm Ansh's assistant. ${RESUME_DATA.summary} You can ask about experience, projects, education, skills, certifications, or how to contact him.`;
    }

    // Thanks
    if (/\b(thank|thanks|thx)\b/.test(msg)) {
      return "You're welcome! Anything else you'd like to know about Ansh's work or projects?";
    }

    // Who / name
    if (/\bwho (are )?you\b/.test(msg) || /\bwho is this\b/.test(msg) || (msg.includes('your') && msg.includes('name'))) {
      return `I'm ${RESUME_DATA.name}'s assistant. ${RESUME_DATA.name} is an ${RESUME_DATA.summary} See education and experience sections for details.`;
    }

    // Tell me about yourself / summary
    if (/\b(tell me about|about yourself|about you)\b/.test(msg)) {
      return `${RESUME_DATA.summary} Education: ${RESUME_DATA.education[0].degree} at ${RESUME_DATA.education[0].institute} (${RESUME_DATA.education[0].period}).`;
    }

    // Age -> do NOT invent
    if (/\b(age|how old|years old)\b/.test(msg)) {
      return "I don't provide personal age information. I can share professional background, education, and projects.";
    }

    // Location
    if (/\b(where (are )?you from|where from|location|based in|live)\b/.test(msg)) {
      return `Location: ${RESUME_DATA.contact.location}.`;
    }

    // Contact details
    if (/\b(contact|email|phone|reach|how to contact|get in touch)\b/.test(msg)) {
      const c = RESUME_DATA.contact;
      return `Contact:\n📧 ${c.email}\n📞 ${c.phone}\nLinkedIn: ${c.linkedin}\nGitHub: ${c.github}`;
    }

    // Education
    if (/\b(education|study|university|college|degree|cpi|gla)\b/.test(msg)) {
      return `Education:\n${formatEducation()}`;
    }

    // Experience / work
    if (/\b(experience|work|intern|internship|worked)\b/.test(msg)) {
      return `Work Experience:\n${formatExperience()}`;
    }

    // Projects
    if (/\b(project|projects|portfolio|proctor|proctored)\b/.test(msg)) {
      return `Projects:\n${formatProjects()}`;
    }

    // GitHub / repo
    if (/\b(github|repo|repository|code)\b/.test(msg)) {
      return `GitHub: ${RESUME_DATA.contact.github} — featured repo: ${RESUME_DATA.projects[0].repo}`;
    }

    // Skills
    if (/\b(skill|skills|technolog|languages|framework|tools)\b/.test(msg)) {
      const s = RESUME_DATA.skills;
      return `Skills:\nLanguages: ${s.languages.join(', ')}\nTools: ${s.developerTools.join(', ')}\nTechnologies: ${s.technologies.join(', ')}\nProfessional: ${s.professional.join(', ')}`;
    }

    // Certifications / achievements
    if (/\b(certif|certificate|certified|achievement|achievements)\b/.test(msg)) {
      return `Certifications & Achievements:\n${RESUME_DATA.achievements.map(a => `• ${a}`).join('\n')}`;
    }

    // Co-curricular / leadership
    if (/\b(vice|president|club|co-curricular|lead|leadership)\b/.test(msg)) {
      return `Co-curricular:\n${RESUME_DATA.cocurricular.role} at ${RESUME_DATA.cocurricular.org}\n${RESUME_DATA.cocurricular.bullets.map(b => `• ${b}`).join('\n')}`;
    }

    // Numeric/time queries about years
    if (/\b(years|how many years|duration)\b/.test(msg)) {
      return "Ansh has internship and project experience spanning from 2022 onward (see Experience for dates).";
    }

    // Short "what do you do"
    if (/\b(what do you do|what is your role|occupation|profession)\b/.test(msg)) {
      return `${RESUME_DATA.name} is an AI Engineer. ${RESUME_DATA.summary} He builds AI/ML systems and full-stack applications.`;
    }

    // Goodbye
    if (/\b(bye|goodbye|see ya|see you)\b/.test(msg)) {
      return "Goodbye — feel free to message again or use the contact details to reach out directly.";
    }

    // Fallback helpful prompt
    return "I can provide: education, work experience, projects, skills, certifications, or contact info. Examples: \"Tell me about your proctoring project\", \"Where did you study?\", \"Show GitHub\".";
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      const response = generateResponse(userMessage.content);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsLoading(false);
    }, 400);
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
                  <p className="text-xs text-white/80">Ask me about Ansh's background</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  aria-label={isMinimized ? "Restore chat" : "Minimize chat"}
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
                      placeholder="Ask about education, experience, projects, skills..."
                      className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
                      aria-label="Type your message"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!input.trim()}
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
