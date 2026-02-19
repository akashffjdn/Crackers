import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface-900 flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/[0.03] rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative text-center max-w-md"
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.03, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-[10rem] md:text-[14rem] font-bold text-white leading-none select-none"
        >
          404
        </motion.h1>
        <div className="-mt-20">
          <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">Page not found</h2>
          <p className="text-surface-400 text-[15px] mb-10 leading-relaxed">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-accent text-white text-sm font-semibold hover:shadow-[0_0_30px_rgba(230,57,70,0.25)] transition-all duration-300"
            >
              Go Home
            </Link>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-white/[0.1] text-white text-sm font-semibold hover:bg-white/[0.04] transition-all duration-300"
            >
              Browse Shop
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
