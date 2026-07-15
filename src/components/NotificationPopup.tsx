import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, MailOpen, Clock, Loader2 } from 'lucide-react';
import { api } from '../contexts/AuthContext';

export interface NotificationType {
  _id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  actionRoute: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onUnreadCountChange: (count: number) => void;
}

const NotificationPopup: React.FC<NotificationPopupProps> = ({ isOpen, onClose, onUnreadCountChange }) => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Fetch Notifications
  const fetchNotifications = async () => {
    if (!isOpen) return;
    setLoading(true);
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data.notifications || []);
      const unreadCount = response.data.notifications?.filter((n: any) => !n.isRead).length || 0;
      onUnreadCountChange(unreadCount);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [isOpen]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Mark all as read
  const handleMarkAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      onUnreadCountChange(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  // Mark single as read & navigate
  const handleNotificationClick = async (notif: NotificationType) => {
    try {
      if (!notif.isRead) {
        await api.put(`/notifications/${notif._id}/read`);
        setNotifications(prev => prev.map(n => n._id === notif._id ? { ...n, isRead: true } : n));
        
        // Recalculate unread count
        const newUnread = notifications.filter(n => n._id !== notif._id && !n.isRead).length;
        onUnreadCountChange(newUnread);
      }
      onClose();
      navigate(notif.actionRoute);
    } catch (error) {
      console.error('Error reading notification:', error);
      onClose();
      navigate(notif.actionRoute);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl glass-card overflow-hidden z-50 text-slate-200 border border-slate-800"
      style={{ top: '100%' }}
    >
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold font-display">Notifications</h3>
        </div>
        {notifications.some(n => !n.isRead) && (
          <button
            onClick={handleMarkAllRead}
            className="text-xs text-blue-400 hover:text-blue-300 font-medium transition flex items-center gap-1 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            Mark all read
          </button>
        )}
      </div>

      <div className="max-h-80 overflow-y-auto">
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <p className="text-xs text-slate-500">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-12 text-center flex flex-col items-center justify-center gap-3">
            <MailOpen className="w-10 h-10 text-slate-600" />
            <p className="text-sm text-slate-400 font-medium">All caught up!</p>
            <p className="text-xs text-slate-500 px-6">No notifications to display.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/60">
            {notifications.map((notif) => {
              // Notification type-based styling
              let typeClass = 'border-l-blue-500';
              if (notif.type === 'success') typeClass = 'border-l-emerald-500';
              if (notif.type === 'warning') typeClass = 'border-l-amber-500';
              if (notif.type === 'error') typeClass = 'border-l-rose-500';

              return (
                <div
                  key={notif._id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-4 border-l-4 ${typeClass} hover:bg-slate-900/60 transition cursor-pointer ${
                    !notif.isRead ? 'bg-slate-900/30' : ''
                  }`}
                >
                  <p className={`text-sm ${!notif.isRead ? 'font-medium text-slate-100' : 'text-slate-400'}`}>
                    {notif.message}
                  </p>
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(notif.createdAt).toLocaleDateString()} at {new Date(notif.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    {!notif.isRead && (
                      <span className="ml-auto w-2 h-2 rounded-full bg-blue-500"></span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPopup;
