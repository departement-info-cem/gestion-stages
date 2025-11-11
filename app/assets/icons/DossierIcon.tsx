import type { ReactElement } from "react";
import type { IconProps } from "@/app/components/icons/types";

export function DossierIcon(
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
      <path d="M4 7h4l2 2h10a2 2 0 0 1 2 2v6.5a2.5 2.5 0 0 1-2.5 2.5H6.5A2.5 2.5 0 0 1 4 17.5V7z" />
      <path d="M4 7V5.5A1.5 1.5 0 0 1 5.5 4H9l2 2" />
      <path d="M9 14h6" />
    </svg>
  );
}
