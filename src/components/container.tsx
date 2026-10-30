import { Show, type JSX } from "solid-js";
import * as stylex from "@stylexjs/stylex";
import { space } from "../styles/const.stylex";
import { Heading } from "./heading";

const styles = stylex.create({
  container: {
    display: "flex",
    flexDirection: "column",
  },
  2: { gap: space[16] },
  3: { gap: space[12] },
});

type ContainerProps = {
  level: 2 | 3;
  heading?: JSX.Element;
  children?: JSX.Element;
};

export function Container({ level, heading, children }: ContainerProps) {
  return (
    <div sx={[styles.container, styles[level]]}>
      <Show when={heading}>
        {(heading) => <Heading level={level}>{heading()}</Heading>}
      </Show>

      {children}
    </div>
  );
}
