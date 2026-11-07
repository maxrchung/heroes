import type { RouteSectionProps } from "@solidjs/router";
import * as stylex from "@stylexjs/stylex";
import { color, fontFamily, size, space } from "../styles/const.stylex";
import { Navbar } from "./navbar";

const styles = stylex.create({
  page: {
    minHeight: "100vh",
    paddingInline: space[24],
    paddingBottom: space[24],
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
    paddingTop: space[16],
  },
});

export function Layout(props: RouteSectionProps) {
  return (
    <div sx={styles.page}>
      <Navbar />

      <main sx={styles.content}>{props.children}</main>
    </div>
  );
}
