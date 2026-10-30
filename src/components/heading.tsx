import type { JSX } from "solid-js";
import * as stylex from "@stylexjs/stylex";
import { fontFamily, fontSize, fontWeight } from "../styles/const.stylex";

type HeadingProps = Omit<JSX.HTMLAttributes<HTMLHeadingElement>, "sx"> & {
  level: 1 | 2 | 3;
  children: JSX.Element;
};

const styles = stylex.create({
  h1: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize[32],
    fontWeight: fontWeight[400],
  },
  h2: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize[24],
    fontWeight: fontWeight[400],
  },
  h3: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize[20],
    fontWeight: fontWeight[400],
  },
});

export function Heading({ level, children, ...rest }: HeadingProps) {
  switch (level) {
    case 1:
      return (
        <h1 sx={styles.h1} {...rest}>
          {children}
        </h1>
      );
    case 2:
      return (
        <h2 sx={styles.h2} {...rest}>
          {children}
        </h2>
      );
    case 3:
      return (
        <h3 sx={styles.h3} {...rest}>
          {children}
        </h3>
      );
  }
}
