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
    opacity: 0.7,
    ":hover": {
      textDecoration: "underline",
    },
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

export function TocItem(props: TocItemProps) {
  return (
    <ul sx={styles.item}>
      <li>
        <a sx={[styles.link]} href={`#${props.id}`}>
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
                />
              )}
            </For>
          </ul>
        </li>
      </Show>
    </ul>
  );
}
