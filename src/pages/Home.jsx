import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

function useScrollAnim() {
  return {
    initial: 'hidden',
    whileInView: 'visible',
    viewport: { once: true, margin: '-80px' },
    variants: stagger,
  }
}

// ─── Data ────────────────────────────────────────────────────────────────────

const topics = [
  {
    num: 'I',
    color: 'indigo',
    title: 'System Modeling & Analysis',
    desc: 'Creates high-fidelity computer models that capture real-world operations for digital twin applications, facility design, operational planning, and real-time control.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
      </svg>
    ),
  },
  {
    num: 'II',
    color: 'teal',
    title: 'Model Optimization',
    desc: 'Focuses on efficient material handling in semiconductor fabs. We developed an AMHS model, identified system bottlenecks, and proposed a model-based optimization framework for proactive vehicle dispatching.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    num: 'III',
    color: 'violet',
    title: 'Model Calibration',
    desc: 'Addresses predictive accuracy through a Bayesian calibration framework that learns and corrects model discrepancy using limited real-world data, bridging the gap between simulation and reality.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
  },
]

const colorStyle = {
  indigo: {
    badge: 'bg-indigo-50 text-indigo-600',
    icon: 'bg-indigo-100 text-indigo-600',
    border: 'hover:border-indigo-200 hover:shadow-indigo-50',
  },
  teal: {
    badge: 'bg-teal-50 text-teal-600',
    icon: 'bg-teal-100 text-teal-600',
    border: 'hover:border-teal-200 hover:shadow-teal-50',
  },
  violet: {
    badge: 'bg-violet-50 text-violet-600',
    icon: 'bg-violet-100 text-violet-600',
    border: 'hover:border-violet-200 hover:shadow-violet-50',
  },
}

// public/videos/ 에 있는 파일명과 일치해야 합니다
const videos = [
  { id: 1, title: 'FAB Simulation',        src: 'Small Size FAB Simulation.mp4' },
  { id: 2, title: '반도체 생산 시스템',         src: '반도체생산시스템.mp4' },
  { id: 3, title: 'AMHS Animation I',      src: '[3D] FAB AMHS Animation 2.mp4' },
  { id: 4, title: 'AMHS Animation II',     src: '[3D] FAB AMHS Animation 3.mp4' },
]

const publications = [
  {
    type: 'journal',
    title: 'A Model-based Optimization Framework for Proactive Vehicle Dispatching in AMHS',
    venue: 'IEEE Transactions on Automation Science and Engineering',
    year: '2024',
  },
  {
    type: 'journal',
    title: 'Bayesian Calibration Framework for Large-Scale Production System Models',
    venue: 'Journal of Manufacturing Systems',
    year: '2023',
  },
  {
    type: 'conference',
    title: 'Surrogate Modeling Approach for Semiconductor FAB Simulation',
    venue: '2024 INFORMS Annual Meeting',
    year: '2024',
  },
  {
    type: 'conference',
    title: 'Digital Twin Application for AMHS Optimization in Semiconductor Manufacturing',
    venue: '2023 INFORMS Annual Meeting, Phoenix, AZ',
    year: '2023',
  },
]

const domains = [
  'Semiconductor Manufacturing',
  'Display Manufacturing',
  'Distribution Centers',
  'Container Terminals',
]

// ─── Sections ─────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gray-950">
      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: 'linear-gradient(to right, #6366f1 1px, transparent 1px), linear-gradient(to bottom, #6366f1 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full">
        <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-4xl">
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-8">
            <span className="h-px w-10 bg-indigo-500" />
            <span className="text-indigo-400 text-xs font-semibold tracking-[0.2em] uppercase">
              Kumoh National Institute of Technology
            </span>
          </motion.div>

          <motion.h1 variants={fadeUp}
            className="text-5xl md:text-7xl font-black text-white leading-[1.05] mb-6 tracking-tight">
            Digital<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-teal-400">
              Transformation
            </span><br />
            Laboratory
          </motion.h1>

          <motion.p variants={fadeUp}
            className="text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed mb-10">
            Developing rigorous methodologies for{' '}
            <span className="text-gray-200 font-medium">modeling, analyzing, optimizing,</span> and{' '}
            <span className="text-gray-200 font-medium">calibrating</span>{' '}
            large-scale production and material handling systems.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-2 mb-12">
            {['Surrogate Modeling', 'Design of Experiments', 'Model-based Decision Making', 'Statistical Calibration'].map(tag => (
              <span key={tag}
                className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/5 text-gray-400 border border-white/10">
                {tag}
              </span>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
            <Link to="/research"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-900/40">
              Explore Research
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link to="/professor"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl border border-white/15 transition-colors">
              Meet Prof. Kang
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600"
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.4 }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  )
}

function DomainsBar() {
  return (
    <section className="py-5 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Research Domains</span>
          {domains.map((d, i) => (
            <div key={d} className="flex items-center gap-2 text-sm text-gray-500 font-medium">
              {i > 0 && <span className="text-gray-200 hidden sm:inline">·</span>}
              {d}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ResearchTopics() {
  const anim = useScrollAnim()
  return (
    <section className="section-padding bg-white">
      <div className="container-width">
        <motion.div {...anim}>
          <motion.div variants={fadeUp} className="text-center mb-16">
            <span className="text-indigo-600 text-xs font-semibold tracking-[0.2em] uppercase">What We Do</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Core Research Topics</h2>
            <p className="mt-4 text-base text-gray-500 max-w-xl mx-auto leading-relaxed">
              We integrate statistical methods with simulation-based decision-making to solve complex industrial systems challenges.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {topics.map(t => {
              const s = colorStyle[t.color]
              return (
                <motion.div key={t.num} variants={fadeUp}
                  className={`group relative bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 ${s.border}`}>
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-5 ${s.icon}`}>
                    {t.icon}
                  </div>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold mb-3 ${s.badge}`}>
                    Topic {t.num}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 leading-snug">{t.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{t.desc}</p>
                </motion.div>
              )
            })}
          </div>

          <motion.div variants={fadeUp} className="text-center mt-10">
            <Link to="/research"
              className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold text-sm transition-colors">
              View full research overview
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function Videos() {
  const anim = useScrollAnim()
  const base = import.meta.env.BASE_URL

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-width">
        <motion.div {...anim}>
          <motion.div variants={fadeUp} className="text-center mb-16">
            <span className="text-teal-600 text-xs font-semibold tracking-[0.2em] uppercase">Lab in Action</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Simulations & Animations</h2>
            <p className="mt-4 text-base text-gray-500 max-w-xl mx-auto">
              Visual demonstrations of our semiconductor FAB simulation models and AMHS vehicle animations.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {videos.map(v => (
              <motion.div key={v.id} variants={fadeUp}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-teal-100 hover:shadow-lg hover:shadow-teal-50 transition-all duration-300">
                <div className="aspect-video bg-gray-900">
                  <video
                    className="w-full h-full object-contain"
                    controls
                    preload="metadata"
                    src={`${base}videos/${v.src}`}
                  />
                </div>
                <div className="px-5 py-4 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-teal-400 flex-shrink-0" />
                  <h3 className="text-sm font-semibold text-gray-800">{v.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Publications() {
  const anim = useScrollAnim()
  return (
    <section className="section-padding bg-white">
      <div className="container-width">
        <motion.div {...anim}>
          <motion.div variants={fadeUp} className="text-center mb-16">
            <span className="text-violet-600 text-xs font-semibold tracking-[0.2em] uppercase">Publications</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Recent Work</h2>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-3">
            {publications.map((p, i) => (
              <motion.div key={i} variants={fadeUp}
                className="flex gap-5 items-start p-5 rounded-xl border border-gray-100 hover:border-indigo-100 hover:shadow-md hover:shadow-indigo-50/50 transition-all duration-200 group">
                <div className={`mt-1.5 flex-shrink-0 w-2.5 h-2.5 rounded-full ${
                  p.type === 'journal' ? 'bg-indigo-500' : 'bg-teal-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm leading-snug">{p.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{p.venue}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      p.type === 'journal'
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'bg-teal-50 text-teal-600'
                    }`}>
                      {p.type === 'journal' ? 'Journal' : 'Conference'}
                    </span>
                    <span className="text-xs text-gray-400">{p.year}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeUp} className="text-center mt-10">
            <Link to="/news"
              className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold text-sm transition-colors">
              View all publications & news
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function CTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-indigo-600 via-indigo-700 to-teal-700 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="relative max-w-3xl mx-auto px-4 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold text-white mb-4">
            Interested in Collaboration?
          </motion.h2>
          <motion.p variants={fadeUp} className="text-indigo-100 text-base md:text-lg mb-8 max-w-lg mx-auto">
            We welcome industry partnerships and research collaboration inquiries from companies and institutions.
          </motion.p>
          <motion.div variants={fadeUp}>
            <a href="mailto:bonggwon.kang@kumoh.ac.kr"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition-colors shadow-xl shadow-indigo-900/30">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Get in Touch
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <DomainsBar />
      <ResearchTopics />
      <Videos />
      <Publications />
      <CTA />
    </>
  )
}
