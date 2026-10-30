import { For, Show } from "solid-js";
import { useParams } from "@solidjs/router";
import * as stylex from "@stylexjs/stylex";
import { HEROES_DATA } from "../data";
import { Heading } from "../components/heading";
import { Chevron } from "../components/chevron";
import {
  borderRadius,
  color,
  fontSize,
  fontWeight,
  size,
  space,
} from "../styles/const.stylex";

const styles = stylex.create({
  backLink: {
    display: "flex",
    alignSelf: "start",
    alignItems: "center",
    gap: space[8],
    paddingBlock: space[8],
    paddingInlineStart: space[8],
    paddingInlineEnd: space[12],
    borderRadius: borderRadius[4],
    backgroundColor: color.tileBg,
    color: "inherit",
    textDecoration: "none",
    ":hover": {
      backgroundColor: color.tileHoverBg,
    },
  },
  header: {
    display: "flex",
    flexDirection: "column",
    gap: space[16],
  },
  headingRow: {
    display: "flex",
    alignItems: "center",
    gap: space[12],
  },
  portrait: {
    width: size.thumbnailSize,
    height: size.thumbnailSize,
    flex: "none",
    objectFit: "cover",
    borderRadius: "100%",
  },
  abilityGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: space[12],
  },
  talentGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: space[12],
  },
  card: {
    display: "flex",
    flexDirection: "column",
    gap: space[12],
    padding: space[12],
    borderRadius: borderRadius[4],
    backgroundColor: color.tileBg,
  },
  cardHeading: {
    display: "flex",
    alignItems: "center",
    gap: space[12],
  },
  cardIcon: {
    width: size.thumbnailSize,
    height: size.thumbnailSize,
    flex: "none",
    objectFit: "cover",
  },
  cardTitle: {
    fontSize: fontSize[16],
    fontWeight: fontWeight[400],
  },
  hotkey: {
    opacity: 0.75,
  },
  metadata: {
    display: "flex",
    flexWrap: "wrap",
    gap: space[8],
    opacity: 0.75,
  },
  cardDescription: {
    whiteSpace: "pre-line",
    lineHeight: 1.5,
  },
});

export function HeroDetailPage() {
  const params = useParams<{ slug: string }>();
  const hero = () => HEROES_DATA[params.slug];

  return (
    <>
      <a sx={styles.backLink} href="/">
        <Chevron direction="left" />
        Heroes
      </a>

      <Show
        when={hero()}
        fallback={<Heading level={1}>Hero not found</Heading>}
      >
        {(hero) => (
          <>
            <div sx={styles.header}>
              <div sx={styles.headingRow}>
                <img
                  sx={styles.portrait}
                  src={hero().portrait}
                  alt={hero().name}
                />

                <Heading level={1} noMargin>
                  {hero().name}
                </Heading>
              </div>

              <p>{hero().description}</p>
            </div>

            <Heading level={2}>Abilities</Heading>

            <div sx={styles.abilityGrid}>
              <For each={hero().abilities}>
                {(ability) => (
                  <article sx={styles.card}>
                    <div sx={styles.cardHeading}>
                      <img sx={styles.cardIcon} src={ability.icon} alt="" />
                      <div>
                        <h3 sx={styles.cardTitle}>{ability.name}</h3>
                        <Show when={ability.hotkey}>
                          {(hotkey) => (
                            <span sx={styles.hotkey}>{hotkey()}</span>
                          )}
                        </Show>
                      </div>
                    </div>
                    <div sx={styles.metadata}>
                      <Show when={ability.cooldown}>
                        {(cooldown) => <span>{cooldown()}</span>}
                      </Show>
                      <Show when={ability.cost}>
                        {(cost) => <span>{cost()}</span>}
                      </Show>
                    </div>
                    <p sx={styles.cardDescription}>{ability.description}</p>
                  </article>
                )}
              </For>
            </div>

            <Heading level={2}>Talents</Heading>

            <For each={Object.entries(hero().talents)}>
              {([tier, talents]) => (
                <>
                  <Heading level={3}>Level {tier}</Heading>

                  <div sx={styles.talentGrid}>
                    <For each={talents}>
                      {(talent) => (
                        <article sx={styles.card}>
                          <div sx={styles.cardHeading}>
                            <img
                              sx={styles.cardIcon}
                              src={talent.icon}
                              alt=""
                            />
                            <h4 sx={styles.cardTitle}>{talent.name}</h4>
                          </div>
                          <div sx={styles.metadata}>
                            <Show when={talent.cooldown}>
                              {(cooldown) => <span>{cooldown()}</span>}
                            </Show>
                            <Show when={talent.cost}>
                              {(cost) => <span>{cost()}</span>}
                            </Show>
                          </div>
                          <p sx={styles.cardDescription}>
                            {talent.description}
                          </p>
                        </article>
                      )}
                    </For>
                  </div>
                </>
              )}
            </For>
          </>
        )}
      </Show>
    </>
  );
}
