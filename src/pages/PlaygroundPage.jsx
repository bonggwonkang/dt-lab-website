import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }

const base = import.meta.env.BASE_URL

const models = [
  { num: 1,  file: '1. Single machine-based flowline.mp4',
    title: 'Single machine-based flowline',
    desc: 'A single-machine flowline where parts move sequentially through one processing station' },
  { num: 2,  file: '2. Parallel machine-based flowline.mp4',
    title: 'Parallel machine-based flowline',
    desc: 'A parallel-machine flowline that balances workload across multiple stations for higher throughput' },
  { num: 3,  file: '3. Assembly Line.mp4',
    title: 'Assembly line',
    desc: 'An assembly line simulation modeling sequential station-to-station part assembly' },
  { num: 4,  file: '4. Conveyor-based flowline.mp4',
    title: 'Conveyor-based flowline',
    desc: 'A conveyor-based flowline transporting parts continuously between processing stations' },
  { num: 5,  file: '5. AGV-based conveyor line.mp4',
    title: 'AGV-based conveyor line',
    desc: 'An AGV-based conveyor line combining automated guided vehicles with conveyor transport' },
  { num: 6,  file: '6. Worker-based flowline.mp4',
    title: 'Worker-based flowline',
    desc: 'A worker-based flowline where human operators perform sequential processing tasks' },
  { num: 7,  file: '7. Network-based jobshop.mp4',
    title: 'Network-based jobshop',
    desc: 'A network-based job shop routing jobs through a flexible network of processing stations' },
  { num: 8,  file: '8. Worker-based jobshop.mp4',
    title: 'Worker-based jobshop',
    desc: 'A worker-based job shop where operators process jobs following varying routings' },
  { num: 9,  file: '9. AMR-based jobshop.mp4',
    title: 'AMR-based jobshop',
    desc: 'An AMR-based job shop using autonomous mobile robots for flexible material transport' },
  { num: 10, file: '10. Conveyor-based jobshop.mp4',
    title: 'Conveyor-based jobshop',
    desc: 'A conveyor-based job shop routing jobs through stations via conveyor transport' },
  { num: 11, file: '11. Pizza process simulator.mp4',
    title: 'Pizza process simulator',
    desc: 'A course material simulating a pizza-making process with four different layouts' },
]

const colorStyle = {
  odd:  { num: 'text-cyan-400',   hoverBorder: 'hover:border-cyan-500/40' },
  even: { num: 'text-violet-400', hoverBorder: 'hover:border-violet-500/40' },
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
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" animate="visible" variants={stagger}>
          <motion.h1 variants={fadeUp}
            className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tight leading-[1.05] mb-5">
            Playground
          </motion.h1>
          <motion.p variants={fadeUp} className="text-gray-600 dark:text-gray-200 text-lg max-w-2xl leading-relaxed">
            A collection of materials we build for fun while exploring different production layouts and material handling configurations for digtal twin systems.
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}

export default function PlaygroundPage() {
  return (
    <>
      <PageHeader />

      <section className="py-10 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {models.map(m => {
              const s = colorStyle[m.num % 2 === 1 ? 'odd' : 'even']
              return (
                <motion.div key={m.num} variants={fadeUp}
                  className={`rounded-2xl overflow-hidden bg-gray-950 ring-1 ring-gray-200 dark:ring-white/10 shadow-xl shadow-black/10 dark:shadow-black/40 border-2 border-transparent transition-colors duration-300 ${s.hoverBorder}`}>
                  <div className="aspect-video">
                    <video
                      className="w-full h-full object-contain"
                      controls
                      preload="metadata"
                      title={m.title}
                      src={`${base}playground/${m.file}`}
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`flex-shrink-0 text-sm font-mono font-bold ${s.num}`}>[{m.num}]</span>
                      <h3 className="font-bold text-white leading-snug">{m.title}</h3>
                    </div>
                    <p className="text-sm text-white leading-relaxed">{m.desc}</p>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>
    </>
  )
}
