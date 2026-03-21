import React, { useState, useCallback, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ChevronDown, Terminal, Clock, Loader2, RotateCcw, Copy, Check } from 'lucide-react';
import { useTheme } from './ThemeContext';

const LANGUAGES = [
  { id: 'python', label: 'Python', version: '3.10.0', monacoId: 'python', icon: '🐍' },
  { id: 'javascript', label: 'JavaScript', version: '18.15.0', monacoId: 'javascript', icon: '⚡' },
  { id: 'typescript', label: 'TypeScript', version: '5.0.3', monacoId: 'typescript', icon: '🔷' },
  { id: 'c++', label: 'C++', version: '10.2.0', monacoId: 'cpp', icon: '⚙️' },
  { id: 'java', label: 'Java', version: '15.0.2', monacoId: 'java', icon: '☕' },
  { id: 'rust', label: 'Rust', version: '1.68.2', monacoId: 'rust', icon: '🦀' },
  { id: 'go', label: 'Go', version: '1.16.2', monacoId: 'go', icon: '🐹' },
  { id: 'c', label: 'C', version: '10.2.0', monacoId: 'c', icon: '🔧' },
];

const DEFAULT_CODE = {
  python: '# Python 3.10\nprint("Hello, World! 🐍")\n\nfor i in range(5):\n    print(f"  Iteration {i + 1}")\n\nprint("\\nDone!")',
  javascript: '// JavaScript (Node.js 18)\nconsole.log("Hello, World! ⚡");\n\nconst fibonacci = (n) => {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n};\n\nfor (let i = 0; i < 8; i++) {\n  console.log(`  fib(${i}) = ${fibonacci(i)}`);\n}\n\nconsole.log("\\nDone!");',
  typescript: '// TypeScript 5.0\nconst greet = (name: string): string => {\n  return `Hello, ${name}! 🔷`;\n};\n\nconsole.log(greet("World"));\n\ninterface Point {\n  x: number;\n  y: number;\n}\n\nconst distance = (a: Point, b: Point): number => {\n  return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);\n};\n\nconsole.log(`Distance: ${distance({x:0,y:0}, {x:3,y:4})}`);\nconsole.log("\\nDone!");',
  'c++': '// C++ 10.2\n#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World! ⚙️" << endl;\n\n    vector<int> nums = {1, 2, 3, 4, 5};\n    for (int n : nums) {\n        cout << "  " << n * n << endl;\n    }\n\n    cout << "\\nDone!" << endl;\n    return 0;\n}',
  java: '// Java 15\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World! ☕");\n\n        for (int i = 1; i <= 5; i++) {\n            System.out.println("  Square of " + i + " = " + (i * i));\n        }\n\n        System.out.println("\\nDone!");\n    }\n}',
  rust: '// Rust 1.68\nfn main() {\n    println!("Hello, World!");\n\n    for n in 1..6 {\n        println!("  {} squared = {}", n, n * n);\n    }\n\n    println!("\\nDone!");\n}',
  go: '// Go 1.16\npackage main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World! 🐹")\n\n    for i := 1; i <= 5; i++ {\n        fmt.Printf("  %d cubed = %d\\n", i, i*i*i)\n    }\n\n    fmt.Println("\\nDone!")\n}',
  c: '// C (GCC 10.2)\n#include <stdio.h>\n\nint main() {\n    printf("Hello, World! 🔧\\n");\n\n    for (int i = 1; i <= 5; i++) {\n        printf("  %d * %d = %d\\n", i, i, i * i);\n    }\n\n    printf("\\nDone!\\n");\n    return 0;\n}',
};

export default function CodePlayground() {
  const { theme } = useTheme();
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
  const [code, setCode] = useState(DEFAULT_CODE.python);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [execTime, setExecTime] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLanguageChange = useCallback((lang) => {
    setSelectedLang(lang);
    setCode(DEFAULT_CODE[lang.id] || '');
    setOutput('');
    setExecTime(null);
    setDropdownOpen(false);
  }, []);

  // JDoodle language mapping
  const JDOODLE_LANGS = {
    python: { language: 'python3', versionIndex: '4' },
    javascript: { language: 'nodejs', versionIndex: '4' },
    typescript: { language: 'typescript', versionIndex: '0' },
    'c++': { language: 'cpp17', versionIndex: '1' },
    java: { language: 'java', versionIndex: '4' },
    rust: { language: 'rust', versionIndex: '0' },
    go: { language: 'go', versionIndex: '4' },
    c: { language: 'c', versionIndex: '5' },
  };

  const handleRun = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    setOutput('');
    setExecTime(null);

    const startTime = performance.now();

    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: selectedLang.id,
          code,
        }),
      });

      const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);
      setExecTime(elapsed);

      const data = await response.json();

      if (data.success) {
        setOutput(data.output || '(no output)');
      } else {
        setOutput(data.output || '⚠️ Execution failed.');
      }
    } catch (err) {
      const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);
      setExecTime(elapsed);
      setOutput('⚠️ Network error: Could not reach the execution server.\n\nPlease try again in a moment.');
    } finally {
      setIsRunning(false);
    }
  }, [code, selectedLang, isRunning]);

  const handleReset = useCallback(() => {
    setCode(DEFAULT_CODE[selectedLang.id] || '');
    setOutput('');
    setExecTime(null);
  }, [selectedLang]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  }, [code]);

  return (
    <section id="playground" className="relative py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium border"
            style={{ borderColor: 'var(--border-color)', color: 'var(--accent-primary)' }}>
            <Terminal size={14} />
            Interactive
          </span>
          <h2 className="hero-title text-4xl md:text-5xl mt-4 mb-4">
            <span className="gradient-heading">Code Playground</span>
          </h2>
          <p className="text-secondary max-w-2xl mx-auto">
            Write and execute code in 5+ languages right here.
          </p>
        </motion.div>

        {/* Playground container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="relative"
          style={{
            borderRadius: 'var(--radius-xl)',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b"
            style={{ borderColor: 'var(--border-color)' }}>
            {/* Language selector */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              >
                <span>{selectedLang.icon}</span>
                <span>{selectedLang.label}</span>
                <ChevronDown size={14} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute top-full left-0 mt-2 w-52 rounded-xl overflow-hidden z-50 shadow-lg"
                    style={{
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border-color)',
                    }}
                  >
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.id}
                        onClick={() => handleLanguageChange(lang)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors"
                        style={{
                          color: selectedLang.id === lang.id ? 'var(--accent-primary)' : 'var(--text-primary)',
                          background: selectedLang.id === lang.id ? 'var(--glow-color)' : 'transparent',
                        }}
                        onMouseEnter={(e) => {
                          if (selectedLang.id !== lang.id) e.currentTarget.style.background = 'var(--bg-card-hover)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = selectedLang.id === lang.id ? 'var(--glow-color)' : 'transparent';
                        }}
                      >
                        <span>{lang.icon}</span>
                        <span>{lang.label}</span>
                        <span className="text-xs ml-auto" style={{ color: 'var(--text-tertiary)' }}>v{lang.version}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-secondary)',
                }}
                title="Copy code"
              >
                {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy'}
              </button>

              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-secondary)',
                }}
                title="Reset to default"
              >
                <RotateCcw size={14} />
                Reset
              </button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleRun}
                disabled={isRunning}
                className="btn-accent"
                style={{ padding: '0.5rem 1.25rem', fontSize: '0.8rem', opacity: isRunning ? 0.7 : 1 }}
              >
                {isRunning ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play size={14} />
                    Run Code
                  </>
                )}
              </motion.button>
            </div>
          </div>

          {/* Editor + Output Split */}
          <div className="grid md:grid-cols-2" style={{ minHeight: '400px' }}>
            {/* Monaco Editor */}
            <div className="border-r" style={{ borderColor: 'var(--border-color)' }}>
              <Editor
                height="400px"
                language={selectedLang.monacoId}
                value={code}
                onChange={(val) => setCode(val || '')}
                theme={theme === 'dark' ? 'vs-dark' : 'light'}
                options={{
                  fontSize: 14,
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                  minimap: { enabled: false },
                  padding: { top: 16, bottom: 16 },
                  scrollBeyondLastLine: false,
                  smoothScrolling: true,
                  cursorBlinking: 'smooth',
                  renderLineHighlight: 'all',
                  lineNumbersMinChars: 3,
                  overviewRulerLanes: 0,
                  hideCursorInOverviewRuler: true,
                  overviewRulerBorder: false,
                  scrollbar: {
                    vertical: 'auto',
                    horizontal: 'auto',
                    verticalScrollbarSize: 6,
                    horizontalScrollbarSize: 6,
                  },
                }}
              />
            </div>

            {/* Output Panel */}
            <div className="flex flex-col" style={{ background: theme === 'dark' ? '#0d0d0d' : '#f7f7f7' }}>
              {/* Output header */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b"
                style={{ borderColor: 'var(--border-color)' }}>
                <div className="flex items-center gap-2 text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                  <Terminal size={14} />
                  Output
                </div>
                {execTime !== null && (
                  <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    <Clock size={12} />
                    {execTime}s
                  </div>
                )}
              </div>

              {/* Output content */}
              <div className="flex-1 p-4 overflow-auto font-mono text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                {isRunning ? (
                  <div className="flex items-center gap-2" style={{ color: 'var(--accent-primary)' }}>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Executing {selectedLang.label}...</span>
                  </div>
                ) : output ? (
                  <pre className="whitespace-pre-wrap break-words m-0">{output}</pre>
                ) : (
                  <span style={{ color: 'var(--text-tertiary)' }}>
                    Click "Run Code" to see the output here...
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
