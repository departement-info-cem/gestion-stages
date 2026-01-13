import { useState, useCallback } from 'react';
import type { StatusMessage } from '../types';

export function useStatusMessages() {
  const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]);

  const addStatusMessage = useCallback(
    (type: 'success' | 'error' | 'warning', message: string) => {
      const newMessage: StatusMessage = {
        id: Date.now(),
        type,
        message,
        timestamp: new Date(),
      };
      setStatusMessages((prev) => [newMessage, ...prev].slice(0, 10));
    },
    []
  );

  const clearStatusMessages = useCallback(() => {
    setStatusMessages([]);
  }, []);

  return {
    statusMessages,
    addStatusMessage,
    clearStatusMessages,
  };
}
