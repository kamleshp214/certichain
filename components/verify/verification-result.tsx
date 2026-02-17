'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, FileX, ExternalLink, ArrowLeft } from 'lucide-react';
import { Certificate } from '@/types/certificate';

interface VerificationResultProps {
  result: 'verified' | 'tampered' | 'revoked' | 'expired' | 'not_found';
  certificate?: Certificate;
}

const resultConfig = {
  verified: {
    icon: CheckCircle,
    gradient: 'from-green-500 to-emerald-600',
    glow: 'from-green-500/20 to-emerald-500/20',
    title: 'Certificate Verified',
    message: 'This certificate is authentic and has not been tampered with.',
  },
  tampered: {
    icon: XCircle,
    gradient: 'from-red-500 to-rose-600',
    glow: 'from-red-500/20 to-rose-500/20',
    title: 'Certificate Tampered',
    message: 'This certificate has been modified and is not authentic.',
  },
  revoked: {
    icon: XCircle,
    gradient: 'from-red-500 to-rose-600',
    glow: 'from-red-500/20 to-rose-500/20',
    title: 'Certificate Revoked',
    message: 'This certificate has been revoked by the issuer.',
  },
  expired: {
    icon: AlertCircle,
    gradient: 'from-amber-500 to-orange-600',
    glow: 'from-amber-500/20 to-orange-500/20',
    title: 'Certificate Expired',
    message: 'This certificate is no longer valid.',
  },
  not_found: {
    icon: FileX,
    gradient: 'from-gray-500 to-gray-600',
    glow: 'from-gray-500/20 to-gray-600/20',
    title: 'Certificate Not Found',
    message: 'No certificate found with this ID.',
  },
};

export function VerificationResult({ result, certificate }: VerificationResultProps) {
  const config = resultConfig[result];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Result Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 20, delay: 0.2 }}
        className="relative"
      >
        {/* Animated Glow */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className={`absolute inset-0 bg-gradient-to-r ${config.glow} blur-3xl`}
        />

        <div className="relative bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-3xl overflow-hidden">
          {/* Status Header */}
          <div className={`p-8 md:p-12 bg-gradient-to-br ${config.gradient}`}>
            <div className="flex items-center gap-6">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 15, delay: 0.4 }}
                className="flex-shrink-0"
              >
                <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Icon className="w-12 h-12 text-white" />
                </div>
              </motion.div>
              
              <div>
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-3xl md:text-4xl font-bold text-white mb-2"
                >
                  {config.title}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-white/90 text-lg"
                >
                  {config.message}
                </motion.p>
              </div>
            </div>
          </div>

          {/* Certificate Details */}
          {certificate && result === 'verified' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="p-8 md:p-12 space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: 'Recipient', value: certificate.recipientName },
                  { label: 'Course', value: certificate.courseName },
                  { label: 'Issue Date', value: certificate.issueDate },
                  { label: 'Issuer', value: certificate.issuerName },
                ].map((field, i) => (
                  <motion.div
                    key={field.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    className="group"
                  >
                    <p className="text-sm text-gray-500 mb-2 font-medium">{field.label}</p>
                    <p className="text-white text-lg font-semibold group-hover:text-blue-400 transition-colors">
                      {field.value}
                    </p>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="pt-6 border-t border-gray-800"
              >
                <p className="text-sm text-gray-500 mb-2 font-medium">Certificate ID</p>
                <p className="text-white font-mono text-sm bg-gray-800/50 px-4 py-3 rounded-lg">
                  {certificate.certificateId}
                </p>
              </motion.div>

              {certificate.txHash && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3 }}
                >
                  <p className="text-sm text-gray-500 mb-2 font-medium">Blockchain Transaction</p>
                  <a
                    href={`https://amoy.polygonscan.com/tx/${certificate.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-mono bg-gray-800/50 px-4 py-3 rounded-lg hover:bg-gray-800 transition-all group"
                  >
                    <span className="truncate">{certificate.txHash}</span>
                    <ExternalLink className="w-4 h-4 flex-shrink-0 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </a>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="flex justify-center"
      >
        <a
          href="/verify"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900/50 hover:bg-gray-800/50 border border-gray-800 hover:border-gray-700 rounded-xl text-gray-400 hover:text-white transition-all group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Verify Another Certificate
        </a>
      </motion.div>
    </motion.div>
  );
}
