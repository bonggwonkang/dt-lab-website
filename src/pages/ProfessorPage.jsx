import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }

// ── 교수 정보를 아래에서 수정하세요 ──────────────────────────────────
const prof = {
  name: 'Bonggwon Kang',
  nameKo: '강봉권',
  title: 'Assistant Professor',
  department: 'Department of Industrial Engineering',
  university: 'Kumoh National Institute of Technology',
  universityKo: '금오공과대학교',
  email: 'bonggwon.kang@kumoh.ac.kr',
  photo: null, // 사진 경로: '/professor.jpg' (public 폴더에 넣은 후 경로 기입)
  bio: `Prof. Bonggwon Kang is an assistant professor in the Department of Industrial Engineering at Kumoh National Institute of Technology. His research group focuses on the development of simulation-based methodologies for large-scale production and material handling systems.

His work integrates surrogate modeling, active design of experiments, and statistical calibration to enable data-efficient, model-based decision-making in complex industrial environments including semiconductor fabs, distribution centers, and container terminals.`,
  education: [
    // { degree: 'Ph.D. Industrial Engineering', school: '대학교 이름', year: '20XX' },
    // { degree: 'M.S. Industrial Engineering', school: '대학교 이름', year: '20XX' },
    // { degree: 'B.S. Industrial Engineering', school: '대학교 이름', year: '20XX' },
    { degree: 'Ph.D. Industrial Engineering', school: '— (추가 필요)', year: '' },
    { degree: 'M.S. Industrial Engineering', school: '— (추가 필요)', year: '' },
    { degree: 'B.S. Industrial Engineering', school: '— (추가 필요)', year: '' },
  ],
  interests: [
    'Simulation-based Optimization',
    'Digital Twin & Cyber-Physical Systems',
    'Surrogate Modeling',
    'Bayesian Model Calibration',
    'Design of Experiments',
    'Semiconductor & AMHS Systems',
  ],
  service: [
    // { role: 'Reviewer', org: 'IEEE Transactions on Automation Science and Engineering' },
  ],
  links: [
    // { label: 'Google Scholar', url: 'https://scholar.google.com/...' },
    // { label: 'ResearchGate', url: 'https://www.researchgate.net/...' },
    // { label: 'LinkedIn', url: 'https://linkedin.com/in/...' },
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
            Principal Investigator of the Digital Transformation Laboratory.
          </motion.p>
        </motion.div>
      </div>
    </section>
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
            {/* Left column — photo + quick info */}
            <motion.div variants={fadeUp} className="md:col-span-1 flex flex-col items-center md:items-start gap-6">
              <div className="w-44 h-44 rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center shadow-lg flex-shrink-0">
                {prof.photo
                  ? <img src={prof.photo} alt={prof.name} className="w-full h-full object-cover" />
                  : <span className="text-5xl font-black text-indigo-400 select-none">BK</span>
                }
              </div>

              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-900">{prof.name}</h2>
                <p className="text-gray-400 text-sm">{prof.nameKo}</p>
                <p className="text-indigo-600 font-semibold text-sm mt-1.5">{prof.title}</p>
                <p className="text-gray-500 text-sm mt-0.5">{prof.department}</p>
                <p className="text-gray-500 text-sm">{prof.university}</p>
              </div>

              <a href={`mailto:${prof.email}`}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition-colors">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="break-all">{prof.email}</span>
              </a>

              {prof.links.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {prof.links.map(l => (
                    <a key={l.label} href={l.url} target="_blank" rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-indigo-50 text-gray-600 hover:text-indigo-600 text-xs font-medium transition-colors">
                      {l.label}
                    </a>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Right column — bio + details */}
            <motion.div variants={fadeUp} className="md:col-span-2 space-y-10">
              {/* Bio */}
              <div>
                <h3 className="text-xs font-semibold text-indigo-600 tracking-[0.2em] uppercase mb-4">Biography</h3>
                <div className="space-y-4">
                  {prof.bio.trim().split('\n\n').map((para, i) => (
                    <p key={i} className="text-gray-600 leading-relaxed text-sm">{para.trim()}</p>
                  ))}
                </div>
              </div>

              {/* Research Interests */}
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

              {/* Education */}
              <div>
                <h3 className="text-xs font-semibold text-violet-600 tracking-[0.2em] uppercase mb-4">Education</h3>
                <div className="space-y-3">
                  {prof.education.map((e, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                      <div className="flex-shrink-0 mt-0.5 w-2 h-2 rounded-full bg-violet-400" />
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{e.degree}</p>
                        <p className="text-sm text-gray-500">{e.school}{e.year ? ` · ${e.year}` : ''}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Service */}
              {prof.service.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 tracking-[0.2em] uppercase mb-4">Professional Service</h3>
                  <div className="space-y-2">
                    {prof.service.map((s, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm text-gray-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0" />
                        <span className="font-medium">{s.role}</span>
                        <span className="text-gray-400">—</span>
                        <span>{s.org}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
