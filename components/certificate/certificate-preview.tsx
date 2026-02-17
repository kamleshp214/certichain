'use client';

import { motion } from 'framer-motion';
import { useCertificateStore } from '@/store/certificate-store';
import { Shield } from 'lucide-react';

export function CertificatePreview() {
  const { formData } = useCertificateStore();

  const renderTemplate = () => {
    switch (formData.template) {
      case 'academic':
        return <AcademicTemplate data={formData} />;
      case 'corporate':
        return <CorporateTemplate data={formData} />;
      case 'premium':
        return <PremiumTemplate data={formData} />;
      case 'minimal':
        return <MinimalTemplate data={formData} />;
      default:
        return <AcademicTemplate data={formData} />;
    }
  };

  return (
    <motion.div
      key={formData.template}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full bg-white rounded-lg shadow-2xl overflow-hidden"
      style={{ aspectRatio: '842/595' }}
    >
      {renderTemplate()}
    </motion.div>
  );
}

function AcademicTemplate({ data }: { data: any }) {
  return (
    <div className="relative w-full h-full p-8 bg-white">
      {/* Double border */}
      <div className="absolute inset-6 border-4 border-blue-900" />
      <div className="absolute inset-8 border border-blue-900" />

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-12">
        {/* Logo */}
        {data.logoUrl && (
          <img src={data.logoUrl} alt="Logo" className="w-16 h-16 object-contain mb-4" />
        )}

        {/* Institution */}
        <p className="text-sm font-semibold text-blue-900 tracking-wider mb-6">
          {data.institutionName || 'INSTITUTION NAME'}
        </p>

        {/* Title */}
        <h1 className="text-3xl font-bold text-blue-900 mb-2">
          CERTIFICATE OF COMPLETION
        </h1>
        <div className="w-48 h-px bg-yellow-600 mb-8" />

        {/* Body */}
        <p className="text-sm text-gray-600 italic mb-4">This is to certify that</p>
        <h2 className="text-4xl font-bold text-gray-900 mb-2">
          {data.recipientName || 'Recipient Name'}
        </h2>
        <div className="w-64 h-px bg-gray-400 mb-6" />

        <p className="text-sm text-gray-600 italic mb-3">has successfully completed</p>
        <p className="text-2xl font-semibold text-blue-900 mb-4">
          {data.courseName || 'Course Name'}
        </p>

        {data.grade && (
          <p className="text-sm font-semibold text-blue-900 mb-4">
            Grade: {data.grade}
          </p>
        )}

        {data.durationFrom && data.durationTo && (
          <p className="text-xs text-gray-500 mb-6">
            Duration: {data.durationFrom} to {data.durationTo}
          </p>
        )}

        {/* Bottom section */}
        <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end">
          <div className="text-left text-xs">
            <p className="text-gray-600">Issue Date</p>
            <p className="font-semibold text-gray-900">
              {data.issueDate || new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="text-center">
            {data.signatureUrl && (
              <img src={data.signatureUrl} alt="Signature" className="w-24 h-12 object-contain mb-1" />
            )}
            <div className="w-32 h-px bg-gray-400 mb-1" />
            <p className="text-xs font-semibold text-gray-900">
              {data.instructorName || data.issuerName || 'Authorized Signatory'}
            </p>
            <p className="text-xs text-gray-500">Authorized Signatory</p>
          </div>

          <div className="flex items-center gap-1 text-xs text-blue-900">
            <Shield className="w-3 h-3" />
            <span>Blockchain Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CorporateTemplate({ data }: { data: any }) {
  return (
    <div className="relative w-full h-full bg-white">
      {/* Border */}
      <div className="absolute inset-4 border-4 border-blue-600" />

      {/* Header bar */}
      <div className="absolute top-4 left-4 right-4 h-16 bg-blue-600 flex items-center px-8">
        {data.logoUrl && (
          <img src={data.logoUrl} alt="Logo" className="w-12 h-12 object-contain mr-4" />
        )}
        <p className="text-white font-bold text-lg tracking-wide">
          {data.institutionName || 'INSTITUTION NAME'}
        </p>
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-16 pt-20">
        <h1 className="text-5xl font-bold text-blue-600 mb-2">CERTIFICATE</h1>
        <p className="text-xl font-semibold text-gray-700 mb-12">OF ACHIEVEMENT</p>

        <h2 className="text-4xl font-bold text-gray-900 mb-8">
          {data.recipientName || 'Recipient Name'}
        </h2>

        <p className="text-lg text-gray-700 mb-4">
          has successfully completed {data.courseName || 'Course Name'}
        </p>

        {data.grade && (
          <p className="text-base font-semibold text-blue-600 mb-8">
            Final Grade: {data.grade}
          </p>
        )}

        {/* Bottom */}
        <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end">
          <div className="text-left text-sm">
            <p className="text-gray-600">Issued: {data.issueDate || new Date().toLocaleDateString()}</p>
          </div>

          <div className="text-center">
            {data.signatureUrl && (
              <img src={data.signatureUrl} alt="Signature" className="w-24 h-12 object-contain mb-1" />
            )}
            <div className="w-32 h-px bg-gray-400 mb-1" />
            <p className="text-sm font-semibold text-gray-900">
              {data.instructorName || data.issuerName || 'Authorized Signatory'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PremiumTemplate({ data }: { data: any }) {
  return (
    <div className="relative w-full h-full p-6 bg-white">
      {/* Ornamental border */}
      <div className="absolute inset-5 border-[6px] border-yellow-700" />
      <div className="absolute inset-7 border-2 border-yellow-700" />

      {/* Corner decorations */}
      <div className="absolute top-9 left-9 w-8 h-8 border-t-2 border-l-2 border-yellow-700" />
      <div className="absolute top-9 right-9 w-8 h-8 border-t-2 border-r-2 border-yellow-700" />
      <div className="absolute bottom-9 left-9 w-8 h-8 border-b-2 border-l-2 border-yellow-700" />
      <div className="absolute bottom-9 right-9 w-8 h-8 border-b-2 border-r-2 border-yellow-700" />

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-16">
        {data.logoUrl && (
          <img src={data.logoUrl} alt="Logo" className="w-16 h-16 object-contain mb-4" />
        )}

        <p className="text-sm italic text-gray-600 mb-6">
          {data.institutionName || 'Institution Name'}
        </p>

        <h1 className="text-4xl font-bold text-yellow-700 mb-2">
          Certificate of Excellence
        </h1>
        <div className="w-32 h-px bg-yellow-700 mb-10" />

        <p className="text-sm italic text-gray-600 mb-4">Presented to</p>
        <h2 className="text-5xl font-bold text-gray-900 mb-8">
          {data.recipientName || 'Recipient Name'}
        </h2>

        <p className="text-base text-gray-700 mb-4">
          For outstanding achievement in {data.courseName || 'Course Name'}
        </p>

        {data.grade && (
          <p className="text-sm italic text-yellow-700 mb-6">
            With {data.grade} distinction
          </p>
        )}

        <p className="text-sm text-gray-600">
          Awarded on {data.issueDate || new Date().toLocaleDateString()}
        </p>

        {/* Signature */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center">
          {data.signatureUrl && (
            <img src={data.signatureUrl} alt="Signature" className="w-24 h-12 object-contain mb-1 mx-auto" />
          )}
          <div className="w-32 h-px bg-gray-400 mb-1 mx-auto" />
          <p className="text-xs font-semibold text-gray-900">
            {data.instructorName || data.issuerName || 'Authorized Signatory'}
          </p>
        </div>
      </div>
    </div>
  );
}

function MinimalTemplate({ data }: { data: any }) {
  return (
    <div className="relative w-full h-full p-12 bg-white">
      {/* Simple border */}
      <div className="absolute inset-10 border border-gray-300" />

      {/* Content */}
      <div className="relative h-full flex flex-col px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          {data.logoUrl && (
            <img src={data.logoUrl} alt="Logo" className="w-12 h-12 object-contain" />
          )}
          <p className="text-sm font-semibold text-gray-700">
            {data.institutionName || 'INSTITUTION NAME'}
          </p>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-12">CERTIFICATE</h1>

          <h2 className="text-4xl font-bold text-gray-700 mb-6">
            {data.recipientName || 'Recipient Name'}
          </h2>

          <p className="text-xl text-gray-600 mb-8">
            {data.courseName || 'Course Name'}
          </p>

          {data.grade && (
            <p className="text-base text-gray-700">{data.grade}</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-end justify-between">
          <div className="text-xs text-gray-600">
            {data.issueDate || new Date().toLocaleDateString()}
          </div>

          <div className="text-center">
            {data.signatureUrl && (
              <img src={data.signatureUrl} alt="Signature" className="w-20 h-10 object-contain mb-1" />
            )}
            <div className="w-24 h-px bg-gray-400 mb-1" />
            <p className="text-xs font-semibold text-gray-700">
              {data.instructorName || data.issuerName || 'Authorized Signatory'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
