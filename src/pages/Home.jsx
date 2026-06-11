import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gray-950">
      <div className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: 'linear-gradient(to right, #6366f1 1px, transparent 1px), linear-gradient(to bottom, #6366f1 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

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
            Welcome to the<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-teal-400">
              Digital Transformation
            </span><br />
            Lab!
          </motion.h1>

          <motion.p variants={fadeUp}
            className="text-lg md:text-xl text-gray-300 max-w-2xl leading-relaxed mb-10">
            At the Digital Transformation Lab, we develop advanced methodologies for{' '}
            <span className="text-white font-medium">modeling, analyzing, optimizing,</span> and{' '}
            <span className="text-white font-medium">calibrating</span>{' '}
            large-scale production and material handling systems.
          </motion.p>

          <motion.p variants={fadeUp} className="text-sm text-gray-500 max-w-2xl leading-relaxed mb-10">
            We integrate model-based decision-making with statistical approaches, emphasizing surrogate modeling
            and active design of experiments to support efficient decision-making.
          </motion.p>

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
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-900 to-transparent" />
    </section>
  )
}

const dtNodes = [
  {
    id: 'physical',
    label: 'Physical System',
    sub: 'Semiconductor Fabs · Warehouses · Terminals',
    color: 'indigo',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    id: 'model',
    label: 'Simulation Model',
    sub: 'Discrete-Event Simulation · Digital Twin',
    color: 'teal',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
      </svg>
    ),
  },
  {
    id: 'optimize',
    label: 'Model Optimization',
    sub: 'Surrogate Modeling · Vehicle Dispatching',
    color: 'violet',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    id: 'calibrate',
    label: 'Model Calibration',
    sub: 'Bayesian Calibration · Uncertainty Quantification',
    color: 'rose',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
  },
]

const colorMap = {
  indigo: { bg: 'bg-indigo-950/50', border: 'border-indigo-800/50', icon: 'text-indigo-400', label: 'text-indigo-300' },
  teal:   { bg: 'bg-teal-950/50',   border: 'border-teal-800/50',   icon: 'text-teal-400',   label: 'text-teal-300'   },
  violet: { bg: 'bg-violet-950/50', border: 'border-violet-800/50', icon: 'text-violet-400', label: 'text-violet-300' },
  rose:   { bg: 'bg-rose-950/50',   border: 'border-rose-800/50',   icon: 'text-rose-400',   label: 'text-rose-300'   },
}

function DTConcept() {
  return (
    <section className="py-14 bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(to right, #6366f1 1px, transparent 1px), linear-gradient(to bottom, #6366f1 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <motion.div variants={fadeUp} className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="h-px w-8 bg-indigo-500/50" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Our Digital Transformation Concept</h2>
            <p className="text-gray-300 text-base mt-3 max-w-xl mx-auto leading-relaxed">
              We close the loop between physical systems and digital models — building, optimizing, and calibrating
              high-fidelity simulations to enable better operational decisions.
            </p>
          </motion.div>

          {/* Main diagram: Physical ↔ Digital stack */}
          <div className="grid md:grid-cols-[1fr_auto_1fr] gap-0 items-center mb-12">
            {/* Physical side */}
            <motion.div variants={fadeUp}>
              {(() => {
                const c = colorMap.indigo
                return (
                  <div className={`rounded-2xl border p-8 ${c.bg} ${c.border} text-center`}>
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gray-900/60 mb-4 ${c.icon}`}>
                      {dtNodes[0].icon}
                    </div>
                    <h3 className={`font-bold text-base mb-1 ${c.label}`}>{dtNodes[0].label}</h3>
                    <p className="text-sm text-gray-300 leading-relaxed">{dtNodes[0].sub}</p>
                  </div>
                )
              })()}
            </motion.div>

            {/* Arrows */}
            <motion.div variants={fadeUp} className="flex flex-col items-center gap-3 px-6 py-8">
              {/* Right arrow */}
              <div className="flex items-center gap-1">
                <div className="w-16 h-px bg-gradient-to-r from-indigo-500/30 to-teal-500/80" />
                <svg className="w-4 h-4 text-teal-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xs text-gray-300 text-center whitespace-nowrap">Real-time data</span>
              {/* Left arrow */}
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 text-violet-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                <div className="w-16 h-px bg-gradient-to-r from-violet-500/80 to-indigo-500/30" />
              </div>
              <span className="text-xs text-gray-300 text-center whitespace-nowrap">Decision-making</span>
            </motion.div>

            {/* Digital stack */}
            <motion.div variants={fadeUp} className="flex flex-col gap-3">
              {dtNodes.slice(1).map(node => {
                const c = colorMap[node.color]
                return (
                  <div key={node.id} className={`rounded-xl border p-4 flex items-center gap-4 ${c.bg} ${c.border}`}>
                    <div className={`flex-shrink-0 ${c.icon}`}>{node.icon}</div>
                    <div>
                      <h4 className={`font-semibold text-sm ${c.label}`}>{node.label}</h4>
                      <p className="text-sm text-gray-300 mt-0.5">{node.sub}</p>
                    </div>
                  </div>
                )
              })}
            </motion.div>
          </div>

          {/* Bottom: loop label */}
          <motion.div variants={fadeUp} className="text-center">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gray-800/60 border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-sm text-gray-300 font-medium">Continuous model refinement through physical ↔ digital feedback loop</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section className="py-20 bg-gradient-to-br from-indigo-600 via-indigo-700 to-teal-700 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="relative max-w-3xl mx-auto px-4 text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold text-white mb-4">
            Join the Digital Transformation Lab!
          </motion.h2>
          <motion.p variants={fadeUp} className="text-indigo-100 text-base mb-8 max-w-lg mx-auto">
            The Digital Transformation Lab welcomes highly motivated students who are interested in our research areas.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4">
            <a href="mailto:kbk@kumoh.ac.kr"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition-colors shadow-xl shadow-indigo-900/30">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact Us
            </a>
            <Link to="/members"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/15 text-white font-bold rounded-xl border border-white/30 hover:bg-white/25 transition-colors">
              Meet the Team
            </Link>
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
      <DTConcept />
      <Contact />
    </>
  )
}
