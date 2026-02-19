import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCategories } from '../context/CategoryContext';
import { FaArrowRight } from 'react-icons/fa';

const Categories: React.FC = () => {
  const { categories } = useCategories();

  const displayCategories = categories.length > 0 ? categories.slice(0, 6) : [
    { id: 'sparklers', name: 'Sparklers', heroImage: '', description: 'Handheld sparkle magic for every age' },
    { id: 'rockets', name: 'Sky Rockets', heroImage: '', description: 'Spectacular aerial performances' },
    { id: 'flower-pots', name: 'Flower Pots', heroImage: '', description: 'Mesmerizing ground displays' },
    { id: 'fancy', name: 'Fancy Collection', heroImage: '', description: 'Premium visual experiences' },
    { id: 'bombs', name: 'Sound Crackers', heroImage: '', description: 'Thunder & celebration sounds' },
    { id: 'gift-boxes', name: 'Gift Boxes', heroImage: '', description: 'Curated festival gift sets' },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const }
    }
  };

  return (
    <section className="py-16 md:py-20 bg-surface-900 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full bg-accent/[0.03] blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16"
        >
          <div>
            <p className="text-[11px] font-semibold text-accent tracking-[0.2em] uppercase mb-4">Collections</p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-[-0.02em] leading-[1.05]">
              Explore by<br />
              <span className="bg-gradient-to-r from-accent to-gold bg-clip-text text-transparent">category.</span>
            </h2>
          </div>
          <Link
            to="/shop"
            className="group inline-flex items-center gap-2 text-surface-400 hover:text-white text-sm font-medium transition-colors duration-300"
          >
            View all categories
            <FaArrowRight size={11} className="group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </motion.div>

        {/* Grid — 2 large + 4 small layout */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {displayCategories.map((cat: any, index: number) => (
            <motion.div
              key={cat.id || cat._id}
              variants={itemVariants}
              className={index < 2 ? 'lg:row-span-2' : ''}
            >
              <Link
                to={`/products/${cat.id || cat._id}`}
                className="group block relative overflow-hidden rounded-2xl bg-surface-800 border border-white/[0.04] hover:border-white/[0.1] transition-all duration-500 h-full"
              >
                {/* Image */}
                <div className={`overflow-hidden ${index < 2 ? 'h-[320px] lg:h-full' : 'h-[220px]'}`}>
                  <div
                    className="w-full h-full bg-gradient-to-br from-surface-700 to-surface-800 group-hover:scale-105 transition-transform duration-700"
                    style={{
                      backgroundImage: cat.heroImage ? `url(${cat.heroImage})` : undefined,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                </div>

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-surface-900 via-surface-900/40 to-transparent" />

                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-1.5 group-hover:text-accent transition-colors duration-300">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-surface-400 mb-4">{cat.description || 'Explore collection'}</p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    Explore <FaArrowRight size={10} />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Categories;