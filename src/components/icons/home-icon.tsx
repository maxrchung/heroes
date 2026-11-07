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

export function HomeIcon() {
  return (
    <svg
      sx={styles.icon}
      aria-hidden="true"
      viewBox="0 0 20.784 24"
      fill="currentColor"
    >
      <path d="M 10.392 0 L 0 6 L 0 18 L 5.992 21.46 L 5.992 13.492 L 3.992 13.492 L 10.392 6.131 L 16.792 13.492 L 14.792 13.492 L 14.792 21.46 L 20.784 18 L 20.784 6 Z M 8.792 21.46 L 8.792 16 L 11.992 16 L 11.992 21.46 Z" />
    </svg>
  );
}
