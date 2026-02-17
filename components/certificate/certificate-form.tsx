'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCertificateStore } from '@/store/certificate-store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const certificateSchema = z.object({
  recipientName: z.string().min(2, 'Name must be at least 2 characters'),
  courseName: z.string().min(2, 'Course name is required'),
  institutionName: z.string().min(2, 'Institution name is required'),
  issuerName: z.string().min(2, 'Issuer name is required'),
  instructorName: z.string().optional(),
  issueDate: z.string(),
  expiryDate: z.string().optional(),
  durationFrom: z.string().optional(),
  durationTo: z.string().optional(),
  grade: z.string().optional(),
  template: z.enum(['academic', 'corporate', 'premium', 'minimal']),
  qrPosition: z.enum(['bottom-right', 'bottom-left', 'top-right', 'top-left']).optional(),
  logoPosition: z.enum(['top-left', 'top-center', 'top-right']).optional(),
  signaturePosition: z.enum(['bottom-left', 'bottom-center', 'bottom-right']).optional(),
});

type CertificateFormData = z.infer<typeof certificateSchema>;

interface CertificateFormProps {
  onSubmit: (data: CertificateFormData) => void;
  disabled?: boolean;
}

export function CertificateForm({ onSubmit, disabled = false }: CertificateFormProps) {
  const { formData, updateFormData } = useCertificateStore();
  const [logoPreview, setLogoPreview] = useState<string>();
  const [signaturePreview, setSignaturePreview] = useState<string>();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CertificateFormData>({
    resolver: zodResolver(certificateSchema),
    defaultValues: {
      ...formData,
      template: formData.template || 'academic',
      qrPosition: 'bottom-right',
      logoPosition: 'top-center',
      signaturePosition: 'bottom-center',
    },
  });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const url = reader.result as string;
        setLogoPreview(url);
        updateFormData({ logoUrl: url, logoFile: file });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const url = reader.result as string;
        setSignaturePreview(url);
        updateFormData({ signatureUrl: url, signatureFile: file });
      };
      reader.readAsDataURL(file);
    }
  };

  const onFormChange = (field: keyof CertificateFormData, value: string) => {
    updateFormData({ [field]: value });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-6 space-y-5">
        <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Recipient Full Name *
          </label>
          <Input
            {...register('recipientName')}
            onChange={(e) => {
              register('recipientName').onChange(e);
              onFormChange('recipientName', e.target.value);
            }}
            placeholder="John Michael Doe"
            disabled={disabled}
          />
          {errors.recipientName && (
            <p className="text-white text-sm mt-1">{errors.recipientName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Course / Program Title *
          </label>
          <Input
            {...register('courseName')}
            onChange={(e) => {
              register('courseName').onChange(e);
              onFormChange('courseName', e.target.value);
            }}
            placeholder="Advanced Blockchain Development"
            disabled={disabled}
          />
          {errors.courseName && (
            <p className="text-white text-sm mt-1">{errors.courseName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Institution Name *
          </label>
          <Input
            {...register('institutionName')}
            onChange={(e) => {
              register('institutionName').onChange(e);
              onFormChange('institutionName', e.target.value);
            }}
            placeholder="Tech Academy International"
            disabled={disabled}
          />
          {errors.institutionName && (
            <p className="text-white text-sm mt-1">{errors.institutionName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Issuer Name *
          </label>
          <Input
            {...register('issuerName')}
            onChange={(e) => {
              register('issuerName').onChange(e);
              onFormChange('issuerName', e.target.value);
            }}
            placeholder="Dr. Jane Smith"
            disabled={disabled}
          />
          {errors.issuerName && (
            <p className="text-white text-sm mt-1">{errors.issuerName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Issue Date *
          </label>
          <Input
            type="date"
            {...register('issueDate')}
            onChange={(e) => {
              register('issueDate').onChange(e);
              onFormChange('issueDate', e.target.value);
            }}
            disabled={disabled}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Certificate Template *
          </label>
          <select
            {...register('template')}
            onChange={(e) => {
              register('template').onChange(e);
              onFormChange('template', e.target.value);
            }}
            disabled={disabled}
            className="flex h-11 w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-50"
          >
            <option value="academic">Academic / Formal</option>
            <option value="corporate">Corporate / Modern</option>
            <option value="premium">Premium / Ornamental</option>
            <option value="minimal">Minimal / Clean</option>
          </select>
        </div>
      </div>

      {/* Advanced Options */}
      <div className="bg-gray-900/30 border border-gray-800 rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-800/30 transition-colors"
        >
          <span className="text-lg font-semibold text-white">Advanced Options</span>
          {showAdvanced ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>

        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-6 pt-0 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Instructor / Authority Name
                  </label>
                  <Input
                    {...register('instructorName')}
                    onChange={(e) => {
                      register('instructorName').onChange(e);
                      onFormChange('instructorName', e.target.value);
                    }}
                    placeholder="Prof. Robert Johnson"
                    disabled={disabled}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Duration From
                    </label>
                    <Input
                      type="date"
                      {...register('durationFrom')}
                      onChange={(e) => {
                        register('durationFrom').onChange(e);
                        onFormChange('durationFrom', e.target.value);
                      }}
                      disabled={disabled}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Duration To
                    </label>
                    <Input
                      type="date"
                      {...register('durationTo')}
                      onChange={(e) => {
                        register('durationTo').onChange(e);
                        onFormChange('durationTo', e.target.value);
                      }}
                      disabled={disabled}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Grade / Score
                    </label>
                    <Input
                      {...register('grade')}
                      onChange={(e) => {
                        register('grade').onChange(e);
                        onFormChange('grade', e.target.value);
                      }}
                      placeholder="A+ / 95%"
                      disabled={disabled}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Expiry Date
                    </label>
                    <Input
                      type="date"
                      {...register('expiryDate')}
                      onChange={(e) => {
                        register('expiryDate').onChange(e);
                        onFormChange('expiryDate', e.target.value);
                      }}
                      disabled={disabled}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      QR Position
                    </label>
                    <select
                      {...register('qrPosition')}
                      disabled={disabled}
                      className="flex h-11 w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-50"
                    >
                      <option value="bottom-right">Bottom Right</option>
                      <option value="bottom-left">Bottom Left</option>
                      <option value="top-right">Top Right</option>
                      <option value="top-left">Top Left</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Logo Position
                    </label>
                    <select
                      {...register('logoPosition')}
                      disabled={disabled}
                      className="flex h-11 w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-50"
                    >
                      <option value="top-center">Top Center</option>
                      <option value="top-left">Top Left</option>
                      <option value="top-right">Top Right</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Signature Position
                    </label>
                    <select
                      {...register('signaturePosition')}
                      disabled={disabled}
                      className="flex h-11 w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-50"
                    >
                      <option value="bottom-center">Bottom Center</option>
                      <option value="bottom-left">Bottom Left</option>
                      <option value="bottom-right">Bottom Right</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Institution Logo
                    </label>
                    <label className="flex items-center justify-center h-32 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-white transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        disabled={disabled}
                        className="hidden"
                      />
                      {logoPreview ? (
                        <img src={logoPreview} alt="Logo" className="h-28 object-contain" />
                      ) : (
                        <div className="text-center">
                          <Upload className="w-8 h-8 mx-auto text-gray-500 mb-2" />
                          <span className="text-xs text-gray-500">Upload Logo</span>
                        </div>
                      )}
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Signature Image
                    </label>
                    <label className="flex items-center justify-center h-32 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-white transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleSignatureChange}
                        disabled={disabled}
                        className="hidden"
                      />
                      {signaturePreview ? (
                        <img src={signaturePreview} alt="Signature" className="h-28 object-contain" />
                      ) : (
                        <div className="text-center">
                          <Upload className="w-8 h-8 mx-auto text-gray-500 mb-2" />
                          <span className="text-xs text-gray-500">Upload Signature</span>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Button 
        type="submit" 
        size="lg" 
        className="w-full bg-white hover:bg-gray-200 text-black font-semibold"
        disabled={disabled}
      >
        {disabled ? 'Issuing Certificate...' : 'Issue Certificate'}
      </Button>
    </form>
  );
}
