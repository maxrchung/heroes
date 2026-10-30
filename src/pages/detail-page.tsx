import { For, Show } from "solid-js";
import { useParams } from "@solidjs/router";
import * as stylex from "@stylexjs/stylex";
import { HEROES_DATA } from "../data";
import type { Ability, Talent } from "../data/types";
import { Heading } from "../components/heading";
import { Chevron } from "../components/chevron";
import { Container } from "../components/container";
import {
  borderRadius,
  color,
  fontSize,
  fontWeight,
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
    width: "64px",
    height: "64px",
    flex: "none",
    objectFit: "cover",
    borderRadius: "100%",
  },
  abilityGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: space[12],
  },
  talentTiers: {
    display: "flex",
    flexDirection: "column",
    gap: space[24],
  },
  tierHeading: {
    fontSize: fontSize[16],
    fontWeight: fontWeight[400],
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
  abilityIcon: {
    width: "48px",
    height: "48px",
    flex: "none",
    objectFit: "cover",
    borderRadius: borderRadius[4],
  },
  talentIcon: {
    width: "40px",
    height: "40px",
    flex: "none",
    objectFit: "cover",
    borderRadius: borderRadius[4],
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

function AbilityCard(props: { ability: Ability }) {
  return (
    <article sx={styles.card}>
      <div sx={styles.cardHeading}>
        <img sx={styles.abilityIcon} src={props.ability.icon} alt="" />
        <div>
          <h3 sx={styles.cardTitle}>{props.ability.name}</h3>
          <Show when={props.ability.hotkey}>
            {(hotkey) => <span sx={styles.hotkey}>{hotkey()}</span>}
          </Show>
        </div>
      </div>
      <div sx={styles.metadata}>
        <Show when={props.ability.cooldown}>
          {(cooldown) => <span>{cooldown()}</span>}
        </Show>
        <Show when={props.ability.cost}>{(cost) => <span>{cost()}</span>}</Show>
      </div>
      <p sx={styles.cardDescription}>{props.ability.description}</p>
    </article>
  );
}

function TalentCard(props: { talent: Talent }) {
  return (
    <article sx={styles.card}>
      <div sx={styles.cardHeading}>
        <img sx={styles.talentIcon} src={props.talent.icon} alt="" />
        <h4 sx={styles.cardTitle}>{props.talent.name}</h4>
      </div>
      <div sx={styles.metadata}>
        <Show when={props.talent.cooldown}>
          {(cooldown) => <span>{cooldown()}</span>}
        </Show>
        <Show when={props.talent.cost}>{(cost) => <span>{cost()}</span>}</Show>
      </div>
      <p sx={styles.cardDescription}>{props.talent.description}</p>
    </article>
  );
}

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
            <Container level={2}>
              <div sx={styles.headingRow}>
                <img
                  sx={styles.portrait}
                  src={hero().portrait}
                  alt={hero().name}
                />
                <Heading level={1}>{hero().name}</Heading>
              </div>

              <p>{hero().description}</p>
            </Container>

            <Container level={2} heading="Abilities">
              <div sx={styles.abilityGrid}>
                <For each={hero().abilities}>
                  {(ability) => <AbilityCard ability={ability} />}
                </For>
              </div>
            </Container>

            <Container level={2} heading="Talents">
              <div sx={styles.talentTiers}>
                <For each={Object.entries(hero().talents)}>
                  {([tier, talents]) => (
                    <Container level={3} heading={`Level ${tier}`}>
                      <div sx={styles.talentGrid}>
                        <For each={talents}>
                          {(talent) => <TalentCard talent={talent} />}
                        </For>
                      </div>
                    </Container>
                  )}
                </For>
              </div>
            </Container>
          </>
        )}
      </Show>
    </>
  );
}
