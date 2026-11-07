import { For, Show } from "solid-js";
import * as stylex from "@stylexjs/stylex";
import { space } from "../../styles/const.stylex";

const styles = stylex.create({
  item: {
    display: "flex",
    flexDirection: "column",
    gap: space[8],
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  link: {
    backgroundColor: "transparent",
    color: "inherit",
    textDecoration: "none",
    opacity: 0.75,
    ":hover": {
      textDecoration: "underline",
    },
  },
  active: {
    opacity: 1,
    fontWeight: "bold",
  },
  leftPadding: {
    paddingInlineStart: space[16],
  },
});

export type TocItemProps = {
  id: string;
  label: string;
  children?: TocItemProps[];
};

type TocItemInternalProps = TocItemProps & {
  activeId: string;
  onSelect: (id: string) => void;
};

export function TocItem(props: TocItemInternalProps) {
  const isActive = () => props.activeId === props.id;

  return (
    <ul sx={styles.item}>
      <li>
        <a
          sx={[styles.link, isActive() && styles.active]}
          href={`#${props.id}`}
          onClick={() => props.onSelect?.(props.id)}
          aria-current={isActive() ? "location" : undefined}
        >
          {props.label}
        </a>
      </li>

      <Show when={props.children && props.children.length > 0}>
        <li>
          <ul sx={[styles.item, styles.leftPadding]}>
            <For each={props.children}>
              {(child) => (
                <TocItem
                  id={child.id}
                  label={child.label}
                  children={child.children}
                  activeId={props.activeId}
                  onSelect={props.onSelect}
                />
              )}
            </For>
          </ul>
        </li>
      </Show>
    </ul>
  );
}
