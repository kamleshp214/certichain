'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Certificate } from '@/types/certificate';
import { generateCertificateHash } from '@/lib/hash';
import { Loader2 } from 'lucide-react';

// Lazy load verification result component
const VerificationResult = dynamic(() => import('@/components/verify/verification-result').then(mod => ({ default: mod.VerificationResult })), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 className="w-12 h-12 text-white animate-spin" />
    </div>
  )
});

export default function VerifyCertificatePage() {
  const params = useParams();
  const certificateId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<'verified' | 'tampered' | 'revoked' | 'expired' | 'not_found'>('not_found');
  const [certificate, setCertificate] = useState<Certificate>();

  useEffect(() => {
    verifyCertificate();
  }, [certificateId]);

  const verifyCertificate = async () => {
    try {
      const certsRef = collection(db, 'certificates');
      const q = query(certsRef, where('certificateId', '==', certificateId));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setResult('not_found');
        logVerification('not_found');
        return;
      }

      const certDoc = snapshot.docs[0];
      const cert = { id: certDoc.id, ...certDoc.data() } as Certificate;
      setCertificate(cert);

      if (cert.isRevoked) {
        setResult('revoked');
        logVerification('revoked');
        return;
      }

      const calculatedHash = await generateCertificateHash({
        certificateId: cert.certificateId,
        recipientName: cert.recipientName,
        courseName: cert.courseName,
        institutionName: cert.institutionName,
        issuerName: cert.issuerName,
        instructorName: cert.instructorName,
        issueDate: cert.issueDate,
        expiryDate: cert.expiryDate,
        durationFrom: cert.durationFrom,
        durationTo: cert.durationTo,
        grade: cert.grade,
      });

      try {
        // Lazy load blockchain module only when needed
        const { verifyCertificateOnChain } = await import('@/lib/blockchain');
        const chainData = await verifyCertificateOnChain(certificateId);
        
        if (!chainData.isValid) {
          setResult('not_found');
          logVerification('not_found');
          return;
        }

        if (chainData.isRevoked) {
          setResult('revoked');
          logVerification('revoked');
          return;
        }

        if (chainData.hash.toLowerCase() !== `0x${calculatedHash}`.toLowerCase()) {
          setResult('tampered');
          logVerification('tampered');
          return;
        }

        setResult('verified');
        logVerification('verified');
      } catch (error) {
        console.error('Blockchain verification error:', error);
        if (cert.hash === calculatedHash) {
          setResult('verified');
          logVerification('verified');
        } else {
          setResult('tampered');
          logVerification('tampered');
        }
      }
    } catch (error) {
      console.error('Verification error:', error);
      setResult('not_found');
      logVerification('not_found');
    } finally {
      setLoading(false);
    }
  };

  const logVerification = async (result: string) => {
    try {
      await addDoc(collection(db, 'verifications'), {
        certificateId,
        timestamp: Date.now(),
        result,
      });
    } catch (error) {
      console.error('Error logging verification:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-4xl py-12">
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="mb-6"
            >
              <Loader2 className="w-12 h-12 text-white" />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-300 text-lg font-medium"
            >
              Verifying certificate...
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-sm text-gray-400 mt-2"
            >
              Checking blockchain records
            </motion.p>
          </motion.div>
        ) : (
          <VerificationResult result={result} certificate={certificate} />
        )}
      </div>
    </div>
  );
}
