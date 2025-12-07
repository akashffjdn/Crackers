import React from 'react';
import { FaStar, FaQuoteLeft, FaCheckCircle } from 'react-icons/fa';
import { useContent } from '../context/ContentContext';

const Testimonials: React.FC = () => {
  const { getContentValue, getTestimonials } = useContent();

// ✅ Get dynamic content with fallbacks - CORRECTED field IDs
const sectionTitle = getContentValue('testimonialsSection') || 'What Our Customers Say';
const sectionSubtitle = getContentValue('testimonialsSubtitle') || 'Don\'t just take our word for it - hear from thousands of satisfied customers who trust us for their festival celebrations.';
const dynamicTestimonials = getTestimonials();


  // Use dynamic testimonials if available, otherwise fallback to default
  const testimonials = dynamicTestimonials.length > 0 ? dynamicTestimonials : [
    {
      name: "Rajesh Kumar",
      location: "Mumbai",
      rating: 5,
      comment: "Excellent quality crackers! The delivery was prompt and the products were exactly as described. Perfect for our Diwali celebration.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Priya Sharma",
      location: "Delhi",
      rating: 5,
      comment: "Amazing service and top-quality fireworks. The safety instructions were clear and the products were fresh. Highly recommended!",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b5bb?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Arjun Patel",
      location: "Bangalore",
      rating: 5,
      comment: "The quality of crackers was exceptional and the delivery was on time. Perfect for Diwali! Will definitely order again next year.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
    }
  ];

  return (
    <section className="relative py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 text-6xl animate-pulse">🎆</div>
        <div className="absolute top-40 right-20 text-4xl animate-bounce">✨</div>
        <div className="absolute bottom-32 left-20 text-5xl animate-pulse">🎇</div>
        <div className="absolute bottom-20 right-32 text-3xl animate-bounce">🌟</div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Enhanced Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-gradient-to-r from-red-100 to-orange-100 text-red-700 px-6 py-3 rounded-full text-sm font-semibold mb-6">
            <FaCheckCircle className="mr-2" />
            <span>Trusted by 10,000+ Happy Customers</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
            <span className="text-gray-900">{sectionTitle}</span>
            <div className="flex justify-center mt-3">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400 text-2xl animate-pulse" style={{animationDelay: `${i * 0.1}s`}} />
                ))}
              </div>
            </div>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            {sectionSubtitle}
          </p>
        </div>

        {/* Enhanced Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-red-200 transform hover:-translate-y-2"
            >
              {/* Card Header with Gradient */}
              <div className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 h-2"></div>
              
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 text-red-200 opacity-20 group-hover:opacity-40 transition-opacity">
                <FaQuoteLeft className="text-4xl" />
              </div>

              <div className="p-8">
                {/* Rating Stars */}
                <div className="flex justify-center mb-6">
                  <div className="bg-gray-50 rounded-full px-4 py-2 flex space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-400 text-lg" />
                    ))}
                  </div>
                </div>

                {/* Testimonial Content */}
                <blockquote className="text-gray-700 text-lg leading-relaxed mb-6 font-medium italic">
                  "{testimonial.comment}"
                </blockquote>

                {/* Customer Info */}
                <div className="flex items-center">
                  <div className="relative">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face';
                      }}
                    />
                    <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
                      <FaCheckCircle className="text-white text-xs" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-gray-900 text-lg">{testimonial.name}</h4>
                    <p className="text-gray-500 text-sm flex items-center">
                      <span className="inline-block w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </div>

              {/* Hover Effect Border */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Enhanced Stats Section */}
        {/* <div className="bg-gradient-to-r from-red-600 via-orange-600 to-yellow-500 rounded-3xl p-8 md:p-12 text-white text-center mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="group">
              <div className="text-4xl md:text-5xl font-extrabold mb-2 group-hover:scale-110 transition-transform">10K+</div>
              <div className="text-orange-100 font-medium">Happy Customers</div>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-extrabold mb-2 group-hover:scale-110 transition-transform">4.9</div>
              <div className="text-orange-100 font-medium">Average Rating</div>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-extrabold mb-2 group-hover:scale-110 transition-transform">15+</div>
              <div className="text-orange-100 font-medium">Years Experience</div>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-extrabold mb-2 group-hover:scale-110 transition-transform">100%</div>
              <div className="text-orange-100 font-medium">Safe & Legal</div>
            </div>
          </div>
        </div> */}

        {/* Enhanced Trust Indicators */}
        {/* <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">As Featured In</h3>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            <div className="group">
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-red-200 transform hover:scale-105">
                <div className="text-gray-600 font-bold text-lg group-hover:text-red-600 transition-colors">
                  📰 Times of India
                </div>
                <div className="text-sm text-gray-500 mt-1">Featured Article</div>
              </div>
            </div>
            
            <div className="group">
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-red-200 transform hover:scale-105">
                <div className="text-gray-600 font-bold text-lg group-hover:text-red-600 transition-colors">
                  🏆 #1 Sivakasi Brand
                </div>
                <div className="text-sm text-gray-500 mt-1">Quality Award</div>
              </div>
            </div>
            
            <div className="group">
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-red-200 transform hover:scale-105">
                <div className="text-gray-600 font-bold text-lg group-hover:text-red-600 transition-colors">
                  🛡️ ISO Certified
                </div>
                <div className="text-sm text-gray-500 mt-1">Safety Standards</div>
              </div>
            </div>
            
            <div className="group">
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-red-200 transform hover:scale-105">
                <div className="text-gray-600 font-bold text-lg group-hover:text-red-600 transition-colors">
                  🚚 Pan India
                </div>
                <div className="text-sm text-gray-500 mt-1">Delivery Network</div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default Testimonials;
