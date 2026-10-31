import { For, Show } from "solid-js";
import { useParams } from "@solidjs/router";
import * as stylex from "@stylexjs/stylex";
import { HEROES_DATA } from "../data";
import { Heading } from "../components/heading";
import { Chevron } from "../components/chevron";
import { Column } from "../components/column";
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
  headingRow: {
    display: "flex",
    alignItems: "center",
    gap: space[12],
  },
  portrait: {
    width: size.portraitSize,
    height: size.portraitSize,
    flex: "none",
    objectFit: "cover",
    borderRadius: "100%",
  },
  cardList: {
    display: "flex",
    flexDirection: "column",
    gap: space[12],
    maxWidth: size.pageHalfWidth,
    width: "100%",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    gap: space[8],
    padding: space[12],
    borderRadius: borderRadius[4],
    backgroundColor: color.tileBg,
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: space[12],
  },
  cardTitles: {
    display: "flex",
    alignItems: "center",
    gap: space[12],
    minWidth: 0,
  },
  cardIcon: {
    width: size.portraitSize,
    height: size.portraitSize,
    flex: "none",
    objectFit: "cover",
  },
  cardTitle: {
    fontSize: fontSize[16],
  },
  hotkey: {
    opacity: 0.75,
  },
  cardMetadata: {
    display: "flex",
    flexDirection: "column",
    alignItems: "end",
    flex: "none",
    textAlign: "right",
    opacity: 0.75,
  },
  cardDescription: {
    whiteSpace: "pre-line",
    lineHeight: 1.5,
    paddingInlineStart: "76px",
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
            <Column gap={16}>
              <div sx={styles.headingRow}>
                <img
                  sx={styles.portrait}
                  src={hero().portrait}
                  alt={hero().name}
                />

                <Heading level={1}>{hero().name}</Heading>
              </div>

              <p>{hero().description}</p>
            </Column>

            <Column gap={16}>
              <Heading level={2}>Abilities</Heading>

              <div sx={styles.cardList}>
                <For each={hero().abilities}>
                  {(ability) => (
                    <article sx={styles.card}>
                      <div sx={styles.cardHeader}>
                        <div sx={styles.cardTitles}>
                          <img
                            sx={styles.cardIcon}
                            src={ability.icon}
                            alt={ability.name}
                          />

                          <div>
                            <h3 sx={styles.cardTitle}>{ability.name}</h3>

                            <Show when={ability.hotkey}>
                              {(hotkey) => (
                                <span sx={styles.hotkey}>{hotkey()}</span>
                              )}
                            </Show>
                          </div>
                        </div>

                        <div sx={styles.cardMetadata}>
                          <Show when={ability.cooldown}>
                            {(cooldown) => <span>{cooldown()}</span>}
                          </Show>

                          <Show when={ability.cost}>
                            {(cost) => <span>{cost()}</span>}
                          </Show>
                        </div>
                      </div>

                      <p sx={styles.cardDescription}>{ability.description}</p>
                    </article>
                  )}
                </For>
              </div>
            </Column>

            <Column gap={16}>
              <Heading level={2}>Talents</Heading>

              <Column gap={24}>
                <For each={Object.entries(hero().talents)}>
                  {([tier, talents]) => (
                    <Column gap={16}>
                      <Heading level={3}>Level {tier}</Heading>

                      <div sx={styles.cardList}>
                        <For each={talents}>
                          {(talent) => (
                            <article sx={styles.card}>
                              <div sx={styles.cardHeader}>
                                <div sx={styles.cardTitles}>
                                  <img
                                    sx={styles.cardIcon}
                                    src={talent.icon}
                                    alt={talent.name}
                                  />

                                  <h4 sx={styles.cardTitle}>{talent.name}</h4>
                                </div>

                                <div sx={styles.cardMetadata}>
                                  <Show when={talent.cooldown}>
                                    {(cooldown) => <span>{cooldown()}</span>}
                                  </Show>

                                  <Show when={talent.cost}>
                                    {(cost) => <span>{cost()}</span>}
                                  </Show>
                                </div>
                              </div>

                              <p sx={styles.cardDescription}>
                                {talent.description}
                              </p>
                            </article>
                          )}
                        </For>
                      </div>
                    </Column>
                  )}
                </For>
              </Column>
            </Column>
          </>
        )}
      </Show>
    </>
  );
}
