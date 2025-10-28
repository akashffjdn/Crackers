import React from 'react';
import { FaClipboardList, FaPaperPlane, FaTrophy } from 'react-icons/fa';
import { useContent } from '../context/ContentContext'; // ✅ Add this import

const HowItWorks: React.FC = () => {
  const { getContentValue, getSteps } = useContent(); // ✅ Add this hook
  const sectionTitle = getContentValue('howItWorksSection') || 'How It Works';
  const dynamicSteps = getSteps();

  // Icon mapping for dynamic steps
  const iconMap: { [key: string]: React.ReactElement } = {
    'FaClipboardList': <FaClipboardList />,
    'FaPaperPlane': <FaPaperPlane />,
    'FaTrophy': <FaTrophy />
  };

  // Use dynamic steps if available, otherwise fallback to default
  const steps = dynamicSteps.length > 0 ? dynamicSteps : [
    { icon: 'FaClipboardList', title: "Simple Application", description: "Answer a few questions. We do the paperwork." },
    { icon: 'FaPaperPlane', title: "Fast Filing", description: "We file and follow-up with the state." },
    { icon: 'FaTrophy', title: "Business Launched", description: "You receive your EIN, documents & dashboard access." }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-8 text-gray-900">
          {sectionTitle} {/* ✅ Dynamic title */}
        </h2>
        <div className="flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center max-w-xs">
              <div className="bg-blue-100 p-4 rounded-full mb-4 text-blue-600 text-3xl">
                {iconMap[step.icon] || <FaClipboardList />} {/* ✅ Dynamic icon */}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                {step.title} {/* ✅ Dynamic title */}
              </h3>
              <p className="text-gray-600">
                {step.description} {/* ✅ Dynamic description */}
              </p>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-full w-8 h-0.5 bg-gray-300" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
