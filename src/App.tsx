import { createMemo, createSignal, For } from "solid-js";
import * as stylex from "@stylexjs/stylex";
import { HEROES_DATA } from "./data";
import { Role, type Hero } from "./data/types";
import { Heading } from "./components/Heading";

const SORT_MODE_STORAGE_KEY = "heroes.sortMode";
const heroes = Object.values(HEROES_DATA);
const roleOrder = Object.values(Role);

const styles = stylex.create({
  page: {
    minHeight: "100vh",
    padding: "24px",
    backgroundColor: "#0d0e16",
    color: "#eeefff",
    fontFamily: "sans-serif",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    width: "100%",
    maxWidth: "960px",
    marginInline: "auto",
  },
  headingRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
  },
  sortControl: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  sortLabel: {
    display: {
      "@media (max-width: 600px)": "none",
    },
  },
  sortSelect: {
    padding: "8px 12px",
    border: "1px solid #252738",
    borderRadius: "4px",
    backgroundColor: "#151722",
    color: "#eeefff",
    fontSize: "14px",
  },
  heroGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  heroList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    listStyle: "none",
    gap: "8px",
  },
  heroLink: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "8px 12px",
    borderRadius: "4px",
    backgroundColor: "#151722",
    color: "inherit",
    textDecoration: "none",
    fontSize: "16px",
    ":hover": {
      backgroundColor: "#1d2030",
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

          <div sx={styles.sortControl}>
            <label {...stylex.props(styles.sortLabel)} for="sort">
              Sort
            </label>

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
