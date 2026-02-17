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
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-20 px-4"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="mb-6"
      >
        <div className="w-20 h-20 flex items-center justify-center bg-white rounded-2xl">
          <Sparkles className="w-10 h-10 text-black" />
        </div>
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-semibold text-white mb-2 text-center"
      >
        Ready to issue your first certificate?
      </motion.h3>
      
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-gray-400 text-center mb-8 max-w-md text-sm"
      >
        Create blockchain-verified certificates that are tamper-proof and instantly verifiable by anyone, anywhere.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Link href="/admin/create">
          <Button 
            size="lg" 
            className="gap-2 bg-white hover:bg-gray-200 text-black border-0 transition-smooth group"
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
        transition={{ delay: 0.5 }}
        className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl"
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
            transition={{ delay: 0.6 + i * 0.1 }}
            className="text-center"
          >
            <p className="text-white font-medium text-sm mb-1">{feature.label}</p>
            <p className="text-xs text-gray-500">{feature.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
