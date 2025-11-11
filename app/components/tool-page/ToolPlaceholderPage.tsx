import type { ReactNode } from "react";
import { ToolNavigation } from "../tool-navigation/ToolNavigation";
import { buildToolNavigationItems } from "../tool-navigation/navigation";
import type { ToolNavigationKey } from "../tool-navigation/types";
import styles from "./ToolPlaceholderPage.module.css";

interface ToolPlaceholderPageProps {
  current: ToolNavigationKey;
  title: string;
  description: string;
  actions?: ReactNode;
}

export function ToolPlaceholderPage({
  current,
  title,
  description,
  actions,
}: ToolPlaceholderPageProps) {
  const navigationItems = buildToolNavigationItems(current);

  return (
    <div className={styles.wrapper}>
      <ToolNavigation
        ariaLabel="Navigation des outils"
        className={styles.navigation}
        items={navigationItems}
      />
      <section className={styles.surface}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.lead}>{description}</p>
        {actions ? <div className={styles.actions}>{actions}</div> : null}
      </section>
    </div>
  );
}
