import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }

const base = import.meta.env.BASE_URL

const internationalJournals = [
  {
    authors: 'Kang, B., Lee, T., Sun, Z., & Hong, S.',
    title: 'Uncertainty-aware simulation optimization for yard template planning in transshipment hubs',
    journal: 'International Journal of Production Research',
    year: '2026',
    note: 'Accepted',
    doi: null,
    pdf: null,
  },
  {
    authors: 'Park, C., Kang, B., & others',
    title: 'Active Learning of Piecewise Gaussian Process Surrogates',
    journal: 'Technometrics',
    year: '2025',
    doi: 'https://www.tandfonline.com/doi/full/10.1080/00401706.2025.2561746',
    pdf: `${base}publications/park-2025-piecewise-gp.pdf`,
  },
  {
    authors: 'Kang, B., Kim, B., Park, C., & Hong, S.',
    title: 'A digital twin calibration for an automated material handling system in a semiconductor fab',
    journal: 'Journal of Manufacturing Systems',
    year: '2025',
    doi: 'https://www.sciencedirect.com/science/article/pii/S0278612525001049',
    pdf: `${base}publications/kang-2025-digital-twin-calibration.pdf`,
  },
  {
    authors: 'Kang, B., Park, J., & Hong, S.',
    title: 'Bayesian optimization for the vehicle dwelling policy in an automated material handling system',
    journal: 'IEEE Transactions on Automation Science and Engineering',
    year: '2024',
    doi: 'https://ieeexplore.ieee.org/document/10278155',
    pdf: `${base}publications/kang-2024-bayesian-optimization.pdf`,
  },
  {
    authors: 'Kang, B., Park, J., & Hong, S.',
    title: 'Simulation optimization of collaborative handshake operations for twin overhead shuttle cranes in a rail-based automated container terminal under demand uncertainty',
    journal: 'IEEE Access',
    year: '2023',
    doi: 'https://ieeexplore.ieee.org/document/10285297',
    pdf: `${base}publications/kang-2023-twin-cranes.pdf`,
  },
  {
    authors: 'Fibrianto, H. Y., Kang, B., Park, J., & Hong, S.',
    title: 'A job sequencing problem of an overhead shuttle crane in a rail-based automated container terminal',
    journal: 'IEEE Access',
    year: '2020',
    doi: 'https://ieeexplore.ieee.org/abstract/document/9174991',
    pdf: `${base}publications/fibrianto-2020-job-sequencing.pdf`,
  },
]

const koreanJournals = [
  {
    authors: 'Kang, B., & Hong, S.',
    title: 'A Comparative Study of Surrogate Models for Simulation-based Yard Template Planning in a Container Terminal',
    journal: 'Journal of the Korean Society of Supply Chain Management',
    year: '2025',
  },
  {
    authors: 'Kang, B., & Hong, S.',
    title: 'A Simulation Study of the Vehicle Repositioning Policy with the Minimum and Maximum Service Levels in a Demand Responsive Transit System',
    journal: 'Journal of the Korean Society of Supply Chain Management',
    year: '2024',
  },
  {
    authors: 'Kang, B., & Hong, S.',
    title: 'A Simulation-based Optimization for Scheduling in a Fab: Comparative Study on Different Sampling Methods',
    journal: 'Journal of the Korea Society for Simulation',
    year: '2023',
  },
  {
    authors: 'Kang, B., & Hong, S.',
    title: 'A GA-based Optimization of a Weighted Lot Targeting Rule in a Semiconductor Wafer Fab',
    journal: 'Journal of Korean Institute of Industrial Engineers',
    year: '2022',
    doi: 'https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART002887365',
  },
  {
    authors: 'Kang, B., & Hong, S.',
    title: 'A Dynamic OHT Routing Algorithm in Automated Material Handling Systems',
    journal: 'Journal of Korean Society of Industrial and Systems Engineering',
    year: '2022',
    doi: 'https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART002881508',
  },
  {
    authors: 'Kang, B., & Hong, S.',
    title: 'A Study of a Video-based Simulation Input Modeling Procedure in a Construction Equipment Assembly Line',
    journal: 'Korea Journal of BigData',
    year: '2022',
    doi: 'https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART002855671',
  },
  {
    authors: 'Kang, B., & Hong, S.',
    title: 'A Simulation-based Genetic Algorithm for a Dispatching Rule in a Flexible Flow Shop with Rework Process',
    journal: 'Korea Journal of BigData',
    year: '2022',
    doi: 'https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART002855661',
  },
]

const sectionColors = {
  indigo: { header: 'text-indigo-400 border-indigo-800/40', journal: 'text-indigo-300' },
  blue:   { header: 'text-blue-400 border-blue-800/40',     journal: 'text-blue-300'   },
}

function SectionHeader({ label, color = 'indigo' }) {
  const cls = sectionColors[color]?.header || sectionColors.indigo.header
  return (
    <motion.div variants={fadeUp} className={`flex items-center gap-4 mb-8 pb-3 border-b ${cls}`}>
      <h2 className={`text-xs font-bold tracking-[0.2em] uppercase ${cls.split(' ')[0]}`}>{label}</h2>
    </motion.div>
  )
}

function Authors({ str }) {
  if (!str.startsWith('Kang,')) return <span className="text-gray-400">{str}</span>
  const rest = str.slice('Kang, B.'.length)
  return (
    <span className="text-gray-400">
      <span className="text-green-400 font-semibold">Kang, B.</span>{rest}
    </span>
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

function JournalEntry({ num, item, journalColor = 'text-indigo-300' }) {
  return (
    <motion.div variants={fadeUp} className="flex gap-4">
      <span className="text-gray-600 text-sm font-mono w-6 shrink-0 pt-0.5 text-right">{num}.</span>
      <div className="flex-1">
        <p className="text-sm text-gray-300 leading-relaxed">
          <Authors str={item.authors} />
          {' '}
          <span className="text-white font-medium">"{item.title}"</span>
          {'. '}
          <em className={`${journalColor} not-italic`}>{item.journal}</em>
          {item.volume && <span className="text-gray-400">, {item.volume}</span>}
          {item.pages && <span className="text-gray-400">, pp. {item.pages}</span>}
          {', '}
          <span className="text-gray-400">{item.year}</span>
          {item.note && <span className="text-gray-500 italic"> ({item.note})</span>}
          {'.'}
        </p>
        <div className="flex gap-2 mt-1.5 flex-wrap">
          {item.pdf && (
            <a href={item.pdf} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-indigo-950/70 text-indigo-400 border border-indigo-800/50 hover:bg-indigo-900/70 hover:text-indigo-300 transition-colors">
              <PdfIcon /> PDF
            </a>
          )}
          {item.doi && (
            <a href={item.doi} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-gray-800/70 text-gray-400 border border-white/10 hover:text-gray-200 hover:border-white/20 transition-colors">
              <LinkIcon /> DOI
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}

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
            Publications
          </motion.h1>
          <motion.p variants={fadeUp} className="text-gray-400 text-lg max-w-2xl leading-relaxed">
            Peer-reviewed articles and other scholarly works.{' '}
            <span className="text-green-400 font-medium">Corresponding/first author</span> highlighted in green.
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}

export default function PublicationsPage() {
  return (
    <>
      <PageHeader />

      <section className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

          {/* International Journals */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={stagger}>
            <SectionHeader label="International Journals" color="indigo" />
            <div className="space-y-5">
              {internationalJournals.map((item, i) => (
                <JournalEntry key={i} num={internationalJournals.length - i} item={item} journalColor="text-indigo-300" />
              ))}
            </div>
          </motion.div>

          {/* Korean Journals */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={stagger}>
            <SectionHeader label="Korean Journals" color="blue" />
            <div className="space-y-5">
              {koreanJournals.map((item, i) => (
                <JournalEntry key={i} num={koreanJournals.length - i} item={item} journalColor="text-blue-300" />
              ))}
            </div>
          </motion.div>

        </div>
      </section>
    </>
  )
}
