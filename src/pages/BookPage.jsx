import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }

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

      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="grid md:grid-cols-3 gap-12 items-start"
          >
            {/* Cover */}
            <motion.div variants={fadeUp} className="md:col-span-1">
              <div className="rounded-2xl overflow-hidden shadow-2xl shadow-gray-200 bg-gradient-to-br from-indigo-50 to-teal-50 aspect-[3/4] flex items-center justify-center">
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
                  <svg className="w-16 h-16 text-indigo-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  Purchase (교보문고)
                </a>
                <a href="https://simpl-lab.github.io/"
                  target="_blank" rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Practice Code (simpl-lab.github.io)
                </a>
              </div>
            </motion.div>

            {/* Info */}
            <motion.div variants={fadeUp} className="md:col-span-2 space-y-10">
              <div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full border border-amber-100">Textbook</span>
                  <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">2025</span>
                  <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">Kyobo Book Centre</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug mb-1">
                  생산물류시스템: 시뮬레이션 모델링
                </h2>
                <p className="text-gray-400 text-sm mb-1">Production Logistics System: Simulation Modeling</p>
                <p className="text-indigo-600 font-medium text-sm">Bonggwon Kang (강봉권)</p>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-indigo-600 tracking-[0.2em] uppercase mb-4">About</h3>
                <p className="text-gray-600 leading-relaxed text-sm mb-3">
                  This textbook introduces discrete-event simulation (DES) modeling using Siemens Tecnomatix Plant Simulation, focusing on production and logistics systems in semiconductor, display, and automotive manufacturing.
                </p>
                <p className="text-gray-600 leading-relaxed text-sm">
                  The book covers object-based modeling, SimTalk programming, statistical input/output analysis, and real-world case studies across 8 chapters.
                </p>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-teal-600 tracking-[0.2em] uppercase mb-4">Key Topics</h3>
                <ul className="space-y-2">
                  {[
                    'Discrete-event simulation (DES) fundamentals and applications',
                    'Digital twin concepts in manufacturing',
                    'Object-based modeling techniques',
                    'SimTalk programming for system interactions',
                    'Statistical input/output analysis',
                  ].map(t => (
                    <li key={t} className="flex items-start gap-3 text-sm text-gray-600">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-400 flex-shrink-0" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-violet-600 tracking-[0.2em] uppercase mb-4">Table of Contents</h3>
                <div className="grid sm:grid-cols-2 gap-2">
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
                    <div key={c} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                      <span className="text-xs font-black text-violet-400 mt-0.5 w-5 flex-shrink-0">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="text-xs text-gray-700 font-medium leading-snug">{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
