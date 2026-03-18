import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageCircle, X, Send, Bot, User,
  Minimize2, Maximize2, Trash2, BookOpen, Sparkles, Zap
} from 'lucide-react'
import { useAuthStore } from '../lib/store'
import { YOUTUBE_COURSES } from '../lib/courses'
import { useEnrollmentStore } from '../lib/enrollments'

// ─────────────────────────────────────────────────────────────────────────────
// GROQ CONFIG
// Free key: https://console.groq.com → API Keys → Create
// Add to .env: VITE_GROQ_API_KEY=gsk_xxxxxxxxxxxx
// ─────────────────────────────────────────────────────────────────────────────
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || ''
const GROQ_MODEL = 'llama-3.3-70b-versatile'
const GROQ_URL     = 'https://api.groq.com/openai/v1/chat/completions'

// ─────────────────────────────────────────────────────────────────────────────
// System prompt
// ─────────────────────────────────────────────────────────────────────────────
function buildSystemPrompt(user, enrolledCourses) {
  const courseList = YOUTUBE_COURSES.map(c =>
    `• "${c.title}" [${c.category} · ${c.level}] by ${c.instructor}`
  ).join('\n')

  const enrolledList = enrolledCourses.length
    ? enrolledCourses.map(c => `• ${c.title} — ${c.enrollment?.progress || 0}% complete`).join('\n')
    : 'None yet'

  return `You are LearnBot, a helpful AI learning assistant for LearnFlow LMS.

PERSONALITY: Friendly, encouraging, concise. Use markdown formatting. Max 3-4 paragraphs. 1-2 emojis max.

AVAILABLE COURSES ON LEARNFLOW:
${courseList}

CURRENT USER:
- Name: ${user?.name || 'Guest'}
- Role: ${user?.role || 'visitor'}
- Enrolled: ${enrolledList}

HELP WITH: course recommendations, programming concepts, learning roadmaps, code explanations, tech Q&A.
RULES: Only reference exact course titles listed above. Be concise and actionable.`
}

// ─────────────────────────────────────────────────────────────────────────────
// Simple markdown renderer
// ─────────────────────────────────────────────────────────────────────────────
function inlineFormat(text) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**'))
      return <strong key={idx} className="font-semibold text-white">{part.slice(2, -2)}</strong>
    if (part.startsWith('`') && part.endsWith('`'))
      return <code key={idx} className="bg-slate-700 text-amber-300 px-1.5 py-0.5 rounded text-[11px] font-mono">{part.slice(1, -1)}</code>
    return part
  })
}

function renderMarkdown(text) {
  const lines  = text.split('\n')
  const output = []
  let key = 0, i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (!line.trim()) { output.push(<div key={key++} className="h-1" />); i++; continue }

    // Fenced code block
    if (line.trimStart().startsWith('```')) {
      const lang  = line.replace(/```/, '').trim()
      const block = []
      i++
      while (i < lines.length && !lines[i].trimStart().startsWith('```')) { block.push(lines[i]); i++ }
      i++
      output.push(
        <div key={key++} className="my-2 rounded-xl overflow-hidden border border-slate-700">
          {lang && <div className="px-3 py-1 bg-slate-700 text-slate-300 text-[10px] font-mono uppercase tracking-wider">{lang}</div>}
          <pre className="bg-slate-900 text-emerald-400 px-4 py-3 text-xs font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed">{block.join('\n')}</pre>
        </div>
      )
      continue
    }

    // Heading
    if (line.startsWith('## ') || line.startsWith('### ')) {
      const level = line.startsWith('### ') ? 4 : 3
      const content = line.replace(/^#{2,3}\s/, '')
      output.push(<p key={key++} className="font-bold text-sm mt-3 mb-1 text-white">{inlineFormat(content)}</p>)
      i++; continue
    }

    // Bullet list
    if (/^(\s*[-*•]|\s*\d+\.)\s/.test(line)) {
      const items = []
      while (i < lines.length && /^(\s*[-*•]|\s*\d+\.)\s/.test(lines[i])) {
        const content = lines[i].replace(/^(\s*[-*•]|\s*\d+\.)\s/, '')
        items.push(
          <li key={items.length} className="flex items-start gap-2">
            <span className="text-brand-400 mt-0.5 flex-shrink-0 text-xs">▸</span>
            <span className="text-sm leading-snug">{inlineFormat(content)}</span>
          </li>
        )
        i++
      }
      output.push(<ul key={key++} className="space-y-1.5 my-1">{items}</ul>)
      continue
    }

    output.push(<p key={key++} className="text-sm leading-relaxed">{inlineFormat(line)}</p>)
    i++
  }
  return output
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 px-1 py-1">
      {[0, 1, 2].map(i => (
        <motion.div key={i} className="w-2 h-2 rounded-full bg-brand-400"
          animate={{ y: [0, -6, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }} />
      ))}
    </div>
  )
}

function MessageBubble({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex items-end gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      <div className={`w-7 h-7 rounded-xl flex-shrink-0 flex items-center justify-center ${
        isUser ? 'bg-gradient-to-br from-brand-500 to-brand-700' : 'bg-gradient-to-br from-violet-500 to-brand-600'
      }`}>
        {isUser ? <User size={13} className="text-white" /> : <Bot size={13} className="text-white" />}
      </div>
      <div className={`max-w-[82%] rounded-2xl px-4 py-3 ${
        isUser
          ? 'bg-gradient-to-br from-brand-500 to-brand-700 text-white rounded-br-sm'
          : 'bg-[#1e1e32] text-slate-100 rounded-bl-sm border border-slate-700/60 shadow-sm'
      }`}>
        {msg.content === '__typing__'
          ? <TypingDots />
          : <div className="space-y-1">{renderMarkdown(msg.content)}</div>
        }
      </div>
    </motion.div>
  )
}

function NoKeyBanner() {
  return (
    <div className="mx-4 mt-3 mb-1 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
      <p className="font-bold text-amber-400 text-sm flex items-center gap-1.5 mb-2">
        <Zap size={13} /> Groq API key missing
      </p>
      <ol className="text-amber-200/80 space-y-1 text-xs leading-relaxed list-decimal list-inside">
        <li>Go to <a href="https://console.groq.com" target="_blank" rel="noreferrer" className="underline text-amber-300 font-medium">console.groq.com</a> — sign up free</li>
        <li>Click <strong className="text-amber-300">API Keys → Create API Key</strong></li>
        <li>Create <code className="bg-slate-800 px-1 py-0.5 rounded">.env</code> in project root</li>
        <li>Add: <code className="bg-slate-800 px-1 py-0.5 rounded text-emerald-400">VITE_GROQ_API_KEY=gsk_...</code></li>
        <li>Restart: <code className="bg-slate-800 px-1 py-0.5 rounded">npm run dev</code></li>
      </ol>
    </div>
  )
}

const QUICK_PROMPTS = [
  { emoji: '🗺', label: 'Learning roadmap',   text: 'Give me a roadmap to become a full-stack developer.' },
  { emoji: '📚', label: 'Best starter course', text: 'What course should I start with as a complete beginner?' },
  { emoji: '⚛️', label: 'Explain React hooks', text: 'Explain React useState and useEffect with simple examples.' },
  { emoji: '🐍', label: 'Python vs JS',         text: 'Should I learn Python or JavaScript first and why?' },
]

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────
export default function Chatbot() {
  const { user } = useAuthStore()
  const { getUserEnrollments, getEnrollment } = useEnrollmentStore()

  const [open,      setOpen]      = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [unread,    setUnread]    = useState(0)
  const [input,     setInput]     = useState('')

  const GREETING = `Hi${user?.name ? ` ${user.name.split(' ')[0]}` : ''}! 👋 I'm **LearnBot**, your AI learning assistant.\n\nI can help you:\n• Find the perfect course for your goals\n• Explain any programming concept\n• Build a personalised learning roadmap\n• Answer any tech question instantly\n\nWhat would you like to learn today?`

  const [messages, setMessages] = useState([{ role: 'assistant', content: GREETING }])

  const bottomRef   = useRef(null)
  const inputRef    = useRef(null)
  const textareaRef = useRef(null)

  const enrolledCourses = (() => {
    if (!user?.id) return []
    return getUserEnrollments(user.id)
      .map(id => {
        const course = YOUTUBE_COURSES.find(c => c.id === id)
        return course ? { ...course, enrollment: getEnrollment(user.id, id) } : null
      }).filter(Boolean)
  })()

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])
  useEffect(() => { if (open && !minimized) setTimeout(() => inputRef.current?.focus(), 120) }, [open, minimized])
  useEffect(() => {
    if (!open && messages.length > 1) {
      const last = messages[messages.length - 1]
      if (last?.role === 'assistant') setUnread(u => u + 1)
    }
  }, [messages])

  const autoResize = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 110) + 'px'
  }

  const clearChat = () => setMessages([{ role: 'assistant', content: GREETING }])
  const handleOpen = () => { setOpen(true); setUnread(0); setMinimized(false) }

  const sendMessage = useCallback(async (override) => {
    const text = (override || input).trim()
    if (!text || loading) return

    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = '42px'

    const history = [...messages, { role: 'user', content: text }]
    setMessages([...history, { role: 'assistant', content: '__typing__' }])
    setLoading(true)

    // No key — show setup instructions
    if (!GROQ_API_KEY) {
      await new Promise(r => setTimeout(r, 500))
      setMessages([
        ...history,
        { role: 'assistant', content: '⚠️ **No Groq API key found.**\n\nPlease follow the setup steps shown above to add your free key, then restart the dev server.' },
      ])
      setLoading(false)
      return
    }

    try {
      const res = await fetch(GROQ_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          temperature: 0.7,
          max_tokens: 1024,
          messages: [
            { role: 'system', content: buildSystemPrompt(user, enrolledCourses) },
            ...history
              .filter(m => m.content !== '__typing__')
              .map(m => ({ role: m.role, content: m.content })),
          ],
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error?.message || `HTTP ${res.status}`)

      const reply = data.choices?.[0]?.message?.content?.trim()
        || "Sorry, I couldn't generate a response. Please try again."

      setMessages([...history, { role: 'assistant', content: reply }])
    } catch (err) {
      console.error('Groq error:', err)
      setMessages([
        ...history,
        { role: 'assistant', content: `❌ **Error:** ${err.message}\n\nCheck that your \`VITE_GROQ_API_KEY\` in \`.env\` is correct and the dev server was restarted.` },
      ])
    } finally {
      setLoading(false)
    }
  }, [input, messages, loading, user, enrolledCourses])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  const hasKey = !!GROQ_API_KEY

  return (
    <>
      {/* FAB */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            onClick={handleOpen}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-violet-600 text-white shadow-glow-lg flex items-center justify-center"
          >
            <MessageCircle size={24} />
            <AnimatePresence>
              {unread > 0 && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {unread > 9 ? '9+' : unread}
                </motion.span>
              )}
            </AnimatePresence>
            <span className="absolute inset-0 rounded-2xl animate-ping bg-brand-400 opacity-20 pointer-events-none" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 24 }}
            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
            className={`fixed bottom-6 right-6 z-50 flex flex-col bg-[#0d0d1a] rounded-3xl shadow-2xl border border-slate-700/60 overflow-hidden transition-[height] duration-300 ${
              minimized ? 'w-80 h-16' : 'w-[390px] h-[620px]'
            }`}
            style={{ maxHeight: 'calc(100dvh - 80px)', maxWidth: 'calc(100vw - 24px)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-brand-700 via-brand-600 to-violet-700 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center border border-white/20">
                    <Bot size={17} className="text-white" />
                  </div>
                  <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-brand-600 ${hasKey ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="font-bold text-white text-sm">LearnBot</p>
                    <Sparkles size={11} className="text-brand-200" />
                  </div>
                  <p className="text-brand-200 text-[10px]">
                    {loading ? '✦ Thinking...' : hasKey ? 'Groq · llama3-8b · Free' : '⚠ Key missing'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                <button onClick={clearChat} title="Clear" className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"><Trash2 size={14} /></button>
                <button onClick={() => setMinimized(m => !m)} className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors">
                  {minimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
                </button>
                <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"><X size={14} /></button>
              </div>
            </div>

            {!minimized && (
              <>
                {!hasKey && <NoKeyBanner />}

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-hide">
                  {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
                  <div ref={bottomRef} />
                </div>

                {/* Quick prompts */}
                {messages.length <= 1 && (
                  <div className="px-4 pb-2 flex-shrink-0">
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-2">Quick start</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {QUICK_PROMPTS.map(qp => (
                        <button key={qp.text} onClick={() => sendMessage(qp.text)}
                          className="text-left px-3 py-2.5 rounded-xl text-xs font-medium bg-slate-800/80 border border-slate-700 text-slate-300 hover:border-brand-500/60 hover:text-brand-300 transition-all leading-snug">
                          <span className="block text-base mb-0.5">{qp.emoji}</span>
                          {qp.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Enrolled pill */}
                {enrolledCourses.length > 0 && messages.length <= 1 && (
                  <div className="px-4 pb-2 flex-shrink-0">
                    <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-900/60">
                      <BookOpen size={10} />
                      <span className="font-medium">I know your {enrolledCourses.length} enrolled course{enrolledCourses.length > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                )}

                {/* Input */}
                <div className="flex-shrink-0 px-4 py-3 border-t border-slate-700/60 bg-[#0d0d1a]">
                  <div className="flex items-end gap-2">
                    <textarea
                      ref={el => { inputRef.current = el; textareaRef.current = el }}
                      value={input}
                      onChange={e => { setInput(e.target.value); autoResize() }}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask me anything..."
                      rows={1}
                      disabled={loading}
                      className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-700 bg-slate-800/70 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500/60 text-sm resize-none overflow-hidden transition-all disabled:opacity-50 leading-relaxed"
                      style={{ minHeight: '42px', maxHeight: '110px' }}
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.92 }}
                      onClick={() => sendMessage()}
                      disabled={!input.trim() || loading}
                      className="flex-shrink-0 w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-500 to-violet-600 text-white flex items-center justify-center disabled:opacity-35 disabled:cursor-not-allowed shadow-glow transition-all"
                    >
                      {loading
                        ? <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                        : <Send size={15} />
                      }
                    </motion.button>
                  </div>
                  <p className="text-[10px] text-slate-600 text-center mt-2 select-none">
                    Groq · llama3-8b-8192 · Free · Enter to send
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
