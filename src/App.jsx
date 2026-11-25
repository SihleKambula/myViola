import { useEffect, useMemo, useRef, useState } from "react";
import FloatingPhotos from "./FloatingPhotos.jsx";

// ---------------- CONFIG: edit these ----------------
const PARTNER_NAME = "My Viola";

const MESSAGE =
  "Every day with you feels like a celebration. Thank you for all the laughs, the adventures and the little moments. I love you, and I hope this year is as wonderful as you are. ❤️";

// Files inside /public/photos — add or remove filenames here
const PHOTOS = [
  "photo1.svg",
  "photo2.svg",
  "photo3.svg",
  "photo4.svg",
  "photo5.svg",
  "photo6.svg",
  "photo7.svg",
  "photo8.svg",
];

const MUSIC_SRC = "/audio/dancin.mp3";
// ----------------------------------------------------

const CONFETTI_COLORS = [
  "#ff8fab",
  "#ffb3c6",
  "#ffd166",
  "#fff",
  "#f4a261",
  "#cdb4db",
];

function Confetti() {
  // Random pieces, generated once
  const pieces = useMemo(
    () =>
      Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 1.5,
        duration: 3.5 + Math.random() * 3,
        size: 6 + Math.random() * 8,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      })),
    [],
  );

  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 0.5,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function App() {
  const [opened, setOpened] = useState(false);
  const [muted, setMuted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const audioRef = useRef(null);

  const reducedMotion = useMemo(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  const handleOpen = () => {
    // Must happen inside the click so browsers allow audio
    audioRef.current?.play().catch(() => {});
    setOpened(true);
    setShowConfetti(true);
  };

  const toggleMute = () => {
    const next = !muted;
    if (audioRef.current) audioRef.current.muted = next;
    setMuted(next);
  };

  // Remove confetti after it finishes falling
  useEffect(() => {
    if (!showConfetti) return;
    const t = setTimeout(() => setShowConfetti(false), 9000);
    return () => clearTimeout(t);
  }, [showConfetti]);

  return (
    <div className="app">
      <audio ref={audioRef} src={MUSIC_SRC} loop preload="auto" />

      {opened && (
        <>
          <FloatingPhotos photos={PHOTOS} reducedMotion={reducedMotion} />
          {showConfetti && <Confetti />}

          <main className="center">
            <div className="card">
              <h1>Happy Birthday, {PARTNER_NAME}!</h1>
              <p>{MESSAGE}</p>
            </div>
          </main>

          <button
            className="mute-btn"
            onClick={toggleMute}
            aria-label={muted ? "Unmute music" : "Mute music"}
          >
            {muted ? "🔇" : "🔊"}
          </button>
        </>
      )}

      {!opened && (
        <button className="start-screen" onClick={handleOpen}>
          <span className="start-text">Tap to open your surprise 🎉</span>
        </button>
      )}
    </div>
  );
}
