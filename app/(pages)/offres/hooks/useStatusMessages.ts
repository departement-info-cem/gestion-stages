import { useState, useCallback, useRef } from 'react';
import type {
  StatusMessage,
  StatusMessageType,
} from '@/app/components/status-messages/types';

export type MessageType = StatusMessageType;
export type { StatusMessage };

export function useStatusMessages() {
  const [messages, setMessages] = useState<StatusMessage[]>([]);
  const idCounterRef = useRef(0);

  const pushMessage = useCallback((type: MessageType, text: string) => {
    idCounterRef.current += 1;
    const uniqueId = Date.now() + idCounterRef.current;
    setMessages((prev) => [
      ...prev,
      { id: uniqueId, type, text },
    ]);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    statusMessages: messages,
    pushStatus: pushMessage,
    clearStatus: clearMessages,
  };
}
