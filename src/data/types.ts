export enum Role {
  Tank = "Tank",
  Bruiser = "Bruiser",
  MeleeAssassin = "Melee Assassin",
  RangedAssassin = "Ranged Assassin",
  Healer = "Healer",
  Support = "Support",
}

// Declaration order is the display order on the landing page
export enum Franchise {
  Warcraft = "Warcraft",
  Starcraft = "Starcraft",
  Diablo = "Diablo",
  Overwatch = "Overwatch",
  Nexus = "Nexus",
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
  franchise: Franchise;
  releaseDate: string;
  portrait: string;
  description: string;
  abilities: Ability[];
  talents: Record<string, Talent[]>;
}
