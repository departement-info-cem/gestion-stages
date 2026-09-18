import type { StatusMessage } from "./types";
import styles from "./StatusMessageList.module.css";

export interface StatusMessageListProps {
  messages: StatusMessage[];
}

export function StatusMessageList({ messages }: StatusMessageListProps) {
  if (!messages.length) return null;

  return (
    <div className={styles.messages} role="status" aria-live="polite">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`${styles.message} ${styles[message.type]}`}
        >
          {message.text}
        </div>
      ))}
    </div>
  );
}
