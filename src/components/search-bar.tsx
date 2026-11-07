import {
  createMemo,
  createSignal,
  For,
  onCleanup,
  onMount,
  Show,
} from "solid-js";
import { useNavigate } from "@solidjs/router";
import * as stylex from "@stylexjs/stylex";
import { HEROES_DATA } from "../data";
import type { Hero } from "../data/types";
import {
  borderRadius,
  color,
  fontSize,
  size,
  space,
} from "../styles/const.stylex";
import { SearchIcon } from "./icons/search-icon";

const MAX_RESULTS = 5;

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

type SearchableHero = {
  hero: Hero;
  normalized: string;
  words: string[];
  initials: string;
};

const searchableHeroes: SearchableHero[] = Object.values(HEROES_DATA)
  .sort((a, b) => a.name.localeCompare(b.name))
  .map((hero) => {
    const words = hero.name
      .split(/[\s-]+/)
      .map(normalize)
      .filter(Boolean);

    return {
      hero,
      normalized: normalize(hero.name),
      words,
      initials: words.map((word) => word[0]).join(""),
    };
  });

function editDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array<number>(n + 1).fill(0),
  );

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost,
      );
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        dp[i][j] = Math.min(dp[i][j], dp[i - 2][j - 2] + 1);
      }
    }
  }

  return dp[m][n];
}

function getMatchScore(q: string, item: SearchableHero): number | null {
  if (item.normalized.startsWith(q)) return 0;
  if (item.words.some((word) => word.startsWith(q))) return 1;
  if (item.normalized.includes(q)) return 2;
  if (item.words.length > 1 && item.initials.startsWith(q)) return 3;

  if (q.length >= 3) {
    const maxDist = q.length >= 5 ? 2 : 1;
    const candidates = [
      item.normalized,
      item.normalized.slice(0, q.length),
      ...item.words,
      ...item.words.map((word) => word.slice(0, q.length)),
    ];

    let bestDist = Infinity;
    for (const candidate of candidates) {
      if (Math.abs(candidate.length - q.length) > maxDist) continue;
      const dist = editDistance(q, candidate);
      if (dist < bestDist) bestDist = dist;
    }

    if (bestDist <= maxDist) {
      return 4 + bestDist;
    }
  }

  return null;
}

const styles = stylex.create({
  container: {
    display: "flex",
    alignItems: "center",
    gap: space[8],
    width: "100%",
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
  inputWrapper: {
    position: "relative",
    width: "100%",
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
  menu: {
    position: "absolute",
    top: `calc(100% + ${space[8]})`,
    left: 0,
    right: 0,
    display: "flex",
    flexDirection: "column",
    listStyle: "none",
    borderRadius: borderRadius[4],
    backgroundColor: color.tileBg,
  },
  menuItem: {
    display: "block",
    paddingBlock: space[8],
    paddingInline: space[12],
    color: color.textSecondary,
    textDecoration: "none",
    ":hover": {
      backgroundColor: color.tileHoverBg,
      color: color.textPrimary,
    },
  },
  menuItemActive: {
    backgroundColor: color.tileHoverBg,
    color: color.textPrimary,
  },
  noResults: {
    paddingBlock: space[8],
    paddingInline: space[12],
    color: color.textSecondary,
  },
});

export function SearchBar() {
  const navigate = useNavigate();
  const [query, setQuery] = createSignal("");
  const [isActive, setIsActive] = createSignal(false);
  const [activeIndex, setActiveIndex] = createSignal(0);
  let inputRef: HTMLInputElement | undefined;

  const results = createMemo<Hero[]>(() => {
    const q = normalize(query());
    if (!q) return [];

    const matches: { hero: Hero; score: number }[] = [];

    for (const item of searchableHeroes) {
      const score = getMatchScore(q, item);
      if (score !== null) {
        matches.push({ hero: item.hero, score });
      }
    }

    matches.sort((a, b) => a.score - b.score);
    return matches.slice(0, MAX_RESULTS).map((match) => match.hero);
  });

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
        setActiveIndex(0);
        inputRef?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    onCleanup(() => {
      window.removeEventListener("keydown", handleKeyDown);
    });
  });

  const handleInputKeyDown = (event: KeyboardEvent) => {
    const currentResults = results();
    if (currentResults.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((prev) => (prev + 1) % currentResults.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex(
        (prev) => (prev - 1 + currentResults.length) % currentResults.length,
      );
    } else if (event.key === "Enter") {
      event.preventDefault();
      const selected = currentResults[activeIndex()];
      if (selected) {
        navigate(`/${selected.slug}`);
        inputRef?.blur();
      }
    }
  };

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

      <div sx={styles.inputWrapper}>
        <input
          ref={inputRef}
          type="text"
          sx={styles.input}
          placeholder="Search hero..."
          aria-label="Search hero"
          value={query()}
          onInput={(event) => {
            setQuery(event.currentTarget.value);
            setActiveIndex(0);
          }}
          onFocus={() => {
            setIsActive(true);
            setActiveIndex(0);
          }}
          onBlur={() => setIsActive(false)}
          onKeyDown={handleInputKeyDown}
        />

        <Show when={isActive() && query().length > 0}>
          <ul sx={styles.menu} onMouseDown={(event) => event.preventDefault()}>
            <Show
              when={results().length > 0}
              fallback={<li sx={styles.noResults}>No hero found</li>}
            >
              <For each={results()}>
                {(hero, index) => (
                  <li>
                    <a
                      sx={[
                        styles.menuItem,
                        activeIndex() === index() && styles.menuItemActive,
                      ]}
                      href={`/${hero.slug}`}
                      onClick={() => inputRef?.blur()}
                    >
                      {hero.name}
                    </a>
                  </li>
                )}
              </For>
            </Show>
          </ul>
        </Show>
      </div>
    </div>
  );
}
