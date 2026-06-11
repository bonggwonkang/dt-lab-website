import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }

const book = {
  titleKo: '생산물류시스템: 시뮬레이션 모델링',
  titleEn: 'Production Logistics System: Simulation Modeling',
  author: 'Bonggwon Kang (강봉권)',
  year: '2025',
  cover: '/images/book-cover.jpg',
  purchaseUrl: 'https://ebook-product.kyobobook.co.kr/dig/epd/ebook/E000011944783',
  description: `This textbook introduces discrete-event simulation modeling with a particular focus on production and logistics systems — semiconductor fabrication lines, display manufacturing, automotive assembly, and distribution centers.

The book uses Siemens Tecnomatix Plant Simulation as the primary modeling environment and covers SimTalk programming, statistical input/output analysis, and scenario-based operational planning. It is designed for upper-division engineering students and practitioners seeking practical simulation skills.`,
  chapters: [
    { num: 1, title: 'Introduction to Discrete-Event Simulation' },
    { num: 2, title: 'Object-based Modeling Concepts' },
    { num: 3, title: 'SimTalk Programming Fundamentals' },
    { num: 4, title: 'Statistical Analysis of Simulation Input Data' },
    { num: 5, title: 'Simulation Output Analysis and Verification' },
    { num: 6, title: 'Production System Modeling' },
    { num: 7, title: 'Logistics and Material Handling System Modeling' },
    { num: 8, title: 'Multi-type Production Simulation and Case Studies' },
  ],
  objectives: [
    'Understand the role of discrete-event simulation in production and logistics design',
    'Develop practical SimTalk programming capabilities',
    'Apply statistical methods for input modeling and output analysis',
    'Build multi-type production logistics simulation models',
  ],
  software: 'Siemens Tecnomatix Plant Simulation',
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
            Book
          </motion.h1>
          <motion.p variants={fadeUp} className="text-gray-400 text-lg max-w-xl">
            Textbook published by Prof. Bonggwon Kang.
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}

export default function BookPage() {
  return (
    <>
      <PageHeader />

      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden" whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-3 gap-12 items-start"
          >
            {/* Cover */}
            <motion.div variants={fadeUp} className="md:col-span-1">
              <div className="rounded-2xl overflow-hidden shadow-2xl shadow-gray-200 bg-gradient-to-br from-indigo-50 to-teal-50 aspect-[3/4] flex items-center justify-center">
                <img
                  src={book.cover}
                  alt={book.titleKo}
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
                  <p className="text-indigo-400 font-bold text-sm">{book.titleKo}</p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <a href={book.purchaseUrl} target="_blank" rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-colors shadow-sm shadow-indigo-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Purchase (교보문고)
                </a>
                <div className="flex items-center gap-2 text-xs text-gray-400 justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
                  </svg>
                  Software: {book.software}
                </div>
              </div>
            </motion.div>

            {/* Info */}
            <motion.div variants={fadeUp} className="md:col-span-2 space-y-10">
              <div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full border border-amber-100">
                    Textbook
                  </span>
                  <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                    {book.year}
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug mb-1">
                  {book.titleKo}
                </h2>
                <p className="text-gray-400 text-sm mb-1">{book.titleEn}</p>
                <p className="text-indigo-600 font-medium text-sm">{book.author}</p>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-indigo-600 tracking-[0.2em] uppercase mb-4">About</h3>
                <div className="space-y-3">
                  {book.description.trim().split('\n\n').map((p, i) => (
                    <p key={i} className="text-gray-600 leading-relaxed text-sm">{p.trim()}</p>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-teal-600 tracking-[0.2em] uppercase mb-4">Learning Objectives</h3>
                <ul className="space-y-2">
                  {book.objectives.map((o, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-400 flex-shrink-0" />
                      {o}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-violet-600 tracking-[0.2em] uppercase mb-4">Table of Contents</h3>
                <div className="grid sm:grid-cols-2 gap-2">
                  {book.chapters.map(c => (
                    <div key={c.num} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                      <span className="text-xs font-black text-violet-400 mt-0.5 w-5 flex-shrink-0">
                        {String(c.num).padStart(2, '0')}
                      </span>
                      <span className="text-xs text-gray-700 font-medium leading-snug">{c.title}</span>
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
