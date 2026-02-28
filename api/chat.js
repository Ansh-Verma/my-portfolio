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
    { institute: 'GLA University', degree: 'B.Tech CSE', period: '2021 – 2025' }
  ],
  projects: [
    {
      title: 'AI-Based Proctored Examination Portal',
      repo: 'https://github.com/Ansh-Verma/AI-Proctor',
      live: 'https://ai-proctor-ruddy.vercel.app',
      period: 'June 2024 – April 2025'
    }
  ],
  summary: 'AI Engineer experienced in predictive modeling, building AI-powered systems, and full-stack development.'
};

function getFallbackReply(question = '') {
  const q = question.toLowerCase();
  if (!q.trim()) return "Please ask a question about the profile (education, experience, projects, skills, or contact).";
  if (q.includes('contact') || q.includes('email') || q.includes('phone')) {
    return `Contact — Email: ${RESUME_DATA.contact.email} | Phone: ${RESUME_DATA.contact.phone}`;
  }
  if (q.includes('project')) {
    const p = RESUME_DATA.projects[0];
    return `${p.title}\nRepo: ${p.repo}\nLive: ${p.live}`;
  }
  if (q.includes('education') || q.includes('study') || q.includes('college')) {
    const e = RESUME_DATA.education[0];
    return `${e.degree} — ${e.institute} (${e.period})`;
  }
  if (q.includes('summary') || q.includes('about')) {
    return RESUME_DATA.summary;
  }
  return "I couldn't find a direct answer in the profile. Try asking about contact, projects, or education.";
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ reply: 'Method not allowed' });
  }

  const { message = '', history = [] } = req.body || {};
  const key = process.env.GROQ_API_KEY;

  // If no key set on server, serve curated fallback replies (won't mention missing key).
  if (!key) {
    console.warn('GROQ_API_KEY not defined on server — returning fallback replies.');
    const reply = getFallbackReply(String(message || ''));
    return res.status(200).json({ reply });
  }

  // System prompt instructs model to only use resume data and not reveal internal info
  const systemPrompt = `You are a concise professional assistant answering questions about a public resume. Use only the resume context provided below. If the answer is not present in the resume, say you don't have that information. Do NOT mention internal errors, the API provider, or reveal any API keys. Keep answers short and helpful.

Resume context:
${JSON.stringify(RESUME_DATA, null, 2)}`;

  // Build messages: system + limited history + user
  const messages = [
    { role: 'system', content: systemPrompt },
    ...((history || []).slice(-6).map((m) => ({ role: m.role, content: String(m.content).slice(0, 2000) }))),
    { role: 'user', content: String(message).slice(0, 4000) }
  ];

  try {
    const payload = {
      model: 'llama-3.3-70b-versatile',
      temperature: 0.25,
      max_tokens: 600,
      messages
    };

    // Call Groq
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`
      },
      body: JSON.stringify(payload)
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text().catch(() => '<no body>');
      console.error('Groq API error', groqRes.status, errText);
      // Generic reply to client (do not expose provider/error details)
      return res.status(200).json({ reply: 'Sorry — the assistant is temporarily unavailable. Please try again later.' });
    }

    const data = await groqRes.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) {
      console.error('Groq returned no content:', JSON.stringify(data));
      return res.status(200).json({ reply: 'Sorry — I could not generate a response right now.' });
    }

    // Return the assistant reply to client
    return res.status(200).json({ reply: String(content).trim() });
  } catch (err) {
    // Server-side log only
    console.error('Server error calling Groq:', err);
    return res.status(200).json({ reply: 'Sorry — the assistant is temporarily unavailable. Please try again later.' });
  }
};