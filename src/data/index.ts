import heroesData from "./heroes.json";
import type { Hero } from "../types/hero";

export const HeroesData: Record<string, Hero> = heroesData as Record<
  string,
  Hero
>;
