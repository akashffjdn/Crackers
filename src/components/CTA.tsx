import React from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../context/ContentContext'; // ✅ Add this import

const CTA: React.FC = () => {
  const { getContentValue } = useContent(); // ✅ Add this hook

  // ✅ Get dynamic content
  const ctaTitle = getContentValue('cta-title') || 'Ready to Light Up Your Festival?';
  const ctaSubtitle = getContentValue('cta-subtitle') || 'Don\'t wait! Order your premium crackers now and make this festival unforgettable.';
  const ctaOffer = getContentValue('cta-offer') || 'Free delivery on orders above ₹2000.';
  const primaryButton = getContentValue('cta-primary-button') || 'Order Now 🛒';
  const secondaryButton = getContentValue('cta-secondary-button') || 'Get Catalog 📋';
  const contactInfo = getContentValue('cta-contact-info') || '📞 Call us: +91 98765 43210 | 🚚 Free delivery | 💯 100% Safe';

  return (
    <section className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-16">
      <div className="max-w-4xl mx-auto text-center px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          {ctaTitle} {/* ✅ Dynamic title */}
        </h2>
        <p className="text-xl mb-6">
          {ctaSubtitle} {/* ✅ Dynamic subtitle */}
        </p>
        <p className="text-lg mb-8 text-orange-100">
          {ctaOffer} {/* ✅ Dynamic offer */}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <Link 
            to="/shop" 
            className="bg-yellow-500 text-red-700 px-8 py-3 rounded-lg text-lg font-bold hover:bg-yellow-400 transition-colors"
          >
            {primaryButton} {/* ✅ Dynamic primary button */}
          </Link>
          <Link 
            to="/catalog" 
            className="border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-bold hover:bg-white hover:text-red-600 transition-colors"
          >
            {secondaryButton} {/* ✅ Dynamic secondary button */}
          </Link>
        </div>
        <p className="text-sm text-orange-100">
          {contactInfo} {/* ✅ Dynamic contact info */}
        </p>
      </div>
    </section>
  );
};

export default CTA;
