import type { EventTemplate, DungeonTemplate, Character, LifeStage, MartialLevel, Stats } from '@life-restart/shared';
import type { GameData } from '../data/loader.js';

const martialLevelOrder: MartialLevel[] = ['beginner', 'novice', 'intermediate', 'advanced', 'master', 'grandmaster', 'supreme'];

function isMartialLevelMet(current: MartialLevel, required: MartialLevel): boolean {
  return martialLevelOrder.indexOf(current) >= martialLevelOrder.indexOf(required);
}

function getStatsObject(character: Character): Stats {
  return {
    bone: character.bone, wits: character.wits, qi: character.qi,
    technique: character.technique, agility: character.agility,
    reputation: character.reputation, honor: character.honor,
    constitution: character.constitution,
  };
}

function checkCondition(character: Character, conds: EventTemplate['conditions']): boolean {
  if (!conds) return true;
  const stats = getStatsObject(character);

  if (conds.minStats) {
    for (const [key, val] of Object.entries(conds.minStats)) {
      if ((stats[key as keyof Stats] ?? 0) < val) return false;
    }
  }
  if (conds.maxStats) {
    for (const [key, val] of Object.entries(conds.maxStats)) {
      if ((stats[key as keyof Stats] ?? 0) > val) return false;
    }
  }
  if (conds.requiredFlags) {
    for (const flag of conds.requiredFlags) {
      if (!character.flags.includes(flag)) return false;
    }
  }
  if (conds.excludedFlags) {
    for (const flag of conds.excludedFlags) {
      if (character.flags.includes(flag)) return false;
    }
  }
  if (conds.requiredHonor) {
    if (conds.requiredHonor.min !== undefined && character.honor < conds.requiredHonor.min) return false;
    if (conds.requiredHonor.max !== undefined && character.honor > conds.requiredHonor.max) return false;
  }
  if (conds.requiredMartialLevel) {
    if (!isMartialLevelMet(character.martialLevel, conds.requiredMartialLevel)) return false;
  }
  if (conds.requiredSect && character.sectId !== conds.requiredSect) return false;
  if (conds.requiredGender && character.gender !== conds.requiredGender) return false;

  return true;
}

export function selectEvent(
  data: GameData,
  character: Character,
  pastEventIds: string[],
): EventTemplate {
  // Check if there's an active dungeon
  const activeDungeonId = findActiveDungeon(character.flags);
  if (activeDungeonId) {
    const dungeonEvent = getNextDungeonStage(data, character, activeDungeonId);
    if (dungeonEvent) return dungeonEvent;
  }

  // Check for new dungeon triggers
  const newDungeon = selectNewDungeon(data, character, pastEventIds);
  if (newDungeon) return newDungeon;

  // Normal event selection
  const eligible = data.events.filter((event) => {
    if (!event.lifeStages.includes(character.lifeStage)) return false;
    if (!checkCondition(character, event.conditions)) return false;
    if (event.oncePerGame && pastEventIds.includes(event.id)) return false;
    return true;
  });

  if (eligible.length === 0) {
    return getFallbackEvent(character.lifeStage);
  }

  const totalWeight = eligible.reduce((sum, e) => sum + (e.rarity || 1), 0);
  let roll = Math.random() * totalWeight;
  for (const event of eligible) {
    roll -= event.rarity || 1;
    if (roll <= 0) return event;
  }

  return eligible[0]!;
}

function findActiveDungeon(flags: string[]): string | null {
  for (const flag of flags) {
    if (flag.startsWith('dungeon_') && flag.endsWith('_active')) {
      return flag.replace(/^dungeon_/, '').replace(/_active$/, '');
    }
  }
  return null;
}

function getNextDungeonStage(data: GameData, character: Character, dungeonId: string): EventTemplate | null {
  const dungeon = data.dungeons.find((d) => d.id === dungeonId);
  if (!dungeon) return null;

  // Find the next incomplete stage
  for (let i = 0; i < dungeon.stages.length; i++) {
    const stageFlag = `dungeon_${dungeonId}_stage_${i}_done`;
    if (!character.flags.includes(stageFlag)) {
      const stage = dungeon.stages[i]!;
      return {
        id: `dungeon_${dungeonId}_stage_${i}`,
        title: stage.title,
        description: stage.description,
        lifeStages: dungeon.lifeStages,
        rarity: 10,
        choices: stage.choices,
      };
    }
  }

  return null;
}

function selectNewDungeon(data: GameData, character: Character, pastEventIds: string[]): EventTemplate | null {
  const eligible = data.dungeons.filter((d) => {
    if (!d.lifeStages.includes(character.lifeStage)) return false;
    if (!checkCondition(character, d.conditions)) return false;
    if (d.oncePerGame && character.flags.includes(`dungeon_${d.id}_completed`)) return false;
    // Don't trigger if already active
    if (character.flags.includes(`dungeon_${d.id}_active`)) return false;
    return true;
  });

  if (eligible.length === 0) return null;

  const totalWeight = eligible.reduce((sum, d) => sum + (d.rarity || 1), 0);
  let roll = Math.random() * totalWeight;
  for (const dungeon of eligible) {
    roll -= dungeon.rarity || 1;
    if (roll <= 0) {
      const firstStage = dungeon.stages[0]!;
      return {
        id: `dungeon_${dungeon.id}_intro`,
        title: `[副本] ${dungeon.title}`,
        description: dungeon.summary,
        lifeStages: dungeon.lifeStages,
        rarity: 10,
        choices: [
          {
            text: `进入${dungeon.title}`,
            outcomeText: `你决定接受挑战！`,
            effects: {},
            setFlags: [`dungeon_${dungeon.id}_active`],
          },
          {
            text: '时机未到，暂时避开',
            outcomeText: '你记下了这个位置，也许以后再来比较合适。',
            effects: {},
          },
        ],
      };
    }
  }

  return null;
}

function getFallbackEvent(stage: LifeStage): EventTemplate {
  return {
    id: 'fallback',
    title: '岁月静好',
    description: '这一年平淡无奇，你按部就班地度过了这段时光。',
    lifeStages: [stage],
    rarity: 10,
    choices: [
      { text: '继续修炼', outcomeText: '你专注于修炼，略有精进。', effects: { qi: 1, technique: 1 } },
      { text: '游历散心', outcomeText: '你四处走走，放松了身心。', effects: { agility: 1, constitution: 1 } },
      { text: '修身养性', outcomeText: '你静心修养，感悟人生。', effects: { wits: 1 } },
    ],
  };
}

export function isDungeonEvent(eventId: string): boolean {
  return eventId.startsWith('dungeon_');
}

export function getDungeonProgress(eventId: string): { dungeonId: string; stageIndex: number } | null {
  const match = eventId.match(/^dungeon_(.+)_stage_(\d+)$/);
  if (!match) return null;
  return { dungeonId: match[1]!, stageIndex: parseInt(match[2]!, 10) };
}

export function handleDungeonCompletion(data: GameData, flags: string[], eventId: string): { newFlags: string[]; reward?: EventTemplate['choices'][0] } {
  const progress = getDungeonProgress(eventId);
  if (!progress) return { newFlags: flags };

  const dungeon = data.dungeons.find((d) => d.id === progress.dungeonId);
  if (!dungeon) return { newFlags: flags };

  const stageFlag = `dungeon_${progress.dungeonId}_stage_${progress.stageIndex}_done`;
  const newFlags = [...flags];
  if (!newFlags.includes(stageFlag)) newFlags.push(stageFlag);

  // Check if all stages are done
  const allDone = dungeon.stages.every((_, i) => newFlags.includes(`dungeon_${progress.dungeonId}_stage_${i}_done`));

  if (allDone) {
    // Remove active flag
    const activeIdx = newFlags.indexOf(`dungeon_${progress.dungeonId}_active`);
    if (activeIdx >= 0) newFlags.splice(activeIdx, 1);
    // Mark completed
    if (!newFlags.includes(`dungeon_${progress.dungeonId}_completed`)) {
      newFlags.push(`dungeon_${progress.dungeonId}_completed`);
    }
    if (dungeon.reward?.setFlags) {
      for (const f of dungeon.reward.setFlags) {
        if (!newFlags.includes(f)) newFlags.push(f);
      }
    }
  }

  return { newFlags };
}
