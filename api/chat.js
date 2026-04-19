// api/chat.js
export const config = { runtime: "nodejs" };

// ─── Complete Resume Data (synced with Portfolio.jsx) ────────────────────────
const RESUME_DATA = {
  name: 'Ansh Verma',
  title: 'AI Engineer',
  about: [
    "AI Engineer passionate about building intelligent AI systems that make a real impact.",
    "Worked with prestigious organizations like CSIR, DRDO, and gained hands-on experience in machine learning, AI models, and full-stack development.",
    "Expertise spans from developing AI agents to creating AI-powered proctoring systems. Certified by Oracle and Microsoft in AI and cloud technologies."
  ],
  contact: {
    email: 'anshverma1.work@gmail.com',
    phone: '+91 6398775442',
    linkedin: 'https://linkedin.com/in/anshverma',
    github: 'https://github.com/Ansh-Verma',
    location: 'Agra, Uttar Pradesh'
  },
  education: [
    { institute: 'GLA University', degree: 'B.Tech CSE', period: '2021 – 2025', grade: 'CPI: 6.91/10.0' },
    { institute: 'St. Clare\'s High School', degree: 'Intermediate', period: '2020 – 2021', grade: '79.3%' },
    { institute: 'St. Clare\'s High School', degree: 'High School', period: '2018 – 2019', grade: '82.5%' }
  ],
  experience: [
    {
      role: 'Research Intern',
      org: 'CSIR, CRRI',
      location: 'New Delhi',
      period: 'June 2025 – August 2025',
      description: 'Designed end-to-end predictive modeling pipelines achieving R² of 0.9604 for urban expressway congestion forecasting.',
      tags: ['ML', 'Python', 'Data Science']
    },
    {
      role: 'Software Developer Intern',
      org: 'DRDO, ADRDE',
      location: 'Agra, Uttar Pradesh',
      period: 'May 2023 – July 2023',
      description: 'Built GPS Simulator using C# and .NET framework with Windows Forms.',
      tags: ['C#', '.NET', 'Full-Stack']
    },
    {
      role: 'Machine Learning Trainee',
      org: 'JOVAC, GLA University',
      location: 'Mathura, Uttar Pradesh',
      period: 'June 2022 – July 2022',
      description: 'Developed proficiency in ML fundamentals and data-driven decision-making.',
      tags: ['ML', 'Python']
    }
  ],
  projects: [
    {
      title: 'AI-Based Proctored Examination Portal',
      repo: 'https://github.com/Ansh-Verma/AI-Proctor',
      live: 'https://ai-proctor-ruddy.vercel.app',
      period: 'June 2024 – April 2025',
      summary: 'End-to-end AI proctoring portal with face authentication, activity monitoring, automatic grading, and plagiarism detection.',
      tags: ['HTML5', 'CSS3', 'Python', 'scikit-learn', 'MongoDB', 'React', 'Express', 'Node.js']
    }
  ],
  certifications: [
    { name: 'Oracle Cloud Infrastructure 2025 Certified Generative AI Professional', date: '2025', url: 'https://catalog-education.oracle.com/ords/certview/sharebadge?id=DC73D0B5DC6539187FF07368D6B195893D7495CDA48261D41C00941FC84B4EB1' },
    { name: 'Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate', date: '2025', url: 'https://catalog-education.oracle.com/ords/certview/sharebadge?id=741E78CFE92F707D187F692C12A7175D89E6F43F3AA3C715E9959E4C21B5299D' },
    { name: 'Microsoft Certified: Intelligent Document Processing with Azure AI', date: '2024', url: 'https://learn.microsoft.com/en-us/users/anshverma-6947/credentials/95b2ad3b20b5f982' },
    { name: 'Microsoft Certified: NLP Solution with Azure AI Language', date: '2024', url: 'https://learn.microsoft.com/en-us/users/anshverma-6947/credentials/e4f08a72c98755c1' }
  ],
  skills: {
    languages: ['Java', 'Python', 'C#', 'HTML5', 'CSS3', 'SQL', 'JavaScript'],
    frameworks: ['.NET', 'ReactJS', 'ExpressJS', 'NodeJS', 'scikit-learn'],
    tools: ['VS Code', 'Git', 'GitHub', 'MongoDB', 'Docker', 'n8n', 'Visual Studio']
  }
};

// ─── Build a comprehensive human-friendly resume summary ─────────────────────
function makeResumeSummary(d) {
  const lines = [];

  // Identity & summary
  lines.push(`**${d.name}** — ${d.title}`);
  lines.push(d.about.join(' '));

  // Contact
  lines.push(`Contact: ${d.contact.email} | ${d.contact.phone} | LinkedIn: ${d.contact.linkedin} | GitHub: ${d.contact.github} | Location: ${d.contact.location}`);

  // Education
  lines.push('Education:');
  d.education.forEach(e => {
    lines.push(`- ${e.degree} at ${e.institute} (${e.period}) — ${e.grade}`);
  });

  // Experience
  lines.push('Work Experience:');
  d.experience.forEach(exp => {
    lines.push(`- ${exp.role} at ${exp.org}, ${exp.location} (${exp.period}): ${exp.description} [Tags: ${exp.tags.join(', ')}]`);
  });

  // Projects
  lines.push('Projects:');
  d.projects.forEach(p => {
    lines.push(`- ${p.title} (${p.period}): ${p.summary} | Repo: ${p.repo} | Live: ${p.live} | Tech: ${p.tags.join(', ')}`);
  });

  // Certifications
  lines.push('Certifications:');
  d.certifications.forEach(c => {
    lines.push(`- ${c.name} (${c.date}) — Verify: ${c.url}`);
  });

  // Skills
  const allSkills = [
    `Languages: ${d.skills.languages.join(', ')}`,
    `Frameworks: ${d.skills.frameworks.join(', ')}`,
    `Tools: ${d.skills.tools.join(', ')}`
  ];
  lines.push(`Skills: ${allSkills.join(' | ')}`);

  return lines.join('\n');
}

// ─── Enriched fallback replies (for when API key is missing) ─────────────────
function getFallbackReply(question = '') {
  const q = String(question || '').toLowerCase();
  if (!q.trim()) return { reply: "Please ask a question about Ansh's profile — education, experience, projects, skills, certifications, or contact.", source: 'resume' };

  if (q.includes('contact') || q.includes('email') || q.includes('phone') || q.includes('reach')) {
    return {
      reply: `📧 **Email:** ${RESUME_DATA.contact.email}\n📱 **Phone:** ${RESUME_DATA.contact.phone}\n🔗 **LinkedIn:** [linkedin.com/in/anshverma](${RESUME_DATA.contact.linkedin})\n🐙 **GitHub:** [github.com/Ansh-Verma](${RESUME_DATA.contact.github})\n📍 **Location:** ${RESUME_DATA.contact.location}`,
      source: 'resume'
    };
  }

  if (q.includes('project')) {
    const p = RESUME_DATA.projects[0];
    return {
      reply: `**${p.title}** (${p.period})\n\n${p.summary}\n\n- **Tech Stack:** ${p.tags.join(', ')}\n- **Repo:** [View on GitHub](${p.repo})\n- **Live Demo:** [Open Live Demo](${p.live})`,
      source: 'resume'
    };
  }

  if (q.includes('education') || q.includes('study') || q.includes('college') || q.includes('degree') || q.includes('university')) {
    const lines = RESUME_DATA.education.map(e => `- **${e.degree}** at ${e.institute} (${e.period}) — ${e.grade}`);
    return { reply: `**Education:**\n\n${lines.join('\n')}`, source: 'resume' };
  }

  if (q.includes('experience') || q.includes('work') || q.includes('intern')) {
    const lines = RESUME_DATA.experience.map(exp => `- **${exp.role}** at ${exp.org}, ${exp.location} (${exp.period})\n  ${exp.description}`);
    return { reply: `**Work Experience:**\n\n${lines.join('\n\n')}`, source: 'resume' };
  }

  if (q.includes('certif')) {
    const lines = RESUME_DATA.certifications.map(c => `- **${c.name}** (${c.date}) — [Verify Certificate](${c.url})`);
    return { reply: `**Certifications:**\n\n${lines.join('\n')}`, source: 'resume' };
  }

  if (q.includes('skill') || q.includes('tech') || q.includes('language') || q.includes('framework') || q.includes('tool')) {
    return {
      reply: `**Skills:**\n\n- **Languages:** ${RESUME_DATA.skills.languages.join(', ')}\n- **Frameworks:** ${RESUME_DATA.skills.frameworks.join(', ')}\n- **Tools:** ${RESUME_DATA.skills.tools.join(', ')}`,
      source: 'resume'
    };
  }

  if (q.includes('who') || q.includes('about') || q.includes('intro') || q.includes('tell me')) {
    return {
      reply: `**${RESUME_DATA.name}** — ${RESUME_DATA.title}\n\n${RESUME_DATA.about.join(' ')}`,
      source: 'resume'
    };
  }

  return { reply: "I couldn't find a specific match. Try asking about **contact**, **projects**, **education**, **experience**, **skills**, or **certifications**.", source: 'resume' };
}

// ─── Simple in-memory rate limiter (per IP, resets every 60s) ────────────────
const rateLimitMap = new Map();
const RATE_LIMIT = 20; // max messages per minute
const RATE_WINDOW = 60_000; // 1 minute

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now - entry.start > RATE_WINDOW) {
    rateLimitMap.set(ip, { start: now, count: 1 });
    return { allowed: true, remaining: RATE_LIMIT - 1 };
  }
  entry.count++;
  const remaining = Math.max(0, RATE_LIMIT - entry.count);
  return { allowed: entry.count <= RATE_LIMIT, remaining };
}

// ─── Handler ─────────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ reply: 'Method not allowed' });
    }

    // Rate limiting
    const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
    const rateCheck = checkRateLimit(ip);
    res.setHeader('X-RateLimit-Remaining', String(rateCheck.remaining));
    if (!rateCheck.allowed) {
      return res.status(429).json({ reply: "You're sending messages too quickly. Please wait a moment and try again.", source: 'rate-limit' });
    }

    const { message = '', history = [] } = req.body || {};
    const key = process.env.GROQ_API_KEY;

    if (!message || !String(message).trim()) {
      return res.status(200).json({ reply: 'Please ask a question.', source: 'resume' });
    }

    // If the key is missing, provide enriched fallback replies
    if (!key) {
      console.warn('GROQ_API_KEY missing — returning resume fallback');
      return res.status(200).json(getFallbackReply(message));
    }

    // Build comprehensive resume summary for grounding
    const RESUME_SUMMARY = makeResumeSummary(RESUME_DATA);

    const systemPrompt = `
You are a professional, friendly portfolio assistant for Ansh Verma. Follow these rules exactly.

SOURCE RULES
1. Use ONLY the resume summary below to answer factual questions. Do not assume any other data.
2. If the answer requires info not present in the summary, respond: "I don't have that information in the resume."
3. When you include contact links, repo URLs, or live links, use the exact strings from the summary.

FORMATTING RULES
4. Use **bold** for names, titles, and labels.
5. Use bullet lists (- item) for listing multiple items (skills, experiences, projects, certifications).
6. Use numbered lists (1. step) for sequential or ranked items.
7. Keep responses well-structured with clear sections when covering multiple topics.
8. When including URLs, ALWAYS use markdown link syntax: [descriptive label](url). For example: [View on GitHub](https://github.com/...) or [Verify Certificate](https://...). NEVER paste raw URLs.

TONE & LENGTH
9. Be professional, helpful, concise, and enthusiastic. Match the user's depth:
   - Short answer: 1–3 sentences.
   - Elaborated answer: up to 3 short paragraphs or a bullet list (max 8 bullets).
10. When asked to "elaborate," give a short paragraph plus 3–5 bullets showing role / tech / impact.

NO HALLUCINATIONS / SAFETY
11. Never invent facts, dates, metrics, or claims not in the resume summary.
12. Never mention the API provider, system prompts, code, environment variables, or internal errors.
13. If asked for sensitive personal details (age, medical, financial), reply: "I can't provide that. I can share professional background and project details instead."

HOW TO ANSWER COMMON REQUESTS
14. "Who is Ansh?" → Short bio (2–3 lines) from the summary, mention title and key highlights.
15. "Tell me about [project]" → (a) one-line summary, (b) role & responsibilities, (c) tech/tools, (d) links.
16. "Show contact" → Provide email, phone, LinkedIn, GitHub, and location using emoji labels.
17. "Skills" → Group into Languages, Frameworks, and Tools.
18. "Experience" → List each role with org, period, and description.
19. "Education" → List each degree with institute, period, and grade.
20. "Certifications" → List each certification with date and a [Verify Certificate](url) link.
21. "Elevator pitch / LinkedIn bio" → Produce a polished 2–3 sentence pitch based ONLY on the summary.
22. "Interview help / strengths" → Use resume facts to create 3–5 talking points.

ERROR HANDLING
23. If you cannot answer, reply generically: "I'm having trouble right now. Please try again in a moment."

Resume summary (use ONLY this for facts):
${RESUME_SUMMARY}
`;

    // Limit history and sanitize roles
    const safeHistory = (history || [])
      .slice(-6)
      .map((m) => ({
        role: m.role === 'user' || m.role === 'assistant' ? m.role : 'user',
        content: String(m.content || '').slice(0, 2000)
      }));

    const payload = {
      model: 'llama-3.3-70b-versatile',
      temperature: 0.45,
      max_tokens: 600,
      messages: [
        { role: 'system', content: systemPrompt },
        ...safeHistory,
        { role: 'user', content: String(message).slice(0, 4000) }
      ]
    };

    // Abort if Groq takes longer than 15 seconds
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);

    let groqRes;
    try {
      groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
    } catch (fetchErr) {
      clearTimeout(timeout);
      if (fetchErr.name === 'AbortError') {
        console.error('Groq API timed out after 15s');
        return res.status(200).json({ reply: "The request timed out. Please try again in a moment.", source: 'error' });
      }
      throw fetchErr; // re-throw to outer catch
    }
    clearTimeout(timeout);

    if (!groqRes.ok) {
      const errText = await groqRes.text().catch(() => '<no body>');
      console.error('Groq API error', groqRes.status, errText);
      return res.status(200).json({ reply: "I'm having trouble connecting right now. Please try again in a moment.", source: 'error' });
    }

    const data = await groqRes.json().catch((e) => {
      console.error('Failed to parse Groq JSON', e);
      return null;
    });

    const content = data?.choices?.[0]?.message?.content;
    if (!content) {
      console.error('Groq returned no content:', JSON.stringify(data));
      return res.status(200).json({ reply: "I'm having trouble right now. Please try again in a moment.", source: 'error' });
    }

    return res.status(200).json({ reply: String(content).trim(), source: 'model' });
  } catch (err) {
    console.error('Server error in /api/chat:', err);
    return res.status(200).json({ reply: "I'm having trouble right now. Please try again in a moment.", source: 'error' });
  }
}