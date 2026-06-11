import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { name: 'Home',      path: '/'          },
  { name: 'Research',  path: '/research'  },
  { name: 'News',      path: '/news'      },
  { name: 'Book',      path: '/book'      },
  { name: 'Members',   path: '/members'   },
  { name: 'Professor', path: '/professor' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMenuOpen(false), [location])

  const transparent = isHome && !scrolled

  return (
    <motion.nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        transparent
          ? 'bg-transparent'
          : 'bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100'
      }`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm transition-colors ${
              transparent ? 'bg-white/20 text-white' : 'bg-indigo-600 text-white'
            }`}>DT</div>
            <span className={`font-bold text-lg tracking-tight transition-colors ${
              transparent ? 'text-white' : 'text-gray-900'
            }`}>
              Lab<span className={transparent ? 'text-indigo-300' : 'text-indigo-600'}>.</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => {
              const active = location.pathname === link.path
              return (
                <Link key={link.path} to={link.path}
                  className={`relative px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                    active
                      ? transparent ? 'text-white' : 'text-indigo-600'
                      : transparent
                        ? 'text-white/70 hover:text-white hover:bg-white/10'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}>
                  {link.name}
                  {active && (
                    <motion.div layoutId="nav-indicator"
                      className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${
                        transparent ? 'bg-white' : 'bg-indigo-600'
                      }`} />
                  )}
                </Link>
              )
            })}
          </div>

          <button
            className={`md:hidden p-2 rounded-lg transition-colors ${
              transparent ? 'text-white hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            {navLinks.map(link => (
              <Link key={link.path} to={link.path}
                className={`block px-6 py-3.5 text-sm font-medium border-l-2 transition-colors ${
                  location.pathname === link.path
                    ? 'text-indigo-600 border-indigo-600 bg-indigo-50'
                    : 'text-gray-700 border-transparent hover:bg-gray-50'
                }`}>
                {link.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
