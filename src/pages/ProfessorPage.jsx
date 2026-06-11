import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }

const prof = {
  name: 'Bonggwon Kang',
  nameKo: '강봉권',
  title: 'Assistant Professor',
  department: 'Department of Industrial Engineering',
  university: 'Kumoh National Institute of Technology',
  universityKo: '금오공과대학교 산업공학부',
  email: 'kbk@kumoh.ac.kr',
  phone: '+82-54-478-7665',
  // 교수님 사진을 public/images/professor.jpg 로 저장하면 자동 표시됩니다
  photo: '/images/professor.jpg',
  bio: `Prof. Bonggwon Kang is an Assistant Professor in the Department of Industrial Engineering at Kumoh National Institute of Technology (KIT), South Korea. He leads the Digital Transformation (DT) Lab, where his group develops simulation-based methodologies for large-scale production and material handling systems.

His research integrates surrogate modeling, active design of experiments, and Bayesian statistical calibration to enable data-efficient, model-based decision-making. Application domains include semiconductor and display fabrication, automated material handling systems (AMHS), distribution centers, and container terminals.

Prof. Kang's work has appeared in leading journals such as Technometrics, IEEE Transactions on Automation Science and Engineering, and the Journal of Manufacturing Systems, and has been presented at premier venues including the INFORMS Annual Meeting and the Winter Simulation Conference.`,
  education: [
    { degree: 'Ph.D. Industrial Engineering', school: 'Pusan National University', year: '2024' },
    { degree: 'B.S. Industrial Engineering',  school: 'Pusan National University', year: '2019' },
  ],
  interests: [
    'Simulation-based Optimization',
    'Digital Twin & Cyber-Physical Systems',
    'Surrogate Modeling',
    'Bayesian Model Calibration',
    'Active Design of Experiments',
    'Semiconductor & AMHS Systems',
  ],
  teaching: [
    'Digital Twins',
    'Probability & Statistics',
    'Quality Engineering',
    'Production Systems Simulation',
  ],
  service: [
    { role: 'Reviewer', org: 'IEEE Transactions on Automation Science and Engineering' },
    { role: 'Reviewer', org: 'Journal of Manufacturing Systems' },
    { role: 'Reviewer', org: 'Technometrics' },
  ],
  links: [
    { label: 'Google Scholar', url: 'https://scholar.google.com/citations?user=QLqVgY0AAAAJ&hl=ko' },
    { label: 'ResearchGate',   url: 'https://www.researchgate.net/profile/Bonggwon-Kang' },
  ],
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
            Professor
          </motion.h1>
          <motion.p variants={fadeUp} className="text-gray-400 text-lg max-w-xl">
            Principal Investigator — Digital Transformation Laboratory
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}

function ProfilePhoto() {
  return (
    <div className="w-44 h-52 rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center shadow-lg flex-shrink-0">
      <img
        src={prof.photo}
        alt={prof.name}
        className="w-full h-full object-cover"
        onError={e => {
          e.target.style.display = 'none'
          e.target.nextSibling.style.display = 'flex'
        }}
      />
      <div className="w-full h-full items-center justify-center" style={{ display: 'none' }}>
        <span className="text-5xl font-black text-indigo-400 select-none">BK</span>
      </div>
    </div>
  )
}

export default function ProfessorPage() {
  return (
    <>
      <PageHeader />

      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-3 gap-12"
          >
            {/* Left — photo + quick info */}
            <motion.div variants={fadeUp} className="md:col-span-1 flex flex-col items-center md:items-start gap-5">
              <ProfilePhoto />

              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-900">{prof.name}</h2>
                <p className="text-gray-400 text-sm mt-0.5">{prof.nameKo}</p>
                <p className="text-indigo-600 font-semibold text-sm mt-2">{prof.title}</p>
                <p className="text-gray-500 text-sm mt-0.5">{prof.department}</p>
                <p className="text-gray-500 text-sm">{prof.universityKo}</p>
              </div>

              <div className="space-y-2 text-sm w-full">
                <a href={`mailto:${prof.email}`}
                  className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors">
                  <svg className="w-4 h-4 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {prof.email}
                </a>
                <div className="flex items-center gap-2 text-gray-500">
                  <svg className="w-4 h-4 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {prof.phone}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {prof.links.map(l => (
                  <a key={l.label} href={l.url} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-indigo-50 text-gray-600 hover:text-indigo-600 text-xs font-medium transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    {l.label}
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Right — details */}
            <motion.div variants={fadeUp} className="md:col-span-2 space-y-10">
              <div>
                <h3 className="text-xs font-semibold text-indigo-600 tracking-[0.2em] uppercase mb-4">Biography</h3>
                <div className="space-y-4">
                  {prof.bio.trim().split('\n\n').map((para, i) => (
                    <p key={i} className="text-gray-600 leading-relaxed text-sm">{para.trim()}</p>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-teal-600 tracking-[0.2em] uppercase mb-4">Research Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {prof.interests.map(i => (
                    <span key={i} className="px-3 py-1.5 bg-teal-50 text-teal-700 text-xs font-medium rounded-lg border border-teal-100">
                      {i}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-violet-600 tracking-[0.2em] uppercase mb-4">Education</h3>
                <div className="space-y-3">
                  {prof.education.map((e, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                      <div className="flex-shrink-0 mt-1 w-2 h-2 rounded-full bg-violet-400" />
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{e.degree}</p>
                        <p className="text-sm text-gray-500">{e.school} · {e.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-gray-500 tracking-[0.2em] uppercase mb-4">Teaching</h3>
                <div className="flex flex-wrap gap-2">
                  {prof.teaching.map(t => (
                    <span key={t} className="px-3 py-1.5 bg-gray-50 text-gray-600 text-xs font-medium rounded-lg border border-gray-200">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-gray-500 tracking-[0.2em] uppercase mb-4">Professional Service</h3>
                <div className="space-y-2">
                  {prof.service.map((s, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-gray-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0" />
                      <span className="font-medium text-gray-700">{s.role}</span>
                      <span className="text-gray-300">—</span>
                      <span>{s.org}</span>
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
