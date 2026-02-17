'use client';

import { motion } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';

interface IssuingProgressProps {
  currentStep: number;
}

const steps = [
  { id: 1, label: 'Generating Hash', desc: 'Creating cryptographic signature' },
  { id: 2, label: 'Uploading Assets', desc: 'Storing images securely' },
  { id: 3, label: 'Saving to Database', desc: 'Recording certificate data' },
  { id: 4, label: 'Blockchain Transaction', desc: 'Writing to Polygon network' },
  { id: 5, label: 'Confirmed', desc: 'Certificate issued successfully' },
];

export function IssuingProgress({ currentStep }: IssuingProgressProps) {
  return (
    <div className="space-y-6">
      {steps.map((step, index) => {
        const isComplete = currentStep > step.id;
        const isCurrent = currentStep === step.id;
        const isUpcoming = currentStep < step.id;

        return (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            <div className="flex items-start gap-4">
              {/* Step Indicator */}
              <div className="relative flex-shrink-0">
                <motion.div
                  animate={{
                    scale: isCurrent ? [1, 1.2, 1] : 1,
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: isCurrent ? Infinity : 0,
                  }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                    isComplete
                      ? 'bg-white border-white'
                      : isCurrent
                      ? 'bg-gray-700 border-gray-700'
                      : 'border-gray-600 bg-gray-900'
                  }`}
                >
                  {isComplete ? (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', damping: 15 }}
                    >
                      <Check className="w-6 h-6 text-black" />
                    </motion.div>
                  ) : isCurrent ? (
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  ) : (
                    <span className="text-gray-500 font-semibold">{step.id}</span>
                  )}
                </motion.div>

                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <div className="absolute left-6 top-12 w-px h-12 bg-gray-700">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{
                        height: isComplete ? '100%' : isCurrent ? '50%' : 0,
                      }}
                      transition={{ duration: 0.5 }}
                      className={`w-full ${
                        isComplete ? 'bg-white' : 'bg-gray-700'
                      }`}
                    />
                  </div>
                )}
              </div>

              {/* Step Content */}
              <div className="flex-1 pt-2">
                <motion.p
                  animate={{
                    color: isComplete || isCurrent ? '#ffffff' : '#9ca3af',
                  }}
                  className="font-semibold text-lg mb-1"
                >
                  {step.label}
                </motion.p>
                <motion.p
                  animate={{
                    color: isComplete || isCurrent ? '#d1d5db' : '#6b7280',
                  }}
                  className="text-sm"
                >
                  {step.desc}
                </motion.p>
              </div>

              {/* Status Badge */}
              {isComplete && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="px-3 py-1 bg-white border border-white rounded-full text-xs font-medium text-black"
                >
                  Complete
                </motion.div>
              )}
              {isCurrent && (
                <motion.div
                  animate={{
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                  className="px-3 py-1 bg-gray-700 border border-gray-700 rounded-full text-xs font-medium text-white"
                >
                  Processing
                </motion.div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
