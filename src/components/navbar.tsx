import { createSignal, onCleanup, onMount, Show, useContext } from "solid-js";
import * as stylex from "@stylexjs/stylex";
import { breakpoint, color, space, zIndex } from "../styles/const.stylex";
import { TocContext } from "../toc-context";
import { GitHubIcon } from "./icons/github-icon";
import { TocIcon } from "./icons/toc-icon";
import { SearchBar } from "./search-bar";
import { Toc } from "./toc";

const styles = stylex.create({
  header: {
    position: "sticky",
    top: 0,
    zIndex: zIndex.navbar,
    paddingBlock: space[8],
    backgroundColor: color.pageBg,
  },
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: space[16],
  },
  actions: {
    display: "flex",
    alignItems: "center",
    justifyContent: "start",
    flexShrink: 0,
    gap: space[8],
  },
  icon: {
    color: color.textSecondary,
    textDecoration: "none",
    ":hover": {
      color: color.textPrimary,
    },
  },
  tocWrapper: {
    position: "relative",
    display: {
      default: "flex",
      [breakpoint.desktop]: "none",
    },
  },
  button: {
    padding: 0,
    borderStyle: "none",
    backgroundColor: "transparent",
    color: color.textSecondary,
    cursor: "pointer",
    ":hover": {
      color: color.textPrimary,
    },
  },
  buttonActive: {
    color: color.textPrimary,
  },
});

export function Navbar() {
  const tocCtx = useContext(TocContext);
  const [isOpen, setIsOpen] = createSignal(false);
  let menuContainerRef: HTMLDivElement | undefined;

  onMount(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (
        isOpen() &&
        menuContainerRef &&
        !menuContainerRef.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (isOpen() && event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleDocumentClick);
    window.addEventListener("keydown", handleKeyDown);

    onCleanup(() => {
      document.removeEventListener("click", handleDocumentClick);
      window.removeEventListener("keydown", handleKeyDown);
    });
  });

  return (
    <header sx={styles.header}>
      <nav sx={styles.nav} aria-label="Primary">
        <SearchBar />

        <div sx={styles.actions}>
          <a
            sx={styles.icon}
            href="https://github.com/maxrchung/heroes"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            title="GitHub"
          >
            <GitHubIcon />
          </a>

          <Show when={tocCtx?.toc()}>
            {(root) => (
              <div ref={menuContainerRef} sx={styles.tocWrapper}>
                <button
                  type="button"
                  sx={[styles.button, isOpen() && styles.buttonActive]}
                  aria-label="Table of contents"
                  title="Table of contents"
                  aria-expanded={isOpen()}
                  aria-haspopup="true"
                  onClick={() => setIsOpen((prev) => !prev)}
                >
                  <TocIcon />
                </button>

                <Toc
                  root={root()}
                  variant="menu"
                  open={isOpen()}
                  onSelect={() => setIsOpen(false)}
                />
              </div>
            )}
          </Show>
        </div>
      </nav>
    </header>
  );
}
