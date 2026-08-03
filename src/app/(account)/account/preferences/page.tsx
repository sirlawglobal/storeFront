'use client';
import React, { useState } from 'react';
import { Bell, Mail, Smartphone, Save } from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';

export default function PreferencesPage() {
  const [preferences, setPreferences] = useState({
    newsletter: true,
    smsAlerts: false,
    pushNotifications: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const toggle = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
    setMessage('');
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    setMessage('');
    try {
      await api.users.updatePreferences(preferences);
      setMessage('Preferences saved successfully.');
    } catch (err: any) {
      setError(err.message || 'Failed to save preferences');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-border p-6 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-playfair font-bold text-primary">Notification Preferences</h1>
        <Button size="sm" onClick={handleSave} isLoading={isSaving} leftIcon={<Save size={15} />}>
          Save
        </Button>
      </div>

      {message && (
        <div className="bg-green-50 text-success text-sm p-3 rounded-md mb-6">{message}</div>
      )}
      {error && (
        <div className="bg-red-50 text-error text-sm p-3 rounded-md mb-6">{error}</div>
      )}

      <div className="space-y-8">
        {/* Email */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Mail className="text-text-secondary" size={20} />
            <h2 className="font-semibold text-lg">Email Notifications</h2>
          </div>
          <div className="space-y-4 pl-7">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="font-medium text-sm text-text-primary">Newsletters</p>
                <p className="text-xs text-text-secondary">Weekly tips for better sleep</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.newsletter}
                onChange={() => toggle('newsletter')}
                className="w-5 h-5 accent-primary"
              />
            </label>
          </div>
        </div>

        <hr className="border-border" />

        {/* SMS */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Smartphone className="text-text-secondary" size={20} />
            <h2 className="font-semibold text-lg">SMS Notifications</h2>
          </div>
          <div className="space-y-4 pl-7">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="font-medium text-sm text-text-primary">Order &amp; Delivery Updates</p>
                <p className="text-xs text-text-secondary">Text messages when your order is out for delivery</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.smsAlerts}
                onChange={() => toggle('smsAlerts')}
                className="w-5 h-5 accent-primary"
              />
            </label>
          </div>
        </div>

        <hr className="border-border" />

        {/* Push */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Bell className="text-text-secondary" size={20} />
            <h2 className="font-semibold text-lg">Push Notifications</h2>
          </div>
          <div className="space-y-4 pl-7">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="font-medium text-sm text-text-primary">App Push Notifications</p>
                <p className="text-xs text-text-secondary">Promotions, restocks, and order alerts</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.pushNotifications}
                onChange={() => toggle('pushNotifications')}
                className="w-5 h-5 accent-primary"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
