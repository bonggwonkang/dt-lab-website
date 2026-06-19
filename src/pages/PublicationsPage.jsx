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
    year: '2025',
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

const bookChapters = [
  {
    authors: 'Kang, B., & Hong, S.',
    title: 'Sequential optimization of a temporary storage location for cooperative twin overhead shuttles in a rail-based automated container terminal',
    venue: 'Smart Manufacturing and Logistics Systems: Turning Ideas into Action',
    publisher: 'Springer',
    year: '2022',
    doi: 'https://link.springer.com/chapter/10.1007/978-3-031-16407-1_34',
  },
  {
    authors: 'Kang, B., Joatiko, P. V. E., Park, J., & Hong, S.',
    title: 'Yard Template Planning in a Transshipment Hub: Gaussian Process Regression',
    venue: '2022 Winter Simulation Conference',
    publisher: 'IEEE',
    year: '2022',
    doi: 'https://ieeexplore.ieee.org/abstract/document/10015251',
  },
  {
    authors: 'Kang, B., & Hong, S.',
    title: 'A Simulation Study of a Storage Policy for a Container Terminal',
    venue: 'Dynamics in Logistics',
    publisher: 'Springer',
    year: '2020',
    doi: 'https://link.springer.com/chapter/10.1007/978-3-030-44783-0_6',
  },
]

const intlConferences = [
  {
    authors: 'Kang, B.',
    title: 'Modular Calibration of a Digital Twin Model for Planning-Level Decision-Making in a Semiconductor Fab\'s AMHS',
    venue: '2024 INFORMS Annual Meeting',
    location: 'Seattle, WA, USA',
    year: '2024',
  },
  {
    authors: 'Kang, B.',
    title: 'A case study of data-driven yard template planning with feature engineering',
    venue: '11th International Conference on Logistics and Maritime Systems (LOGMS)',
    location: 'Busan, Korea',
    year: '2023',
  },
  {
    authors: 'Kang, B.',
    title: 'Surrogate model-based simulation optimization of vehicle positioning strategy in a semiconductor fab',
    venue: '2023 INFORMS Annual Meeting',
    location: 'Phoenix, AZ, USA',
    year: '2023',
  },
]

const koreanConferences = [
  {
    authors: 'Kang, B.',
    title: 'Bias-aware simulation calibration for an automated material handling system in a semiconductor fab',
    venue: '2025 Spring KIIE Conference',
    location: 'Seoul, Korea',
    year: '2025',
  },
  {
    authors: 'Kang, B.',
    title: 'Discrete-event Simulation Calibration for a Large-scale Material Handling System: A Case Study of a Semiconductor Fab',
    venue: '2024 Fall KIIE Conference',
    location: 'Seoul, Korea',
    year: '2024',
  },
  {
    authors: 'Kang, B.',
    title: 'Gaussian process-based yard template planning under vehicle congestion and container rehandling: a case study of Busan Port Terminal',
    venue: '2024 Spring KIIE Conference',
    location: 'Yeosu, Korea',
    year: '2024',
  },
  {
    authors: 'Kang, B.',
    title: 'Simulation-based optimization alternatives for large-scale material handling systems',
    venue: 'Semiconductor Smart Manufacturing Working Group, KIIE',
    location: 'Korea',
    year: '2023',
  },
  {
    authors: 'Kang, B.',
    title: 'Simulation-based decision making in large-scale simulations',
    venue: 'Grand PNU Performance Exchange Programme',
    location: 'Busan, Korea',
    year: '2023',
  },
]

const invitedTalks = [
  {
    authors: 'Kang, B.',
    title: 'Recent Research on Digital Twin Construction: A Perspective of Management Science',
    venue: 'Hanwha Ocean',
    location: 'Geoje, Korea',
    year: '2024',
  },
  {
    authors: 'Kang, B.',
    title: 'Simulation-based decision-making in large-scale material handling systems',
    venue: 'Smart Manufacturing Forum, SEMICON KOREA',
    location: 'Seoul, Korea',
    year: '2024',
    doi: 'https://www.semiconkorea.org/ko/node/9166',
  },
]

const misc = [
  {
    category: 'Funding',
    items: [
      'Korea Research Foundation Grant (\'24.09–\'27.08): "AI-integrated Simulation Optimization for Smart Storage/Retrieval Systems" — ₩180M as Principal Investigator.',
    ],
  },
  {
    category: 'Book',
    items: [
      'Kang, B. (2025). Production Logistics System: Simulation Modeling. Kyobo eBook.',
    ],
  },
  {
    category: 'Patent',
    items: [
      'Hong, S., & Kang, B. (2025). Method and Apparatus for Deriving Management Policy of Vehicles. Registered March 2025.',
    ],
  },
]

function SectionHeader({ label, color = 'indigo' }) {
  const colors = {
    indigo: 'text-indigo-400 border-indigo-800/40',
    teal:   'text-teal-400 border-teal-800/40',
    violet: 'text-violet-400 border-violet-800/40',
    amber:  'text-amber-400 border-amber-800/40',
    rose:   'text-rose-400 border-rose-800/40',
  }
  return (
    <motion.div variants={fadeUp} className={`flex items-center gap-4 mb-8 pb-3 border-b ${colors[color]}`}>
      <h2 className={`text-xs font-bold tracking-[0.2em] uppercase ${colors[color].split(' ')[0]}`}>{label}</h2>
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
      <polyline points="10 9 9 9 8 9" />
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

function JournalEntry({ num, item }) {
  return (
    <motion.div variants={fadeUp} className="flex gap-4 group">
      <span className="text-gray-600 text-sm font-mono w-6 shrink-0 pt-0.5 text-right">{num}.</span>
      <div className="flex-1">
        <p className="text-sm text-gray-300 leading-relaxed">
          <span className="text-gray-400">{item.authors}</span>
          {' '}
          <span className="text-white font-medium">"{item.title}"</span>
          {'. '}
          <em className="text-indigo-300 not-italic">{item.journal}</em>
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

function PaperEntry({ num, item }) {
  return (
    <motion.div variants={fadeUp} className="flex gap-4">
      <span className="text-gray-600 text-sm font-mono w-6 shrink-0 pt-0.5 text-right">{num}.</span>
      <div className="flex-1">
        <p className="text-sm text-gray-300 leading-relaxed">
          <span className="text-gray-400">{item.authors}</span>
          {' '}
          <span className="text-white font-medium">"{item.title}"</span>
          {'. '}
          <em className="text-teal-300 not-italic">{item.venue || item.journal}</em>
          {item.publisher && <span className="text-gray-400">, {item.publisher}</span>}
          {', '}
          <span className="text-gray-400">{item.year}</span>
          {'.'}
        </p>
        {item.doi && (
          <div className="mt-1.5">
            <a href={item.doi} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-gray-800/70 text-gray-400 border border-white/10 hover:text-gray-200 hover:border-white/20 transition-colors">
              <LinkIcon /> Link
            </a>
          </div>
        )}
      </div>
    </motion.div>
  )
}

function TalkEntry({ num, item }) {
  return (
    <motion.div variants={fadeUp} className="flex gap-4">
      <span className="text-gray-600 text-sm font-mono w-6 shrink-0 pt-0.5 text-right">{num}.</span>
      <div className="flex-1">
        <p className="text-sm text-gray-300 leading-relaxed">
          <span className="text-gray-400">{item.authors}</span>
          {' '}
          <span className="text-white font-medium">"{item.title}"</span>
          {'. '}
          <em className="text-violet-300 not-italic">{item.venue}</em>
          {', '}
          <span className="text-gray-400">{item.location}</span>
          {' ('}
          <span className="text-gray-400">{item.year}</span>
          {').'}
        </p>
        {item.doi && (
          <div className="mt-1.5">
            <a href={item.doi} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-gray-800/70 text-gray-400 border border-white/10 hover:text-gray-200 hover:border-white/20 transition-colors">
              <LinkIcon /> Link
            </a>
          </div>
        )}
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
            Peer-reviewed articles, conference papers, and other scholarly works.
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
                <JournalEntry key={i} num={internationalJournals.length - i} item={item} />
              ))}
            </div>
          </motion.div>

          {/* Korean Journals */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={stagger}>
            <SectionHeader label="Korean Journals" color="teal" />
            <div className="space-y-5">
              {koreanJournals.map((item, i) => (
                <PaperEntry key={i} num={koreanJournals.length - i} item={item} />
              ))}
            </div>
          </motion.div>

          {/* Book Chapters & Proceedings */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={stagger}>
            <SectionHeader label="Peer-reviewed Book Chapters & Conference Proceedings" color="amber" />
            <div className="space-y-5">
              {bookChapters.map((item, i) => (
                <PaperEntry key={i} num={bookChapters.length - i} item={item} />
              ))}
            </div>
          </motion.div>

          {/* International Conferences */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={stagger}>
            <SectionHeader label="Presentations at International Conferences" color="violet" />
            <div className="space-y-5">
              {intlConferences.map((item, i) => (
                <TalkEntry key={i} num={intlConferences.length - i} item={item} />
              ))}
            </div>
          </motion.div>

          {/* Korean Conferences */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={stagger}>
            <SectionHeader label="Presentations at Korean Conferences" color="teal" />
            <div className="space-y-5">
              {koreanConferences.map((item, i) => (
                <TalkEntry key={i} num={koreanConferences.length - i} item={item} />
              ))}
            </div>
          </motion.div>

          {/* Industry-Invited Talks */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={stagger}>
            <SectionHeader label="Industry-Invited Talks" color="rose" />
            <div className="space-y-5">
              {invitedTalks.map((item, i) => (
                <TalkEntry key={i} num={invitedTalks.length - i} item={item} />
              ))}
            </div>
          </motion.div>

          {/* Misc */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={stagger}>
            <SectionHeader label="Funding, Book & Patents" color="amber" />
            <div className="space-y-6">
              {misc.map(group => (
                <motion.div key={group.category} variants={fadeUp}>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">{group.category}</p>
                  <ul className="space-y-2">
                    {group.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </section>
    </>
  )
}
