import React from 'react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container max-w-3xl">
        <h1 className="font-playfair text-4xl font-bold text-primary mb-6">About Vitafoam</h1>
        <p className="text-text-secondary text-lg leading-relaxed mb-4">
          Vitafoam Nigeria Plc is Nigeria's foremost manufacturer of flexible, reconstituted, and rigid foam products.
          Since our founding, we have been committed to bringing Nigerians the finest sleep and comfort products.
        </p>
        <p className="text-text-secondary leading-relaxed mb-4">
          Our range spans orthopedic mattresses, memory foam pillows, bedroom furniture, and a full suite of
          sleep accessories — all engineered to give you the rest you deserve.
        </p>
        <p className="text-text-secondary leading-relaxed">
          With manufacturing plants across Nigeria and a nationwide network of dealers, Vitafoam is truly the
          home of fine living.
        </p>
      </div>
    </div>
  );
}
