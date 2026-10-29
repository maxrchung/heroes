import { Show } from "solid-js";
import { useParams } from "@solidjs/router";
import * as stylex from "@stylexjs/stylex";
import { HEROES_DATA } from "../data";
import { Heading } from "../components/heading";
import { Chevron } from "../components/chevron";
import { borderRadius, color, space } from "../styles/const.stylex";

const styles = stylex.create({
  detail: {
    display: "flex",
    flexDirection: "column",
    gap: space[8],
  },
  backLink: {
    display: "flex",
    alignSelf: "start",
    alignItems: "center",
    gap: space[8],
    paddingBlock: space[8],
    paddingInlineStart: space[8],
    paddingInlineEnd: space[12],
    borderRadius: borderRadius[4],
    backgroundColor: color.controlBg,
    color: "inherit",
    textDecoration: "none",
    ":hover": {
      backgroundColor: color.controlHoverBg,
    },
  },
});

export function HeroDetailPage() {
  const params = useParams<{ slug: string }>();
  const hero = () => HEROES_DATA[params.slug];

  return (
    <div sx={styles.detail}>
      <a sx={styles.backLink} href="/">
        <Chevron direction="left" />
        Heroes
      </a>

      <Show
        when={hero()}
        fallback={<Heading level={1}>Hero not found</Heading>}
      >
        {(hero) => <Heading level={1}>{hero().name}</Heading>}
      </Show>
    </div>
  );
}
