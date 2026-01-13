import { useState, useCallback, useRef } from "react";
import type { StatusMessage, StatusTone } from "../types";

export function useStatusMessages() {
  const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]);
  const statusIdRef = useRef(0);

  const pushStatus = useCallback((tone: StatusTone, message: string) => {
    statusIdRef.current += 1;
    const uniqueId = Date.now() + statusIdRef.current;
    setStatusMessages((previous) => [
      { id: uniqueId, tone, message },
      ...previous.slice(0, 4),
    ]);
  }, []);

  const clearStatuses = useCallback(() => {
    setStatusMessages([]);
  }, []);

  return { statusMessages, pushStatus, clearStatuses };
}
