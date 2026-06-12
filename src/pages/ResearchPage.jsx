import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }

const topics = [
  {
    num: 'I',
    color: 'indigo',
    title: 'System Modeling & Analysis',
    summary: 'High-fidelity simulation modeling and analysis for digital twin applications across complex industrial environments.',
    details: [
      'Development of discrete-event simulation (DES) models that faithfully replicate production floor operations.',
      'Systematic bottleneck identification through workload analysis and sensitivity studies.',
      'Scenario-based analysis for facility design and layout optimization.',
    ],
    keywords: ['Discrete-event simulation', 'Bottleneck analysis', 'Material handling operations'],
    video: { src: 'Small Size FAB Simulation.mp4', title: 'Automated material handling system in a semiconductor fab' },
  },
  {
    num: 'II',
    color: 'teal',
    title: 'Model Optimization',
    summary: 'Simulation optimization for digital twin-based prescriptions in production and logistics systems.',
    details: [
      'Tatical layout design under uncertain customer demands.',
      'Periodic operational planning and real-time control in fast evolving systems',
      'Surrogate-based optimization to reduce the cost of simulation experiments.',
    ],
    keywords: ['Statistical surrogates', 'Simulation optimization', 'Design of experiments'],
    video: { src: '반도체생산시스템.mp4', title: 'Semiconductor production line simulation' },
  },
  {
    num: 'III',
    color: 'violet',
    title: 'Model Calibration',
    summary: 'Bayesian calibration frameworks that align simulation models with real-world observations using limited data.',
    details: [
      'Identification and quantification of model discrepancy between simulation and physical systems.',
      'Bayesian inference framework for learning calibration parameters from sparse observations.',
      'Uncertainty quantification in model predictions to support reliable decision-making.',
    ],
    keywords: ['Uncertainty quantification', 'Parameter estimation', 'Discrepancy modeling'],
    video: { src: '[3D] FAB AMHS Animation 2.mp4', title: '3D automated material handling system in a semiconductor fab' },
  },
]

const colorStyle = {
  indigo: { bar: 'bg-indigo-500', tag: 'bg-indigo-950/60 text-indigo-400 border-indigo-800/60', num: 'text-indigo-400' },
  teal:   { bar: 'bg-teal-500',   tag: 'bg-teal-950/60 text-teal-400 border-teal-800/60',       num: 'text-teal-400'   },
  violet: { bar: 'bg-violet-500', tag: 'bg-violet-950/60 text-violet-400 border-violet-800/60', num: 'text-violet-400' },
}

const ChipIcon = () => (
  <svg className="w-6 h-6 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="7" y="7" width="10" height="10" rx="1" />
    <path d="M9 7V4M12 7V4M15 7V4M9 17v3M12 17v3M15 17v3M7 9H4M7 12H4M7 15H4M17 9h3M17 12h3M17 15h3" />
  </svg>
)

const domains = [
  {
    title: 'Semiconductor & Display Manufacturing',
    desc: 'Modeling and optimization of wafer fabrication processes and AMHS in semiconductor fabs.',
    icon: <ChipIcon />,
    video: { src: '[3D] FAB AMHS Animation 3.mp4', title: '3D Semiconductor Fab AMHS Simulation' },
  },
  {
    title: 'Distribution Centers',
    desc: 'Simulation-based design and operational analysis of automated warehouse and logistics systems.',
    icon: '📦',
    video: { src: '3D SVSRS.mp4', title: '3D Shuttle-based Storage and Retrieval System Simulation' },
  },
  {
    title: 'Container Terminals',
    desc: 'Large-scale port terminal simulation for crane scheduling, vehicle routing, and yard management.',
    icon: '🚢',
    video: { src: 'container terminal.mp4', title: 'Container Terminal Simulation' },
  },
]

function VideoPlayer({ src, title, colorBar = 'bg-indigo-500' }) {
  const base = import.meta.env.BASE_URL
  return (
    <div className="rounded-2xl overflow-hidden bg-gray-950 ring-1 ring-white/10 shadow-xl shadow-black/40">
      <div className="aspect-video">
        <video
          className="w-full h-full object-contain"
          controls
          preload="metadata"
          src={`${base}videos/${src}`}
        />
      </div>
      <div className="px-5 py-3.5 flex items-center gap-3 bg-gray-900/80">
        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${colorBar}`} />
        <span className="text-xs text-gray-400 font-medium">{title}</span>
      </div>
    </div>
  )
}

function PageHeader() {
  return (
    <section className="pt-32 pb-20 bg-gray-950 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: 'linear-gradient(to right, #6366f1 1px, transparent 1px), linear-gradient(to bottom, #6366f1 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" animate="visible" variants={stagger}>
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-5">
            <span className="h-px w-8 bg-indigo-500" />
            <span className="text-indigo-400 text-xs font-semibold tracking-[0.2em] uppercase">DT Lab.</span>
          </motion.div>
          <motion.h1 variants={fadeUp}
            className="text-4xl md:text-6xl font-black text-white tracking-tight leading-[1.05] mb-5">
            Research
          </motion.h1>
          <motion.p variants={fadeUp} className="text-gray-200 text-lg max-w-2xl leading-relaxed">
            Our work spans three interconnected themes —{' '}
            <span className="text-indigo-400 font-medium">modeling</span> complex systems,{' '}
            <span className="text-teal-400 font-medium">optimizing</span> their operations, and{' '}
            <span className="text-violet-400 font-medium">calibrating</span> their predictive accuracy —
            unified by a statistical model-based digital transformation.
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}

export default function ResearchPage() {
  return (
    <>
      <PageHeader />

      {/* Topics */}
      <section className="pt-24 pb-12 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-28">
            {topics.map((t, idx) => {
              const s = colorStyle[t.color]
              const isEven = idx % 2 === 0
              return (
                <motion.div
                  key={t.num}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-60px' }}
                  variants={stagger}
                  className="grid md:grid-cols-2 gap-12 items-center"
                >
                  {/* Text side */}
                  <motion.div variants={fadeUp} className={isEven ? '' : 'md:order-2'}>
                    <span className={`inline-block text-4xl font-black mb-3 ${s.num}`}>
                      Topic {t.num}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-snug">
                      {t.title}
                    </h2>
                    <p className="text-gray-400 leading-relaxed mb-6">{t.summary}</p>
                    <ul className="space-y-3 mb-8">
                      {t.details.map((d, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                          <span className={`mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full ${s.bar}`} />
                          {d}
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-2">
                      {t.keywords.map(k => (
                        <span key={k} className={`px-3 py-1 rounded-full text-xs font-medium border ${s.tag}`}>
                          {k}
                        </span>
                      ))}
                    </div>
                  </motion.div>

                  {/* Video side */}
                  <motion.div variants={fadeUp} className={isEven ? '' : 'md:order-1'}>
                    <VideoPlayer src={t.video.src} title={t.video.title} colorBar={s.bar} />
                  </motion.div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Application Domains */}
      <section className="pt-12 pb-24 bg-gray-950">
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(to right, #6366f1 1px, transparent 1px), linear-gradient(to bottom, #6366f1 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Application Domains</h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {domains.map(d => (
                <motion.div key={d.title} variants={fadeUp} className="flex flex-col gap-4">
                  <div className="bg-gray-800/50 rounded-2xl p-6 border border-white/10 hover:border-indigo-500/40 hover:bg-gray-800/80 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="flex-shrink-0 text-2xl leading-none">{d.icon}</span>
                      <h3 className="font-bold text-white leading-snug">{d.title}</h3>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">{d.desc}</p>
                  </div>

                  {d.video ? (
                    <VideoPlayer src={d.video.src} title={d.video.title} colorBar="bg-teal-500" />
                  ) : (
                    <div className="rounded-2xl overflow-hidden bg-gray-900 border border-white/10 border-dashed">
                      <div className="aspect-video flex flex-col items-center justify-center gap-2 p-6 text-center">
                        <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <p className="text-xs text-gray-600 leading-relaxed">{d.videoNote}</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
