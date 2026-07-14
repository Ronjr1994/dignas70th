import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { MapPin, Clock, Calendar, ChevronLeft, ChevronRight, Heart } from "lucide-react";

// ─── Photo imports (family photo excluded) ────────────────────────────────────
import pCover from "@/imports/mes4875.jpg"; // close-up portrait — dreamy upward gaze
import p1     from "@/imports/mes4872.jpg"; // full body, garden path
import p2     from "@/imports/mes4878.jpg"; // back view, flowing gown
import p3     from "@/imports/mes4847.jpg"; // umbrella pose, tropical garden
import p4     from "@/imports/mes4897.jpg"; // spinning fuchsia gown
import p5     from "@/imports/mes4886.jpg"; // red lace on railing
import p6     from "@/imports/mes4835.jpg"; // portrait at table, looking sideways
import p7     from "@/imports/mes4837.jpg"; // resting chin, direct gaze
import p8     from "@/imports/mes4867.jpg"; // low-angle portrait, smiling

// ─── Palette ──────────────────────────────────────────────────────────────────
const GOLD  = "#c9963c";
const GOLD2 = "#e8c56a";
const WINE  = "#8b1635";
const CREAM = "#fdf0e0";
const BG    = "#070006";
const ease  = [0.22, 1, 0.36, 1] as const;

// ─── Venue ────────────────────────────────────────────────────────────────────
const VENUE_NAME    = "Casa Leonila Event Place";
const VENUE_ADDRESS = "Britaña St. Montevideo Subd., Brgy. Mambog, Binangonan, Rizal";
const VENUE_MAPS    = "Casa+Leonila+Event+Place+Binangonan+Rizal+Philippines";

// ─── Gallery (9 photos, no family) ───────────────────────────────────────────
const GALLERY = [
  { src: p1,     alt: "Digna in full-length burgundy gown on garden path", caption: "Timeless Grace"   },
  { src: p2,     alt: "Elegant back view of Digna's trailing gown",         caption: "Pure Elegance"    },
  { src: p3,     alt: "Digna with umbrella in tropical garden",             caption: "Under the Skies"  },
  { src: p4,     alt: "Digna spinning in her vibrant fuchsia gown",         caption: "Dancing at 70"    },
  { src: p5,     alt: "Digna in red lace, leaning on a wooden railing",     caption: "Quiet Strength"   },
  { src: p6,     alt: "Digna at a table, serene sideways gaze",             caption: "Reflections"      },
  { src: p7,     alt: "Digna resting chin on clasped hands, direct gaze",   caption: "Seventy & Radiant"},
  { src: p8,     alt: "Low-angle portrait of Digna, warm smile",            caption: "Joy Uncontained"  },
  { src: pCover, alt: "Digna in close-up portrait, dreamy upward gaze",     caption: "Eyes on Tomorrow" },
];

// ─── Mosaic layout — 9 photos, 3-col × 5-row ─────────────────────────────────
const MOSAIC_LAYOUT = [
  { col: "1 / 3", row: "1 / 3" }, // p1 — large 2×2
  { col: "3 / 4", row: "1 / 2" }, // p2
  { col: "3 / 4", row: "2 / 3" }, // p3
  { col: "1 / 2", row: "3 / 4" }, // p4
  { col: "2 / 3", row: "3 / 4" }, // p5
  { col: "3 / 4", row: "3 / 4" }, // p6
  { col: "1 / 2", row: "4 / 5" }, // p7
  { col: "2 / 4", row: "4 / 5" }, // p8 — wide 2 cols
  { col: "1 / 4", row: "5 / 6" }, // pCover — full width banner
];

// ─── Program items ────────────────────────────────────────────────────────────
const PROGRAM = [
  { time: "3:00 PM", item: "Arrival & Registration" },
  { time: "3:30 PM", item: "Opening Prayer" },
  { time: "3:45 PM", item: "Welcome Remarks" },
  { time: "4:00 PM", item: "Birthday Celebration Proper" },
  { time: "4:30 PM", item: "Testimonials & Birthday Messages" },
  { time: "5:00 PM", item: "Special Numbers & Performances" },
  { time: "6:00 PM", item: "Dinner is Served" },
  { time: "7:00 PM", item: "Photo Opportunity" },
  { time: "8:00 PM", item: "Open Program" },
  { time: "9:00 PM", item: "Closing Prayer & Remarks" },
];

// ─── Countdown hook ───────────────────────────────────────────────────────────
function useCountdown(target: Date) {
  const calc = () => {
    const diff = Math.max(0, target.getTime() - Date.now());
    return {
      days:    Math.floor(diff / 86400000),
      hours:   Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000)  / 60000),
      seconds: Math.floor((diff % 60000)    / 1000),
    };
  };
  const [t, setT] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

// ─── Ambient particles ────────────────────────────────────────────────────────
const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  delay: Math.random() * 12,
  dur: 12 + Math.random() * 10,
  size: 2 + Math.random() * 3,
  color: i % 3 === 0 ? GOLD2 : i % 5 === 0 ? "#e8a0a0" : "rgba(201,150,60,0.55)",
}));

function Particles() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {PARTICLES.map((p) => (
        <motion.div key={p.id} className="absolute rounded-full"
          style={{ left: `${p.x}%`, top: "-2%", width: p.size, height: p.size, background: p.color, opacity: 0.38 }}
          animate={{ y: ["0vh", "108vh"], rotate: [0, 360], x: [0, Math.sin(p.id * 1.7) * 55] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </div>
  );
}

// ─── Cinematic slide ─────────────────────────────────────────────────────────
function CinematicSlide({ src, alt }: { src: string; alt: string }) {
  return (
    <motion.div className="absolute inset-0"
      initial={{ opacity: 0, scale: 1.06 }}
      animate={{ opacity: 1, scale: 1.0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ opacity: { duration: 1.1, ease: "easeInOut" }, scale: { duration: 7, ease: "linear" } }}
    >
      {/* object-position: top center ensures faces/upper body are always visible for portrait shots */}
      <ImageWithFallback src={src} alt={alt}
        className="w-full h-full object-cover"
        style={{ objectPosition: "center 15%" }}
      />
    </motion.div>
  );
}

// ─── Countdown digit ─────────────────────────────────────────────────────────
function Digit({ value, label }: { value: number; label: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <div style={{
        width: "clamp(54px,12vw,76px)", height: "clamp(54px,12vw,76px)",
        background: "rgba(139,22,53,0.15)",
        border: `1px solid rgba(201,150,60,0.28)`,
        borderRadius: 14,
        display: "flex", alignItems: "center", justifyContent: "center",
        backdropFilter: "blur(14px)",
        boxShadow: `0 8px 28px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)`,
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1,
          background: `linear-gradient(90deg, transparent, rgba(201,150,60,0.6), transparent)` }} />
        <AnimatePresence mode="wait">
          <motion.span key={value}
            initial={{ y: -14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 14, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700,
              fontSize: "clamp(1.2rem,3.5vw,1.8rem)", color: CREAM, lineHeight: 1 }}>
            {String(value).padStart(2, "0")}
          </motion.span>
        </AnimatePresence>
      </div>
      <span style={{ fontSize: "0.56rem", fontWeight: 500, letterSpacing: "0.2em",
        textTransform: "uppercase", color: "rgba(253,240,224,0.35)", fontFamily: "'Poppins', sans-serif" }}>
        {label}
      </span>
    </div>
  );
}

// ─── Photo mosaic ─────────────────────────────────────────────────────────────
function PhotoMosaic({ onPhotoClick }: { onPhotoClick: (i: number) => void }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gridTemplateRows: "repeat(4, 150px) 200px",
      gap: 5,
      borderRadius: 16,
      overflow: "hidden",
    }}>
      {GALLERY.map((ph, i) => (
        <motion.div key={i}
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: i * 0.055, ease }}
          whileHover={{ scale: 1.02, zIndex: 20 }}
          onClick={() => onPhotoClick(i)}
          style={{
            gridColumn: MOSAIC_LAYOUT[i].col,
            gridRow: MOSAIC_LAYOUT[i].row,
            position: "relative", overflow: "hidden",
            cursor: "pointer", borderRadius: 5, background: "#1a0812",
          }}
        >
          <ImageWithFallback src={ph.src} alt={ph.alt}
            className="w-full h-full object-cover"
            style={{ objectPosition: "center 15%", transition: "transform 0.5s ease" }}
          />
          {/* Hover caption overlay */}
          <motion.div
            initial={{ opacity: 0 }} whileHover={{ opacity: 1 }}
            transition={{ duration: 0.22 }}
            style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to top, rgba(7,0,6,0.9) 0%, rgba(7,0,6,0.15) 55%, transparent 100%)",
              display: "flex", alignItems: "flex-end", padding: "10px 12px",
            }}
          >
            <span style={{ fontFamily: "'Great Vibes', cursive", fontSize: "1.15rem",
              color: CREAM, textShadow: "0 1px 8px rgba(0,0,0,0.9)", lineHeight: 1 }}>
              {ph.caption}
            </span>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({ index, onClose, onNav }: { index: number; onClose: () => void; onNav: (d: 1|-1) => void }) {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNav(1);
      if (e.key === "ArrowLeft")  onNav(-1);
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  const ph = GALLERY[index];
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(7,0,6,0.96)", display: "flex",
        alignItems: "center", justifyContent: "center", backdropFilter: "blur(14px)" }}
    >
      <motion.div
        initial={{ scale: 0.88, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }} transition={{ duration: 0.38, ease }}
        onClick={(e) => e.stopPropagation()}
        style={{ position: "relative", maxWidth: "min(90vw, 500px)", width: "100%",
          borderRadius: 12, overflow: "hidden", boxShadow: "0 40px 120px rgba(0,0,0,0.85)" }}
      >
        <AnimatePresence mode="wait">
          <motion.div key={index}
            initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35, ease }}>
            <ImageWithFallback src={ph.src} alt={ph.alt}
              className="w-full" style={{ display: "block", maxHeight: "80svh", objectFit: "contain" }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "28px 18px 18px",
              background: "linear-gradient(to top, rgba(7,0,6,0.96) 0%, transparent 100%)" }}>
              <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: "1.5rem", color: CREAM, margin: 0 }}>
                {ph.caption}
              </p>
              <p style={{ fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase",
                color: "rgba(253,240,224,0.35)", margin: "4px 0 0", fontFamily: "'Poppins', sans-serif" }}>
                {index + 1} / {GALLERY.length}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {([-1, 1] as const).map((d) => (
        <button key={d} onClick={(e) => { e.stopPropagation(); onNav(d); }}
          style={{
            position: "fixed", top: "50%", transform: "translateY(-50%)",
            [d === -1 ? "left" : "right"]: 14,
            width: 42, height: 42, borderRadius: "50%",
            background: "rgba(201,150,60,0.14)", border: `1px solid rgba(201,150,60,0.28)`,
            color: CREAM, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            backdropFilter: "blur(8px)", zIndex: 210,
          }}>
          {d === -1 ? <ChevronLeft size={17} /> : <ChevronRight size={17} />}
        </button>
      ))}

      <button onClick={onClose}
        style={{ position: "fixed", top: 14, right: 14, width: 34, height: 34, borderRadius: "50%",
          background: "rgba(201,150,60,0.14)", border: `1px solid rgba(201,150,60,0.25)`,
          color: CREAM, cursor: "pointer", display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: "0.9rem", zIndex: 210 }}>✕</button>
    </motion.div>
  );
}

// ─── Horizontal filmstrip ─────────────────────────────────────────────────────
function Filmstrip({ onPhotoClick }: { onPhotoClick: (i: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div ref={ref} style={{ overflowX: "auto", scrollbarWidth: "none", cursor: "grab", paddingBottom: 2 }}
      onMouseDown={(e) => {
        const el = ref.current; if (!el) return;
        const startX = e.pageX - el.offsetLeft;
        const startScroll = el.scrollLeft;
        const move = (ev: MouseEvent) => { el.scrollLeft = startScroll - (ev.pageX - el.offsetLeft - startX); };
        const up = () => { document.removeEventListener("mousemove", move); document.removeEventListener("mouseup", up); };
        document.addEventListener("mousemove", move);
        document.addEventListener("mouseup", up);
      }}>
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease }}
        style={{ display: "flex", gap: 8, width: "max-content" }}>
        {GALLERY.map((ph, i) => (
          <motion.div key={i} whileHover={{ scale: 1.05, y: -4 }} onClick={() => onPhotoClick(i)}
            style={{ width: 130, height: 170, flexShrink: 0, borderRadius: 10, overflow: "hidden",
              cursor: "pointer", border: `1px solid rgba(201,150,60,0.14)`,
              position: "relative", background: "#1a0812" }}>
            <ImageWithFallback src={ph.src} alt={ph.alt}
              className="w-full h-full object-cover"
              style={{ objectPosition: "center 15%" }} />
            <div style={{ position: "absolute", inset: 0,
              background: "linear-gradient(to top, rgba(7,0,6,0.65) 0%, transparent 50%)" }} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

// ─── Glass card ───────────────────────────────────────────────────────────────
function GlassSection({
  children, delay = 0, style = {},
}: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, delay, ease }}
      style={{
        margin: "48px 0",
        background: "rgba(20,6,12,0.78)",
        border: `1px solid rgba(201,150,60,0.16)`,
        borderRadius: 20,
        padding: "clamp(22px,5vw,36px)",
        backdropFilter: "blur(24px)",
        boxShadow: "0 24px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.035)",
        ...style,
      }}
    >
      {children}
    </motion.section>
  );
}

// ─── Section label ────────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase",
      color: GOLD, fontWeight: 500, marginBottom: "1.2rem", fontFamily: "'Poppins', sans-serif" }}>
      {children}
    </p>
  );
}

// ─── Gold divider ─────────────────────────────────────────────────────────────
function Divider() {
  return (
    <motion.div
      initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
      transition={{ duration: 0.8, ease }}
      style={{ height: 1, background: `linear-gradient(90deg, transparent, rgba(201,150,60,0.35), transparent)`,
        margin: "1.6rem 0", transformOrigin: "center" }}
    />
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── COVER PAGE ───────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
function CoverPage({ onOpen }: { onOpen: () => void }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 300);
    const t2 = setTimeout(() => setPhase(2), 950);
    const t3 = setTimeout(() => setPhase(3), 1650);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div style={{ position: "relative", minHeight: "100svh", overflow: "hidden", background: BG }}>
      <Particles />

      {/* Full-screen portrait bg with Ken Burns */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <motion.div className="absolute inset-0"
          initial={{ scale: 1.12, opacity: 0 }}
          animate={{ scale: 1.0, opacity: 1 }}
          transition={{ scale: { duration: 10, ease: "linear" }, opacity: { duration: 1.8, ease: "easeOut" } }}>
          <ImageWithFallback src={pCover} alt="Digna Villadiego Delas Alas"
            className="w-full h-full object-cover"
            style={{ objectPosition: "center 10%" }} />
        </motion.div>
        {/* Vignettes — left-heavy so text stays readable on left */}
        <div style={{ position: "absolute", inset: 0,
          background: "linear-gradient(to right, rgba(7,0,6,0.92) 0%, rgba(7,0,6,0.55) 45%, rgba(7,0,6,0.18) 100%)" }} />
        <div style={{ position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(7,0,6,0.98) 0%, rgba(7,0,6,0.35) 38%, transparent 65%)" }} />
        <div style={{ position: "absolute", inset: 0,
          background: `radial-gradient(ellipse 55% 65% at 82% 38%, rgba(139,22,53,0.15) 0%, transparent 65%)` }} />
      </div>

      {/* Text content — sits on left side, bottom-anchored */}
      <div style={{
        position: "relative", zIndex: 10,
        minHeight: "100svh", display: "flex", flexDirection: "column",
        justifyContent: "flex-end",
        padding: "clamp(24px,6vw,60px) clamp(24px,6vw,60px) clamp(36px,8vw,64px)",
        maxWidth: "min(100%, 520px)",
      }}>
        {/* Gold accent line */}
        <motion.div
          initial={{ scaleX: 0 }} animate={{ scaleX: phase >= 1 ? 1 : 0 }}
          transition={{ duration: 0.75, ease }}
          style={{ height: 1.5, width: 56, background: `linear-gradient(90deg, ${GOLD}, ${GOLD2})`,
            transformOrigin: "left", marginBottom: "1.4rem" }}
        />

        {/* Name — contained so it doesn't overflow narrow screens */}
        <div style={{ overflow: "hidden", marginBottom: "0.15em" }}>
          <motion.h1
            initial={{ y: "110%" }} animate={{ y: phase >= 1 ? "0%" : "110%" }}
            transition={{ duration: 0.9, ease }}
            style={{ fontFamily: "'Great Vibes', cursive",
              fontSize: "clamp(2.6rem, 10vw, 5rem)", color: CREAM,
              lineHeight: 1.05, margin: 0, textShadow: `0 2px 28px rgba(201,150,60,0.2)`,
              whiteSpace: "nowrap" }}>
            Digna Villadiego
          </motion.h1>
        </div>
        <div style={{ overflow: "hidden", marginBottom: "1rem" }}>
          <motion.p
            initial={{ y: "110%" }} animate={{ y: phase >= 1 ? "0%" : "110%" }}
            transition={{ duration: 0.9, delay: 0.1, ease }}
            style={{ fontFamily: "'Great Vibes', cursive",
              fontSize: "clamp(1.8rem, 7vw, 3.4rem)", color: GOLD2,
              lineHeight: 1, margin: 0 }}>
            Delas Alas
          </motion.p>
        </div>

        {/* 70th */}
        <motion.div
          initial={{ opacity: 0, x: -18 }} animate={{ opacity: phase >= 2 ? 1 : 0, x: phase >= 2 ? 0 : -18 }}
          transition={{ duration: 0.7, ease }}
          style={{ marginBottom: "1.6rem", display: "flex", alignItems: "baseline", gap: "0.3em" }}>
          <span style={{
            fontFamily: "'Playfair Display', serif", fontWeight: 900,
            fontSize: "clamp(4rem, 17vw, 8.5rem)", lineHeight: 0.88, letterSpacing: "-0.04em",
            background: `linear-gradient(135deg, ${CREAM} 0%, ${GOLD} 50%, ${GOLD2} 100%)`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>70</span>
          <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic",
            fontSize: "clamp(1.3rem, 4.5vw, 2.2rem)", color: "rgba(253,240,224,0.5)", letterSpacing: "0.05em" }}>th</span>
        </motion.div>

        {/* Date + venue chip */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: phase >= 2 ? 1 : 0, y: phase >= 2 ? 0 : 12 }}
          transition={{ duration: 0.6, delay: 0.1, ease }}
          style={{ display: "inline-flex", alignItems: "center", gap: 8,
            padding: "7px 16px", borderRadius: 100,
            background: "rgba(201,150,60,0.11)", border: `1px solid rgba(201,150,60,0.26)`,
            backdropFilter: "blur(8px)", fontSize: "0.72rem", color: GOLD2, fontWeight: 500,
            marginBottom: "1.8rem", width: "fit-content",
            fontFamily: "'Poppins', sans-serif", letterSpacing: "0.03em" }}>
          <MapPin size={11} style={{ opacity: 0.7, flexShrink: 0 }} />
          August 8, 2026 · 3:00 PM
        </motion.div>

        {/* CTA */}
        <motion.button
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: phase >= 3 ? 1 : 0, y: phase >= 3 ? 0 : 12 }}
          transition={{ duration: 0.6, ease }}
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
          onClick={onOpen}
          style={{ display: "inline-flex", alignItems: "center", gap: 10,
            padding: "14px 30px", borderRadius: 100, width: "fit-content",
            background: `linear-gradient(135deg, ${WINE}, #5a0e22)`,
            border: `1px solid rgba(201,150,60,0.38)`, color: CREAM,
            fontFamily: "'Poppins', sans-serif", fontWeight: 600,
            fontSize: "0.82rem", letterSpacing: "0.06em",
            textTransform: "uppercase", cursor: "pointer",
            boxShadow: `0 14px 44px rgba(139,22,53,0.5), 0 0 0 1px rgba(201,150,60,0.18)` }}>
          Open Invitation
          <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>→</motion.span>
        </motion.button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── INVITATION PAGE ──────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
function InvitationPage({ onBack }: { onBack: () => void }) {
  const countdown = useCountdown(new Date("2026-08-08T15:00:00"));
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [slideIdx, setSlideIdx] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef, offset: ["start start", "end start"], layoutEffect: false,
  });
  const heroY  = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const heroOp = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  useEffect(() => {
    const id = setInterval(() => setSlideIdx((i) => (i + 1) % GALLERY.length), 5000);
    return () => clearInterval(id);
  }, []);

  const navLightbox = useCallback((d: 1 | -1) => {
    setLightbox((i) => i === null ? null : (i + d + GALLERY.length) % GALLERY.length);
  }, []);

  return (
    <div style={{ background: BG, minHeight: "100svh", fontFamily: "'Poppins', sans-serif" }}>
      <Particles />

      {/* Back button */}
      <motion.button
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
        onClick={onBack}
        style={{ position: "fixed", top: 16, left: 16, zIndex: 100,
          display: "flex", alignItems: "center", gap: 4,
          padding: "8px 16px", borderRadius: 100,
          background: "rgba(7,0,6,0.8)", border: `1px solid rgba(201,150,60,0.2)`,
          backdropFilter: "blur(16px)", color: GOLD2, fontWeight: 500,
          fontSize: "0.78rem", cursor: "pointer", letterSpacing: "0.02em" }}>
        <ChevronLeft size={14} /> Back
      </motion.button>

      {/* ── 1. Hero cinematic slideshow ── */}
      <div ref={heroRef}
        style={{ position: "relative", height: "88svh", overflow: "hidden", willChange: "transform" }}>
        {/* Parallax photo layer */}
        <motion.div style={{ y: heroY, position: "absolute", inset: "-10% 0" }}>
          <AnimatePresence mode="wait">
            <CinematicSlide key={slideIdx} src={GALLERY[slideIdx].src} alt={GALLERY[slideIdx].alt} />
          </AnimatePresence>
        </motion.div>

        {/* Overlays */}
        <div style={{ position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(7,0,6,1) 0%, rgba(7,0,6,0.45) 30%, rgba(7,0,6,0.1) 65%, transparent 100%)" }} />
        <div style={{ position: "absolute", inset: 0,
          background: "linear-gradient(to right, rgba(7,0,6,0.35) 0%, transparent 55%)" }} />

        {/* Hero text — bottom left, clear of caption */}
        <motion.div style={{ opacity: heroOp,
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: "0 clamp(20px,5vw,48px) clamp(80px,12vw,110px)" }}>
          <motion.p
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            style={{ fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase",
              color: GOLD, fontWeight: 500, marginBottom: "0.5rem" }}>
            You Are Cordially Invited
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.45 }}
            style={{ fontFamily: "'Great Vibes', cursive",
              fontSize: "clamp(2.2rem, 8vw, 4.5rem)",
              color: CREAM, lineHeight: 1.05, margin: "0 0 0.1em",
              maxWidth: "80%", /* prevents overlap with caption area */ }}>
            Digna Villadiego Delas Alas
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900,
              fontSize: "clamp(3rem, 12vw, 7rem)",
              lineHeight: 0.88, letterSpacing: "-0.04em",
              background: `linear-gradient(135deg, ${CREAM} 0%, ${GOLD} 55%, ${GOLD2} 100%)`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            70th
          </motion.div>
        </motion.div>

        {/* Slide caption — bottom RIGHT, separated from hero text */}
        <AnimatePresence mode="wait">
          <motion.p key={slideIdx}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ position: "absolute", bottom: 24, right: "clamp(16px,5vw,48px)",
              fontFamily: "'Great Vibes', cursive", fontSize: "1.2rem",
              color: "rgba(253,240,224,0.45)",
              textShadow: "0 1px 6px rgba(0,0,0,0.8)" }}>
            {GALLERY[slideIdx].caption}
          </motion.p>
        </AnimatePresence>

        {/* Slide dots — centered above caption */}
        <div style={{ position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)",
          display: "flex", gap: 5 }}>
          {GALLERY.map((_, i) => (
            <button key={i} onClick={() => setSlideIdx(i)}
              style={{ width: i === slideIdx ? 18 : 5, height: 5, borderRadius: 3,
                background: i === slideIdx ? GOLD : "rgba(253,240,224,0.22)",
                border: "none", cursor: "pointer", transition: "all 0.3s ease" }} />
          ))}
        </div>
      </div>

      {/* ── Main content ── */}
      <div style={{ position: "relative", zIndex: 10, maxWidth: 640, margin: "0 auto", padding: "0 20px 80px" }}>

        {/* ── Countdown ── */}
        <GlassSection>
          <div style={{ display: "flex", justifyContent: "center", gap: "clamp(7px,2.5vw,16px)", flexWrap: "nowrap" }}>
            <Digit value={countdown.days}    label="Days" />
            <span style={{ alignSelf: "center", paddingBottom: "1.8rem", fontSize: "1.3rem",
              color: "rgba(201,150,60,0.35)", fontWeight: 700 }}>:</span>
            <Digit value={countdown.hours}   label="Hours" />
            <span style={{ alignSelf: "center", paddingBottom: "1.8rem", fontSize: "1.3rem",
              color: "rgba(201,150,60,0.35)", fontWeight: 700 }}>:</span>
            <Digit value={countdown.minutes} label="Mins" />
            <span style={{ alignSelf: "center", paddingBottom: "1.8rem", fontSize: "1.3rem",
              color: "rgba(201,150,60,0.35)", fontWeight: 700 }}>:</span>
            <Digit value={countdown.seconds} label="Secs" />
          </div>
          <Divider />
          <p style={{ textAlign: "center", fontSize: "0.68rem", letterSpacing: "0.14em",
            textTransform: "uppercase", color: "rgba(253,240,224,0.26)" }}>
            August 8, 2026 · 3:00 PM · {VENUE_NAME}
          </p>
        </GlassSection>

        {/* ── Photo Mosaic ── */}
        <motion.section
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.6 }}
          style={{ margin: "48px 0" }}>
          <SectionLabel>Photo Album</SectionLabel>
          <PhotoMosaic onPhotoClick={(i) => setLightbox(i)} />
        </motion.section>

        {/* ── Filmstrip ── */}
        <motion.section
          initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          style={{ margin: "48px 0" }}>
          <SectionLabel>Swipe to Explore</SectionLabel>
          <Filmstrip onPhotoClick={(i) => setLightbox(i)} />
        </motion.section>

        {/* ── Event Details ── */}
        <GlassSection>
          <SectionLabel>Event Details</SectionLabel>
          {[
            { icon: Calendar, label: "Celebration",  value: "Saturday, August 8, 2026" },
            { icon: Clock,    label: "Time",          value: "3:00 PM onwards" },
            { icon: MapPin,   label: "Venue",         value: VENUE_NAME },
            { icon: MapPin,   label: "Address",       value: VENUE_ADDRESS },
          ].map(({ icon: Icon, label, value }, i, arr) => (
            <motion.div key={label}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08, ease }}
              style={{ display: "flex", alignItems: "flex-start", gap: 14,
                padding: "14px 0",
                borderBottom: i < arr.length - 1 ? `1px solid rgba(201,150,60,0.09)` : "none" }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                background: "rgba(139,22,53,0.16)", border: `1px solid rgba(201,150,60,0.18)`,
                display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2 }}>
                <Icon size={14} style={{ color: GOLD }} />
              </div>
              <div>
                <p style={{ fontSize: "0.56rem", letterSpacing: "0.18em", textTransform: "uppercase",
                  color: "rgba(253,240,224,0.32)", marginBottom: 3 }}>{label}</p>
                <p style={{ fontSize: "0.86rem", fontWeight: 500, color: CREAM, lineHeight: 1.4 }}>{value}</p>
              </div>
            </motion.div>
          ))}
        </GlassSection>

        {/* ── Program of Activities ── */}
        <GlassSection>
          <SectionLabel>Program of Activities</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {PROGRAM.map(({ time, item }, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.055, ease }}
                style={{ display: "flex", gap: 16, padding: "13px 0",
                  borderBottom: i < PROGRAM.length - 1 ? `1px solid rgba(201,150,60,0.08)` : "none",
                  alignItems: "center" }}>
                {/* Time chip */}
                <div style={{ flexShrink: 0, minWidth: 68 }}>
                  <span style={{ fontFamily: "'Playfair Display', serif",
                    fontSize: "0.72rem", fontWeight: 700, color: GOLD, letterSpacing: "0.04em" }}>
                    {time}
                  </span>
                </div>
                {/* Dot connector */}
                <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%",
                    background: i === 0 ? GOLD : `rgba(201,150,60,0.45)`,
                    border: `1px solid rgba(201,150,60,0.5)` }} />
                </div>
                {/* Item */}
                <p style={{ fontSize: "0.86rem", fontWeight: i === 0 ? 600 : 400,
                  color: i === 0 ? CREAM : "rgba(253,240,224,0.72)", lineHeight: 1.3 }}>
                  {item}
                </p>
              </motion.div>
            ))}
          </div>
        </GlassSection>

        {/* ── Map ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, ease }}
          style={{ margin: "48px 0", borderRadius: 20, overflow: "hidden",
            border: `1px solid rgba(201,150,60,0.15)`,
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
          <SectionLabel style={{ padding: "16px 20px 0", marginBottom: 0 } as any}>Location</SectionLabel>
          <p style={{ padding: "0 20px 12px", fontSize: "0.82rem", fontWeight: 500, color: CREAM }}>
            {VENUE_NAME}
          </p>
          <p style={{ padding: "0 20px 14px", fontSize: "0.72rem", color: "rgba(253,240,224,0.42)", lineHeight: 1.5 }}>
            {VENUE_ADDRESS}
          </p>
          <div style={{ height: 260 }}>
            <iframe
              title={VENUE_NAME}
              width="100%" height="260"
              style={{ border: 0, display: "block", filter: "saturate(0.75) brightness(0.82)" }}
              loading="lazy"
              src={`https://maps.google.com/maps?q=${VENUE_MAPS}&output=embed`}
            />
          </div>
          <div style={{ padding: "12px 20px", display: "flex", justifyContent: "flex-end",
            background: "rgba(20,6,12,0.9)", borderTop: `1px solid rgba(201,150,60,0.08)` }}>
            <a href={`https://www.google.com/maps/search/${VENUE_MAPS}`}
              target="_blank" rel="noopener noreferrer"
              style={{ fontSize: "0.7rem", color: GOLD, fontWeight: 500, textDecoration: "none" }}>
              Open in Google Maps →
            </a>
          </div>
        </motion.section>

        {/* ── Closing ── */}
        <motion.section
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
          style={{ margin: "48px 0", textAlign: "center" }}>
          <motion.div animate={{ scale: [1, 1.14, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            style={{ display: "inline-block", marginBottom: "1.1rem" }}>
            <Heart size={20} style={{ color: WINE }} />
          </motion.div>
          <div style={{ fontFamily: "'Great Vibes', cursive",
            fontSize: "clamp(2rem, 7.5vw, 3.3rem)", color: CREAM,
            textShadow: `0 0 36px rgba(201,150,60,0.16)`, lineHeight: 1.1, marginBottom: "0.9rem" }}>
            With All Our Love
          </div>
          <p style={{ fontSize: "0.86rem", color: "rgba(253,240,224,0.42)", lineHeight: 1.8,
            fontWeight: 300, marginBottom: "2.4rem" }}>
            Your presence is the greatest gift of all.<br />
            Please come and fill this day with joy.
          </p>
          <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 7,
            padding: "18px 30px", borderRadius: 14,
            background: "rgba(139,22,53,0.1)", border: `1px solid rgba(201,150,60,0.16)` }}>
            <p style={{ fontSize: "0.58rem", letterSpacing: "0.24em", textTransform: "uppercase",
              color: "rgba(253,240,224,0.28)" }}>Hosted with love by</p>
            <p style={{ fontSize: "0.96rem", fontWeight: 600, color: CREAM, letterSpacing: "0.02em" }}>
              The Delas Alas Family
            </p>
          </div>
          <p style={{ marginTop: "2.8rem", fontSize: "0.56rem", letterSpacing: "0.28em",
            textTransform: "uppercase", color: "rgba(253,240,224,0.13)" }}>
            August 8, 2026 · Binangonan, Rizal · Philippines
          </p>
        </motion.section>
      </div>

      <AnimatePresence>
        {lightbox !== null && (
          <Lightbox index={lightbox} onClose={() => setLightbox(null)} onNav={navLightbox} />
        )}
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── ROOT ─────────────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [page, setPage] = useState<"cover" | "invitation">("cover");
  return (
    <div style={{ width: "100%", minHeight: "100svh", background: BG, overflowX: "hidden" }}>
      <AnimatePresence mode="wait">
        {page === "cover" ? (
          <motion.div key="cover"
            exit={{ opacity: 0, scale: 0.98, filter: "blur(6px)" }}
            transition={{ duration: 0.5, ease }}>
            <CoverPage onOpen={() => setPage("invitation")} />
          </motion.div>
        ) : (
          <motion.div key="inv"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.65 }}>
            <InvitationPage onBack={() => setPage("cover")} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
