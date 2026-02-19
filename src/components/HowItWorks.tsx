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
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7 }}
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
            {/* Timeline line */}
            <div className="absolute left-[23px] top-4 bottom-4 w-px bg-gradient-to-b from-accent/20 via-white/[0.06] to-transparent" />

            <div className="space-y-2">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, delay: index * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="group relative flex gap-6 p-6 rounded-2xl hover:bg-white/[0.02] transition-all duration-500"
                >
                  {/* Step number dot */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-[46px] h-[46px] rounded-full bg-surface-800 border border-white/[0.08] group-hover:border-accent/30 flex items-center justify-center transition-all duration-500">
                      <span className="text-xs font-bold text-surface-400 group-hover:text-accent transition-colors duration-300">
                        {step.number}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="pt-2">
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-accent transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-sm text-surface-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
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
