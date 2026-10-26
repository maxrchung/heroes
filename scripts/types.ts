import type { Role } from "../src/data/types";

export interface ImageTask {
  srcPath: string;
  destPath: string;
}

interface HdpAbility {
  name?: string;
  icon?: string;
  abilityType?: string;
  cooldownText?: string;
  energyText?: string;
  fullText?: string;
}

interface HdpTalent {
  name?: string;
  icon?: string;
  cooldownText?: string;
  energyText?: string;
  fullText?: string;
}

interface HdpHero {
  name: string;
  expandedRole?: Role;
  releaseDate?: string;
  portraits?: { target?: string };
  description?: string;
  abilities?: Record<string, HdpAbility[]>;
  talents?: Record<string, HdpTalent[]>;
}

export interface HdpData {
  items: Record<string, HdpHero>;
}
