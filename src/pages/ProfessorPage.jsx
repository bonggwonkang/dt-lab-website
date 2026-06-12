import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }

const experience = [
  { year: '2026 –',     title: 'Assistant Professor', org: 'Department of Industrial Engineering, Kumoh National Institute of Technology' },
  { year: '2025',       title: 'Postdoctoral Scholar', org: 'Industrial & Systems Engineering, University of Washington' },
  { year: '2024',       title: 'Postdoctoral Research Fellow', org: 'Research Institute of Intelligent Logistics Big Data, Pusan National University' },
  { year: 'Ph.D. 2024', title: 'Department of Industrial Engineering', org: 'Pusan National University' },
  { year: 'B.S. 2019',  title: 'Department of Industrial Engineering', org: 'Pusan National University' },
]

const teaching = [
  { course: 'Facilities Planning and Material Handling Systems', term: 'Spring 2025', uni: 'Pusan National University' },
  { course: 'Digital Twin and Simulation Modeling',             term: 'Spring 2025', uni: 'Pukyong National University' },
  { course: 'Introduction to Digital Twins',                    term: '2026',        uni: 'University of Washington (invited lectures over two weeks)' },
  { course: 'Probability and Statistics',                       term: 'Spring 2026', uni: 'Kumoh National Institute of Technology' },
  { course: 'Creative Thinking for Engineering',                term: 'Spring 2026', uni: 'Kumoh National Institute of Technology' },
  { course: 'Affective Quality Engineering',                    term: 'Spring 2026', uni: 'Kumoh National Institute of Technology' },
]

const links = [
  { label: 'Google Scholar', url: 'https://scholar.google.com/citations?user=QLqVgY0AAAAJ&hl=ko' },
  { label: 'ResearchGate',   url: 'https://www.researchgate.net/profile/Bonggwon-Kang' },
]

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
          <motion.h1 variants={fadeUp}
            className="text-4xl md:text-6xl font-black text-white tracking-tight leading-[1.05] mb-5">
            Professor
          </motion.h1>
        </motion.div>
      </div>
    </section>
  )
}

export default function ProfessorPage() {
  const base = import.meta.env.BASE_URL
  return (
    <>
      <PageHeader />

      <section className="py-24 bg-gray-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="grid md:grid-cols-3 gap-12"
          >
            {/* ── Left: photo + contact ── */}
            <motion.div variants={fadeUp} className="md:col-span-1 flex flex-col items-center md:items-start gap-6">
              <div className="w-48 h-56 rounded-2xl overflow-hidden bg-gray-800 shadow-xl ring-1 ring-white/10 flex-shrink-0">
                <img
                  src={`${base}images/professor.jpg`}
                  alt="Bonggwon Kang"
                  className="w-full h-full object-cover"
                  onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
                />
                <div className="w-full h-full items-center justify-center hidden">
                  <span className="text-5xl font-black text-indigo-400">BK</span>
                </div>
              </div>

              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-white">Bonggwon Kang</h2>
                <p className="text-gray-500 text-sm mt-0.5">강봉권</p>
                <p className="text-indigo-400 font-semibold text-sm mt-2">Assistant Professor</p>
                <p className="text-gray-400 text-sm">Department of Industrial Engineering</p>
                <p className="text-gray-400 text-sm">Kumoh National Institute of Technology</p>
              </div>

              <div className="space-y-2 text-sm w-full">
                <a href="mailto:kbk@kumoh.ac.kr"
                  className="flex items-center gap-2 text-gray-400 hover:text-indigo-400 transition-colors">
                  <svg className="w-4 h-4 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  kbk@kumoh.ac.kr
                </a>
                <div className="flex items-start gap-2 text-gray-400">
                  <svg className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +82-54-478-7665
                </div>
                <div className="flex items-start gap-2 text-gray-400 text-xs">
                  <svg className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="leading-relaxed">Global 577, Daehak-ro, Gumi-si,<br />Gyeongsangbuk-do (39177)</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {links.map(l => (
                  <a key={l.label} href={l.url} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-indigo-950/60 text-gray-400 hover:text-indigo-400 text-xs font-medium transition-colors border border-white/10">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    {l.label}
                  </a>
                ))}
              </div>
            </motion.div>

            {/* ── Right: education + teaching ── */}
            <motion.div variants={fadeUp} className="md:col-span-2 space-y-12">

              {/* Education & Experience */}
              <div>
                <h3 className="text-xs font-semibold text-indigo-400 tracking-[0.2em] uppercase mb-6">
                  Education &amp; Experience
                </h3>
                <div className="relative pl-6 border-l-2 border-white/10 space-y-6">
                  {experience.map((e, i) => (
                    <div key={i} className="relative">
                      <span className="absolute -left-4 top-2 w-3 h-3 rounded-full border-2 border-gray-900 bg-indigo-500" />
                      <p className="text-xs font-semibold text-indigo-400 mb-0.5">{e.year}</p>
                      <p className="font-semibold text-white text-sm leading-snug">{e.title}</p>
                      <p className="text-sm text-gray-400">{e.org}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Teaching */}
              <div>
                <h3 className="text-xs font-semibold text-teal-400 tracking-[0.2em] uppercase mb-6">Teaching</h3>
                <div className="space-y-2">
                  {teaching.map((t, i) => (
                    <div key={i} className="flex items-start justify-between gap-4 p-3.5 rounded-xl bg-gray-800/50 border border-white/10 hover:border-teal-500/30 transition-colors">
                      <div className="flex items-start gap-3">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-500 flex-shrink-0" />
                        <div>
                          <span className="text-sm text-white font-medium">{t.course}</span>
                          <p className="text-xs text-gray-500 mt-0.5">{t.uni}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap flex-shrink-0">{t.term}</span>
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
