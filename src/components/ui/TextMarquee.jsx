import React, { useRef, useEffect } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useAnimationFrame,
  useMotionValue,
} from 'framer-motion';

function wrap(min, max, v) {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
}

/**
 * TextMarquee — A scroll-responsive infinite text marquee.
 * Inspired by 21st.dev's Text Marque component, adapted for plain JSX + Framer Motion.
 */
export default function TextMarquee({
  children,
  baseVelocity = -3,
  className = '',
}) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 2], {
    clamp: false,
  });

  const x = useTransform(baseX, (v) => `${wrap(-25, -50, v)}%`);

  const directionFactor = useRef(1);

  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="overflow-hidden whitespace-nowrap flex flex-nowrap">
      <motion.div
        className="flex whitespace-nowrap flex-nowrap"
        style={{ x, gap: '2rem' }}
      >
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={className}
            style={{
              display: 'block',
              fontSize: 'clamp(2rem, 5vw, 4.5rem)',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              lineHeight: 1,
              WebkitTextStroke: '1px rgba(255,255,255,0.08)',
              color: 'transparent',
              userSelect: 'none',
            }}
          >
            {children}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
