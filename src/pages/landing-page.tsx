import { createMemo, createSignal, For } from "solid-js";
import * as stylex from "@stylexjs/stylex";
import { HEROES_DATA } from "../data";
import { Role, type Hero } from "../data/types";
import { Heading } from "../components/heading";
import { Chevron } from "../components/chevron";
import { Container } from "../components/container";
import {
  borderRadius,
  color,
  fontSize,
  size,
  space,
} from "../styles/const.stylex";

const SORT_MODE_STORAGE_KEY = "heroes-sort-mode";
const heroes = Object.values(HEROES_DATA);
const roleOrder = Object.values(Role);

const styles = stylex.create({
  headingRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: space[16],
  },
  sortSelectContainer: {
    position: "relative",
  },
  sortSelect: {
    appearance: "none",
    paddingBlock: space[8],
    paddingInlineStart: space[12],
    paddingInlineEnd: space[36],
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "transparent",
    borderRadius: borderRadius[4],
    backgroundColor: color.tileBg,
    color: color.textPrimary,
    fontSize: fontSize[16],
    cursor: "pointer",
    ":hover": {
      backgroundColor: color.tileHoverBg,
    },
  },
  sortChevron: {
    position: "absolute",
    top: "50%",
    right: space[12],
    transform: "translateY(-50%)",
    color: color.textPrimary,
    pointerEvents: "none",
  },
  heroList: {
    display: "grid",
    gridTemplateColumns: `repeat(auto-fill, minmax(${size.heroTileWidth}, 1fr))`,
    listStyle: "none",
    gap: space[8],
  },
  heroTile: {
    display: "flex",
    alignItems: "center",
    gap: space[12],
    paddingBlock: space[8],
    paddingInline: space[12],
    borderRadius: borderRadius[4],
    backgroundColor: color.tileBg,
    color: "inherit",
    textDecoration: "none",
    ":hover": {
      backgroundColor: color.tileHoverBg,
    },
  },
  heroPortrait: {
    width: size.heroThumbnailSize,
    height: size.heroThumbnailSize,
    flex: "none",
    objectFit: "cover",
    borderRadius: "100%",
  },
});

export function HeroLandingPage() {
  const storageSortMode = localStorage.getItem(SORT_MODE_STORAGE_KEY);
  const [sort, setSort] = createSignal(storageSortMode ?? "name");

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
    <>
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

          <div sx={styles.sortChevron}>
            <Chevron direction="down" />
          </div>
        </div>
      </div>

      <For each={groups()}>
        {(group) => {
          return (
            <Container
              level={2}
              heading={<Heading level={2}>{group.label}</Heading>}
            >
              <ul sx={styles.heroList}>
                <For each={group.heroes}>
                  {(hero) => (
                    <li>
                      <a sx={styles.heroTile} href={`/${hero.slug}`}>
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
            </Container>
          );
        }}
      </For>
    </>
  );
}
