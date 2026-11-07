import * as stylex from "@stylexjs/stylex";
import { color, space, zIndex } from "../styles/const.stylex";
import { GitHubIcon } from "./icons/github-icon";
import { HomeIcon } from "./icons/home-icon";
import { SearchBar } from "./search-bar";

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
  links: {
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
});

export function Navbar() {
  return (
    <header sx={styles.header}>
      <nav sx={styles.nav} aria-label="Primary">
        <SearchBar />

        <div sx={styles.links}>
          <a sx={styles.icon} href="/" aria-label="Home">
            <HomeIcon />
          </a>

          <a
            sx={styles.icon}
            href="https://github.com/maxrchung/heroes"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <GitHubIcon />
          </a>
        </div>
      </nav>
    </header>
  );
}
