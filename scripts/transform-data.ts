import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import type { Hero, Ability, Talent } from "../src/types/hero";
import { Role } from "../src/types/hero";
import type { HdpData, ImageTask } from "./types";

const ROOT_DIR = process.cwd();
const HDP_DATA_DIR = path.join(ROOT_DIR, "hdp", "data");
const HDP_PORTRAITS_DIR = path.join(ROOT_DIR, "hdp", "images", "heroportraits");
const HDP_ICONS_DIR = path.join(ROOT_DIR, "hdp", "images", "abilitytalents");

const OUT_DATA_DIR = path.join(ROOT_DIR, "src", "data");
const OUT_PUBLIC_IMAGES = path.join(ROOT_DIR, "public", "images");

function cleanText(text?: string): string {
  if (!text) return "";
  return text.replace(/<n\/>/g, "\n").trim();
}

function avifFileName(originalName: string): string {
  const parsed = path.parse(originalName);
  return `${parsed.name}.avif`;
}

const imageTasks: ImageTask[] = [];
const queued = new Set<string>();

function queueImage(srcDir: string, fileName: string) {
  const dest = path.join(OUT_PUBLIC_IMAGES, avifFileName(fileName));
  if (fs.existsSync(dest) || queued.has(dest)) return;
  const src = path.join(srcDir, fileName);
  if (fs.existsSync(src)) {
    queued.add(dest);
    imageTasks.push({ srcPath: src, destPath: dest });
  }
}

export async function runTransformation() {
  const startTime = Date.now();
  console.log("--- Heroes of the Storm Data Transformation ---");

  const dataFileName = fs
    .readdirSync(HDP_DATA_DIR)
    .find((file) => file.startsWith("herodata_") && file.endsWith(".json"));
  if (!dataFileName) {
    throw new Error(`No herodata_*.json file found in ${HDP_DATA_DIR}`);
  }

  const dataFilePath = path.join(HDP_DATA_DIR, dataFileName);
  console.log(`Using data file: ${path.relative(ROOT_DIR, dataFilePath)}`);

  const rawJson = JSON.parse(fs.readFileSync(dataFilePath, "utf-8")) as HdpData;
  const rawItems = rawJson.items;
  console.log(`Found ${Object.keys(rawItems).length} heroes to transform.`);

  const heroes: Record<string, Hero> = {};

  for (const hero of Object.values(rawItems)) {
    const role = hero.expandedRole ?? Role.RangedAssassin;

    const targetPortrait = hero.portraits?.target;
    let portrait = "";
    if (targetPortrait) {
      queueImage(HDP_PORTRAITS_DIR, targetPortrait);
      portrait = `/images/${avifFileName(targetPortrait)}`;
    }

    const abilities: Record<string, Ability[]> = {};
    if (hero.abilities) {
      for (const [category, list] of Object.entries(hero.abilities)) {
        if (category === "Hearth" || !Array.isArray(list) || list.length === 0)
          continue;
        const catKey = category.toLowerCase();
        abilities[catKey] = list.map((ability) => {
          if (ability.icon) queueImage(HDP_ICONS_DIR, ability.icon);
          return {
            name: ability.name || "Ability",
            type: ability.abilityType || undefined,
            icon: ability.icon ? `/images/${avifFileName(ability.icon)}` : "",
            cooldown: ability.cooldownText || undefined,
            cost: ability.energyText || undefined,
            description: cleanText(ability.fullText),
          };
        });
      }
    }

    const talents: Record<string, Talent[]> = {};
    if (hero.talents) {
      for (const [tier, tierTalents] of Object.entries(hero.talents)) {
        if (!Array.isArray(tierTalents) || tierTalents.length === 0) continue;

        const tierNum = tier.replace("Level", "");
        talents[tierNum] = tierTalents.map((talent) => {
          if (talent.icon) queueImage(HDP_ICONS_DIR, talent.icon);
          return {
            name: talent.name || "Talent",
            icon: talent.icon ? `/images/${avifFileName(talent.icon)}` : "",
            cooldown: talent.cooldownText || undefined,
            cost: talent.energyText || undefined,
            description: cleanText(talent.fullText),
          };
        });
      }
    }

    heroes[hero.name] = {
      name: hero.name,
      role,
      releaseDate: hero.releaseDate || "2014-03-13",
      portrait,
      description: cleanText(hero.description),
      abilities,
      talents,
    };
  }

  const heroesFilePath = path.join(OUT_DATA_DIR, "heroes.json");
  fs.writeFileSync(heroesFilePath, JSON.stringify(heroes, null, 2), "utf-8");

  console.log(
    `\nWritten ${Object.keys(heroes).length} heroes to: ${path.relative(ROOT_DIR, heroesFilePath)}`,
  );

  if (imageTasks.length > 0) {
    console.log(`Converting ${imageTasks.length} new images to AVIF...`);
    for (let i = 0; i < imageTasks.length; i++) {
      const task = imageTasks[i];
      try {
        await sharp(task.srcPath)
          .avif({ quality: 80, effort: 4 })
          .toFile(task.destPath);
        if ((i + 1) % 50 === 0 || i === imageTasks.length - 1) {
          process.stdout.write(
            `\r[Images] Converted ${i + 1}/${imageTasks.length}`,
          );
        }
      } catch (err) {
        console.error(
          `\nFailed to convert ${task.srcPath} -> ${task.destPath}:`,
          err,
        );
      }
    }
    console.log("\nImage conversion complete.");
  } else {
    console.log(
      "All images already exist in output folder, skipped image conversion.",
    );
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\nDone in ${elapsed}s! All hero data is ready.`);
}

runTransformation().catch((err) => {
  console.error("Data transformation failed:", err);
  process.exit(1);
});
