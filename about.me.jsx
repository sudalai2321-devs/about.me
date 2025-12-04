import React, { useState, useEffect, useRef } from 'react';
import { 
  Github, 
  Linkedin, 
  Mail, 
  Phone, 
  Code, 
  Cpu, 
  Globe, 
  Send, 
  MessageCircle, 
  X, 
  ChevronDown,
  User,
  GraduationCap,
  Award,
  ExternalLink,
  Menu,
  Terminal,
  Sparkles,
  Zap,
  Briefcase,
  Layers,
  Bot,
  Sun,
  Moon,
  Calendar
} from 'lucide-react';

// --- Interactive Background Component (NEW: Fluid Aurora) ---
const InteractiveBackground = ({ theme }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let blobs = [];
    
    // Configuration
    const blobCount = 6;
    const isDark = theme === 'dark';
    
    // Color Palettes
    const darkColors = [
      'rgba(139, 92, 246, 0.4)', // Violet
      'rgba(236, 72, 153, 0.4)', // Pink
      'rgba(6, 182, 212, 0.4)',  // Cyan
      'rgba(59, 130, 246, 0.4)'  // Blue
    ];
    
    const lightColors = [
      'rgba(167, 139, 250, 0.5)', // Soft Purple
      'rgba(244, 114, 182, 0.5)', // Soft Pink
      'rgba(34, 211, 238, 0.5)',  // Soft Cyan
      'rgba(96, 165, 250, 0.5)'   // Soft Blue
    ];

    const colors = isDark ? darkColors : lightColors;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initBlobs();
    };

    class Blob {
      constructor() {
        this.radius = Math.random() * 150 + 100; // Large radius
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.8; // Slow movement
        this.vy = (Math.random() - 0.5) * 0.8;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.angle = Math.random() * Math.PI * 2;
        this.angleSpeed = (Math.random() - 0.5) * 0.02;
      }

      update() {
        // Move steadily
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off walls
        if (this.x < -this.radius || this.x > canvas.width + this.radius) this.vx *= -1;
        if (this.y < -this.radius || this.y > canvas.height + this.radius) this.vy *= -1;

        // Gentle pulsation
        this.angle += this.angleSpeed;
      }

      draw() {
        ctx.beginPath();
        // Create a radial gradient for a soft "glow" effect from center
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, 'rgba(0,0,0,0)'); // Fade out to transparent

        ctx.fillStyle = gradient;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const initBlobs = () => {
      blobs = [];
      for (let i = 0; i < blobCount; i++) {
        blobs.push(new Blob());
      }
    };

    const animate = () => {
      // Clear with a slight trail effect (optional, or just clearRect)
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Use a composite operation to make colors blend beautifully
      ctx.globalCompositeOperation = isDark ? 'screen' : 'multiply'; 
      // 'screen' makes lights additive in dark mode, 'multiply' blends watercolors in light mode

      blobs.forEach((blob) => {
        blob.update();
        blob.draw();
      });
      
      ctx.globalCompositeOperation = 'source-over'; // Reset
      animationFrameId = requestAnimationFrame(animate);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 filter blur-[60px] opacity-70"
    />
  );
};

// --- Main Component ---
const SudalaiPortfolio = () => {
  // --- State Management ---
  // Default to 'light' theme as requested
  const [theme, setTheme] = useState('light');
  const [activeSection, setActiveSection] = useState('home');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [typedText, setTypedText] = useState('');
  
  const isDark = theme === 'dark';

  // Helper function to toggle theme
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Chatbot State
  const [messages, setMessages] = useState([
    { 
      text: "Hi! I'm Sudalai's AI. I can help you with details about Sudalai, or we can just chat about code, events, or anything else! How can I help?", 
      sender: 'bot' 
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Personal Data for the AI Context
  const personalData = {
    name: "Sudalai S",
    role: "Full Stack Developer & IT Dept Secretary",
    email: "sudalai2321@gmail.com",
    phone: "9791557351",
    education: "B.Tech in Information Technology at Dhanalakshmi Srinivasan University (Semester 3, Admission 2024-2025)",
    skills: "React, Python, Web Development, Leadership, Event Management",
    location: "Thoothukudi, Tamil Nadu, India",
    about: "I am a passionate developer, Event Organizer, and the Secretary of the IT Department. I love building interactive web applications and organizing tech events."
  };

  // --- Effects ---

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Typing Effect for Hero
  const heroTitles = "Full Stack Developer | IT Dept Secretary | Event Organizer";
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      setTypedText((prev) => prev + heroTitles.charAt(index));
      index++;
      if (index === heroTitles.length) clearInterval(timer);
    }, 50);
    return () => clearInterval(timer);
  }, []);

  // --- AI Logic (Gemini API) ---
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMsg = inputMessage;
    setMessages(prev => [...prev, { text: userMsg, sender: 'user' }]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const apiKey = ""; // API Key provided by runtime environment
      
      const systemPrompt = `You are 'Talk with Sudalai', a highly intelligent and witty AI assistant on Sudalai S's personal portfolio website.

      YOUR CORE INSTRUCTIONS:
      1. **Be General & Helpful:** You are NOT limited to just talking about Sudalai. You can answer general questions, write code, tell jokes, solve math problems, or discuss philosophy just like a powerful AI (Gemini/ChatGPT).
      2. **Be the Expert on Sudalai:** If the user specifically asks about "Sudalai", "the developer", "contact info", or "projects", use the context below to give impressive, accurate answers.
      3. **Tone:** Professional, enthusiastic, modern, and slightly playful.
      
      CONTEXT ABOUT SUDALAI:
      - Name: ${personalData.name}
      - Role: ${personalData.role}
      - Education: ${personalData.education}
      - Contact: ${personalData.email}, ${personalData.phone}
      - Skills: ${personalData.skills}
      - Location: ${personalData.location}
      - About: ${personalData.about}
      
      If the user says "Hello" or "Hi", greet them warmly and mention you are Sudalai's digital assistant.
      If the user asks a coding question (e.g., "How do I center a div?"), answer it technically and correctly.
      `;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: userMsg }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] }
          })
        }
      );

      const data = await response.json();
      
      if (data.candidates && data.candidates[0].content) {
        const aiResponse = data.candidates[0].content.parts[0].text;
        setMessages(prev => [...prev, { text: aiResponse, sender: 'bot' }]);
      } else {
        throw new Error("No response from AI");
      }

    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { text: "My brain is currently upgrading! Please try again in a moment.", sender: 'bot' }]);
    } finally {
      setIsTyping(false);
    }
  };

  // --- UI Helpers ---
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'About', id: 'about' },
    { name: 'Skills', id: 'skills' },
    { name: 'Projects', id: 'projects' },
    { name: 'Contact', id: 'contact' },
  ];

  // Dynamic Classes based on Theme
  const bgMain = isDark ? 'bg-[#020205]' : 'bg-slate-50';
  const bgSecondary = isDark ? 'bg-[#050510]' : 'bg-white';
  const textPrimary = isDark ? 'text-white' : 'text-slate-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-slate-600';
  const borderClass = isDark ? 'border-white/10' : 'border-slate-200';
  const cardBg = isDark ? 'bg-white/5 backdrop-blur-sm' : 'bg-white shadow-xl shadow-slate-200/50';
  const navBg = isDark ? 'bg-[#020205]/60' : 'bg-white/70';

  return (
    <div className={`min-h-screen ${bgMain} ${textPrimary} font-sans overflow-x-hidden selection:bg-fuchsia-500 selection:text-white transition-colors duration-500 relative`}>
      
      {/* Interactive Background Canvas (Updated to Fluid Aurora) */}
      <InteractiveBackground theme={theme} />

      {/* --- Navbar --- */}
      <nav className={`fixed top-0 w-full z-50 ${navBg} backdrop-blur-2xl border-b ${borderClass} supports-[backdrop-filter]:${navBg} transition-all duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div 
              className="flex items-center space-x-3 cursor-pointer group" 
              onClick={() => scrollToSection('home')}
            >
              <div className="relative w-10 h-10 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500 rounded-lg animate-pulse-slow blur-sm"></div>
                <div className={`relative w-full h-full rounded-lg flex items-center justify-center border ${borderClass} ${isDark ? 'bg-black' : 'bg-white'}`}>
                  <span className="font-black text-2xl bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-fuchsia-400">S</span>
                </div>
              </div>
              <span className={`font-bold text-xl tracking-wide bg-clip-text text-transparent bg-gradient-to-r ${isDark ? 'from-white to-gray-400' : 'from-slate-900 to-slate-600'} group-hover:to-fuchsia-400 transition-all`}>SUDALAI</span>
            </div>
            
            {/* Desktop Menu & Theme Toggle */}
            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-baseline space-x-8">
                {navLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => scrollToSection(link.id)}
                    className={`text-sm font-medium transition-all duration-300 relative group py-2 ${
                      activeSection === link.id ? (isDark ? 'text-white' : 'text-slate-900') : (isDark ? 'text-gray-400 hover:text-white' : 'text-slate-500 hover:text-slate-900')
                    }`}
                  >
                    {link.name}
                    <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500 transform origin-left transition-transform duration-300 ${activeSection === link.id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                  </button>
                ))}
              </div>

              {/* Theme Toggle Button */}
              <button 
                onClick={toggleTheme}
                className={`p-2 rounded-full transition-all duration-300 ${isDark ? 'bg-white/10 hover:bg-white/20 text-yellow-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
                aria-label="Toggle Theme"
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>

            {/* Mobile Menu Button & Theme Toggle */}
            <div className="md:hidden flex items-center gap-4">
              <button 
                onClick={toggleTheme}
                className={`p-2 rounded-full ${isDark ? 'bg-white/10 text-yellow-300' : 'bg-slate-100 text-slate-700'}`}
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 ${isDark ? 'text-gray-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
              >
                {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className={`md:hidden border-b ${borderClass} animate-fade-in ${isDark ? 'bg-[#050510]' : 'bg-white'}`}>
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.id)}
                  className={`block w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                    isDark ? 'text-gray-300 hover:bg-white/5' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* --- Hero Section --- */}
      <section id="home" className="min-h-screen flex items-center justify-center relative pt-20 overflow-hidden">
        {/* Colorful Animated Backgrounds (Adjusted for Theme) */}
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[128px] animate-pulse-slow mix-blend-screen ${isDark ? 'bg-violet-600/30' : 'bg-violet-400/20'}`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-[128px] animate-pulse-slow delay-1000 mix-blend-screen ${isDark ? 'bg-fuchsia-600/30' : 'bg-pink-400/20'}`}></div>
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] ${isDark ? 'opacity-20 brightness-100 contrast-150' : 'opacity-40 brightness-100 contrast-100'}`}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className={`inline-flex items-center gap-2 px-6 py-2 rounded-full border backdrop-blur-md mb-8 animate-fade-in-up transition-colors cursor-default ${isDark ? 'bg-white/5 border-white/10 hover:border-cyan-500/50' : 'bg-white/60 border-slate-200 hover:border-cyan-500/50'}`}>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
            <span className="text-cyan-500 font-semibold text-sm tracking-wide uppercase">Open to Work</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 animate-fade-in-up delay-100 leading-tight">
            I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 filter drop-shadow-sm">Sudalai</span>
          </h1>
          
          <div className="h-8 md:h-12 mb-8 animate-fade-in-up delay-200">
            <p className={`text-xl md:text-3xl font-mono ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
              <span className="text-fuchsia-500">&gt;</span> {typedText}<span className="animate-blink text-cyan-500">|</span>
            </p>
          </div>

          <p className={`max-w-2xl mx-auto text-lg md:text-xl mb-10 leading-relaxed animate-fade-in-up delay-300 ${textSecondary}`}>
            Passionate about building beautiful interfaces and robust systems. Currently serving as <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Secretary of IT Department</span> and crafting the future of web technology.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-up delay-400">
            <button 
              onClick={() => setIsChatOpen(true)}
              className="group relative px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl font-bold text-white shadow-lg shadow-violet-500/25 hover:shadow-fuchsia-500/40 hover:scale-105 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="flex items-center gap-2">
                <Sparkles size={20} className="animate-pulse" />
                Chat with AI Assistant
              </span>
            </button>
            <button 
              onClick={() => scrollToSection('projects')}
              className={`px-8 py-4 rounded-2xl border font-bold text-lg transition-all duration-300 flex items-center gap-2 backdrop-blur-sm ${isDark ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-white/60 border-slate-200 text-slate-800 hover:bg-white'}`}
            >
              <Layers size={20} />
              View My Work
            </button>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer opacity-50 hover:opacity-100 transition-opacity" onClick={() => scrollToSection('about')}>
          <ChevronDown className={`w-8 h-8 ${isDark ? 'text-white' : 'text-slate-900'}`} />
        </div>
      </section>

      {/* --- About Section --- */}
      <section id="about" className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left: Text Content */}
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl md:text-6xl font-black mb-6">About <span className="text-cyan-500">Me</span></h2>
                <div className="w-32 h-2 bg-gradient-to-r from-cyan-500 to-transparent rounded-full"></div>
              </div>
              
              <p className={`text-lg leading-relaxed border-l-4 pl-6 ${isDark ? 'text-gray-400 border-white/10' : 'text-slate-600 border-cyan-500/20'}`}>
                Hello! I'm <strong className={isDark ? 'text-white' : 'text-slate-900'}>Sudalai S</strong>. I live at the intersection of leadership and code. 
                Currently pursuing my B.Tech in IT at Dhanalakshmi Srinivasan University, I lead communities as the Secretary of the IT Department and an active Event Organizer.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className={`p-6 rounded-3xl border transition-all group ${cardBg} ${borderClass}`}>
                  <div className="w-12 h-12 bg-violet-500/10 rounded-2xl flex items-center justify-center text-violet-500 mb-4 group-hover:scale-110 transition-transform">
                    <GraduationCap size={24} />
                  </div>
                  <h3 className="font-bold text-xl mb-1">Education</h3>
                  <p className="text-sm text-gray-500">B.Tech IT (3rd Sem)</p>
                  <p className="text-xs text-gray-500 mt-1">Dhanalakshmi Srinivasan Univ.</p>
                </div>
                <div className={`p-6 rounded-3xl border transition-all group ${cardBg} ${borderClass}`}>
                  <div className="w-12 h-12 bg-fuchsia-500/10 rounded-2xl flex items-center justify-center text-fuchsia-500 mb-4 group-hover:scale-110 transition-transform">
                    <Award size={24} />
                  </div>
                  <h3 className="font-bold text-xl mb-1">Leadership</h3>
                  <p className="text-sm text-gray-500">IT Dept Secretary</p>
                  <p className="text-xs text-gray-500 mt-1">Event Organizer</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <a href="mailto:sudalai2321@gmail.com" className={`flex items-center gap-2 px-5 py-3 rounded-xl border transition-all text-sm font-medium ${isDark ? 'bg-white/5 hover:bg-white/10 border-white/10' : 'bg-white hover:bg-slate-50 border-slate-200'}`}>
                  <Mail size={16} className="text-cyan-500" />
                  sudalai2321@gmail.com
                </a>
                <a href="tel:+919791557351" className={`flex items-center gap-2 px-5 py-3 rounded-xl border transition-all text-sm font-medium ${isDark ? 'bg-white/5 hover:bg-white/10 border-white/10' : 'bg-white hover:bg-slate-50 border-slate-200'}`}>
                  <Phone size={16} className="text-green-500" />
                  +91 9791557351
                </a>
              </div>
            </div>

            {/* Right: Visual/Card */}
            <div className="relative group perspective-1000">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500 rounded-[2.5rem] rotate-6 opacity-30 blur-2xl group-hover:opacity-50 transition-opacity duration-500"></div>
              <div className={`relative p-8 rounded-[2.5rem] border shadow-2xl transform transition-transform duration-500 group-hover:rotate-1 ${isDark ? 'bg-[#050510]/90 backdrop-blur-xl border-white/10' : 'bg-white/90 backdrop-blur-xl border-white/50'}`}>
                <div className={`flex items-center gap-5 mb-8 border-b pb-6 ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
                  <div className="w-20 h-20 rounded-full p-[2px] bg-gradient-to-tr from-cyan-400 to-fuchsia-500">
                    <div className={`w-full h-full rounded-full flex items-center justify-center overflow-hidden ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
                       <User size={40} className="text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className={`text-2xl font-bold ${textPrimary}`}>Sudalai S</h3>
                    <p className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-violet-500 font-medium">@sudalai_dev</p>
                    <div className="flex items-center gap-2 mt-2">
                       <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/10 text-green-500 border border-green-500/20">ONLINE</span>
                       <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-fuchsia-500/10 text-fuchsia-500 border border-fuchsia-500/20">SECRETARY</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  {[
                    { label: "Role", value: "Full Stack Dev" },
                    { label: "Location", value: "Tamil Nadu, IN" },
                    { label: "Experience", value: "Freshman" },
                    { label: "Age", value: "19 Years" },
                  ].map((item, i) => (
                    <div key={i} className={`flex justify-between items-center p-4 rounded-xl transition-colors ${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>
                      <span className="text-gray-500 font-medium">{item.label}</span>
                      <span className={`font-semibold ${isDark ? 'text-gray-200' : 'text-slate-800'}`}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Skills Section --- */}
      <section id="skills" className={`py-32 relative overflow-hidden z-10 ${bgSecondary}`}>
        <div className={`absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent`}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black mb-6">Tech <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-pink-500">Stack</span></h2>
            <p className={`${textSecondary} max-w-2xl mx-auto text-lg`}>My weapon of choice for conquering digital challenges.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'React', icon: <Code />, color: 'text-cyan-500', gradient: isDark ? 'from-cyan-500/20 to-cyan-500/5' : 'from-cyan-50 to-white' },
              { name: 'JavaScript', icon: <Terminal />, color: 'text-yellow-500', gradient: isDark ? 'from-yellow-500/20 to-yellow-500/5' : 'from-yellow-50 to-white' },
              { name: 'Python', icon: <Cpu />, color: 'text-blue-500', gradient: isDark ? 'from-blue-500/20 to-blue-500/5' : 'from-blue-50 to-white' },
              { name: 'Tailwind', icon: <Globe />, color: 'text-teal-500', gradient: isDark ? 'from-teal-500/20 to-teal-500/5' : 'from-teal-50 to-white' },
              { name: 'Node.js', icon: <Zap />, color: 'text-green-500', gradient: isDark ? 'from-green-500/20 to-green-500/5' : 'from-green-50 to-white' },
              { name: 'Git', icon: <Github />, color: 'text-orange-500', gradient: isDark ? 'from-orange-500/20 to-orange-500/5' : 'from-orange-50 to-white' },
              { name: 'Event Org.', icon: <Calendar />, color: 'text-fuchsia-500', gradient: isDark ? 'from-fuchsia-500/20 to-fuchsia-500/5' : 'from-fuchsia-50 to-white' },
              { name: 'Leadership', icon: <Award />, color: 'text-red-500', gradient: isDark ? 'from-red-500/20 to-red-500/5' : 'from-red-50 to-white' },
            ].map((skill, index) => (
              <div 
                key={index} 
                className={`relative p-6 rounded-3xl bg-gradient-to-br ${skill.gradient} border ${borderClass} backdrop-blur-sm hover:-translate-y-2 transition-transform duration-300 group shadow-sm`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${skill.color} shadow-lg group-hover:scale-110 transition-transform ${isDark ? 'bg-[#020205]' : 'bg-white'}`}>
                  {React.cloneElement(skill.icon, { size: 28 })}
                </div>
                <h3 className={`text-xl font-bold mb-2 ${textPrimary}`}>{skill.name}</h3>
                <div className={`w-full h-1 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}>
                  <div className={`h-full ${skill.color.replace('text', 'bg')} w-[85%] rounded-full animate-pulse-slow`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Projects Section --- */}
      <section id="projects" className="py-32 relative overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className={`flex flex-col md:flex-row justify-between items-end mb-16 gap-4 border-b pb-8 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
            <div>
              <h2 className="text-4xl md:text-6xl font-black mb-4">Featured <span className="text-violet-500">Work</span></h2>
              <p className={`${textSecondary} text-lg`}>Innovating one project at a time.</p>
            </div>
            <button className={`group flex items-center gap-2 px-6 py-3 rounded-full border transition-all font-medium ${isDark ? 'border-white/20 hover:bg-white/10' : 'border-slate-300 hover:bg-slate-100 text-slate-700'}`}>
              View All Projects
              <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "University Portal",
                desc: "Centralized academic dashboard for grades & attendance tracking.",
                tags: ["React", "Firebase", "Tailwind"],
                gradient: "from-cyan-600 to-blue-600"
              },
              {
                title: "Talk with Sudalai",
                desc: "The intelligent AI portfolio assistant you are using right now!",
                tags: ["Gemini AI", "React", "Animation"],
                gradient: "from-fuchsia-600 to-pink-600"
              },
              {
                title: "Event Horizon",
                desc: "Digital management system for college cultural and tech events.",
                tags: ["Python", "Django", "SQL"],
                gradient: "from-violet-600 to-indigo-600"
              }
            ].map((project, index) => (
              <div key={index} className={`group relative rounded-3xl overflow-hidden border transition-all duration-500 hover:shadow-2xl hover:shadow-violet-500/20 ${isDark ? 'bg-[#0a0a1f] border-white/10 hover:border-white/20' : 'bg-white border-slate-200 hover:border-slate-300 shadow-xl'}`}>
                <div className={`h-56 bg-gradient-to-br ${project.gradient} p-8 flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay"></div>
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500"></div>
                  <Bot className="text-white w-20 h-20 opacity-90 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500 drop-shadow-2xl" />
                </div>
                
                <div className="p-8">
                  <h3 className={`text-2xl font-bold mb-3 transition-colors ${isDark ? 'text-white group-hover:text-cyan-400' : 'text-slate-900 group-hover:text-cyan-600'}`}>{project.title}</h3>
                  <p className={`mb-6 leading-relaxed ${textSecondary}`}>{project.desc}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map((tag, i) => (
                      <span key={i} className={`px-3 py-1 text-xs font-medium rounded-full border ${isDark ? 'bg-white/5 text-gray-300 border-white/10' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <a href="#" className={`inline-flex items-center text-sm font-bold uppercase tracking-wider transition-colors ${isDark ? 'text-white hover:text-cyan-400' : 'text-slate-900 hover:text-cyan-600'}`}>
                    Details <ExternalLink size={14} className="ml-2" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Contact Section --- */}
      <section id="contact" className={`py-32 relative z-10 ${bgMain}`}>
        <div className="absolute inset-0 bg-gradient-to-t from-violet-900/5 to-transparent"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="relative p-[1px] rounded-[2.5rem] bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500 shadow-xl">
            <div className={`rounded-[2.5rem] p-10 md:p-16 text-center ${isDark ? 'bg-[#050510]' : 'bg-white'}`}>
              <h2 className="text-4xl md:text-5xl font-black mb-6">Ready to Collaborate?</h2>
              <p className={`${textSecondary} text-lg mb-12 max-w-lg mx-auto`}>
                Whether you have a question, a project idea, or just want to say hi, my inbox is always open.
              </p>

              <div className="flex flex-col md:flex-row justify-center gap-6 mb-12">
                <a href="mailto:sudalai2321@gmail.com" className={`flex items-center justify-center gap-3 px-8 py-4 rounded-2xl border transition-all group ${isDark ? 'bg-white/5 hover:bg-white/10 border-white/10' : 'bg-slate-50 hover:bg-slate-100 border-slate-200'}`}>
                  <div className="p-2 bg-pink-500/20 rounded-lg text-pink-500 group-hover:scale-110 transition-transform">
                     <Mail size={20} />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Email</p>
                    <p className={`font-semibold ${textPrimary}`}>sudalai2321@gmail.com</p>
                  </div>
                </a>
                <a href="tel:+919791557351" className={`flex items-center justify-center gap-3 px-8 py-4 rounded-2xl border transition-all group ${isDark ? 'bg-white/5 hover:bg-white/10 border-white/10' : 'bg-slate-50 hover:bg-slate-100 border-slate-200'}`}>
                  <div className="p-2 bg-cyan-500/20 rounded-lg text-cyan-500 group-hover:scale-110 transition-transform">
                     <Phone size={20} />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Phone</p>
                    <p className={`font-semibold ${textPrimary}`}>+91 9791557351</p>
                  </div>
                </a>
              </div>

              <div className="flex justify-center space-x-6">
                <a href="#" className={`p-4 rounded-full transition-all hover:scale-110 ${isDark ? 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10' : 'bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200'}`}><Github size={24} /></a>
                <a href="#" className={`p-4 rounded-full transition-all hover:scale-110 ${isDark ? 'bg-white/5 text-gray-400 hover:text-blue-400 hover:bg-white/10' : 'bg-slate-100 text-slate-500 hover:text-blue-600 hover:bg-slate-200'}`}><Linkedin size={24} /></a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className={`py-8 border-t text-center relative z-10 ${isDark ? 'bg-black border-white/10' : 'bg-white border-slate-200'}`}>
        <p className="text-gray-500 text-sm font-medium">
          Designed & Deployed by <span className={isDark ? 'text-white' : 'text-slate-900'}>Sudalai S</span> © 2025.
        </p>
      </footer>

      {/* --- Enhanced AI Chatbot Widget --- */}
      <div className="fixed bottom-6 right-6 z-[100]">
        {!isChatOpen && (
          <button 
            onClick={() => setIsChatOpen(true)}
            className="group relative w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-500 via-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/40 hover:scale-110 transition-transform duration-300"
          >
            <div className="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-20"></div>
            <MessageCircle className="text-white w-8 h-8 fill-current" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-black"></span>
            </span>
          </button>
        )}

        {isChatOpen && (
          <div className={`backdrop-blur-xl border w-[360px] md:w-[420px] rounded-3xl shadow-2xl flex flex-col h-[600px] overflow-hidden animate-slide-up origin-bottom-right ring-1 ring-white/10 ${isDark ? 'bg-[#050510]/95 border-white/10' : 'bg-white/95 border-slate-200'}`}>
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 p-5 flex items-center justify-between shadow-lg relative z-10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-inner">
                  <Bot className="text-white w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-base tracking-wide">Talk with Sudalai</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]"></span> 
                    <span className="text-xs text-white/90 font-medium">AI Online</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsChatOpen(false)} 
                className="p-2 hover:bg-white/20 rounded-full transition-colors text-white/80 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Chat Messages */}
            <div className={`flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar ${isDark ? 'bg-[#050510]' : 'bg-slate-50'}`}>
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
                  {msg.sender === 'bot' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center mr-3 flex-shrink-0 shadow-lg">
                      <Bot size={14} className="text-white" />
                    </div>
                  )}
                  <div 
                    className={`max-w-[80%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed shadow-md ${
                      msg.sender === 'user' 
                        ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-br-none' 
                        : (isDark ? 'bg-white/10 text-gray-100 border border-white/5' : 'bg-white text-slate-700 border border-slate-200')
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start animate-fade-in">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center mr-3 flex-shrink-0">
                     <Bot size={14} className="text-white" />
                  </div>
                  <div className={`rounded-2xl rounded-bl-none px-4 py-4 flex space-x-1.5 items-center border ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-slate-200'}`}>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className={`p-4 border-t relative z-10 ${isDark ? 'bg-[#020205] border-white/10' : 'bg-white border-slate-200'}`}>
              <div className="relative flex items-center">
                <input 
                  type="text" 
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask me about code, life, or Sudalai..."
                  className={`w-full border rounded-2xl pl-5 pr-14 py-4 text-sm focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-all shadow-inner ${isDark ? 'bg-[#0a0a1f] border-white/10 text-white placeholder:text-gray-600' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'}`}
                />
                <button 
                  type="submit"
                  disabled={!inputMessage.trim() || isTyping}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl text-white hover:shadow-lg hover:shadow-fuchsia-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
                >
                  <Send size={18} className={isTyping ? "opacity-0" : "opacity-100"} />
                  {isTyping && <div className="absolute inset-0 flex items-center justify-center"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div></div>}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* --- Global Styles --- */}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 1s step-end infinite;
        }
        .animate-pulse-slow {
          animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }
      `}</style>
    </div>
  );
};

export default SudalaiPortfolio;