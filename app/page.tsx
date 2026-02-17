'use client';

import { motion } from 'framer-motion';
import { Shield, FileCheck, Scan, Lock, Zap, Globe, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
        {/* Animated background gradient */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [90, 0, 90],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-500/10 via-pink-500/10 to-blue-500/10 blur-3xl"
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center space-y-8">
          {/* Logo/Badge */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', duration: 1, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full"
          >
            <Shield className="w-5 h-5 text-white" />
            <span className="text-sm font-semibold">Blockchain-Powered Verification</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl md:text-7xl font-bold leading-tight"
          >
            Issue & Verify
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Tamper-Proof Certificates
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto"
          >
            CertiChain combines blockchain technology with modern web design to create
            certificates that are cryptographically secured and instantly verifiable.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/admin">
              <Button
                size="lg"
                className="bg-white hover:bg-gray-200 text-black font-semibold px-8 py-6 text-lg rounded-xl group"
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/verify">
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-2 border-white/20 hover:bg-white/10 text-white font-semibold px-8 py-6 text-lg rounded-xl"
              >
                <Scan className="w-5 h-5 mr-2" />
                Verify Certificate
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>


      {/* How It Works Section */}
      <section className="relative py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-400">Three simple steps to secure your certificates</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: FileCheck,
                title: 'Create Certificate',
                description: 'Fill in certificate details using our intuitive form builder with live preview.',
                step: '01',
                delay: 0.2,
              },
              {
                icon: Lock,
                title: 'Blockchain Storage',
                description: 'Certificate hash is cryptographically secured and stored on Polygon blockchain.',
                step: '02',
                delay: 0.4,
              },
              {
                icon: Scan,
                title: 'Instant Verification',
                description: 'Anyone can verify authenticity by scanning QR code or entering certificate ID.',
                step: '03',
                delay: 0.6,
              },
            ].map((item) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: item.delay }}
                whileHover={{ y: -8 }}
                className="relative group"
              >
                <div className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.03] backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-white/20 hover:from-white/[0.12] hover:to-white/[0.05] transition-all duration-300 h-full">
                  {/* Step number */}
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-xl flex items-center justify-center font-bold text-black text-lg shadow-lg">
                    {item.step}
                  </div>

                  {/* Icon */}
                  <div className="mb-6">
                    <div className="inline-flex p-4 bg-white/10 rounded-xl border border-white/20 group-hover:bg-white/20 transition-all duration-300">
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{item.description}</p>

                  {/* Bottom accent */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-pink-500/50 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 px-4 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Why CertiChain?</h2>
            <p className="text-xl text-gray-400">Built with cutting-edge technology for maximum security</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: Shield,
                title: 'Immutable Records',
                description: 'Once issued, certificates cannot be altered or deleted from the blockchain.',
              },
              {
                icon: Zap,
                title: 'Instant Verification',
                description: 'Verify authenticity in seconds without contacting the issuer.',
              },
              {
                icon: Globe,
                title: 'Globally Accessible',
                description: 'Access and verify certificates from anywhere in the world.',
              },
              {
                icon: Lock,
                title: 'Cryptographically Secure',
                description: 'SHA-256 hashing ensures tamper detection with mathematical certainty.',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex gap-4 p-6 bg-gradient-to-br from-white/[0.05] to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-xl hover:border-white/20 transition-all duration-300"
              >
                <div className="flex-shrink-0">
                  <div className="p-3 bg-white rounded-lg">
                    <feature.icon className="w-6 h-6 text-black" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="relative py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Built With Modern Tech</h2>
            <p className="text-xl text-gray-400">Powered by industry-leading technologies</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { name: 'Next.js 14', desc: 'React Framework' },
              { name: 'Polygon', desc: 'Blockchain Network' },
              { name: 'Firebase', desc: 'Cloud Database' },
              { name: 'TypeScript', desc: 'Type Safety' },
            ].map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="p-6 bg-gradient-to-br from-white/[0.08] to-white/[0.03] backdrop-blur-sm border border-white/10 rounded-xl hover:border-white/20 transition-all duration-300 text-center"
              >
                <div className="text-2xl font-bold mb-1">{tech.name}</div>
                <div className="text-sm text-gray-400">{tech.desc}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-white/20 rounded-3xl p-12 text-center overflow-hidden"
          >
            {/* Animated background */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-2xl"
            />

            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-xl text-gray-300 mb-8">
                Start issuing blockchain-verified certificates today
              </p>
              <Link href="/admin">
                <Button
                  size="lg"
                  className="bg-white hover:bg-gray-200 text-black font-semibold px-10 py-6 text-lg rounded-xl group"
                >
                  Launch Dashboard
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-6 h-6 text-white" />
            <span className="text-xl font-bold">CertiChain</span>
          </div>
          <p className="text-gray-400 mb-4">
            Blockchain-powered certificate verification platform
          </p>
          <p className="text-sm text-gray-500">
            Built with Next.js, Polygon, and Firebase
          </p>
        </div>
      </footer>
    </div>
  );
}
