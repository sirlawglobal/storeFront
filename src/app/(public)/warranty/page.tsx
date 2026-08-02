'use client';
import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, FileText } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function WarrantyPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    productName: '',
    serialNumber: '',
    purchaseDate: '',
    dealerName: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // API call would go here
    setIsSubmitted(true);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container max-w-5xl">
        <div className="bg-primary rounded-3xl overflow-hidden flex flex-col md:flex-row mb-12 shadow-xl">
          <div className="p-8 md:p-12 text-white w-full md:w-1/2 flex flex-col justify-center">
            <ShieldCheck size={48} className="mb-6 opacity-90" />
            <h1 className="text-3xl md:text-5xl font-playfair font-bold mb-4">Protect Your Investment</h1>
            <p className="text-white/80 text-lg mb-8 leading-relaxed">
              Register your Vitafoam product to activate your warranty. Enjoy up to 5 years of peace of mind with our comprehensive protection plan.
            </p>
            <div className="flex items-center gap-2 font-semibold">
              <ArrowRight size={20} /> Scroll down to register
            </div>
          </div>
          <div className="w-full md:w-1/2 bg-gray-900 relative min-h-[300px]">
            <img 
              src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80" 
              alt="Premium Mattress" 
              className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-overlay"
            />
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          {isSubmitted ? (
            <div className="bg-white rounded-2xl shadow-sm border border-border p-10 text-center">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} />
              </div>
              <h2 className="text-2xl font-playfair font-bold mb-2">Registration Successful!</h2>
              <p className="text-text-secondary mb-8">
                Your warranty for {formData.productName} has been activated. A confirmation email has been sent to {formData.email}.
              </p>
              <Button onClick={() => setIsSubmitted(false)}>Register Another Product</Button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-border p-6 md:p-10">
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-border">
                <FileText className="text-primary" size={24} />
                <h2 className="text-2xl font-playfair font-bold">Warranty Registration Form</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">First Name <span className="text-error">*</span></label>
                    <input type="text" name="firstName" required value={formData.firstName} onChange={handleChange} className="input-base" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Last Name <span className="text-error">*</span></label>
                    <input type="text" name="lastName" required value={formData.lastName} onChange={handleChange} className="input-base" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email Address <span className="text-error">*</span></label>
                    <input type="email" name="email" required value={formData.email} onChange={handleChange} className="input-base" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone Number <span className="text-error">*</span></label>
                    <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="input-base" />
                  </div>
                </div>

                <h3 className="font-semibold text-lg pt-4 pb-2 border-b border-border">Product Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">Product Name <span className="text-error">*</span></label>
                    <select name="productName" required value={formData.productName} onChange={handleChange} className="input-base bg-white">
                      <option value="">Select a product...</option>
                      <option value="Vita Ortho">Vita Ortho Mattress</option>
                      <option value="Vita Supreme">Vita Supreme</option>
                      <option value="Vita Galaxy Classic">Vita Galaxy Classic</option>
                      <option value="Memory Foam Pillow">Memory Foam Pillow</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Serial Number / Batch Code <span className="text-error">*</span></label>
                    <input type="text" name="serialNumber" required value={formData.serialNumber} onChange={handleChange} placeholder="e.g. VF-123456" className="input-base" />
                    <p className="text-xs text-text-secondary mt-1">Found on the product tag</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Date of Purchase <span className="text-error">*</span></label>
                    <input type="date" name="purchaseDate" required value={formData.purchaseDate} onChange={handleChange} className="input-base" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Purchased From (Dealer/Store) <span className="text-error">*</span></label>
                    <input type="text" name="dealerName" required value={formData.dealerName} onChange={handleChange} className="input-base" />
                  </div>
                </div>

                <div className="pt-6">
                  <Button type="submit" size="lg" className="w-full">
                    Register Warranty
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
// Temporary mock for CheckCircle
const CheckCircle = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);
