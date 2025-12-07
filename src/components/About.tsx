import React from 'react';
import { useContent } from '../context/ContentContext'; // ✅ Add this import

const About: React.FC = () => {
  const { getContentValue, getContentMetadata } = useContent(); // ✅ Add this hook

 // ✅ Get dynamic content with fallbacks - CORRECTED field IDs
const aboutTitle = getContentValue('aboutTitle') || 'Celebrating Festivals for Over 15 Years';
const aboutContent = getContentValue('aboutContent') || 'Based in the heart of Sivakasi, the fireworks capital of India, we have been bringing joy and light to millions of families across the country. Our commitment to quality, safety, and customer satisfaction has made us a trusted name in the industry.';
const aboutFeature1 = getContentValue('aboutFeature1') || 'ISO certified manufacturing facility';
const aboutFeature2 = getContentValue('aboutFeature2') || 'Government licensed and approved products';
const aboutFeature3 = getContentValue('aboutFeature3') || 'Eco-friendly and minimal smoke formulations';
const aboutFeature4 = getContentValue('aboutFeature4') || 'Pan India delivery network';
const aboutButtonText = getContentValue('aboutButtonText') || 'Learn More About Us';
const aboutBadgeText = getContentValue('aboutBadgeText') || '🏆 Award Winning Quality';
const aboutImage = getContentMetadata('aboutImage');


  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              {aboutTitle} {/* ✅ Dynamic title */}
            </h2>
            
            <p className="text-lg text-gray-600 mb-6">
              {aboutContent} {/* ✅ Dynamic content */}
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-gray-700">{aboutFeature1}</span> {/* ✅ Dynamic feature 1 */}
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-gray-700">{aboutFeature2}</span> {/* ✅ Dynamic feature 2 */}
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-gray-700">{aboutFeature3}</span> {/* ✅ Dynamic feature 3 */}
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-gray-700">{aboutFeature4}</span> {/* ✅ Dynamic feature 4 */}
              </div>
            </div>

            <button className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-red-600 hover:to-orange-600 transition-all">
              {aboutButtonText} {/* ✅ Dynamic button text */}
            </button>
          </div>

          <div className="relative">
            <img
              src={aboutImage?.imageUrl || "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=500&fit=crop"}
              alt={aboutImage?.altText || "Sivakasi crackers manufacturing"}
              className="rounded-2xl shadow-2xl w-full"
            />
            <div className="absolute -bottom-6 -left-6 bg-yellow-400 text-red-700 p-4 rounded-xl font-bold text-lg shadow-lg">
              {aboutBadgeText} {/* ✅ Dynamic badge text */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
