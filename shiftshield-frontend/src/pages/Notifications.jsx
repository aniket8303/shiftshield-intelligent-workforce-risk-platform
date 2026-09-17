import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle2, Circle } from 'lucide-react';
import api from '../services/api';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, readStatus: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8 font-medium text-slate-500">Loading notifications...</div>;

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <Bell className="w-6 h-6 text-brand-500" /> Notifications
        </h1>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <ul className="divide-y divide-slate-100">
          {notifications.map((n) => (
            <li key={n.id} className={`p-4 hover:bg-slate-50 transition-colors flex items-start gap-4 ${n.readStatus ? 'opacity-60' : 'bg-brand-50/20'}`}>
              <div className="mt-1">
                {n.readStatus ? (
                  <CheckCircle2 className="w-5 h-5 text-slate-400" />
                ) : (
                  <Circle className="w-5 h-5 text-brand-500 fill-brand-500" />
                )}
              </div>
              <div className="flex-1">
                <p className={`text-sm ${n.readStatus ? 'text-slate-600' : 'font-semibold text-slate-800'}`}>
                  {n.message}
                </p>
                <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                  <span className="uppercase font-medium bg-slate-100 px-2 py-0.5 rounded">{n.type}</span>
                  <span>{new Date(n.createdAt).toLocaleString()}</span>
                </div>
              </div>
              {!n.readStatus && (
                <button
                  onClick={() => markAsRead(n.id)}
                  className="text-xs font-medium text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Mark Read
                </button>
              )}
            </li>
          ))}
          {notifications.length === 0 && (
            <li className="p-8 text-center text-slate-500 flex flex-col items-center">
              <Bell className="w-8 h-8 text-slate-300 mb-2" />
              <p>You have no notifications.</p>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
