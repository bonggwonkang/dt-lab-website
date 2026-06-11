import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }

// ── 논문/발표 내역을 여기에 추가하세요 ──────────────────────────────
const publications = [
  {
    year: '2024',
    type: 'journal',
    title: 'A Model-based Optimization Framework for Proactive Vehicle Dispatching in Automated Material Handling Systems',
    authors: 'B. Kang et al.',
    venue: 'IEEE Transactions on Automation Science and Engineering',
    status: 'Published',
  },
  {
    year: '2024',
    type: 'conference',
    title: 'Surrogate Modeling Approach for Semiconductor FAB Simulation and Optimization',
    authors: 'B. Kang et al.',
    venue: '2024 INFORMS Annual Meeting',
    location: 'Seattle, WA',
    status: 'Presented',
  },
  {
    year: '2023',
    type: 'journal',
    title: 'Bayesian Calibration Framework for Large-Scale Production System Models Using Limited Real-World Data',
    authors: 'B. Kang et al.',
    venue: 'Journal of Manufacturing Systems',
    status: 'Published',
  },
  {
    year: '2023',
    type: 'conference',
    title: 'Digital Twin Application for AMHS Optimization in Semiconductor Manufacturing',
    authors: 'B. Kang et al.',
    venue: '2023 INFORMS Annual Meeting',
    location: 'Phoenix, AZ',
    status: 'Presented',
  },
]

const grouped = publications.reduce((acc, p) => {
  if (!acc[p.year]) acc[p.year] = []
  acc[p.year].push(p)
  return acc
}, {})

const years = Object.keys(grouped).sort((a, b) => b - a)

const typeStyle = {
  journal: {
    dot: 'bg-indigo-500',
    badge: 'bg-indigo-50 text-indigo-700',
    label: 'Journal',
  },
  conference: {
    dot: 'bg-teal-500',
    badge: 'bg-teal-50 text-teal-700',
    label: 'Conference',
  },
}

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
            News & Publications
          </motion.h1>
          <motion.p variants={fadeUp} className="text-gray-400 text-lg max-w-2xl leading-relaxed">
            Our contributions to journals, conferences, and the research community.
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}

export default function NewsPage() {
  return (
    <>
      <PageHeader />

      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Legend */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="flex gap-6 mb-14"
          >
            {Object.entries(typeStyle).map(([k, v]) => (
              <motion.div key={k} variants={fadeUp} className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${v.dot}`} />
                <span className="text-sm text-gray-500 font-medium">{v.label}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Timeline by year */}
          <div className="space-y-16">
            {years.map(year => (
              <motion.div
                key={year}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                variants={stagger}
              >
                <motion.div variants={fadeUp} className="flex items-center gap-4 mb-8">
                  <span className="text-3xl font-black text-gray-900">{year}</span>
                  <span className="flex-1 h-px bg-gray-100" />
                  <span className="text-xs text-gray-400 font-medium">
                    {grouped[year].length} item{grouped[year].length > 1 ? 's' : ''}
                  </span>
                </motion.div>

                <div className="space-y-4 pl-4 border-l-2 border-gray-100">
                  {grouped[year].map((p, i) => {
                    const s = typeStyle[p.type]
                    return (
                      <motion.div key={i} variants={fadeUp}
                        className="relative pl-6 group">
                        {/* Dot on the timeline */}
                        <span className={`absolute -left-[9px] top-2.5 w-3.5 h-3.5 rounded-full border-2 border-white ${s.dot}`} />

                        <div className="bg-white rounded-xl p-6 border border-gray-100 hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-50/50 transition-all duration-200">
                          <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${s.badge}`}>
                              {s.label}
                            </span>
                            {p.status && (
                              <span className="text-xs text-gray-400 font-medium">{p.status}</span>
                            )}
                          </div>
                          <h3 className="font-semibold text-gray-900 leading-snug mb-1.5">{p.title}</h3>
                          <p className="text-sm text-gray-500">{p.authors}</p>
                          <p className="text-sm text-gray-400 mt-1">
                            {p.venue}{p.location ? ` · ${p.location}` : ''}
                          </p>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
