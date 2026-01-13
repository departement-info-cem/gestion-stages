import type { ReactNode } from "react";
import styles from "./ToolPlaceholderPage.module.css";

interface ToolPlaceholderPageProps {
  current: string;
  title: string;
  description: string;
  actions?: ReactNode;
}

export function ToolPlaceholderPage({
  title,
  description,
  actions,
}: ToolPlaceholderPageProps) {
  return (
    <div className={styles.container}>
      <section className={styles.surface}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.lead}>{description}</p>
        {actions ? <div className={styles.actions}>{actions}</div> : null}
      </section>
    </div>
  );
}
