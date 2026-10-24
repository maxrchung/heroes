import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import type {
  HeroSummary,
  HeroDetail,
  Ability,
  Talent,
  ModernRole,
  LegacyRole,
  Franchise,
} from '../src/types/hero';

const ROOT_DIR = process.cwd();
const HDP_DATA_DIR = path.join(ROOT_DIR, 'hdp', 'data');
const HDP_PORTRAITS_DIR = path.join(ROOT_DIR, 'hdp', 'images', 'heroportraits');
const HDP_ICONS_DIR = path.join(ROOT_DIR, 'hdp', 'images', 'abilitytalents');

const OUT_DATA_DIR = path.join(ROOT_DIR, 'src', 'data');
const OUT_HEROES_DIR = path.join(OUT_DATA_DIR, 'heroes');
const OUT_PUBLIC_PORTRAITS = path.join(ROOT_DIR, 'public', 'images', 'portraits');
const OUT_PUBLIC_ICONS = path.join(ROOT_DIR, 'public', 'images', 'icons');

function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function findLatestHeroDataFile(): string {
  if (!fs.existsSync(HDP_DATA_DIR)) {
    throw new Error(
      `HDP data directory not found at: ${HDP_DATA_DIR}\n` +
      `Please run: dotnet heroes-data-parser online -e hero:i -g 4 -o hdp`
    );
  }

  const files = fs.readdirSync(HDP_DATA_DIR).filter((f) => f.startsWith('herodata_') && f.endsWith('.json'));
  if (files.length === 0) {
    throw new Error(`No herodata_*.json files found in ${HDP_DATA_DIR}`);
  }

  // Sort by filename (which includes build number e.g. herodata_98348_enus.json) descending
  files.sort().reverse();
  return path.join(HDP_DATA_DIR, files[0]);
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/['\.]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function cleanText(text?: string): string {
  if (!text) return '';
  return text.replace(/<n\/>/g, '\n').trim();
}

function avifFilename(originalName: string): string {
  const parsed = path.parse(originalName);
  return `${parsed.name}.avif`;
}

interface ImageTask {
  srcPath: string;
  destPath: string;
}

async function convertImagesWithPool(tasks: ImageTask[], concurrency = 16): Promise<{ converted: number; skipped: number }> {
  let converted = 0;
  let skipped = 0;
  let running = 0;
  let index = 0;

  return new Promise((resolve, reject) => {
    function dispatchNext() {
      if (index >= tasks.length && running === 0) {
        return resolve({ converted, skipped });
      }

      while (running < concurrency && index < tasks.length) {
        const task = tasks[index++];
        running++;

        // Cache check: skip if destination exists and is up to date
        if (fs.existsSync(task.destPath)) {
          try {
            const srcStat = fs.statSync(task.srcPath);
            const destStat = fs.statSync(task.destPath);
            if (destStat.size > 0 && destStat.mtimeMs >= srcStat.mtimeMs) {
              skipped++;
              running--;
              dispatchNext();
              continue;
            }
          } catch {
            // Re-convert on stat error
          }
        }

        sharp(task.srcPath)
          .avif({ quality: 80, effort: 4 })
          .toFile(task.destPath)
          .then(() => {
            converted++;
            running--;
            if ((converted + skipped) % 100 === 0 || converted + skipped === tasks.length) {
              process.stdout.write(`\r[Images] Processed ${converted + skipped}/${tasks.length} (${converted} converted, ${skipped} cached)`);
            }
            dispatchNext();
          })
          .catch((err) => {
            running--;
            console.error(`\nFailed to convert ${task.srcPath} -> ${task.destPath}:`, err);
            dispatchNext();
          });
      }
    }

    dispatchNext();
  });
}

function mapSubAbilities(subObj?: Record<string, any[]>): Ability[] {
  if (!subObj) return [];
  const result: Ability[] = [];
  for (const [subKey, subList] of Object.entries(subObj)) {
    if (!Array.isArray(subList)) continue;
    for (const ab of subList) {
      const iconFile = ab.icon ? avifFilename(ab.icon) : '';
      result.push({
        id: ab.abilityId || ab.buttonId,
        name: ab.name || 'Ability',
        hotkey: ab.abilityType || undefined,
        category: (ab.abilityType as any) || 'Activable',
        icon: iconFile ? `/images/icons/${iconFile}` : '',
        cooldown: ab.cooldownText || undefined,
        cost: ab.energyText || undefined,
        shortDescription: cleanText(ab.shortText),
        description: cleanText(ab.fullText || ab.shortText),
      });
    }
  }
  return result;
}

export async function runTransformation() {
  const startTime = Date.now();
  console.log('--- Heroes of the Storm Data Transformation ---');

  const dataFilePath = findLatestHeroDataFile();
  console.log(`Using data file: ${path.relative(ROOT_DIR, dataFilePath)}`);

  const rawJson = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
  const rawHeroes = rawJson.items as Record<string, any>;
  const totalHeroesCount = Object.keys(rawHeroes).length;
  console.log(`Found ${totalHeroesCount} heroes to transform.`);

  ensureDir(OUT_DATA_DIR);
  ensureDir(OUT_HEROES_DIR);
  ensureDir(OUT_PUBLIC_PORTRAITS);
  ensureDir(OUT_PUBLIC_ICONS);

  const imageTasks: ImageTask[] = [];
  const queuedImagePaths = new Set<string>();

  function queueImage(srcDir: string, destDir: string, filename?: string) {
    if (!filename) return;
    const src = path.join(srcDir, filename);
    const dest = path.join(destDir, avifFilename(filename));
    if (queuedImagePaths.has(dest)) return;
    if (fs.existsSync(src)) {
      queuedImagePaths.add(dest);
      imageTasks.push({ srcPath: src, destPath: dest });
    }
  }

  const heroSummaries: HeroSummary[] = [];

  for (const [internalKey, h] of Object.entries(rawHeroes)) {
    const slug = slugify(h.name);
    const modernRole = (h.expandedRole || 'Ranged Assassin') as ModernRole;
    const legacyRole = (h.roles?.[0] || 'Assassin') as LegacyRole;
    const rolePlaystyles = (h.playstyles || []).filter((p: string) => p.startsWith('Role'));

    // Portrait target
    const targetPortrait = h.portraits?.target;
    let portraitPath = '';
    if (targetPortrait) {
      queueImage(HDP_PORTRAITS_DIR, OUT_PUBLIC_PORTRAITS, targetPortrait);
      portraitPath = `/images/portraits/${avifFilename(targetPortrait)}`;
    }

    const summary: HeroSummary = {
      id: h.name,
      name: h.name,
      slug,
      title: h.title || '',
      role: modernRole,
      legacyRole,
      rolePlaystyles,
      franchise: (h.franchise || 'Nexus') as Franchise,
      releaseDate: h.releaseDate || '2014-03-13',
      difficulty: h.difficulty || 'Medium',
      isMelee: !!h.isMelee,
      gender: h.gender || 'Neutral',
      portrait: portraitPath,
      description: cleanText(h.description || h.infoText),
    };

    heroSummaries.push(summary);

    // Abilities transformation
    const transformedAbilities: HeroDetail['abilities'] = {
      basic: [],
      heroic: [],
      trait: [],
      mount: [],
      activable: [],
      hearth: [],
    };

    const abilityCategories: Array<keyof HeroDetail['abilities']> = [
      'basic',
      'heroic',
      'trait',
      'mount',
      'activable',
      'hearth',
    ];

    const categoryMap: Record<string, keyof HeroDetail['abilities']> = {
      Basic: 'basic',
      Heroic: 'heroic',
      Trait: 'trait',
      Mount: 'mount',
      Activable: 'activable',
      Hearth: 'hearth',
    };

    for (const [rawCat, catKey] of Object.entries(categoryMap)) {
      const list = h.abilities?.[rawCat];
      if (Array.isArray(list)) {
        for (const ab of list) {
          if (ab.icon) queueImage(HDP_ICONS_DIR, OUT_PUBLIC_ICONS, ab.icon);

          let subList: Ability[] | undefined;
          if (ab.linkId && h.subAbilities?.[ab.linkId]) {
            subList = mapSubAbilities(h.subAbilities[ab.linkId]);
            // Also queue sub-ability icons
            for (const sub of subList) {
              const iconName = path.basename(sub.icon).replace(/\.avif$/, '.png');
              queueImage(HDP_ICONS_DIR, OUT_PUBLIC_ICONS, iconName);
            }
          }

          transformedAbilities[catKey]!.push({
            id: ab.abilityId || ab.buttonId,
            name: ab.name || 'Ability',
            hotkey: ab.abilityType || undefined,
            category: rawCat as any,
            icon: ab.icon ? `/images/icons/${avifFilename(ab.icon)}` : '',
            cooldown: ab.cooldownText || undefined,
            cost: ab.energyText || undefined,
            charges: ab.charges
              ? {
                  countMax: ab.charges.countMax,
                  countStart: ab.charges.countStart,
                  recastCooldown: ab.charges.recastCooldown,
                }
              : undefined,
            shortDescription: cleanText(ab.shortText),
            description: cleanText(ab.fullText || ab.shortText),
            subAbilities: subList && subList.length > 0 ? subList : undefined,
          });
        }
      }
    }

    // Talents transformation
    const tierMap: Record<string, 1 | 4 | 7 | 10 | 13 | 16 | 20> = {
      Level1: 1,
      Level4: 4,
      Level7: 7,
      Level10: 10,
      Level13: 13,
      Level16: 16,
      Level20: 20,
    };

    const transformedTalents: HeroDetail['talents'] = {
      1: [],
      4: [],
      7: [],
      10: [],
      13: [],
      16: [],
      20: [],
    };

    for (const [rawTier, tierNum] of Object.entries(tierMap)) {
      const tierList = h.talents?.[rawTier];
      if (Array.isArray(tierList)) {
        for (const t of tierList) {
          if (t.icon) queueImage(HDP_ICONS_DIR, OUT_PUBLIC_ICONS, t.icon);

          let activeAbility: Ability | undefined;
          if (t.linkId && h.subAbilities?.[t.linkId]) {
            const mappedSubs = mapSubAbilities(h.subAbilities[t.linkId]);
            if (mappedSubs.length > 0) {
              activeAbility = mappedSubs[0];
              const iconName = path.basename(activeAbility.icon).replace(/\.avif$/, '.png');
              queueImage(HDP_ICONS_DIR, OUT_PUBLIC_ICONS, iconName);
            }
          }

          transformedTalents[tierNum].push({
            id: t.talentId || t.buttonId || t.name,
            name: t.name || 'Talent',
            tier: tierNum,
            levelText: `Level ${tierNum}`,
            sort: t.sort ?? 1,
            icon: t.icon ? `/images/icons/${avifFilename(t.icon)}` : '',
            abilityType: t.abilityType || undefined,
            cooldown: t.cooldownText || undefined,
            cost: t.energyText || undefined,
            isQuest: !!t.isQuest,
            shortDescription: cleanText(t.shortText),
            description: cleanText(t.fullText || t.shortText),
            activeAbility,
          });
        }
      }
    }

    const heroDetail: HeroDetail = {
      ...summary,
      abilities: transformedAbilities,
      talents: transformedTalents,
    };

    // Save individual hero detail JSON
    const heroFilePath = path.join(OUT_HEROES_DIR, `${slug}.json`);
    fs.writeFileSync(heroFilePath, JSON.stringify(heroDetail, null, 2), 'utf-8');
  }

  // Sort summaries alphabetically by default
  heroSummaries.sort((a, b) => a.name.localeCompare(b.name));

  // Save heroes summary list
  const summaryFilePath = path.join(OUT_DATA_DIR, 'heroes-summary.json');
  fs.writeFileSync(summaryFilePath, JSON.stringify(heroSummaries, null, 2), 'utf-8');

  // Generate TypeScript index helper for imports
  const indexTsContent = `import summaryData from './heroes-summary.json';
import type { HeroSummary, HeroDetail } from '../types/hero';

export const heroesSummary: HeroSummary[] = summaryData as HeroSummary[];

export async function getHeroDetail(slug: string): Promise<HeroDetail | null> {
  try {
    const module = await import(\`./heroes/\${slug}.json\`);
    return module.default as HeroDetail;
  } catch (error) {
    console.error(\`Hero not found for slug: \${slug}\`, error);
    return null;
  }
}
`;
  fs.writeFileSync(path.join(OUT_DATA_DIR, 'index.ts'), indexTsContent, 'utf-8');

  console.log(`\nWritten ${heroSummaries.length} hero detail files to: ${path.relative(ROOT_DIR, OUT_HEROES_DIR)}`);
  console.log(`Written hero summaries list to: ${path.relative(ROOT_DIR, summaryFilePath)}`);
  console.log(`Queued ${imageTasks.length} images for AVIF conversion.`);

  console.log('\nConverting images to AVIF (concurrency: 16)...');
  const imgStats = await convertImagesWithPool(imageTasks, 16);
  console.log(`\nImage conversion complete: ${imgStats.converted} converted, ${imgStats.skipped} skipped (up-to-date).`);

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\nDone in ${elapsed}s! All hero data and AVIF images are ready.`);
}

runTransformation().catch((err) => {
  console.error('Data transformation failed:', err);
  process.exit(1);
});
