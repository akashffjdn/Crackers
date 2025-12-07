import React, { useEffect, useState } from 'react';
import { FaStar, FaQuoteLeft, FaCheckCircle, FaSparkles } from 'react-icons/fa';
import { useContent } from '../context/ContentContext';

const Testimonials: React.FC = () => {
  const { getContentValue, getTestimonials } = useContent();
  const [visibleTestimonials, setVisibleTestimonials] = useState<number[]>([]);

  const sectionTitle = getContentValue('testimonialsSection') || 'What Our Customers Say';
  const sectionSubtitle = getContentValue('testimonialsSubtitle') || 'Don\'t just take our word for it - hear from thousands of satisfied customers who trust us for their festival celebrations.';
  const dynamicTestimonials = getTestimonials();

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

  useEffect(() => {
    testimonials.forEach((_, index) => {
      setTimeout(() => {
        setVisibleTestimonials(prev => [...prev, index]);
      }, index * 200);
    });
  }, [testimonials]);

  return (
    <section className="relative py-24 bg-gradient-to-br from-gray-50 via-white to-orange-50/30 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 text-7xl animate-float">🎆</div>
        <div className="absolute top-40 right-20 text-5xl animate-float" style={{ animationDelay: '1s' }}>✨</div>
        <div className="absolute bottom-32 left-20 text-6xl animate-float" style={{ animationDelay: '2s' }}>🎇</div>
        <div className="absolute bottom-20 right-32 text-4xl animate-float" style={{ animationDelay: '1.5s' }}>🌟</div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Enhanced Header Section */}
        <div className="text-center mb-16 animate-slide-up">
          <div className="inline-flex items-center bg-gradient-to-r from-red-100 to-orange-100 text-red-700 px-6 py-3 rounded-full text-sm font-semibold mb-6">
            <FaCheckCircle className="mr-2 text-green-500" />
            <span>Trusted by 10,000+ Happy Customers</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
            <span className="bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
              {sectionTitle}
            </span>
            <div className="flex justify-center mt-4">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar 
                    key={i} 
                    className="text-yellow-400 text-2xl animate-pulse" 
                    style={{ animationDelay: `${i * 0.1}s` }} 
                  />
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
          {testimonials.map((testimonial, index) => {
            const isVisible = visibleTestimonials.includes(index);
            
            return (
              <div 
                key={index} 
                className={`group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-red-200 transform hover:-translate-y-4 ${
                  isVisible ? 'animate-scale-in' : 'opacity-0'
                }`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Top Gradient Bar */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500"></div>
                
                {/* Quote Icon Background */}
                <div className="absolute top-6 right-6 text-red-100 group-hover:text-red-200 transition-colors duration-300">
                  <FaQuoteLeft className="text-6xl opacity-20 group-hover:opacity-40 transition-opacity" />
                </div>

                {/* Sparkle Decoration */}
                <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <FaSparkles className="text-yellow-400 animate-spin" style={{ animationDuration: '3s' }} />
                </div>

                <div className="p-8 relative z-10">
                  {/* Rating Stars */}
                  <div className="flex justify-center mb-6">
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-full px-5 py-2 flex space-x-1 border border-yellow-200">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <FaStar 
                          key={i} 
                          className="text-yellow-400 text-lg animate-pulse" 
                          style={{ animationDelay: `${i * 0.1}s` }} 
                        />
                      ))}
                    </div>
                  </div>

                  {/* Testimonial Content */}
                  <blockquote className="text-gray-700 text-lg leading-relaxed mb-6 font-medium italic relative">
                    <div className="absolute -top-2 -left-2 text-red-200 text-4xl opacity-50">"</div>
                    <span className="relative z-10">{testimonial.comment}</span>
                    <div className="absolute -bottom-4 -right-2 text-red-200 text-4xl opacity-50">"</div>
                  </blockquote>

                  {/* Customer Info */}
                  <div className="flex items-center pt-4 border-t border-gray-100">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-orange-400 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="relative w-16 h-16 rounded-full object-cover border-4 border-white shadow-xl transform group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face';
                        }}
                      />
                      <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-green-500 to-green-600 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center shadow-lg">
                        <FaCheckCircle className="text-white text-xs" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="font-bold text-gray-900 text-lg group-hover:text-red-600 transition-colors">
                        {testimonial.name}
                      </h4>
                      <p className="text-gray-500 text-sm flex items-center">
                        <span className="inline-block w-2 h-2 bg-gradient-to-r from-red-400 to-orange-400 rounded-full mr-2 animate-pulse"></span>
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Hover Effect Gradient Overlay */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-red-400/0 via-orange-400/0 to-yellow-400/0 group-hover:from-red-400/5 group-hover:via-orange-400/5 group-hover:to-yellow-400/5 transition-all duration-500 pointer-events-none"></div>

                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 rounded-3xl"></div>
              </div>
            );
          })}
        </div>

        {/* Trust Badge Section */}
        <div className="text-center animate-slide-up">
          <div className="inline-flex items-center space-x-8 bg-white rounded-2xl px-8 py-6 shadow-lg border border-gray-100">
            <div className="text-center">
              <div className="text-3xl font-extrabold bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
                10K+
              </div>
              <div className="text-sm text-gray-600 font-medium">Happy Customers</div>
            </div>
            <div className="w-px h-12 bg-gray-200"></div>
            <div className="text-center">
              <div className="text-3xl font-extrabold bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
                4.9
              </div>
              <div className="text-sm text-gray-600 font-medium">Average Rating</div>
            </div>
            <div className="w-px h-12 bg-gray-200"></div>
            <div className="text-center">
              <div className="text-3xl font-extrabold bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
                15+
              </div>
              <div className="text-sm text-gray-600 font-medium">Years Experience</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
