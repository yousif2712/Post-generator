import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Send, Copy, Check, RefreshCw, Layout, Quote, Terminal, Zap, ChevronRight } from 'lucide-react';
import { generateHooks, generateFullPost } from './services/geminiService';

export default function App() {
  const [topic, setTopic] = useState('');
  const [loadingHooks, setLoadingHooks] = useState(false);
  const [loadingPost, setLoadingPost] = useState(false);
  const [hooks, setHooks] = useState<string[]>([]);
  const [selectedHook, setSelectedHook] = useState<string | null>(null);
  const [fullPost, setFullPost] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  const postRef = useRef<HTMLDivElement>(null);

  const handleGenerateHooks = async () => {
    if (!topic.trim()) return;
    setLoadingHooks(true);
    setHooks([]);
    setSelectedHook(null);
    setFullPost(null);
    try {
      const result = await generateHooks(topic);
      setHooks(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingHooks(false);
    }
  };

  const handleGeneratePost = async (hook: string) => {
    setSelectedHook(hook);
    setLoadingPost(true);
    setFullPost(null);
    try {
      const result = await generateFullPost(hook);
      setFullPost(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingPost(false);
    }
  };

  // Auto-scroll to post section when post is generated or loading starts
  useEffect(() => {
    if (loadingPost || fullPost) {
      setTimeout(() => {
        postRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [loadingPost, fullPost]);

  const copyToClipboard = () => {
    if (!fullPost) return;
    navigator.clipboard.writeText(fullPost);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 py-12 px-4 sm:px-6 lg:px-8 selection:bg-white/10">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <header className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-400 text-xs font-medium mb-6"
          >
            <Zap size={14} className="text-yellow-500 fill-yellow-500" />
            <span className="tracking-widest uppercase">Yousif PostLab AI v2.0</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-bold tracking-tight text-white sm:text-6xl mb-6 font-display glow-text"
          >
            Viral LinkedIn <br />
            <span className="text-zinc-500 italic">Content Engine</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed"
          >
            The world-class strategist in your browser. Stop scrolling, start converting.
          </motion.p>
        </header>

        <main className="space-y-12">
          {/* Input Section */}
          <section className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-zinc-800 to-zinc-700 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative glass rounded-2xl p-6 sm:p-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label htmlFor="topic" className="block text-xs font-bold text-zinc-500 uppercase tracking-[0.2em]">
                    Strategy Input
                  </label>
                  <span className="text-[10px] text-zinc-600 font-mono">READY_FOR_INPUT</span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    id="topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerateHooks()}
                    placeholder="Enter your topic or insight..."
                    className="w-full bg-zinc-950/50 border border-white/5 rounded-xl py-5 pl-5 pr-14 text-white placeholder:text-zinc-600 input-focus text-lg"
                  />
                  <button
                    onClick={handleGenerateHooks}
                    disabled={loadingHooks || !topic.trim()}
                    className="absolute right-2.5 top-2.5 p-3 rounded-lg bg-white text-black hover:bg-zinc-200 disabled:opacity-50 disabled:hover:bg-white transition-all duration-200 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                    id="generate-hooks-btn"
                  >
                    {loadingHooks ? <RefreshCw size={20} className="animate-spin" /> : <ChevronRight size={20} />}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Hooks Section */}
          <AnimatePresence>
            {hooks.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 text-zinc-500">
                  <div className="h-px flex-1 bg-white/5"></div>
                  <div className="flex items-center gap-2">
                    <Quote size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Select Your Hook</span>
                  </div>
                  <div className="h-px flex-1 bg-white/5"></div>
                </div>
                <div className="grid gap-4">
                  {hooks.map((hook, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleGeneratePost(hook)}
                      disabled={loadingPost}
                      className={`text-left p-6 rounded-xl border transition-all duration-300 group relative overflow-hidden ${
                        selectedHook === hook
                          ? 'bg-white border-white text-black shadow-[0_0_30px_rgba(255,255,255,0.15)]'
                          : 'bg-zinc-900/30 border-white/5 text-zinc-300 hover:border-white/20 hover:bg-zinc-900/50'
                      }`}
                    >
                      <div className="relative z-10 flex items-start gap-4">
                        <span className={`text-xs font-mono mt-1.5 ${selectedHook === hook ? 'text-black/40' : 'text-zinc-600'}`}>
                          0{index + 1}
                        </span>
                        <p className="text-lg font-medium leading-relaxed">{hook}</p>
                      </div>
                      {selectedHook !== hook && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ChevronRight size={20} className="text-zinc-500" />
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          {/* Full Post Section */}
          <div ref={postRef}>
            <AnimatePresence>
              {(loadingPost || fullPost) && (
                <motion.section
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative"
                >
                  <div className="absolute -inset-0.5 bg-white/10 rounded-3xl blur-2xl opacity-10"></div>
                  <div className="relative glass rounded-3xl overflow-hidden border-white/10">
                    <div className="bg-white/5 px-8 py-4 flex items-center justify-between border-b border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">LinkedIn Masterpiece</span>
                      </div>
                      {fullPost && (
                        <button
                          onClick={copyToClipboard}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-zinc-300 transition-all"
                          id="copy-post-btn"
                        >
                          {copied ? (
                            <>
                              <Check size={14} className="text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy size={14} />
                              <span>Copy to Clipboard</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                    
                    <div className="p-8 sm:p-10">
                      {loadingPost ? (
                        <div className="space-y-6">
                          <div className="h-6 bg-white/5 rounded-lg w-3/4 animate-pulse"></div>
                          <div className="space-y-3">
                            <div className="h-4 bg-white/5 rounded w-full animate-pulse"></div>
                            <div className="h-4 bg-white/5 rounded w-5/6 animate-pulse"></div>
                            <div className="h-4 bg-white/5 rounded w-full animate-pulse"></div>
                          </div>
                          <div className="h-4 bg-white/5 rounded w-2/3 animate-pulse"></div>
                        </div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="space-y-8"
                        >
                          {/* Selected Hook Highlight */}
                          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 border-dashed">
                            <p className="text-xl font-bold text-white leading-relaxed italic">
                              "{selectedHook}"
                            </p>
                            <div className="mt-3 flex items-center gap-2 text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                              <Sparkles size={12} />
                              Selected Hook
                            </div>
                          </div>

                          <div className="h-px bg-white/5"></div>

                          <div className="whitespace-pre-wrap text-zinc-300 leading-relaxed text-lg font-light">
                            {fullPost}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-24 pb-12 text-center border-t border-white/5 pt-12">
          <div className="flex items-center justify-center gap-6 mb-6">
            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.4em]">LinkedIn</span>
            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.4em]">Growth</span>
            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.4em]">Viral</span>
          </div>
          <p className="text-zinc-500 text-xs font-mono">
            © 2026 YOUSIF_POSTLAB_AI // SYSTEM_STABLE
          </p>
        </footer>
      </div>
    </div>
  );
}
