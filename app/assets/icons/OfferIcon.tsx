import type { ReactElement } from "react";
import type { IconProps } from "@/app/components/icons/types";

export function OfferIcon(
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
      <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6" />
      <path d="M9 17h6" />
    </svg>
  );
}
