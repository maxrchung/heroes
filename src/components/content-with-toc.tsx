import type { JSX } from "solid-js";
import * as stylex from "@stylexjs/stylex";
import { breakpoint, size, space } from "../styles/const.stylex";

const styles = stylex.create({
  container: {
    display: "grid",
    gridTemplateColumns: {
      default: "minmax(0, 1fr)",
      [breakpoint.desktop]: `minmax(0, 1fr) ${size.tocWidth}`,
    },
    gap: space[24],
    width: "100%",
    alignItems: "start",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    gap: space[24],
    minWidth: 0,
  },
});

type ContentWithTocProps = {
  children: JSX.Element;
  toc: JSX.Element;
};

export function ContentWithToc(props: ContentWithTocProps) {
  return (
    <div sx={styles.container}>
      <div sx={styles.content}>{props.children}</div>

      {props.toc}
    </div>
  );
}
