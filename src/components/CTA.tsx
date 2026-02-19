import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CTA: React.FC = () => {
  return (
    <section className="py-16 md:py-20 bg-surface-900 relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
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
          <p className="text-[11px] font-semibold text-accent tracking-[0.2em] uppercase mb-4">
            Ready to Celebrate
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-[-0.02em] leading-[1.05] max-w-3xl mx-auto mb-6">
            Start your festival<br />
            <span className="bg-gradient-to-r from-accent to-gold bg-clip-text text-transparent">
              shopping today.
            </span>
          </h2>
          <p className="text-lg text-surface-400 max-w-2xl mx-auto leading-relaxed mb-12">
            Browse 500+ premium products. Fast delivery across India. Safe, certified, and ready to light up your celebrations.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/shop"
              className="group relative inline-flex items-center justify-center gap-3 px-10 py-4 bg-accent text-white text-base font-semibold rounded-full overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(230,57,70,0.4)] hover:scale-[1.02] shadow-lg"
            >
              <span className="relative z-10">Shop Now</span>
              <svg
                className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              <div className="absolute inset-0 bg-gradient-to-r from-accent to-[#ff4757] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
            <Link
              to="/bulk-orders"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 border border-white/[0.12] text-white text-base font-semibold rounded-full hover:bg-white/[0.06] hover:border-white/[0.2] transition-all duration-300 backdrop-blur-sm"
            >
              Bulk Orders
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
