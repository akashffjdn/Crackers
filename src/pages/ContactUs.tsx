import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaPaperPlane, FaClock, FaComments } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useContent } from '../context/ContentContext';

const ContactUs: React.FC = () => {
  const { getContentValue } = useContent();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const companyPhone = getContentValue('companyPhone') || '+91 88702 96456';
  const companyEmail = getContentValue('companyEmail') || 'akashrajapa@gmail.com';
  const companyAddress = getContentValue('companyAddress') || '123 Fireworks Street, Sivakasi, Tamil Nadu 626123';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const inputClass = "w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder-surface-500 focus:border-accent/50 focus:bg-white/[0.06] focus:outline-none transition-all duration-300";

  return (
    <div className="min-h-screen bg-surface-900">
      <Header />
      <main className="pt-20 pb-16">
        {/* Hero Section */}
        <div className="relative overflow-hidden py-12">
          {/* Background Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent/[0.06] rounded-full blur-[150px]" />
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gold/[0.06] rounded-full blur-[150px]" />
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
                <FaComments className="text-accent" size={16} />
                <span className="text-xs font-bold text-accent uppercase tracking-wider">We're Here to Help</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-[-0.02em] leading-[1.05] mb-6">
                Let's start a<br />
                <span className="bg-gradient-to-r from-accent via-rose-500 to-gold bg-clip-text text-transparent">
                  conversation.
                </span>
              </h1>
              <p className="text-xl text-surface-400 max-w-2xl mx-auto leading-relaxed">
                Got questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </motion.div>

            {/* Contact Cards Grid */}
            <div className="grid md:grid-cols-3 gap-4 mb-12">
              {/* Phone Card */}
              <motion.a
                href={`tel:${companyPhone}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="group relative p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-500 hover:shadow-[0_0_50px_rgba(59,130,246,0.15)] overflow-hidden"
              >
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <FaPhone className="text-blue-400" size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">Call Us</h3>
                  <p className="text-surface-400 text-xs mb-2">Mon-Sat, 9AM-9PM</p>
                  <p className="text-base font-semibold text-blue-400">{companyPhone}</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.a>

              {/* Email Card */}
              <motion.a
                href={`mailto:${companyEmail}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="group relative p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-500 hover:shadow-[0_0_50px_rgba(168,85,247,0.15)] overflow-hidden"
              >
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <FaEnvelope className="text-purple-400" size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">Email Us</h3>
                  <p className="text-surface-400 text-xs mb-2">Quick response</p>
                  <p className="text-base font-semibold text-purple-400 break-all">{companyEmail}</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.a>

              {/* WhatsApp Card */}
              <motion.a
                href={`https://wa.me/919876543210`}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="group relative p-6 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 hover:border-green-500/40 transition-all duration-500 hover:shadow-[0_0_50px_rgba(34,197,94,0.15)] overflow-hidden"
              >
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <FaWhatsapp className="text-green-400" size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">WhatsApp</h3>
                  <p className="text-surface-400 text-xs mb-2">Instant support</p>
                  <p className="text-base font-semibold text-green-400">Chat Now</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.a>
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Left Side - Info */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                {/* Location Card */}
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
                      <FaMapMarkerAlt className="text-accent" size={18} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">Visit Our Store</h3>
                      <p className="text-surface-300 leading-relaxed text-sm">{companyAddress}</p>
                    </div>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/[0.08]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                      <FaClock className="text-gold" size={18} />
                    </div>
                    <h3 className="text-lg font-bold text-white">Business Hours</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-3 border-b border-white/[0.06]">
                      <span className="text-surface-400">Monday - Saturday</span>
                      <span className="font-semibold text-white">9:00 AM - 9:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-white/[0.06]">
                      <span className="text-surface-400">Sunday</span>
                      <span className="font-semibold text-white">10:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-surface-400">Holidays</span>
                      <span className="font-semibold text-emerald-400">Special Hours</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Right Side - Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
              >
                <div className="p-6 rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.02] border border-white/[0.1] backdrop-blur-xl">
                  <h3 className="text-xl font-bold text-white mb-1">Send Us a Message</h3>
                  <p className="text-surface-400 mb-6 text-sm">Fill out the form and we'll respond within 24 hours.</p>

                  {submitted && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-xl mb-4 text-sm"
                    >
                      <FaPaperPlane size={14} />
                      <span className="font-semibold">Message sent! We'll respond soon.</span>
                    </motion.div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-surface-300 mb-2">Name *</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          className={inputClass}
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-surface-300 mb-2">Email *</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          className={inputClass}
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-surface-300 mb-2">Phone</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className={inputClass}
                          placeholder="+91 98765 43210"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-surface-300 mb-2">Subject *</label>
                        <input
                          type="text"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          required
                          className={inputClass}
                          placeholder="How can we help?"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-surface-300 mb-2">Message *</label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                        rows={4}
                        className={`${inputClass} resize-none`}
                        placeholder="Tell us about your inquiry..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="group w-full relative px-6 py-3.5 bg-accent text-white text-sm font-bold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(230,57,70,0.4)] hover:scale-[1.02]"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <FaPaperPlane />
                        Send Message
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-accent to-rose-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Google Map Section */}
        <div className="max-w-7xl mx-auto px-6 mt-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Find Us on the Map</h2>
              <p className="text-surface-400 text-sm">Visit our store in Sivakasi, the fireworks capital of India</p>
            </div>
            <div className="relative rounded-2xl overflow-hidden border border-white/[0.1] h-80 bg-surface-800">
              {/* Placeholder for Google Maps */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <FaMapMarkerAlt className="text-accent mx-auto mb-4" size={48} />
                  <p className="text-surface-400">Google Maps Integration</p>
                  <p className="text-sm text-surface-500 mt-2">Sivakasi, Tamil Nadu</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactUs;
