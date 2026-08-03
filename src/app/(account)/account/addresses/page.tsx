'use client';
import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, MapPin, Star } from 'lucide-react';
import { api } from '@/lib/api';
import { Address } from '@/types';
import { Button } from '@/components/ui/Button';

const EMPTY_FORM = {
  label: '',
  street: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'Nigeria',
  isDefault: false,
};

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchAddresses = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res: any = await api.users.getAddresses();
      const list = res?.data ?? res;
      setAddresses(Array.isArray(list) ? list : []);
    } catch (err: any) {
      setError(err.message || 'Failed to load addresses');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleEdit = (addr: Address) => {
    setFormData({
      label: addr.label,
      street: addr.street,
      city: addr.city,
      state: addr.state,
      postalCode: addr.postalCode || '',
      country: addr.country || 'Nigeria',
      isDefault: addr.isDefault,
    });
    setEditingId(addr._id);
    setShowForm(true);
    setFormError('');
  };

  const handleAddNew = () => {
    setFormData(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
    setFormError('');
  };

  const handleDelete = async (addressId: string) => {
    if (!window.confirm('Remove this address?')) return;
    try {
      await api.users.deleteAddress(addressId);
      setAddresses((prev) => prev.filter((a) => a._id !== addressId));
    } catch (err: any) {
      alert(err.message || 'Failed to delete address');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFormError('');
    try {
      if (editingId) {
        const res: any = await api.users.updateAddress(editingId, formData);
        const updated = res?.data ?? res;
        setAddresses((prev) => prev.map((a) => (a._id === editingId ? { ...a, ...updated } : a)));
      } else {
        await api.users.addAddress(formData);
        await fetchAddresses(); // Re-fetch to get server-assigned _id
      }
      setShowForm(false);
      setEditingId(null);
    } catch (err: any) {
      setFormError(err.message || 'Failed to save address');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      await api.users.updateAddress(addressId, { isDefault: true });
      setAddresses((prev) =>
        prev.map((a) => ({ ...a, isDefault: a._id === addressId }))
      );
    } catch (err: any) {
      alert(err.message || 'Failed to set default');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-border p-6 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-playfair font-bold text-primary">Saved Addresses</h1>
        {!showForm && (
          <Button size="sm" leftIcon={<Plus size={16} />} onClick={handleAddNew}>
            Add New
          </Button>
        )}
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 p-5 border border-primary/30 rounded-xl bg-primary/5 space-y-4"
        >
          <h2 className="font-semibold text-lg">
            {editingId ? 'Edit Address' : 'New Address'}
          </h2>
          {formError && (
            <div className="text-error text-sm bg-red-50 p-3 rounded-md">{formError}</div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Label (e.g. Home)</label>
              <input
                className="input-base"
                required
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Street Address</label>
              <input
                className="input-base"
                required
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <input
                className="input-base"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">State</label>
              <input
                className="input-base"
                required
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Postal Code</label>
              <input
                className="input-base"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Country</label>
              <input
                className="input-base"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isDefault}
              onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-sm font-medium">Set as default address</span>
          </label>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSaving}>
              {editingId ? 'Save Changes' : 'Add Address'}
            </Button>
          </div>
        </form>
      )}

      {/* Address list */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="h-40 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-error mb-4">{error}</p>
          <button onClick={fetchAddresses} className="text-primary font-medium hover:underline">
            Retry
          </button>
        </div>
      ) : addresses.length === 0 ? (
        <div className="text-center py-12 text-text-secondary">
          <MapPin size={40} className="mx-auto text-gray-300 mb-3" />
          <p>No saved addresses yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((addr) => (
            <div
              key={addr._id}
              className={`border rounded-xl p-5 ${
                addr.isDefault ? 'border-primary bg-primary/5' : 'border-border'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-text-primary">{addr.label}</span>
                  {addr.isDefault && (
                    <span className="bg-primary text-white text-[10px] uppercase tracking-wider px-2 py-0.5 rounded font-bold">
                      Default
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(addr)}
                    className="text-text-secondary hover:text-primary transition-colors p-1"
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  {!addr.isDefault && (
                    <button
                      onClick={() => handleDelete(addr._id)}
                      className="text-text-secondary hover:text-error transition-colors p-1"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>

              <p className="text-sm text-text-secondary mb-1">{addr.street}</p>
              <p className="text-sm text-text-secondary mb-3">
                {addr.city}, {addr.state}
                {addr.postalCode && ` ${addr.postalCode}`}
              </p>
              <p className="text-sm text-text-secondary">{addr.country || 'Nigeria'}</p>

              {!addr.isDefault && (
                <button
                  onClick={() => handleSetDefault(addr._id)}
                  className="mt-4 flex items-center gap-1 text-primary text-sm font-medium hover:underline"
                >
                  <Star size={14} /> Set as default
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
