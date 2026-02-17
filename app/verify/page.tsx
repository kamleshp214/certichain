'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { QRScanner } from '@/components/verify/qr-scanner';
import { Search, QrCode, Shield, Sparkles, CheckCircle, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-950 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          {/* Animated Shield Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 15, delay: 0.1 }}
            className="relative inline-block mb-8"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-3xl"
            />
            <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-8 rounded-3xl">
              <Shield className="w-16 h-16 text-white" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
          >
            Verify Certificate
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto"
          >
            Instantly verify authenticity using blockchain technology
          </motion.p>
        </motion.div>

        {/* Verification Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 blur-3xl" />
          
          <div className="relative bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 md:p-12">
            {/* Manual Entry */}
            <div className="space-y-6 mb-8">
              <label className="block text-lg font-semibold text-white">
                Enter Certificate ID
              </label>
              <div className="flex gap-4">
                <div className="flex-1 relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl opacity-0 group-focus-within:opacity-20 blur transition-opacity" />
                  <Input
                    placeholder="CERT-XXXXXXXXX"
                    value={certificateId}
                    onChange={(e) => setCertificateId(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                    className="relative h-14 text-lg bg-gray-900/50 border-gray-700 focus:border-blue-500 transition-all"
                  />
                </div>
                <Button 
                  onClick={handleVerify} 
                  size="lg" 
                  className="h-14 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 border-0 shadow-lg shadow-blue-500/25 group"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Verify
                </Button>
              </div>
            </div>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-800"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-6 bg-gray-900/50 text-gray-500 font-medium">OR</span>
              </div>
            </div>

            {/* QR Scanner */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={() => setShowScanner(true)}
                variant="outline"
                size="lg"
                className="w-full h-14 gap-3 bg-gray-900/50 border-gray-700 hover:border-blue-500 hover:bg-gray-800/50 transition-all group"
              >
                <QrCode className="w-6 h-6 group-hover:text-blue-400 transition-colors" />
                <span className="text-lg">Scan QR Code</span>
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
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
              icon: Sparkles,
              title: 'Tamper-Proof',
              desc: 'Cryptographic integrity checks',
            },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.1 }}
              className="text-center group"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
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
