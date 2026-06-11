import { Link } from 'react-router-dom'

const links = [
  { name: 'Home', path: '/' },
  { name: 'Research', path: '/research' },
  { name: 'News', path: '/news' },
  { name: 'Members', path: '/members' },
  { name: 'Professor', path: '/professor' },
]

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-black text-white text-sm">
                DT
              </div>
              <span className="font-bold text-lg text-white tracking-tight">
                Lab<span className="text-indigo-400">.</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Digital Transformation Laboratory<br />
              Kumoh National Institute of Technology
            </p>
            <p className="text-xs text-gray-600 mt-3">
              경북 구미시 대학로 61 (산동면)<br />
              금오공과대학교 디지털전환연구실
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-widest">Navigation</h4>
            <ul className="space-y-2">
              {links.map(link => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-indigo-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-widest">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="mailto:bonggwon.kang@kumoh.ac.kr"
                  className="text-gray-400 hover:text-indigo-400 transition-colors"
                >
                  bonggwon.kang@kumoh.ac.kr
                </a>
              </li>
              <li className="text-gray-600 text-xs mt-4">
                Research collaboration & inquiries welcome.
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} Digital Transformation Lab. Kumoh National Institute of Technology.
          </p>
          <p className="text-xs text-gray-700">
            Modeling · Analyzing · Optimizing · Calibrating
          </p>
        </div>
      </div>
    </footer>
  )
}
