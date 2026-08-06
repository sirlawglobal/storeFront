'use client';
import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // 1. Fetch fresh profile from backend DB on mount to ensure user.phone is up to date
  useEffect(() => {
    const fetchFreshProfile = async () => {
      try {
        const res: any = await api.users.getProfile();
        const freshUser = res?.data ?? res;
        if (freshUser && (freshUser.id || freshUser._id)) {
          updateUser({ ...freshUser, _id: freshUser._id || freshUser.id });
        }
      } catch (err) {
        console.warn('Failed to fetch fresh user profile:', err);
      }
    };
    fetchFreshProfile();
  }, [updateUser]);

  // 2. Keep formData in sync whenever user object updates or edit mode is toggled
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
      });
    }
  }, [user, isEditing]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    
    try {
      // Axios interceptor already unwraps response.data, so `res` IS the updated user object
      const res: any = await api.users.updateProfile(formData);
      updateUser({ ...res, _id: res._id || res.id });
      setMessage('Profile updated successfully');
      setIsEditing(false);
    } catch (err: any) {
      setMessage(err.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-border p-6 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-playfair font-bold text-primary">My Profile</h1>
        {!isEditing && (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            Edit Profile
          </Button>
        )}
      </div>

      {message && (
        <div className={`p-3 rounded-md mb-6 text-sm ${message.includes('success') ? 'bg-green-50 text-success' : 'bg-red-50 text-error'}`}>
          {message}
        </div>
      )}

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">First Name</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="input-base" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="input-base" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input-base" required />
          </div>
          <div className="pt-4 flex gap-3">
            <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button type="submit" isLoading={isLoading}>Save Changes</Button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-primary/10 text-primary flex items-center justify-center text-3xl font-bold">
              {user.firstName?.[0] || 'U'}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user.firstName} {user.lastName}</h2>
              <p className="text-text-secondary">{user.email}</p>
              <div className="mt-2 flex gap-2">
                <span className="bg-gray-100 text-text-secondary text-xs px-2 py-1 rounded">Customer</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-border">
            <div>
              <p className="text-sm text-text-secondary mb-1">First Name</p>
              <p className="font-medium">{user.firstName}</p>
            </div>
            <div>
              <p className="text-sm text-text-secondary mb-1">Last Name</p>
              <p className="font-medium">{user.lastName}</p>
            </div>
            <div>
              <p className="text-sm text-text-secondary mb-1">Email Address</p>
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-text-secondary mb-1">Phone Number</p>
              <p className="font-medium">{user.phone || 'Not provided'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
