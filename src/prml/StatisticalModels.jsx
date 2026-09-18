import { useEffect, useMemo, useRef } from 'react'
import { MODULES } from './modules.js'
import { setRoot, tex } from './core.js'
import './prml.css'

const base = import.meta.env.BASE_URL

/* the contents list, grouped exactly as the lecture slides are */
function groups() {
  const out = []
  MODULES.forEach((m, i) => {
    if (!out.length || out[out.length - 1].sec !== m.sec) out.push({ sec: m.sec, items: [] })
    out[out.length - 1].items.push({ m, i })
  })
  return out
}

export default function StatisticalModels({ slide, onSlide }) {
  const rootRef = useRef(null)
  const stageRef = useRef(null)
  const secs = useMemo(groups, [])

  const index = useMemo(() => {
    const k = MODULES.findIndex(m => m.p === slide && m.ready)
    return k < 0 ? 0 : k
  }, [slide])

  /* every module is plain DOM: clear the stage and let the builder draw into it */
  useEffect(() => {
    const host = stageRef.current
    if (!host) return
    setRoot(rootRef.current)
    const m = MODULES[index]
    host.innerHTML = ''
    const head = document.createElement('div')
    head.className = 'mhead rise'
    head.innerHTML =
      '<div class="mtop"><span class="chip">Slide p.' + m.p + '</span>' +
      '<span class="msec">' + m.sec + '</span></div>' +
      '<h2 class="mtitle">' + m.t + '</h2><p class="mgoal">' + m.g + '</p>'
    host.appendChild(head)
    const body = document.createElement('div')
    body.style.cssText = 'display:flex;flex-direction:column;gap:20px'
    host.appendChild(body)
    m.b(body)
    tex(host)
    return () => { host.innerHTML = '' }
  }, [index])

  return (
    <>
      <div className="prml" ref={rootRef}>
        <aside className="side">
          {secs.map(g => (
            <div className="sgroup" key={g.sec}>
              <h3>{g.sec}</h3>
              <div className="slist">
                {g.items.map(({ m, i }) => (
                  <button key={m.p} type="button"
                    className={`nvi ${m.no % 2 ? 'odd' : 'even'}`}
                    aria-current={i === index ? 'true' : 'false'}
                    disabled={!m.ready}
                    onClick={() => onSlide(m.p)}>
                    <span className="no">[{m.no}]</span>
                    <span className="tt"><span className="pg">Slide {m.p}</span>{m.t}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </aside>
        <div className="stage" ref={stageRef} />
      </div>

      <div className="prml-credit">
        <div className="logos">
          <img src={`${base}images/dt-lab-logo.png`} alt="Digital Transformation Laboratory" />
          <span className="div" />
          <img src={`${base}images/kit-logo.png`} alt="Kumoh National Institute of Technology" />
        </div>
        <p>
          Course material for Pattern Recognition and Machine Learning, Department of Industrial
          Engineering, Kumoh National Institute of Technology. Built for teaching, so please keep the
          attribution when you reuse it.
        </p>
      </div>
    </>
  )
}
