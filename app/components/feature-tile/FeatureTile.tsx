"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./FeatureTile.module.css";

export type FeatureTileAccent = "offre" | "convention" | "devoir" | "dossier";

export interface FeatureTileProps {
  id: string;
  accent: FeatureTileAccent;
  title: string;
  description: string;
  href: string;
  icon: ReactNode;
}

export function FeatureTile({
  id,
  accent,
  title,
  description,
  href,
  icon,
}: FeatureTileProps) {
  const descriptionId = `${id}-description`;

  return (
    <article className={`${styles.tile} ${styles[accent]}`}>
      <Link
        className={styles.body}
        href={href}
        aria-describedby={descriptionId}
      >
        <div className={styles.iconGroup}>
          <div className={styles.iconWrapper} aria-hidden="true">
            {icon}
          </div>
          <p id={descriptionId} className={styles.tooltip} role="tooltip">
            {description}
          </p>
        </div>
        <h2 className={styles.title}>{title}</h2>
      </Link>
    </article>
  );
}
