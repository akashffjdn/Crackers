import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  text = 'Loading...',
  size = 'md',
  fullScreen = false
}) => {
  // Generate random sparkle lines like firecracker burst
  const generateSparkles = (count: number) => {
    return Array.from({ length: count }, (_, i) => {
      const angle = (360 / count) * i + Math.random() * 10;
      const length = Math.random() * 40 + 60; // Random length between 60-100%
      const delay = Math.random() * 0.3;
      const duration = Math.random() * 0.5 + 1; // 1-1.5s

      return { angle, length, delay, duration };
    });
  };

  const sparkles = generateSparkles(32); // 32 sparkle lines

  const sizeConfig = {
    sm: { container: 'w-24 h-24', lineWidth: 1 },
    md: { container: 'w-32 h-32', lineWidth: 1.5 },
    lg: { container: 'w-40 h-40', lineWidth: 2 },
  };

  const config = sizeConfig[size];

  const content = (
    <div className="flex flex-col items-center justify-center gap-8">
      {/* Firecracker burst animation */}
      <div className="relative">
        <div className={`${config.container} relative`}>
          {/* Sparkle lines radiating outward */}
          {sparkles.map((sparkle, i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 origin-left"
              style={{
                rotate: `${sparkle.angle}deg`,
              }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{
                scaleX: [0, sparkle.length / 100, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: sparkle.duration,
                repeat: Infinity,
                delay: sparkle.delay,
                ease: 'easeOut',
              }}
            >
              <div
                className="h-px rounded-full"
                style={{
                  width: size === 'sm' ? '40px' : size === 'md' ? '60px' : '80px',
                  height: `${config.lineWidth}px`,
                  background: i % 3 === 0
                    ? 'linear-gradient(90deg, #e63946, #ff6b7a, transparent)'
                    : i % 3 === 1
                    ? 'linear-gradient(90deg, #d4af37, #ffd700, transparent)'
                    : 'linear-gradient(90deg, #ff8c42, #ffa500, transparent)',
                }}
              />
            </motion.div>
          ))}

          {/* Removed center white dot and shadow */}
        </div>
      </div>

      {/* Loading text */}
      {text && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <p className="text-sm font-semibold text-white mb-2">{text}</p>
          <div className="flex items-center justify-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-accent"
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        {/* Dark background with subtle glow */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(230,57,70,0.08) 0%, rgba(212,175,55,0.05) 40%, transparent 70%)',
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        {/* Logo and spinner */}
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center text-white text-lg font-bold shadow-lg">
                ✦
              </span>
              <span className="text-2xl font-bold text-white">Akash Cracker</span>
            </div>
            <p className="text-xs text-surface-400 tracking-[0.2em] uppercase">Premium Sivakasi Fireworks</p>
          </motion.div>

          {content}
        </div>
      </div>
    );
  }

  return <div className="py-12">{content}</div>;
};

export default LoadingSpinner;
