import type { JSX } from "solid-js";
import * as stylex from "@stylexjs/stylex";
import { fontFamily, fontSize, fontWeight, size } from "../styles/const.stylex";

const styles = stylex.create({
  heading: {
    fontFamily: fontFamily.heading,
    fontWeight: fontWeight[400],
    scrollMarginTop: size.scrollOffset,
  },
  1: { fontSize: fontSize[32] },
  2: { fontSize: fontSize[24] },
  3: { fontSize: fontSize[20] },
});

type HeadingProps = {
  level: 1 | 2 | 3;
  id?: string;
  children: JSX.Element;
};

export function Heading(props: HeadingProps) {
  switch (props.level) {
    case 1:
      return (
        <h1 id={props.id} sx={[styles.heading, styles[props.level]]}>
          {props.children}
        </h1>
      );
    case 2:
      return (
        <h2 id={props.id} sx={[styles.heading, styles[props.level]]}>
          {props.children}
        </h2>
      );
    case 3:
      return (
        <h3 id={props.id} sx={[styles.heading, styles[props.level]]}>
          {props.children}
        </h3>
      );
  }
}
