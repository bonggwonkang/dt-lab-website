import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import ResearchPage from './pages/ResearchPage'
import NewsPage from './pages/NewsPage'
import MembersPage from './pages/MembersPage'
import ProfessorPage from './pages/ProfessorPage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/research" element={<ResearchPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/members" element={<MembersPage />} />
            <Route path="/professor" element={<ProfessorPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  )
}
