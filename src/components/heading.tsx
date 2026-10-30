import type { JSX } from "solid-js";
import * as stylex from "@stylexjs/stylex";
import { fontFamily, fontSize, fontWeight } from "../styles/const.stylex";

const styles = stylex.create({
  heading: {
    fontFamily: fontFamily.heading,
    fontWeight: fontWeight[400],
    marginBlockEnd: "-8px",
  },
  noMargin: { marginBlockEnd: 0 },
  1: { fontSize: fontSize[32] },
  2: { fontSize: fontSize[24] },
  3: { fontSize: fontSize[20] },
});

type HeadingProps = {
  level: 1 | 2 | 3;
  children: JSX.Element;
  noMargin?: boolean;
};

export function Heading({ level, children, noMargin = false }: HeadingProps) {
  const sx = [styles.heading, noMargin && styles.noMargin];

  switch (level) {
    case 1:
      return <h1 sx={sx}>{children}</h1>;
    case 2:
      return <h2 sx={sx}>{children}</h2>;
    case 3:
      return <h3 sx={sx}>{children}</h3>;
  }
}
