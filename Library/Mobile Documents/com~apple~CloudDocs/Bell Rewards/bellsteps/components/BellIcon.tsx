interface BellIconProps {
  color: string;
  size?: number;
  className?: string;
}

export function BellIcon({ color, size = 80, className }: BellIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Bell body */}
      <path
        d="M50 15 C35 15, 25 25, 25 40 L25 50 C25 60, 30 68, 35 75 L35 80 C35 85, 40 90, 45 90 L55 90 C60 90, 65 85, 65 80 L65 75 C70 68, 75 60, 75 50 L75 40 C75 25, 65 15, 50 15 Z"
        fill={color}
        stroke="#fff"
        strokeWidth="2"
      />
      {/* Bell clapper */}
      <circle cx="50" cy="45" r="8" fill="#fff" />
      <line
        x1="50"
        y1="53"
        x2="50"
        y2="70"
        stroke="#fff"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="50" cy="70" r="6" fill="#fff" />
    </svg>
  );
}
