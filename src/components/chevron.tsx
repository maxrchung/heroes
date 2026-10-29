import * as stylex from "@stylexjs/stylex";
import { size } from "../styles/const.stylex";

const styles = stylex.create({
  icon: {
    display: "block",
    width: size.iconSize,
    height: size.iconSize,
    flex: "none",
  },
});

type ChevronProps = {
  direction: "down" | "left";
};

export function Chevron({ direction }: ChevronProps) {
  return (
    <svg sx={styles.icon} aria-hidden="true" viewBox="0 0 16 16" fill="none">
      <g transform={direction === "left" ? "rotate(90 8 8)" : undefined}>
        <path
          d="m4 6 4 4 4-4"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
    </svg>
  );
}
