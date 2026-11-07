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

export function TocIcon() {
  return (
    <svg
      sx={styles.icon}
      aria-hidden="true"
      viewBox="0 0 20.784 24"
      fill="currentColor"
    >
      {/* Hexagon arch with open bottom */}
      <path d="M 10.392 0 L 0 6 L 0 18 L 4.2 20.42 L 4.2 6.8 L 16.584 6.8 L 16.584 20.42 L 20.784 18 L 20.784 6 Z" />

      {/* Row 1: y center = 10.55 */}
      <circle cx="7.3" cy="10.55" r="0.75" />
      <rect x="8.8" y="9.8" width="5.184" height="1.5" />

      {/* Row 2: y center = 13.85 */}
      <circle cx="7.3" cy="13.85" r="0.75" />
      <rect x="8.8" y="13.1" width="5.184" height="1.5" />

      {/* Row 3: y center = 17.15 */}
      <circle cx="7.3" cy="17.15" r="0.75" />
      <rect x="8.8" y="16.4" width="5.184" height="1.5" />

      {/* Row 4: y center = 20.45 */}
      <circle cx="7.3" cy="20.45" r="0.75" />
      <rect x="8.8" y="19.7" width="5.184" height="1.5" />
    </svg>
  );
}
