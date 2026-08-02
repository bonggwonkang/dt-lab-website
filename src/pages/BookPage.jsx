import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }

function PageHeader() {
  return (
    <section className="pt-24 pb-10 bg-white dark:bg-gray-950 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: 'linear-gradient(to right, #6366f1 1px, transparent 1px), linear-gradient(to bottom, #6366f1 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" animate="visible" variants={stagger}>
          <motion.h1 variants={fadeUp}
            className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tight leading-[1.05] mb-5">
            Book
          </motion.h1>
        </motion.div>
      </div>
    </section>
  )
}

export default function BookPage() {
  const base = import.meta.env.BASE_URL
  return (
    <>
      <PageHeader />

      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="grid md:grid-cols-3 gap-12 items-start"
          >
            {/* Cover */}
            <motion.div variants={fadeUp} className="md:col-span-1">
              <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/10 dark:shadow-black/40 bg-gray-200 dark:bg-gray-800 aspect-[3/4] flex items-center justify-center ring-1 ring-gray-200 dark:ring-white/10">
                <img
                  src={`${base}images/book-cover.jpg`}
                  alt="Production Logistics System: Simulation Modeling"
                  className="w-full h-full object-cover"
                  onError={e => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                  }}
                />
                <div className="w-full h-full items-center justify-center p-8 text-center" style={{ display: 'none' }}>
                  <svg className="w-16 h-16 text-indigo-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <p className="text-indigo-400 font-bold text-sm">생산물류시스템:<br />시뮬레이션 모델링</p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <a href="https://ebook-product.kyobobook.co.kr/dig/epd/ebook/E000011944783"
                  target="_blank" rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Purchase
                </a>
                <a href="https://simpl-lab.github.io/"
                  target="_blank" rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-colors text-sm border border-gray-200 dark:border-white/10">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Practice Code
                </a>
              </div>
            </motion.div>

            {/* Info */}
            <motion.div variants={fadeUp} className="md:col-span-2 space-y-10">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-snug mb-1">
                  생산물류시스템: 시뮬레이션 모델링
                </h2>
                <p className="text-gray-500 text-sm mb-1">Production Logistics System: Simulation Modeling</p>
                <p className="text-indigo-400 font-medium text-sm">Bonggwon Kang (강봉권), Soondo Hong (홍순도)</p>
              </div>

              <div>
                <h3 className="text-base font-semibold text-indigo-400 tracking-wide mb-4">About</h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm mb-3">
                  Modern production and logistics systems, such as semiconductor and display fabs, automotive assembly lines, and shipyards, consist of highly complex and large-scale processes where a single material interacts with numerous processing, storage, and transport facilities. To cope with such complexity and uncertainty, industries have increasingly adopted the concept of the digital twin.
                </p>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm mb-3 indent-4">
                  Among various approaches, discrete-event simulation (DES) has become a core methodology, as it enables detailed modeling of time-series events and their interactions, supporting system-level evaluations. The construction of realistic simulation models requires the creation of digital counterparts of physical entities and the careful representation of their interactions in virtual space.
                </p>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm indent-4">
                  This textbook introduces systematic modeling methods using Siemens Tecnomatix Plant Simulation. Building on experiences in semiconductor and display manufacturing, it emphasizes modeling skills for production and logistics processes. The book covers basic simulation concepts, object-based modeling, and SimTalk programming for system interaction and statistical input/output analysis.
                </p>
              </div>

              <div>
                <h3 className="text-base font-semibold text-violet-400 tracking-wide mb-4">Table of Contents</h3>
                <ul className="space-y-1.5">
                  {[
                    'Introduction to Discrete-Event Simulation',
                    'Foundational Modeling Concepts',
                    'Object-based Modeling',
                    'SimTalk Programming',
                    'Input Data Modeling & Statistical Methods',
                    'Output Analysis & Experiment Management',
                    'Production & Logistics System Types',
                    'Queuing Theory & Case Studies',
                  ].map((c, i) => (
                    <li key={c} className="flex items-baseline gap-3 text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-mono font-bold text-white flex-shrink-0">[{i + 1}]</span>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
