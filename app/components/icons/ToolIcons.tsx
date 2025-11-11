import type { ComponentProps, ReactElement } from "react";

interface IconProps extends ComponentProps<"svg"> {
  className?: string;
}

export function OfferIcon(props: IconProps): ReactElement {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6" />
      <path d="M9 17h6" />
    </svg>
  );
}

export function ConventionIcon(props: IconProps): ReactElement {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M13.5 5.5 18.5 10.5" />
      <path d="m5 19 3.76-0.75a2 2 0 0 0 1.05-0.56l7.44-7.44a1.5 1.5 0 0 0 0-2.12L14.62 5.06a1.5 1.5 0 0 0-2.12 0L5.06 12.5a2 2 0 0 0-0.56 1.05L3.75 17.3A1.5 1.5 0 0 0 5 19Z" />
      <path d="M11 7 17 13" />
      <path d="M3 21h15" />
    </svg>
  );
}

export function DevoirIcon(props: IconProps): ReactElement {
  return (
    <svg
      viewBox="0 0 48 48"
      role="img"
      aria-hidden="true"
      {...props}
    >
      <title>Microsoft Teams</title>
      <rect x="15.5" y="10" width="19" height="26" rx="4" fill="#5b3fd3" />
      <path
        d="M20.5 16h9a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1V17a1 1 0 0 1 1-1Z"
        fill="#ffffff"
        opacity="0.16"
      />
      <path
        d="M22.25 19.25a.75.75 0 0 1 .75-.75h3a.75.75 0 1 1 0 1.5h-1.13v6.75a.75.75 0 0 1-1.5 0V20h-0.37a.75.75 0 0 1-.75-.75Z"
        fill="#ffffff"
      />
      <path
        d="M34.5 14h3.75a4.75 4.75 0 0 1 4.75 4.75v5.5A6.75 6.75 0 0 1 36.25 31h-1.75Z"
        fill="#4c2eb5"
      />
      <path
        d="M33 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
        fill="#7b83eb"
      />
      <path
        d="M12 18.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
        fill="#7b83eb"
      />
      <path
        d="M12 21.5h1.5a2.5 2.5 0 0 1 2.5 2.5v6h-4a4 4 0 0 1-4-4v-0.25A4.25 4.25 0 0 1 12 21.5Z"
        fill="#4c2eb5"
      />
      <path
        d="M24.5 34a6.5 6.5 0 0 1-6.5-6.5v-9a4 4 0 0 1 4-4h11a4 4 0 0 1 4 4v9A6.5 6.5 0 0 1 30.5 34Z"
        fill="#5b3fd3"
      />
    </svg>
  );
}

export function DossierIcon(props: IconProps): ReactElement {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M4 7h4l2 2h10a2 2 0 0 1 2 2v6.5a2.5 2.5 0 0 1-2.5 2.5H6.5A2.5 2.5 0 0 1 4 17.5V7z" />
      <path d="M4 7V5.5A1.5 1.5 0 0 1 5.5 4H9l2 2" />
      <path d="M9 14h6" />
    </svg>
  );
}

interface LogoMarkProps {
  className?: string;
}

export function LogoMark({ className }: LogoMarkProps): ReactElement {
  return (
    <svg
      viewBox="0 0 250 250"
      role="img"
      aria-hidden="true"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <g transform="matrix(1.3333333,0,0,-1.3333333,0,389.04)">
        <g transform="matrix(0.1,0,0,0.1,-0.36138015,10.026757)">
          <path
            d="m 1636.7874,2523.3154 c 0.01,19.58 -4.86,39.41 -15.35,57.58 -31.81,55.1 -102.26,73.97 -157.36,42.17 l -518.36996,-299.3 -518.398,299.3 c -55.094,31.8 -125.551,12.93 -157.364,-42.17 -31.808,-55.1 -12.933,-125.55 42.165,-157.36 l 575.997,-332.55 c 35.64,-20.58 79.56,-20.58 115.19996,0 l 403.19,232.78 v -772.84 c 0,-63.62 51.58,-115.2 115.2,-115.2 63.62,0 115.2,51.58 115.2,115.2 0,0 -0.1,972.39 -0.11,972.39 z m -633.48,-1205.2 -575.99796,332.55 c -55.094,31.81 -125.551,12.94 -157.364,-42.16 -31.808,-55.1 -12.933,-125.55 42.165,-157.36 l 575.997,-332.549 c 55.09,-31.812 125.54996,-12.941 157.35996,42.16 31.81,55.098 12.93,125.547 -42.16,157.359 z m 42.16,328.84 c -31.81,-55.11 -102.26996,-73.97 -157.35996,-42.17 l -575.997,332.55 c -55.098,31.81 -73.973,102.27 -42.165,157.37 31.813,55.1 102.27,73.97 157.364,42.16 l 575.99796,-332.55 c 55.09,-31.81 73.97,-102.27 42.16,-157.36"
            fill="#8dc640"
            fillRule="nonzero"
          />
        </g>
      </g>
    </svg>
  );
}
