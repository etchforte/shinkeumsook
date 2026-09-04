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
const ORB_PALETTE = [
  { h: 340, s: 28, l: 62 },
  { h: 22,  s: 35, l: 60 },
  { h: 200, s: 22, l: 58 },
  { h: 270, s: 20, l: 62 },
  { h: 155, s: 18, l: 52 },
  { h: 45,  s: 32, l: 60 },
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
            className="absolute coverflow-item flex flex-col items-center justify-center"
            style={{ ...getStyle(idx), height: 340 }}
            onClick={() => setActive(idx)}
            role="button"
            aria-label={isEn ? aw.titleEn : aw.titleKo}
          >
            {/* 메인 작품 이미지: object-contain으로 변경하여 원본 비율 유지 */}
            <img
              src={aw.url}
              alt={aw.alt}
              className="h-full w-auto block object-contain drop-shadow-md"
              draggable={false}
            />

            {/* 하단 바닥 반사 이미지 */}
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
                className="w-full block"
                style={{ height: 340, transform: "scaleY(-1)", objectPosition: "bottom", objectFit: "contain" }}
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-5 md:px-8 ${
        scrolled ? "py-3" : "py-5 md:py-6"
      }`}
      style={{
        background: scrolled || menuOpen ? "rgba(250,248,244,0.97)" : "transparent",
        backdropFilter: scrolled || menuOpen ? "blur(12px)" : "none",
        boxShadow: scrolled ? "0 1px 0 rgba(0,0,0,0.07)" : "none",
      }}
    >
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between gap-4">
        <a
          href="#"
          className="tracking-widest text-sm font-medium transition-opacity hover:opacity-60 truncate"
          style={{
            fontFamily: "var(--font-display)",
            color: scrolled || menuOpen ? "#1c1c1c" : "#faf8f4",
            textDecoration: "none",
            letterSpacing: "0.15em",
          }}
        >
          Shin Keum Sook
        </a>

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

        <div className="flex md:hidden items-center gap-4">
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
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false)
  
  const exhibitionRef = useReveal() as React.RefObject<HTMLElement>
  const aboutRef = useReveal() as React.RefObject<HTMLElement>
  const portfolioRef = useReveal() as React.RefObject<HTMLElement>
  const contactRef = useReveal() as React.RefObject<HTMLElement>

  return (
    <div className="overflow-x-hidden w-full" style={{ background: "#faf8f4", minHeight: "100vh" }}>
      <Navbar isEn={isEn} onToggleLang={() => setIsEn((v) => !v)} />

      {/* ── Hero ─────────────────────────────────────────── */}
      <section
        id="hero"
        className="relative flex flex-col items-center justify-center text-center overflow-hidden"
        style={{ minHeight: "100vh", background: "#1c1a18" }}
      >
        <HeroCanvas />

        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, transparent 30%, rgba(14,12,10,0.55) 100%)" }}
        />

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
            {isEn ? "Oct 7 (Wed) – Oct 12 (Mon), 2026" : "2026. 10. 7(수) – 12(월)"}
          </p>

          <p
            className="animate-fade-up-delay-3 text-sm font-light"
            style={{ color: "rgba(250,248,244,0.4)", fontFamily: "var(--font-sans)", marginTop: 4 }}
          >
            {isEn ? "Gallery LAMER Room 2 (26 Insadong 5-gil, Jongno-gu, Seoul)" : "갤러리 라메르 제2전시실 (서울 종로구 인사동5길 26)"}
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

      {/* ── Exhibition (스크롤/호버 반응형 움직이는 포스터) ────── */}
      <section
        id="exhibition"
        ref={exhibitionRef as React.RefObject<HTMLDivElement>}
        className="reveal py-28 px-6"
        style={{ borderTop: "1px solid #e8e2da" }}
      >
        <div className="max-w-3xl mx-auto">
          <SectionHeading ko="전시소개" en="Exhibition" isEn={isEn} />

          {/* 포스터 비디오 영역 (PC: 호버 시 재생 / 모바일: 스크롤 진입 시 재생) */}
          <div
            className="w-full mb-12 flex items-center justify-center overflow-hidden rounded-lg shadow-md relative group"
            style={{
                            background: "#ede8e0",
            }}
            onMouseEnter={(e) => {
              const video = e.currentTarget.querySelector("video");
              if (video && window.innerWidth > 768 && !video.dataset.error) video.play().catch(() => {});
            }}
            onMouseLeave={(e) => {
              const video = e.currentTarget.querySelector("video");
              if (video && window.innerWidth > 768) {
                video.pause();
                video.currentTime = 0;
              }
            }}
          >
            <video
              ref={(node) => {
                if (!node) return;
                const observer = new IntersectionObserver(
                  ([entry]) => {
                    if (entry.isIntersecting && !node.dataset.error) {
                      node.play().catch(() => {});
                    } else {
                      node.pause();
                    }
                  },
                  { threshold: 0.4 }
                );
                observer.observe(node);
              }}
              src="source/phoster.mp4"
              muted
              loop
              playsInline
              onError={(e) => { (e.currentTarget as HTMLVideoElement).dataset.error = "1" }}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-101"
            />
          </div>

          <div 
            className="max-w-2xl mx-auto mb-10 text-base md:text-lg" 
            style={{ fontFamily: "var(--font-sans)", lineHeight: 1.85, color: "#3a3633", textAlign: "left" }}
          >
            {isEn ? (
              <p>
                Artist Shin Keum Sook presents around 30 paintings exploring the themes of emptying and filling through everyday subjects. Held at Gallery Lamer from October 7 to 12, this exhibition invites viewers to step away from busy routines, release unnecessary burdens, and fill that space with the quiet warmth and true value of life.
              </p>
            ) : (
              <p>
                화가 신금숙이 일상의 작은 아름다움을 찾아 비움과 채움의 의미를 담은 30여 점의 작품을 선보입니다. 갤러리 라메르에서 10월 7일부터 12일까지 전개되는 이번 전시에서, 우리는 바쁘게 달려온 삶 속에서 불필요한 욕심을 덜어내고 그 비워진 자리에 진정한 삶의 온기와 소중한 가치를 오롯이 채워보는 깊은 위안의 시간을 마주하게 될 것입니다.
              </p>
            )}
          </div>
{/* 전시 서문 & SNS 공유 이벤트 버튼 */}
          <div className="text-center flex flex-col items-center gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border transition-all hover:bg-[#1c1c1c] hover:text-[#faf8f4]"
              style={{
                borderColor: "#9b7b6b",
                color: "#1c1c1c",
                fontFamily: "var(--font-sans)",
                fontSize: "0.95rem",
                letterSpacing: "0.08em",
              }}
            >
              <span>{isEn ? "Read Exhibition Preface" : "전시 서문 보기"}</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* 새롭게 추가된 SNS 공유 이벤트 버튼 */}
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full transition-all hover:opacity-85 shadow-sm"
              style={{
                background: "#9b7b6b",
                color: "#faf8f4",
                fontFamily: "var(--font-sans)",
                fontSize: "0.95rem",
                letterSpacing: "0.05em",
              }}
            >
              <span>{isEn ? "SNS Share Event" : "SNS 공유 이벤트"}</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* ── 전시 서문 팝업 (Modal) ────────────────────────── */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(28,26,24,0.65)", backdropFilter: "blur(6px)" }}
        >
          <div 
            className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto p-8 md:p-12 rounded-lg shadow-2xl"
            style={{ background: "#faf8f4", color: "#3a3633" }}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-[#ede8e0]"
              aria-label="Close modal"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M4 4l10 10M14 4L4 14" stroke="#1c1c1c" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>

            <h3 
              className="text-2xl font-normal mb-8 text-center"
              style={{ fontFamily: "var(--font-display)", letterSpacing: "0.05em", color: "#1c1c1c" }}
            >
              {isEn ? "Exhibition Preface" : "전시 서문"}
            </h3>

            {isEn ? (
              <div style={{ fontFamily: "var(--font-sans)", lineHeight: 1.9, fontSize: "0.95rem" }}>
                <p className="font-semibold text-lg mb-6 text-center">The Vessel of Space, True Abundance Blooms</p>
                <p className="mb-5">Life is a constant cycle of breathing in and breathing out, of letting go and taking in. Just as we must exhale to inhale, and just as the tides ebb and flow, this rhythm of emptying and filling is fundamental to who we are. Yet, we easily lose this balance. Just like trying to inhale without exhaling leaves us gasping, modern life races toward constant accumulation, completely forgetting how to let go.</p>
                <p className="mb-5">Why are we always trying to get more? Often, it's because we tie our self-worth to what we have—money, achievements, status, and validation. But no matter how great something is, if you pour it into a cup that's already full, it will only spill over or go stale. A mind crowded with attachments, greed, past regrets, and future worries has no room for genuine happiness or new possibilities. Constantly adding to our lives without clearing space first doesn't make us rich; it just leaves us overwhelmed, exhausted, and feeling empty.</p>
                <p className="mb-5">So, what does it actually mean to empty ourselves? It doesn't mean giving up or throwing everything away. It's simply the wisdom of making room for something better. It's an active choice to take back control of our lives. Just as you need an empty mug for fresh tea, you need a clear mind to welcome true peace and insight. It's about getting back to basics: when we drop the unnecessary desires and stop caring about what others think, what we truly want becomes crystal clear. Making space starts a positive cycle. Once you sweep away old emotions and attachments, the new experiences, knowledge, and love you take in can actually help you grow.</p>
                <p className="mb-5">In the end, a good life isn't about how much you've piled up. It's about how well you let go and how carefully you choose what to keep. Whenever you feel that overwhelming urge to just keep adding more, take a step back and look at what you're already carrying. Are you holding onto empty desires while ignoring what actually matters? Only by clearing space first can the things we gather become true abundance instead of greed, and bring us real growth instead of unhealthy attachment. Today, instead of reaching for just one more thing, why not practice the courage to let go of a few unnecessary thoughts? Only when the space is clean and open can our lives be filled with what truly shines.</p>
              </div>
            ) : (
              <div style={{ fontFamily: "var(--font-sans)", lineHeight: 1.9, fontSize: "0.95rem" }}>
                <p className="font-semibold text-lg mb-6 text-center">비움이라는 그릇, 그 위에 피어나는 진정한 채움</p>
                <p className="mb-5">인생은 끊임없이 비우고 채우는 숨 고르기의 연속입니다. 들숨이 있으면 날숨이 있고, 밀물이 밀려들면 썰물이 빠져나가듯 비움과 채움은 삶을 지탱하는 가장 근본적이고 상대적인 두 축입니다. 그러나 우리는 종종 이 자연스러운 흐름의 균형을 잃곤 합니다. 날숨 없이 들숨만 쉬려 하면 숨이 턱끝까지 차오르듯, 현대인의 삶은 '비움'에 대한 이해와 실천 없이 오직 '채움'만을 향해 질주하고 있습니다.</p>
                <p className="mb-5">사람들은 왜 그토록 채우는 데 열망할까요? 그것은 채움이 주는 눈앞의 물질적 풍요, 스펙, 권력, 타인의 인정이 곧 자신의 가치를 증명한다고 믿기 때문입니다. 하지만 비워지지 않은 그릇에 아무리 좋은 것을 쏟아부은들 그 내용물은 결국 넘쳐흐르거나 안에서 썩어버리기 마련입니다. 이미 집착과 욕심, 지나간 후회와 미래에 대한 불안으로 가득 찬 마음에는 어떤 진정한 행복이나 새로운 가능성도 들어설 자리가 없습니다. 비움이라는 선행 조건이 생략된 채움은 풍요가 아니라 중첩된 과부하일 뿐이며, 우리를 더욱 조급하고 빈곤하게 만들 뿐입니다.</p>
                <p className="mb-5">그렇다면 우리가 오해하고 있는 '비움'의 참된 의미는 무엇일까요? 비움은 결코 나약한 포기나 소유의 완전한 상실을 의미하지 않습니다. 비움은 새로운 가치를 맞이하기 위해 공간을 만드는 지혜이자, 내 삶의 주권을 다시 잡는 적극적인 선택입니다. 비움은 공간의 창출입니다. 잔이 비어 있어야 따뜻한 차를 담을 수 있듯, 마음과 삶의 여백을 만들어야 비로소 진정한 통찰과 평안이 찾아옵니다. 비움은 본질로의 회귀입니다. 불필요한 욕망과 타인의 시선이라는 군더더기를 덜어낼 때, 비로소 내가 진정으로 원하는 것이 무엇인지 삶의 본질이 선명하게 드러납니다. 비움은 선순환의 출발점입니다. 묵은 감정과 집착을 비워내는 실천력이 바탕이 될 때, 우리가 새로 채워 넣는 지식과 경험, 사랑은 비로소 건강한 영양이 되어 자신을 성장시킵니다.</p>
                <p className="mb-5">결국 인생이라는 긴 여정에서 승자는 '얼마나 많이 채웠는가'가 아니라 '얼마나 잘 비우고 바르게 채웠는가'로 결정됩니다. 채우고자 하는 욕망이 요동칠 때일수록 우리는 한 걸음 물러서서 자신의 그릇을 들여다보아야 합니다. 지금 내 마음의 그릇은 무엇으로 차 있는지, 정작 담아야 할 소중한 가치들을 외면한 채 헛된 욕심으로 가득 채우려 하는 것은 아닌지 말입니다. 선명한 비움이 선행될 때, 비로소 채움은 욕심이 아닌 '풍요'가 되고 집착이 아닌 '성숙'이 됩니다. 오늘 하루, 무언가를 더 손에 쥐려 애쓰기보다 내 안의 불필요한 생각을 한숨 덜어내는 '비움의 용기'를 실천해 보는 것은 어떨까요. 잘 비워진 깨끗한 자리 위에서만 우리의 삶은 가장 빛나는 것들로 비로소 꽉 채워질 수 있습니다.</p>
              </div>
            )}
          </div>
        </div>
      )}
      {/* ── SNS 공유 이벤트 팝업 ─────────────────────────────── */}
      {isShareModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          style={{ background: "rgba(20,18,16,0.72)", backdropFilter: "blur(8px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setIsShareModalOpen(false) }}
        >
          <div
            className="relative w-full sm:max-w-[440px] overflow-hidden"
            style={{
              background: "#faf8f4",
              borderRadius: "20px 20px 0 0",
              boxShadow: "0 -8px 60px rgba(0,0,0,0.25)",
            }}
          >
            {/* ─ 상단 다크 헤더 */}
            <div
              className="relative px-8 pt-10 pb-8 text-center overflow-hidden"
              style={{ background: "#1c1a18" }}
            >
              {/* 닫기 버튼 */}
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="absolute top-5 right-5 flex items-center justify-center transition-opacity hover:opacity-50"
                aria-label="Close"
                style={{ color: "rgba(250,248,244,0.5)" }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </button>

              {/* 장식 선 */}
              <div className="flex items-center justify-center gap-3 mb-5">
                <div style={{ width: 28, height: 1, background: "rgba(250,248,244,0.2)" }} />
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="3" stroke="rgba(155,123,107,0.9)" strokeWidth="1" />
                  <circle cx="8" cy="8" r="7" stroke="rgba(155,123,107,0.35)" strokeWidth="0.8" />
                </svg>
                <div style={{ width: 28, height: 1, background: "rgba(250,248,244,0.2)" }} />
              </div>

              <p
                className="text-xs tracking-[0.22em] mb-3"
                style={{ color: "rgba(250,248,244,0.45)", fontFamily: "var(--font-sans)" }}
              >
                {isEn ? "SPECIAL EVENT" : "이벤트 안내"}
              </p>

              <h3
                className="text-2xl font-normal leading-snug"
                style={{
                  fontFamily: isEn ? "var(--font-display)" : "'SungkokSerif', 'Noto Serif KR', serif",
                  color: "#faf8f4",
                  letterSpacing: isEn ? "0.02em" : "0.06em",
                }}
              >
                {isEn ? "Share & Receive" : "공유하고 선물 받기"}
              </h3>

              {/* 엽서 이미지 */}
              <div className="mt-6 flex justify-center">
                <img
                  src="source/card.png"
                  alt={isEn ? "Empty & Fill postcard set" : "비움과 채움 엽서 세트"}
                  style={{
                    width: 180,
                    borderRadius: 6,
                    display: "block",
                  }}
                  draggable={false}
                />
              </div>
            </div>

            {/* ─ 하단 크림 본문 */}
            <div className="px-8 pt-7 pb-8">
              {/* 본문 설명 */}
              <div
                className="text-sm leading-relaxed text-center mb-6"
                style={{ fontFamily: "var(--font-sans)", color: "#5a5350", lineHeight: 1.85 }}
              >
                {isEn ? (
                  <>
                    <p>Share this exhibition page on your social media<br />(Instagram · KakaoTalk · Facebook)</p>
                    <p className="mt-4">
                      Show us your post at the gallery entrance<br />
                      to receive a special
                      {" "}<span style={{ color: "#1c1c1c", fontWeight: 600 }}>"Empty &amp; Fill" postcard set</span>.
                    </p>
                  </>
                ) : (
                  <>
                    <p>이 페이지를 SNS에 공유해 주세요<br />(인스타그램 · 카카오톡 · 페이스북)</p>
                    <p className="mt-4">
                      공유 후 전시장을 방문하실 때 보여주시면<br />
                      <span style={{ color: "#1c1c1c", fontWeight: 600 }}>'비움과 채움' 엽서 세트</span>를 드립니다.
                    </p>
                  </>
                )}
              </div>

              {/* 선착순 뱃지 */}
              <div
                className="flex items-center justify-center gap-2 mb-7"
                style={{
                  background: "#f3ede5",
                  borderRadius: 8,
                  padding: "8px 16px",
                }}
              >
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <circle cx="6.5" cy="6.5" r="5.5" stroke="#9b7b6b" strokeWidth="1" />
                  <path d="M6.5 4v3l2 1" stroke="#9b7b6b" strokeWidth="1" strokeLinecap="round" />
                </svg>
                <span
                  className="text-xs tracking-wide"
                  style={{ fontFamily: "var(--font-sans)", color: "#9b7b6b" }}
                >
                  {isEn ? "First-come, first-served · 1 set per person" : "선착순 증정 · 1인 1세트 한정"}
                </span>
              </div>

              {/* 공유 버튼 */}
              <button
                onClick={async () => {
                  const shareData = {
                    title: isEn ? "Shin Keum Sook Solo Exhibition — Empty & Fill" : "신금숙 개인전 '비움과 채움'",
                    text: isEn
                      ? "Join us at the exhibition to find the true value of emptying and filling."
                      : "일상의 아름다움을 찾아 비움과 채움의 의미를 담은 신금숙 작가의 개인전에 초대합니다.",
                    url: window.location.href,
                  }
                  if (navigator.share) {
                    try { await navigator.share(shareData) }
                    catch {}
                  } else {
                    await navigator.clipboard.writeText(window.location.href)
                    alert(isEn ? "Link copied to clipboard!" : "링크가 클립보드에 복사되었습니다!")
                  }
                }}
                className="w-full flex items-center justify-center gap-2.5 py-4 transition-all hover:opacity-85 active:scale-[0.98]"
                style={{
                  background: "#1c1a18",
                  color: "#faf8f4",
                  borderRadius: 12,
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.9rem",
                  letterSpacing: "0.08em",
                  marginBottom: 10,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
                {isEn ? "Share Exhibition" : "전시 공유하기"}
              </button>

              <button
                onClick={async () => {
                  await navigator.clipboard.writeText(window.location.href)
                  alert(isEn ? "Link copied!" : "링크가 복사되었습니다!")
                }}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 transition-all hover:bg-[#ede8e0] active:scale-[0.98]"
                style={{
                  border: "1px solid #ddd8d0",
                  color: "#5a5350",
                  borderRadius: 12,
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.85rem",
                  letterSpacing: "0.05em",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                {isEn ? "Copy Link" : "링크 복사"}
              </button>
            </div>

            {/* 바텀 핸들 (모바일 sheet 느낌) */}
            <div className="sm:hidden absolute top-3 left-0 right-0 flex justify-center pointer-events-none">
              <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(250,248,244,0.3)" }} />
            </div>
          </div>
        </div>
      )}
{/* ── 한국교육신문 기사 팝업 (Newspaper Style Modal) ────────────────────────── */}
      {isNewsModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(28,26,24,0.75)", backdropFilter: "blur(6px)" }}
        >
          <div
            className="relative w-full max-w-2xl max-h-[88vh] overflow-y-auto p-6 md:p-10 rounded-sm shadow-2xl"
            style={{
              background: "#f4f1ea", // 빈티지 신문 종이 질감 색상
              color: "#222120",
              border: "1px solid #c8c2b7",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.4)"
            }}
          >
            {/* 닫기 버튼 */}
            <button
              onClick={() => setIsNewsModalOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-[#e4dfd3]"
              aria-label="Close modal"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M4 4l10 10M14 4L4 14" stroke="#222120" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>

            {/* 신문 헤더 */}
            <div className="border-b-2 border-double border-[#3a3835] pb-3 mb-6 text-center">
              <div className="flex justify-between items-center text-xs tracking-widest text-[#666057] mb-1 font-serif px-1">
                <span>기획 · 인물</span>
                <span className="font-bold text-[#1a1918] tracking-widest text-sm">韓國敎育新聞</span>
                <span>한국교육신문</span>
              </div>
              <div className="h-[1px] bg-[#3a3835] my-1" />
            </div>

            {/* 기사 타이틀 및 정보 */}
            <h3
              className="text-2xl md:text-3xl font-bold mb-4 leading-snug"
              style={{ fontFamily: "'SungkokSerif', 'Noto Serif KR', serif", color: "#1a1918", wordKeep: "keep-all" }}
            >
              교직 33년, 그림방에서 제2인생 펼치는 신금숙 前 교장
            </h3>

            <div className="text-sm md:text-base font-medium mb-4 text-[#524d45] border-l-2 border-[#8c6b5d] pl-3 py-0.5 space-y-1">
              <p>명퇴 후 갤러리 8년 운영</p>
              <p>『델피토레그림방』 대표로 활동</p>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-xs text-[#736c62] mb-6 pb-2 border-b border-[#d8d2c5]">
              <span>이영관 교육칼럼니스트 yyg99@hanmail.net</span>
              <span>등록 2025.02.26 15:13:32</span>
            </div>

            {/* 기사 직접 링크 이미지 영역 */}
            <div className="mb-8">
              <div className="bg-[#e8e3d8] p-2 border border-[#d2cbbe] rounded-sm">
                <img
                  src="https://www.hangyo.com/data/photos/20250209/art_17403970368678_e8604c.jpg"
                  alt="신금숙 작가 한국교육신문 기사 사진"
                  className="w-full h-auto object-cover max-h-[450px]"
                />
                <p className="text-xs text-[#666057] mt-2 font-serif text-center">
                  ▲ 『델피토레그림방』을 운영하는 신금숙 화가
                </p>
              </div>
            </div>

            {/* 기사 본문 (원문 그대로) */}
            <div
              className="space-y-5 text-base leading-relaxed text-[#2b2825]"
              style={{ fontFamily: "'Noto Serif KR', serif", textAlign: "justify", wordBreak: "keep-all" }}
            >
              <p>
                서울과 울산지역 미술교사 출신인 신금숙(67) 前 교장. 미술교사의 교직 추억엔 무엇이 남아 있을까? 30대 초반 덕수상고 미술반 제자들과 함께 저녁 늦게까지 작품 제작을 하고 아이들의 허기진 배를 떡볶이와 순대로 채워주던 일. 창덕여고 때 수업시간 제작한 학생작품 200여 점을 매년 축제 때마다 기성작가 전시회 수준으로 준비해 갈채를 받았던 일. 울산 중앙고에선 미술수업에 인성교육과 진로적성프로그램 접목해 학생들의 흥미를 유도하고 그 결과를 현장논문으로 남겼던 일이 주마등처럼 스쳐 지나간다.
              </p>
              <p>
                그는 2012년 울산 상안중 교장 발령 2년만에 과감히 명예퇴직을 하게 된다. 정년 5년 반을 남긴 때다. 교직 33년 동안 교직을 너무나 사랑했고, 교육에 대한 열정도 있고, 교장으로서 성과도 있었으나 세월호 사건을 겪으면서 자신의 교직생활을 돌아보게 되었고 '박수칠 때 떠나라'는 말의 의미를 되새기면서 지금이 그때라고 생각했다고 한다.
              </p>
              <p>
                2014년 4월 어느 날, 70세까지 12년밖에 안 남았다는 사실을 깨닫고 그 나이가 되면 '어떤 새로운 일에 도전할 수가 있을까?'하는 생각이 스치자 머리를 한 대 얻어맞은 것 같았다. 이대로 평생 직장만 다니다가 인생을 마치게 될 것 같아 조급해졌다. 나머지 삶은 마음 편히 그림을 그리며 화가로서 살고 싶었다. 깊은 고민 끝에 '학교교육, 내가 아니면 안 된다는 생각은 오만'이라는 결론을 내린 것이다.
              </p>
              <p>
                퇴직 후, 서울 성북동에 작은 한옥을 구입해 리모델링하여 평생 숙원이었던 『비단애갤러리』를 오픈, 8년간 즐겁게 생활했다. 우연한 기회에 경기도 하남시 현재의 상가를 매입, 갤러리를 옮겨 2023년 9월 『델피토레그림방』을 재오픈했는데, 성공적으로 자리를 잡아가고 있는 중이다.
              </p>
              <p>
                델피토레(DEL PITTORE)는 이탈리아어로 '화가의'란 뜻이며, 따라서 『델피토레그림방』은 '화가의 그림방'이란 의미다. 이 그림방에는 다양한 미술도구가 준비되어 있어, 그림 그리기를 좋아하는 사람이면 누구나 아무런 준비 없이 가벼운 마음으로 내방하여 그림도 그리고, 차도 마시며 음악도 즐길 수 있는 신개념의 힐링공간이다.
              </p>
              <p>
                그림을 그리고 싶은데 자신이 없어서 주저하는 분들이 쉽게 도전할 수 있도록 하였다. 먼저 그림방 작품 소품을 도안화한 밑그림을 제공하고, 게시된 그 밑그림의 예시 작품을 직접 보면 그릴 수 있는 자신감이 생긴다. 이곳엔 어린이부터 성인까지 그리고 수준별, 장르별로 체험할 수 있는 밑그림이 준비되었다. 홍보에 적극 나서지 않았음에도 입소문으로 찾아오는 고객이 점점 늘어나는 추세라고 한다.
              </p>
              <p>
                신금숙 화가로서의 약력과 화풍 변화과정이 궁금했다. 그는 평생 교육자로서 바쁜 일상 속에서도 꾸준히 붓을 잡았다. 젊었을 때에는 10회의 공모전 출품과 입상, 그리고 초대작가로 활동했다. 거의 매년 그룹전에 참가했으나 개인전은 총 4회를 열었고 지금 다섯 번째 개인전을 준비 중이다. 초기에는 유화, 아크릴화와 염색화를 주로 그렸으나 가장 익숙한 재료인 실크를 회화에 접목한 작업을 해 왔다. 최근에는 다양한 방법으로 실크를 염색하고 이를 부분적으로 콜라주하는 기법으로 그 완성도를 더해 가고 있다.
              </p>
              <p>
                일반인이 그림을 그리면 어떤 점이 좋은가? 고객 지도를 통한 성공 지도사례를 물었다. 그는 "꾸준한 미술활동은 자신도 인지하지 못한 내면의 갈등이나 억압된 욕구를 표출함으로서 정서적 안정을 가져오게 하고 기능을 습득해가면서 성취감, 자기 효능감까지도 느낄 수 있다. 특히 현대인의 고독감과 고립감도 그림을 그리면서 치유되기도 한다"며 "급격한 환경 변화로 약간의 틱 증상을 갖고 있던 초등학교 학생이 함께 그림을 그리면서 눈에 띄게 호전되는 모습을 보았고, 평소 우울감을 많이 느끼던 50대 주부가 그림을 그리면서 너무나 활달해지는 모습도 보았다"고 사례를 소개한다.
              </p>
              <p>
                그는 그림 초보자들에게 도전정신을 강조한다. 그림은 문자가 만들어지기 오래전부터 인간이 사용한 소통의 도구다. 대부분 사람들이 미술을 처음 접할 때 테크닉만을 신경 쓰다보니 도전하기 쉽지 않은데, 간혹 어린아이나 초보자의 때묻지 않은 그림이 훨씬 더 매력적일 수 있다고 한다. 누구라도 쉽게 도전할 수 있는, 수준에 맞는 다양한 도구와 기법이 많이 있으니 어렵게 생각하지 말고 시작할 것을 권유한다.
              </p>
              <p>
                그가 교직 후배들에게 하고 싶은 말은 "한때 교직에 몸담았던 분들이나 아직 교단을 지키고 계신 분들은 누가 뭐라 해도 교육자로서의 사명감을 갖고 있다"며 "교육자의 사명은 우리가 어디에서 어느 위치에 있던지 모든 사람이 행복해질 수 있는 길로 안내하고 이끌어가는 것이 아니겠냐?"고 되묻는다.
              </p>
              <p>
                교육 리포터의 『델피토레그림방』 방문, 신금숙 화가와 나눈 그림 대화 시간이 신선하고 즐거웠다. 자신이 좋아하고 하고 싶은 일을 하는 사람에게서 느껴지는 밝은 행복 에너지를 받았다.
              </p>
            </div>

            {/* 기사 하단 바 */}
            <div className="mt-10 pt-4 border-t border-[#d8d2c5] flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#736c62]">
              <span>ⓒ 한국교육신문 www.hangyo.com 무단전재 및 재배포 금지</span>
              <div className="flex gap-4">
                <a
                  href="https://www.hangyo.com/news/article.html?no=103792"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-[#1a1918] py-1.5"
                >
                  원문 기사 바로가기 ↗
                </a>
                <button
                  onClick={() => setIsNewsModalOpen(false)}
                  className="px-4 py-1.5 bg-[#3a3835] text-[#f4f1ea] rounded-sm hover:bg-[#1a1918] transition-colors"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── About (담백한 어조로 수정된 작가 소개) ──────── */}
      <section
        id="about"
        ref={aboutRef as React.RefObject<HTMLDivElement>}
        className="reveal py-28 px-6"
        style={{ background: "#f3ede5", borderTop: "1px solid #e8e2da" }}
      >
        <div className="max-w-3xl mx-auto">
          <SectionHeading ko="작가 소개" en="About Artist" isEn={isEn} />

          <div className="flex flex-col items-center gap-10 md:flex-row md:items-start md:gap-16">
            <div className="shrink-0 flex flex-col items-center">
              <div
                className="rounded-full overflow-hidden"
                style={{
                  width: 180,
                  height: 180,
                  background: "#d9d1c7",
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

            {isEn ? (
              <div style={{ fontFamily: "var(--font-sans)", lineHeight: 1.85, color: "#3a3633" }}>
                <p className="mb-4">Her childhood days spent drawing on blank paper became the warm starting point of artist Shin Keum Sook's creative inspiration. After graduating from Soodo Women's College of Education, she began her career as an art teacher at Cheonho Middle School, dedicating herself to education and inspiring students throughout her long tenure.</p>
                <p className="mb-4">Following her retirement, she opened the traditional Hanok gallery "Bidanae" in Seongbuk-dong, Seoul, creating a space for artistic exchange, and later established the "Delpittore Art Studio" in Hanam's Misa district to continue her active creative work.</p>
                <p className="mb-4">Early in her artistic path, she focused on large-scale installations, striving for grand expressions. Over time, however, her perspective shifted toward smaller, delicate life forms. Finding quiet comfort in roadside wildflowers, she began capturing their fleeting beauty into lasting eternity.</p>
                <p className="mb-6">By combining traditional silk painting with modern acrylic textures, Shin has established a distinct and original artistic world of her own.</p>
                <ul className="text-sm space-y-2" style={{ color: "#6b6360", borderTop: "1px solid #d4ccc4", paddingTop: "1.2rem" }}>
                  <li>· 1st–4th Solo Exhibitions (Oct. 2009, Oct. 2014, May 2016, Oct. 2017; Ulsan Video Gallery, Seoul Arts Center)</li>
                  <li>· Winner of the Grand Prize for Contemporary Art Competition 4 times (1986–88), Participated in 2 Contemporary Art Invitational Exhibitions (1988–89), 3 Gunja Exhibitions, 5 Teachers' Art Exhibitions, Omirang Reveals, Gazing and Thinking, Scent of Autumn, and over 40 other group exhibitions (1985–2014), 7 Invitational Exhibitions at Hanmaeum Hall Contemporary Art Center (1998–2014)</li>
                  <li>· Former President of the Ulsan Secondary Art Education Research Association</li>
                  <li>· Current Representative of Delpittore Art Studio, Member of the Professional Artists Association</li>
                </ul>
              </div>
            ) : (
              <div style={{ fontFamily: "var(--font-sans)", lineHeight: 1.85, color: "#3a3633" }}>
                <p className="mb-4">어릴 적 흰 도화지 위에 그림을 그리며 하얗게 지새우던 순수한 나날들은 작가 신금숙의 예술적 영감이 싹튼 가장 따뜻한 원점이었다. 수도여자사범대학교에서 예술적 소양을 깊이 다진 그는 천호중학교를 시작으로 미술 교사로서의 첫발을 내디뎠고, 오랜 교직 생활을 통해 학생들의 마음에 예술의 씨앗을 심어주며 묵묵히 헌신적인 발자취를 남겼다.</p>
                <p className="mb-4">교직 은퇴 후에는 평생의 염원이었던 한옥 갤러리 '비단애'를 서울 성북동에 개관해 예술가들과의 깊은 교류의 장을 마련했으며, 최근 하남시 미사지구에 '델피토레그림방'을 열어 창작의 열정을 이어가고 있다.</p>
                <p className="mb-4">예술의 길에 처음 들어섰을 때 그는 크고 웅장한 대형 오브제를 다루어야만 진정한 예술이라 여기며 치열한 고민을 겪기도 했다. 그러나 세월의 무게가 스며들면서 시선은 세상의 거대한 것에서 작고 여린 생명체들을 향해 따스하게 머물기 시작했다. 길 곁의 작은 들꽃 하나에도 깊은 애정을 담아 찰나의 아름다움을 영원으로 붙들어 매는 작업은 그렇게 시작되었다.</p>
                <p className="mb-6">이 과정에서 신금숙 작가는 전통적인 실크 염색화의 깊이 있는 영역을 단단하게 개척해 냈고, 여기에 현대적인 아크릴 물감의 질감을 과감하게 접목함으로써 세상에 존재하지 않던 독창적인 예술 세계를 견고하게 구축해 가고 있다.</p><ul className="text-sm space-y-2" style={{ color: "#6b6360", borderTop: "1px solid #d4ccc4", paddingTop: "1.2rem" }}>
                  <li>· 제1~4회 개인전 (2009.10., 2014.10., 2016.5., 2017.10. 울산 영상갤러리, 서울 예술의 전당)</li>
                  <li>· 현대미술대상 공모전 4회 입상(1986-88), 현대미술 초대전 2회(1988-89), 군자전 3회, 교원미전 5회, 오미랑 드러내다전, 바라보다 생각하다전, 가을향기전 외 그룹전 40여회 출품(1985-2014), 한마음회관 현대예술관 초대전 7회(1998-2014)</li>
                  <li>· 전) 울산중등미술교육연구회장</li>
                  <li>· 현) 델피토레그림방 대표, 전업미술가협회 회원</li>

                  <li className="pt-2">
                    <button
                      onClick={() => setIsNewsModalOpen(true)}
                      className="text-left font-medium transition-opacity hover:opacity-70 underline underline-offset-4 decoration-1 flex items-center gap-1"
                      style={{ color: "#8c6b5d" }}
                    >
                      <span>[한국교육신문] 교직 33년, 그림방에서 제2인생 펼치는 신금숙 前 교장</span>
                      <span className="text-xs">📰</span>
                    </button>
                  </li>
                
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
            <div className="max-w-sm mx-auto w-full px-4">
              {[
                { icon: "📞", label: "Phone", value: "010-4587-8428", href: "tel:010-4587-8428" },
                { icon: "✉️", label: "Email", value: "kssook8428@naver.com", href: "mailto:kssook8428@naver.com" },
                { icon: "📝", label: "Blog", value: "blog.naver.com/delpittore", href: "https://blog.naver.com/delpittore" },
                { icon: "📸", label: "Instagram", value: "@geumsookshin", href: "https://www.instagram.com/geumsookshin" },
              ].map((c) => (
                <div 
                  key={c.label} 
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
