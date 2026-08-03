import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }

const base = import.meta.env.BASE_URL

const internationalJournals = [
  {
    authors: 'B. Kang, T. Lee, Z. Sun, S. Hong',
    title: 'Uncertainty-aware simulation optimization for yard template planning in transshipment hubs',
    journal: 'International Journal of Production Research',
    year: '2026',
    doi: 'https://doi.org/10.1080/00207543.2026.2696434',
    pdf: `${base}publications/kang-2026-yard-template-planning.pdf`,
  },
  {
    authors: 'C. Park, R. Waelder, B. Kang, B. Maruyama, S. Hong, R.B. Gramacy',
    title: 'Active learning of piecewise Gaussian process surrogates',
    journal: 'Technometrics',
    volume: '68(1)',
    pages: '186-201',
    year: '2026',
    doi: 'https://www.tandfonline.com/doi/full/10.1080/00401706.2025.2561746',
    pdf: `${base}publications/park-2025-piecewise-gp.pdf`,
  },
  {
    authors: 'B. Kang, C. Park, H. Kim, S. Hong',
    title: 'A digital twin calibration for an automated material handling system in a semiconductor fab',
    journal: 'Journal of Manufacturing Systems',
    volume: '80',
    pages: '1013-1028',
    year: '2025',
    doi: 'https://www.sciencedirect.com/science/article/pii/S0278612525001049',
    pdf: `${base}publications/kang-2025-digital-twin-calibration.pdf`,
  },
  {
    authors: 'B. Kang, C. Park, H. Kim, S. Hong',
    title: 'Bayesian optimization for the vehicle dwelling policy in a semiconductor wafer fab',
    journal: 'IEEE Transactions on Automation Science and Engineering',
    volume: '21(4)',
    pages: '5942-5952',
    year: '2024',
    doi: 'https://ieeexplore.ieee.org/document/10278155',
    pdf: `${base}publications/kang-2024-bayesian-optimization.pdf`,
  },
  {
    authors: 'B. Kang, B. Kim, S. Hong',
    title: 'Simulation optimization of collaborative handshake operations for twin overhead shuttle cranes in a rail-based automated container terminal under demand uncertainty',
    journal: 'IEEE Access',
    volume: '11',
    pages: '113437-113449',
    year: '2023',
    doi: 'https://ieeexplore.ieee.org/document/10285297',
    pdf: `${base}publications/kang-2023-twin-cranes.pdf`,
  },
  {
    authors: 'H.Y. Fibrianto*, B. Kang*, S. Hong',
    title: 'A job sequencing problem of an overhead shuttle crane in a rail-based automated container terminal',
    journal: 'IEEE Access',
    volume: '8',
    pages: '156362-156377',
    year: '2020',
    coNote: '*co-first authors',
    doi: 'https://ieeexplore.ieee.org/abstract/document/9174991',
    pdf: `${base}publications/fibrianto-2020-job-sequencing.pdf`,
  },
]

const koreanJournals = [
  {
    authors: 'J. Kim, W. Choo, B. Kang*, S. Hong',
    title: 'Surrogate-based decision-making procedure for yard template planning in a container terminal: A comparative study of surrogate models',
    journal: 'Journal of the Korea Society for Simulation',
    volume: '34(1)',
    pages: '1-12',
    year: '2025',
    doi: 'https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART003192378',
  },
  {
    authors: 'J. Choi, J. Lee, B. Kang*, S. Hong',
    title: 'A simulation study of the vehicle repositioning policy with the minimum and maximum service levels in a demand responsive transit system',
    journal: 'Journal of the Korean Society of Supply Chain Management',
    volume: '24(3)',
    pages: '13-23',
    year: '2024',
    doi: 'https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART003152808',
  },
  {
    authors: 'H. Yoon, G. Han, B. Kang, S. Hong',
    title: 'A simulation-based optimization for scheduling in a fab: a comparative study on different sampling methods',
    journal: 'Journal of the Korea Society for Simulation',
    volume: '32(3)',
    pages: '67-74',
    year: '2023',
    doi: 'https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART003004230',
  },
  {
    authors: 'B. Kang, B.M. Kang, S. Hong',
    title: 'A dynamic OHT routing algorithm in automated material handling systems',
    journal: 'Journal of Korean Society of Industrial and Systems Engineering',
    volume: '45(3)',
    pages: '40-48',
    year: '2022',
    doi: 'https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART002881508',
  },
  {
    authors: 'G. Han, B. Kang, H. Kim, S. Hong',
    title: 'A GA-based optimization of a weighted lot targeting rule in a semiconductor wafer fab',
    journal: 'Journal of the Korean Institute of Industrial Engineers',
    volume: '48(5)',
    pages: '477-485',
    year: '2022',
    doi: 'https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART002887365',
  },
  {
    authors: 'G.H. Lee, G. Han, B. Kang, S.H. Lee, S. Hong',
    title: 'A simulation-based genetic algorithm for a dispatching rule in a flexible flow shop with rework process',
    journal: 'The Korea Journal of Bigdata',
    volume: '7(1)',
    pages: '99-111',
    year: '2022',
    doi: 'https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART002855661',
  },
  {
    authors: 'H. Kim, T. Lee, B. Kang, J. Lee, S. Hong',
    title: 'A study of a video-based simulation input modeling procedure in a construction equipment assembly line',
    journal: 'The Korea Journal of Bigdata',
    volume: '7(1)',
    pages: '75-87',
    year: '2022',
    doi: 'https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART002855671',
  },
]

function highlightKang(text, color) {
  const marker = 'B. Kang'
  const parts = text.split(marker)
  if (parts.length === 1) return <span className="text-gray-500 dark:text-gray-400">{text}</span>
  return (
    <span className="text-gray-500 dark:text-gray-400">
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && (
            <span className={`${color} font-semibold`}>B. Kang</span>
          )}
        </span>
      ))}
    </span>
  )
}

function SectionHeader({ label, color = 'indigo' }) {
  const styles = {
    indigo: 'text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/40',
    blue:   'text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/40',
  }
  const cls = styles[color] || styles.indigo
  return (
    <motion.div variants={fadeUp} className={`flex items-center gap-4 mb-8 pb-4 border-b ${cls}`}>
      <h2 className={`text-xl font-bold tracking-tight ${cls.split(' ').slice(0, 2).join(' ')}`}>{label}</h2>
    </motion.div>
  )
}

function PdfIcon() {
  return (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  )
}

function LinkIcon() {
  return (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  )
}

const pillStyle = {
  indigo: 'bg-indigo-500 dark:bg-indigo-600 border-indigo-500 dark:border-indigo-600',
  blue:   'bg-blue-500 dark:bg-blue-600 border-blue-500 dark:border-blue-600',
}

function JournalEntry({ num, item, journalColor = 'text-indigo-500 dark:text-indigo-300', pillColor = 'indigo' }) {
  const pill = pillStyle[pillColor] || pillStyle.indigo
  return (
    <motion.div variants={fadeUp}>
      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed pl-8">
        <span className="text-gray-900 dark:text-white font-mono -ml-8">[{num}] </span>
        {highlightKang(item.authors, journalColor)}
        <span className="text-gray-500 dark:text-gray-400">, </span>
        <span className="text-gray-900 dark:text-white font-medium">"{item.title}"</span>
        <span className="text-gray-500 dark:text-gray-400">, </span>
        <em className={journalColor}>{item.journal}</em>
        {item.volume && <span className="text-gray-500 dark:text-gray-400">, {item.volume}</span>}
        {item.pages && <span className="text-gray-500 dark:text-gray-400">, {item.pages}</span>}
        <span className="text-gray-500 dark:text-gray-400">, {item.year}</span>
        {item.note && <span className="text-gray-500 italic"> ({item.note})</span>}
        <span className="text-gray-500 dark:text-gray-400">.</span>
        {item.coNote && <span className="text-gray-500 italic"> {item.coNote}</span>}
        {item.pdf && (
          <>
            {' '}
            <a href={item.pdf} target="_blank" rel="noreferrer"
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium align-middle border text-white hover:opacity-80 transition-opacity ${pill}`}>
              <PdfIcon /> PDF
            </a>
          </>
        )}
        {item.doi && (
          <>
            {' '}
            <a href={item.doi} target="_blank" rel="noreferrer"
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium align-middle border text-white hover:opacity-80 transition-opacity ${pill}`}>
              <LinkIcon /> DOI
            </a>
          </>
        )}
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
            Publications
          </motion.h1>
        </motion.div>
      </div>
    </section>
  )
}

export default function PublicationsPage() {
  return (
    <>
      <PageHeader />

      <section className="py-10 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-10">

            {/* International Journals */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={stagger}>
              <SectionHeader label="International Journals" color="indigo" />
              <div className="space-y-5">
                {internationalJournals.map((item, i) => (
                  <JournalEntry key={i} num={i + 1} item={item} journalColor="text-indigo-500 dark:text-indigo-300" pillColor="indigo" />
                ))}
              </div>
            </motion.div>

            {/* Korean Journals */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={stagger}>
              <SectionHeader label="Korean Journals" color="blue" />
              <div className="space-y-5">
                {koreanJournals.map((item, i) => (
                  <JournalEntry key={i} num={i + 1} item={item} journalColor="text-blue-500 dark:text-blue-300" pillColor="blue" />
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </section>
    </>
  )
}
