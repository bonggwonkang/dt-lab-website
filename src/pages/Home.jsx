import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }

function Hero() {
  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-gray-950">
      <div className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: 'linear-gradient(to right, #6366f1 1px, transparent 1px), linear-gradient(to bottom, #6366f1 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full">
        <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-4xl">
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-8">
            <span className="h-px w-10 bg-indigo-500" />
            <span className="text-indigo-400 text-xs font-semibold tracking-[0.2em] uppercase">
              Kumoh National Institute of Technology
            </span>
          </motion.div>

          <motion.h1 variants={fadeUp}
            className="text-5xl md:text-7xl font-black text-white leading-[1.05] mb-6 tracking-tight">
            Welcome to the<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-teal-400">
              Digital Transformation
            </span><br />
            Lab!
          </motion.h1>

          <motion.p variants={fadeUp}
            className="text-lg md:text-xl text-gray-300 max-w-2xl leading-relaxed mb-10">
            At the Digital Transformation Lab, we develop advanced methodologies for{' '}
            <span className="text-white font-medium">modeling, analyzing, optimizing,</span> and{' '}
            <span className="text-white font-medium">calibrating</span>{' '}
            large-scale production and material handling systems.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
            <Link to="/research"
              className="inline-flex items-center px-7 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-900/40">
              Explore Research
            </Link>
            <Link to="/professor"
              className="inline-flex items-center px-7 py-3.5 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl border border-white/15 transition-colors">
              Principal Investigator
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-900 to-transparent" />
    </section>
  )
}

function Contact() {
  return (
    <section className="py-20 bg-gradient-to-br from-indigo-600 via-indigo-700 to-teal-700 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="relative max-w-3xl mx-auto px-4 text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold text-white mb-4">
            Join the Digital Transformation Lab!
          </motion.h2>
          <motion.p variants={fadeUp} className="text-indigo-100 text-base mb-8 max-w-lg mx-auto">
            The Digital Transformation Lab welcomes highly motivated students who are interested in our research areas.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4">
            <a href="mailto:kbk@kumoh.ac.kr"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition-colors shadow-xl shadow-indigo-900/30">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact Us
            </a>
            <Link to="/members"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/15 text-white font-bold rounded-xl border border-white/30 hover:bg-white/25 transition-colors">
              Meet the Team
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <Contact />
    </>
  )
}
