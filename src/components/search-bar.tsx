import { createSignal, onCleanup, onMount } from "solid-js";
import * as stylex from "@stylexjs/stylex";
import {
  borderRadius,
  color,
  fontSize,
  size,
  space,
} from "../styles/const.stylex";
import { SearchIcon } from "./icons/search-icon";

const styles = stylex.create({
  container: {
    display: "flex",
    alignItems: "center",
    gap: space[8],
    width: '100%',
    maxWidth: size.searchWidth,
  },
  button: {
    flexShrink: 0,
    backgroundColor: "transparent",
    borderStyle: "none",
    color: color.textSecondary,
    cursor: "pointer",
    ":hover": {
      color: color.textPrimary,
    },
  },
  active: {
    color: color.textPrimary,
  },
  input: {
    width: "100%",
    paddingBlock: space[8],
    paddingInline: space[12],
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "transparent",
    borderRadius: borderRadius[4],
    backgroundColor: color.tileBg,
    color: color.textPrimary,
    fontSize: fontSize[16],
    "::placeholder": {
      color: color.textSecondary,
    },
    ":hover": {
      backgroundColor: color.tileHoverBg,
    },
  },
});

export function SearchBar() {
  const [query, setQuery] = createSignal("");
  const [isActive, setIsActive] = createSignal(false);
  let inputRef: HTMLInputElement | undefined;

  onMount(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        inputRef?.blur();
        return;
      }

      if (
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        event.key.length !== 1
      ) {
        return;
      }

      if (!isActive()) {
        setQuery("");
        inputRef?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    onCleanup(() => {
      window.removeEventListener("keydown", handleKeyDown);
    });
  });

  return (
    <div sx={styles.container}>
      <button
        type="button"
        sx={[styles.button, isActive() && styles.active]}
        aria-label="Search"
        onClick={() => inputRef?.focus()}
      >
        <SearchIcon />
      </button>

      <input
        ref={inputRef}
        type="text"
        sx={styles.input}
        placeholder="Search hero..."
        aria-label="Search hero"
        value={query()}
        onInput={(event) => setQuery(event.currentTarget.value)}
        onFocus={() => setIsActive(true)}
        onBlur={() => setIsActive(false)}
      />
    </div>
  );
}
