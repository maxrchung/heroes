import { createEffect, createSignal, onCleanup } from "solid-js";
import * as stylex from "@stylexjs/stylex";
import {
  borderRadius,
  breakpoint,
  color,
  fontSize,
  size,
  space,
} from "../../styles/const.stylex";
import { TocItem, type TocItemProps } from "./toc-item";

export function getTocId(label: string): string {
  return label.toLowerCase().replace(/[^a-z0-9]/g, "-");
}

const styles = stylex.create({
  base: {
    overflowY: "auto",
    flexDirection: "column",
    gap: space[12],
    borderRadius: borderRadius[4],
  },
  sidebar: {
    position: "sticky",
    top: size.scrollOffset,
    alignSelf: "start",
    maxHeight: `calc(100vh - ${size.scrollOffset} - ${space[24]})`,
    display: {
      default: "none",
      [breakpoint.desktop]: "flex",
    },
    width: size.tocWidth,
    paddingTop: space[12],
  },
  menu: {
    position: "absolute",
    top: `calc(100% + ${space[8]})`,
    right: 0,
    width: size.tocWidth,
    maxHeight: `calc(100vh - ${size.scrollOffset} - ${space[24]})`,
    display: "flex",
    padding: space[16],
    backgroundColor: color.tileBg,
    fontSize: fontSize[16],
  },
  hidden: {
    display: "none",
  },
});

export type TocProps = {
  root: TocItemProps;
  variant?: "sidebar" | "menu";
  open?: boolean;
  onSelect?: (id: string) => void;
};

function collectIds(item: TocItemProps): string[] {
  return [item.id, ...(item.children?.flatMap(collectIds) ?? [])];
}

// The top margin should roughly match the heading scrollMarginTop / sticky
// offset; the bottom margin means a heading only counts in the upper part of
// the screen.
const OBSERVER_ROOT_MARGIN = `-${size.scrollOffset} 0px -60% 0px`;
const SELECT_SCROLL_TIMEOUT = 500;

export function Toc(props: TocProps) {
  const [activeId, setActiveId] = createSignal("");
  let isSelectScrolling = false;
  let timer: ReturnType<typeof setTimeout> | undefined;

  const handleSelect = (id: string) => {
    setActiveId(id);
    props.onSelect?.(id);
    isSelectScrolling = true;
    clearTimeout(timer);
    timer = setTimeout(() => {
      isSelectScrolling = false;
    }, SELECT_SCROLL_TIMEOUT);
  };

  createEffect(() => {
    const elements = collectIds(props.root)
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const visible = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }

        if (isSelectScrolling) return;

        // Topmost visible heading in document order. If none are visible,
        // keep the previous one to avoid flicker between sections.
        const first = elements.find((el) => visible.has(el.id));
        if (first) setActiveId(first.id);
      },
      { rootMargin: OBSERVER_ROOT_MARGIN },
    );

    elements.forEach((el) => observer.observe(el));
    onCleanup(() => {
      observer.disconnect();
      clearTimeout(timer);
    });
  });

  return (
    <nav
      sx={[
        styles.base,
        props.variant === "menu" ? styles.menu : styles.sidebar,
        props.variant === "menu" && props.open === false && styles.hidden,
      ]}
      aria-label="Table of contents"
    >
      <TocItem
        id={props.root.id}
        label={props.root.label}
        children={props.root.children}
        activeId={activeId()}
        onSelect={handleSelect}
      />
    </nav>
  );
}
