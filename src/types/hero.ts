export type ModernRole =
  | 'Tank'
  | 'Bruiser'
  | 'Melee Assassin'
  | 'Ranged Assassin'
  | 'Healer'
  | 'Support';

export type LegacyRole =
  | 'Warrior'
  | 'Assassin'
  | 'Support'
  | 'Specialist'
  | 'Multiclass';

export type Franchise =
  | 'Starcraft'
  | 'Warcraft'
  | 'Diablo'
  | 'Overwatch'
  | 'Nexus'
  | 'Retro';

export interface AbilityCharges {
  countMax: number;
  countStart?: number;
  recastCooldown?: number;
}

export interface Ability {
  id?: string;
  name: string;
  hotkey?: string;
  category: 'Basic' | 'Heroic' | 'Trait' | 'Mount' | 'Activable' | 'Hearth';
  icon: string;
  cooldown?: string;
  cost?: string;
  charges?: AbilityCharges;
  shortDescription?: string;
  description: string;
  subAbilities?: Ability[];
}

export interface Talent {
  id: string;
  name: string;
  tier: 1 | 4 | 7 | 10 | 13 | 16 | 20;
  levelText: string;
  sort: number;
  icon: string;
  abilityType?: string;
  cooldown?: string;
  cost?: string;
  isQuest: boolean;
  shortDescription?: string;
  description: string;
  activeAbility?: Ability;
}

export interface HeroSummary {
  id: string;
  name: string;
  slug: string;
  title: string;
  role: ModernRole;
  legacyRole?: LegacyRole;
  rolePlaystyles: string[];
  franchise: Franchise;
  releaseDate: string;
  difficulty?: string;
  isMelee: boolean;
  gender?: string;
  portrait: string;
  description: string;
}

export interface HeroDetail extends HeroSummary {
  abilities: {
    basic: Ability[];
    heroic: Ability[];
    trait: Ability[];
    mount?: Ability[];
    activable?: Ability[];
    hearth?: Ability[];
  };
  talents: Record<1 | 4 | 7 | 10 | 13 | 16 | 20, Talent[]>;
}
