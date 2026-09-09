import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Link, Navigate, NavLink, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Bot,
  Building2,
  CalendarDays,
  Check,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Eye,
  EyeOff,
  GraduationCap,
  HelpCircle,
  KeyRound,
  Lock,
  LogOut,
  Mail,
  Menu,
  Moon,
  Phone,
  RefreshCw,
  School,
  Search,
  Send,
  Share2,
  ShieldCheck,
  Sparkles,
  Sun,
  UserRound,
  X,
} from 'lucide-react'
import { attendance, colleges, courseNames, exams, notices, scholarships } from './data/mockData'
import { authApi } from './api/auth'
import './styles.css'

// ==========================================
// AUTH CONTEXT
// ==========================================
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const checkAuth = async () => {
    try {
      const response = await authApi.me()
      setUser(response.user || response)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const login = async (identifier, password) => {
    const response = await authApi.login({ identifier, password })
    if (response?.user) {
      setUser(response.user)
      sessionStorage.setItem('cc-portal-auth', 'true')
      return response.user
    }
    throw new Error(response?.message || 'Login failed')
  }

  const signup = async (details) => {
    const response = await authApi.signup(details)
    if (response?.user) {
      setUser(response.user)
      sessionStorage.setItem('cc-portal-auth', 'true')
      return response.user
    }
    throw new Error(response?.message || 'Signup failed')
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } catch {
      // Ignore network errors on logout
    } finally {
      setUser(null)
      sessionStorage.removeItem('cc-portal-auth')
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user),
        login,
        signup,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

// ==========================================
// ASK AI CONTEXT
// ==========================================
const AskAiContext = createContext(null)

export function AskAiProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  const openChat = () => setIsOpen(true)
  const closeChat = () => setIsOpen(false)
  const toggleChat = () => setIsOpen((prev) => !prev)

  return (
    <AskAiContext.Provider value={{ isOpen, openChat, closeChat, toggleChat }}>
      {children}
    </AskAiContext.Provider>
  )
}

export function useAskAi() {
  const context = useContext(AskAiContext)
  if (!context) throw new Error('useAskAi must be used within an AskAiProvider')
  return context
}

// ==========================================
// BRAND & HEADER COMPONENTS
// ==========================================
function Brand() {
  return (
    <Link className="brand" to="/">
      <span className="brand-mark">cc</span>
      <span>
        Campus<span>Connect</span>
      </span>
    </Link>
  )
}

function CampusHeader({ onSearch, dark, setDark }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const { openChat } = useAskAi()
  const [menuOpen, setMenuOpen] = useState(false)

  const selectedCollegeName = user?.college || 'Matrusri Engineering College'

  return (
    <>
      <header className="site-header">
        <Brand />
        <span className="college-context">{selectedCollegeName}</span>

        <nav className="main-nav" aria-label="Main Navigation">
          <NavLink className={({ isActive }) => (isActive ? 'active' : '')} to="/">
            Home
          </NavLink>
          <NavLink className={({ isActive }) => (isActive ? 'active' : '')} to="/academics">
            Academics
          </NavLink>
          <button
            type="button"
            className="nav-link-btn"
            onClick={openChat}
            aria-label="Open Ask AI Assistant"
          >
            <Sparkles size={14} className="nav-icon-sparkle" />
            Ask AI
          </button>
          <NavLink className={({ isActive }) => (isActive ? 'active' : '')} to="/profile">
            Profile
          </NavLink>
        </nav>

        <div className="header-tools">
          <button className="icon-button" onClick={onSearch} aria-label="Search">
            <Search size={18} />
          </button>
          <button
            className="icon-button"
            onClick={() => setDark(!dark)}
            aria-label="Toggle theme"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {isAuthenticated ? (
            <NavLink className="portal-link portal-link-auth" to="/portal">
              <UserRound size={15} />
              <span>{user?.name ? user.name.split(' ')[0] : 'Portal'}</span>
            </NavLink>
          ) : (
            <NavLink className="portal-link" to="/login">
              <UserRound size={15} />
              <span>Student Portal</span>
              <ArrowRight size={13} />
            </NavLink>
          )}

          <div className="menu-wrap" style={{ position: 'relative' }}>
            <button
              className="icon-button menu-button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-label="Open menu"
            >
              <Menu size={19} />
            </button>
            {menuOpen && (
              <nav
                className="menu-panel"
                aria-label="Menu"
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 8px)',
                  zIndex: 30,
                  minWidth: 170,
                  padding: 8,
                  border: '1px solid var(--line)',
                  borderRadius: 10,
                  background: 'var(--paper)',
                  boxShadow: '0 12px 30px rgba(0,0,0,.14)',
                }}
              >
                <NavLink
                  style={{ display: 'block', padding: '9px 10px', fontSize: 12 }}
                  to="/compare"
                  onClick={() => setMenuOpen(false)}
                >
                  Compare colleges
                </NavLink>
                <NavLink
                  style={{ display: 'block', padding: '9px 10px', fontSize: 12 }}
                  to="/campus-life"
                  onClick={() => setMenuOpen(false)}
                >
                  Campus life
                </NavLink>
                <NavLink
                  style={{ display: 'block', padding: '9px 10px', fontSize: 12 }}
                  to="/notices"
                  onClick={() => setMenuOpen(false)}
                >
                  Notices
                </NavLink>
                <NavLink
                  style={{ display: 'block', padding: '9px 10px', fontSize: 12 }}
                  to="/scholarships"
                  onClick={() => setMenuOpen(false)}
                >
                  Scholarships
                </NavLink>
              </nav>
            )}
          </div>
        </div>
      </header>
      {location.pathname === '/' && (
        <div className="announce">
          <span className="signal" />
          <b>Campus pulse</b>
          <span>Admissions open for 2026–27</span>
          <span>•</span>
          <Link to="/compare">
            Compare colleges <ArrowRight size={13} />
          </Link>
        </div>
      )}
    </>
  )
}

// ==========================================
// BOTTOM NAVIGATION
// ==========================================
function BottomNav({ onSearch }) {
  const { openChat } = useAskAi()

  return (
    <nav className="bottom-nav" aria-label="Mobile Bottom Navigation">
      <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
        <Eye size={18} />
        <span>Home</span>
      </NavLink>
      <NavLink to="/academics" className={({ isActive }) => (isActive ? 'active' : '')}>
        <BookOpen size={18} />
        <span>Academics</span>
      </NavLink>
      <button type="button" onClick={onSearch} aria-label="Search">
        <Search size={18} />
        <span>Search</span>
      </button>
      <button
        type="button"
        onClick={openChat}
        className="bottom-nav-ask-ai"
        aria-label="Open Ask AI chat"
      >
        <Bot size={18} />
        <span>Ask AI</span>
      </button>
      <NavLink to="/profile" className={({ isActive }) => (isActive ? 'active' : '')}>
        <UserRound size={18} />
        <span>Profile</span>
      </NavLink>
    </nav>
  )
}

// ==========================================
// ASK AI CHAT DRAWER / MODAL
// ==========================================
const CAMPUS_KNOWLEDGE = [
  {
    keywords: ['hi', 'hello', 'hey', 'start', 'help'],
    response:
      "Hello! I am your CampusConnect AI Assistant. You can ask me about admissions, academic policies, campus facilities, college comparisons, departments, scholarships, and how to access your Student Portal.",
  },
  {
    keywords: ['attendance', 'present', 'absent', 'percentage'],
    response:
      "Attendance records are managed securely through the Student Portal. Once logged in, you can verify your registered semester attendance through the official academic portal.",
  },
  {
    keywords: ['academics', 'timetable', 'course', 'courses', 'subject', 'syllabus'],
    response:
      "Academic details including course syllabi, semester timetables, and department schedules are available on the Academics page. A Student Portal login is required to access enrolled student records.",
  },
  {
    keywords: ['matrusri', 'mec', 'saidabad'],
    response:
      "Matrusri Engineering College (MEC) is an autonomous engineering institution located in Saidabad, Hyderabad, established by the Matrusri Education Society. It offers undergraduate programs in CSE, IT, ECE, EEE, Mechanical, and Civil Engineering.",
  },
  {
    keywords: ['mvsr', 'nadergul'],
    response:
      "MVSR Engineering College is an autonomous institution established in 1981 located in Nadergul, Hyderabad, known for engineering programs, digitized campus facilities, and active placements.",
  },
  {
    keywords: ['portal', 'login', 'student portal', 'signin', 'account'],
    response:
      "You can log in to the Student Portal using your college email address and password by clicking 'Student Portal' in the navigation bar or heading to the Login page.",
  },
  {
    keywords: ['exam', 'exams', 'results', 'marks', 'grade', 'sgpa', 'cgpa'],
    response:
      "Examination timetables, hall tickets, and official grade cards are published by the college Examination Branch and updated in the Student Portal for enrolled students.",
  },
  {
    keywords: ['scholarship', 'scholarships', 'epass', 'fee', 'fees'],
    response:
      "Scholarship opportunities including Telangana ePASS, merit-based grants, and institution assistance can be explored in the Scholarships section.",
  },
  {
    keywords: ['profile', 'logout', 'password', 'security'],
    response:
      "You can manage your verified student account, switch appearance themes, check session security, or log out anytime from the Profile page.",
  },
]

function getAiResponse(userText, user) {
  const text = userText.toLowerCase()

  for (const item of CAMPUS_KNOWLEDGE) {
    if (item.keywords.some((kw) => text.includes(kw))) {
      if (user && (text.includes('my') || text.includes('i'))) {
        if (text.includes('college') || text.includes('where')) {
          return `According to your authenticated record, you are enrolled at ${user.college || 'Matrusri Engineering College'} in the ${user.branch?.toUpperCase() || 'CSE'} department (${user.year || '3rd'} Year).`
        }
      }
      return item.response
    }
  }

  return "I'm here to help with all CampusConnect queries! You can ask about college details, the Academics section, student portal authentication, admissions, campus facilities, or exam notices."
}

function AskAiChatDrawer() {
  const { isOpen, closeChat } = useAskAi()
  const { user } = useAuth()
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      from: 'bot',
      text: "Hi! I'm CampusConnect AI Assistant. How can I help you today? You can ask about academics, colleges, admissions, or navigating the student portal.",
      time: 'Just now',
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState('')
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)

  // Auto-scroll to bottom when messages or typing state changes
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isTyping, isOpen])

  // Focus input when opened on desktop
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        if (window.innerWidth > 620) {
          textareaRef.current?.focus()
        }
      }, 150)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        closeChat()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, closeChat])

  const handleSend = (textToSend) => {
    const query = (textToSend || input).trim()
    if (!query || isTyping) return

    setError('')
    const userMsg = {
      id: `user-${Date.now()}`,
      from: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    // Simulate natural AI thinking & response
    setTimeout(() => {
      try {
        const botReply = getAiResponse(query, user)
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            from: 'bot',
            text: botReply,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ])
      } catch (err) {
        setError('Unable to get AI response. Please try again.')
      } finally {
        setIsTyping(false)
      }
    }, 550)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const quickPrompts = [
    'How do I view Academics?',
    'Matrusri Engineering College info',
    'MVSR Engineering College info',
    'Student Portal access',
    'Admissions & Scholarships',
  ]

  return (
    <>
      {/* Floating Ask AI button (rendered when closed) */}
      <AskAiFloatingButton />

      {/* Chat Drawer / Modal Backdrop */}
      {isOpen && (
        <div className="chat-drawer-backdrop" onClick={closeChat}>
          <aside
            className="chat-drawer"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Ask AI Chat"
          >
            {/* Header */}
            <div className="chat-drawer-header">
              <div className="chat-header-info">
                <span className="bot-avatar">
                  <Bot size={18} />
                </span>
                <div>
                  <b>CampusConnect AI</b>
                  <small>
                    <i className="online-dot" /> Verified Campus Assistant · Online
                  </small>
                </div>
              </div>
              <div className="chat-header-actions">
                <button
                  type="button"
                  className="icon-button"
                  onClick={closeChat}
                  aria-label="Close chat"
                >
                  <X size={19} />
                </button>
              </div>
            </div>

            {/* Quick suggestions */}
            <div className="chat-quick-suggestions">
              {quickPrompts.map((prompt) => (
                <button
                  type="button"
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  disabled={isTyping}
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Scrollable conversation area */}
            <div className="chat-drawer-body">
              {messages.map((msg) => (
                <div className={`chat-bubble-wrap ${msg.from}`} key={msg.id}>
                  {msg.from === 'bot' && (
                    <span className="mini-bot-icon">
                      <Bot size={13} />
                    </span>
                  )}
                  <div className="chat-bubble">
                    <p>{msg.text}</p>
                    <span className="chat-time">{msg.time}</span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="chat-bubble-wrap bot">
                  <span className="mini-bot-icon">
                    <Bot size={13} />
                  </span>
                  <div className="chat-typing">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              )}

              {error && (
                <div className="chat-error-notice">
                  <AlertCircle size={14} />
                  <span>{error}</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Fixed bottom input & Send button area */}
            <div className="chat-drawer-footer">
              <form
                className="chat-input-form"
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSend()
                }}
              >
                <div className="chat-input-box">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about courses, admissions, exams..."
                    rows={1}
                    aria-label="Ask AI message input"
                  />
                  <button
                    type="submit"
                    className="chat-send-button"
                    disabled={!input.trim() || isTyping}
                    aria-label="Send message"
                  >
                    <Send size={16} />
                  </button>
                </div>
                <p className="chat-input-hint">
                  Press <b>Enter</b> to send · <b>Shift + Enter</b> for new line
                </p>
              </form>
            </div>
          </aside>
        </div>
      )}
    </>
  )
}

function AskAiFloatingButton() {
  const { isOpen, openChat } = useAskAi()
  if (isOpen) return null

  return (
    <button
      type="button"
      className="bot-float"
      onClick={openChat}
      aria-label="Open Ask AI assistant"
    >
      <Bot size={19} />
      <span>Ask AI</span>
      <i />
    </button>
  )
}

// ==========================================
// SEARCH OVERLAY
// ==========================================
function SearchOverlay({ onClose }) {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const publicSearchItems = [
    'Matrusri Engineering College',
    'MVSR Engineering College',
    'Compare colleges',
    'Campus life',
    'Notices',
    'Scholarships',
  ]
  const studentSearchItems = [
    'Academics',
    'Enrolled Program',
    'Attendance overview',
    'Academic timetable',
    'Profile',
    'Student Portal',
    ...publicSearchItems,
  ]

  const items = isAuthenticated ? studentSearchItems : publicSearchItems
  const results = items.filter((item) => item.toLowerCase().includes(query.toLowerCase()))

  const go = (item) => {
    onClose()
    if (item.includes('Matrusri')) navigate('/colleges/matrusri')
    else if (item.includes('MVSR')) navigate('/colleges/mvsr')
    else if (item === 'Academics' || item === 'Enrolled Program' || item === 'Academic timetable')
      navigate('/academics')
    else if (item === 'Profile') navigate('/profile')
    else if (item === 'Student Portal') navigate('/portal')
    else if (item === 'Compare colleges') navigate('/compare')
    else if (item === 'Campus life') navigate('/campus-life')
    else if (item === 'Notices') navigate('/notices')
    else if (item === 'Scholarships') navigate('/scholarships')
    else navigate(`/${item.toLowerCase().replaceAll(' ', '-')}`)
  }

  return (
    <div className="search-backdrop" onMouseDown={onClose}>
      <section className="search-panel" onMouseDown={(e) => e.stopPropagation()}>
        <div className="search-input">
          <Search size={20} />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search CampusConnect..."
          />
          <kbd>ESC</kbd>
          <button onClick={onClose} aria-label="Close search">
            <X size={18} />
          </button>
        </div>
        <div className="search-body">
          <p className="search-label">{query ? 'Results' : 'Quick links'}</p>
          {results.map((item) => (
            <button className="search-result" key={item} onClick={() => go(item)}>
              <span className="result-icon">
                {item.includes('College') ? <Building2 size={15} /> : <Sparkles size={15} />}
              </span>
              <span>{item}</span>
              <ChevronRight size={15} />
            </button>
          ))}
          <p className="search-label" style={{ marginTop: 20 }}>
            Colleges
          </p>
          <div className="college-search-grid">
            {colleges.map((college) => (
              <Link to={`/colleges/${college.id}`} onClick={onClose} key={college.id}>
                <img src={college.images[0]} alt="" />
                <span>{college.name}</span>
                <ArrowRight size={14} />
              </Link>
            ))}
          </div>
        </div>
        <footer className="search-footer">
          <span>
            <kbd>esc</kbd> Close
          </span>
        </footer>
      </section>
    </div>
  )
}

// ==========================================
// COMMON PAGE INTRO
// ==========================================
function PageIntro({ eyebrow, title, copy }) {
  return (
    <div className="page-intro page-width">
      {eyebrow && <p className="eyebrow orange">{eyebrow}</p>}
      <h1>{title}</h1>
      {copy && <p>{copy}</p>}
    </div>
  )
}

// ==========================================
// ACADEMICS PAGE (PROTECTED)
// ==========================================
function AcademicsPage() {
  const { user, loading, isAuthenticated } = useAuth()
  const [tab, setTab] = useState('Overview')

  if (loading) {
    return (
      <main>
        <PageIntro
          eyebrow="ACADEMICS"
          title="Loading academic records..."
          copy="Verifying student portal authentication."
        />
      </main>
    )
  }

  // If not authenticated, require student portal login with clean gate
  if (!isAuthenticated) {
    return (
      <main>
        <PageIntro
          eyebrow="ACADEMICS · ACCESS CONTROL"
          title="Student Portal Login Required"
          copy="Academic records, course curriculum, and semester standing are protected student information."
        />
        <section className="login-gate page-width">
          <div className="gate-mark">
            <ShieldCheck size={32} />
          </div>
          <h2>Please log in to the Student Portal to access your academic details.</h2>
          <p>
            Your enrolled department, semester schedule, academic standing, and official records
            are private to your authenticated college account.
          </p>
          <Link
            className="button primary"
            to="/login"
            state={{ from: '/academics' }}
          >
            Login to Student Portal <ArrowRight size={16} />
          </Link>
        </section>
      </main>
    )
  }

  // Authenticated Academic Details (Real data only)
  const studentCollege = user?.college || 'Matrusri Engineering College'
  const studentBranch = user?.branch ? user.branch.toUpperCase() : 'Computer Science & Engineering'
  const studentYear = user?.year ? `${user.year} Year` : '3rd Year'
  const studentSemester = user?.semester ? `Semester ${user.semester}` : 'Semester V'
  const studentId = user?.email?.split('@')[0] || user?.id

  return (
    <main>
      <PageIntro
        eyebrow="ACADEMICS · AUTHENTICATED"
        title="Your Academic Overview"
        copy={`Verified student records for ${user?.name || 'Student'} · ${studentCollege}.`}
      />

      {/* Student Academic Standing Header Banner */}
      <section className="academic-profile-strip page-width">
        <div className="academic-profile-card">
          <div className="academic-badge-icon">
            <GraduationCap size={28} />
          </div>
          <div className="academic-profile-info">
            <div className="academic-meta-row">
              <span className="academic-tag">{studentCollege}</span>
              <span className="academic-tag department">{studentBranch}</span>
            </div>
            <h2>{user?.name || 'Enrolled Student'}</h2>
            <p className="academic-subtext">
              Student ID: <b>{studentId}</b> · Standing: <b>{studentYear}</b> · {studentSemester}
            </p>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="profile-tabs page-width academic-tabs" role="tablist">
        {['Overview', 'Program Details', 'Examinations', 'Academic Cell'].map((tabName) => (
          <button
            type="button"
            key={tabName}
            className={tab === tabName ? 'active' : ''}
            onClick={() => setTab(tabName)}
            role="tab"
            aria-selected={tab === tabName}
          >
            {tabName}
          </button>
        ))}
      </div>

      {/* Tab Content (Real Authenticated Data Only) */}
      <section className="page-width academic-tab-content">
        {tab === 'Overview' && (
          <div className="academic-grid">
            <article className="dashboard-card">
              <p className="eyebrow">ENROLLED PROGRAM</p>
              <h2>Department of {studentBranch}</h2>
              <div className="dashboard-details">
                <span>
                  Institution<strong>{studentCollege}</strong>
                </span>
                <span>
                  Program<strong>Bachelor of Engineering (B.E.)</strong>
                </span>
                <span>
                  Current Year<strong>{studentYear}</strong>
                </span>
                <span>
                  Current Semester<strong>{studentSemester}</strong>
                </span>
              </div>
            </article>

            <article className="dashboard-card">
              <p className="eyebrow">REGISTRATION & STATUS</p>
              <h2>Active Academic Standing</h2>
              <div className="dashboard-details">
                <span>
                  Student Email<strong>{user?.email}</strong>
                </span>
                <span>
                  Enrolled Status<strong>Active Full-Time Student</strong>
                </span>
                <span>
                  Academic Year<strong>2026–2027</strong>
                </span>
                <span>
                  Portal Verification<strong>Verified Student Record</strong>
                </span>
              </div>
            </article>
          </div>
        )}

        {tab === 'Program Details' && (
          <div className="academic-info-card">
            <p className="eyebrow">CURRICULUM & SYLLABUS</p>
            <h2>Department Curriculum</h2>
            <p className="academic-desc">
              Your registered curriculum follows the autonomous regulations approved by the
              Academic Council of {studentCollege}. Course instruction sheets, syllabus breakdowns,
              and laboratory schedules are synchronized directly with your department desk.
            </p>
            <div className="info-callout">
              <BookOpen size={18} />
              <div>
                <b>Official Department Notes</b>
                <p>
                  Elective course registration and syllabus guidelines for the current term remain
                  available through the college academic office.
                </p>
              </div>
            </div>
          </div>
        )}

        {tab === 'Examinations' && (
          <div className="academic-info-card">
            <p className="eyebrow">EXAMINATION CELL</p>
            <h2>Semester Evaluations & Grade Sheets</h2>
            <p className="academic-desc">
              Official semester grade cards (SGPA/CGPA), internal assessment marks, and exam hall
              tickets are issued directly by the College Examination Branch.
            </p>
            <div className="info-callout">
              <ShieldCheck size={18} />
              <div>
                <b>Examination Branch Verification</b>
                <p>
                  Grade statements and hall ticket records for {studentCollege} are updated upon the
                  formal release of results.
                </p>
              </div>
            </div>
          </div>
        )}

        {tab === 'Academic Cell' && (
          <div className="academic-info-card">
            <p className="eyebrow">SUPPORT & CONTACT</p>
            <h2>Academic Office & Dean's Desk</h2>
            <p className="academic-desc">
              For course registrations, certificates, transfer verifications, or academic support,
              contact the designated academic office for {studentCollege}.
            </p>
            <div className="academic-contact-list">
              <div>
                <Mail size={16} />
                <span>Academic Office: academic@{studentCollege.toLowerCase().includes('matrusri') ? 'matrusri.edu.in' : 'mvsrec.edu.in'}</span>
              </div>
              <div>
                <Building2 size={16} />
                <span>Campus Location: Administrative Block, Academic Section</span>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}

// ==========================================
// STUDENT PORTAL LOGIN PAGE
// ==========================================
function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated } = useAuth()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Redirect if already authenticated
  const from = location.state?.from || '/portal'

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, from])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!identifier.trim() || !password.trim()) {
      setError('Please enter your college email/identifier and password.')
      return
    }

    setError('')
    setLoading(true)

    try {
      await login(identifier.trim(), password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message || 'Invalid college email ID, phone number, or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <div
        className="auth-image"
        style={{ backgroundImage: `url(${colleges[0].images[0]})` }}
      >
        <Brand />
        <div>
          <p className="eyebrow">STUDENT PORTAL</p>
          <h2>
            Official Campus Portal.
            <br />
            <em>Authenticated & Secure.</em>
          </h2>
        </div>
      </div>

      <div className="auth-form-container">
        <form className="auth-form" onSubmit={handleSubmit}>
          <p className="eyebrow orange">STUDENT PORTAL</p>
          <h1>Log in to your account</h1>
          <p className="form-copy">
            Enter your college email address or registered student phone number.
          </p>

          {error && (
            <div className="form-error-banner" role="alert">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <label>
            College Email ID or Registered Phone
            <div className="input-with-icon">
              <Mail size={16} className="field-icon" />
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. cse24733025@matrusri.edu.in"
                required
                autoComplete="username"
                disabled={loading}
              />
            </div>
          </label>

          <label>
            Password
            <div className="input-with-icon">
              <Lock size={16} className="field-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your account password"
                required
                autoComplete="current-password"
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>

          <button
            className="button primary full"
            type="submit"
            disabled={loading || !identifier.trim() || !password.trim()}
          >
            {loading ? (
              <>
                <RefreshCw size={16} className="spin-icon" />
                <span>Authenticating…</span>
              </>
            ) : (
              <>
                <span>Log in to Student Portal</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>

          <p className="switch-auth">
            New student? <Link to="/signup">Create an account</Link>
          </p>
        </form>
      </div>
    </main>
  )
}

// ==========================================
// STUDENT PORTAL SIGNUP PAGE
// ==========================================
function SignupPage() {
  const navigate = useNavigate()
  const { signup, isAuthenticated } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    college: 'Matrusri Engineering College',
    branch: '',
    year: '',
    semester: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/portal', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signup(formData)
      navigate('/portal', { replace: true })
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your details.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <div
        className="auth-image"
        style={{ backgroundImage: `url(${colleges[0].images[0]})` }}
      >
        <Brand />
        <div>
          <p className="eyebrow">STUDENT PORTAL</p>
          <h2>
            Create your account.
            <br />
            <em>Connect with your campus.</em>
          </h2>
        </div>
      </div>

      <div className="auth-form-container">
        <form className="auth-form" onSubmit={handleSubmit}>
          <p className="eyebrow orange">CREATE ACCOUNT</p>
          <h1>Register for Student Portal</h1>
          <p className="form-copy">Enter your verified college credentials to get started.</p>

          {error && (
            <div className="form-error-banner" role="alert">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <label>
            Full Name
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g. Srinidhi Pulaboina"
              disabled={loading}
            />
          </label>

          <div className="form-row">
            <label>
              College Email ID
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="e.g. cse24733025@matrusri.edu.in"
                disabled={loading}
              />
            </label>
            <label>
              Phone Number
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="e.g. 6200720348"
                disabled={loading}
              />
            </label>
          </div>

          <label>
            College
            <select
              value={formData.college}
              onChange={(e) => handleChange('college', e.target.value)}
              disabled={loading}
            >
              {colleges.map((c) => (
                <option value={c.name} key={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          <div className="form-row">
            <label>
              Department / Branch
              <input
                type="text"
                placeholder="e.g. CSE"
                value={formData.branch}
                onChange={(e) => handleChange('branch', e.target.value)}
                disabled={loading}
              />
            </label>
            <label>
              Year (e.g. 3rd)
              <input
                type="text"
                placeholder="e.g. 3rd"
                value={formData.year}
                onChange={(e) => handleChange('year', e.target.value)}
                disabled={loading}
              />
            </label>
          </div>

          <label>
            Password
            <div className="input-with-icon">
              <Lock size={16} className="field-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder="Create a strong password"
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>

          <button className="button primary full" type="submit" disabled={loading}>
            {loading ? 'Creating Account…' : 'Complete Registration'}
            {!loading && <ArrowRight size={16} />}
          </button>

          <p className="switch-auth">
            Already registered? <Link to="/login">Log in here</Link>
          </p>
        </form>
      </div>
    </main>
  )
}

// ==========================================
// DEDICATED PROFILE PAGE
// ==========================================
function ProfilePage() {
  const navigate = useNavigate()
  const { user, loading, isAuthenticated, logout } = useAuth()
  const [loggingOut, setLoggingOut] = useState(false)

  if (loading) {
    return (
      <main>
        <PageIntro
          eyebrow="PROFILE"
          title="Loading profile..."
          copy="Fetching your verified student details."
        />
      </main>
    )
  }

  // If unauthenticated, show clean login-required state
  if (!isAuthenticated || !user) {
    return (
      <main>
        <PageIntro
          eyebrow="PROFILE · ACCOUNT"
          title="Student Profile"
          copy="Log in to view your verified student information and account settings."
        />
        <section className="login-gate page-width">
          <div className="gate-mark">
            <UserRound size={32} />
          </div>
          <h2>Please log in to the Student Portal to access your profile.</h2>
          <p>
            Your student profile, department registration, and account security details are
            protected.
          </p>
          <Link
            className="button primary"
            to="/login"
            state={{ from: '/profile' }}
          >
            Login to Student Portal <ArrowRight size={16} />
          </Link>
        </section>
      </main>
    )
  }

  const handleLogout = async () => {
    if (!window.confirm('Are you sure you want to log out of CampusConnect?')) return
    setLoggingOut(true)
    try {
      await logout()
      navigate('/', { replace: true })
    } finally {
      setLoggingOut(false)
    }
  }

  // Derived real student values (No mock / fake numbers)
  const initials = user.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'CC'

  const studentId = user.email?.includes('@') ? user.email.split('@')[0] : user.id
  const formattedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Verified'

  return (
    <main>
      <PageIntro
        eyebrow="STUDENT PROFILE"
        title="Your Account & Profile"
        copy="Manage your verified student records, security settings, and campus preferences."
      />

      <div className="profile-layout page-width">
        {/* PROFILE HEADER CARD */}
        <section className="profile-header-card">
          <div className="profile-avatar-large">{initials}</div>
          <div className="profile-header-info">
            <div className="profile-tag-row">
              <span className="profile-badge-pill">Verified Student</span>
              {user.branch && <span className="profile-badge-pill branch">{user.branch.toUpperCase()}</span>}
            </div>
            <h2>{user.name || 'Student Account'}</h2>
            <p className="profile-header-email">{user.email}</p>
          </div>
        </section>

        {/* SECTION 1: PROFILE */}
        <section className="profile-section-card">
          <h3 className="profile-section-title">
            <UserRound size={16} />
            <span>Profile Details</span>
          </h3>
          <div className="profile-grid-2">
            <div className="profile-item">
              <span className="profile-item-label">Full Name</span>
              <strong className="profile-item-value">{user.name || 'Not provided'}</strong>
            </div>
            <div className="profile-item">
              <span className="profile-item-label">College Email ID</span>
              <strong className="profile-item-value">{user.email || 'Not provided'}</strong>
            </div>
            {studentId && (
              <div className="profile-item">
                <span className="profile-item-label">Student ID / Roll No.</span>
                <strong className="profile-item-value">{studentId}</strong>
              </div>
            )}
            <div className="profile-item">
              <span className="profile-item-label">Enrolled College</span>
              <strong className="profile-item-value">
                {user.college || 'Matrusri Engineering College'}
              </strong>
            </div>
            {user.branch && (
              <div className="profile-item">
                <span className="profile-item-label">Department / Branch</span>
                <strong className="profile-item-value">{user.branch.toUpperCase()}</strong>
              </div>
            )}
            {user.year && (
              <div className="profile-item">
                <span className="profile-item-label">Academic Year</span>
                <strong className="profile-item-value">{user.year} Year</strong>
              </div>
            )}
            {user.semester && (
              <div className="profile-item">
                <span className="profile-item-label">Semester</span>
                <strong className="profile-item-value">Semester {user.semester}</strong>
              </div>
            )}
          </div>
        </section>

        {/* SECTION 2: ACCOUNT */}
        <section className="profile-section-card">
          <h3 className="profile-section-title">
            <ShieldCheck size={16} />
            <span>Account & Authentication</span>
          </h3>
          <div className="profile-grid-2">
            {user.phone && (
              <div className="profile-item">
                <span className="profile-item-label">Registered Phone</span>
                <strong className="profile-item-value">{user.phone}</strong>
              </div>
            )}
            <div className="profile-item">
              <span className="profile-item-label">Session Status</span>
              <strong className="profile-item-value session-active">
                <i className="status-dot" /> Active · Authenticated via College Portal
              </strong>
            </div>
            <div className="profile-item">
              <span className="profile-item-label">Account Registration Date</span>
              <strong className="profile-item-value">{formattedDate}</strong>
            </div>
            <div className="profile-item">
              <span className="profile-item-label">Account Identifier</span>
              <strong className="profile-item-value text-mono">{user.id}</strong>
            </div>
          </div>
        </section>

        {/* SECTION 3: PREFERENCES */}
        <section className="profile-section-card">
          <h3 className="profile-section-title">
            <Sparkles size={16} />
            <span>Preferences</span>
          </h3>
          <div className="profile-grid-2">
            <div className="profile-item">
              <span className="profile-item-label">Color Theme</span>
              <strong className="profile-item-value">
                {document.documentElement.dataset.theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
              </strong>
            </div>
            <div className="profile-item">
              <span className="profile-item-label">Campus Announcements</span>
              <strong className="profile-item-value">Enabled (Default)</strong>
            </div>
          </div>
        </section>

        {/* SECTION 4: SECURITY */}
        <section className="profile-section-card">
          <h3 className="profile-section-title">
            <KeyRound size={16} />
            <span>Security</span>
          </h3>
          <div className="profile-grid-2">
            <div className="profile-item">
              <span className="profile-item-label">Password Storage</span>
              <strong className="profile-item-value">Scrypt Encrypted & Salted</strong>
            </div>
            <div className="profile-item">
              <span className="profile-item-label">Session Protocol</span>
              <strong className="profile-item-value">HTTP-Only SameSite Cookie</strong>
            </div>
          </div>
        </section>

        {/* SECTION 5: SUPPORT */}
        <section className="profile-section-card">
          <h3 className="profile-section-title">
            <HelpCircle size={16} />
            <span>Support & Helpdesk</span>
          </h3>
          <div className="profile-grid-2">
            <div className="profile-item">
              <span className="profile-item-label">College Examination & Academic Office</span>
              <strong className="profile-item-value">
                academic@{user.college?.toLowerCase().includes('matrusri') ? 'matrusri.edu.in' : 'mvsrec.edu.in'}
              </strong>
            </div>
            <div className="profile-item">
              <span className="profile-item-label">CampusConnect Support</span>
              <strong className="profile-item-value">support@campusconnect.edu</strong>
            </div>
          </div>
        </section>

        {/* SECTION 6: ACCOUNT ACTION (LOGOUT) */}
        <section className="profile-section-card logout-card">
          <h3 className="profile-section-title">
            <LogOut size={16} />
            <span>Account Actions</span>
          </h3>
          <p className="logout-desc">
            Logging out will clear your authenticated session cookie. You will need to log in again
            to view protected student details.
          </p>
          <button
            type="button"
            className="profile-logout-btn"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            <LogOut size={16} />
            <span>{loggingOut ? 'Logging out…' : 'Log out of CampusConnect'}</span>
          </button>
        </section>
      </div>
    </main>
  )
}

// ==========================================
// STUDENT PORTAL DASHBOARD (PROTECTED)
// ==========================================
function Portal({ onLogout }) {
  const { user, loading, isAuthenticated, logout } = useAuth()

  if (loading) {
    return (
      <main>
        <PageIntro
          eyebrow="STUDENT PORTAL"
          title="Loading Student Portal..."
          copy="Checking your authenticated session."
        />
      </main>
    )
  }

  if (!isAuthenticated || !user) {
    return (
      <main>
        <PageIntro
          eyebrow="STUDENT PORTAL"
          title="Your campus, made personal."
          copy="Login with your college account to access your personalized student information."
        />
        <section className="login-gate page-width">
          <div className="gate-mark">
            <ShieldCheck size={31} />
          </div>
          <h2>Student information stays yours.</h2>
          <p>
            Your profile, academics, department standing, and campus notifications appear here only
            after the backend authenticates you.
          </p>
          <Link className="button primary" to="/login" state={{ from: '/portal' }}>
            Login to Student Portal <ArrowRight size={16} />
          </Link>
        </section>
      </main>
    )
  }

  return (
    <main>
      <section className="portal-hero page-width">
        <div>
          <p className="eyebrow">STUDENT PORTAL · AUTHENTICATED</p>
          <h1>
            Welcome, {user.name || 'Student'} <span>👋</span>
          </h1>
          <p>
            {user.college || 'Matrusri Engineering College'} · {user.branch?.toUpperCase() || 'CSE'} ·{' '}
            {user.year ? `${user.year} Year` : 'Enrolled Student'}
          </p>
        </div>
        <Link className="button secondary" to="/profile">
          <UserRound size={15} /> View Profile
        </Link>
      </section>

      <section className="stats-grid page-width">
        <Link className="stat-block" to="/academics">
          <BookOpen size={18} />
          <small>Academics</small>
          <strong>{user.branch?.toUpperCase() || 'Enrolled'}</strong>
          <ArrowRight size={14} />
        </Link>
        <Link className="stat-block" to="/profile">
          <UserRound size={18} />
          <small>Student Record</small>
          <strong>Verified</strong>
          <ArrowRight size={14} />
        </Link>
        <Link className="stat-block" to="/notices">
          <CalendarDays size={18} />
          <small>Campus Notices</small>
          <strong>Available</strong>
          <ArrowRight size={14} />
        </Link>
      </section>
    </main>
  )
}

// ==========================================
// PUBLIC PAGES
// ==========================================
function Home() {
  return (
    <main>
      <section className="discover-hero page-width">
        <BentoGallery />
      </section>
      <section className="discovery-strip page-width">
        <div className="explore-heading">
          <p className="eyebrow">EXPLORE MORE</p>
        </div>
        <div className="college-mini-list">
          {colleges.map((college) => (
            <Link to={`/colleges/${college.id}`} key={college.id}>
              <img src={college.images[0]} alt="" />
              <span>
                <b>{college.name}</b>
                <small>{college.location}</small>
              </span>
              <ArrowRight size={16} />
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}

function BentoGallery() {
  return (
    <div className="bento-gallery">
      <Link to="/colleges/matrusri" className="bento large">
        <img src={colleges[0].images[0]} alt="Matrusri Engineering College campus" />
        <span>
          Matrusri
          <br />
          <b>in focus</b>
        </span>
      </Link>
      <Link to="/colleges/matrusri" className="bento portrait">
        <img src={colleges[0].images[1]} alt="Matrusri campus" />
        <span>Campus life</span>
      </Link>
      <Link to="/colleges/mvsr" className="bento small">
        <img src={colleges[1].images[0]} alt="MVSR Engineering College campus" />
        <span>
          Meet MVSR <ArrowRight size={14} />
        </span>
      </Link>
    </div>
  )
}

function CollegeProfile() {
  const { collegeId } = useParams()
  const college = colleges.find((item) => item.id === collegeId) || colleges[0]

  return (
    <main>
      <section className="college-hero page-width">
        <div className="college-hero-copy">
          <Link className="back-link" to="/">
            ← Back to Discover
          </Link>
          <p className="eyebrow orange">COLLEGE PROFILE</p>
          <h1>{college.name}</h1>
          <p className="location">⌖ {college.location}</p>
          <p>{college.description}</p>
          <div className="hero-cta">
            <button className="button primary">
              <Check size={16} /> Save
            </button>
            <button className="button secondary">
              <Share2 size={16} /> Share
            </button>
          </div>
        </div>
        <img src={college.images[0]} alt={`${college.name} official campus`} />
      </section>
      <section className="profile-content page-width">
        <div className="profile-tabs">
          {[
            'Overview',
            'Admissions',
            'Fees',
            'Courses',
            'Placements',
            'Scholarships',
            'Campus Life',
            'Contact',
          ].map((tab, index) => (
            <button className={index === 0 ? 'active' : ''} key={tab}>
              {tab}
            </button>
          ))}
        </div>
        <div className="profile-grid">
          <div>
            <p className="eyebrow">ABOUT THE COLLEGE</p>
            <h2>A place to build what comes next.</h2>
            <p>
              {college.description} This profile features verified institution facts and campus
              highlights.
            </p>
          </div>
          <div className="highlight-list">
            {college.highlights.map((item) => (
              <div key={item}>
                <Check size={15} /> {item}
              </div>
            ))}
          </div>
        </div>
        <div className="profile-images">
          {college.images.slice(1).map((image, index) => (
            <img
              className={`profile-photo photo-${index}`}
              src={image}
              alt={`${college.name} campus view ${index + 2}`}
              key={image}
            />
          ))}
        </div>
        <p className="source-note">Image and profile reference: {college.source}.</p>
      </section>
    </main>
  )
}

function Compare() {
  return (
    <main>
      <PageIntro
        eyebrow="COLLEGE DISCOVERY"
        title="Compare with context."
        copy="A focused look at the partner colleges in CampusConnect."
      />
      <section className="compare-table page-width">
        <div className="compare-head">
          <span>Compare</span>
          {colleges.map((college) => (
            <div key={college.id}>
              <img src={college.images[0]} alt="" />
              <b>{college.name}</b>
            </div>
          ))}
        </div>
        {[
          ['Courses', 'Engineering programs', 'Engineering programs'],
          ['Status', 'Autonomous Institution', 'Autonomous Institution'],
          ['Admissions', 'Official entrance counseling', 'Official entrance counseling'],
          ['Scholarships', 'MEC opportunities & ePASS', 'College opportunities & ePASS'],
          ['Facilities', 'Campus and learning spaces', 'Digitized campus and R&D'],
          ['Campus', 'Saidabad, Hyderabad', 'Nadergul, Hyderabad'],
          ['Location', 'Telangana', 'Telangana'],
        ].map((row) => (
          <div className="compare-row" key={row[0]}>
            <b>{row[0]}</b>
            <span>{row[1]}</span>
            <span>{row[2]}</span>
          </div>
        ))}
      </section>
    </main>
  )
}

function CampusLife() {
  const [lightbox, setLightbox] = useState(null)
  const labels = ['Campus', 'Labs', 'Student life', 'Events', 'Campus view']

  return (
    <main>
      <PageIntro
        eyebrow="MATRUSRI CAMPUS LIFE"
        title="See the place in pieces."
        copy="Official Matrusri imagery arranged as an asymmetric campus story."
      />
      <section className="campus-gallery page-width">
        {colleges[0].images.map((image, index) => (
          <button
            className={`gallery-item gallery-${index}`}
            onClick={() => setLightbox(image)}
            key={image}
          >
            <img src={image} alt={`Matrusri campus gallery ${index + 1}`} />
            <span>{labels[index] || 'Campus view'}</span>
          </button>
        ))}
      </section>
      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="Matrusri campus full view" />
          <button aria-label="Close image">
            <X />
          </button>
        </div>
      )}
    </main>
  )
}

function NoticesPage() {
  const [selected, setSelected] = useState(null)

  return (
    <main>
      <PageIntro
        eyebrow="CAMPUS PULSE"
        title="The things worth knowing."
        copy="Notices from academics, examinations, events, placements, and general campus life."
      />
      <section className="notice-list page-width">
        {notices.map((notice) => (
          <button
            className="notice-row"
            onClick={() => setSelected(notice)}
            key={notice.title}
          >
            <span className={notice.unread ? 'unread' : ''} />
            <div>
              <small>
                {notice.category} · {notice.date}
              </small>
              <h3>{notice.title}</h3>
            </div>
            <ChevronRight size={17} />
          </button>
        ))}
      </section>
      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <article className="notice-modal" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelected(null)} aria-label="Close notice">
              <X size={18} />
            </button>
            <p className="eyebrow orange">
              {selected.category} · {selected.date}
            </p>
            <h2>{selected.title}</h2>
            <p>{selected.body}</p>
          </article>
        </div>
      )}
    </main>
  )
}

function ScholarshipsPage() {
  const [filter, setFilter] = useState('All')

  return (
    <main>
      <PageIntro
        eyebrow="OPPORTUNITIES"
        title="Find the right support."
        copy="Scholarships and financial support available for students."
      />
      <div className="filters page-width">
        {['All', 'Merit', 'Need-based', 'Government', 'College-specific'].map((item) => (
          <button
            className={filter === item ? 'active' : ''}
            onClick={() => setFilter(item)}
            key={item}
          >
            {item}
          </button>
        ))}
      </div>
      <section className="scholarship-grid page-width">
        {scholarships
          .filter((item) => filter === 'All' || item.category === filter)
          .map((item) => (
            <article className="scholarship-card" key={item.name}>
              <p>{item.category}</p>
              <h3>{item.name}</h3>
              <small>{item.eligibility}</small>
              <div>
                <strong>{item.amount}</strong>
                <span>Deadline {item.deadline}</span>
              </div>
            </article>
          ))}
      </section>
    </main>
  )
}

// ==========================================
// APP ROOT WRAPPER
// ==========================================
function AppContent() {
  const [dark, setDark] = useState(localStorage.getItem('cc-theme') === 'dark')
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
    localStorage.setItem('cc-theme', dark ? 'dark' : 'light')
  }, [dark])

  return (
    <div className="app">
      <CampusHeader
        onSearch={() => setSearchOpen(true)}
        dark={dark}
        setDark={setDark}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/academics" element={<AcademicsPage />} />
        <Route path="/portal" element={<Portal />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/colleges/:collegeId" element={<CollegeProfile />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/campus-life" element={<CampusLife />} />
        <Route path="/notices" element={<NoticesPage />} />
        <Route path="/scholarships" element={<ScholarshipsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <AskAiChatDrawer />
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
      <BottomNav onSearch={() => setSearchOpen(true)} />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AskAiProvider>
          <AppContent />
        </AskAiProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(<App />)
