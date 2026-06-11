import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }

// ── 구성원 정보를 여기에 추가/수정하세요 ─────────────────────────────
const professor = {
  name: 'Bonggwon Kang',
  nameKo: '강봉권',
  title: 'Principal Investigator',
  role: 'Assistant Professor',
  affiliation: 'Dept. of Industrial Engineering\nKumoh National Institute of Technology',
  email: 'bonggwon.kang@kumoh.ac.kr',
  photo: null, // 사진 경로: '/professor.jpg' (public 폴더에 저장)
  interests: ['Simulation-based Optimization', 'Digital Twin', 'Bayesian Calibration', 'AMHS'],
}

const students = [
  // 예시 — 실제 이름과 역할로 교체하세요
  { name: '홍길동', nameEn: 'Gildong Hong', degree: 'Ph.D. Student', research: 'AMHS Optimization', photo: null },
  { name: '김연구', nameEn: 'Yeongu Kim',   degree: 'M.S. Student',  research: 'Bayesian Calibration', photo: null },
  { name: '이모델', nameEn: 'Model Lee',    degree: 'M.S. Student',  research: 'System Modeling', photo: null },
  // 구성원을 아래에 계속 추가하세요:
  // { name: '이름', nameEn: 'English Name', degree: 'Ph.D. / M.S. Student', research: '연구주제', photo: null },
]

const alumni = [
  // { name: '졸업자', nameEn: 'Graduate', degree: 'M.S. 2023', current: '현재 소속' },
]

function Avatar({ photo, name, size = 'lg' }) {
  const sz = size === 'lg' ? 'w-24 h-24 text-2xl' : 'w-16 h-16 text-base'
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  if (photo) {
    return (
      <img src={photo} alt={name}
        className={`${sz} rounded-full object-cover ring-4 ring-white shadow-md`} />
    )
  }
  return (
    <div className={`${sz} rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center font-bold text-indigo-600 ring-4 ring-white shadow-md`}>
      {initials}
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
          <motion.p variants={fadeUp} className="text-gray-400 text-lg max-w-2xl">
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
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2 variants={fadeUp}
              className="text-xs font-semibold text-indigo-600 tracking-[0.2em] uppercase mb-10">
              Principal Investigator
            </motion.h2>

            <motion.div variants={fadeUp}
              className="flex flex-col sm:flex-row gap-8 items-start bg-white rounded-2xl border border-gray-100 p-8 hover:shadow-xl hover:shadow-indigo-50 transition-all duration-300 max-w-2xl">
              <div className="flex-shrink-0">
                <Avatar photo={professor.photo} name={professor.nameEn} size="lg" />
              </div>
              <div>
                <div className="flex items-baseline gap-3 flex-wrap mb-1">
                  <h3 className="text-xl font-bold text-gray-900">{professor.name}</h3>
                  <span className="text-gray-400 text-sm">{professor.nameKo}</span>
                </div>
                <p className="text-indigo-600 font-medium text-sm mb-1">{professor.role}</p>
                <p className="text-gray-500 text-sm whitespace-pre-line mb-4">{professor.affiliation}</p>
                <a href={`mailto:${professor.email}`}
                  className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition-colors mb-4">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {professor.email}
                </a>
                <div className="flex flex-wrap gap-2">
                  {professor.interests.map(i => (
                    <span key={i} className="px-2.5 py-1 bg-indigo-50 text-indigo-600 text-xs font-medium rounded-lg border border-indigo-100">
                      {i}
                    </span>
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
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
          >
            <motion.h2 variants={fadeUp}
              className="text-xs font-semibold text-teal-600 tracking-[0.2em] uppercase mb-10">
              Graduate Students
            </motion.h2>

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
                    <p className="text-xs text-gray-500 mt-2">{s.research}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Alumni */}
      {alumni.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
            >
              <motion.h2 variants={fadeUp}
                className="text-xs font-semibold text-violet-600 tracking-[0.2em] uppercase mb-10">
                Alumni
              </motion.h2>
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
