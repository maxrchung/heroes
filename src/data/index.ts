import heroesData from './heroes.json';
import type { Hero } from '../types/hero';

export const heroes: Record<string, Hero> = heroesData as Record<string, Hero>;
export const heroesList: Hero[] = Object.values(heroes);

export function getHero(name: string): Hero | undefined {
  return heroes[name];
}
