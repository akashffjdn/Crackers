import React from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaTruck, FaBoxOpen, FaHeadset } from 'react-icons/fa';

const features = [
  {
    icon: FaShieldAlt,
    title: '100% Safe & Certified',
    description: 'Every product meets rigorous government safety standards. Licensed, tested, and approved for your peace of mind.',
    stat: '100%',
    statLabel: 'Safety Certified',
  },
  {
    icon: FaTruck,
    title: 'Pan-India Delivery',
    description: 'Fast, secure logistics with real-time tracking. Safely packaged and delivered to your doorstep across India.',
    stat: '28',
    statLabel: 'States Covered',
  },
  {
    icon: FaBoxOpen,
    title: 'Factory Direct Pricing',
    description: 'Straight from Sivakasi manufacturers. No middlemen, no markups — up to 40% savings on every order.',
    stat: '40%',
    statLabel: 'Average Savings',
  },
  {
    icon: FaHeadset,
    title: 'Dedicated Support',
    description: 'Our expert team helps you choose the perfect selection for your celebration. Available via WhatsApp and phone.',
    stat: '24/7',
    statLabel: 'Support Available',
  },
];

const Features: React.FC = () => {
  return (
    <section className="py-16 md:py-20 bg-surface-900 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <p className="text-[11px] font-semibold text-accent tracking-[0.2em] uppercase mb-4">Why Choose Us</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-[-0.02em] leading-[1.05] max-w-3xl mx-auto">
            Built on trust.<br />
            <span className="bg-gradient-to-r from-surface-300 to-surface-500 bg-clip-text text-transparent">Delivered with care.</span>
          </h2>
        </motion.div>

        {/* Feature cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="group relative p-8 md:p-10 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.1] hover:bg-white/[0.03] transition-all duration-500"
            >
              {/* Icon + content */}
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-accent/[0.08] border border-accent/[0.12] flex items-center justify-center group-hover:bg-accent/[0.12] group-hover:border-accent/[0.2] transition-all duration-500">
                  <feature.icon className="text-accent" size={20} />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-accent transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-surface-400 leading-relaxed mb-6">
                    {feature.description}
                  </p>

                  {/* Stat highlight */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-white">{feature.stat}</span>
                    <span className="text-xs text-surface-500 uppercase tracking-wider">{feature.statLabel}</span>
                  </div>
                </div>
              </div>

              {/* Subtle corner glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/[0.02] rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
