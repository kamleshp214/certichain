'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
  delay?: number;
}

export function StatCard({ title, value, icon: Icon, color, delay = 0 }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = value / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="group"
    >
      <div className="relative bg-gray-900 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-smooth">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-2 rounded-lg ${color}`}>
            <Icon className="w-5 h-5 text-black" />
          </div>
        </div>
        
        <motion.div
          key={displayValue}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-white mb-1 tabular-nums"
        >
          {displayValue.toLocaleString()}
        </motion.div>
        
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{title}</p>
      </div>
    </motion.div>
  );
}
