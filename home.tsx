import { useState } from "react";
import { StarsBackground } from "@/components/StarsBackground";
import { ChatModal } from "@/components/ChatModal";
import { Zap, Drama, BookOpen, Lightbulb, ChevronRight, Bot, User } from "lucide-react";
import { Link } from "wouter";
import avatarImg from "@assets/IMG-20250927-WA0000_1775486664734.jpg";

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-[100dvh] relative overflow-x-hidden selection:bg-primary/30">
      <StarsBackground />

      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-40 glass-panel border-b-0 border-white/5 border-t-0 border-l-0 border-r-0 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center glow-purple">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-wider glow-text text-white">
              PLUTO<span className="text-primary">AI</span>
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors hidden sm:block">
              Features
            </a>
            <button
              onClick={() => setIsChatOpen(true)}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-primary to-purple-600 text-white text-sm font-semibold hover:shadow-[0_0_20px_rgba(168,85,247,0.6)] transition-all hover:scale-105 active:scale-95"
              data-testid="button-nav-try-now"
            >
              Try Now
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 sm:pt-48 sm:pb-32 px-6 flex flex-col items-center text-center z-10 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border-primary/30 text-primary text-xs font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          System Online & Ready
        </div>
        
        <h1 className="text-5xl sm:text-7xl font-display font-black tracking-tight text-white mb-6 leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 fill-mode-both">
          Your Daily AI, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-primary glow-text">Simplified</span>
        </h1>
        
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
          Ask anything. Get fast, useful answers. A vast intelligence, right at your fingertips.
        </p>
        
        <button
          onClick={() => setIsChatOpen(true)}
          className="group relative px-8 py-4 rounded-full bg-primary text-white font-bold text-lg overflow-hidden transition-all hover:scale-105 active:scale-95 glow-purple-lg animate-in fade-in slide-in-from-bottom-10 duration-700 delay-500 fill-mode-both"
          data-testid="button-hero-try-now"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="relative flex items-center gap-2">
            Try PlutoAI Now <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </span>
        </button>
      </section>

      {/* Chat Preview Demo */}
      <section className="relative px-6 pb-32 z-10 max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-1000 delay-700 fill-mode-both">
        <div className="glass-panel rounded-3xl p-2 shadow-2xl shadow-primary/10 border-primary/20">
          <div className="bg-card rounded-2xl overflow-hidden">
            <div className="flex items-center gap-2 p-3 border-b border-white/5 bg-background/50">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
              </div>
            </div>
            <div className="p-6 sm:p-10 space-y-6">
              <div className="flex gap-4 max-w-[80%] ml-auto flex-row-reverse">
                <div className="w-10 h-10 rounded-full bg-secondary border border-white/10 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="bg-gradient-to-br from-primary/80 to-primary text-white p-4 rounded-2xl rounded-br-sm shadow-sm">
                  <p className="text-sm sm:text-base">Help me write a quick apology message to my team for missing the morning sync.</p>
                </div>
              </div>
              
              <div className="flex gap-4 max-w-[80%] mr-auto">
                <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center shrink-0 glow-purple">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div className="bg-secondary/80 border border-white/5 text-foreground p-4 rounded-2xl rounded-bl-sm shadow-sm">
                  <p className="text-sm sm:text-base text-gray-200">"Hi team, sincere apologies for missing the morning sync. I had an unexpected conflict come up. Please let me know if there's anything urgent I missed or need to catch up on today. Thanks for understanding!"</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative py-24 px-6 bg-background/50 z-10 border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-display font-bold text-white mb-4">Command Your AI</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Built for speed, styled for the future. Choose how you interact.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Fast Answers", desc: "Optimized streaming for near-instant responses.", icon: Zap },
              { title: "Personality Modes", desc: "Switch from Professional to Funny in a click.", icon: Drama },
              { title: "Student Friendly", desc: "Great for summaries, essay help, and learning.", icon: BookOpen },
              { title: "Idea Generator", desc: "Unblock your creativity instantly.", icon: Lightbulb },
            ].map((feature, i) => (
              <div 
                key={i} 
                className="group p-8 rounded-3xl bg-card border border-white/5 hover:border-primary/50 transition-all duration-300 hover:bg-secondary/40 hover:-translate-y-2 hover:shadow-[0_10px_30px_-10px_rgba(168,85,247,0.2)]"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors group-hover:glow-purple">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer / Branding */}
      <footer className="relative pt-32 pb-12 px-6 z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block relative mb-8 group">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary to-indigo-500 opacity-70 blur group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <img 
              src={avatarImg} 
              alt="Abhinav Panda" 
              className="relative w-32 h-32 rounded-full object-cover border-4 border-background"
            />
          </div>
          
          <div className="glass-panel p-8 sm:p-12 rounded-3xl border-primary/20 shadow-xl max-w-3xl mx-auto mb-16 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
            <h3 className="text-2xl font-display font-bold text-white mb-4">The Mind behind PlutoAI</h3>
            <div className="text-muted-foreground text-lg leading-relaxed sm:px-8 space-y-4">
              <p><span className="text-white font-medium">Abhinav Panda</span> is a forward-thinking creator and Founder driven by curiosity and innovation. As the mind behind PlutoAI, he is on a mission to redefine how people interact with technology—making AI smarter, simpler, and a seamless part of everyday life.</p>
              <p>A driven and curious student from Sambalpur, Abhinav is currently pursuing his academic journey with a strong interest in innovation and technology. Known for his forward-thinking mindset, he enjoys exploring new ideas, especially in the world of AI and digital creation, always looking for ways to transform concepts into something impactful and real. With a natural inclination toward creativity and problem-solving, he aims to build solutions that are both meaningful and accessible.</p>
              <p>Backed by the unwavering support of his wonderful parents, <span className="text-white/80">Prasenjit Panda</span> and <span className="text-white/80">Anita Panda</span>, Abhinav continues to grow with confidence and determination. Their encouragement plays a vital role in shaping his journey, helping him stay grounded while striving for bigger ambitions.</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/10 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-primary" />
              <span className="font-display font-bold text-white tracking-wide">PLUTO<span className="text-primary">AI</span></span>
            </div>
            <p>© {new Date().getFullYear()} Abhinav Panda. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}
