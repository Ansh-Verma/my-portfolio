import React, { useState, useEffect } from 'react';
import {
  Menu, X, Github, Linkedin, Mail, ExternalLink, ChevronDown,
  Terminal, Brain, Code, Sparkles, Download, Send, Award,
  GraduationCap, Trophy, Users, MapPin, Phone, Sun, Moon,
  Filter, Search, Star, Calendar, GitBranch, TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './ThemeContext';
import SkillsRadar from './SkillsRadar';
import Brain3D from './Brain3D';
import emailjs from '@emailjs/browser';

const PARTICLES = (() => {
  const colors = ['#06b6d4', '#8b5cf6', '#ec4899', '#10b981'];
  const arr = [];
  for (let i = 0; i < 30; i++) {
    const w = 2 + Math.random() * 4;
    const h = 2 + Math.random() * 4;
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    const bg = colors[Math.floor(Math.random() * colors.length)];
    const delay = Math.random() * 5;
    const dur = 5 + Math.random() * 10;
    const shadow = 10 + Math.random() * 20;
    arr.push({
      width: `${w}px`,
      height: `${h}px`,
      left: `${left}%`,
      top: `${top}%`,
      background: bg,
      animationDelay: `${delay}s`,
      animationDuration: `${dur}s`,
      boxShadow: `0 0 ${shadow}px currentColor`
    });
  }
  return arr;
})();

export default function Portfolio() {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [typedText, setTypedText] = useState('');
  const [isTyping] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [yearsOfExp, setYearsOfExp] = useState(0);
  const fullText = "Building Intelligent Systems";

  useEffect(() => {
    if (isTyping && typedText.length < fullText.length) {
      const timeout = setTimeout(() => {
        setTypedText(fullText.slice(0, typedText.length + 1));
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [typedText, isTyping]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const startDate = new Date('2022-06-01');
    const now = new Date();
    const years = ((now - startDate) / (1000 * 60 * 60 * 24 * 365)).toFixed(1);
    setYearsOfExp(years);
  }, []);

  const experiences = [
    {
      role: "Research Intern",
      company: "CSIR, CRRI",
      location: "New Delhi",
      period: "June 2025 – August 2025",
      description: "Designed end-to-end predictive modeling pipelines achieving R² of 0.9604 for urban expressway congestion forecasting",
      icon: Brain,
      gradient: "from-cyan-400 to-blue-600",
      tags: ["ML", "Python", "Data Science"]
    },
    {
      role: "Software Developer Intern",
      company: "DRDO, ADRDE",
      location: "Agra, Uttar Pradesh",
      period: "May 2023 – July 2023",
      description: "Built GPS Simulator using C# and .NET framework with Windows Forms",
      icon: Code,
      gradient: "from-purple-400 to-pink-600",
      tags: ["C#", ".NET", "Full-Stack"]
    },
    {
      role: "Machine Learning Trainee",
      company: "JOVAC, GLA University",
      location: "Mathura, Uttar Pradesh",
      period: "June 2022 – July 2022",
      description: "Developed proficiency in ML fundamentals and data-driven decision-making",
      icon: Terminal,
      gradient: "from-green-400 to-teal-600",
      tags: ["ML", "Python"]
    }
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
      rating: 5
    }
  ];

  const certifications = [
    {
      name: "Oracle Cloud Infrastructure 2025 Certified Generative AI Professional",
      icon: Award,
      verifyUrl: "https://catalog-education.oracle.com/ords/certview/sharebadge?id=DC73D0B5DC6539187FF07368D6B195893D7495CDA48261D41C00941FC84B4EB1",
      date: "2025",
    },
    {
      name: "Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate",
      icon: Award,
      verifyUrl: "https://catalog-education.oracle.com/ords/certview/sharebadge?id=741E78CFE92F707D187F692C12A7175D89E6F43F3AA3C715E9959E4C21B5299D",
      date: "2025",
    },
    {
      name: "Microsoft Certified: Intelligent Document Processing with Azure AI",
      icon: Award,
      verifyUrl: "https://learn.microsoft.com/en-us/users/anshverma-6947/credentials/95b2ad3b20b5f982?ref=https%3A%2F%2Fwww.linkedin.com%2F",
      date: "2024",
    },
    {
      name: "Microsoft Certified: NLP Solution with Azure AI Language",
      icon: Award,
      verifyUrl: "https://learn.microsoft.com/en-us/users/anshverma-6947/credentials/e4f08a72c98755c1?ref=https%3A%2F%2Fwww.linkedin.com%2F",
      date: "2024",
    }
  ];

  const skills = {
    languages: ["Java", "Python", "C#", "HTML5", "CSS3", "SQL", "JavaScript"],
    frameworks: [".NET", "ReactJS", "ExpressJS", "NodeJS", "scikit-learn"],
    tools: ["VS Code", "Git", "GitHub", "MongoDB", "Docker", "n8n", "Visual Studio"]
  };

  const skillLevels = [
    { name: "Machine Learning", level: 92, color: "bg-cyan-500" },
    { name: "Python & AI/ML", level: 90, color: "bg-purple-500" },
    { name: "Full Stack Development", level: 85, color: "bg-blue-500" },
    { name: "C# & .NET", level: 82, color: "bg-green-500" },
    { name: "Data Analysis", level: 88, color: "bg-pink-500" },
    { name: "Cloud Technologies", level: 80, color: "bg-yellow-500" }
  ];

  const stats = [
    { label: "Years Experience", value: yearsOfExp, icon: Calendar, color: "text-cyan-400" },
    { label: "GitHub Repos", value: "3", icon: GitBranch, color: "text-purple-400" },
    { label: "Certifications", value: "4", icon: Award, color: "text-pink-400" },
    { label: "Projects Completed", value: "4+", icon: TrendingUp, color: "text-green-400" }
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
      console.error('Missing EmailJS environment variables');
      alert('Service not configured properly. Please try again later.');
      return;
    }

    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          name: formData.name,
          email: formData.email,
          message: formData.message,
          time: new Date().toLocaleString(),
        },
        PUBLIC_KEY
      );

      alert('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('EmailJS error:', error);
      alert('Failed to send message. Try again later.');
    }
  };

  // Single PDF download (assumes /public/Ansh_Verma_Resume.pdf)
  const downloadResume = () => {
    const link = document.createElement('a');
    link.href = '/Ansh_Verma_Resume.pdf';
    link.download = 'Ansh_Verma_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredProjects = projects.filter(project => {
    const matchesFilter = selectedFilter === 'all' || project.category === selectedFilter;
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen overflow-hidden relative transition-colors duration-500 bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Enhanced Animated Background (dark mode only) */}
      <div className="hidden dark:block fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-[500px] h-[500px] bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{
            x: mousePosition.x - 250,
            y: mousePosition.y - 250,
          }}
          transition={{ type: 'spring', stiffness: 50, damping: 20 }}
        />
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-0 right-4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-3000" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-5000" />
      </div>

      {/* Grid pattern (dark mode only) */}
      <div className="hidden dark:block fixed inset-0 pointer-events-none opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Floating particles (dark mode only) */}
      <div className="hidden dark:block fixed inset-0 pointer-events-none">
        {PARTICLES.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0], y: [0, -100] }}
            transition={{
              duration: parseFloat(p.animationDuration),
              delay: parseFloat(p.animationDelay),
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              width: p.width,
              height: p.height,
              left: p.left,
              top: p.top,
              background: p.background,
              boxShadow: p.boxShadow
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-12 h-12"
            >
              {/* empty placeholder to preserve layout */}
            </motion.div>

            <div className="hidden md:flex items-center space-x-8">
              {['Home', 'About', 'Experience', 'Projects', 'Skills', 'Contact'].map((item, i) => (
                <motion.a
                  key={item}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  href={`#${item.toLowerCase()}`}
                  className="relative group text-secondary hover:text-primary transition-colors duration-300"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-purple)] group-hover:w-full transition-all duration-300" />
                </motion.a>
              ))}

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className="p-2 rounded-full glass-hover transition-all duration-300"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </motion.button>
            </div>

            <button
              className="md:hidden text-[var(--text-secondary)]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Open menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
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
            className="fixed inset-0 z-40 md:hidden glass backdrop-blur-xl pt-20"
          >
            <div className="flex flex-col items-center space-y-8 text-xl">
              {['Home', 'About', 'Experience', 'Projects', 'Skills', 'Contact'].map((item) => (
                <motion.a
                  key={item}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-secondary hover:text-primary transition-colors"
                >
                  {item}
                </motion.a>
              ))}
              <button
                onClick={toggleTheme}
                className="p-3 rounded-full glass-hover"
              >
                {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center px-6 pt-32">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="inline-block p-6 glass rounded-full border mb-6 animate-pulse-slow">
              <Brain size={64} className="text-[var(--accent-cyan)] animate-float-slow" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-8xl font-bold mb-6"
          >
            <span className="gradient-heading inline-block animate-gradient">
              Ansh Verma
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-2xl md:text-4xl text-secondary mb-4 h-12"
          >
            <span className="font-mono">{typedText}</span>
            <span className="animate-blink">|</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-lg md:text-xl text-secondary mb-8 max-w-3xl mx-auto"
          >
            AI Engineer | B.Tech CSE @ GLA University | Oracle & Microsoft Certified
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="glass glass-hover rounded-2xl p-4 text-center"
              >
                <stat.icon className={`${stat.color} mx-auto mb-2`} size={24} />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-secondary">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <motion.a
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              href="#projects"
              className="group relative px-8 py-4 bg-[linear-gradient(90deg,var(--accent-cyan),var(--accent-purple))] rounded-full font-semibold overflow-hidden text-white"
            >
              <span className="relative z-10">View My Work</span>
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              href="#contact"
              className="px-8 py-4 rounded-full font-semibold glass-hover border"
            >
              Let's Connect
            </motion.a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex justify-center gap-6 mt-12"
          >
            <motion.a
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              href="https://github.com/Ansh-Verma"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 glass glass-hover rounded-full hover:border"
            >
              <Github size={28} className="group-hover:text-[var(--accent-cyan)] transition-colors" />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              href="https://linkedin.com/in/anshverma"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 glass glass-hover rounded-full hover:border"
            >
              <Linkedin size={28} className="group-hover:text-[var(--accent-purple)] transition-colors" />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              href="mailto:anshverma1.work@gmail.com"
              className="p-4 glass glass-hover rounded-full hover:border"
            >
              <Mail size={28} className="group-hover:text-pink-400 transition-colors" />
            </motion.a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-secondary"
          >
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-[var(--accent-cyan)]" />
              <span>anshverma1.work@gmail.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={16} className="text-[var(--accent-purple)]" />
              <span>+91 6398775442</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-[var(--accent-purple)]" />
              <span>Agra, Uttar Pradesh</span>
            </div>
          </motion.div>
        </div>

        <motion.a
          href="#about"
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ChevronDown size={40} className="text-[var(--accent-cyan)]" />
        </motion.a>
      </section>

      {/* About Section */}
      <section id="about" className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-bold mb-16 text-center"
          >
            <span className="gradient-heading">
              About Me
            </span>
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <p className="text-lg text-secondary leading-relaxed">
                I'm an AI Engineer passionate about building intelligent AI systems that make a real impact, I've worked with prestigious organizations like CSIR, DRDO, and gained hands-on experience in machine learning, AI models, and full-stack development.
              </p>
              <p className="text-lg text-secondary leading-relaxed">
                My expertise spans from developing AI agents to creating AI-powered proctoring systems. I'm certified by Oracle and Microsoft in AI and cloud technologies, and I'm driven by the challenge of solving complex problems with innovative solutions.
              </p>

              <div className="flex">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={downloadResume}
                  className="flex items-center gap-2 px-6 py-3 glass glass-hover rounded-full font-semibold"
                >
                  <Download size={18} />
                  Download Resume 
                </motion.button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative group h-96"
            >
              <div className="absolute inset-0 glass rounded-3xl overflow-hidden">
                <Brain3D />
              </div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-[var(--accent-cyan)] rounded-full filter blur-3xl opacity-30 animate-pulse" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[var(--accent-purple)] rounded-full filter blur-3xl opacity-30 animate-pulse animation-delay-1000" />
            </motion.div>
          </div>

          {/* Education Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "B.Tech CSE", school: "GLA University", period: "2021 – 2025", grade: "CPI: 6.91/10.0", color: "cyan" },
              { title: "Intermediate", school: "St. Clare's High School", period: "2020 – 2021", grade: "79.3%", color: "purple" },
              { title: "High School", school: "St. Clare's High School", period: "2018 – 2019", grade: "82.5%", color: "pink" }
            ].map((edu, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="glass glass-hover rounded-2xl p-6"
              >
                <GraduationCap size={40} className={`text-[var(--accent-cyan)] mb-4`} />
                <h3 className="text-xl font-bold mb-2">{edu.title}</h3>
                <p className="text-secondary mb-1">{edu.school}</p>
                <p className="text-sm text-secondary">{edu.period}</p>
                <p className={`text-[var(--accent-cyan)] font-semibold mt-2`}>{edu.grade}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-bold mb-16 text-center"
          >
            <span className="gradient-heading">
              Work Experience
            </span>
          </motion.h2>

          <div className="space-y-8">
            {experiences.map((exp, index) => {
              const Icon = exp.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                  className="group relative glass glass-hover rounded-3xl p-8"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${exp.gradient} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500`} />

                  <div className="relative z-10 flex items-start gap-6">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className={`p-4 bg-gradient-to-br ${exp.gradient} rounded-2xl shrink-0`}
                    >
                      <Icon size={32} />
                    </motion.div>

                    <div className="flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                        <div>
                          <h3 className="text-2xl font-bold mb-1 group-hover:text-[var(--accent-cyan)] transition-colors duration-300">
                            {exp.role}
                          </h3>
                          <p className="text-lg text-[var(--accent-purple)] font-semibold">{exp.company}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-secondary flex items-center gap-2">
                            <MapPin size={16} />
                            {exp.location}
                          </p>
                          <p className="text-sm text-secondary mt-1">{exp.period}</p>
                        </div>
                      </div>
                      <p className="text-secondary leading-relaxed mb-4">{exp.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {exp.tags.map((tag, i) => (
                          <span key={i} className="px-3 py-1 glass rounded-full text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-bold mb-8 text-center"
          >
            <span className="gradient-heading">
              Featured Projects
            </span>
          </motion.h2>

          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap gap-4 mb-12 justify-center"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" size={20} />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 glass glass-hover rounded-xl border focus:border-[var(--accent-cyan)] focus:outline-none transition-colors w-64 text-[var(--text-primary)] placeholder:text-secondary"
              />
            </div>

            <div className="flex gap-2">
              {['all', 'ML', 'Full-Stack', 'Cloud'].map((filter) => (
                <motion.button
                  key={filter}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                    selectedFilter === filter
                      ? 'bg-[linear-gradient(90deg,var(--accent-cyan),var(--accent-purple))] text-white'
                      : 'glass glass-hover'
                  }`}
                >
                  <Filter size={16} className="inline mr-2" />
                  {filter}
                </motion.button>
              ))}
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <AnimatePresence>
              {filteredProjects.map((project, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ scale: 1.02 }}
                  className="group relative glass glass-hover rounded-3xl p-10 border-2"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-cyan)] via-[var(--accent-purple)] to-pink-500 opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500" />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className="p-4 bg-gradient-to-br from-[var(--accent-cyan)] to-[var(--accent-purple)] rounded-2xl"
                      >
                        <Sparkles size={40} />
                      </motion.div>

                      {/* top-right icon now opens live first (if available) */}
                      <a
                        href={project.live || project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 glass glass-hover rounded-full"
                      >
                        <ExternalLink className="text-[var(--accent-cyan)]" size={24} />
                      </a>
                    </div>

                    <h3 className="text-3xl font-bold mb-4 group-hover:text-[var(--accent-cyan)] transition-colors duration-300">
                      {project.title}
                    </h3>

                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(project.rating)].map((_, i) => (
                        <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>

                    <p className="text-lg text-secondary mb-4 leading-relaxed">
                      {project.description}
                    </p>

                    <p className="text-secondary mb-6">{project.period}</p>

                    <div className="flex flex-wrap gap-3">
                      {project.tags.map((tech, i) => (
                        <motion.span
                          key={i}
                          whileHover={{ scale: 1.1 }}
                          className="px-4 py-2 glass glass-hover rounded-full text-sm border"
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>

                    {/* NEW: Live Demo + GitHub buttons (visible, accessible, primary = Live) */}
                    <div className="flex gap-4 mt-6">
                      {project.live && (
                        <motion.a
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-5 py-2 bg-[linear-gradient(90deg,var(--accent-cyan),var(--accent-purple))] rounded-full text-white text-sm font-semibold"
                          aria-label={`${project.title} - Live Demo`}
                        >
                          <ExternalLink size={16} />
                          Live Demo
                        </motion.a>
                      )}

                      {project.github && (
                        <motion.a
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-5 py-2 glass glass-hover rounded-full text-sm border"
                          aria-label={`${project.title} - GitHub`}
                        >
                          <Github size={16} />
                          GitHub
                        </motion.a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-bold mb-16 text-center"
          >
            <span className="gradient-heading">
              Technical Expertise
            </span>
          </motion.h2>

          {/* Radar Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mb-16 glass glass-hover rounded-3xl p-8"
          >
            <h3 className="text-2xl font-bold mb-6 text-center">Skills Radar</h3>
            <SkillsRadar />
          </motion.div>

          {/* Skill Bars */}
          <div className="space-y-8 mb-16">
            {skillLevels.map((skill, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="flex justify-between mb-3">
                  <span className="text-xl font-semibold">{skill.name}</span>
                  <span className="text-[var(--accent-cyan)] font-bold">{skill.level}%</span>
                </div>
                <div className="h-4 glass rounded-full overflow-hidden border">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className={`h-full ${skill.color} rounded-full relative`}
                    style={{ boxShadow: '0 0 20px currentColor' }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-shimmer" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Skills Categories */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {[
              { title: "Languages", items: skills.languages, icon: Code, gradient: "from-cyan-500 to-blue-500" },
              { title: "Frameworks", items: skills.frameworks, icon: Brain, gradient: "from-purple-500 to-pink-500" },
              { title: "Tools", items: skills.tools, icon: Terminal, gradient: "from-pink-500 to-red-500" }
            ].map((category, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="glass glass-hover rounded-2xl p-8"
              >
                <category.icon size={40} className={`bg-gradient-to-br ${category.gradient} bg-clip-text text-transparent mb-4`} />
                <h3 className="text-2xl font-bold mb-4">{category.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {category.items.map((item, j) => (
                    <motion.span
                      key={j}
                      whileHover={{ scale: 1.1 }}
                      className="px-3 py-1 glass rounded-full text-sm border"
                    >
                      {item}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Certifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-4xl font-bold mb-8 text-center">
              <span className="bg-[linear-gradient(90deg,var(--accent-cyan),#f59e0b)] bg-clip-text text-transparent">
                Certifications & Achievements
              </span>
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {certifications.map((cert, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-start gap-4 glass glass-hover rounded-2xl p-6"
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl shrink-0"
                  >
                    <Award size={24} />
                  </motion.div>
                  <div>
                    <p className="text-secondary leading-relaxed mb-2">{cert.name}</p>
                    <p className="text-sm text-secondary mb-2">{cert.date}</p>
                    <a
                      href={cert.verifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--accent-cyan)] text-sm hover:underline"
                    >
                      Verify Certificate →
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Leadership */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 glass glass-hover rounded-3xl p-8 border"
          >
            <div className="flex items-start gap-6">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="p-4 bg-gradient-to-br from-green-400 to-teal-500 rounded-2xl shrink-0"
              >
                <Users size={40} />
              </motion.div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Vice President - Aikyam GLAU Club</h3>
                <p className="text-lg text-[var(--accent-cyan)] mb-3">GLA University, Mathura</p>
                <ul className="space-y-2 text-secondary">
                  <li className="flex items-start gap-2">
                    <Trophy size={16} className="text-[var(--accent-cyan)] mt-1 shrink-0" />
                    <span>Led a team of 50+ members in organizing cultural events and workshops</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Trophy size={16} className="text-[var(--accent-cyan)] mt-1 shrink-0" />
                    <span>Chaired weekly strategy meetings and optimized team workflow</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-bold mb-16 text-center"
          >
            <span className="gradient-heading">
              Let's Connect
            </span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass glass-hover rounded-3xl p-8 md:p-12"
          >
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-secondary">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-4 glass rounded-xl focus:border-[var(--accent-cyan)] focus:outline-none transition-colors duration-300 text-[var(--text-primary)] placeholder:text-secondary"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-secondary">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-4 glass rounded-xl focus:border-[var(--accent-cyan)] focus:outline-none transition-colors duration-300 text-[var(--text-primary)] placeholder:text-secondary"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-secondary">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows="6"
                  className="w-full px-4 py-4 glass rounded-xl focus:border-[var(--accent-cyan)] focus:outline-none transition-colors duration-300 resize-none text-[var(--text-primary)] placeholder:text-secondary"
                  placeholder="Your message..."
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                className="w-full py-4 bg-[linear-gradient(90deg,var(--accent-cyan),var(--accent-purple))] rounded-xl font-semibold flex items-center justify-center gap-2 text-white"
              >
                <Send size={20} />
                Send Message
              </motion.button>
            </div>
          </motion.div>

          <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
            <motion.a
              whileHover={{ scale: 1.05 }}
              href="mailto:anshverma1.work@gmail.com"
              className="p-6 glass glass-hover rounded-2xl hover:border"
            >
              <Mail size={32} className="mx-auto mb-3 text-[var(--accent-cyan)]" />
              <p className="text-sm text-secondary break-all">anshverma1.work@gmail.com</p>
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              href="tel:+916398775442"
              className="p-6 glass glass-hover rounded-2xl hover:border"
            >
              <Phone size={32} className="mx-auto mb-3 text-[var(--accent-purple)]" />
              <p className="text-sm text-secondary">+91 6398775442</p>
            </motion.a>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-6 glass glass-hover rounded-2xl hover:border"
            >
              <MapPin size={32} className="mx-auto mb-3 text-pink-400" />
              <p className="text-sm text-secondary">Agra, Uttar Pradesh</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-6 border-t">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-secondary mb-4">
            © 2026 Ansh Verma. Crafted with passion and code.
          </p>
          <div className="flex justify-center gap-6">
            <motion.a
              whileHover={{ scale: 1.2 }}
              href="https://github.com/Ansh-Verma"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary hover:text-[var(--accent-cyan)] transition-colors"
            >
              <Github size={24} />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.2 }}
              href="https://linkedin.com/in/anshverma"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary hover:text-[var(--accent-purple)] transition-colors"
            >
              <Linkedin size={24} />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.2 }}
              href="mailto:anshverma1.work@gmail.com"
              className="text-secondary hover:text-pink-400 transition-colors"
            >
              <Mail size={24} />
            </motion.a>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh) translateX(50px); opacity: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-3000 { animation-delay: 3s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animation-delay-5000 { animation-delay: 5s; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animate-float { animation: float linear infinite; }
        .animate-float-slow { animation: float 6s ease-in-out infinite; }
        .animate-fadeIn { animation: fadeIn 1s ease-out; }
        .animate-slideUp { animation: slideUp 0.8s ease-out; }
        .animation-delay-200 { animation-delay: 0.2s; animation-fill-mode: both; }
        .animation-delay-300 { animation-delay: 0.3s; animation-fill-mode: both; }
        .animation-delay-400 { animation-delay: 0.4s; animation-fill-mode: both; }
        .animation-delay-600 { animation-delay: 0.6s; animation-fill-mode: both; }
        .animation-delay-700 { animation-delay: 0.7s; animation-fill-mode: both; }
        .animate-blink { animation: blink 1s infinite; }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .animate-pulse-slow { animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        .animate-shimmer { animation: shimmer 2s infinite; }

        /* Small compatibility helpers for browsers that don't handle color-mix in index.css */
        .glass-hover:hover {
          filter: saturate(1.03);
        }
      `}</style>
    </div>
  );
}