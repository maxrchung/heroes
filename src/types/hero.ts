export type ModernRole =
  | 'Tank'
  | 'Bruiser'
  | 'Melee Assassin'
  | 'Ranged Assassin'
  | 'Healer'
  | 'Support';

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
  abilityType?: string;
  cooldown?: string;
  cost?: string;
  description: string;
}

export interface Hero {
  name: string;
  title: string;
  role: ModernRole;
  releaseDate: string;
  portrait: string;
  description: string;
  abilities: Record<string, Ability[]>;
  talents: Record<string, Talent[]>;
}
