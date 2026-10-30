import type { JSX } from "solid-js";
import * as stylex from "@stylexjs/stylex";
import { space } from "../styles/const.stylex";

const styles = stylex.create({
  container: {
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

type ContainerProps = {
  gap: 16 | 24;
  children: JSX.Element;
};

export function Container({ gap, children }: ContainerProps) {
  return <div sx={[styles.container, styles[gap]]}>{children}</div>;
}
