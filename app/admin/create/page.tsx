'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { useCertificateStore } from '@/store/certificate-store';
import { generateCertificateId, generateCertificateHash } from '@/lib/hash';
import { collection, addDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download, Sparkles, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Lazy load heavy components
const CertificateForm = dynamic(() => import('@/components/certificate/certificate-form').then(mod => ({ default: mod.CertificateForm })), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-900 rounded-xl animate-pulse" />
});

const CertificatePreview = dynamic(() => import('@/components/certificate/certificate-preview').then(mod => ({ default: mod.CertificatePreview })), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-900 rounded-xl animate-pulse" />
});

const IssuingProgress = dynamic(() => import('@/components/certificate/issuing-progress').then(mod => ({ default: mod.IssuingProgress })), {
  ssr: false
});

export default function CreateCertificate() {
  const router = useRouter();
  const { formData, issuingStep, setIssuingStep, resetForm } = useCertificateStore();
  const [isIssuing, setIsIssuing] = useState(false);
  const [issuedCertId, setIssuedCertId] = useState<string>();
  const [pdfBlob, setPdfBlob] = useState<Blob>();

  const handleSubmit = async (data: any) => {
    setIsIssuing(true);
    setIssuingStep(1);

    try {
      const certId = generateCertificateId();
      
      const certData = {
        certificateId: certId,
        recipientName: data.recipientName,
        courseName: data.courseName,
        institutionName: data.institutionName,
        issuerName: data.issuerName,
        instructorName: data.instructorName || '',
        issueDate: data.issueDate,
        expiryDate: data.expiryDate || '',
        durationFrom: data.durationFrom || '',
        durationTo: data.durationTo || '',
        grade: data.grade || '',
      };

      const hash = await generateCertificateHash(certData);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIssuingStep(2);

      let logoUrl = formData.logoUrl;
      let signatureUrl = formData.signatureUrl;

      if (formData.logoFile) {
        const logoRef = ref(storage, `logos/${certId}`);
        await uploadBytes(logoRef, formData.logoFile);
        logoUrl = await getDownloadURL(logoRef);
      }

      if (formData.signatureFile) {
        const sigRef = ref(storage, `signatures/${certId}`);
        await uploadBytes(sigRef, formData.signatureFile);
        signatureUrl = await getDownloadURL(sigRef);
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      setIssuingStep(3);

      const certificate = {
        ...certData,
        template: data.template,
        hash,
        isRevoked: false,
        createdAt: Date.now(),
        logoUrl: logoUrl || '',
        signatureUrl: signatureUrl || '',
        qrPosition: data.qrPosition || 'bottom-right',
        logoPosition: data.logoPosition || 'top-center',
        signaturePosition: data.signaturePosition || 'bottom-center',
      };

      const docRef = await addDoc(collection(db, 'certificates'), certificate);

      await new Promise(resolve => setTimeout(resolve, 1000));
      setIssuingStep(4);

      try {
        // Lazy load blockchain module
        const { issueCertificateOnChain } = await import('@/lib/blockchain');
        const txHash = await issueCertificateOnChain(certId, hash);
        await updateDoc(docRef, {
          txHash,
        });
      } catch (error) {
        console.error('Blockchain error:', error);
      }

      // Lazy load PDF generator
      const { generateCertificatePDF } = await import('@/lib/pdf-generator');
      const pdfBytes = await generateCertificatePDF({
        ...certData,
        template: data.template,
        logoUrl,
        signatureUrl,
        qrPosition: data.qrPosition,
        logoPosition: data.logoPosition,
        signaturePosition: data.signaturePosition,
      });

      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      setPdfBlob(blob);
      setIssuedCertId(certId);
      setIsIssuing(false); // Mark issuing as complete

    } catch (error) {
      console.error('Error issuing certificate:', error);
      alert('Failed to issue certificate. Please try again.');
      setIsIssuing(false);
      setIssuingStep(0);
    }
  };

  const handleDownload = () => {
    if (pdfBlob && issuedCertId) {
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate-${issuedCertId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleCreateAnother = () => {
    resetForm();
    setIsIssuing(false);
    setIssuedCertId(undefined);
    setPdfBlob(undefined);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-white rounded-full"
        >
          <Sparkles className="w-3 h-3 text-black" />
          <span className="text-xs text-black font-medium uppercase tracking-wide">Certificate Builder</span>
        </motion.div>
        
        <h1 className="text-white">Create Certificate</h1>
        <p className="text-gray-300 text-lg">
          Issue blockchain-verified certificates with live preview
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {!isIssuing && !issuedCertId && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* Mobile: Stacked Layout */}
            <div className="lg:hidden space-y-6">
              {/* Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <CertificateForm onSubmit={handleSubmit} disabled={isIssuing} />
              </motion.div>

              {/* Preview - Mobile: Expandable */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
                  <details className="group">
                    <summary className="cursor-pointer list-none p-4 hover:bg-gray-800 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-white">Preview Certificate</p>
                          <p className="text-xs text-gray-400 mt-1">Tap to view live preview</p>
                        </div>
                        <svg
                          className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </summary>
                    <div className="p-4 pt-0 border-t border-gray-700">
                      <div className="mt-4">
                        <CertificatePreview />
                      </div>
                    </div>
                  </details>
                </div>
              </motion.div>
            </div>

            {/* Desktop: Side by Side Layout */}
            <div className="hidden lg:grid lg:grid-cols-2 lg:gap-8">
              {/* Form Column */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <CertificateForm onSubmit={handleSubmit} disabled={isIssuing} />
              </motion.div>

              {/* Preview Column */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="sticky top-8">
                  <div className="mb-4">
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Live Preview</p>
                  </div>
                  <CertificatePreview />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {isIssuing && (
          <motion.div
            key="issuing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-gray-900 border-2 border-gray-700 rounded-2xl p-8 md:p-12">
              <h2 className="text-2xl font-semibold text-white mb-8 text-center">
                Issuing Certificate
              </h2>
              <IssuingProgress currentStep={issuingStep} />
            </div>
          </motion.div>
        )}

        {issuedCertId && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-gray-900 border-2 border-gray-700 rounded-2xl p-8 md:p-12 text-center space-y-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 15, delay: 0.2 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white mx-auto"
              >
                <CheckCircle className="w-10 h-10 text-black" />
              </motion.div>

              <div>
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-semibold text-white mb-2"
                >
                  Certificate Issued Successfully
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-300"
                >
                  Your certificate has been recorded on the blockchain
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gray-800 rounded-xl p-4 border border-gray-700"
              >
                <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">Certificate ID</p>
                <p className="font-mono text-white text-sm">{issuedCertId}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col gap-3"
              >
                <Button 
                  onClick={handleDownload} 
                  size="lg" 
                  className="gap-2 bg-white hover:bg-gray-200 text-black border-0 transition-smooth"
                >
                  <Download className="w-5 h-5" />
                  Download PDF Certificate
                </Button>
                
                <Button
                  onClick={handleCreateAnother}
                  variant="outline"
                  size="lg"
                  className="gap-2 bg-gray-800 border-2 border-gray-700 hover:bg-gray-700 text-white transition-smooth"
                >
                  <Sparkles className="w-5 h-5" />
                  Create Another Certificate
                </Button>
                
                <Button
                  onClick={() => router.push('/admin/issued')}
                  variant="ghost"
                  size="lg"
                  className="gap-2 text-gray-300 hover:text-white transition-smooth"
                >
                  View All Certificates
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
