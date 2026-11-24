import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }

// Newest first; numbering counts down from the top.
const projects = [
  {
    title: '스마트 생산물류시스템 디지털트윈 위한 동시 보정·최적화 연구',
    role: '참여연구자',
    sponsor: '한국연구재단',
    period: '2026.03.01 – 2028.02.29',
  },
  {
    title: '스마트 저장물류시스템을 위한 인공지능형 시뮬레이션 최적화 연구',
    role: '연구책임자',
    sponsor: '한국연구재단',
    period: '2024.09.01 – 2027.02.28',
  },
  {
    title: '물류시스템 지능화를 위한 운영 알고리즘 개발',
    role: '참여연구자',
    sponsor: '삼성디스플레이',
    period: '2023.03.01 – 2025.08.31',
  },
  {
    title: '컨테이너 랜덤 적재 기반 자동화 항만 터미널의 통합 야드 운영전략 연구',
    role: '참여연구자',
    sponsor: '한국연구재단',
    period: '2022.09.01 – 2024.08.31',
  },
  {
    title: '영상기반 데이터 활용한 라인밸런싱 시뮬레이션 프로토타입 연구',
    role: '참여연구자',
    sponsor: '현대건설기계',
    period: '2019.09.01 – 2019.12.31',
  },
  {
    title: '전략주도 터미널운영시스템(TOS)을 위한 정책모델 연구 사업',
    role: '참여연구자',
    sponsor: '한국연구재단',
    period: '2018.03.01 – 2020.11.30',
  },
]

// Newest first; date is the registration date if registered, otherwise the filing date.
const patents = [
  {
    title: 'Operation Plan Derivation System and Operation Plan Derivation Method',
    status: '출원',
    country: '미국, 중국',
    date: '2025.03.31',
  },
  {
    title: '차량 운영정책 도출 방법 및 장치',
    status: '등록',
    country: '대한민국',
    date: '2025.02.13',
  },
  {
    title: '항만 터미널 야드 템플릿 결정 방법 및 장치',
    status: '출원',
    country: '대한민국',
    date: '2025.01.21',
  },
  {
    title: '가중치 기반 컨테이너 저장소 운영방안 도출 방법 및 장치',
    status: '출원',
    country: '대한민국',
    date: '2025.01.02',
  },
  {
    title: '크레인의 핸드셰이크 영역 산출 방법 및 장치',
    status: '출원',
    country: '대한민국',
    date: '2024.02.05',
  },
]

function Entry({ label, item, details }) {
  return (
    <motion.div variants={fadeUp}>
      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed pl-8">
        <span className="text-gray-900 dark:text-white font-mono -ml-8">[{label}] </span>
        <span className="text-gray-900 dark:text-white font-medium">{item.title}</span>
        <span className="text-gray-500 dark:text-gray-400">, {details.join(', ')}</span>
      </p>
    </motion.div>
  )
}

function PageHeader() {
  return (
    <section className="pt-24 pb-10 bg-white dark:bg-gray-950 relative overflow-hidden">
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
            className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tight leading-[1.05] mb-5">
            Projects
          </motion.h1>
        </motion.div>
      </div>
    </section>
  )
}

export default function ProjectsPage() {
  return (
    <>
      <PageHeader />

      <section className="py-10 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-10">

            {/* Research Projects */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={stagger}>
              <motion.div variants={fadeUp}
                className="flex items-center gap-4 mb-8 pb-4 border-b text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/40">
                <h2 className="text-xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">Research Projects</h2>
              </motion.div>
              <div className="space-y-5">
                {projects.map((item, i) => (
                  <Entry key={i} label={`P${projects.length - i}`} item={item} details={[item.sponsor, item.role, item.period]} />
                ))}
              </div>
            </motion.div>

            {/* Patents */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={stagger}>
              <motion.div variants={fadeUp}
                className="flex items-center gap-4 mb-8 pb-4 border-b text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/40">
                <h2 className="text-xl font-bold tracking-tight text-blue-600 dark:text-blue-400">Patents</h2>
              </motion.div>
              <div className="space-y-5">
                {patents.map((item, i) => (
                  <Entry key={i} label={`T${patents.length - i}`} item={item} details={[item.country, item.status, item.date]} />
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </section>
    </>
  )
}
