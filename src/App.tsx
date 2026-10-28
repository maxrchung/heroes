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
    padding: "8px 16px",
    borderRadius: "4px",
    backgroundColor: "#151722",
    color: "inherit",
    textDecoration: "none",
    fontSize: "16px",
    ":hover": {
      backgroundColor: "#1d2030",
    },
    ":focus-visible": {
      outline: "2px solid #8e83ff",
      outlineOffset: "2px",
    },
  },
  heroPortrait: {
    width: "48px",
    height: "48px",
    flex: "none",
    objectFit: "cover",
    borderRadius: "4px",
  },
});

function App() {
  const localSortMode = localStorage.getItem(SORT_MODE_STORAGE_KEY);
  const [sortMode, setSortMode] = createSignal(localSortMode ?? "name");

  const heroGroups = createMemo(() => {
    const sortedHeroes = [...heroes];

    switch (sortMode()) {
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
        sortMode() === "release"
          ? hero.releaseDate.slice(0, 4)
          : sortMode() === "role"
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

          <select
            sx={styles.sortSelect}
            aria-label="Sort heroes"
            value={sortMode()}
            onChange={(event) => {
              const sortMode = event.currentTarget.value;
              setSortMode(sortMode);
              localStorage.setItem(SORT_MODE_STORAGE_KEY, sortMode);
            }}
          >
            <option value="name">Name</option>

            <option value="release">Release</option>

            <option value="role">Role</option>
          </select>
        </div>

        <For each={heroGroups()}>
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
