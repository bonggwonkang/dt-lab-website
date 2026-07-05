import { motion } from 'framer-motion'
import { useLang } from '../LanguageContext'

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }

const topics = [
  {
    num: 'I',
    color: 'indigo',
    title: 'System Modeling & Analysis',
    titleKo: '시스템 모델링 및 분석',
    summary: 'High-fidelity simulation modeling and analysis for digital twin applications across complex industrial environments.',
    summaryKo: '복잡한 산업 환경에서 디지털 트윈 응용을 위한 고충실도 시뮬레이션 모델링 및 분석',
    details: [
      'Development of discrete-event simulation (DES) models that faithfully replicate production floor operations.',
      'Systematic bottleneck identification through workload analysis and sensitivity studies.',
      'Scenario-based analysis for facility design and layout optimization.',
    ],
    detailsKo: [
      '생산 현장 운영을 충실히 재현하는 이산 사건 시뮬레이션(DES) 모델 개발',
      '작업부하 분석 및 민감도 연구를 통한 체계적인 병목 지점 식별',
      '설비 설계 및 레이아웃 최적화를 위한 시나리오 기반 분석',
    ],
    keywords: ['Discrete-event simulation', 'Bottleneck analysis', 'Material handling operations'],
    keywordsKo: ['이산 사건 시뮬레이션', '병목 분석', '물류 시스템 운영'],
    video: { src: 'Small Size FAB Simulation.mp4', title: 'Automated material handling system in a semiconductor fab', titleKo: '반도체 팹 자동화 물류 시스템' },
  },
  {
    num: 'II',
    color: 'teal',
    title: 'Model Optimization',
    titleKo: '모델 최적화',
    summary: 'Simulation optimization for digital twin-based prescriptions in production and logistics systems.',
    summaryKo: '생산 및 물류 시스템에서 디지털 트윈 기반 의사결정을 위한 시뮬레이션 최적화',
    details: [
      'Tatical layout design under uncertain customer demands.',
      'Periodic operational planning and real-time control in fast evolving systems',
      'Surrogate-based optimization to reduce the cost of simulation experiments.',
    ],
    detailsKo: [
      '불확실한 고객 수요 하에서의 전술적 레이아웃 설계',
      '빠르게 변화하는 시스템에서의 주기적 운영 계획 및 실시간 제어',
      '시뮬레이션 실험 비용 절감을 위한 서로게이트 기반 최적화',
    ],
    keywords: ['Statistical surrogates', 'Simulation optimization', 'Design of experiments'],
    keywordsKo: ['통계적 서로게이트', '시뮬레이션 최적화', '실험 설계'],
    video: { src: '반도체생산시스템.mp4', title: 'Semiconductor production line simulation', titleKo: '반도체 생산 라인 시뮬레이션' },
  },
  {
    num: 'III',
    color: 'violet',
    title: 'Model Calibration',
    titleKo: '모델 캘리브레이션',
    summary: 'Bayesian calibration frameworks that align simulation models with real-world observations using limited data.',
    summaryKo: '제한된 데이터를 활용하여 시뮬레이션 모델을 실제 관측값과 일치시키는 베이지안 캘리브레이션 프레임워크',
    details: [
      'Identification and quantification of model discrepancy between simulation and physical systems.',
      'Bayesian inference framework for learning calibration parameters from sparse observations.',
      'Uncertainty quantification in model predictions to support reliable decision-making.',
    ],
    detailsKo: [
      '시뮬레이션과 물리적 시스템 간의 모델 불일치 식별 및 정량화',
      '희소 관측값으로부터 캘리브레이션 파라미터를 학습하는 베이지안 추론 프레임워크',
      '신뢰할 수 있는 의사결정을 지원하기 위한 모델 예측의 불확실성 정량화',
    ],
    keywords: ['Uncertainty quantification', 'Parameter estimation', 'Discrepancy modeling'],
    keywordsKo: ['불확실성 정량화', '파라미터 추정', '불일치 모델링'],
    video: { src: '[3D] FAB AMHS Animation 2.mp4', title: '3D automated material handling system in a semiconductor fab', titleKo: '반도체 팹 3D 자동화 물류 시스템' },
  },
]

const colorStyle = {
  indigo: { bar: 'bg-indigo-500', tag: 'bg-indigo-950/60 text-indigo-400 border-indigo-800/60', num: 'text-indigo-400' },
  teal:   { bar: 'bg-teal-500',   tag: 'bg-teal-950/60 text-teal-400 border-teal-800/60',       num: 'text-teal-400'   },
  violet: { bar: 'bg-violet-500', tag: 'bg-violet-950/60 text-violet-400 border-violet-800/60', num: 'text-violet-400' },
}

const ChipIcon = () => (
  <svg className="w-6 h-6 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="7" y="7" width="10" height="10" rx="1" />
    <path d="M9 7V4M12 7V4M15 7V4M9 17v3M12 17v3M15 17v3M7 9H4M7 12H4M7 15H4M17 9h3M17 12h3M17 15h3" />
  </svg>
)

const domains = [
  {
    title: 'Semiconductor & Display Fabs',
    titleKo: '반도체 및 디스플레이 팹',
    desc: 'Modeling and optimization of wafer fabrication processes and AMHS in semiconductor fabs.',
    descKo: '반도체 팹에서 웨이퍼 제조 공정 및 AMHS의 모델링과 최적화',
    icon: <ChipIcon />,
    video: { src: '[3D] FAB AMHS Animation 3.mp4', title: '3D Semiconductor Fab AMHS Simulation', titleKo: '반도체 팹 3D AMHS 시뮬레이션' },
  },
  {
    title: 'Distribution Centers',
    titleKo: '물류 센터',
    desc: 'Simulation-based design and operational analysis of automated warehouse and logistics systems.',
    descKo: '자동화 창고 및 물류 시스템의 시뮬레이션 기반 설계 및 운영 분석',
    icon: '📦',
    video: { src: '3D SVSRS.mp4', title: '3D Shuttle-based Storage and Retrieval System Simulation', titleKo: '3D 셔틀 기반 자동 창고 시스템 시뮬레이션' },
  },
  {
    title: 'Container Terminals',
    titleKo: '컨테이너 터미널',
    desc: 'Large-scale port terminal simulation for crane scheduling, vehicle routing, and yard management.',
    descKo: '크레인 스케줄링, 차량 경로 계획, 야드 관리를 위한 대규모 항만 터미널 시뮬레이션',
    icon: '🚢',
    video: { src: 'container terminal.mp4', title: 'Container Terminal Simulation', titleKo: '컨테이너 터미널 시뮬레이션' },
  },
]

function VideoPlayer({ src, title, colorBar = 'bg-indigo-500' }) {
  const base = import.meta.env.BASE_URL
  return (
    <div className="rounded-2xl overflow-hidden bg-gray-950 ring-1 ring-white/10 shadow-xl shadow-black/40">
      <div className="aspect-video">
        <video
          className="w-full h-full object-contain"
          controls
          preload="metadata"
          src={`${base}videos/${src}`}
        />
      </div>
      <div className="px-5 py-3.5 flex items-center gap-3 bg-gray-900/80">
        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${colorBar}`} />
        <span className="text-xs text-gray-400 font-medium">{title}</span>
      </div>
    </div>
  )
}

function PageHeader() {
  const { lang } = useLang()
  const ko = lang === 'ko'
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
            {ko ? '연구' : 'Research'}
          </motion.h1>
          <motion.p variants={fadeUp} className="text-gray-200 text-lg max-w-2xl leading-relaxed">
            {ko ? (
              <>
                저희 연구는{' '}
                <span className="text-indigo-400 font-medium">모델링</span>,{' '}
                <span className="text-teal-400 font-medium">최적화</span>, 그리고{' '}
                <span className="text-violet-400 font-medium">캘리브레이션</span>이라는{' '}
                세 가지 상호연결된 주제를 중심으로, 통계적 모델 기반의 디지털 전환을 추구합니다.
              </>
            ) : (
              <>
                Our work spans three interconnected themes,{' '}
                <span className="text-indigo-400 font-medium">modeling</span> complex systems,{' '}
                <span className="text-teal-400 font-medium">optimizing</span> their operations, and{' '}
                <span className="text-violet-400 font-medium">calibrating</span> their predictive accuracy,
                unified by a statistical model-based digital transformation.
              </>
            )}
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}

export default function ResearchPage() {
  const { lang } = useLang()
  const ko = lang === 'ko'
  return (
    <>
      <PageHeader />

      {/* Topics */}
      <section className="pt-24 pb-12 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-28">
            {topics.map((t, idx) => {
              const s = colorStyle[t.color]
              const isEven = idx % 2 === 0
              return (
                <motion.div
                  key={t.num}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-60px' }}
                  variants={stagger}
                  className="grid md:grid-cols-2 gap-12 items-center"
                >
                  {/* Text side */}
                  <motion.div variants={fadeUp} className={isEven ? '' : 'md:order-2'}>
                    <span className={`inline-block text-4xl font-black mb-3 ${s.num}`}>
                      Topic {t.num}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-snug">
                      {ko ? t.titleKo : t.title}
                    </h2>
                    <p className="text-gray-400 leading-relaxed mb-6">{ko ? t.summaryKo : t.summary}</p>
                    <ul className="space-y-3 mb-8">
                      {(ko ? t.detailsKo : t.details).map((d, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                          <span className={`mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full ${s.bar}`} />
                          {d}
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-2">
                      {(ko ? t.keywordsKo : t.keywords).map(k => (
                        <span key={k} className={`px-3 py-1 rounded-full text-xs font-medium border ${s.tag}`}>
                          {k}
                        </span>
                      ))}
                    </div>
                  </motion.div>

                  {/* Video side */}
                  <motion.div variants={fadeUp} className={isEven ? '' : 'md:order-1'}>
                    <VideoPlayer src={t.video.src} title={ko ? t.video.titleKo : t.video.title} colorBar={s.bar} />
                  </motion.div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Application Domains */}
      <section className="pt-12 pb-24 bg-gray-950">
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(to right, #6366f1 1px, transparent 1px), linear-gradient(to bottom, #6366f1 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                {ko ? '응용 분야' : 'Application Domains'}
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {domains.map(d => (
                <motion.div key={d.title} variants={fadeUp} className="flex flex-col gap-4">
                  <div className="bg-gray-800/50 rounded-2xl p-6 border border-white/10 hover:border-indigo-500/40 hover:bg-gray-800/80 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="flex-shrink-0 text-2xl leading-none">{d.icon}</span>
                      <h3 className="font-bold text-white leading-snug">{ko ? d.titleKo : d.title}</h3>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">{ko ? d.descKo : d.desc}</p>
                  </div>

                  {d.video ? (
                    <VideoPlayer src={d.video.src} title={ko ? d.video.titleKo : d.video.title} colorBar="bg-teal-500" />
                  ) : (
                    <div className="rounded-2xl overflow-hidden bg-gray-900 border border-white/10 border-dashed">
                      <div className="aspect-video flex flex-col items-center justify-center gap-2 p-6 text-center">
                        <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <p className="text-xs text-gray-600 leading-relaxed">{d.videoNote}</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
