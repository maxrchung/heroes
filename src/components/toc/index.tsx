import * as stylex from "@stylexjs/stylex";
import {
  borderRadius,
  breakpoint,
  size,
  space,
} from "../../styles/const.stylex";
import { TocItem, type TocItemProps } from "./toc-item";

export function getTocId(label: string): string {
  return label.toLowerCase().replace(/[^a-z0-9]/g, "-");
}

const styles = stylex.create({
  toc: {
    position: "sticky",
    top: space[24],
    alignSelf: "start",
    maxHeight: `calc(100vh - ${space[24]} * 2)`,
    overflowY: "auto",
    display: {
      default: "none",
      [breakpoint.desktop]: "flex",
    },
    flexDirection: "column",
    gap: space[12],
    width: size.tocWidth,
    paddingTop: space[16],
    borderRadius: borderRadius[4],
  },
});

export type TocProps = {
  root: TocItemProps;
};

export function Toc(props: TocProps) {
  return (
    <nav sx={styles.toc} aria-label="Table of contents">
      <TocItem
        id={props.root.id}
        label={props.root.label}
        children={props.root.children}
      />
    </nav>
  );
}
