import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  {
    number: '01',
    title: 'Browse & Choose',
    description: 'Explore our curated collection of 500+ premium crackers. Filter by category, price, or sound level to find your perfect selection.',
  },
  {
    number: '02',
    title: 'Build Your Cart',
    description: 'Add items with one click. Adjust quantities, mix and match from different categories, or choose a pre-curated gift box.',
  },
  {
    number: '03',
    title: 'Secure Checkout',
    description: 'Pay with confidence using UPI, cards, or cash on delivery. Every transaction is encrypted and protected.',
  },
  {
    number: '04',
    title: 'Celebrate',
    description: 'Receive your safely packaged order at your doorstep. Track delivery in real time. Light up your festivities.',
  },
];

const HowItWorks: React.FC = () => {
  return (
    <section className="py-16 md:py-20 bg-surface-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left — Sticky header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:sticky lg:top-32"
          >
            <p className="text-[11px] font-semibold text-accent tracking-[0.2em] uppercase mb-4">How It Works</p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-[-0.02em] leading-[1.05] mb-6">
              Four simple<br />
              <span className="bg-gradient-to-r from-accent to-gold bg-clip-text text-transparent">steps.</span>
            </h2>
            <p className="text-lg text-surface-400 leading-relaxed max-w-md">
              From browsing to celebrating — we've made the entire experience seamless, safe, and delightful.
            </p>
          </motion.div>

          {/* Right — Steps timeline */}
          <div className="relative">
            {/* Animated Timeline line - positioned at center of 46px circles */}
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className="absolute left-[47px] top-[46px] bottom-[46px] w-[2px] bg-gradient-to-b from-accent/40 via-accent/20 to-transparent origin-top"
            />

            <div className="space-y-3">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{
                    duration: 0.7,
                    delay: index * 0.15,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  className="group relative flex gap-6 p-6 rounded-2xl hover:bg-white/[0.03] transition-all duration-500"
                >
                  {/* Step number */}
                  <motion.div
                    className="relative z-10 flex-shrink-0"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {/* Glow effect on hover */}
                    <motion.div
                      className="absolute inset-0 rounded-full bg-accent/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    />

                    <div className="relative w-[46px] h-[46px] rounded-full bg-surface-800 border-2 border-white/[0.08] group-hover:border-accent/50 flex items-center justify-center transition-all duration-500">
                      <span className="text-sm font-bold text-surface-400 group-hover:text-accent transition-colors duration-300">
                        {step.number}
                      </span>
                    </div>
                  </motion.div>

                  {/* Content with stagger animation */}
                  <motion.div
                    className="pt-2 flex-1"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 + 0.2, duration: 0.5 }}
                  >
                    <motion.h3
                      className="text-xl font-semibold text-white mb-3 group-hover:text-accent transition-colors duration-300"
                      whileHover={{ x: 4 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      {step.title}
                    </motion.h3>
                    <p className="text-sm text-surface-400 leading-relaxed">
                      {step.description}
                    </p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
