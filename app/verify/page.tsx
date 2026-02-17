'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, QrCode, Shield, CheckCircle, Lock, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Lazy load QR Scanner - only when user clicks scan button
const QRScanner = dynamic(() => import('@/components/verify/qr-scanner').then(mod => ({ default: mod.QRScanner })), {
  ssr: false
});

export default function VerifyPage() {
  const router = useRouter();
  const [certificateId, setCertificateId] = useState('');
  const [showScanner, setShowScanner] = useState(false);

  const handleVerify = () => {
    if (certificateId.trim()) {
      router.push(`/verify/${certificateId.trim()}`);
    }
  };

  const handleScan = (id: string) => {
    setShowScanner(false);
    router.push(`/verify/${id}`);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Back to Home Button - Fixed Position */}
      <Link href="/">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-white text-sm font-medium transition-all duration-200 group"
        >
          <Home className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span className="hidden sm:inline">Back to Home</span>
        </motion.button>
      </Link>

      <div className="w-full max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-black mb-6"
          >
            <Shield className="w-8 h-8 text-white" />
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Verify Certificate
          </h1>
          
          <p className="text-lg text-gray-300">
            Instantly verify authenticity using blockchain technology
          </p>
        </motion.div>

        {/* Verification Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="bg-gray-900 border-2 border-gray-700 rounded-2xl p-8 md:p-10 space-y-6"
        >
          {/* Manual Entry */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-white uppercase tracking-wide">
              Certificate ID
            </label>
            <div className="flex gap-3">
              <Input
                placeholder="Enter certificate ID..."
                value={certificateId}
                onChange={(e) => setCertificateId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                className="h-12 bg-gray-800 border-2 border-gray-700 text-white placeholder:text-gray-500 focus:border-gray-600 transition-smooth"
              />
              <Button 
                onClick={handleVerify} 
                size="lg" 
                className="h-12 px-6 bg-white hover:bg-gray-200 text-black border-0 transition-smooth"
              >
                <Search className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gray-700"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-gray-900 text-gray-300 text-sm font-bold">OR</span>
            </div>
          </div>

          {/* QR Scanner */}
          <Button
            onClick={() => setShowScanner(true)}
            variant="outline"
            size="lg"
            className="w-full h-12 gap-3 bg-gray-800 border-2 border-gray-700 hover:bg-gray-700 text-white transition-smooth"
          >
            <QrCode className="w-5 h-5" />
            <span>Scan QR Code</span>
          </Button>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            {
              icon: Lock,
              title: 'Blockchain Secured',
              desc: 'Verified against immutable records',
            },
            {
              icon: CheckCircle,
              title: 'Instant Results',
              desc: 'Real-time verification in seconds',
            },
            {
              icon: Shield,
              title: 'Tamper-Proof',
              desc: 'Cryptographic integrity checks',
            },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1, duration: 0.3 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gray-800 mb-3">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">{feature.title}</h3>
              <p className="text-xs text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {showScanner && (
          <QRScanner onScan={handleScan} onClose={() => setShowScanner(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
