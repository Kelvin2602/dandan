import { useState, useCallback } from 'react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

export const useNotification = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((
    type: NotificationType, 
    message: string, 
    duration: number = 3000
  ) => {
    const id = Date.now().toString();
    const notification: Notification = { id, type, message, duration };
    
    setNotifications(prev => [...prev, notification]);
    
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
    
    return id;
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const success = useCallback((message: string, duration?: number) => 
    addNotification('success', message, duration), [addNotification]);
    
  const error = useCallback((message: string, duration?: number) => 
    addNotification('error', message, duration), [addNotification]);
    
  const warning = useCallback((message: string, duration?: number) => 
    addNotification('warning', message, duration), [addNotification]);
    
  const info = useCallback((message: string, duration?: number) => 
    addNotification('info', message, duration), [addNotification]);

  return {
    notifications,
    addNotification,
    removeNotification,
    success,
    error,
    warning,
    info,
  };
};