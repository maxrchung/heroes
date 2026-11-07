import * as stylex from "@stylexjs/stylex";
import { color, size, space, zIndex } from "../styles/const.stylex";
import { GitHubIcon } from "./icons/github-icon";
import { HeroesIcon } from "./icons/heroes-icon";

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
    justifyContent: "start",
    gap: space[8],
    width: "100%",
    maxWidth: size.pageWidth,
    margin: "auto",
  },
  iconLink: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flex: "none",
    color: color.textPrimary,
    textDecoration: "none",
    opacity: 0.75,
    ":hover": {
      opacity: 1,
    },
  },
});

export function Navbar() {
  return (
    <header sx={styles.header}>
      <nav sx={styles.nav} aria-label="Primary">
        <a sx={styles.iconLink} href="/" aria-label="Heroes">
          <HeroesIcon />
        </a>

        <a
          sx={styles.iconLink}
          href="https://github.com/maxrchung/heroes"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
        >
          <GitHubIcon />
        </a>
      </nav>
    </header>
  );
}
