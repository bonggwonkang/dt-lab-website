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
    summary: 'High-fidelity simulation models for digital twin applications across complex industrial environments.',
    details: [
      'Development of discrete-event simulation (DES) models that faithfully replicate production floor operations.',
      'Digital twin construction for semiconductor fabs, distribution centers, and container terminals.',
      'Scenario-based analysis for facility design and layout optimization.',
      'Real-time operational planning and control using live model synchronization.',
    ],
    keywords: ['Discrete-Event Simulation', 'Digital Twin', 'Facility Design', 'Operational Planning'],
  },
  {
    num: 'II',
    color: 'teal',
    title: 'Model Optimization',
    summary: 'Model-based optimization frameworks for efficient material handling and proactive dispatching in semiconductor fabs.',
    details: [
      'Construction and validation of an Automated Material Handling System (AMHS) simulation model.',
      'Systematic bottleneck identification through workload analysis and sensitivity studies.',
      'Surrogate-assisted optimization to reduce the computational cost of simulation-based search.',
      'Proactive vehicle dispatching policy derived from a model-based optimization framework.',
    ],
    keywords: ['AMHS', 'Surrogate Modeling', 'Bottleneck Analysis', 'Vehicle Dispatching', 'Semiconductor Fab'],
  },
  {
    num: 'III',
    color: 'violet',
    title: 'Model Calibration',
    summary: 'Bayesian calibration frameworks that align simulation models with real-world observations using limited data.',
    details: [
      'Identification and quantification of model discrepancy between simulation and physical systems.',
      'Bayesian inference framework for learning calibration parameters from sparse observations.',
      'Active learning strategies for selecting maximally informative experiments.',
      'Uncertainty quantification in model predictions to support reliable decision-making.',
    ],
    keywords: ['Bayesian Calibration', 'Model Discrepancy', 'Uncertainty Quantification', 'Active Learning'],
  },
]

const colorStyle = {
  indigo: {
    badge: 'bg-indigo-50 text-indigo-700',
    bar: 'bg-indigo-500',
    tag: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    num: 'text-indigo-600',
    icon: 'bg-indigo-100 text-indigo-600',
  },
  teal: {
    badge: 'bg-teal-50 text-teal-700',
    bar: 'bg-teal-500',
    tag: 'bg-teal-50 text-teal-600 border-teal-100',
    num: 'text-teal-600',
    icon: 'bg-teal-100 text-teal-600',
  },
  violet: {
    badge: 'bg-violet-50 text-violet-700',
    bar: 'bg-violet-500',
    tag: 'bg-violet-50 text-violet-600 border-violet-100',
    num: 'text-violet-600',
    icon: 'bg-violet-100 text-violet-600',
  },
}

const domains = [
  {
    title: 'Semiconductor & Display Manufacturing',
    desc: 'Modeling and optimization of wafer fabrication processes and AMHS vehicle dispatching in semiconductor fabs.',
    icon: '💡',
  },
  {
    title: 'Distribution Centers',
    desc: 'Simulation-based design and operational analysis of automated warehouse and logistics systems.',
    icon: '📦',
  },
  {
    title: 'Container Terminals',
    desc: 'Large-scale port terminal simulation for crane scheduling, vehicle routing, and yard management.',
    icon: '🚢',
  },
]

function PageHeader() {
  return (
    <section className="pt-32 pb-20 bg-gradient-to-b from-gray-950 to-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: 'linear-gradient(to right, #6366f1 1px, transparent 1px), linear-gradient(to bottom, #6366f1 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
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
          <motion.p variants={fadeUp} className="text-gray-400 text-lg max-w-2xl leading-relaxed">
            Our work spans three interconnected themes — modeling complex systems, optimizing their operations,
            and calibrating their predictive accuracy — unified by a model-based decision-making philosophy.
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
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-24">
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
                  className={`grid md:grid-cols-2 gap-12 items-center ${isEven ? '' : 'md:flex-row-reverse'}`}
                >
                  {/* Text side */}
                  <motion.div variants={fadeUp} className={isEven ? '' : 'md:order-2'}>
                    <span className={`inline-block text-4xl font-black mb-3 ${s.num}`}>
                      Topic {t.num}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-snug">
                      {t.title}
                    </h2>
                    <p className="text-gray-500 leading-relaxed mb-6">{t.summary}</p>
                    <ul className="space-y-3 mb-8">
                      {t.details.map((d, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
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

                  {/* Visual card side */}
                  <motion.div variants={fadeUp} className={isEven ? '' : 'md:order-1'}>
                    <div className={`rounded-2xl p-8 bg-gradient-to-br ${
                      t.color === 'indigo' ? 'from-indigo-50 to-indigo-100/50' :
                      t.color === 'teal' ? 'from-teal-50 to-teal-100/50' :
                      'from-violet-50 to-violet-100/50'
                    } border border-white`}>
                      <div className={`text-7xl font-black mb-4 opacity-15 ${s.num}`}>
                        {t.num}
                      </div>
                      <div className="space-y-2">
                        {t.details.map((_, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className={`h-1.5 rounded-full ${s.bar}`}
                              style={{ width: `${85 - i * 12}%`, opacity: 1 - i * 0.15 }} />
                          </div>
                        ))}
                      </div>
                      <p className={`mt-6 text-xs font-semibold tracking-widest uppercase ${s.num} opacity-60`}>
                        {t.title}
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Application Domains */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="text-center mb-16">
              <span className="text-teal-600 text-xs font-semibold tracking-[0.2em] uppercase">Where We Apply</span>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Application Domains</h2>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-6">
              {domains.map(d => (
                <motion.div key={d.title} variants={fadeUp}
                  className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-50 transition-all duration-300">
                  <div className="text-3xl mb-4">{d.icon}</div>
                  <h3 className="font-bold text-gray-900 mb-2 leading-snug">{d.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{d.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
