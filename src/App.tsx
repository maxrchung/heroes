import { createMemo, createSignal, For } from "solid-js";
import * as stylex from "@stylexjs/stylex";
import { HEROES_DATA } from "./data";
import { Role, type Hero } from "./data/types";
import { Heading } from "./components/Heading";
import { colors } from "./styles/colors.stylex";
import { borderRadius } from "./styles/borderRadius.stylex";
import { spacing } from "./styles/spacing.stylex";

const SORT_MODE_STORAGE_KEY = "heroes.sortMode";
const heroes = Object.values(HEROES_DATA);
const roleOrder = Object.values(Role);

const styles = stylex.create({
  page: {
    minHeight: "100vh",
    padding: spacing[24],
    backgroundColor: colors.pageBg,
    color: colors.textPrimary,
    fontFamily: "sans-serif",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    gap: spacing[24],
    width: "100%",
    maxWidth: "960px",
    marginInline: "auto",
  },
  headingRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing[16],
  },
  sortSelectContainer: {
    position: "relative",
  },
  sortSelect: {
    appearance: "none",
    paddingBlock: spacing[8],
    paddingInlineStart: spacing[12],
    paddingInlineEnd: spacing[36],
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "transparent",
    borderRadius: borderRadius[4],
    backgroundColor: colors.controlBg,
    color: colors.textPrimary,
    cursor: "pointer",
    ":hover": {
      backgroundColor: colors.controlHoverBg,
    },
  },
  sortChevron: {
    position: "absolute",
    top: "50%",
    right: spacing[12],
    width: "16px",
    height: "16px",
    transform: "translateY(-50%)",
    color: colors.textPrimary,
    pointerEvents: "none",
  },
  heroGroup: {
    display: "flex",
    flexDirection: "column",
    gap: spacing[16],
  },
  heroList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    listStyle: "none",
    gap: spacing[8],
  },
  heroLink: {
    display: "flex",
    alignItems: "center",
    gap: spacing[12],
    paddingBlock: spacing[8],
    paddingInline: spacing[12],
    borderRadius: borderRadius[4],
    backgroundColor: colors.controlBg,
    color: "inherit",
    textDecoration: "none",
    ":hover": {
      backgroundColor: colors.controlHoverBg,
    },
  },
  heroPortrait: {
    width: "48px",
    height: "48px",
    flex: "none",
    objectFit: "cover",
    borderRadius: "100%",
  },
});

function App() {
  const localSortMode = localStorage.getItem(SORT_MODE_STORAGE_KEY);
  const [sort, setSort] = createSignal(localSortMode ?? "name");

  const groups = createMemo(() => {
    const sortedHeroes = [...heroes];

    switch (sort()) {
      case "release":
        sortedHeroes.sort(
          (a, b) =>
            b.releaseDate.localeCompare(a.releaseDate) ||
            a.name.localeCompare(b.name),
        );
        break;
      case "role":
        sortedHeroes.sort(
          (a, b) =>
            roleOrder.indexOf(a.role) - roleOrder.indexOf(b.role) ||
            a.name.localeCompare(b.name),
        );
        break;
      case "name":
      default:
        sortedHeroes.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    const groups = new Map<string, Hero[]>();

    for (const hero of sortedHeroes) {
      const label =
        sort() === "release"
          ? hero.releaseDate.slice(0, 4)
          : sort() === "role"
            ? hero.role
            : hero.name.charAt(0).toLocaleUpperCase();
      const group = groups.get(label);

      if (group) {
        group.push(hero);
      } else {
        groups.set(label, [hero]);
      }
    }

    return [...groups].map(([label, heroes]) => ({ label, heroes }));
  });

  return (
    <main sx={styles.page}>
      <div sx={styles.container}>
        <div sx={styles.headingRow}>
          <Heading level={1}>Heroes</Heading>

          <div sx={styles.sortSelectContainer}>
            <select
              id="sort"
              sx={styles.sortSelect}
              aria-label="Sort heroes"
              value={sort()}
              onChange={(event) => {
                const sortMode = event.currentTarget.value;
                setSort(sortMode);
                localStorage.setItem(SORT_MODE_STORAGE_KEY, sortMode);
              }}
            >
              <option value="name">Name</option>

              <option value="release">Release</option>

              <option value="role">Role</option>
            </select>

            <svg
              sx={styles.sortChevron}
              aria-hidden="true"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="m4 6 4 4 4-4"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>

        <For each={groups()}>
          {(group) => {
            const headingId = `group-${group.label.replaceAll(" ", "-")}`;

            return (
              <section sx={styles.heroGroup} aria-labelledby={headingId}>
                <Heading level={2} id={headingId}>
                  {group.label}
                </Heading>

                <ul sx={styles.heroList}>
                  <For each={group.heroes}>
                    {(hero) => (
                      <li>
                        <a sx={styles.heroLink} href={`/${hero.slug}`}>
                          <img
                            sx={styles.heroPortrait}
                            src={hero.portrait}
                            alt={hero.name}
                            loading="lazy"
                            decoding="async"
                          />
                          {hero.name}
                        </a>
                      </li>
                    )}
                  </For>
                </ul>
              </section>
            );
          }}
        </For>
      </div>
    </main>
  );
}

export default App;
