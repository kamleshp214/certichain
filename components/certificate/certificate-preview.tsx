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
      className="w-full bg-white rounded-lg shadow-2xl overflow-hidden border-2 border-gray-700"
      style={{ aspectRatio: '842/595', maxHeight: '70vh' }}
    >
      <div className="w-full h-full overflow-auto">
        {renderTemplate()}
      </div>
    </motion.div>
  );
}

function AcademicTemplate({ data }: { data: any }) {
  return (
    <div className="relative w-full h-full bg-white flex flex-col p-8">
      {/* Double border */}
      <div className="absolute inset-4 border-[3px] border-blue-900" />
      <div className="absolute inset-6 border border-blue-900" />

      {/* Content wrapper */}
      <div className="relative flex flex-col h-full justify-between p-8">
        {/* Header section */}
        <div className="text-center space-y-2">
          {/* Logo */}
          {data.logoUrl && data.logoUrl !== '' && (
            <img src={data.logoUrl} alt="Logo" className="w-16 h-16 object-contain mx-auto mb-2" />
          )}

          {/* Institution */}
          <p className="text-[10px] font-bold text-blue-900 tracking-[0.2em] uppercase">
            {data.institutionName || 'Institution Name'}
          </p>

          {/* Title */}
          <h1 className="text-xl font-serif font-bold text-blue-900 mt-3">
            CERTIFICATE OF COMPLETION
          </h1>
          <div className="w-24 h-0.5 bg-amber-600 mx-auto mt-2" />
        </div>

        {/* Body section */}
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3 py-6">
          <p className="text-[9px] text-gray-700 italic">This is to certify that</p>
          
          <h2 className="text-2xl font-serif font-bold text-gray-900 px-4">
            {data.recipientName || 'Recipient Name'}
          </h2>
          <div className="w-32 h-px bg-gray-400" />

          <p className="text-[9px] text-gray-700 italic mt-2">has successfully completed the course</p>
          <p className="text-base font-serif font-bold text-blue-900 px-8">
            {data.courseName || 'Course Name'}
          </p>

          {data.grade && (
            <p className="text-[10px] font-bold text-gray-800 mt-2">
              Grade: {data.grade}
            </p>
          )}

          {data.durationFrom && data.durationTo && (
            <p className="text-[8px] text-gray-600 mt-1">
              Duration: {data.durationFrom} to {data.durationTo}
            </p>
          )}
        </div>

        {/* Footer section */}
        <div className="border-t border-blue-900 pt-4">
          <div className="flex justify-between items-end">
            {/* Date */}
            <div className="text-left text-[8px]">
              <p className="text-gray-600 mb-0.5">Issue Date</p>
              <p className="font-bold text-gray-900">
                {data.issueDate || new Date().toLocaleDateString()}
              </p>
            </div>

            {/* Signature */}
            <div className="text-center">
              {data.signatureUrl && data.signatureUrl !== '' && (
                <img src={data.signatureUrl} alt="Signature" className="w-16 h-8 object-contain mx-auto mb-0.5" />
              )}
              <div className="w-20 h-px bg-gray-900 mx-auto mb-0.5" />
              <p className="text-[8px] font-bold text-gray-900">
                {data.instructorName || data.issuerName || 'Authorized Signatory'}
              </p>
              <p className="text-[7px] text-gray-600">Authorized Signatory</p>
            </div>

            {/* Verification badge */}
            <div className="flex items-center gap-1 text-[8px] text-blue-900">
              <Shield className="w-3 h-3" />
              <span className="font-medium">Verified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CorporateTemplate({ data }: { data: any }) {
  return (
    <div className="relative w-full h-full bg-white flex flex-col">
      {/* Border */}
      <div className="absolute inset-3 border-[3px] border-gray-900" />

      {/* Header bar */}
      <div className="relative flex-shrink-0 h-16 bg-gray-900 flex items-center px-6 gap-3 m-3">
        {data.logoUrl && data.logoUrl !== '' && (
          <img src={data.logoUrl} alt="Logo" className="w-10 h-10 object-contain" />
        )}
        <p className="text-white font-bold text-xs tracking-wide uppercase">
          {data.institutionName || 'Institution Name'}
        </p>
      </div>

      {/* Content */}
      <div className="relative flex-1 flex flex-col items-center justify-center text-center px-8 py-6 space-y-3">
        <h1 className="text-3xl font-serif font-bold text-gray-900">CERTIFICATE</h1>
        <p className="text-sm font-bold text-gray-700">OF ACHIEVEMENT</p>

        <h2 className="text-2xl font-serif font-bold text-gray-900 mt-4">
          {data.recipientName || 'Recipient Name'}
        </h2>

        <p className="text-xs text-gray-700 max-w-xs mt-3">
          has successfully completed {data.courseName || 'Course Name'}
        </p>

        {data.grade && (
          <p className="text-[10px] font-bold text-gray-900 mt-2">
            Final Grade: {data.grade}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="relative flex-shrink-0 px-8 pb-6 border-t border-gray-900 mx-3 pt-3">
        <div className="flex justify-between items-end">
          <div className="text-left text-[8px]">
            <p className="text-gray-600">Issued: {data.issueDate || new Date().toLocaleDateString()}</p>
          </div>

          <div className="text-center">
            {data.signatureUrl && data.signatureUrl !== '' && (
              <img src={data.signatureUrl} alt="Signature" className="w-16 h-8 object-contain mx-auto mb-0.5" />
            )}
            <div className="w-20 h-px bg-gray-900 mx-auto mb-0.5" />
            <p className="text-[8px] font-bold text-gray-900">
              {data.instructorName || data.issuerName || 'Authorized Signatory'}
            </p>
          </div>

          <div className="text-right text-[8px] text-gray-600">
            Verified
          </div>
        </div>
      </div>
    </div>
  );
}

function PremiumTemplate({ data }: { data: any }) {
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-amber-50 to-white flex flex-col p-6">
      {/* Ornamental double border */}
      <div className="absolute inset-3 border-[4px] border-amber-700" />
      <div className="absolute inset-5 border-[2px] border-amber-600" />

      {/* Corner decorations */}
      <div className="absolute top-6 left-6 w-4 h-4 border-t-2 border-l-2 border-amber-700" />
      <div className="absolute top-6 right-6 w-4 h-4 border-t-2 border-r-2 border-amber-700" />
      <div className="absolute bottom-6 left-6 w-4 h-4 border-b-2 border-l-2 border-amber-700" />
      <div className="absolute bottom-6 right-6 w-4 h-4 border-b-2 border-r-2 border-amber-700" />

      {/* Content wrapper */}
      <div className="relative flex flex-col h-full justify-between p-8">
        {/* Header section */}
        <div className="text-center border-b border-amber-700 pb-4 space-y-2">
          {data.logoUrl && data.logoUrl !== '' && (
            <img src={data.logoUrl} alt="Logo" className="w-12 h-12 object-contain mx-auto mb-1" />
          )}

          <p className="text-[9px] italic text-amber-800">
            {data.institutionName || 'Institution Name'}
          </p>

          <h1 className="text-lg font-serif font-bold text-amber-900 mt-2">
            Certificate of Excellence
          </h1>
          <div className="w-20 h-0.5 bg-amber-700 mx-auto" />
        </div>

        {/* Body section */}
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3 py-6">
          <p className="text-[9px] italic text-amber-800">Presented to</p>
          
          <h2 className="text-2xl font-serif font-bold text-amber-900">
            {data.recipientName || 'Recipient Name'}
          </h2>

          <p className="text-[10px] text-gray-700 max-w-xs mt-2">
            For outstanding achievement in {data.courseName || 'Course Name'}
          </p>

          {data.grade && (
            <p className="text-[9px] italic text-amber-800 mt-2">
              With {data.grade} distinction
            </p>
          )}

          <p className="text-[8px] text-gray-600 mt-3">
            Awarded on {data.issueDate || new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Footer section */}
        <div className="border-t border-amber-700 pt-3">
          <div className="flex justify-center">
            <div className="text-center">
              {data.signatureUrl && data.signatureUrl !== '' && (
                <img src={data.signatureUrl} alt="Signature" className="w-16 h-8 object-contain mx-auto mb-0.5" />
              )}
              <div className="w-20 h-px bg-amber-900 mx-auto mb-0.5" />
              <p className="text-[8px] font-bold text-amber-900">
                {data.instructorName || data.issuerName || 'Authorized Signatory'}
              </p>
              <p className="text-[7px] text-amber-700">Authorized Signatory</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MinimalTemplate({ data }: { data: any }) {
  return (
    <div className="relative w-full h-full bg-white flex flex-col p-8">
      {/* Simple border */}
      <div className="absolute inset-6 border-2 border-gray-900" />

      {/* Content wrapper */}
      <div className="relative flex flex-col h-full justify-between p-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-900 pb-3">
          {data.logoUrl && data.logoUrl !== '' && (
            <img src={data.logoUrl} alt="Logo" className="w-10 h-10 object-contain" />
          )}
          <p className="text-[9px] font-bold text-gray-900 uppercase tracking-wide">
            {data.institutionName || 'Institution Name'}
          </p>
          <div className="w-10" />
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
          <h1 className="text-4xl font-serif font-bold text-gray-900">CERTIFICATE</h1>

          <h2 className="text-xl font-serif font-bold text-gray-900 mt-4">
            {data.recipientName || 'Recipient Name'}
          </h2>

          <p className="text-sm text-gray-700 mt-2">
            {data.courseName || 'Course Name'}
          </p>

          {data.grade && (
            <p className="text-[10px] text-gray-600 mt-1">{data.grade}</p>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-900 pt-3">
          <div className="flex items-end justify-between">
            <div className="text-[8px] text-gray-600">
              {data.issueDate || new Date().toLocaleDateString()}
            </div>

            <div className="text-center">
              {data.signatureUrl && data.signatureUrl !== '' && (
                <img src={data.signatureUrl} alt="Signature" className="w-14 h-7 object-contain mx-auto mb-0.5" />
              )}
              <div className="w-16 h-px bg-gray-900 mx-auto mb-0.5" />
              <p className="text-[8px] font-bold text-gray-900">
                {data.instructorName || data.issuerName || 'Authorized Signatory'}
              </p>
            </div>

            <div className="text-[8px] text-gray-600">
              Verified
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
