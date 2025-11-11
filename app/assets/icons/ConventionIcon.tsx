import type { ReactElement } from "react";
import type { IconProps } from "@/app/components/icons/types";

export function ConventionIcon(
  props: IconProps & { "aria-hidden"?: boolean }
): ReactElement {
  const { className, focusable, "aria-hidden": ariaHidden, ...rest } = props;

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={ariaHidden ?? true}
      focusable={focusable ?? "false"}
      {...rest}
    >
      <path d="M13.5 5.5 18.5 10.5" />
      <path d="M5 19l3.76-.75a2 2 0 0 0 1.05-.56l7.44-7.44a1.5 1.5 0 0 0 0-2.12L14.62 5.06a1.5 1.5 0 0 0-2.12 0L5.06 12.5a2 2 0 0 0-.56 1.05L3.75 17.3A1.5 1.5 0 0 0 5 19Z" />
      <path d="M11 7l6 6" />
      <path d="M3 21h15" />
    </svg>
  );
}
