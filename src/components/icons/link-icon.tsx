import * as stylex from "@stylexjs/stylex";
import { color, size } from "../../styles/const.stylex";

const styles = stylex.create({
  icon: {
    display: "block",
    flex: "none",
    color: color.textSecondary,
    width: size.linkSize,
    height: size.linkSize,
  },
});

export function LinkIcon() {
  return (
    <svg
      sx={styles.icon}
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <g transform="rotate(-45 12 12)">
        <path d="M14.5 8h2.5a4 4 0 0 1 0 8h-2.5" />
        <path d="M9.5 8H7a4 4 0 0 0 0 8h2.5" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </g>
    </svg>
  );
}
