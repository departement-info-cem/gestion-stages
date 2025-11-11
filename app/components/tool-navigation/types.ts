import type { ReactNode } from "react";

export type ToolNavigationKey =
  | "home"
  | "offres"
  | "convention"
  | "devoir"
  | "dossier";

export interface ToolNavigationItem {
  key: ToolNavigationKey;
  href: string;
  label: string;
  icon: ReactNode;
  isCurrent?: boolean;
}

export interface ToolNavigationProps {
  items: ReadonlyArray<ToolNavigationItem>;
  ariaLabel?: string;
  className?: string;
}
