import React from 'react';
import { motion } from 'framer-motion';

const marqueeItems = [
    'Sivakasi Premium',
    'Government Licensed',
    '15+ Years Legacy',
    '10,000+ Families Trust Us',
    'Pan-India Delivery',
    'Factory Direct Prices',
    '500+ Products',
    'Safe & Certified',
];

const Marquee: React.FC = () => {
    return (
        <section className="relative py-4 overflow-hidden border-y border-white/[0.04] bg-surface-900">
            <div className="flex gap-12 animate-marquee">
                {[...marqueeItems, ...marqueeItems].map((item, i) => (
                    <span
                        key={i}
                        className="flex-shrink-0 flex items-center gap-3 text-[13px] font-medium text-surface-500 tracking-wider uppercase whitespace-nowrap"
                    >
                        <span className="w-1 h-1 rounded-full bg-accent/40" />
                        {item}
                    </span>
                ))}
            </div>
        </section>
    );
};

export default Marquee;
