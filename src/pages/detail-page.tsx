import { Show } from "solid-js";
import { useParams } from "@solidjs/router";
import { HEROES_DATA } from "../data";
import { Heading } from "../components/heading";

export function HeroDetailPage() {
  const params = useParams<{ slug: string }>();
  const hero = () => HEROES_DATA[params.slug];

  return (
    <Show when={hero()} fallback={<Heading level={1}>Hero not found</Heading>}>
      {(hero) => <Heading level={1}>{hero().name}</Heading>}
    </Show>
  );
}
