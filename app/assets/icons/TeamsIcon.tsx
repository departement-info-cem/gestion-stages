import type { ReactElement } from "react";
import type { IconProps } from "@/app/components/icons/types";

export function TeamsIcon(
  props: IconProps & { "aria-hidden"?: boolean }
): ReactElement {
  const { className, focusable, "aria-hidden": ariaHidden, ...rest } = props;

  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden={ariaHidden ?? true}
      focusable={focusable ?? "false"}
      {...rest}
    >
      <rect x="9" y="5" width="8.5" height="11.5" rx="1.9" fill="#5b3fd3" />
      <rect
        x="4.75"
        y="9.25"
        width="4.75"
        height="6.5"
        rx="1.6"
        fill="#4c2eb5"
      />
      <circle cx="17.75" cy="6.75" r="2.2" fill="#7b83eb" />
      <circle cx="6.9" cy="7.75" r="1.9" fill="#7b83eb" />
      <path
        d="M11.35 7.9a0.75 0.75 0 0 1 0.75-0.75h3.1a0.75 0.75 0 0 1 0 1.5h-1.2v5.3a0.9 0.9 0 0 1-1.8 0V8.65h-1.1a0.75 0.75 0 0 1-0.75-0.75Z"
        fill="#ffffff"
      />
      <path
        d="M19.5 9.9h1.8a2.2 2.2 0 0 1 2.2 2.2v3.1A4.8 4.8 0 0 1 18.7 20h-1.4"
        stroke="#4c2eb5"
        strokeWidth={1.4}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M9.5 16.75h4.75A3.75 3.75 0 0 0 18 13V9.5"
        stroke="#5b3fd3"
        strokeWidth={1.2}
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
