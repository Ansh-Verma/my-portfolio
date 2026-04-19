import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/**
 * TiltCard — a 3D perspective tilt wrapper.
 * Wraps any children with a noticeable 3D tilt-to-cursor effect on hover.
 * The outer div provides perspective; the inner motion.div handles rotation.
 */
export default function TiltCard({ children, className = '', style = {}, ...rest }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const xSpring = useSpring(x, { stiffness: 120, damping: 20, mass: 0.5 });
  const ySpring = useSpring(y, { stiffness: 120, damping: 20, mass: 0.5 });

  const rotateX = useTransform(ySpring, [-0.5, 0.5], ['8deg', '-8deg']);
  const rotateY = useTransform(xSpring, [-0.5, 0.5], ['-8deg', '8deg']);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(px);
    y.set(py);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div style={{ perspective: '800px' }}>
      <motion.div
        className={className}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          willChange: 'transform',
          ...style,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.015 }}
        transition={{ scale: { duration: 0.3 } }}
        {...rest}
      >
        {children}
      </motion.div>
    </div>
  );
}
