import React from 'react';
import { FaShieldAlt, FaTruck, FaPhone, FaCertificate } from 'react-icons/fa';
import { useContent } from '../context/ContentContext'; // ✅ Add this import

const Features: React.FC = () => {
  const { getContentValue, getFeatures } = useContent(); // ✅ Add this hook
// ✅ Get dynamic content with fallbacks - CORRECTED field IDs
const sectionTitle = getContentValue('featuresSection') || 'Why Choose Us?';
const sectionSubtitle = getContentValue('featuresSubtitle') || 'We\'re committed to making your festivals brighter and safer with our premium quality products and exceptional service.';
const dynamicFeatures = getFeatures();


  // Icon mapping for dynamic features
  const iconMap: { [key: string]: React.ReactElement } = {
    'FaShieldAlt': <FaShieldAlt className="text-3xl text-red-600" />,
    'FaTruck': <FaTruck className="text-3xl text-red-600" />,
    'FaPhone': <FaPhone className="text-3xl text-red-600" />,
    'FaCertificate': <FaCertificate className="text-3xl text-red-600" />
  };

  // Use dynamic features if available, otherwise fallback to default
  const features = dynamicFeatures.length > 0 ? dynamicFeatures.map(feature => ({
    icon: iconMap[feature.icon] || <FaShieldAlt className="text-3xl text-red-600" />,
    title: feature.title,
    description: feature.description
  })) : [
    {
      icon: <FaShieldAlt className="text-3xl text-red-600" />,
      title: "100% Safe & Legal",
      description: "All our products comply with government safety standards and regulations."
    },
    {
      icon: <FaTruck className="text-3xl text-red-600" />,
      title: "Fast Delivery",
      description: "Quick and secure delivery across India with proper packaging."
    },
    {
      icon: <FaPhone className="text-3xl text-red-600" />,
      title: "24/7 Support",
      description: "Our expert team is always ready to help you with your queries."
    },
    {
      icon: <FaCertificate className="text-3xl text-red-600" />,
      title: "Premium Quality",
      description: "Authentic Sivakasi crackers with guaranteed quality and performance."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-red-600 via-orange-600 to-yellow-500 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">{sectionTitle}</h2> {/* ✅ Dynamic title */}
          <p className="text-xl text-orange-100 max-w-3xl mx-auto">
            {sectionSubtitle} {/* ✅ Dynamic subtitle */}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 border border-white/20"
            >
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                {feature.icon} {/* ✅ Dynamic icon */}
              </div>
              <h3 className="text-xl font-bold mb-4">{feature.title}</h3> {/* ✅ Dynamic title */}
              <p className="text-orange-100">{feature.description}</p> {/* ✅ Dynamic description */}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
