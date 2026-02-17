'use client';

import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', damping: 20 }}
      className="relative flex flex-col items-center justify-center py-20 px-4"
    >
      {/* Animated background glow */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 blur-3xl"
      />

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', damping: 15 }}
        className="relative mb-8"
      >
        <div className="relative w-32 h-32 flex items-center justify-center">
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20 blur-xl"
          />
          <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-8 rounded-3xl">
            <Sparkles className="w-16 h-16 text-white" />
          </div>
        </div>
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-3xl font-bold text-white mb-3 text-center"
      >
        Ready to issue your first certificate?
      </motion.h3>
      
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-gray-400 text-center mb-8 max-w-md text-lg"
      >
        Create blockchain-verified certificates that are tamper-proof and instantly verifiable by anyone, anywhere.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Link href="/admin/create">
          <Button 
            size="lg" 
            className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white border-0 shadow-lg shadow-blue-500/25 group"
          >
            <Sparkles className="w-5 h-5" />
            Create Your First Certificate
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </motion.div>

      {/* Feature hints */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl"
      >
        {[
          { label: 'Blockchain Secured', desc: 'Immutable records' },
          { label: 'Instant Verification', desc: 'QR code scanning' },
          { label: 'Professional PDFs', desc: 'Ready to share' },
        ].map((feature, i) => (
          <motion.div
            key={feature.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + i * 0.1 }}
            className="text-center"
          >
            <p className="text-white font-medium mb-1">{feature.label}</p>
            <p className="text-sm text-gray-500">{feature.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
