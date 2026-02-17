'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CertificateForm } from '@/components/certificate/certificate-form';
import { CertificatePreview } from '@/components/certificate/certificate-preview';
import { IssuingProgress } from '@/components/certificate/issuing-progress';
import { useCertificateStore } from '@/store/certificate-store';
import { generateCertificateId, generateCertificateHash } from '@/lib/hash';
import { generateCertificatePDF } from '@/lib/pdf-generator';
import { issueCertificateOnChain } from '@/lib/blockchain';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download, Sparkles, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
      const certificateId = generateCertificateId();
      
      const certData = {
        certificateId,
        recipientName: data.recipientName,
        courseName: data.courseName,
        institutionName: data.institutionName,
        issuerName: data.issuerName,
        instructorName: data.instructorName,
        issueDate: data.issueDate,
        expiryDate: data.expiryDate,
        durationFrom: data.durationFrom,
        durationTo: data.durationTo,
        grade: data.grade,
      };

      const hash = await generateCertificateHash(certData);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIssuingStep(2);

      let logoUrl = formData.logoUrl;
      let signatureUrl = formData.signatureUrl;

      if (formData.logoFile) {
        const logoRef = ref(storage, `logos/${certificateId}`);
        await uploadBytes(logoRef, formData.logoFile);
        logoUrl = await getDownloadURL(logoRef);
      }

      if (formData.signatureFile) {
        const sigRef = ref(storage, `signatures/${certificateId}`);
        await uploadBytes(sigRef, formData.signatureFile);
        signatureUrl = await getDownloadURL(sigRef);
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      setIssuingStep(3);

      const certificate = {
        certificateId,
        ...certData,
        template: data.template,
        hash,
        isRevoked: false,
        createdAt: Date.now(),
        logoUrl,
        signatureUrl,
        qrPosition: data.qrPosition,
        logoPosition: data.logoPosition,
        signaturePosition: data.signaturePosition,
      };

      await addDoc(collection(db, 'certificates'), certificate);

      await new Promise(resolve => setTimeout(resolve, 1000));
      setIssuingStep(4);

      try {
        const txHash = await issueCertificateOnChain(certificateId, hash);
        await addDoc(collection(db, 'certificates'), {
          ...certificate,
          txHash,
        });
      } catch (error) {
        console.error('Blockchain error:', error);
      }

      setIssuingStep(5);

      const pdfBytes = await generateCertificatePDF({
        ...certData,
        template: data.template,
        logoUrl,
        signatureUrl,
        qrPosition: data.qrPosition,
        logoPosition: data.logoPosition,
        signaturePosition: data.signaturePosition,
      });

      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setPdfBlob(blob);
      setIssuedCertId(certificateId);

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
        className="relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 blur-3xl" />
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-4"
          >
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-400 font-medium">Certificate Builder</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Create Certificate
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl">
            Issue blockchain-verified certificates with live preview
          </p>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {!isIssuing && !issuedCertId && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="sticky top-8">
                <CertificateForm onSubmit={handleSubmit} disabled={isIssuing} />
              </div>
            </motion.div>

            {/* Preview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="hidden lg:block"
            >
              <div className="sticky top-8">
                <div className="mb-4">
                  <p className="text-sm text-gray-500 font-medium">Live Preview</p>
                </div>
                <CertificatePreview />
              </div>
            </motion.div>
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
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl" />
              <div className="relative bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 md:p-12">
                <h2 className="text-2xl font-bold text-white mb-8 text-center">
                  Issuing Certificate
                </h2>
                <IssuingProgress currentStep={issuingStep} />
              </div>
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
            <div className="relative">
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
                className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 blur-3xl"
              />
              
              <div className="relative bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 md:p-12 text-center space-y-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 15, delay: 0.2 }}
                  className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-600"
                >
                  <CheckCircle className="w-12 h-12 text-white" />
                </motion.div>

                <div>
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl font-bold text-white mb-3"
                  >
                    Certificate Issued Successfully!
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-gray-400 text-lg"
                  >
                    Your certificate has been recorded on the blockchain
                  </motion.p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gray-800/50 rounded-2xl p-6"
                >
                  <p className="text-sm text-gray-500 mb-2 font-medium">Certificate ID</p>
                  <p className="font-mono text-white text-lg">{issuedCertId}</p>
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
                    className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 border-0 shadow-lg shadow-blue-500/25"
                  >
                    <Download className="w-5 h-5" />
                    Download PDF Certificate
                  </Button>
                  
                  <Button
                    onClick={handleCreateAnother}
                    variant="outline"
                    size="lg"
                    className="gap-2 bg-gray-900/50 border-gray-700 hover:bg-gray-800/50"
                  >
                    <Sparkles className="w-5 h-5" />
                    Create Another Certificate
                  </Button>
                  
                  <Button
                    onClick={() => router.push('/admin/issued')}
                    variant="ghost"
                    size="lg"
                    className="gap-2 group"
                  >
                    View All Certificates
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
