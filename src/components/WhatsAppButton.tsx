import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWhatsapp, FaTimes } from 'react-icons/fa';

const WhatsAppButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const phoneNumber = '919876543210'; // Replace with actual WhatsApp number
  const message = 'Hello! I would like to know more about your crackers.';

  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, duration: 0.3 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group relative w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full shadow-[0_8px_30px_rgba(34,197,94,0.4)] hover:shadow-[0_8px_40px_rgba(34,197,94,0.6)] transition-all duration-300 flex items-center justify-center"
          aria-label="WhatsApp Chat"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <FaTimes className="text-white" size={24} />
              </motion.div>
            ) : (
              <motion.div
                key="whatsapp"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <FaWhatsapp className="text-white" size={32} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pulse animation */}
          <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20" />
        </button>
      </motion.div>

      {/* Chat Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-28 right-6 z-50 w-80 max-w-[calc(100vw-3rem)]"
          >
            <div className="bg-surface-800 border border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-green-500 p-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <FaWhatsapp className="text-white" size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold">Chat with us</h4>
                  <p className="text-white/80 text-sm">Typically replies instantly</p>
                </div>
              </div>

              {/* Body */}
              <div className="p-6">
                <div className="bg-white/[0.05] rounded-xl p-4 mb-4">
                  <p className="text-surface-300 text-sm leading-relaxed">
                    Hi there! 👋<br />
                    How can we help you today?
                  </p>
                </div>

                <button
                  onClick={handleWhatsAppClick}
                  className="w-full py-3 px-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  <FaWhatsapp size={20} />
                  Start Conversation
                </button>

                <p className="text-surface-500 text-xs text-center mt-3">
                  Available 9 AM - 9 PM
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default WhatsAppButton;
