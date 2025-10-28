import React from 'react';
import { FaShieldAlt, FaExclamationTriangle, FaChild, FaWater } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';

const SafetyGuidelines: React.FC = () => {
  const safetyTips = [
    {
      icon: FaChild,
      title: 'Adult Supervision',
      description: 'Children should always be supervised by adults when handling fireworks.'
    },
    {
      icon: FaWater,
      title: 'Keep Water Ready',
      description: 'Always have a bucket of water or garden hose nearby when using fireworks.'
    },
    {
      icon: FaShieldAlt,
      title: 'Safe Distance',
      description: 'Maintain a safe distance of at least 8-10 feet from the fireworks.'
    },
    {
      icon: FaExclamationTriangle,
      title: 'Follow Instructions',
      description: 'Read and follow all instructions printed on firework packages.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Safety Guidelines</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your safety is our priority. Please follow these guidelines for a safe and enjoyable fireworks experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {safetyTips.map((tip, index) => {
            const Icon = tip.icon;
            return (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
                <Icon className="text-4xl text-red-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">{tip.title}</h3>
                <p className="text-gray-600">{tip.description}</p>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6">Detailed Safety Instructions</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-green-600">DO's</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Light only one firework at a time
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Use fireworks in open areas away from buildings
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Store fireworks in a cool, dry place
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Dispose of used fireworks in water
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-red-600">DON'Ts</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  Never try to relight a "dud" firework
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  Don't hold fireworks in your hand while lighting
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  Never use fireworks indoors
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  Don't modify or dismantle fireworks
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SafetyGuidelines;
