import type { ReactElement } from "react";
import type { IconProps } from "@/app/components/icons/types";

export function EyeIcon(
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
      <path d="M12 5c-5.06 0-8.82 3.39-10 7 1.18 3.61 4.94 7 10 7s8.82-3.39 10-7c-1.18-3.61-4.94-7-10-7Z" />
      <circle cx="12" cy="12" r="3.2" />
    </svg>
  );
}
