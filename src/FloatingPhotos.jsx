import { useEffect, useRef } from "react";

// Photos drift around with requestAnimationFrame and bounce off the screen edges.
export default function FloatingPhotos({ photos, reducedMotion }) {
  const elRefs = useRef([]);

  useEffect(() => {
    const speedFactor = reducedMotion ? 0.5 : 1;
    let w = window.innerWidth;
    let h = window.innerHeight;
    const small = w < 640;

    // Give every photo its own size, speed, direction, spin and opacity
    const items = photos.map(() => {
      const size = (small ? 90 : 130) + Math.random() * (small ? 60 : 110);
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.5 + Math.random() * 0.7;
      return {
        size,
        height: size * 1.2,
        x: Math.random() * Math.max(1, w - size),
        y: Math.random() * Math.max(1, h - size * 1.2),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        rot: Math.random() * 40 - 20,
        vr: (Math.random() - 0.5) * 0.15,
        opacity: 0.55 + Math.random() * 0.4,
      };
    });

    // Apply the fixed bits (size, opacity) once
    items.forEach((it, i) => {
      const el = elRefs.current[i];
      if (!el) return;
      el.style.width = `${it.size}px`;
      el.style.height = `${it.height}px`;
      el.style.opacity = it.opacity;
    });

    const onResize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    let raf;
    const tick = () => {
      items.forEach((it, i) => {
        const el = elRefs.current[i];
        if (!el) return;

        it.x += it.vx * speedFactor;
        it.y += it.vy * speedFactor;
        it.rot += it.vr * speedFactor;

        // Soft bounce off the edges
        if (it.x < 0) {
          it.x = 0;
          it.vx = Math.abs(it.vx);
        }
        if (it.x > w - it.size) {
          it.x = w - it.size;
          it.vx = -Math.abs(it.vx);
        }
        if (it.y < 0) {
          it.y = 0;
          it.vy = Math.abs(it.vy);
        }
        if (it.y > h - it.height) {
          it.y = h - it.height;
          it.vy = -Math.abs(it.vy);
        }

        el.style.transform = `translate3d(${it.x}px, ${it.y}px, 0) rotate(${it.rot}deg)`;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [photos, reducedMotion]);

  return (
    <div className="photos" aria-hidden="true">
      {photos.map((name, i) => (
        <img
          key={name + i}
          ref={(el) => (elRefs.current[i] = el)}
          className="photo"
          src={`${import.meta.env.BASE_URL}photos/${name}`}
          alt=""
          loading="lazy"
          decoding="async"
          draggable="false"
        />
      ))}
    </div>
  );
}
