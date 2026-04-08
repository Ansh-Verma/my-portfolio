import React, { useState, useEffect, useRef, useCallback, useMemo, lazy, Suspense } from 'react';
import {
  Menu, X, Github, Linkedin, Mail, ExternalLink, ChevronDown, ChevronUp,
  Terminal, Brain, Code, Download, Send, Award,
  GraduationCap, Trophy, Users, MapPin, Phone,
  Calendar, GitBranch, TrendingUp, ArrowUpRight, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import emailjs from '@emailjs/browser';
import TiltCard from './TiltCard';
import { BeamsBackground } from './components/ui/BeamsBackground';
import TextMarquee from './components/ui/TextMarquee';

// Lazy-load heavy components (Monaco Editor, Recharts)
const SkillsRadar = lazy(() => import('./SkillsRadar'));
const CodePlayground = lazy(() => import('./CodePlayground'));

/* ───────────────────────────────────────────────
   DATA
   ─────────────────────────────────────────────── */

const experiences = [
  {
    role: "Research Intern",
    company: "CSIR, CRRI",
    location: "New Delhi",
    period: "June 2025 – August 2025",
    description: "Designed end-to-end predictive modeling pipelines achieving R² of 0.9604 for urban expressway congestion forecasting.",
    tags: ["ML", "Python", "Data Science"],
    gradient: "from-amber-400 to-orange-500",
  },
  {
    role: "Software Developer Intern",
    company: "DRDO, ADRDE",
    location: "Agra, UP",
    period: "May 2023 – July 2023",
    description: "Built GPS Simulator using C# and .NET framework with Windows Forms.",
    tags: ["C#", ".NET", "Full-Stack"],
    gradient: "from-blue-400 to-indigo-500",
  },
  {
    role: "Machine Learning Trainee",
    company: "JOVAC, GLA University",
    location: "Mathura, UP",
    period: "June 2022 – July 2022",
    description: "Developed proficiency in ML fundamentals and data-driven decision-making.",
    tags: ["ML", "Python"],
    gradient: "from-emerald-400 to-teal-500",
  },
];

const projects = [
  {
    title: "AI-Based Proctored Examination Portal",
    description: "Engineered an AI-powered exam portal ensuring secure and fair online assessments with facial recognition, activity monitoring, automatic grading, and plagiarism detection.",
    period: "June 2024 – April 2025",
    tags: ["HTML5", "CSS3", "Python", "scikit-learn", "MongoDB", "React", "Express", "Node.js"],
    github: "https://github.com/Ansh-Verma/AI-Proctor",
    live: "https://ai-proctor-ruddy.vercel.app",
    category: "ML",
    rating: 5,
  },
];

const certifications = [
  {
    name: "Oracle Cloud Infrastructure 2025 Certified Generative AI Professional",
    verifyUrl: "https://catalog-education.oracle.com/ords/certview/sharebadge?id=DC73D0B5DC6539187FF07368D6B195893D7495CDA48261D41C00941FC84B4EB1",
    date: "2025",
    issuer: "Oracle",
  },
  {
    name: "Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate",
    verifyUrl: "https://catalog-education.oracle.com/ords/certview/sharebadge?id=741E78CFE92F707D187F692C12A7175D89E6F43F3AA3C715E9959E4C21B5299D",
    date: "2025",
    issuer: "Oracle",
  },
  {
    name: "Microsoft Certified: Intelligent Document Processing with Azure AI",
    verifyUrl: "https://learn.microsoft.com/en-us/users/anshverma-6947/credentials/95b2ad3b20b5f982",
    date: "2024",
    issuer: "Microsoft",
  },
  {
    name: "Microsoft Certified: NLP Solution with Azure AI Language",
    verifyUrl: "https://learn.microsoft.com/en-us/users/anshverma-6947/credentials/e4f08a72c98755c1",
    date: "2024",
    issuer: "Microsoft",
  },
];

const skills = {
  languages: ["Java", "Python", "C#", "HTML5", "CSS3", "SQL", "JavaScript"],
  frameworks: [".NET", "ReactJS", "ExpressJS", "NodeJS", "scikit-learn"],
  tools: ["VS Code", "Git", "GitHub", "MongoDB", "Docker", "n8n", "Visual Studio"],
};

const skillLevels = [
  { name: "Machine Learning", level: 92 },
  { name: "Python & AI/ML", level: 90 },
  { name: "Full Stack Dev", level: 85 },
  { name: "Data Analysis", level: 88 },
  { name: "C# & .NET", level: 82 },
  { name: "Cloud Technologies", level: 80 },
];

const ROLES = [
  "AI Engineer",
  "ML Researcher",
  "Full Stack Developer",
];

/* ───────────────────────────────────────────────
   HELPER — glow card mouse tracking
   ─────────────────────────────────────────────── */
function useGlowCards(containerRef) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Disable on touch devices — hover glow doesn't apply
    if ('ontouchstart' in window) return;

    let rafId = null;
    const handleMouseMove = (e) => {
      if (rafId) return; // throttle to 1 update per animation frame
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const cards = container.querySelectorAll('.glow-card');
        cards.forEach((card) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          card.style.setProperty('--mouse-x', `${x}px`);
          card.style.setProperty('--mouse-y', `${y}px`);
        });
      });
    };

    container.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [containerRef]);
}

/* ───────────────────────────────────────────────
   ANIMATED COUNTER HOOK — counts up from 0
   ─────────────────────────────────────────────── */
function useAnimatedCounter(target, duration = 1500, inView = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const num = parseFloat(target);
    if (isNaN(num)) { setCount(target); return; }
    let start = 0;
    const startTime = performance.now();
    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setCount(Math.round(eased * num));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, inView]);
  return count;
}

/* ───────────────────────────────────────────────
   ROTATING TEXT — cycles through roles
   ─────────────────────────────────────────────── */
function RotatingText({ texts, interval = 3000 }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % texts.length);
    }, interval);
    return () => clearInterval(timer);
  }, [texts, interval]);

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={texts[index]}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className="gradient-heading inline-block"
      >
        {texts[index]}
      </motion.span>
    </AnimatePresence>
  );
}


/* ───────────────────────────────────────────────
   MAGNETIC WRAP — subtle cursor-pull effect
   ─────────────────────────────────────────────── */
function MagneticWrap({ children, strength = 0.3 }) {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setPosition({
      x: (e.clientX - cx) * strength,
      y: (e.clientY - cy) * strength,
    });
  };

  const handleMouseLeave = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 200, damping: 15, mass: 0.2 }}
      style={{ display: 'inline-block' }}
    >
      {children}
    </motion.div>
  );
}

/* ───────────────────────────────────────────────
   SECTION HEADING COMPONENT — blur-in staggered
   ─────────────────────────────────────────────── */
function SectionHeading({ badge, title, subtitle }) {
  const words = title.split(' ');
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="text-center mb-16"
    >
      {badge && (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium border mb-6"
          style={{ borderColor: 'var(--border-color)', color: 'var(--accent-primary)' }}
        >
          {badge}
        </motion.span>
      )}
      <h2 className="section-title text-4xl md:text-6xl mb-4">
        {words.map((word, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.12, ease: 'easeOut' }}
            className="gradient-heading inline-block mr-[0.3em]"
          >
            {word}
          </motion.span>
        ))}
      </h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: words.length * 0.12 }}
          className="text-secondary max-w-2xl mx-auto text-lg"
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}

/* ───────────────────────────────────────────────
   ANIMATED SKILL BAR — shimmer fill + counter
   ─────────────────────────────────────────────── */
function SkillBar({ skill, index }) {
  const [inView, setInView] = useState(false);
  const animatedLevel = useAnimatedCounter(skill.level, 1200, inView);
  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      onViewportEnter={() => setInView(true)}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className="glow-card p-5"
      style={{ borderRadius: 'var(--radius-md)' }}
    >
      <div className="flex justify-between mb-3">
        <span className="text-sm font-semibold">{skill.name}</span>
        <span className="text-sm font-bold font-mono" style={{ color: 'var(--accent-primary)' }}>{animatedLevel}%</span>
      </div>
      <div className="skill-bar-track">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="skill-bar-fill"
        />
      </div>
    </motion.div>
  );
}

/* ───────────────────────────────────────────────
   MAIN PORTFOLIO COMPONENT
   ─────────────────────────────────────────────── */
export default function Portfolio() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [yearsOfExp, setYearsOfExp] = useState(0);
  const [activeSkillCategory, setActiveSkillCategory] = useState('languages');
  const [formStatus, setFormStatus] = useState(null); // null | 'sending' | 'sent' | 'error'
  const [activeSection, setActiveSection] = useState('home');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const containerRef = useRef(null);

  useGlowCards(containerRef);

  // Parallax for hero
  const { scrollY, scrollYProgress } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // Active section tracking + back-to-top
  useMotionValueEvent(scrollY, 'change', (latest) => {
    setShowBackToTop(latest > 500);
  });

  useEffect(() => {
    const sectionIds = ['home', 'about', 'experience', 'projects', 'playground', 'skills', 'contact'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Years of experience
  useEffect(() => {
    const startDate = new Date('2022-06-01');
    const now = new Date();
    const years = ((now - startDate) / (1000 * 60 * 60 * 24 * 365)).toFixed(1);
    setYearsOfExp(years);
  }, []);

  const stats = [
    { label: "Years Exp.", value: yearsOfExp, icon: Calendar },
    { label: "GitHub Repos", value: "3", icon: GitBranch },
    { label: "Certifications", value: "4", icon: Award },
    { label: "Projects", value: "4+", icon: TrendingUp },
  ];

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.message) {
      alert('Please fill in all fields');
      return;
    }

    const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      alert('Service not configured properly.');
      return;
    }

    setFormStatus('sending');
    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        time: new Date().toLocaleString(),
      }, PUBLIC_KEY);

      setFormStatus('sent');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setFormStatus(null), 3000);
    } catch {
      setFormStatus('error');
      setTimeout(() => setFormStatus(null), 3000);
    }
  };

  const downloadResume = () => {
    const link = document.createElement('a');
    link.href = '/Ansh_Verma_Resume.pdf';
    link.download = 'Ansh_Verma_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const navItems = ['Home', 'About', 'Experience', 'Projects', 'Playground', 'Skills', 'Contact'];

  return (
    <div ref={containerRef} className="min-h-screen relative" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>

      {/* Global animated beams background */}
      <BeamsBackground intensity="medium" />

      {/* Scroll progress bar */}
      <motion.div className="scroll-progress" style={{ scaleX, width: '100%' }} />

      {/* Noise overlay */}
      <div className="noise-overlay" />

      {/* Ambient gradient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full blur-[120px] opacity-[0.04]"
          style={{ background: 'var(--accent-primary)' }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full blur-[120px] opacity-[0.03]"
          style={{ background: 'var(--accent-secondary)' }}
        />
      </div>

      {/* ══════════════════════════════════════════
          NAVIGATION
          ══════════════════════════════════════════ */}
      <nav className="fixed top-0 w-full z-50 border-b nav-blur"
        style={{ background: 'color-mix(in srgb, var(--bg-primary) 85%, transparent)', borderColor: 'var(--border-color)' }}>
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <motion.a
              href="#home"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-lg font-bold tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              AV<span style={{ color: 'var(--accent-primary)' }}>.</span>
            </motion.a>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item, i) => {
                const isActive = activeSection === item.toLowerCase();
                return (
                  <motion.a
                    key={item}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    href={`#${item.toLowerCase()}`}
                    className="relative px-3 py-2 text-sm font-medium rounded-lg transition-colors nav-link-glow"
                    style={{
                      color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      background: isActive ? 'var(--glow-color)' : 'transparent',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'var(--glow-color)'; }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = isActive ? 'var(--accent-primary)' : 'var(--text-secondary)';
                      e.currentTarget.style.background = isActive ? 'var(--glow-color)' : 'transparent';
                    }}
                  >
                    {item}
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                        style={{ background: 'var(--accent-primary)' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                      />
                    )}
                  </motion.a>
                );
              })}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{ color: 'var(--text-secondary)' }}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-40 md:hidden backdrop-blur-xl pt-20"
            style={{ background: 'color-mix(in srgb, var(--bg-primary) 95%, transparent)' }}
          >
            <div className="flex flex-col items-center gap-6 text-lg">
              {navItems.map((item, i) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="font-medium transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  {item}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════
          HERO SECTION — Premium blur-in reveal
          ══════════════════════════════════════════ */}
      <section id="home" className="relative min-h-screen flex items-center justify-center px-6 pt-20">

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="max-w-5xl mx-auto text-center relative z-10"
        >

          {/* Name — word-by-word blur-in reveal */}
          <h1 className="hero-title text-6xl md:text-9xl mb-6">
            {['Ansh', 'Verma'].map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 + i * 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                className={`inline-block ${i === 1 ? 'gradient-heading ml-[0.3em]' : ''}`}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          {/* Rotating role text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-xl md:text-3xl mb-4 h-10 font-light"
            style={{ color: 'var(--text-secondary)' }}
          >
            <RotatingText texts={ROLES} interval={2800} />
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="text-base md:text-lg mb-10 max-w-2xl mx-auto"
            style={{ color: 'var(--text-secondary)' }}
          >
            Building Intelligent Systems · Oracle & Microsoft Certified
          </motion.p>

          {/* Stats — staggered scale-in with glow */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10 max-w-3xl mx-auto"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 1.1 + i * 0.12, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="glow-card p-4 text-center"
                style={{ borderRadius: 'var(--radius-lg)' }}
              >
                <stat.icon size={18} className="mx-auto mb-2" style={{ color: 'var(--accent-primary)' }} />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTAs — improved with glow ring */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="flex flex-wrap justify-center gap-3 mb-10"
          >
            <MagneticWrap strength={0.25}>
              <a href="#projects" className="btn-accent btn-shimmer">
                View My Work
                <ArrowUpRight size={16} />
              </a>
            </MagneticWrap>
            <MagneticWrap strength={0.25}>
              <a href="#contact" className="btn-ghost">
                Let's Connect
              </a>
            </MagneticWrap>
          </motion.div>

          {/* Social links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
            className="flex justify-center gap-3"
          >
            {[
              { href: "https://github.com/Ansh-Verma", icon: Github, label: "GitHub" },
              { href: "https://linkedin.com/in/anshverma", icon: Linkedin, label: "LinkedIn" },
              { href: "mailto:anshverma1.work@gmail.com", icon: Mail, label: "Email" },
            ].map(({ href, icon: Icon, label }) => (
              <MagneticWrap key={label} strength={0.35}>
                <motion.a
                  whileHover={{ scale: 1.1, borderColor: 'var(--accent-primary)' }}
                  whileTap={{ scale: 0.95 }}
                  href={href}
                  target={href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl border transition-colors block"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                  aria-label={label}
                >
                  <Icon size={20} />
                </motion.a>
              </MagneticWrap>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.a
          href="#about"
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{ color: 'var(--text-tertiary)' }}
        >
          <ChevronDown size={28} />
        </motion.a>
      </section>

      {/* Text marquee strip */}
      <div className="py-8 overflow-hidden">
        <TextMarquee baseVelocity={-2}>
          AI Engineer · Full Stack Developer · Oracle Certified · Microsoft Certified · ML Researcher ·&nbsp;
        </TextMarquee>
        <TextMarquee baseVelocity={2}>
          Python · React · Node.js · scikit-learn · MongoDB · Docker · .NET · C# ·&nbsp;
        </TextMarquee>
      </div>

      <div className="section-divider" style={{ maxWidth: '80%', margin: '4rem auto' }} />

      {/* ══════════════════════════════════════════
          ABOUT SECTION
          ══════════════════════════════════════════ */}
      <section id="about" className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            badge={<><Brain size={14} /> About</>}
            title="About Me"
          />

          <div className="max-w-3xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-5"
            >
              <p className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                I'm an AI Engineer passionate about building intelligent systems that make a real impact. I've worked with prestigious organizations like <strong style={{ color: 'var(--text-primary)' }}>CSIR</strong> and <strong style={{ color: 'var(--text-primary)' }}>DRDO</strong>, gaining hands-on experience in machine learning, AI models, and full-stack development.
              </p>
              <p className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                My expertise spans from developing AI agents to creating AI-powered proctoring systems. I'm certified by <strong style={{ color: 'var(--text-primary)' }}>Oracle</strong> and <strong style={{ color: 'var(--text-primary)' }}>Microsoft</strong> in AI and cloud technologies.
              </p>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={downloadResume}
                className="btn-ghost mt-2"
              >
                <Download size={16} />
                Download Resume
              </motion.button>
            </motion.div>
          </div>

          {/* Education - Bento Grid */}
          <div className="bento-grid-3">
            {[
              { title: "B.Tech CSE", school: "GLA University", period: "2021 – 2025", grade: "CPI: 6.91 / 10.0" },
              { title: "Intermediate", school: "St. Clare's High School", period: "2020 – 2021", grade: "79.3%" },
              { title: "High School", school: "St. Clare's High School", period: "2018 – 2019", grade: "82.5%" },
            ].map((edu, i) => (
              <TiltCard
                key={i}
                className="glow-card p-6"
                style={{ borderRadius: 'var(--radius-lg)' }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.5 }}
                >
                  <GraduationCap size={28} className="mb-3" style={{ color: 'var(--accent-primary)' }} />
                  <h3 className="text-lg font-bold mb-1">{edu.title}</h3>
                  <p className="text-sm mb-0.5" style={{ color: 'var(--text-secondary)' }}>{edu.school}</p>
                  <p className="text-xs mb-2" style={{ color: 'var(--text-tertiary)' }}>{edu.period}</p>
                  <p className="text-sm font-semibold" style={{ color: 'var(--accent-primary)' }}>{edu.grade}</p>
                </motion.div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" style={{ maxWidth: '80%', margin: '4rem auto' }} />

      {/* ══════════════════════════════════════════
          EXPERIENCE SECTION — with timeline
          ══════════════════════════════════════════ */}
      <section id="experience" className="relative py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <SectionHeading
            badge={<><Terminal size={14} /> Career</>}
            title="Work Experience"
          />

          <div className="timeline-container space-y-4">
            {experiences.map((exp, index) => (
              <TiltCard
                key={index}
                className="glow-card p-6 md:p-8"
                style={{ borderRadius: 'var(--radius-xl)' }}
              >
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-5">
                    {/* Icon */}
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${exp.gradient} flex items-center justify-center shrink-0`}
                    >
                      <Code size={22} className="text-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                        <div>
                          <h3 className="text-xl font-bold">{exp.role}</h3>
                          <p className="text-sm font-semibold" style={{ color: 'var(--accent-primary)' }}>{exp.company}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs flex items-center gap-1" style={{ color: 'var(--text-tertiary)' }}>
                            <MapPin size={12} />
                            {exp.location}
                          </p>
                          <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{exp.period}</p>
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
                        {exp.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {exp.tags.map((tag, i) => (
                          <span key={i} className="pill">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" style={{ maxWidth: '80%', margin: '4rem auto' }} />

      {/* ══════════════════════════════════════════
          PROJECTS SECTION
          ══════════════════════════════════════════ */}
      <section id="projects" className="relative py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <SectionHeading
            badge={<><Sparkles size={14} /> Work</>}
            title="Featured Projects"
          />

          <div className="space-y-6">
            {projects.map((project, i) => (
              <TiltCard
                key={i}
                className="glow-card p-8 md:p-10"
                style={{ borderRadius: 'var(--radius-xl)' }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' }}
                    >
                      <Sparkles size={22} className="text-white" />
                    </div>
                    <span className="text-xs font-mono" style={{ color: 'var(--text-tertiary)' }}>{project.period}</span>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold mb-3">{project.title}</h3>
                  <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map((tech, j) => (
                      <motion.span
                        key={j}
                        className="pill"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + j * 0.04 }}
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    {project.live && (
                      <a href={project.live} target="_blank" rel="noopener noreferrer" className="btn-accent" style={{ fontSize: '0.8rem', padding: '0.5rem 1.25rem' }}>
                        <ExternalLink size={14} />
                        Live Demo
                      </a>
                    )}
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ fontSize: '0.8rem', padding: '0.5rem 1.25rem' }}>
                        <Github size={14} />
                        GitHub
                      </a>
                    )}
                  </div>
                </motion.div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CODE PLAYGROUND SECTION
          ══════════════════════════════════════════ */}
      <Suspense fallback={<div className="py-24 text-center" style={{ color: 'var(--text-tertiary)' }}>Loading playground...</div>}>
        <CodePlayground />
      </Suspense>

      <div className="section-divider" style={{ maxWidth: '80%', margin: '4rem auto' }} />

      {/* ══════════════════════════════════════════
          SKILLS SECTION
          ══════════════════════════════════════════ */}
      <section id="skills" className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            badge={<><Code size={14} /> Expertise</>}
            title="Technical Skills"
          />

          {/* Radar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glow-card p-6 md:p-8 mb-12"
            style={{ borderRadius: 'var(--radius-xl)' }}
          >
            <h3 className="text-xl font-bold mb-4 text-center">Skills Radar</h3>
            <Suspense fallback={<div className="h-[400px] flex items-center justify-center" style={{ color: 'var(--text-tertiary)' }}>Loading chart...</div>}>
              <SkillsRadar />
            </Suspense>
          </motion.div>

          {/* Skill Bars — animated counters */}
          <div className="grid md:grid-cols-2 gap-4 mb-12">
            {skillLevels.map((skill, index) => (
              <SkillBar key={index} skill={skill} index={index} />
            ))}
          </div>

          {/* Skills Categories — Tabbed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glow-card p-6 md:p-8 mb-12"
            style={{ borderRadius: 'var(--radius-xl)' }}
          >
            <div className="flex gap-2 mb-6 flex-wrap">
              {[
                { key: 'languages', label: 'Languages', icon: Code },
                { key: 'frameworks', label: 'Frameworks', icon: Brain },
                { key: 'tools', label: 'Tools', icon: Terminal },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveSkillCategory(key)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background: activeSkillCategory === key ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                    color: activeSkillCategory === key ? '#0a0a0a' : 'var(--text-secondary)',
                    border: `1px solid ${activeSkillCategory === key ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                  }}
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <AnimatePresence mode="wait">
                {skills[activeSkillCategory].map((item, j) => (
                  <motion.span
                    key={item}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: j * 0.03 }}
                    className="pill"
                    style={{ fontSize: '0.85rem', padding: '0.4rem 1rem' }}
                  >
                    {item}
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Certifications */}
          <SectionHeading
            badge={<><Award size={14} /> Credentials</>}
            title="Certifications"
          />

          <div className="grid md:grid-cols-2 gap-4 mb-12">
            {certifications.map((cert, index) => (
              <TiltCard
                key={index}
                className="glow-card p-5"
                style={{ borderRadius: 'var(--radius-lg)' }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="flex items-start gap-4"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)' }}
                  >
                    <Award size={18} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-snug mb-1">{cert.name}</p>
                    <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      <span>{cert.issuer}</span>
                      <span>·</span>
                      <span>{cert.date}</span>
                    </div>
                    <a
                      href={cert.verifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs mt-2 transition-colors"
                      style={{ color: 'var(--accent-primary)' }}
                    >
                      Verify
                      <ArrowUpRight size={12} />
                    </a>
                  </div>
                </motion.div>
              </TiltCard>
            ))}
          </div>

          {/* Leadership */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glow-card p-6 md:p-8"
            style={{ borderRadius: 'var(--radius-xl)' }}
          >
            <div className="flex items-start gap-5">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'linear-gradient(135deg, #10b981, #14b8a6)' }}
              >
                <Users size={22} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">Vice President — Aikyam GLAU Club</h3>
                <p className="text-sm mb-3" style={{ color: 'var(--accent-primary)' }}>GLA University, Mathura</p>
                <ul className="space-y-2">
                  {[
                    "Led a team of 50+ members in organizing cultural events and workshops",
                    "Chaired weekly strategy meetings and optimized team workflow",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <Trophy size={14} className="mt-0.5 shrink-0" style={{ color: 'var(--accent-primary)' }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="section-divider" style={{ maxWidth: '80%', margin: '4rem auto' }} />

      {/* ══════════════════════════════════════════
          CONTACT SECTION — Visual upgrade
          ══════════════════════════════════════════ */}
      <section id="contact" className="relative py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <SectionHeading
            badge={<><Mail size={14} /> Connect</>}
            title="Get in Touch"
            subtitle="Have a project in mind or want to collaborate? I'd love to hear from you."
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glow-card p-6 md:p-10"
            style={{ borderRadius: 'var(--radius-xl)' }}
          >
            <div className="space-y-6">
              <div className="input-group">
                <input
                  type="text"
                  id="contact-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl text-sm transition-all input-glow"
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                  placeholder=" "
                />
                <label htmlFor="contact-name">Name</label>
              </div>

              <div className="input-group">
                <input
                  type="email"
                  id="contact-email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl text-sm transition-all input-glow"
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                  placeholder=" "
                />
                <label htmlFor="contact-email">Email</label>
              </div>

              <div className="input-group">
                <textarea
                  id="contact-message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows="5"
                  className="w-full px-4 py-3.5 rounded-xl text-sm transition-all resize-none input-glow"
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                  placeholder=" "
                />
                <label htmlFor="contact-message">Message</label>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleSubmit}
                disabled={formStatus === 'sending'}
                className="btn-accent btn-shimmer w-full justify-center py-3.5 text-base"
              >
                {formStatus === 'sending' ? (
                  'Sending...'
                ) : formStatus === 'sent' ? (
                  '✓ Message Sent!'
                ) : formStatus === 'error' ? (
                  '✕ Failed — Try Again'
                ) : (
                  <>
                    <Send size={16} />
                    Send Message
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Contact cards */}
          <div className="grid grid-cols-3 gap-3 mt-8">
            {[
              { href: "mailto:anshverma1.work@gmail.com", icon: Mail, text: "Email", color: 'var(--accent-primary)' },
              { href: "tel:+916398775442", icon: Phone, text: "Phone", color: 'var(--accent-secondary)' },
              { href: null, icon: MapPin, text: "Agra, UP", color: 'var(--accent-success)' },
            ].map(({ href, icon: Icon, text, color }, i) => {
              const Tag = href ? 'a' : 'div';
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                >
                  <Tag
                    href={href || undefined}
                    className="glow-card p-4 text-center block"
                    style={{ borderRadius: 'var(--radius-lg)' }}
                  >
                    <Icon size={20} className="mx-auto mb-2" style={{ color }} />
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{text}</p>
                  </Tag>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FOOTER — with personality
          ══════════════════════════════════════════ */}
      <div className="section-divider" style={{ maxWidth: '100%', margin: '0 auto' }} />
      <footer className="py-12 px-6" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <p className="text-sm font-medium mb-1 footer-gradient-text">
                Designed & Built by Ansh Verma
              </p>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                © {new Date().getFullYear()} · Crafted with passion, React, and too much coffee ☕
              </p>
            </div>
            <div className="flex gap-4">
              {[
                { href: "https://github.com/Ansh-Verma", icon: Github },
                { href: "https://linkedin.com/in/anshverma", icon: Linkedin },
                { href: "mailto:anshverma1.work@gmail.com", icon: Mail },
              ].map(({ href, icon: Icon }, i) => (
                <motion.a
                  key={i}
                  href={href}
                  target={href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg border transition-all"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--text-tertiary)' }}
                  whileHover={{ scale: 1.1, borderColor: 'var(--accent-primary)', color: 'var(--accent-primary)' }}
                  whileTap={{ scale: 0.9 }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-primary)'; e.currentTarget.style.borderColor = 'var(--accent-primary)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-tertiary)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Back to top */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="back-to-top"
            aria-label="Back to top"
          >
            <ChevronUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}