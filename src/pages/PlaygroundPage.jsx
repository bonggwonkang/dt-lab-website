import { useState } from 'react'
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
    desc: 'A single-machine flowline where parts move sequentially from the input to the output' },
  { num: 2,  file: '2. Parallel machine-based flowline.mp4',
    title: 'Parallel machine-based flowline',
    desc: 'A parallel-machine flowline that balances workload across multiple stations for higher throughput' },
  { num: 3,  file: '3. Assembly Line.mp4',
    title: 'Assembly line',
    desc: 'An assembly line simulation modeling sequential station-to-station part assembly' },
  { num: 4,  file: '4. Conveyor-based flowline.mp4',
    title: 'Conveyor-based flowline',
    desc: 'A conveyor-based flowline transporting parts between the input, processing, and output stations' },
  { num: 5,  file: '5. AGV-based conveyor line.mp4',
    title: 'AGV-based flowline',
    desc: 'An AGV-based flowline supported by an automated guided vehicle along guided rails' },
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
  { num: 10, file: '10. Conveyor-based cellular line.mp4',
    title: 'Conveyor-based cellular line',
    desc: 'A conveyor-based cellular line connecting manufacturing cells via conveyor transport' },
  { num: 11, file: '11. AGV-based cellular line.mp4',
    title: 'AGV-based cellular line',
    desc: 'An AGV-based cellular line using automated guided vehicles to link manufacturing cells' },
  { num: 12, file: '12. Pizza process simulator.mp4',
    title: 'Pizza process simulator',
    desc: 'A course material simulating a pizza-making process with four different layouts' },
]

const statModels = [
  { num: 1, slide: 10,
    title: 'Setup: fitting a polynomial to a synthetic function (I)',
    desc: 'The target we want to learn, sin(2πx), against the observations we are actually given — controlled by the number of points N and the noise level σ' },
  { num: 2, slide: 11,
    title: 'Setup: fitting a polynomial to a synthetic function (II)',
    desc: 'Moving the coefficients w to see the polynomial y(x, w) respond, and why it is a linear function of the coefficients' },
  { num: 3, slide: 12,
    title: 'Prediction error function (I)',
    desc: 'How the sum-of-squares error E(w) changes with the choice of w, shown as displacement bars and as an error surface' },
]

const colorStyle = {
  odd:  { num: 'text-cyan-400',   hoverBorder: 'hover:border-cyan-500/40' },
  even: { num: 'text-violet-400', hoverBorder: 'hover:border-violet-500/40' },
}

const tabs = [
  { id: 'computer',    name: 'Computer models',    count: models.length },
  { id: 'statistical', name: 'Statistical models', count: statModels.length },
]

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
            A collection of materials we build for fun — computer models of production layouts and material
            handling configurations for digital twin systems, and statistical models behind the methods we teach.
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}

function ComputerModels() {
  return (
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
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
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
  )
}

function StatisticalModels() {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={stagger}
      className="flex flex-col gap-8"
    >
      <motion.a variants={fadeUp} href={`${base}prml/`} target="_blank" rel="noopener noreferrer"
        className="group rounded-2xl overflow-hidden bg-gray-950 ring-1 ring-gray-200 dark:ring-white/10 shadow-xl shadow-black/10 dark:shadow-black/40 border-2 border-transparent hover:border-indigo-500/40 transition-colors duration-300">
        <div className="relative p-8 md:p-10">
          <div className="absolute inset-0 opacity-[0.10]"
            style={{
              backgroundImage: 'linear-gradient(to right, #6366f1 1px, transparent 1px), linear-gradient(to bottom, #6366f1 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
          <div className="absolute -top-16 right-10 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative">
            <p className="text-xs font-semibold tracking-[0.14em] uppercase text-indigo-400 mb-3">
              Interactive simulators
            </p>
            <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-3">
              Pattern Recognition and Machine Learning
            </h3>
            <p className="text-white/80 max-w-3xl leading-relaxed">
              Move the sliders and watch how the equations of the introduction chapter actually behave — the
              synthetic function, the polynomial curve, the error function, and the Bayesian treatment that
              follows. Built as course material; nothing to install.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-5">
              <span className="text-sm font-semibold text-indigo-400 group-hover:text-indigo-300 transition-colors">
                Open the collection →
              </span>
              <span className="text-xs font-mono text-gray-400">3 of 16 simulators open</span>
            </div>
          </div>
        </div>
      </motion.a>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {statModels.map(m => {
          const s = colorStyle[m.num % 2 === 1 ? 'odd' : 'even']
          return (
            <motion.a key={m.num} variants={fadeUp}
              href={`${base}prml/#slide-${m.slide}`} target="_blank" rel="noopener noreferrer"
              className={`group flex flex-col rounded-2xl overflow-hidden bg-gray-950 ring-1 ring-gray-200 dark:ring-white/10 shadow-xl shadow-black/10 dark:shadow-black/40 border-2 border-transparent transition-colors duration-300 ${s.hoverBorder}`}>
              <div className="relative h-24 bg-gradient-to-br from-indigo-600/25 via-gray-950 to-teal-600/20 flex items-end px-6 pb-4">
                <div className="absolute inset-0 opacity-[0.12]"
                  style={{
                    backgroundImage: 'linear-gradient(to right, #6366f1 1px, transparent 1px), linear-gradient(to bottom, #6366f1 1px, transparent 1px)',
                    backgroundSize: '28px 28px',
                  }}
                />
                <span className="relative text-xs font-mono text-gray-300">Slide {m.slide}</span>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`flex-shrink-0 text-sm font-mono font-bold ${s.num}`}>[{m.num}]</span>
                  <h3 className="font-bold text-white leading-snug">{m.title}</h3>
                </div>
                <p className="text-sm text-white leading-relaxed flex-1">{m.desc}</p>
                <span className="mt-4 text-sm font-semibold text-indigo-400 group-hover:text-indigo-300 transition-colors">
                  Open simulator →
                </span>
              </div>
            </motion.a>
          )
        })}
      </div>

      <motion.p variants={fadeUp} className="text-sm text-gray-500 dark:text-gray-400">
        Thirteen more simulators — the RMS error, regularization, MLE-MAP, and the Bayesian predictive
        distribution — are in preparation.
      </motion.p>
    </motion.div>
  )
}

export default function PlaygroundPage() {
  const [tab, setTab] = useState('computer')

  return (
    <>
      <PageHeader />

      <section className="py-10 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 mb-8">
            {tabs.map(t => {
              const active = tab === t.id
              return (
                <button key={t.id} type="button" onClick={() => setTab(t.id)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                    active
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-white dark:bg-white/5 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/10 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10'
                  }`}>
                  {t.name}
                  <span className={`ml-2 text-xs font-mono ${active ? 'text-white/70' : 'text-gray-400 dark:text-gray-500'}`}>
                    {t.count}
                  </span>
                </button>
              )
            })}
          </div>

          {tab === 'computer' ? <ComputerModels /> : <StatisticalModels />}
        </div>
      </section>
    </>
  )
}
