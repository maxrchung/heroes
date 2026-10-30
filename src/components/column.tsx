import type { JSX } from "solid-js";
import * as stylex from "@stylexjs/stylex";
import { space } from "../styles/const.stylex";

const styles = stylex.create({
  column: {
    display: "flex",
    flexDirection: "column",
  },
  16: {
    gap: space[16],
  },
  24: {
    gap: space[24],
  },
});

type ColumnProps = {
  gap: 16 | 24;
  children: JSX.Element;
};

export function Column({ gap, children }: ColumnProps) {
  return <div sx={[styles.column, styles[gap]]}>{children}</div>;
}
