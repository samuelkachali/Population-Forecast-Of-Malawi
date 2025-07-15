import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const NotificationContext = createContext();

const NOTIF_KEY = 'dashboard_notifications';

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(NOTIF_KEY);
    if (stored) {
      setNotifications(JSON.parse(stored));
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(NOTIF_KEY, JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = useCallback((notif) => {
    setNotifications((prev) => [
      { ...notif, id: Date.now(), read: false, time: new Date().toISOString() },
      ...prev,
    ]);
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map(n => ({ ...n, read: true })));
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter(n => n.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAllAsRead, removeNotification, clearAllNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext); 