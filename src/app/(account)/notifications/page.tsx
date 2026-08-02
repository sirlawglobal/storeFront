'use client';
import React, { useState } from 'react';
import { Bell, CheckCheck, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const MOCK_NOTIFS = [
  { id: '1', title: 'Order Dispatched', message: 'Your order ORD-2026-8923 has been dispatched and is out for delivery.', isRead: false, date: '2 hours ago' },
  { id: '2', title: 'Flash Sale Alert!', message: 'Get 20% off all pillows today only. Use code PILLOW20.', isRead: true, date: '1 day ago' },
  { id: '3', title: 'Welcome to Vitafoam', message: 'Thank you for joining us. We hope you enjoy shopping for better sleep.', isRead: true, date: '1 week ago' },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFS);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-border p-6 md:p-8 min-h-[60vh]">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-playfair font-bold text-primary flex items-center gap-2">
          Notifications
          <span className="bg-accent text-white text-sm px-2 py-0.5 rounded-full">{notifications.filter(n => !n.isRead).length}</span>
        </h1>
        <Button variant="ghost" size="sm" onClick={markAllRead} leftIcon={<CheckCheck size={16} />}>
          Mark all as read
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {notifications.length === 0 ? (
          <div className="text-center py-12 text-text-secondary">
            <Bell size={48} className="mx-auto text-gray-200 mb-4" />
            <p>You have no notifications.</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div 
              key={notif.id}
              className={`p-4 border rounded-xl flex gap-4 transition-colors ${notif.isRead ? 'border-border bg-white' : 'border-primary/20 bg-primary/5'}`}
            >
              <div className="mt-1">
                <div className={`w-2 h-2 rounded-full ${notif.isRead ? 'bg-transparent' : 'bg-primary'}`} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`font-semibold ${notif.isRead ? 'text-text-primary' : 'text-primary'}`}>{notif.title}</h3>
                  <span className="text-xs text-text-secondary">{notif.date}</span>
                </div>
                <p className="text-sm text-text-secondary mb-2">{notif.message}</p>
                <div className="flex justify-end">
                  <button 
                    onClick={() => deleteNotification(notif.id)}
                    className="text-text-secondary hover:text-error transition-colors p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
