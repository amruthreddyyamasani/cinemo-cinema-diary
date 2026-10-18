import { useEffect, useRef, useState } from 'react'

type Props = { onEnter: () => void }

export default function CinematicEntry({ onEnter }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const [progress, setProgress] = useState(0)
  const [videoFailed, setVideoFailed] = useState(false)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncMotion = () => setReduced(media.matches)
    syncMotion()
    media.addEventListener?.('change', syncMotion)
    return () => media.removeEventListener?.('change', syncMotion)
  }, [])

  useEffect(() => {
    if (reduced) return
    let frame = 0
    const update = () => {
      frame = 0
      const node = sectionRef.current
      if (!node) return
      const rect = node.getBoundingClientRect()
      const travel = Math.max(1, node.offsetHeight - window.innerHeight)
      setProgress(Math.min(1, Math.max(0, -rect.top / travel)))
    }
    const onScroll = () => { if (!frame) frame = window.requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { window.cancelAnimationFrame(frame); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll) }
  }, [reduced])

  const motionProgress = reduced ? 1 : progress
  const scale = 1 + motionProgress * 4.2
  const overlayOpacity = Math.max(0, (motionProgress - .42) / .58)
  const copyOpacity = Math.max(0, 1 - motionProgress * 2.8)

  return <section ref={sectionRef} className={`cinematic-entry ${reduced ? 'cinematic-entry-static' : ''}`} aria-label="Cinemo cinematic entry">
    <div className="cinematic-sticky">
      <div className="cinematic-frame" style={{ transform: `scale(${scale})`, transformOrigin: '50% 62%' }}>
        {!videoFailed && !reduced && <video className="cinematic-video" autoPlay loop muted playsInline preload="metadata" poster="/media/cinemo-hero-a-poster.jpg" onError={() => setVideoFailed(true)}>
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4" type="video/mp4" />
        </video>}
        <div className="cinematic-poster" aria-hidden="true" />
        <div className="cinematic-grade" />
      </div>
      <div className="cinematic-copy" style={{ opacity: copyOpacity }}>
        <span className="kicker bronze">CINEMO / A PERSONAL CINEMA DIARY</span>
        <h1>Step into the<br /><i>screening room.</i></h1>
        <p>Every film you keep changes the shape of the next one.</p>
        <button className="primary cinematic-enter" onClick={onEnter}>Enter Cinemo <span aria-hidden="true">→</span></button>
        <span className="scroll-cue"><span />Scroll to enter</span>
      </div>
      <div className="cinematic-bridge" style={{ opacity: overlayOpacity, pointerEvents: overlayOpacity > .5 ? 'auto' : 'none', transform: `translateY(${(1 - overlayOpacity) * 24}px)` }} aria-hidden={overlayOpacity < .5}>
        <div className="bridge-top"><span className="ticket-mark" /> <span className="mono">NOW SHOWING / YOUR NEXT FILM</span></div>
        <div className="bridge-posters"><img src="https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg" alt="" /><img src="https://image.tmdb.org/t/p/w500/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg" alt="" /><img src="https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg" alt="" /></div>
        <button className="primary" onClick={onEnter}>Enter Cinemo <span aria-hidden="true">→</span></button>
      </div>
      <div className="cinematic-status"><span className="mono">SCROLL LINKED ENTRY</span><span className="status-line"><i style={{ width: `${Math.round(motionProgress * 100)}%` }} /></span><span className="mono">{String(Math.round(motionProgress * 100)).padStart(3, '0')}%</span></div>
    </div>
  </section>
}
