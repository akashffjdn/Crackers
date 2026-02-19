import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaPercentage,
  FaTruck,
  FaHeadset,
  FaShieldAlt,
  FaBoxOpen,
  FaClock,
  FaUsers,
  FaAward,
  FaChartLine,
  FaCheckCircle,
  FaStar,
  FaQuoteLeft
} from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';

const benefits = [
  { icon: FaPercentage, title: 'Wholesale Pricing', description: 'Get up to 50% off with bulk orders directly from the factory.', color: 'from-accent to-rose-500' },
  { icon: FaTruck, title: 'Free Delivery', description: 'Free shipping on all bulk orders above ₹10,000.', color: 'from-blue-500 to-cyan-500' },
  { icon: FaHeadset, title: 'Dedicated Support', description: 'A personal account manager for your bulk order needs.', color: 'from-purple-500 to-pink-500' },
  { icon: FaShieldAlt, title: 'Quality Assured', description: '100% genuine products with quality guarantee.', color: 'from-green-500 to-emerald-500' },
  { icon: FaBoxOpen, title: 'Custom Packaging', description: 'Branded packaging options available for corporate orders.', color: 'from-orange-500 to-amber-500' },
  { icon: FaClock, title: 'Quick Turnaround', description: 'Fast processing and delivery within 3-5 business days.', color: 'from-indigo-500 to-blue-500' },
];

const pricingTiers = [
  {
    range: '₹10,000 - ₹50,000',
    discount: '15% OFF',
    features: ['Free Delivery', 'Standard Support', 'Quality Assurance']
  },
  {
    range: '₹50,000 - ₹1,00,000',
    discount: '25% OFF',
    features: ['Free Delivery', 'Priority Support', 'Custom Packaging', 'Flexible Payment']
  },
  {
    range: '₹1,00,000+',
    discount: '35% OFF',
    features: ['Free Delivery', 'Dedicated Manager', 'Custom Packaging', 'Credit Terms', 'Exclusive Deals']
  },
];

const stats = [
  { icon: FaUsers, value: '500+', label: 'Corporate Clients' },
  { icon: FaBoxOpen, value: '10,000+', label: 'Bulk Orders Delivered' },
  { icon: FaAward, value: '98%', label: 'Client Satisfaction' },
  { icon: FaChartLine, value: '₹5Cr+', label: 'Business Volume' },
];

const useCases = [
  {
    title: 'Corporate Events',
    description: 'Office celebrations, Diwali parties, and employee gifting programs.',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop&q=80',
    icon: FaUsers,
  },
  {
    title: 'Retail Businesses',
    description: 'Stock up your store with competitive wholesale pricing.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop&q=80',
    icon: FaBoxOpen,
  },
  {
    title: 'Wedding & Events',
    description: 'Grand celebrations with customized fireworks displays.',
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=600&fit=crop&q=80',
    icon: FaStar,
  },
];

const testimonials = [
  {
    name: 'Rajesh Kumar',
    company: 'Tech Solutions Pvt Ltd',
    text: 'Ordered for our company Diwali celebration. The quality and pricing were exceptional. Our 500+ employees loved it!',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&q=80',
  },
  {
    name: 'Priya Sharma',
    company: 'Retail Chain Owner',
    text: 'Been ordering bulk from them for 3 years. Consistent quality, competitive prices, and excellent service.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&q=80',
  },
];

const BulkOrders: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    quantity: '',
    useCase: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: '', email: '', phone: '', company: '', quantity: '', useCase: '', message: '' });
  };

  const inputClass = "w-full px-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm placeholder-surface-500 focus:border-accent/40 focus:ring-1 focus:ring-accent/20 focus:outline-none transition-all duration-300";

  return (
    <div className="min-h-screen bg-surface-900">
      <Header />
      <main className="pt-28 pb-20">
        {/* Hero Section */}
        <div className="relative overflow-hidden pb-20">
          {/* Background Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[100px]" />
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center mb-16"
            >
              <p className="text-[11px] font-semibold text-accent tracking-[0.2em] uppercase mb-4">Wholesale & Bulk Orders</p>
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white tracking-[-0.02em] leading-[1.05] mb-6">
                Power your business with<br />
                <span className="bg-gradient-to-r from-accent via-rose-500 to-gold bg-clip-text text-transparent">factory-direct pricing.</span>
              </h1>
              <p className="text-lg md:text-xl text-surface-400 max-w-3xl mx-auto leading-relaxed">
                Whether you're planning a corporate event, stocking your retail store, or organizing a grand celebration—get premium quality crackers at unbeatable wholesale rates.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
                <a
                  href="#quote-form"
                  className="px-8 py-4 rounded-xl bg-accent text-white font-semibold hover:shadow-[0_0_30px_rgba(230,57,70,0.3)] transition-all duration-300"
                >
                  Request a Quote
                </a>
                <a
                  href="#pricing"
                  className="px-8 py-4 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white font-semibold hover:bg-white/[0.08] transition-all duration-300"
                >
                  View Pricing
                </a>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
            >
              {stats.map((stat, i) => (
                <div key={i} className="text-center p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                  <stat.icon className="text-accent mx-auto mb-3" size={28} />
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-surface-400">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="max-w-7xl mx-auto px-6 mb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <p className="text-[11px] font-semibold text-accent tracking-[0.2em] uppercase mb-4">Why Choose Us</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-[-0.02em] leading-[1.05] mb-4">
              Benefits of ordering in <span className="bg-gradient-to-r from-accent to-gold bg-clip-text text-transparent">bulk</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-500 hover:shadow-[0_0_40px_rgba(230,57,70,0.1)]"
              >
                <div className="relative w-16 h-16 mb-5 rounded-2xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center group-hover:bg-white/[0.08] group-hover:border-accent/30 transition-all duration-300">
                  <b.icon className="text-accent" size={28} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">{b.title}</h3>
                <p className="text-sm text-surface-400 leading-relaxed">{b.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Pricing Tiers */}
        <div id="pricing" className="max-w-7xl mx-auto px-6 mb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <p className="text-[11px] font-semibold text-accent tracking-[0.2em] uppercase mb-4">Transparent Pricing</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-[-0.02em] leading-[1.05] mb-4">
              Volume-based <span className="bg-gradient-to-r from-accent to-gold bg-clip-text text-transparent">discounts</span>
            </h2>
            <p className="text-surface-400 max-w-2xl mx-auto">
              The more you order, the more you save. Enjoy exclusive wholesale rates.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingTiers.map((tier, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative p-8 rounded-2xl border ${
                  i === 1
                    ? 'bg-gradient-to-br from-accent/10 to-gold/10 border-accent/30 shadow-[0_0_40px_rgba(230,57,70,0.15)]'
                    : 'bg-white/[0.02] border-white/[0.06]'
                }`}
              >
                {i === 1 && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-accent text-white text-xs font-semibold">
                    MOST POPULAR
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className="text-sm text-surface-400 mb-2">Order Value</div>
                  <div className="text-2xl font-bold text-white mb-3">{tier.range}</div>
                  <div className="inline-block px-4 py-2 rounded-lg bg-accent/20 border border-accent/30">
                    <span className="text-2xl font-bold bg-gradient-to-r from-accent to-gold bg-clip-text text-transparent">
                      {tier.discount}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {tier.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm">
                      <FaCheckCircle className="text-accent flex-shrink-0" size={16} />
                      <span className="text-surface-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Use Cases */}
        <div className="max-w-7xl mx-auto px-6 mb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <p className="text-[11px] font-semibold text-accent tracking-[0.2em] uppercase mb-4">Perfect For</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-[-0.02em] leading-[1.05]">
              Who orders in <span className="bg-gradient-to-r from-accent to-gold bg-clip-text text-transparent">bulk?</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {useCases.map((useCase, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative overflow-hidden rounded-2xl"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={useCase.image}
                    alt={useCase.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-900 via-surface-900/60 to-transparent" />
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="w-12 h-12 mb-4 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center">
                    <useCase.icon className="text-accent" size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{useCase.title}</h3>
                  <p className="text-sm text-surface-400">{useCase.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="max-w-7xl mx-auto px-6 mb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <p className="text-[11px] font-semibold text-accent tracking-[0.2em] uppercase mb-4">Client Stories</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-[-0.02em] leading-[1.05]">
              Trusted by <span className="bg-gradient-to-r from-accent to-gold bg-clip-text text-transparent">businesses</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06]"
              >
                <FaQuoteLeft className="text-accent/30 mb-4" size={24} />

                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <FaStar key={idx} className="text-gold" size={14} />
                  ))}
                </div>

                <p className="text-surface-300 leading-relaxed mb-6">
                  {testimonial.text}
                </p>

                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white/[0.1]"
                  />
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-surface-400">{testimonial.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quote Form */}
        <div id="quote-form" className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="max-w-3xl mx-auto p-8 md:p-12 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <div className="text-center mb-8">
                <p className="text-[11px] font-semibold text-accent tracking-[0.2em] uppercase mb-4">Get Started</p>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">Request a Custom Quote</h3>
                <p className="text-surface-400">Fill in your details and our team will get back to you within 24 hours with a customized quote.</p>
              </div>

              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm px-4 py-3 rounded-xl mb-6 flex items-center gap-3"
                >
                  <FaCheckCircle size={18} />
                  <span>Request sent! Our team will contact you within 24 hours.</span>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-semibold text-surface-400 uppercase tracking-[0.15em] mb-2.5">Full Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className={inputClass}
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-surface-400 uppercase tracking-[0.15em] mb-2.5">Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className={inputClass}
                      placeholder="you@company.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-semibold text-surface-400 uppercase tracking-[0.15em] mb-2.5">Phone *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      className={inputClass}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-surface-400 uppercase tracking-[0.15em] mb-2.5">Company Name</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className={inputClass}
                      placeholder="Your company"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-semibold text-surface-400 uppercase tracking-[0.15em] mb-2.5">Estimated Order Value</label>
                    <select
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      className={inputClass}
                    >
                      <option value="">Select range</option>
                      <option value="10k-50k">₹10,000 - ₹50,000</option>
                      <option value="50k-1L">₹50,000 - ₹1,00,000</option>
                      <option value="1L-5L">₹1,00,000 - ₹5,00,000</option>
                      <option value="5L+">₹5,00,000+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-surface-400 uppercase tracking-[0.15em] mb-2.5">Use Case</label>
                    <select
                      value={formData.useCase}
                      onChange={(e) => setFormData({ ...formData, useCase: e.target.value })}
                      className={inputClass}
                    >
                      <option value="">Select purpose</option>
                      <option value="corporate">Corporate Event</option>
                      <option value="retail">Retail Business</option>
                      <option value="wedding">Wedding/Celebration</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-surface-400 uppercase tracking-[0.15em] mb-2.5">Additional Requirements</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={5}
                    className={`${inputClass} resize-none`}
                    placeholder="Tell us about your specific needs, timeline, packaging preferences, etc."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-accent text-white text-[15px] font-semibold hover:shadow-[0_0_40px_rgba(230,57,70,0.3)] transition-all duration-300"
                >
                  Submit Request
                </button>

                <p className="text-xs text-center text-surface-500">
                  By submitting this form, you agree to our terms and privacy policy.
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BulkOrders;
