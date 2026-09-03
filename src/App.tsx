import { useState, useEffect, useRef, useCallback } from "react"

/* ─── Types ─────────────────────────────────────────────── */
interface Artwork {
  id: number
  titleKo: string
  titleEn: string
  year: string
  medium: string
  url: string
  alt: string
}

/* ─── Data ───────────────────────────────────────────────── */
const artworks: Artwork[] = [
  {
    id: 1, titleKo: "달항아리에 노란들국화", titleEn: "Yellow Wild Chrysanthemums in a Moon Jar", year: "2026",
    medium: "Silk & Acrylic · 72.7*90.9cm",
    url: "source/pic_01.jpg",
    alt: "달항아리에 노란들국화",
  },
  {
    id: 2, titleKo: "달항아리에 보라들국화", titleEn: "Purple Wild Chrysanthemums in a Moon Jar", year: "2026",
    medium: "Silk & Acrylic · 72.7*90.9cm",
    url: "source/pic_02.jpg",
    alt: "달항아리에 보라들국화",
  },
  {
    id: 3, titleKo: "작약", titleEn: "Peony", year: "2026",
    medium: "Silk & Acrylic · 116.8*80.3cm",
    url: "source/pic_03.jpg",
    alt: "작약",
  },
  {
    id: 4, titleKo: "안개 낀 포도밭", titleEn: "Foggy Vineyard", year: "2026",
    medium: "Silk & Acrylic · 116.8*80.3cm",
    url: "source/pic_04.jpg",
    alt: "안개 낀 포도밭",
  },
  {
    id: 5, titleKo: "붉은 꽃 화병", titleEn: "Red Flower Vase", year: "2026",
    medium: "Silk & Acrylic · 72.7*90.9cm",
    url: "source/pic_05.jpg",
    alt: "붉은 꽃 화병",
  },
  {
    id: 6, titleKo: "푸른 꽃 화병", titleEn: "Blue Flower Vase", year: "2026",
    medium: "Silk & Acrylic · 72.7*90.9cm",
    url: "source/pic_06.jpg",
    alt: "푸른 꽃 화병",
  },
  {
    id: 7, titleKo: "벚꽃", titleEn: "Cherry Blossoms", year: "2025",
    medium: "Silk & Acrylic · 90.9*65.1cm",
    url: "source/pic_07.jpg",
    alt: "벚꽃",
  },
  {
    id: 8, titleKo: "파란나무", titleEn: "Blue Tree", year: "2024",
    medium: "Silk & Acrylic · 45.5*53cm",
    url: "source/pic_08.jpg",
    alt: "파란나무",
  },
  {
    id: 9, titleKo: "연과 달항아리", titleEn: "Lotus and Moon Jar", year: "2026",
    medium: "Silk & Acrylic · 45.5*45.5cm",
    url: "source/pic_09.jpg",
    alt: "연과 달항아리",
  },
  {
    id: 10, titleKo: "해바라기1", titleEn: "Sunflower 1", year: "2025",
    medium: "Silk & Acrylic · 45.5*53cm",
    url: "source/pic_10.jpg",
    alt: "해바라기1",
  },
]

/* ─── Floating Orb Hero Canvas ───────────────────────────── */
// Each orb: soft glowing circle that drifts with gentle sinusoidal motion
const ORB_PALETTE = [
  { h: 340, s: 28, l: 62 }, // dusty rose
  { h: 22,  s: 35, l: 60 }, // warm apricot
  { h: 200, s: 22, l: 58 }, // muted steel blue
  { h: 270, s: 20, l: 62 }, // soft lavender
  { h: 155, s: 18, l: 52 }, // sage green
  { h: 45,  s: 32, l: 60 }, // warm gold
]

function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()

    const orbs = Array.from({ length: 14 }, (_, i) => {
      const color = ORB_PALETTE[i % ORB_PALETTE.length]
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.14,
        vy: (Math.random() - 0.5) * 0.11,
        r: Math.random() * 130 + 60,
        innerOpacity: Math.random() * 0.13 + 0.07,
        color,
        phase: Math.random() * Math.PI * 2,
        waveAmp: Math.random() * 0.18 + 0.06,
        waveFreq: Math.random() * 0.003 + 0.001,
      }
    })

    let frame = 0
    let animId: number

    const draw = () => {
      frame++
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      orbs.forEach((o) => {
        o.x += o.vx + Math.sin(frame * o.waveFreq + o.phase) * o.waveAmp
        o.y += o.vy + Math.cos(frame * o.waveFreq * 0.8 + o.phase) * o.waveAmp * 0.7

        if (o.x < -o.r) o.x = canvas.width + o.r
        if (o.x > canvas.width + o.r) o.x = -o.r
        if (o.y < -o.r) o.y = canvas.height + o.r
        if (o.y > canvas.height + o.r) o.y = -o.r

        const { h, s, l } = o.color
        const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r)
        g.addColorStop(0,   `hsla(${h},${s}%,${l}%,${o.innerOpacity})`)
        g.addColorStop(0.4, `hsla(${h},${s}%,${l}%,${o.innerOpacity * 0.45})`)
        g.addColorStop(1,   `hsla(${h},${s}%,${l}%,0)`)

        ctx.beginPath()
        ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2)
        ctx.fillStyle = g
        ctx.fill()
      })

      animId = requestAnimationFrame(draw)
    }

    draw()

    const obs = new ResizeObserver(resize)
    obs.observe(canvas)

    return () => {
      cancelAnimationFrame(animId)
      obs.disconnect()
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
}

/* ─── Cover Flow ─────────────────────────────────────────── */
function CoverFlow({ isEn }: { isEn: boolean }) {
  const [active, setActive] = useState(4)
  const containerRef = useRef<HTMLDivElement>(null)

  const prev = useCallback(() => setActive((i) => Math.max(0, i - 1)), [])
  const next = useCallback(() => setActive((i) => Math.min(artworks.length - 1, i + 1)), [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev()
      if (e.key === "ArrowRight") next()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [prev, next])

  // Touch / swipe support
  const touchX = useRef<number | null>(null)
  const onTouchStart = (e: React.TouchEvent) => { touchX.current = e.touches[0].clientX }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    if (dx > 50) prev()
    else if (dx < -50) next()
    touchX.current = null
  }

  const getStyle = (idx: number): React.CSSProperties => {
    const d = idx - active
    const absD = Math.abs(d)
    if (absD > 4) return { display: "none" }

    const rotateY = d < 0 ? 62 : d > 0 ? -62 : 0
    const translateX = d === 0 ? 0 : d * 190
    const translateZ = absD === 0 ? 0 : absD === 1 ? -140 : -240
    const scale = absD === 0 ? 1 : absD === 1 ? 0.82 : 0.7
    const opacity = absD > 3 ? 0 : absD === 3 ? 0.25 : 1
    const zIndex = 20 - absD

    return {
      transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
      opacity,
      zIndex,
      transition: "transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.55s ease",
      cursor: absD === 0 ? "default" : "pointer",
    }
  }

  const art = artworks[active]

  return (
    <div className="w-full flex flex-col items-center gap-10 select-none">
      {/* Stage */}
      <div
        ref={containerRef}
        className="coverflow-stage relative w-full flex items-center justify-center"
        style={{ height: 420 }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {artworks.map((aw, idx) => (
          <div
            key={aw.id}
            className="absolute coverflow-item"
            style={{ ...getStyle(idx), width: 260, height: 340 }}
            onClick={() => setActive(idx)}
            role="button"
            aria-label={isEn ? aw.titleEn : aw.titleKo}
          >
            <img
              src={aw.url}
              alt={aw.alt}
              className="w-full h-full object-cover"
              draggable={false}
              style={{ display: "block" }}
            />
            {/* Reflection */}
            <div
              style={{
                position: "absolute",
                bottom: -68,
                left: 0,
                right: 0,
                height: 68,
                overflow: "hidden",
                opacity: 0.28,
              }}
            >
              <img
                src={aw.url}
                alt=""
                aria-hidden
                className="w-full object-cover"
                style={{ height: 340, transform: "scaleY(-1)", objectPosition: "bottom" }}
                draggable={false}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to bottom, transparent 0%, #faf8f4 80%)",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Caption */}
      <div className="text-center mt-8" style={{ minHeight: 72 }}>
        <p className="font-serif text-xl font-semibold tracking-wide">
          {isEn ? art.titleEn : art.titleKo}
        </p>
        <p className="text-sm mt-1" style={{ color: "#9b7b6b", fontFamily: "var(--font-sans)" }}>
          {art.year} &nbsp;·&nbsp; {art.medium}
        </p>
        <p className="text-xs mt-2" style={{ color: "#9b9590" }}>
          {active + 1} / {artworks.length}
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6 -mt-4">
        <button
          onClick={prev}
          disabled={active === 0}
          className="w-10 h-10 rounded-full border flex items-center justify-center transition-all hover:border-[#9b7b6b] hover:text-[#9b7b6b] disabled:opacity-20"
          style={{ borderColor: "#d4ccc4" }}
          aria-label="Previous artwork"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11 4L6 9l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Dot indicators */}
        <div className="flex gap-1.5">
          {artworks.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="rounded-full transition-all"
              style={{
                width: i === active ? 20 : 6,
                height: 6,
                background: i === active ? "#9b7b6b" : "#d4ccc4",
              }}
              aria-label={`Go to artwork ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={next}
          disabled={active === artworks.length - 1}
          className="w-10 h-10 rounded-full border flex items-center justify-center transition-all hover:border-[#9b7b6b] hover:text-[#9b7b6b] disabled:opacity-20"
          style={{ borderColor: "#d4ccc4" }}
          aria-label="Next artwork"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M7 4l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}

/* ─── Scroll Reveal Hook ─────────────────────────────────── */
function useReveal() {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); obs.disconnect() } },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

/* ─── Navbar ─────────────────────────────────────────────── */
function Navbar({ isEn, onToggleLang }: { isEn: boolean; onToggleLang: () => void }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const navLinks = isEn
    ? [{ label: "Exhibition", href: "#exhibition" }, { label: "About", href: "#about" }, { label: "Portfolio", href: "#portfolio" }, { label: "Contact", href: "#contact" }]
    : [{ label: "전시소개", href: "#exhibition" }, { label: "작가 소개", href: "#about" }, { label: "대표 작품", href: "#portfolio" }, { label: "연락처", href: "#contact" }]

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled || menuOpen ? "rgba(250,248,244,0.97)" : "transparent",
        backdropFilter: scrolled || menuOpen ? "blur(12px)" : "none",
        boxShadow: scrolled ? "0 1px 0 rgba(0,0,0,0.07)" : "none",
        padding: scrolled ? "0.9rem 2rem" : "1.5rem 2rem",
      }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <a
          href="#"
          className="tracking-widest text-sm font-medium transition-opacity hover:opacity-60"
          style={{
            fontFamily: "var(--font-display)",
            color: scrolled || menuOpen ? "#1c1c1c" : "#faf8f4",
            textDecoration: "none",
            letterSpacing: "0.15em",
          }}
        >
          Shin Keum Sook
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium transition-all hover:opacity-60"
              style={{
                fontFamily: "var(--font-sans)",
                color: scrolled ? "#1c1c1c" : "#faf8f4",
                textDecoration: "none",
                letterSpacing: "0.05em",
              }}
            >
              {l.label}
            </a>
          ))}
          <button
            onClick={onToggleLang}
            className="text-xs font-semibold px-3 py-1 rounded-full border transition-all hover:opacity-70"
            style={{
              borderColor: scrolled ? "#1c1c1c" : "rgba(250,248,244,0.6)",
              color: scrolled ? "#1c1c1c" : "#faf8f4",
              letterSpacing: "0.1em",
            }}
          >
            {isEn ? "KO" : "EN"}
          </button>
        </nav>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-4">
          {/* 1. 한영 토글 버튼 */}
          <button
            onClick={onToggleLang}
            className="text-xs font-semibold px-3 py-1 rounded-full border transition-all"
            style={{
              borderColor: scrolled || menuOpen ? "#1c1c1c" : "rgba(250,248,244,0.7)",
              color: scrolled || menuOpen ? "#1c1c1c" : "#faf8f4",
              fontFamily: "var(--font-sans)",
            }}
          >
            {isEn ? "KO" : "EN"}
          </button>

          {/* 2. 햄버거 메뉴 버튼 (겹침 해결된 고정 버전) */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="relative w-8 h-8 flex items-center justify-center"
            aria-label="Toggle menu"
          >
            <div className="relative w-[22px] h-[16px]">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="absolute left-0 block transition-all duration-300 origin-center"
                  style={{
                    width: 22,
                    height: 1.5,
                    background: scrolled || menuOpen ? "#1c1c1c" : "#faf8f4",
                    top: i === 0 ? 0 : i === 1 ? "7px" : "14px",
                    opacity: menuOpen && i === 1 ? 0 : 1,
                    transform: menuOpen
                      ? i === 0 
                        ? "translateY(7px) rotate(45deg)" 
                        : i === 2 
                        ? "translateY(-7px) rotate(-45deg)" 
                        : "none"
                      : "none",
                  }}
                />
              ))}
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className="md:hidden overflow-hidden transition-all duration-400"
        style={{ maxHeight: menuOpen ? 300 : 0 }}
      >
        <nav className="flex flex-col pt-4 pb-6 gap-5 px-2">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="text-base font-medium tracking-wide border-b pb-4 transition-opacity hover:opacity-50"
              style={{ fontFamily: "var(--font-sans)", color: "#1c1c1c", textDecoration: "none", borderColor: "#e8e2da" }}
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}

/* ─── Section Heading ────────────────────────────────────── */
function SectionHeading({ ko, en, isEn }: { ko: string; en: string; isEn: boolean }) {
  return (
    <h2
      className="section-heading text-center text-3xl font-normal mb-14"
      style={{ fontFamily: "var(--font-display)", letterSpacing: "0.05em" }}
    >
      {isEn ? en : ko}
    </h2>
  )
}

/* ─── App ────────────────────────────────────────────────── */
export default function App() {
  const [isEn, setIsEn] = useState(false)

  const exhibitionRef = useReveal() as React.RefObject<HTMLElement>
  const aboutRef = useReveal() as React.RefObject<HTMLElement>
  const portfolioRef = useReveal() as React.RefObject<HTMLElement>
  const contactRef = useReveal() as React.RefObject<HTMLElement>

  return (
    <div style={{ background: "#faf8f4", minHeight: "100vh" }}>
      <Navbar isEn={isEn} onToggleLang={() => setIsEn((v) => !v)} />

      {/* ── Hero ─────────────────────────────────────────── */}
      <section
        id="hero"
        className="relative flex flex-col items-center justify-center text-center overflow-hidden"
        style={{ minHeight: "100vh", background: "#1c1a18" }}
      >
        <HeroCanvas />

        {/* Subtle vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, transparent 30%, rgba(14,12,10,0.55) 100%)" }}
        />

        {/* Text */}
        <div className="relative z-10 px-6 flex flex-col items-center gap-5">
          <p
            className="animate-fade-up text-sm font-light tracking-[0.2em]"
            style={{ color: "rgba(250,248,244,0.6)", fontFamily: "var(--font-sans)" }}
          >
            {isEn ? "Shin Keum Sook Solo Exhibition" : "신금숙 개인전"}
          </p>

          <h1
            className="animate-fade-up-delay-1"
            style={{
              fontFamily: isEn ? "var(--font-display)" : "'SungkokSerif', 'Noto Serif KR', serif",
              fontSize: "clamp(3rem, 8vw, 6.5rem)",
              fontWeight: 400,
              color: "#faf8f4",
              lineHeight: 1.15,
              letterSpacing: isEn ? "0.02em" : "0.08em",
            }}
          >
            {isEn ? "Empty & Fill" : "비움과 채움"}
          </h1>

          <p
            className="animate-fade-up-delay-2 font-light"
            style={{
              color: "rgba(250,248,244,0.65)",
              fontFamily: "var(--font-sans)",
              fontSize: "1rem",
              letterSpacing: "0.08em",
            }}
          >
            {isEn ? "Oct 7 (Wed) – Oct 13 (Tue), 2026" : "2026. 10. 7(수) – 13(화)"}
          </p>

          <p
            className="animate-fade-up-delay-3 text-sm font-light"
            style={{ color: "rgba(250,248,244,0.4)", fontFamily: "var(--font-sans)", marginTop: 4 }}
          >
            {isEn ? "Gallery LAMER (26 Insadong 5-gil, Jongno-gu, Seoul)" : "갤러리 라메르 (서울 종로구 인사동5길 26)"}
          </p>

          <a
            href="#exhibition"
            className="animate-fade-up-delay-3 mt-8 flex flex-col items-center gap-2 transition-opacity hover:opacity-50"
            style={{ color: "rgba(250,248,244,0.4)", textDecoration: "none" }}
            aria-label="Scroll down"
          >
            <span className="text-xs tracking-widest" style={{ fontFamily: "var(--font-sans)" }}>SCROLL</span>
            <svg width="1" height="40" viewBox="0 0 1 40" fill="none">
              <line x1="0.5" y1="0" x2="0.5" y2="40" stroke="rgba(250,248,244,0.3)" strokeWidth="1" />
            </svg>
          </a>
        </div>
      </section>

      {/* ── Exhibition ──────────────────────────────────── */}
      <section
        id="exhibition"
        ref={exhibitionRef as React.RefObject<HTMLDivElement>}
        className="reveal py-28 px-6"
        style={{ borderTop: "1px solid #e8e2da" }}
      >
        <div className="max-w-3xl mx-auto">
          <SectionHeading ko="전시소개" en="Exhibition" isEn={isEn} />

          {/* Poster placeholder */}
          <div
            className="w-full mb-14 flex items-center justify-center text-sm"
            style={{
              height: 420,
              background: "#ede8e0",
              color: "#9b9590",
              fontFamily: "var(--font-sans)",
              letterSpacing: "0.1em",
            }}
          >
            {isEn ? "POSTER IMAGE" : "포스터 이미지"}
          </div>

          {isEn ? (
            <div style={{ fontFamily: "var(--font-sans)", lineHeight: 1.9, color: "#3a3633" }}>
              <p className="font-semibold text-lg mb-6">The Vessel of Space, True Abundance Blooms</p>
              <p className="mb-5">Life is a constant cycle of breathing in and breathing out, of letting go and taking in. Just as we must exhale to inhale, and just as the tides ebb and flow, this rhythm of emptying and filling is fundamental to who we are. Yet, we easily lose this balance. Just like trying to inhale without exhaling leaves us gasping, modern life races toward constant accumulation, completely forgetting how to let go.</p>
              <p className="mb-5">Why are we always trying to get more? Often, it's because we tie our self-worth to what we have—money, achievements, status, and validation. But no matter how great something is, if you pour it into a cup that's already full, it will only spill over or go stale. A mind crowded with attachments, greed, past regrets, and future worries has no room for genuine happiness or new possibilities. Constantly adding to our lives without clearing space first doesn't make us rich; it just leaves us overwhelmed, exhausted, and feeling empty.</p>
              <p className="mb-5">So, what does it actually mean to empty ourselves? It doesn't mean giving up or throwing everything away. It's simply the wisdom of making room for something better. It's an active choice to take back control of our lives. Just as you need an empty mug for fresh tea, you need a clear mind to welcome true peace and insight. It's about getting back to basics: when we drop the unnecessary desires and stop caring about what others think, what we truly want becomes crystal clear. Making space starts a positive cycle. Once you sweep away old emotions and attachments, the new experiences, knowledge, and love you take in can actually help you grow.</p>
              <p className="mb-5">In the end, a good life isn't about how much you've piled up. It's about how well you let go and how carefully you choose what to keep. Whenever you feel that overwhelming urge to just keep adding more, take a step back and look at what you're already carrying. Are you holding onto empty desires while ignoring what actually matters? Only by clearing space first can the things we gather become true abundance instead of greed, and bring us real growth instead of unhealthy attachment. Today, instead of reaching for just one more thing, why not practice the courage to let go of a few unnecessary thoughts? Only when the space is clean and open can our lives be filled with what truly shines.</p>
            </div>
          ) : (
            <div style={{ fontFamily: "var(--font-sans)", lineHeight: 1.9, color: "#3a3633" }}>
              <p className="font-semibold text-lg mb-6">비움이라는 그릇, 그 위에 피어나는 진정한 채움</p>
              <p className="mb-5">인생은 끊임없이 비우고 채우는 숨 고르기의 연속입니다. 들숨이 있으면 날숨이 있고, 밀물이 밀려들면 썰물이 빠져나가듯 비움과 채움은 삶을 지탱하는 가장 근본적이고 상대적인 두 축입니다. 그러나 우리는 종종 이 자연스러운 흐름의 균형을 잃곤 합니다. 날숨 없이 들숨만 쉬려 하면 숨이 턱끝까지 차오르듯, 현대인의 삶은 '비움'에 대한 이해와 실천 없이 오직 '채움'만을 향해 질주하고 있습니다.</p>
              <p className="mb-5">사람들은 왜 그토록 채우는 데 열망할까요? 그것은 채움이 주는 눈앞의 물질적 풍요, 스펙, 권력, 타인의 인정이 곧 자신의 가치를 증명한다고 믿기 때문입니다. 하지만 비워지지 않은 그릇에 아무리 좋은 것을 쏟아부은들 그 내용물은 결국 넘쳐흐르거나 안에서 썩어버리기 마련입니다. 이미 집착과 욕심, 지나간 후회와 미래에 대한 불안으로 가득 찬 마음에는 어떤 진정한 행복이나 새로운 가능성도 들어설 자리가 없습니다. 비움이라는 선행 조건이 생략된 채움은 풍요가 아니라 중첩된 과부하일 뿐이며, 우리를 더욱 조급하고 빈곤하게 만들 뿐입니다.</p>
              <p className="mb-5">그렇다면 우리가 오해하고 있는 '비움'의 참된 의미는 무엇일까요? 비움은 결코 나약한 포기나 소유의 완전한 상실을 의미하지 않습니다. 비움은 새로운 가치를 맞이하기 위해 공간을 만드는 지혜이자, 내 삶의 주권을 다시 잡는 적극적인 선택입니다. 비움은 공간의 창출입니다. 잔이 비어 있어야 따뜻한 차를 담을 수 있듯, 마음과 삶의 여백을 만들어야 비로소 진정한 통찰과 평안이 찾아옵니다. 비움은 본질로의 회귀입니다. 불필요한 욕망과 타인의 시선이라는 군더더기를 덜어낼 때, 비로소 내가 진정으로 원하는 것이 무엇인지 삶의 본질이 선명하게 드러납니다. 비움은 선순환의 출발점입니다. 묵은 감정과 집착을 비워내는 실천력이 바탕이 될 때, 우리가 새로 채워 넣는 지식과 경험, 사랑은 비로소 건강한 영양이 되어 자신을 성장시킵니다.</p>
              <p className="mb-5">결국 인생이라는 긴 여정에서 승자는 '얼마나 많이 채웠는가'가 아니라 '얼마나 잘 비우고 바르게 채웠는가'로 결정됩니다. 채우고자 하는 욕망이 요동칠 때일수록 우리는 한 걸음 물러서서 자신의 그릇을 들여다보아야 합니다. 지금 내 마음의 그릇은 무엇으로 차 있는지, 정작 담아야 할 소중한 가치들을 외면한 채 헛된 욕심으로 가득 채우려 하는 것은 아닌지 말입니다. 선명한 비움이 선행될 때, 비로소 채움은 욕심이 아닌 '풍요'가 되고 집착이 아닌 '성숙'이 됩니다. 오늘 하루, 무언가를 더 손에 쥐려 애쓰기보다 내 안의 불필요한 생각을 한숨 덜어내는 '비움의 용기'를 실천해 보는 것은 어떨까요. 잘 비워진 깨끗한 자리 위에서만 우리의 삶은 가장 빛나는 것들로 비로소 꽉 채워질 수 있습니다.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── About ───────────────────────────────────────── */}
      <section
        id="about"
        ref={aboutRef as React.RefObject<HTMLDivElement>}
        className="reveal py-28 px-6"
        style={{ background: "#f3ede5", borderTop: "1px solid #e8e2da" }}
      >
        <div className="max-w-3xl mx-auto">
          <SectionHeading ko="작가 소개" en="About Artist" isEn={isEn} />

          <div className="flex flex-col items-center gap-10 md:flex-row md:items-start md:gap-16">
     {/* Profile circle */}
            <div className="shrink-0 flex flex-col items-center">
              <div
                className="rounded-full overflow-hidden"
                style={{
                  width: 180,
                  height: 180,
                  background: "#d9d1c7", // 이미지가 로드되기 전이나 에러 시 보일 배경색
                }}
              >
                <img 
                  src="source/profile.jpg" 
                  alt={isEn ? "Artist Shin Keum Sook" : "신금숙 작가 프로필"} 
                  className="w-full h-full object-cover"
                />
              </div>
              <p
                className="mt-4 text-center"
                style={{
                  fontFamily: "'SungkokSerif', serif",
                  fontSize: "1.5rem",
                  letterSpacing: "0.05em",
                  color: "#1c1c1c",
                }}
              >
                {isEn ? "Shin, Keum Sook" : "신금숙"}
              </p>
            </div>

            {/* Bio text */}
            {isEn ? (
              <div style={{ fontFamily: "var(--font-sans)", lineHeight: 1.85, color: "#3a3633" }}>
                <p className="mb-4">As a child, artist Shin Keum Sook spent sleepless nights drawing paper dolls and fairy-tale princesses on blank white paper—warm, simple days that became the roots of her artistic inspiration. Unswayed by fleeting trends or flashy superficialities, she has spent her life quietly deepening her inner world to shape her own artistic identity. Her journey is a remarkable story of quiet dedication.</p>
                <p className="mb-4">After cultivating her artistic foundation at Sejong University (formerly Soodo Women's College of Education), she began her teaching career at Cheonho Middle School. She later taught at Changdeok Girls' High School and Ulsan Jungang High School, planting the seeds of art in countless students. Her lifelong commitment to education extended into leadership roles as an educational supervisor at the Ulsan Metropolitan Office of Education, Vice Principal of Ulsan Shinil Middle School, and Principal of Sangan Middle School, leaving a lasting legacy of true vocation.</p>
                <p className="mb-4">Even after retiring from education, her creative drive and sharp insight into life never faded. She opened "Bidanae," a traditional Hanok gallery in Seoul's culturally rich Seongbuk-dong—fulfilling a lifelong dream and creating a cozy space for artistic exchange. Recently, she relocated to the Misa district in Hanam, opening the "Delpittore Art Studio." There, she picks up her brush every single day with renewed passion, breathing fresh cultural energy into the local community.</p>
                <p className="mb-4">In her youth, she believed that true art required grand, magnificent subjects. But as time softened her perspective, her gaze shifted from the colossal to the delicate. Finding deep affection and quiet comfort in a single roadside wildflower, she began capturing the fleeting beauty of flowers and translating it into timeless eternity. Through this journey, Artist Shin has mastered the profound techniques of traditional silk painting while boldly blending them with modern acrylic textures, carving out a completely unique and original artistic world.</p>
                <p className="mb-6">Artist Shin Keum Sook has walked her path with remarkable resolve, tuning out the noise of the world to follow the singular rhythm of her own calling. Choosing to walk the path true to herself rather than one paved by others, she embodies the steadfast integrity that today's society needs most.</p>
                <ul className="text-sm space-y-2" style={{ color: "#6b6360", borderTop: "1px solid #d4ccc4", paddingTop: "1.2rem" }}>
                  <li>· 1st–4th Solo Exhibitions (Oct. 2009, Oct. 2014, May 2016, Oct. 2017; Ulsan Video Gallery, Seoul Arts Center)</li>
                  <li>· Winner of the Grand Prize for Contemporary Art Competition 4 times (1986–88), Participated in 2 Contemporary Art Invitational Exhibitions (1988–89), 3 Gunja Exhibitions, 5 Teachers' Art Exhibitions, Omirang Reveals, Gazing and Thinking, Scent of Autumn, and over 40 other group exhibitions (1985–2014), 7 Invitational Exhibitions at Hanmaeum Hall Contemporary Art Center (1998–2014)</li>
                  <li>· Former President of the Ulsan Secondary Art Education Research Association</li>
                  <li>· Current Representative of Delpittore Art Studio, Member of the Professional Artists Association</li>
                </ul>
              </div>
            ) : (
              <div style={{ fontFamily: "var(--font-sans)", lineHeight: 1.85, color: "#3a3633" }}>
                <p className="mb-4">어릴 적 흰 도화지 위에 종이 인형과 동화 속 예쁜 공주의 모습을 그리며 하얗게 지새우던 순수한 나날들은 작가 신금숙의 예술적 영감이 싹튼 가장 따뜻한 원점이었다. 세상의 거센 유행이나 화려한 겉치레에 절대 흔들리지 않고, 오직 내면의 깊이를 다지며 자신만의 예술적 본질을 묵묵히 완성해 가는 그의 삶은 그 자체로 한 편의 고결한 서사이다. 세종대학교(당시 수도여자사범대학교)에서 예술적 소양을 깊이 다진 그는 천호중학교를 시작으로 교직의 첫발을 내디뎠다. 이후 창덕여고와 울산중앙고에서 미술 교단에 서며 수많은 학생의 마음에 예술의 씨앗을 심어주었고, 울산시교육청 장학사, 울산 신일중학교 교감, 상안중학교 교장으로서 평생을 교육 현장에서 참된 사명감을 다하며 헌신적인 발자취를 남겼다.</p>
                <p className="mb-4">교직을 은퇴한 이후에도 삶을 향한 치열한 통찰과 실천은 멈추지 않았다. 평생의 숙원이자 염원이었던 한옥 갤러리 '비단애'를 문화와 예술의 향기가 가득한 서울 성북동에 개관하여 예술가들과의 깊은 교류의 장을 마련했고, 최근에는 하남시 미사지구로 자리를 옮겨 '델피토레그림방'을 새롭게 열었다. 이곳에서 매일 붓을 잡고 창작의 열정을 불태우는 동시에, 지역 사회에 싱그러운 문화적 숨결을 불어 넣으며 문화 창출의 중심 역할을 묵묵히 해내고 있다.</p>
                <p className="mb-4">예술의 길에 처음 들어섰을 때 그는 크고 웅장한 대형 오브제를 다루어야만 진정한 예술이라고 여기며 젊은 날의 치열함을 겪기도 했다. 그러나 세월의 무게가 자연스럽게 스며들면서 시선은 세상의 거대한 것에서 작고 여린 생명체들을 향해 따스하게 머물기 시작했다. 길 곁의 작은 들꽃 한 송이에도 깊은 애정을 느끼고, 그 미약한 생명력으로부터 때로는 커다란 위안을 얻으며, 꽃이 지닌 찰나의 아름다움에 영원이라는 시간을 부여하는 작업을 이어왔다. 이 과정에서 신금숙 작가는 전통적인 실크 염색화의 깊이 있는 전문 영역을 단단하게 개척해 냈고, 여기에 현대적인 아크릴 물감의 질감을 과감하게 접목함으로써 세상에 존재하지 않던 전혀 새롭고 독창적인 예술 세계를 구축해 냈다.</p>
                <p className="mb-6">세상의 요란한 소음에는 과감히 귀를 닫고, 오직 자신이 선택한 하나의 거대한 파도 위에 온전히 몸을 실은 채 평생을 걸어온 작가 신금숙. 남들이 닦아놓은 길이 아닌, 오직 '나다운 단 하나의 길'을 끝까지 우직하게 걸어가는 그 삶의 태도야말로 오늘날 이 사회가 요구하는 예술가의 모습이 아닐까 한다.</p>
                <ul className="text-sm space-y-2" style={{ color: "#6b6360", borderTop: "1px solid #d4ccc4", paddingTop: "1.2rem" }}>
                  <li>· 제1~4회 개인전 (2009.10., 2014.10., 2016.5., 2017.10. 울산 영상갤러리, 서울 예술의 전당)</li>
                  <li>· 현대미술대상 공모전 4회 입상(1986-88), 현대미술 초대전 2회(1988-89), 군자전 3회, 교원미전 5회, 오미랑 드러내다전, 바라보다 생각하다전, 가을향기전 외 그룹전 40여회 출품(1985-2014), 한마음회관 현대예술관 초대전 7회(1998-2014)</li>
                  <li>· 전) 울산중등미술교육연구회장</li>
                  <li>· 현) 델피토레그림방 대표, 전업미술가협회 회원</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Portfolio ────────────────────────────────────── */}
      <section
        id="portfolio"
        ref={portfolioRef as React.RefObject<HTMLDivElement>}
        className="reveal py-28 px-6 overflow-hidden"
        style={{ borderTop: "1px solid #e8e2da" }}
      >
        <div className="max-w-5xl mx-auto">
          <SectionHeading ko="대표 작품" en="Portfolio" isEn={isEn} />
          <CoverFlow isEn={isEn} />
        </div>
      </section>

      {/* ── Contact ──────────────────────────────────────── */}
      <section
        id="contact"
        ref={contactRef as React.RefObject<HTMLDivElement>}
        className="reveal py-28 px-6"
        style={{ background: "#f3ede5", borderTop: "1px solid #e8e2da" }}
      >
        <div className="max-w-xl mx-auto text-center">
          <SectionHeading ko="연락처" en="Contact" isEn={isEn} />

          <div
            className="grid gap-2 text-sm"
            style={{ fontFamily: "var(--font-sans)", color: "#3a3633", lineHeight: 1.8 }}
          >
            {/* 정렬을 위해 전체 폭을 제한하는 컨테이너 추가 */}
            <div className="max-w-sm mx-auto w-full px-4">
              {[
                { icon: "📞", label: "Phone", value: "010-4587-8428", href: "tel:010-4587-8428" },
                { icon: "✉️", label: "Email", value: "kssook8428@naver.com", href: "mailto:kssook8428@naver.com" },
                { icon: "📝", label: "Blog", value: "blog.naver.com/delpittore", href: "https://blog.naver.com/delpittore" },
                { icon: "📸", label: "Instagram", value: "@geumsookshin", href: "https://www.instagram.com/geumsookshin" },
              ].map((c) => (
                <div 
                  key={c.label} 
                  // flex 대신 grid를 사용하여 열 너비를 고정 (아이콘 40px, 라벨 90px, 나머지 값)
                  className="grid grid-cols-[40px_90px_1fr] items-center py-3 text-left" 
                  style={{ borderBottom: "1px solid #ddd8d0" }}
                >
                  <span className="text-center" style={{ fontSize: "1.1rem" }}>{c.icon}</span>
                  <span style={{ color: "#9b9590", letterSpacing: "0.02em" }}>{c.label}</span>
                  <a
                    href={c.href}
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="font-medium transition-opacity hover:opacity-50 truncate"
                    style={{ color: "#1c1c1c", textDecoration: "none" }}
                  >
                    {c.value}
                  </a>
                </div>
              ))}
            </div>

            <div className="mt-8 py-4 text-center" style={{ color: "#6b6360", lineHeight: 2 }}>
              {isEn ? (
                <p>A-205, Hyundai Cluster Hangang Misa 3rd<br />165 Misagangbyeon Hangang-ro, Hanam-si, Gyeonggi-do</p>
              ) : (
                <p>경기도 하남시 미사강변한강로 165<br />현대클러스터 한강미사3차 A-205</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer
        className="py-8 text-center text-xs tracking-widest"
        style={{
          background: "#1c1a18",
          color: "rgba(250,248,244,0.35)",
          fontFamily: "var(--font-sans)",
          letterSpacing: "0.12em",
        }}
      >
        © 2026 {isEn ? "Shin Keum Sook" : "신금숙"}. All rights reserved.
      </footer>
    </div>
  )
}
