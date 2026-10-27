import { For } from "solid-js";
import * as stylex from "@stylexjs/stylex";
import { HEROES_DATA } from "./data";

const heroes = Object.values(HEROES_DATA).sort((a, b) =>
  a.name.localeCompare(b.name),
);

const styles = stylex.create({
  page: {
    minHeight: "100vh",
    padding: "32px",
    backgroundColor: "#0d0e16",
    color: "#eeefff",
    fontFamily: "system-ui, sans-serif",
  },
  title: {
    maxWidth: "960px",
    margin: "0 auto 24px",
    fontFamily: "serif",
    fontSize: "32px",
    fontWeight: 500,
  },
  heroList: {
    maxWidth: "960px",
    marginInline: "auto",
    padding: 0,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    listStyle: "none",
    gap: "8px",
  },
  heroName: {
    padding: "10px 12px",
    border: "1px solid #252738",
    borderRadius: "4px",
    backgroundColor: "#151722",
    fontSize: "14px",
  },
});

function App() {
  return (
    <main sx={styles.page}>
      <h1 sx={styles.title}>Heroes</h1>
      <ul sx={styles.heroList}>
        <For each={heroes}>
          {(hero) => <li sx={styles.heroName}>{hero.name}</li>}
        </For>
      </ul>
    </main>
  );
}

export default App;
