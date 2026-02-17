'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, FileX, ExternalLink, ArrowLeft, Home } from 'lucide-react';
import { Certificate } from '@/types/certificate';
import Link from 'next/link';

interface VerificationResultProps {
  result: 'verified' | 'tampered' | 'revoked' | 'expired' | 'not_found';
  certificate?: Certificate;
}

const resultConfig = {
  verified: {
    icon: CheckCircle,
    bgColor: 'bg-gray-900',
    textColor: 'text-white',
    title: 'Certificate Verified',
    message: 'This certificate is authentic and has not been tampered with.',
  },
  tampered: {
    icon: XCircle,
    bgColor: 'bg-gray-800',
    textColor: 'text-white',
    title: 'Certificate Tampered',
    message: 'This certificate has been modified and is not authentic.',
  },
  revoked: {
    icon: XCircle,
    bgColor: 'bg-gray-800',
    textColor: 'text-white',
    title: 'Certificate Revoked',
    message: 'This certificate has been revoked by the issuer.',
  },
  expired: {
    icon: AlertCircle,
    bgColor: 'bg-gray-800',
    textColor: 'text-white',
    title: 'Certificate Expired',
    message: 'This certificate is no longer valid.',
  },
  not_found: {
    icon: FileX,
    bgColor: 'bg-gray-800',
    textColor: 'text-white',
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

      {/* Result Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 20, delay: 0.2 }}
        className="bg-gray-900 border-2 border-gray-700 rounded-2xl overflow-hidden"
      >
        {/* Status Header */}
        <div className={`p-8 md:p-10 ${config.bgColor}`}>
          <div className="flex items-center gap-6">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 15, delay: 0.4 }}
              className="flex-shrink-0"
            >
              <Icon className="w-12 h-12 text-white" />
            </motion.div>
            
            <div>
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="text-2xl md:text-3xl font-bold text-white mb-1"
              >
                {config.title}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="text-white/90 text-sm md:text-base"
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
            className="p-8 md:p-10 space-y-6 bg-black"
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
                >
                  <p className="text-xs text-gray-400 mb-2 font-bold uppercase tracking-wide">{field.label}</p>
                  <p className="text-white font-medium">
                    {field.value}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="pt-6 border-t-2 border-gray-700"
            >
              <p className="text-xs text-gray-400 mb-2 font-bold uppercase tracking-wide">Certificate ID</p>
              <p className="text-white font-mono text-sm bg-gray-800 px-4 py-3 rounded-lg border border-gray-700">
                {certificate.certificateId}
              </p>
            </motion.div>

            {certificate.txHash && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 }}
              >
                <p className="text-xs text-gray-400 mb-2 font-bold uppercase tracking-wide">Blockchain Transaction</p>
                <a
                  href={`https://amoy.polygonscan.com/tx/${certificate.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-white font-mono text-xs bg-gray-800 px-4 py-3 rounded-lg border border-gray-700 hover:bg-gray-700 transition-smooth group"
                >
                  <span className="truncate">{certificate.txHash}</span>
                  <ExternalLink className="w-4 h-4 flex-shrink-0 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </a>
              </motion.div>
            )}
          </motion.div>
        )}
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
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 border-2 border-gray-700 rounded-xl text-white transition-smooth group font-medium"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Verify Another Certificate
        </a>
      </motion.div>
    </motion.div>
  );
}
