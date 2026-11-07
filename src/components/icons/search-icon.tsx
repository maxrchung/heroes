import * as stylex from "@stylexjs/stylex";
import { size } from "../../styles/const.stylex";

const styles = stylex.create({
  icon: {
    display: "block",
    width: "auto",
    height: size.thumbnailSize,
    flex: "none",
  },
});

export function SearchIcon() {
  return (
    <svg
      sx={styles.icon}
      aria-hidden="true"
      viewBox="0 0 20.784 24"
      fill="currentColor"
    >
      <path
        fill-rule="evenodd"
        d="M 10.392 0 L 0 6 L 0 18 L 10.392 24 L 14.506 21.625 L 11.087 15.704 A 5.2 5.2 0 1 1 13.252 14.454 L 16.671 20.375 L 20.784 18 L 20.784 6 Z M 6.846 10.708 a 2.8 2.8 0 1 0 5.6 0 a 2.8 2.8 0 1 0 -5.6 0 Z"
      />
    </svg>
  );
}
