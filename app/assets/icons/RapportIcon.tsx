import type { ReactElement } from 'react';
import type { IconProps } from '@/app/components/icons/types';

export function RapportIcon(
  props: IconProps & { 'aria-hidden'?: boolean },
): ReactElement {
  const { className, focusable, 'aria-hidden': ariaHidden, ...rest } = props;

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
      focusable={focusable ?? 'false'}
      {...rest}
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="12" y1="11" x2="12" y2="17" />
      <line x1="9" y1="14" x2="15" y2="14" />
    </svg>
  );
}
