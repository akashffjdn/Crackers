import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaQuoteLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface Testimonial {
  name: string;
  location: string;
  rating: number;
  text: string;
  image: string;
  role: string;
}

const testimonials: Testimonial[] = [
  {
    name: 'Priya Sharma',
    location: 'Chennai',
    role: 'Festival Organizer',
    rating: 5,
    text: 'Best quality crackers we\'ve ever purchased. The whole family loved the display. Delivery was on time and packaging was excellent.',
    image: 'https://randomuser.me/api/portraits/women/11.jpg',
  },
  {
    name: 'Rajesh Kumar',
    location: 'Bangalore',
    role: 'Business Owner',
    rating: 5,
    text: 'Ordered in bulk for our company\'s Diwali celebration. Amazing prices and the quality exceeded our expectations. Will order again!',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    name: 'Anitha Devi',
    location: 'Mumbai',
    role: 'Happy Customer',
    rating: 5,
    text: 'The gift boxes are beautifully curated. Perfect for sending to relatives. The sparklers were a hit with the kids!',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
  {
    name: 'Vikram Patel',
    location: 'Hyderabad',
    role: 'Event Planner',
    rating: 4,
    text: 'Reliable service and good variety. The festival collection had everything we needed. Customer support was very helpful.',
    image: 'https://randomuser.me/api/portraits/men/15.jpg',
  },
  {
    name: 'Lakshmi Reddy',
    location: 'Delhi',
    role: 'Regular Customer',
    rating: 5,
    text: 'Outstanding quality and service! The crackers were vibrant and long-lasting. Highly recommend for all occasions.',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    name: 'Arun Krishnan',
    location: 'Pune',
    role: 'Corporate Client',
    rating: 5,
    text: 'Professional packaging and timely delivery. The bulk order discount was fantastic. Will continue to order from them.',
    image: 'https://randomuser.me/api/portraits/men/52.jpg',
  },
];

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const itemsPerPage = 3;
  const maxIndex = Math.max(0, testimonials.length - itemsPerPage);

  const next = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <section className="py-20 bg-surface-900 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-bold uppercase tracking-wider mb-4">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            What Our <span className="bg-gradient-to-r from-accent to-gold bg-clip-text text-transparent">Customers Say</span>
          </h2>
          <p className="text-surface-400 text-lg max-w-2xl mx-auto">
            Don't just take our word for it - hear from our satisfied customers
          </p>
        </motion.div>

        {/* Testimonials Grid with Carousel */}
        <div className="relative">
          <div className="overflow-hidden">
            <motion.div
              animate={{ x: -currentIndex * (100 / itemsPerPage) + '%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="flex gap-6"
            >
              {testimonials.map((testimonial, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex-shrink-0 w-full md:w-[calc(33.333%-16px)]"
                  style={{ minWidth: 'calc(33.333% - 16px)' }}
                >
                  <div className="h-full bg-surface-800/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-accent/30 transition-all duration-300 group">
                    {/* Quote Icon */}
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-gold/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <FaQuoteLeft className="text-accent text-xl" />
                    </div>

                    {/* Stars */}
                    <div className="flex items-center gap-1 mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FaStar
                          key={i}
                          size={16}
                          className={i < testimonial.rating ? 'text-gold' : 'text-surface-700'}
                        />
                      ))}
                    </div>

                    {/* Review Text */}
                    <p className="text-surface-300 text-sm leading-relaxed mb-6 line-clamp-4">
                      "{testimonial.text}"
                    </p>

                    {/* Customer Info */}
                    <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-accent/30">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-semibold text-sm">{testimonial.name}</h4>
                        <p className="text-surface-500 text-xs">{testimonial.role} • {testimonial.location}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-center gap-4 mt-12">
            <button
              onClick={prev}
              disabled={currentIndex === 0}
              className="w-12 h-12 rounded-full bg-surface-800/60 border border-white/10 flex items-center justify-center text-white hover:bg-accent hover:border-accent disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-surface-800/60 transition-all"
              aria-label="Previous testimonials"
            >
              <FaChevronLeft />
            </button>

            {/* Progress indicators */}
            <div className="flex items-center gap-2">
              {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentIndex ? 'w-8 bg-accent' : 'w-2 bg-surface-700 hover:bg-surface-600'
                  }`}
                  aria-label={`Go to page ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              disabled={currentIndex === maxIndex}
              className="w-12 h-12 rounded-full bg-surface-800/60 border border-white/10 flex items-center justify-center text-white hover:bg-accent hover:border-accent disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-surface-800/60 transition-all"
              aria-label="Next testimonials"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
        >
          {[
            { value: '10K+', label: 'Happy Customers' },
            { value: '4.8/5', label: 'Average Rating' },
            { value: '98%', label: 'Satisfaction Rate' },
            { value: '15+', label: 'Years Experience' },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="text-center p-6 rounded-xl bg-white/5 border border-white/10"
            >
              <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-sm text-surface-400">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
