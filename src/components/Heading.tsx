import type { JSX } from "solid-js";
import * as stylex from "@stylexjs/stylex";

type HeadingProps = Omit<JSX.HTMLAttributes<HTMLHeadingElement>, "sx"> & {
  level: 1 | 2;
  children: JSX.Element;
};

const styles = stylex.create({
  h1: {
    fontFamily: "serif",
    fontSize: "32px",
    fontWeight: 400,
  },
  h2: {
    fontFamily: "serif",
    fontSize: "24px",
    fontWeight: 400,
  },
});

export function Heading({ level, children, ...rest }: HeadingProps) {
  if (level === 1) {
    return (
      <h1 sx={styles.h1} {...rest}>
        {children}
      </h1>
    );
  }

  return (
    <h2 sx={styles.h2} {...rest}>
      {children}
    </h2>
  );
}
