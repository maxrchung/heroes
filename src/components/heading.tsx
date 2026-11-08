import { createSignal, Show, type JSX } from "solid-js";
import * as stylex from "@stylexjs/stylex";
import {
  fontFamily,
  fontSize,
  fontWeight,
  size,
  space,
} from "../styles/const.stylex";
import { LinkIcon } from "./icons/link-icon";

const styles = stylex.create({
  heading: {
    fontFamily: fontFamily.heading,
    fontWeight: fontWeight[400],
    scrollMarginTop: size.scrollOffset,
  },
  1: { fontSize: fontSize[32] },
  2: { fontSize: fontSize[24] },
  3: { fontSize: fontSize[20] },
  link: {
    color: "inherit",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    gap: space[4],
    cursor: "pointer",
  },
});

type HeadingProps = {
  level: 1 | 2 | 3;
  id: string;
  children: JSX.Element;
};

export function Heading(props: HeadingProps) {
  const [isHovered, setIsHovered] = createSignal(false);

  const handleClick = async () => {
    const url = new URL(`#${props.id}`, window.location.href).href;
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
    }

    if (window.location.hash === `#${props.id}`) {
      const el = document.getElementById(props.id);
      if (el) {
        el.scrollIntoView();
      }
    }
  };

  const content = () => (
    <a href={`#${props.id}`} sx={styles.link} onClick={handleClick}>
      <span>{props.children}</span>
      <Show when={isHovered()}>
        <LinkIcon />
      </Show>
    </a>
  );

  const headingHandlers = {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
    onFocusIn: () => setIsHovered(true),
    onFocusOut: () => setIsHovered(false),
  };

  switch (props.level) {
    case 1:
      return (
        <h1
          id={props.id}
          sx={[styles.heading, styles[props.level]]}
          {...headingHandlers}
        >
          {content()}
        </h1>
      );
    case 2:
      return (
        <h2
          id={props.id}
          sx={[styles.heading, styles[props.level]]}
          {...headingHandlers}
        >
          {content()}
        </h2>
      );
    case 3:
      return (
        <h3
          id={props.id}
          sx={[styles.heading, styles[props.level]]}
          {...headingHandlers}
        >
          {content()}
        </h3>
      );
  }
}
