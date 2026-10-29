import type { RouteSectionProps } from "@solidjs/router";
import * as stylex from "@stylexjs/stylex";
import { color, fontFamily, size, space } from "../styles/const.stylex";

const styles = stylex.create({
  page: {
    minHeight: "100vh",
    padding: space[24],
    backgroundColor: color.pageBg,
    color: color.textPrimary,
    fontFamily: fontFamily.body,
  },
  content: {
    display: "flex",
    flexDirection: "column",
    gap: space[24],
    width: "100%",
    maxWidth: size.pageWidth,
    marginInline: "auto",
  },
});

export function Layout(props: RouteSectionProps) {
  return (
    <main sx={styles.page}>
      <div sx={styles.content}>{props.children}</div>
    </main>
  );
}
