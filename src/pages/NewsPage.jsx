import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }

const items = [
  // ── 2025 ───────────────────────────────────────────────────────────────────
  {
    year: '2025', type: 'journal', category: 'Publication',
    title: 'Active Learning of Piecewise Gaussian Process Surrogates',
    venue: 'Technometrics',
    url: 'https://www.tandfonline.com/doi/full/10.1080/00401706.2025.2561746',
    note: 'Accepted',
  },
  {
    year: '2025', type: 'journal', category: 'Publication',
    title: 'Digital Twin Calibration for an Automated Material Handling System',
    venue: 'Journal of Manufacturing Systems',
    url: 'https://www.sciencedirect.com/science/article/pii/S0278612525001049',
    note: 'Accepted',
  },
  {
    year: '2025', type: 'book', category: 'Book',
    title: 'Production Logistics System: Simulation Modeling',
    venue: 'Kyobo Book (교보문고)',
    url: 'https://ebook-product.kyobobook.co.kr/dig/epd/ebook/E000011944783',
    note: 'Published',
  },
  {
    year: '2025', type: 'patent', category: 'Patent',
    title: 'Method and Apparatus for Deriving Management Policy of Vehicles',
    venue: 'Korean Patent Registration (S. Hong, B. Kang)',
    note: 'Registered March 2025',
  },
  {
    year: '2025', type: 'funding', category: 'Funding',
    title: 'AI-integrated Simulation Optimization for Smart Storage/Retrieval Systems',
    venue: 'Korea Research Foundation — ₩180,000,000 (2024–2027)',
    note: 'Principal Investigator',
  },
  {
    year: '2025', type: 'conference', category: 'Conference',
    title: 'Bias-aware Simulation Calibration for Automated Material Handling System',
    venue: '2025 Spring KIIE Conference',
  },
  // ── 2024 ───────────────────────────────────────────────────────────────────
  {
    year: '2024', type: 'journal', category: 'Publication',
    title: 'Model-based Optimization Framework for Proactive Vehicle Dispatching in AMHS',
    venue: 'IEEE Transactions on Automation Science and Engineering',
    url: 'https://ieeexplore.ieee.org/document/10278155',
  },
  {
    year: '2024', type: 'conference', category: 'Conference',
    title: 'Modular Calibration of Digital Twin Model',
    venue: '2024 INFORMS Annual Meeting, Seattle, WA',
  },
  {
    year: '2024', type: 'conference', category: 'Conference',
    title: 'Discrete-event Simulation Calibration for Large-scale Material Handling System',
    venue: '2024 Fall KIIE Conference',
  },
  {
    year: '2024', type: 'collaboration', category: 'Collaboration',
    title: 'Joint Workshop on Digital Twin Research',
    venue: 'University of Washington (with Prof. Chiwoo Park, Florida State University)',
  },
  // ── 2023 ───────────────────────────────────────────────────────────────────
  {
    year: '2023', type: 'journal', category: 'Publication',
    title: 'Bayesian Calibration Framework for Large-Scale Production System Models',
    venue: 'Journal of Manufacturing Systems',
    url: 'https://www.sciencedirect.com/science/article/pii/S0278612525001049',
  },
  {
    year: '2023', type: 'journal', category: 'Publication',
    title: 'Simulation-based Optimization for Automated Material Handling in Semiconductor Fabs',
    venue: 'IEEE Access',
    url: 'https://ieeexplore.ieee.org/document/10285297',
  },
  {
    year: '2023', type: 'conference', category: 'Conference',
    title: 'Surrogate Model-based Simulation Optimization for AMHS',
    venue: '2023 INFORMS Annual Meeting, Phoenix, AZ',
  },
  {
    year: '2023', type: 'conference', category: 'Conference',
    title: 'Digital Twin Approach for Container Terminal Operations',
    venue: '2023 Winter Simulation Conference',
    url: 'https://ieeexplore.ieee.org/abstract/document/10015251',
  },
  // ── 2020 ───────────────────────────────────────────────────────────────────
  {
    year: '2020', type: 'journal', category: 'Publication',
    title: 'Simulation Modeling for Automated Material Handling in Semiconductor Manufacturing',
    venue: 'IEEE Access',
    url: 'https://ieeexplore.ieee.org/document/9174991',
  },
]

const typeStyle = {
  journal:       { dot: 'bg-indigo-500',  badge: 'bg-indigo-50 text-indigo-700'  },
  conference:    { dot: 'bg-teal-500',    badge: 'bg-teal-50 text-teal-700'      },
  book:          { dot: 'bg-amber-500',   badge: 'bg-amber-50 text-amber-700'    },
  patent:        { dot: 'bg-violet-500',  badge: 'bg-violet-50 text-violet-700'  },
  funding:       { dot: 'bg-green-500',   badge: 'bg-green-50 text-green-700'    },
  collaboration: { dot: 'bg-rose-400',    badge: 'bg-rose-50 text-rose-700'      },
}

const grouped = items.reduce((acc, p) => {
  if (!acc[p.year]) acc[p.year] = []
  acc[p.year].push(p)
  return acc
}, {})
const years = Object.keys(grouped).sort((a, b) => b - a)

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
            Publications, awards, grants, patents, and lab highlights.
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
          <motion.div initial="hidden" animate="visible" variants={stagger}
            className="flex flex-wrap gap-x-6 gap-y-2 mb-14">
            {Object.entries(typeStyle).map(([k, v]) => (
              <motion.div key={k} variants={fadeUp} className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${v.dot}`} />
                <span className="text-xs text-gray-500 font-medium capitalize">{k}</span>
              </motion.div>
            ))}
          </motion.div>

          <div className="space-y-16">
            {years.map(year => (
              <motion.div key={year}
                initial="hidden" whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                variants={stagger}
              >
                <motion.div variants={fadeUp} className="flex items-center gap-4 mb-8">
                  <span className="text-3xl font-black text-gray-900">{year}</span>
                  <span className="flex-1 h-px bg-gray-100" />
                  <span className="text-xs text-gray-400">{grouped[year].length} item{grouped[year].length > 1 ? 's' : ''}</span>
                </motion.div>

                <div className="space-y-4 pl-4 border-l-2 border-gray-100">
                  {grouped[year].map((p, i) => {
                    const s = typeStyle[p.type] || typeStyle.journal
                    return (
                      <motion.div key={i} variants={fadeUp} className="relative pl-6">
                        <span className={`absolute -left-[9px] top-2.5 w-3.5 h-3.5 rounded-full border-2 border-white ${s.dot}`} />
                        <div className="bg-white rounded-xl p-5 border border-gray-100 hover:border-indigo-100 hover:shadow-md hover:shadow-indigo-50/50 transition-all duration-200">
                          <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${s.badge}`}>
                              {p.category}
                            </span>
                            {p.note && <span className="text-xs text-gray-400 font-medium">{p.note}</span>}
                          </div>
                          {p.url ? (
                            <a href={p.url} target="_blank" rel="noreferrer"
                              className="font-semibold text-gray-900 text-sm leading-snug hover:text-indigo-600 transition-colors inline-flex items-start gap-1 group">
                              {p.title}
                              <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          ) : (
                            <p className="font-semibold text-gray-900 text-sm leading-snug">{p.title}</p>
                          )}
                          <p className="text-xs text-gray-500 mt-1.5">{p.venue}</p>
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
