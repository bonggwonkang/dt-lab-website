import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }

const professor = {
  name: 'Bonggwon Kang',
  nameKo: '강봉권',
  role: 'Principal Investigator · Assistant Professor',
  affiliation: 'Dept. of Industrial Engineering\nKumoh National Institute of Technology',
  email: 'kbk@kumoh.ac.kr',
  photo: '/images/professor.jpg',
  interests: ['Simulation Optimization', 'Digital Twin', 'Bayesian Calibration', 'AMHS'],
  links: [
    { label: 'Google Scholar', url: 'https://scholar.google.com/citations?user=QLqVgY0AAAAJ&hl=ko' },
    { label: 'ResearchGate',   url: 'https://www.researchgate.net/profile/Bonggwon-Kang' },
  ],
}

const students = [
  {
    name: '오가영',
    nameEn: 'Gayoung Oh',
    degree: 'Undergraduate Researcher',
    research: 'Surrogate-based decision-making',
    email: 'oh050316@kumoh.ac.kr',
    photo: '/images/member-oh.jpg',
  },
  {
    name: '이승빈',
    nameEn: 'Seungbin Lee',
    degree: 'Undergraduate Researcher',
    research: 'Digital twin applications for material handling systems',
    email: 'hctoto2005@kumoh.ac.kr',
    photo: '/images/member-lee.jpg',
  },
]

const alumni = []

function Avatar({ photo, name, size = 'lg' }) {
  const dim   = size === 'lg' ? 'w-24 h-24 text-2xl' : 'w-16 h-16 text-sm'
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div className={`${dim} rounded-full overflow-hidden bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center font-bold text-indigo-600 ring-4 ring-white shadow-md flex-shrink-0`}>
      <img
        src={photo}
        alt={name}
        className="w-full h-full object-cover"
        onError={e => {
          e.target.style.display = 'none'
          e.target.nextSibling.style.display = 'flex'
        }}
      />
      <span className="w-full h-full items-center justify-center" style={{ display: 'none' }}>
        {initials}
      </span>
    </div>
  )
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
            Members
          </motion.h1>
          <motion.p variants={fadeUp} className="text-gray-400 text-lg max-w-xl">
            The people behind the research.
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}

export default function MembersPage() {
  return (
    <>
      <PageHeader />

      {/* Professor */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.h2 variants={fadeUp}
              className="text-xs font-semibold text-indigo-600 tracking-[0.2em] uppercase mb-10">
              Principal Investigator
            </motion.h2>

            <motion.div variants={fadeUp}
              className="flex flex-col sm:flex-row gap-8 items-start bg-white rounded-2xl border border-gray-100 p-8 hover:shadow-xl hover:shadow-indigo-50 transition-all duration-300 max-w-2xl">
              <Avatar photo={professor.photo} name={professor.nameEn || professor.name} size="lg" />
              <div className="flex-1">
                <div className="flex items-baseline gap-3 flex-wrap mb-1">
                  <h3 className="text-xl font-bold text-gray-900">{professor.name}</h3>
                  <span className="text-gray-400 text-sm">{professor.nameKo}</span>
                </div>
                <p className="text-indigo-600 font-medium text-sm mb-0.5">{professor.role}</p>
                <p className="text-gray-500 text-sm whitespace-pre-line mb-3">{professor.affiliation}</p>
                <a href={`mailto:${professor.email}`}
                  className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition-colors mb-4">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {professor.email}
                </a>
                <div className="flex flex-wrap gap-2 mb-3">
                  {professor.interests.map(i => (
                    <span key={i} className="px-2.5 py-1 bg-indigo-50 text-indigo-600 text-xs font-medium rounded-lg border border-indigo-100">
                      {i}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  {professor.links.map(l => (
                    <a key={l.label} href={l.url} target="_blank" rel="noreferrer"
                      className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-indigo-50 text-gray-600 hover:text-indigo-600 text-xs font-medium transition-colors">
                      {l.label}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Students */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={stagger}>
            <motion.div variants={fadeUp} className="flex items-center justify-between mb-10 flex-wrap gap-4">
              <h2 className="text-xs font-semibold text-teal-600 tracking-[0.2em] uppercase">
                Graduate & Undergraduate Researchers
              </h2>
              <a href="mailto:kbk@kumoh.ac.kr"
                className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
                Join our lab
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {students.map(s => (
                <motion.div key={s.name} variants={fadeUp}
                  className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-teal-100 hover:shadow-lg hover:shadow-teal-50 transition-all duration-300 flex flex-col items-center text-center">
                  <Avatar photo={s.photo} name={s.nameEn} size="md" />
                  <div className="mt-4">
                    <h3 className="font-bold text-gray-900">{s.name}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{s.nameEn}</p>
                    <span className="inline-block mt-2 px-2.5 py-0.5 bg-teal-50 text-teal-700 text-xs font-medium rounded-full">
                      {s.degree}
                    </span>
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">{s.research}</p>
                    {s.email && (
                      <a href={`mailto:${s.email}`}
                        className="mt-3 inline-block text-xs text-gray-400 hover:text-indigo-500 transition-colors">
                        {s.email}
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Recruiting card */}
              <motion.div variants={fadeUp}
                className="bg-white rounded-2xl p-6 border-2 border-dashed border-gray-200 hover:border-indigo-200 transition-all duration-300 flex flex-col items-center justify-center text-center min-h-[200px]">
                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-gray-500">Recruiting</p>
                <p className="text-xs text-gray-400 mt-1">We are looking for motivated students.</p>
                <a href="mailto:kbk@kumoh.ac.kr"
                  className="mt-3 text-xs text-indigo-600 font-medium hover:underline">
                  Contact PI
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {alumni.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
              <motion.h2 variants={fadeUp}
                className="text-xs font-semibold text-violet-600 tracking-[0.2em] uppercase mb-10">Alumni</motion.h2>
              <div className="space-y-3 max-w-2xl">
                {alumni.map((a, i) => (
                  <motion.div key={i} variants={fadeUp}
                    className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-white">
                    <div>
                      <span className="font-semibold text-gray-900 text-sm">{a.name}</span>
                      <span className="text-gray-400 text-xs ml-2">{a.nameEn}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">{a.degree}</p>
                      {a.current && <p className="text-xs text-gray-400">{a.current}</p>}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </>
  )
}
