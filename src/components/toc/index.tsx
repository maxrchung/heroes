import { createEffect, createSignal, onCleanup } from "solid-js";
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

function collectIds(item: TocItemProps): string[] {
  return [item.id, ...(item.children?.flatMap(collectIds) ?? [])];
}

// The top margin should roughly match the heading scrollMarginTop / sticky
// offset; the bottom margin means a heading only counts in the upper part of
// the screen.
const OBSERVER_ROOT_MARGIN = "-24px 0px -60% 0px";

export function Toc(props: TocProps) {
  const [activeId, setActiveId] = createSignal<string>();

  createEffect(() => {
    const elements = collectIds(props.root)
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    console.log("elements", elements);

    const visible = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        // Topmost visible heading in document order. If none are visible,
        // keep the previous one to avoid flicker between sections.
        const first = elements.find((el) => visible.has(el.id));
        if (first) setActiveId(first.id);

        console.log(first);
      },
      { rootMargin: OBSERVER_ROOT_MARGIN },
    );

    elements.forEach((el) => observer.observe(el));
    onCleanup(() => observer.disconnect());
  });

  return (
    <nav sx={styles.toc} aria-label="Table of contents">
      <TocItem
        id={props.root.id}
        label={props.root.label}
        children={props.root.children}
        activeId={activeId()}
      />
    </nav>
  );
}
