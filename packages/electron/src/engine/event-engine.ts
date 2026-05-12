import type { EventTemplate, Character, LifeStage, MartialLevel, Stats } from '@life-restart/shared';
import { youthEvents, youngAdultEvents, adultEvents, middleAgeEvents } from '@life-restart/shared';

function getAllEvents(): EventTemplate[] {
  return [...youthEvents, ...youngAdultEvents, ...adultEvents, ...middleAgeEvents];
}

function checkCondition(character: Character, event: EventTemplate): boolean {
  const c = event.conditions;
  if (!c) return true;

  const stats = getStatsObject(character);

  if (c.minStats) {
    for (const [key, val] of Object.entries(c.minStats)) {
      if ((stats[key as keyof Stats] ?? 0) < val) return false;
    }
  }
  if (c.maxStats) {
    for (const [key, val] of Object.entries(c.maxStats)) {
      if ((stats[key as keyof Stats] ?? 0) > val) return false;
    }
  }
  if (c.requiredFlags) {
    for (const flag of c.requiredFlags) {
      if (!character.flags.includes(flag)) return false;
    }
  }
  if (c.excludedFlags) {
    for (const flag of c.excludedFlags) {
      if (character.flags.includes(flag)) return false;
    }
  }
  if (c.requiredHonor) {
    if (c.requiredHonor.min !== undefined && character.honor < c.requiredHonor.min) return false;
    if (c.requiredHonor.max !== undefined && character.honor > c.requiredHonor.max) return false;
  }
  if (c.requiredMartialLevel) {
    if (!isMartialLevelMet(character.martialLevel, c.requiredMartialLevel)) return false;
  }
  if (c.requiredSect && character.sectId !== c.requiredSect) return false;
  if (c.requiredGender && character.gender !== c.requiredGender) return false;

  return true;
}

const martialLevelOrder: MartialLevel[] = ['beginner', 'novice', 'intermediate', 'advanced', 'master', 'grandmaster', 'supreme'];

function isMartialLevelMet(current: MartialLevel, required: MartialLevel): boolean {
  return martialLevelOrder.indexOf(current) >= martialLevelOrder.indexOf(required);
}

function getStatsObject(character: Character): Stats {
  return {
    bone: character.bone,
    wits: character.wits,
    qi: character.qi,
    technique: character.technique,
    agility: character.agility,
    reputation: character.reputation,
    honor: character.honor,
    constitution: character.constitution,
  };
}

export function selectEvent(character: Character, pastEventIds: string[]): EventTemplate {
  const allEvents = getAllEvents();

  const eligible = allEvents.filter((event) => {
    if (!event.lifeStages.includes(character.lifeStage)) return false;
    if (!checkCondition(character, event)) return false;
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
