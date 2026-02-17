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
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group"
    >
      <div className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.03] backdrop-blur-sm border border-white/10 rounded-2xl p-5 md:p-6 hover:border-white/20 hover:from-white/[0.12] hover:to-white/[0.05] transition-all duration-300 overflow-hidden">
        {/* Subtle animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all duration-500" />
        
        <div className="relative">
          <div className="flex items-start justify-between mb-4 md:mb-6">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: delay + 0.1, type: 'spring', stiffness: 200 }}
              className={`p-2.5 md:p-3 rounded-xl ${color} shadow-lg group-hover:scale-110 transition-transform duration-300`}
            >
              <Icon className="w-4 h-4 md:w-5 md:h-5 text-black" />
            </motion.div>
          </div>
          
          <motion.div
            key={displayValue}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-white mb-1.5 md:mb-2 tabular-nums"
          >
            {displayValue.toLocaleString()}
          </motion.div>
          
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{title}</p>
        </div>

        {/* Bottom accent line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: delay + 0.4, duration: 0.6 }}
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500/40 via-purple-500/40 to-pink-500/40 origin-left"
        />
      </div>
    </motion.div>
  );
}
