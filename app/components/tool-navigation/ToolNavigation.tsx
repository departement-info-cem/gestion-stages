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
  const indicatorStateRef = useRef<{ left: number; width: number } | null>(
    null
  );
  const stretchTimeoutRef = useRef<number | undefined>(undefined);

  const applyIndicatorFromLink = useCallback(
    (link: HTMLAnchorElement | null, options?: { animate?: boolean }) => {
      const shell = shellRef.current;
      if (!shell || !link) {
        setIndicatorStyle(undefined);
        indicatorStateRef.current = null;
        return;
      }

      const shellRect = shell.getBoundingClientRect();
      const linkRect = link.getBoundingClientRect();
      const offset = linkRect.left - shellRect.left;

      const width = linkRect.width;
      const animate = options?.animate ?? false;

      if (animate && indicatorStateRef.current) {
        const { left: previousLeft, width: previousWidth } =
          indicatorStateRef.current;
        if (stretchTimeoutRef.current !== undefined) {
          window.clearTimeout(stretchTimeoutRef.current);
          stretchTimeoutRef.current = undefined;
        }

        const movingForward = offset > previousLeft;
        const previousRight = previousLeft + previousWidth;
        const stretchStart = movingForward ? previousLeft : offset;
        const stretchWidth = movingForward
          ? Math.max(offset + width - previousLeft, width, previousWidth)
          : Math.max(previousRight - offset, width, previousWidth);

        setIndicatorStyle({
          width: `${stretchWidth}px`,
          transform: `translate3d(${stretchStart}px, 0, 0)`,
          opacity: 1,
        });

        stretchTimeoutRef.current = window.setTimeout(() => {
          setIndicatorStyle({
            width: `${width}px`,
            transform: `translate3d(${offset}px, 0, 0)`,
            opacity: 1,
          });
          indicatorStateRef.current = { left: offset, width };
          stretchTimeoutRef.current = undefined;
        }, 48);
        return;
      }

      if (stretchTimeoutRef.current !== undefined) {
        window.clearTimeout(stretchTimeoutRef.current);
        stretchTimeoutRef.current = undefined;
      }

      setIndicatorStyle({
        width: `${width}px`,
        transform: `translate3d(${offset}px, 0, 0)`,
        opacity: 1,
      });
      indicatorStateRef.current = { left: offset, width };
    },
    []
  );

  const syncIndicator = useCallback(
    (animate = false) => {
      const shell = shellRef.current;
      if (!shell) {
        setIndicatorStyle(undefined);
        return;
      }

      const activeLink = shell.querySelector<HTMLAnchorElement>(
        'a[aria-current="page"]'
      );
      applyIndicatorFromLink(activeLink ?? null, { animate });
    },
    [applyIndicatorFromLink]
  );

  const showIndicatorForKey = useCallback(
    (key: ToolNavigationKey | null, animate = false) => {
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

      applyIndicatorFromLink(link, { animate });
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
      showIndicatorForKey(previousKey, false);
    }

    const frame = window.requestAnimationFrame(() => {
      const shouldAnimate = Boolean(previousKey);
      syncIndicator(shouldAnimate);
      if (activeKey) {
        window.sessionStorage.setItem(STORAGE_KEY, activeKey);
      }
    });

    const handleResize = () => syncIndicator(false);
    window.addEventListener("resize", handleResize);

    const list = listRef.current;
    list?.addEventListener("scroll", handleResize, { passive: true });

    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => syncIndicator(false))
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

    const timer = window.setTimeout(() => syncIndicator(false), 48);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", handleResize);
      list?.removeEventListener("scroll", handleResize);
      observer?.disconnect();
      window.clearTimeout(timer);
      if (stretchTimeoutRef.current !== undefined) {
        window.clearTimeout(stretchTimeoutRef.current);
        stretchTimeoutRef.current = undefined;
      }
    };
  }, [items, showIndicatorForKey, syncIndicator]);

  return (
    <nav className={navClassName} aria-label={ariaLabel}>
      <div
        className={styles.shell}
        ref={shellRef}
        onPointerLeave={() => syncIndicator(false)}
      >
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
                  onFocus={() => syncIndicator(false)}
                  onBlur={(event) => {
                    const next = event.relatedTarget as Node | null;
                    const navElement = shellRef.current?.closest("nav");
                    if (!navElement || !next || !navElement.contains(next)) {
                      syncIndicator(false);
                    }
                  }}
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
