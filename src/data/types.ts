export enum Role {
  Tank = "Tank",
  Bruiser = "Bruiser",
  MeleeAssassin = "Melee Assassin",
  RangedAssassin = "Ranged Assassin",
  Healer = "Healer",
  Support = "Support",
}

export interface Ability {
  name: string;
  hotkey?: string;
  icon: string;
  cooldown?: string;
  cost?: string;
  description: string;
}

export interface Talent {
  name: string;
  icon: string;
  cooldown?: string;
  cost?: string;
  description: string;
}

export interface Hero {
  slug: string;
  name: string;
  role: Role;
  releaseDate: string;
  portrait: string;
  description: string;
  abilities: Ability[];
  talents: Record<string, Talent[]>;
}
