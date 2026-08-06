'use client';
import React, { useEffect, useState } from 'react';
import { Bell, CheckCheck, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';

interface NotificationItem {
  _id: string;
  title: string;
  body?: string;
  message?: string;
  isRead: boolean;
  createdAt?: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNotifications = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res: any = await api.notifications.list({ page: 1, limit: 20 });
      // The API wraps the response in { data: { data: [...] } }
      const list = res?.data?.data ?? res?.data?.items ?? res?.data ?? res;
      setNotifications(Array.isArray(list) ? list : []);
    } catch (err: any) {
      setError(err.message || 'Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAllRead = async () => {
    try {
      await api.notifications.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err: any) {
      alert(err.message || 'Failed to mark all as read');
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await api.notifications.delete(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete notification');
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-border p-6 md:p-8 min-h-[60vh]">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-playfair font-bold text-primary flex items-center gap-2">
          Notifications
          {unreadCount > 0 && (
            <span className="bg-accent text-white text-sm px-2 py-0.5 rounded-full">{unreadCount}</span>
          )}
        </h1>
        {notifications.length > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllRead} leftIcon={<CheckCheck size={16} />}>
            Mark all as read
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-error mb-4">{error}</p>
          <button onClick={fetchNotifications} className="text-primary font-medium hover:underline">
            Try Again
          </button>
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-12 text-text-secondary">
          <Bell size={48} className="mx-auto text-gray-200 mb-4" />
          <p>You have no notifications.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {notifications.map((notif) => (
            <div
              key={notif._id}
              className={`p-4 border rounded-xl flex gap-4 transition-colors ${
                notif.isRead ? 'border-border bg-white' : 'border-primary/20 bg-primary/5'
              }`}
            >
              <div className="mt-1">
                <div className={`w-2 h-2 rounded-full ${notif.isRead ? 'bg-transparent' : 'bg-primary'}`} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`font-semibold ${notif.isRead ? 'text-text-primary' : 'text-primary'}`}>
                    {notif.title}
                  </h3>
                  {notif.createdAt && (
                    <span className="text-xs text-text-secondary">
                      {new Date(notif.createdAt).toLocaleDateString('en-NG', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  )}
                </div>
                <p className="text-sm text-text-secondary mb-2">{notif.body || notif.message}</p>
                <div className="flex justify-end">
                  <button
                    onClick={() => deleteNotification(notif._id)}
                    className="text-text-secondary hover:text-error transition-colors p-1"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
