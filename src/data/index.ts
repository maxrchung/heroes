import heroesData from "./heroes.json";
import type { Hero } from "./types";

export const HEROES_DATA: Record<string, Hero> = heroesData as Record<
  string,
  Hero
>;
