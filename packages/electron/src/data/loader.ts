import { readFileSync, existsSync } from 'fs';
import { parse } from 'smol-toml';
import path from 'path';
import { fileURLToPath } from 'url';
import type {
  EventTemplate, EventConditions, EventChoice,
  DungeonTemplate, DungeonStage, DungeonReward,
  MartialArt, Sect, LifeStage, MartialLevel, Background, Stats,
} from '@life-restart/shared';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export interface MartialLevelDef {
  level: MartialLevel;
  name: string;
  minTotalStats: number;
}

export interface LifeStageDef {
  stage: LifeStage;
  name: string;
  ageMin: number;
  ageMax: number;
}

export interface NpcTemplate {
  id: string;
  name: string;
  description: string;
  possibleRelations: string[];
}

export interface GameData {
  events: EventTemplate[];
  dungeons: DungeonTemplate[];
  martialArts: MartialArt[];
  sects: Sect[];
  npcs: NpcTemplate[];
  backgrounds: Background[];
  lifeStages: LifeStageDef[];
  martialLevels: MartialLevelDef[];
  statNames: Record<string, string>;
  deathAgeMin: number;
  deathAgeMax: number;
}

const STAT_KEYS = ['bone', 'wits', 'qi', 'technique', 'agility', 'reputation', 'honor', 'constitution'];

function dataPath(relativePath: string): string {
  return path.join(__dirname, '..', '..', '..', '..', 'data', relativePath);
}

function readToml<T>(file: string): T {
  const fullPath = dataPath(file);
  if (!existsSync(fullPath)) throw new Error(`Data file not found: ${fullPath}`);
  return parse(readFileSync(fullPath, 'utf-8')) as T;
}

function extractStats(raw: Record<string, unknown>): Partial<Stats> {
  const stats: Record<string, number> = {};
  for (const key of STAT_KEYS) {
    if (typeof raw[key] === 'number') stats[key] = raw[key] as number;
  }
  return stats as Partial<Stats>;
}

function extractConditions(raw: Record<string, unknown>): EventConditions | undefined {
  const minStats: Record<string, number> = {};
  const maxStats: Record<string, number> = {};
  for (const key of STAT_KEYS) {
    const mk = `min_${key}`;
    if (typeof raw[mk] === 'number') minStats[key] = raw[mk] as number;
    const xk = `max_${key}`;
    if (typeof raw[xk] === 'number') maxStats[key] = raw[xk] as number;
  }

  const requiredHonor: { min?: number; max?: number } = {};
  if (typeof raw.honor_min === 'number') requiredHonor.min = raw.honor_min as number;
  if (typeof raw.honor_max === 'number') requiredHonor.max = raw.honor_max as number;

  const hasMin = Object.keys(minStats).length > 0 || requiredHonor.min !== undefined;
  const hasMax = Object.keys(maxStats).length > 0 || requiredHonor.max !== undefined;
  const hasFlags = raw.required_flags !== undefined || raw.excluded_flags !== undefined;
  const hasOther = raw.required_martial_level || raw.required_sect || raw.required_gender;

  if (!hasMin && !hasMax && !hasFlags && !hasOther) return undefined;

  return {
    ...(Object.keys(minStats).length > 0 ? { minStats: minStats as Partial<Stats> } : {}),
    ...(Object.keys(maxStats).length > 0 ? { maxStats: maxStats as Partial<Stats> } : {}),
    ...(raw.required_flags ? { requiredFlags: raw.required_flags as string[] } : {}),
    ...(raw.excluded_flags ? { excludedFlags: raw.excluded_flags as string[] } : {}),
    ...(Object.keys(requiredHonor).length > 0 ? { requiredHonor } : {}),
    ...(raw.required_martial_level ? { requiredMartialLevel: raw.required_martial_level as MartialLevel } : {}),
    ...(raw.required_sect ? { requiredSect: raw.required_sect as string } : {}),
    ...(raw.required_gender ? { requiredGender: raw.required_gender as 'male' | 'female' } : {}),
  };
}

function extractChoices(rawChoices: unknown[]): EventChoice[] {
  return (rawChoices as Record<string, unknown>[]).map((ch) => {
    const choice: EventChoice = {
      text: ch.text as string,
      outcomeText: ch.outcome_text as string,
      effects: extractStats(ch),
    };
    if (ch.set_flags) choice.setFlags = ch.set_flags as string[];
    if (ch.learn_art) choice.learnArt = ch.learn_art as string;
    if (ch.join_sect) choice.joinSect = ch.join_sect as string;
    if (ch.create_relation) {
      const rel = ch.create_relation as Record<string, unknown>;
      choice.createRelation = {
        npcName: rel.npc_name as string,
        relationType: rel.relation_type as string,
        affinity: rel.affinity as number | undefined,
        description: rel.description as string | undefined,
      };
    }
    return choice;
  });
}

function loadEvents(): EventTemplate[] {
  const all: EventTemplate[] = [];
  const eventFiles = ['events/youth.toml', 'events/young-adult.toml', 'events/adult.toml', 'events/middle-age.toml'];
  for (const file of eventFiles) {
    const raw = readToml<{ events: Record<string, unknown>[] }>(file);
    for (const ev of raw.events) {
      const event: EventTemplate = {
        id: ev.id as string,
        title: ev.title as string,
        description: ev.description as string,
        lifeStages: ev.life_stages as LifeStage[],
        rarity: ev.rarity as number,
        choices: extractChoices(ev.choices as unknown[]),
      };
      if (ev.once_per_game) event.oncePerGame = true;
      const conds = extractConditions(ev);
      if (conds) event.conditions = conds;
      all.push(event);
    }
  }
  return all;
}

function loadDungeons(): DungeonTemplate[] {
  const raw = readToml<{ dungeons: Record<string, unknown>[] }>('events/dungeons.toml');
  return (raw.dungeons || []).map((d) => {
    const dungeon: DungeonTemplate = {
      id: d.id as string,
      title: d.title as string,
      summary: d.summary as string,
      lifeStages: d.life_stages as LifeStage[],
      rarity: d.rarity as number,
      stages: ((d.stages || []) as Record<string, unknown>[]).map((s) => ({
        id: s.id as string,
        title: s.title as string,
        description: s.description as string,
        choices: extractChoices(s.choices as unknown[]),
      })),
    };
    if (d.once_per_game) dungeon.oncePerGame = true;
    const conds = extractConditions(d);
    if (conds) dungeon.conditions = conds;
    if (d.reward) {
      const r = d.reward as Record<string, unknown>;
      const reward: DungeonReward = { effects: extractStats(r) };
      if (r.learn_art) reward.learnArt = r.learn_art as string;
      if (r.set_flags) reward.setFlags = r.set_flags as string[];
      dungeon.reward = reward;
    }
    return dungeon;
  });
}

function loadMartialArts(): MartialArt[] {
  const raw1 = readToml<{ arts: Record<string, unknown>[] }>('martial-arts.toml');
  let allArts = [...(raw1.arts || [])];
  if (existsSync(dataPath('martial-arts-low.toml'))) {
    const raw2 = readToml<{ arts: Record<string, unknown>[] }>('martial-arts-low.toml');
    allArts = [...allArts, ...(raw2.arts || [])];
  }
  return allArts.map((a) => {
    const art: MartialArt = {
      id: a.id as string,
      name: a.name as string,
      type: a.type as MartialArt['type'],
      description: a.description as string,
      rarity: a.rarity as number,
    };
    if (a.min_bone !== undefined) art.minBone = a.min_bone as number;
    if (a.min_wits !== undefined) art.minWits = a.min_wits as number;
    if (a.min_qi !== undefined) art.minQi = a.min_qi as number;
    if (a.min_technique !== undefined) art.minTechnique = a.min_technique as number;
    if (a.min_agility !== undefined) art.minAgility = a.min_agility as number;
    if (a.sect_only) art.sectOnly = a.sect_only as string;
    if (a.prerequisites) art.prerequisites = a.prerequisites as string[];
    if (a.tier) art.tier = a.tier as MartialArt['tier'];
    if (a.gender_required) art.genderRequired = a.gender_required as 'male' | 'female';
    if (a.honor_min !== undefined || a.honor_max !== undefined) {
      art.honorRequired = {};
      if (a.honor_min !== undefined) art.honorRequired.min = a.honor_min as number;
      if (a.honor_max !== undefined) art.honorRequired.max = a.honor_max as number;
    }
    return art;
  });
}

function loadSects(): Sect[] {
  const raw1 = readToml<{ sects: Record<string, unknown>[] }>('sects.toml');
  let allSects = [...(raw1.sects || [])];
  if (existsSync(dataPath('sects-low.toml'))) {
    const raw2 = readToml<{ sects: Record<string, unknown>[] }>('sects-low.toml');
    allSects = [...allSects, ...(raw2.sects || [])];
  }
  return allSects.map((s) => {
    const sect: Sect = {
      id: s.id as string,
      name: s.name as string,
      description: s.description as string,
      exclusiveArts: (s.exclusive_arts || []) as string[],
    };
    if (s.condition_honor_min !== undefined) sect.conditionHonorMin = s.condition_honor_min as number;
    if (s.condition_honor_max !== undefined) sect.conditionHonorMax = s.condition_honor_max as number;
    if (s.condition_wits_min !== undefined) sect.conditionWitsMin = s.condition_wits_min as number;
    if (s.condition_technique_min !== undefined) sect.conditionTechniqueMin = s.condition_technique_min as number;
    if (s.condition_bone_min !== undefined) sect.conditionBoneMin = s.condition_bone_min as number;
    if (s.condition_agility_min !== undefined) sect.conditionAgilityMin = s.condition_agility_min as number;
    if (s.condition_constitution_min !== undefined) sect.conditionConstitutionMin = s.condition_constitution_min as number;
    if (s.condition_gender) sect.conditionGender = s.condition_gender as 'male' | 'female';
    if (s.type) sect.type = s.type as Sect['type'];
    if (s.allies) sect.allies = s.allies as string[];
    if (s.enemies) sect.enemies = s.enemies as string[];
    return sect;
  });
}

function loadNpcs(): NpcTemplate[] {
  const raw = readToml<{ npcs: Record<string, unknown>[] }>('npcs.toml');
  return (raw.npcs || []).map((n) => ({
    id: n.id as string,
    name: n.name as string,
    description: n.description as string,
    possibleRelations: (n.possible_relations || []) as string[],
  }));
}

function loadBackgrounds(): Background[] {
  const raw = readToml<{ backgrounds: Record<string, unknown>[] }>('stats.toml');
  return (raw.backgrounds || []).map((b) => {
    const bg: Background = {
      id: b.id as Background['id'],
      name: b.name as string,
      description: b.description as string,
      bonuses: extractStats(b),
    };
    return bg;
  });
}

function loadLifeStages(): { stages: LifeStageDef[]; deathAgeMin: number; deathAgeMax: number } {
  const raw = readToml<{ stages: Record<string, unknown>[]; death_age_min: number; death_age_max: number }>('life-stages.toml');
  return {
    stages: (raw.stages || []).map((s) => ({
      stage: s.stage as LifeStage,
      name: s.name as string,
      ageMin: s.age_min as number,
      ageMax: s.age_max as number,
    })),
    deathAgeMin: raw.death_age_min || 46,
    deathAgeMax: raw.death_age_max || 80,
  };
}

function loadMartialLevels(): MartialLevelDef[] {
  const raw = readToml<{ levels: Record<string, unknown>[] }>('martial-levels.toml');
  return (raw.levels || []).map((l) => ({
    level: l.level as MartialLevel,
    name: l.name as string,
    minTotalStats: l.min_total_stats as number,
  }));
}

function loadStatNames(): Record<string, string> {
  const raw = readToml<{ stat_names: Record<string, string> }>('stats.toml');
  return raw.stat_names || {};
}

let cachedData: GameData | null = null;

export function loadAllData(): GameData {
  if (cachedData) return cachedData;

  const lifeStages = loadLifeStages();

  cachedData = {
    events: loadEvents(),
    dungeons: loadDungeons(),
    martialArts: loadMartialArts(),
    sects: loadSects(),
    npcs: loadNpcs(),
    backgrounds: loadBackgrounds(),
    lifeStages: lifeStages.stages,
    martialLevels: loadMartialLevels(),
    statNames: loadStatNames(),
    deathAgeMin: lifeStages.deathAgeMin,
    deathAgeMax: lifeStages.deathAgeMax,
  };

  console.log(`[DataLoader] Loaded: ${cachedData.events.length} events, ${cachedData.dungeons.length} dungeons, ${cachedData.martialArts.length} arts, ${cachedData.sects.length} sects`);
  return cachedData;
}

export function getLifeStage(data: GameData, age: number): LifeStage | 'dead' {
  if (age > data.deathAgeMax) return 'dead';
  for (const def of data.lifeStages) {
    if (age >= def.ageMin && age <= def.ageMax) return def.stage;
  }
  return 'middle_age';
}

export function getMartialLevel(data: GameData, totalStats: number): MartialLevel {
  let result: MartialLevel = 'beginner';
  for (const def of data.martialLevels) {
    if (totalStats >= def.minTotalStats) result = def.level;
  }
  return result;
}

export function getMartialArt(data: GameData, id: string): MartialArt | undefined {
  return data.martialArts.find((a) => a.id === id);
}

export function getSect(data: GameData, id: string): Sect | undefined {
  return data.sects.find((s) => s.id === id);
}
