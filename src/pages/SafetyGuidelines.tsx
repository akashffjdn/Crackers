import React from 'react';
import { FaShieldAlt, FaChild, FaFireExtinguisher, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';

const guidelines = [
  {
    icon: FaShieldAlt,
    title: 'Keep Distance',
    points: ['Maintain a safe distance after lighting crackers', 'Never hold lit crackers in your hand', 'Light one cracker at a time'],
  },
  {
    icon: FaChild,
    title: 'Children Safety',
    points: ['Children should always be supervised by adults', 'Only allow age-appropriate crackers for kids', 'Keep water bucket nearby'],
  },
  {
    icon: FaFireExtinguisher,
    title: 'Fire Safety',
    points: ['Keep a fire extinguisher or water source nearby', 'Never burst crackers near flammable materials', 'Dispose burnt crackers safely'],
  },
  {
    icon: FaExclamationTriangle,
    title: 'General Precautions',
    points: ['Wear cotton clothes, avoid synthetic fabrics', 'Never try to re-light dud crackers', 'Store crackers in cool, dry place'],
  },
];

const SafetyGuidelines: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface-900">
      <Header />
      <main className="pt-24 pb-16">
        <div className="section-container px-6">
          {/* Header */}
          <div className="text-center mb-14">
            <p className="label mb-3">Safety First</p>
            <h1 className="heading-md mb-4">
              Safety <span className="text-gradient">guidelines</span>
            </h1>
            <p className="body-md max-w-lg mx-auto">
              Your safety is our priority. Follow these guidelines for a safe and enjoyable celebration.
            </p>
          </div>

          {/* Guidelines Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {guidelines.map((guide, i) => (
              <div key={i} className="card p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-accent/[0.06] border border-accent/10 flex items-center justify-center">
                    <guide.icon className="text-accent" size={16} />
                  </div>
                  <h3 className="text-base font-semibold text-white">{guide.title}</h3>
                </div>
                <ul className="space-y-3">
                  {guide.points.map((point, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm text-surface-400">
                      <FaCheckCircle className="text-emerald-500 mt-0.5 flex-shrink-0" size={12} />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SafetyGuidelines;
