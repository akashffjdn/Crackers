import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar } from 'react-icons/fa';

interface Testimonial {
  name: string;
  location: string;
  rating: number;
  text: string;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    name: 'Priya Sharma',
    location: 'Chennai',
    rating: 5,
    text: 'Best quality crackers we\'ve ever purchased. The whole family loved the display. Delivery was on time and packaging was excellent.',
    image: 'https://randomuser.me/api/portraits/women/11.jpg',
  },
  {
    name: 'Rajesh Kumar',
    location: 'Bangalore',
    rating: 5,
    text: 'Ordered in bulk for our company\'s Diwali celebration. Amazing prices and the quality exceeded our expectations. Will order again!',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    name: 'Anitha Devi',
    location: 'Mumbai',
    rating: 5,
    text: 'The gift boxes are beautifully curated. Perfect for sending to relatives. The sparklers were a hit with the kids!',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
  {
    name: 'Vikram Patel',
    location: 'Hyderabad',
    rating: 4,
    text: 'Reliable service and good variety. The festival collection had everything we needed. Customer support was very helpful.',
    image: 'https://randomuser.me/api/portraits/men/15.jpg',
  },
];

const Testimonials: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const DURATION = 6000;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
      setProgress(0);
    }, DURATION);

    const progressTimer = setInterval(() => {
      setProgress((prev) => Math.min(prev + 2, 100));
    }, DURATION / 50);

    return () => {
      clearInterval(timer);
      clearInterval(progressTimer);
    };
  }, [current]);

  return (
    <section className="py-16 md:py-20 bg-surface-900 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-accent/[0.03] rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-[11px] font-semibold text-accent tracking-[0.2em] uppercase mb-4">Testimonials</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-[-0.02em] leading-[1.05]">
            Loved by<br />
            <span className="bg-gradient-to-r from-accent to-gold bg-clip-text text-transparent">thousands.</span>
          </h2>
        </motion.div>

        {/* Main testimonial card with image */}
        <div className="max-w-5xl mx-auto">
          <div className="relative min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="grid md:grid-cols-2 gap-8 items-center p-8 md:p-12 rounded-2xl bg-white/[0.02] border border-white/[0.06]"
              >
                {/* Left: Customer Image */}
                <div className="relative">
                  {/* Image with glow */}
                  <div className="relative rounded-2xl overflow-hidden">
                    <img
                      src={testimonials[current].image}
                      alt={testimonials[current].name}
                      className="w-full h-[300px] md:h-[350px] object-cover"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-900/60 via-transparent to-transparent" />
                  </div>
                  {/* Subtle glow effect */}
                  <div className="absolute -inset-2 bg-accent/5 rounded-2xl blur-xl -z-10" />
                </div>

                {/* Right: Testimonial Content */}
                <div className="flex flex-col justify-center">
                  {/* Stars */}
                  <div className="flex items-center gap-1.5 mb-6">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FaStar
                        key={i}
                        size={18}
                        className={i < testimonials[current].rating ? 'text-gold' : 'text-surface-700'}
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-xl md:text-2xl font-light text-white leading-relaxed tracking-[-0.01em] mb-8">
                    "{testimonials[current].text}"
                  </blockquote>

                  {/* Author Info */}
                  <div className="flex items-center gap-4 pt-6 border-t border-white/[0.06]">
                    <div className="flex-1">
                      <p className="text-base font-semibold text-white mb-1">{testimonials[current].name}</p>
                      <p className="text-sm text-surface-400">{testimonials[current].location}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Dots */}
          <div className="flex items-center justify-center gap-3 mt-12">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => { setCurrent(i); setProgress(0); }}
                className="relative h-1 rounded-full overflow-hidden transition-all duration-300"
                style={{ width: i === current ? 48 : 16 }}
                aria-label={`Go to testimonial ${i + 1}`}
              >
                <div className="absolute inset-0 bg-white/[0.08]" />
                {i === current && (
                  <motion.div
                    className="absolute inset-0 bg-accent rounded-full origin-left"
                    style={{ scaleX: progress / 100 }}
                  />
                )}
                {i < current && <div className="absolute inset-0 bg-accent/40 rounded-full" />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
