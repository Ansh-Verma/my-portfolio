<a id="readme-top"></a>

<div align="center">

# Ansh Verma - Interactive Developer Portfolio

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Threejs](https://img.shields.io/badge/threejs-black?style=for-the-badge&logo=three.js&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/framer--motion-black?style=for-the-badge&logo=framer&logoColor=white)

An immersive, high-performance portfolio website built with React, Vite, and Three.js. Showcasing premium 3D interactions, fluid animations, and a rich user experience tailored to an "Obsidian" dark theme.

[Live Demo](https://anshverma.dev) · [Report Bug](https://github.com/Ansh-Verma/my-portfolio/issues) · [Request Feature](https://github.com/Ansh-Verma/my-portfolio/issues)

</div>

---

## ✨ Features

- **Immersive 3D Elements:** Leverages Three.js and React Three Fiber to craft interactive, hardware-accelerated 3D components like dynamic tilt cards.
- **Fluid Micro-Animations:** Built with Framer Motion to deliver smooth, staggered reveals and a polished, professional 60fps experience across all devices.
- **Interactive Code Playground:** Features a fully functional, built-in code editor (powered by Monaco Editor) for real-time code execution and demonstration.
- **Obsidian Dark Mode:** A persistent, elegant dark theme that emphasizes visual hierarchy and beautiful, rich typography.
- **AI Chatbot Integration:** An integrated interactive chatbot to engage visitors and dynamically showcase skills.
- **Data Visualizations:** Beautiful data presentation using Recharts (e.g., Skills Radar).
- **Contact Form:** Integrated with EmailJS for seamless direct communication.

## 🛠️ Tech Stack

### Core
- **[React 18](https://reactjs.org/)** - UI library
- **[Vite](https://vitejs.dev/)** - Frontend tooling and bundler

### 3D & Animations
- **[Three.js](https://threejs.org/)** & **[React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)** - 3D graphics and declarative rendering
- **[Framer Motion](https://www.framer.com/motion/)** - Production-ready animation library

### Styling & UI
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Lucide React](https://lucide.dev/)** - Beautiful & consistent icons

### Features
- **[Monaco Editor](https://microsoft.github.io/monaco-editor/)** - The code editor that powers VS Code
- **[Recharts](https://recharts.org/)** - Composable charting library
- **[EmailJS](https://www.emailjs.com/)** - Client-side email sending

## 🚀 Quick Start

To get a local copy up and running, follow these simple steps:

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Ansh-Verma/my-portfolio.git
   cd my-portfolio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173` in your browser to view the app.

## 📂 Project Structure

```text
src/
├── components/          # Reusable UI components
├── App.jsx              # Main application entry point
├── Portfolio.jsx        # Core portfolio layout and sections
├── CodePlayground.jsx   # Interactive execution environment
├── Chatbot.jsx          # AI assistant integration
├── SkillsRadar.jsx      # Recharts data visualization
├── TiltCard.jsx         # 3D interactive cards
├── ThemeContext.jsx     # Global theme state management
├── index.css            # Global CSS and Tailwind directives
└── main.jsx             # React DOM rendering
```

## ⚡ Performance Optimization

This portfolio has been carefully optimized for both performance and aesthetics:
- **60FPS Target:** Animations and scroll events are tuned to utilize GPU acceleration, preventing layout thrashing and scroll lag.
- **Component Lazy Loading:** Strategic bundle splitting ensures rapid initial page loads.
- **Optimized 3D Geometries:** Three.js objects are managed effectively to prevent memory leaks and drop performance impact.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 🤝 Contact

Ansh Verma - [anshverma.dev](https://anshverma.dev)

Project Link: [https://github.com/Ansh-Verma/my-portfolio](https://github.com/Ansh-Verma/my-portfolio)

<br/>
<p align="right"><a href="#readme-top">⬆️ Back to Top</a></p>
