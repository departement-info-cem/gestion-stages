"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { ToolNavigationKey, ToolNavigationProps } from "./types";
import styles from "./ToolNavigation.module.css";

const STORAGE_KEY = "tool-navigation:last";

export function ToolNavigation({
  items,
  ariaLabel = "Navigation",
  className,
}: ToolNavigationProps) {
  const navClassName = className ? `${styles.nav} ${className}` : styles.nav;
  const shellRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<CSSProperties>();

  const applyIndicatorFromLink = useCallback(
    (link: HTMLAnchorElement | null) => {
      const shell = shellRef.current;
      if (!shell || !link) {
        setIndicatorStyle(undefined);
        return;
      }

      const shellRect = shell.getBoundingClientRect();
      const linkRect = link.getBoundingClientRect();
      const offset = linkRect.left - shellRect.left;

      setIndicatorStyle({
        width: `${linkRect.width}px`,
        left: `${offset}px`,
        transform: "none",
        opacity: 1,
      });
    },
    []
  );

  const syncIndicator = useCallback(() => {
    const shell = shellRef.current;
    if (!shell) {
      setIndicatorStyle(undefined);
      return;
    }

    const activeLink = shell.querySelector<HTMLAnchorElement>(
      'a[aria-current="page"]'
    );
    applyIndicatorFromLink(activeLink ?? null);
  }, [applyIndicatorFromLink]);

  const showIndicatorForKey = useCallback(
    (key: ToolNavigationKey | null) => {
      if (!key) {
        return false;
      }

      const shell = shellRef.current;
      if (!shell) {
        return false;
      }

      const link = shell.querySelector<HTMLAnchorElement>(
        `a[data-tool-nav-key="${key}"]`
      );
      if (!link) {
        return false;
      }

      applyIndicatorFromLink(link);
      return true;
    },
    [applyIndicatorFromLink]
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const activeKey = items.find((item) => item.isCurrent)?.key ?? null;
    const previousKey = window.sessionStorage.getItem(
      STORAGE_KEY
    ) as ToolNavigationKey | null;

    if (previousKey && previousKey !== activeKey) {
      showIndicatorForKey(previousKey);
    }

    const frame = window.requestAnimationFrame(() => {
      syncIndicator();
      if (activeKey) {
        window.sessionStorage.setItem(STORAGE_KEY, activeKey);
      }
    });

    const handleResize = () => syncIndicator();
    window.addEventListener("resize", handleResize);

    const list = listRef.current;
    list?.addEventListener("scroll", handleResize, { passive: true });

    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => syncIndicator())
        : undefined;
    if (observer) {
      const shell = shellRef.current;
      if (shell) {
        observer.observe(shell);
        const activeLink = shell.querySelector<HTMLAnchorElement>(
          'a[aria-current="page"]'
        );
        if (activeLink) {
          observer.observe(activeLink);
        }
      }
    }

    const timer = window.setTimeout(() => syncIndicator(), 48);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", handleResize);
      list?.removeEventListener("scroll", handleResize);
      observer?.disconnect();
      window.clearTimeout(timer);
    };
  }, [items, showIndicatorForKey, syncIndicator]);

  return (
    <nav className={navClassName} aria-label={ariaLabel}>
      <div className={styles.shell} ref={shellRef}>
        <div
          className={styles.indicator}
          style={indicatorStyle}
          aria-hidden="true"
        />
        <ul className={styles.list} ref={listRef}>
          {items.map((item) => {
            const baseLinkClass = item.isCurrent
              ? `${styles.link} ${styles.linkActive}`
              : styles.link;
            const linkClassName = item.hideLabel
              ? `${baseLinkClass} ${styles.linkIconOnly}`
              : baseLinkClass;
            const labelClassName = item.hideLabel
              ? styles.hiddenLabel
              : styles.label;

            return (
              <li key={item.href} className={styles.item}>
                <Link
                  className={linkClassName}
                  href={item.href}
                  aria-current={item.isCurrent ? "page" : undefined}
                  data-tool-nav-key={item.key}
                  onFocus={syncIndicator}
                  onMouseEnter={syncIndicator}
                >
                  <span className={styles.icon} aria-hidden="true">
                    {item.icon}
                  </span>
                  <span className={labelClassName}>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
