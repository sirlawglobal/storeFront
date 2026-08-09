'use client';
import React, { useEffect, useState } from 'react';
import { ShieldCheck, Plus, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';

interface WarrantyItem {
  _id: string;
  serialNumber: string;
  productId: any;
  productName?: string;
  purchaseDate: string;
  expiryDate?: string;
  status?: string;
  claims?: any[];
  createdAt?: string;
}

export default function WarrantyPage() {
  const [warranties, setWarranties] = useState<WarrantyItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [claimingId, setClaimingId] = useState<string | null>(null);

  // Form State
  const [serialNumber, setSerialNumber] = useState('');
  const [productId, setProductId] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Claim Form State
  const [claimDescription, setClaimDescription] = useState('');
  const [claimImages, setClaimImages] = useState<File[]>([]);
  const [isFilingClaim, setIsFilingClaim] = useState(false);

  const fetchWarranties = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res: any = await api.warranty.list();
      const list = res?.data?.data ?? res?.data?.items ?? res?.data ?? res;
      setWarranties(Array.isArray(list) ? list : []);
    } catch (err: any) {
      setError(err.message || 'Failed to load registered warranties');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWarranties();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError('');
    setFormSuccess('');
    try {
      let receiptUrl: string | undefined;

      if (receiptFile) {
        const formData = new FormData();
        formData.append('file', receiptFile);
        const uploadRes: any = await api.storage.upload(formData);
        receiptUrl = uploadRes?.data?.url ?? uploadRes?.url;
      }

      await api.warranty.register({
        serialNumber,
        productId,
        purchaseDate,
        ...(receiptUrl && { receiptUrl }),
      });
      setFormSuccess('Warranty registered successfully!');
      setShowRegisterForm(false);
      setSerialNumber('');
      setProductId('');
      setPurchaseDate('');
      setReceiptFile(null);
      fetchWarranties();
    } catch (err: any) {
      setFormError(err.message || 'Failed to register warranty');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimingId) return;
    setIsFilingClaim(true);
    try {
      const uploadedImageUrls: string[] = [];
      
      if (claimImages.length > 0) {
        for (const file of claimImages) {
          const formData = new FormData();
          formData.append('file', file);
          const uploadRes: any = await api.storage.upload(formData);
          const url = uploadRes?.data?.url ?? uploadRes?.url;
          if (url) {
            uploadedImageUrls.push(url);
          }
        }
      }

      await api.warranty.fileClaim(claimingId, {
        description: claimDescription,
        ...(uploadedImageUrls.length > 0 && { images: uploadedImageUrls }),
      });
      alert('Warranty claim filed successfully! Customer service will review your claim.');
      setClaimingId(null);
      setClaimDescription('');
      setClaimImages([]);
      fetchWarranties();
    } catch (err: any) {
      alert(err.message || 'Failed to file warranty claim');
    } finally {
      setIsFilingClaim(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-border p-6 md:p-8 min-h-[60vh]">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-playfair font-bold text-primary flex items-center gap-2">
            <ShieldCheck size={24} className="text-primary" /> Warranty Center
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Register products &amp; track coverage or file claims
          </p>
        </div>
        {!showRegisterForm && (
          <Button size="sm" leftIcon={<Plus size={16} />} onClick={() => setShowRegisterForm(true)}>
            Register Product
          </Button>
        )}
      </div>

      {formSuccess && (
        <div className="bg-green-50 text-success text-sm p-3 rounded-md mb-6">{formSuccess}</div>
      )}

      {/* Registration Form */}
      {showRegisterForm && (
        <form
          onSubmit={handleRegister}
          className="mb-8 p-6 border border-primary/30 rounded-xl bg-primary/5 space-y-4"
        >
          <h2 className="font-semibold text-lg text-primary">Register New Product Warranty</h2>
          {formError && (
            <div className="bg-red-50 text-error text-sm p-3 rounded-md">{formError}</div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Serial Number</label>
              <input
                type="text"
                required
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                className="input-base"
                placeholder="e.g. VF-2026-98124"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Product ID / Code</label>
              <input
                type="text"
                required
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="input-base"
                placeholder="Product ObjectId or Code"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Purchase Date</label>
              <input
                type="date"
                required
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="input-base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Purchase Receipt (Optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                className="input-base p-1.5"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setShowRegisterForm(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Submit Registration
            </Button>
          </div>
        </form>
      )}

      {/* Claim Modal */}
      {claimingId && (
        <form
          onSubmit={handleFileClaim}
          className="mb-8 p-6 border border-amber-300 rounded-xl bg-amber-50 space-y-4"
        >
          <h2 className="font-semibold text-lg text-amber-900">File Warranty Claim</h2>
          <div>
            <label className="block text-sm font-medium mb-1 text-amber-900">
              Description of Issue / Defect
            </label>
            <textarea
              required
              rows={4}
              value={claimDescription}
              onChange={(e) => setClaimDescription(e.target.value)}
              className="input-base resize-none"
              placeholder="Describe the issue with your product in detail..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-amber-900">
              Photos of Defect (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setClaimImages(Array.from(e.target.files || []))}
              className="input-base p-1.5 bg-white border-amber-200"
            />
            <p className="text-xs text-amber-700 mt-1">You can select multiple images to help us assess your claim faster.</p>
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => setClaimingId(null)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isFilingClaim}>
              Submit Claim
            </Button>
          </div>
        </form>
      )}

      {/* Warranty List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-error mb-4">{error}</p>
          <button onClick={fetchWarranties} className="text-primary font-medium hover:underline">
            Try Again
          </button>
        </div>
      ) : warranties.length === 0 ? (
        <div className="text-center py-12 text-text-secondary">
          <ShieldCheck size={48} className="mx-auto text-gray-200 mb-4" />
          <p className="text-lg font-medium text-text-primary mb-2">No registered warranties</p>
          <p className="text-sm mb-6">Register your Vitafoam purchase to activate full warranty coverage.</p>
          <Button onClick={() => setShowRegisterForm(true)} leftIcon={<Plus size={16} />}>
            Register Product Warranty
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {warranties.map((w) => (
            <div
              key={w._id}
              className="border border-border rounded-xl p-5 hover:border-primary/50 transition-colors"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-text-primary">
                    Serial: {w.serialNumber}
                  </span>
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                    <CheckCircle2 size={12} /> Active
                  </span>
                </div>
                <span className="text-xs text-text-secondary">
                  Purchased:{' '}
                  {new Date(w.purchaseDate).toLocaleDateString('en-NG', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>

              {w.productName && (
                <p className="text-sm font-medium text-text-primary mb-1">
                  Product: {w.productName}
                </p>
              )}

              <div className="flex justify-between items-center pt-3 border-t border-border mt-3 text-xs text-text-secondary">
                <span>
                  Coverage:{' '}
                  {w.expiryDate
                    ? `Valid until ${new Date(w.expiryDate).toLocaleDateString('en-NG')}`
                    : 'Standard Warranty (5 Years)'}
                </span>
                {w.claims?.some((c: any) => c.status === 'PENDING') ? (
                  <span className="text-amber-600 bg-amber-50 px-2 py-1 rounded-md flex items-center gap-1 font-medium border border-amber-200">
                    <AlertCircle size={14} /> Claim Under Review
                  </span>
                ) : (
                  <button
                    onClick={() => setClaimingId(w._id)}
                    className="text-primary font-semibold hover:underline flex items-center gap-1"
                  >
                    <FileText size={14} /> File Claim
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
