import { useState } from 'react'
import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }

const items = [
  // ── 2025 ──────────────────────────────────────────────────────────────────
  { date: '2025.09', type: 'journal',
    title: 'New paper has been accepted for publication in Technometrics',
    desc: '"Active Learning of Piecewise Gaussian Process Surrogates" accepted. Focus on Jump GPs for discontinuous design spaces in applications like autonomous materials design and smart factory systems.',
    url: 'https://www.tandfonline.com/doi/full/10.1080/00401706.2025.2561746' },
  { date: '2025.09', type: 'book',
    title: 'New Book Publication Announcement',
    desc: '"Production Logistics System: Simulation Modeling" published. Covers discrete-event simulation with applications to manufacturing and logistics.',
    url: 'https://ebook-product.kyobobook.co.kr/dig/epd/ebook/E000011944783' },
  { date: '2025.06', type: 'conference',
    title: 'Presentation at the 2025 Spring KIIE Conference',
    desc: 'Presented "Bias-aware simulation calibration for an automated material handling system in a semiconductor fab" in Seoul, South Korea.' },
  { date: '2025.04', type: 'journal',
    title: 'New paper has been accepted for publication in Journal of Manufacturing Systems',
    desc: '"A digital twin calibration for an automated material handling system in a semiconductor fab" — addresses parameter uncertainty and model bias.',
    url: 'https://www.sciencedirect.com/science/article/pii/S0278612525001049' },
  { date: '2025.03', type: 'journal',
    title: 'Paper publication in the Journal of the Korean Society of Supply Chain Management',
    desc: '"A Comparative Study of Surrogate Models for Simulation-based Yard Template Planning in a Container Terminal"' },
  { date: '2025.02', type: 'patent',
    title: 'Patent Registration Update',
    desc: '"Method and Apparatus for Deriving Management Policy of Vehicles" — Patent holders: S. Hong, B. Kang. Registered March 2025.' },
  { date: '2025.01.31–02.06', type: 'collaboration',
    title: 'The 4th Joint Workshop on the Recent Digital Twin and Production Logistics Research at the University of Washington',
    desc: 'Collaborative meeting on digital twin research and simulation education.' },
  // ── 2024 ──────────────────────────────────────────────────────────────────
  { date: '2024.12', type: 'journal',
    title: 'Paper publication in the Journal of the Korean Society of Supply Chain Management',
    desc: '"A Simulation Study of the Vehicle Repositioning Policy with the Minimum and Maximum Service Levels in a Demand Responsive Transit System"' },
  { date: '2024.12.11', type: 'conference',
    title: 'Presentation at Hanwha Ocean',
    desc: 'Presented "Recent Research on Digital Twin Construction: A Perspective of Management Science" in Geoje, discussing shipbuilding industry operational challenges.' },
  { date: '2024.10.26', type: 'conference',
    title: 'Presentation at the 2024 Fall KIIE Conference',
    desc: 'Presented "Discrete-event Simulation Calibration for a Large-scale Material Handling System: A Case Study of a Semiconductor Fab" in Seoul.' },
  { date: '2024.10.21', type: 'conference',
    title: 'Presentation at the 2024 INFORMS Annual Meeting',
    desc: 'Invited talk titled "Modular Calibration of a Digital Twin Model for Planning-Level Decision-Making in a Semiconductor Fab\'s AMHS" in Seattle.' },
  { date: '2024.10.20', type: 'collaboration',
    title: 'The 3rd Joint Workshop on the Recent Digital Twin and Production Logistics Research at the University of Washington',
    desc: 'Collaborative workshop with discussions on digital twin calibration approaches. Attendees: Bonggwon Kang, Bosung Kim, Soondo Hong, Chiwoo Park.' },
  { date: '2024.09', type: 'funding',
    title: 'New Research Project Funded by Korea Research Foundation (\'24.09–\'27.08)',
    desc: 'Project: "AI-integrated Simulation Optimization for Smart Storage/Retrieval Systems" — ₩180 million research grant as Principal Investigator.' },
  { date: '2024.08.11–16', type: 'collaboration',
    title: 'The 2nd Joint Workshop on the Recent Digital Twin and Production Logistics Research at the University of Washington',
    desc: 'Collaborative research discussions on warehouse and semiconductor industries. Attendees: Bonggwon Kang, Gwangheon Lee, Soondo Hong, Chiwoo Park.' },
  { date: '2024.05.02–04', type: 'conference',
    title: 'Presentation at the Spring KIIE Conference',
    desc: 'Presented "Gaussian process-based yard template planning under vehicle congestion and container rehandling: a case study of Busan Port Terminal" in Yeosu.' },
  { date: '2024.02.18–23', type: 'collaboration',
    title: 'UW-PNU Joint Workshop at the University of Washington',
    desc: 'Joint meeting on digital twin research and simulation education. Attendees: Bonggwon Kang, Soondo Hong, Chiwoo Park.' },
  { date: '2024.01.31', type: 'conference',
    title: 'Presentation at the Smart Manufacturing Forum for the SEMICON KOREA',
    desc: 'Invited talk on simulation-based decision-making in large-scale material handling systems in Seoul.',
    url: 'https://www.semiconkorea.org/ko/node/9166' },
  // ── 2023 ──────────────────────────────────────────────────────────────────
  { date: '2023.11.03', type: 'conference',
    title: 'Presentation at the Semiconductor Smart Manufacturing Working Group',
    desc: 'Presented "Simulation-based optimization alternatives for large-scale material handling systems" during 2023 KIIE conference planning session.' },
  { date: '2023.10.18', type: 'conference',
    title: 'Presentation at the 2023 INFORMS Annual Meeting',
    desc: 'Invited talk titled "Surrogate model-based simulation optimization of vehicle positioning strategy in a semiconductor fab" in Phoenix, Arizona.' },
  { date: '2023.10', type: 'journal',
    title: 'New paper has been accepted for publication in IEEE Access',
    desc: '"Simulation optimization of collaborative handshake operations for twin overhead shuttle cranes in a rail-based automated container terminal under demand uncertainty"',
    url: 'https://ieeexplore.ieee.org/document/10285297' },
  { date: '2023.09', type: 'journal',
    title: 'New paper has been accepted for publication in IEEE Transactions on Automation Science and Engineering',
    desc: '"Bayesian optimization for the vehicle dwelling policy in a semiconductor wafer fab"',
    url: 'https://ieeexplore.ieee.org/document/10278155' },
  { date: '2023.09', type: 'journal',
    title: 'New paper has been accepted for publication in Journal of the Korea Society for Simulation',
    desc: '"A Simulation-based Optimization for Scheduling in a Fab: Comparative Study on Different Sampling Methods"' },
  { date: '2023.09.07', type: 'conference',
    title: 'Presentation at the 11th International Conference on Logistics and Maritime Systems',
    desc: 'Presented "A case study of data-driven yard template planning with feature engineering" in Busan, Korea.' },
  { date: '2023.06.25', type: 'preprint',
    title: 'Active Learning of Piecewise Gaussian Process Surrogates — Preprint',
    desc: 'International collaborative research with Chiwoo Park, Robert Waelder, Benji Maruyama, Soondo Hong, Robert Gramacy.',
    url: 'https://arxiv.org/abs/2301.08789' },
  { date: '2023.06.16', type: 'collaboration',
    title: 'Surrogate model-based simulation optimization international joint research workshop',
    desc: 'Workshop held June 16, 2023. Attendees: Bonggwon Kang, Soondo Hong, Chiwoo Park.' },
  { date: '2023.01.27', type: 'conference',
    title: 'Presentation at Grand PNU Performance Exchange Programme',
    desc: 'Presented "Simulation-based decision making in large-scale simulations".' },
  // ── 2022 ──────────────────────────────────────────────────────────────────
  { date: '2022.10', type: 'conference',
    title: 'Presentation at Winter Simulation Conference',
    desc: '"Yard Template Planning in a Transshipment Hub: Gaussian Process Regression" — Authors: Bonggwon Kang, Permata Vallentino Eko Joatiko, Jungtae Park, Soondo Hong.',
    url: 'https://ieeexplore.ieee.org/abstract/document/10015251' },
  { date: '2022.10', type: 'journal',
    title: 'Paper publication in Journal of Korean Institute of Industrial Engineers',
    desc: '"A GA-based Optimization of a Weighted Lot Targeting Rule in a Semiconductor Wafer Fab"',
    url: 'https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART002887365' },
  { date: '2022.09', type: 'book',
    title: 'Book chapter publication in Smart Manufacturing and Logistics Systems: Turning Ideas into Action',
    desc: '"Sequential optimization of a temporary storage location for cooperative twin overhead shuttles in a rail-based automated container terminal"',
    url: 'https://link.springer.com/chapter/10.1007/978-3-031-16407-1_34' },
  { date: '2022.09', type: 'journal',
    title: 'Paper publication in Journal of Korean Society of Industrial and Systems Engineering',
    desc: '"A Dynamic OHT Routing Algorithm in Automated Material Handling Systems"',
    url: 'https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART002881508' },
  { date: '2022.06', type: 'journal',
    title: 'Paper publication in Korea Journal of BigData',
    desc: '"A Study of a Video-based Simulation Input Modeling Procedure in a Construction Equipment Assembly Line"',
    url: 'https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART002855671' },
  { date: '2022.06', type: 'journal',
    title: 'Paper publication in Korea Journal of BigData',
    desc: '"A Simulation-based Genetic Algorithm for a Dispatching Rule in a Flexible Flow Shop with Rework Process"',
    url: 'https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART002855661' },
  // ── 2021 / 2020 ───────────────────────────────────────────────────────────
  { date: '2021.08', type: 'journal',
    title: 'A paper publication in IEEE Access',
    desc: '"A Job Sequencing Problem of an Overhead Shuttle Crane in a Rail-Based Automated Container Terminal"',
    url: 'https://ieeexplore.ieee.org/abstract/document/9174991' },
  { date: '2020.04', type: 'book',
    title: 'Book chapter publication in Dynamics in Logistics',
    desc: '"A Simulation Study of a Storage Policy for a Container Terminal"',
    url: 'https://link.springer.com/chapter/10.1007/978-3-030-44783-0_6' },
]

const typeStyle = {
  journal:       { dot: 'bg-indigo-500',  badge: 'bg-indigo-950/60 text-indigo-400 border border-indigo-800/50'  },
  conference:    { dot: 'bg-teal-500',    badge: 'bg-teal-950/60 text-teal-400 border border-teal-800/50'        },
  book:          { dot: 'bg-amber-500',   badge: 'bg-amber-950/60 text-amber-400 border border-amber-800/50'     },
  patent:        { dot: 'bg-violet-500',  badge: 'bg-violet-950/60 text-violet-400 border border-violet-800/50'  },
  funding:       { dot: 'bg-green-500',   badge: 'bg-green-950/60 text-green-400 border border-green-800/50'     },
  collaboration: { dot: 'bg-rose-400',    badge: 'bg-rose-950/60 text-rose-400 border border-rose-800/50'        },
  preprint:      { dot: 'bg-gray-500',    badge: 'bg-gray-800/60 text-gray-400 border border-gray-700/50'        },
}

function groupByYear(list) {
  const acc = list.reduce((g, p) => {
    const y = p.date.slice(0, 4)
    if (!g[y]) g[y] = []
    g[y].push(p)
    return g
  }, {})
  return { grouped: acc, years: Object.keys(acc).sort((a, b) => b - a) }
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
            News
          </motion.h1>
        </motion.div>
      </div>
    </section>
  )
}

export default function NewsPage() {
  const [activeFilter, setActiveFilter] = useState('all')
  const filtered = activeFilter === 'all' ? items : items.filter(p => p.type === activeFilter)
  const { grouped, years } = groupByYear(filtered)

  return (
    <>
      <PageHeader />

      <section className="py-24 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter bar */}
          <div className="flex flex-wrap gap-2 mb-14">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                activeFilter === 'all'
                  ? 'bg-white/15 text-white border-white/30'
                  : 'text-gray-500 border-white/10 hover:text-gray-300 hover:border-white/20'
              }`}
            >
              All
            </button>
            {Object.entries(typeStyle).map(([k, v]) => (
              <button
                key={k}
                onClick={() => setActiveFilter(k)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-colors capitalize ${
                  activeFilter === k ? v.badge : 'text-gray-500 border-white/10 hover:text-gray-300 hover:border-white/20'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${v.dot}`} />
                {k}
              </button>
            ))}
          </div>

          <div className="space-y-14">
            {years.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-12">No items for this filter.</p>
            )}
            {years.map(year => (
              <motion.div key={year}
                initial="hidden" whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                variants={stagger}
              >
                <motion.div variants={fadeUp} className="flex items-center gap-4 mb-8">
                  <span className="text-3xl font-black text-white">{year}</span>
                  <span className="flex-1 h-px bg-white/10" />
                  <span className="text-xs text-gray-600">{grouped[year].length} item{grouped[year].length > 1 ? 's' : ''}</span>
                </motion.div>

                <div className="space-y-4 pl-4 border-l-2 border-white/10">
                  {grouped[year].map((p, i) => {
                    const s = typeStyle[p.type] || typeStyle.journal
                    return (
                      <motion.div key={i} variants={fadeUp} className="relative pl-6">
                        <span className={`absolute -left-[9px] top-3 w-3.5 h-3.5 rounded-full border-2 border-gray-900 ${s.dot}`} />

                        <div className="bg-gray-800/50 rounded-xl border border-white/10 hover:border-indigo-500/30 hover:bg-gray-800/80 transition-all duration-200">
                          <div className="p-5">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${s.badge}`}>
                                {p.type}
                              </span>
                              <span className="text-xs text-gray-600">{p.date}</span>
                            </div>

                            {p.url ? (
                              <a href={p.url} target="_blank" rel="noreferrer"
                                className="font-semibold text-gray-200 text-sm leading-snug hover:text-indigo-400 transition-colors inline-flex items-start gap-1 group">
                                {p.title}
                                <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                            ) : (
                              <p className="font-semibold text-gray-200 text-sm leading-snug">{p.title}</p>
                            )}

                            {p.desc && <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{p.desc}</p>}
                          </div>
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
