import { v4 as uuid } from 'uuid';
import type { Character, CharacterCreateInput, EventTemplate } from '@life-restart/shared';
import { generateInitialStats, BACKGROUNDS, getLifeStage, getMartialLevel, getMartialArt } from '@life-restart/shared';
import { db } from '../database/db.js';
import { characters, saves, eventLogs, martialArtsLearned, relationships } from '../database/schema.js';
import { eq, desc } from 'drizzle-orm';
import { selectEvent } from './event-engine.js';
import { applyEffects } from './stat-calc.js';
import { calculateMartialLevel } from './martial-calc.js';
import { advanceAge } from './aging.js';

export interface GameState {
  save: typeof saves.$inferSelect | null;
  character: typeof characters.$inferSelect | null;
  currentEvent: EventTemplate | null;
  learnedArts: (typeof martialArtsLearned.$inferSelect)[];
  relations: (typeof relationships.$inferSelect)[];
  logs: (typeof eventLogs.$inferSelect)[];
}

export function createCharacter(input: CharacterCreateInput): Character {
  const baseStats = generateInitialStats();
  const background = BACKGROUNDS.find((b) => b.id === input.backgroundId);
  const bonuses = background?.bonuses || {};

  const id = uuid();
  const now = new Date().toISOString();

  const charData = {
    id,
    name: input.name,
    gender: input.gender,
    age: 10,
    lifeStage: 'youth' as const,
    martialLevel: 'beginner' as const,
    sectId: null,
    flags: JSON.stringify([input.backgroundId]),
    isAlive: true as boolean,
    diedAt: null,
    deathCause: null,
    createdAt: now,
    bone: (baseStats.bone ?? 3) + (bonuses.bone ?? 0),
    wits: (baseStats.wits ?? 3) + (bonuses.wits ?? 0),
    qi: (baseStats.qi ?? 3) + (bonuses.qi ?? 0),
    technique: (baseStats.technique ?? 3) + (bonuses.technique ?? 0),
    agility: (baseStats.agility ?? 3) + (bonuses.agility ?? 0),
    reputation: (baseStats.reputation ?? 0) + (bonuses.reputation ?? 0),
    honor: (baseStats.honor ?? 0) + (bonuses.honor ?? 0),
    constitution: (baseStats.constitution ?? 3) + (bonuses.constitution ?? 0),
  };

  db.insert(characters).values(charData).run();

  const saveId = uuid();
  db.insert(saves).values({
    id: saveId,
    name: `${input.name}的江湖人生`,
    characterId: id,
    createdAt: now,
    updatedAt: now,
  }).run();

  return {
    ...charData,
    flags: JSON.parse(charData.flags),
    isAlive: true,
  };
}

export function getGameState(saveId: string): GameState | null {
  const save = db.select().from(saves).where(eq(saves.id, saveId)).get();
  if (!save) return null;

  const character = db.select().from(characters).where(eq(characters.id, save.characterId)).get();
  if (!character) return null;

  const arts = db.select().from(martialArtsLearned).where(eq(martialArtsLearned.characterId, character.id)).all();
  const rels = db.select().from(relationships).where(eq(relationships.characterId, character.id)).all();
  const logs = db.select().from(eventLogs).where(eq(eventLogs.characterId, character.id)).orderBy(desc(eventLogs.createdAt)).all();

  return { save, character: serializeCharacter(character), currentEvent: null, learnedArts: arts, relations: rels, logs };
}

function serializeCharacter(char: typeof characters.$inferSelect): Character {
  return {
    ...char,
    flags: deserializeFlags(char.flags),
    isAlive: char.isAlive as boolean,
    lifeStage: char.lifeStage as Character['lifeStage'],
    martialLevel: char.martialLevel as Character['martialLevel'],
    gender: char.gender as Character['gender'],
  };
}

export interface TurnResult {
  character: typeof characters.$inferSelect;
  event: EventTemplate;
  learnedArts: (typeof martialArtsLearned.$inferSelect)[];
  died: boolean;
  deathCause: string | null;
}

export function advanceTurn(saveId: string): TurnResult | null {
  const state = getGameState(saveId);
  if (!state || !state.character) return null;

  const character = state.character;
  if (!character.isAlive) return null;

  const pastEventIds = state.logs.map((l) => l.eventId);
  const event = selectEvent(deserializeCharacter(character), pastEventIds);

  return {
    character: serializeCharacter(character),
    event,
    learnedArts: state.learnedArts,
    died: false,
    deathCause: null,
  };
}

export function makeChoice(saveId: string, choiceIndex: number): TurnResult | null {
  const state = getGameState(saveId);
  if (!state || !state.character) return null;

  const character = state.character;
  if (!character.isAlive) return null;

  const pastEventIds = state.logs.map((l) => l.eventId);
  const event = selectEvent(deserializeCharacter(character), pastEventIds);

  if (!event || choiceIndex < 0 || choiceIndex >= event.choices.length) {
    return { character: serializeCharacter(character), event, learnedArts: state.learnedArts, died: false, deathCause: null };
  }

  const choice = event.choices[choiceIndex]!;
  const now = new Date().toISOString();

  // Apply stat effects
  const currentStats: Record<string, number> = {
    bone: character.bone,
    wits: character.wits,
    qi: character.qi,
    technique: character.technique,
    agility: character.agility,
    reputation: character.reputation,
    honor: character.honor,
    constitution: character.constitution,
  };
  const newStats = applyEffects(currentStats, choice.effects);

  // Process flags
  let flags: string[] = deserializeFlags(character.flags);
  if (choice.setFlags) {
    for (const flag of choice.setFlags) {
      if (!flags.includes(flag)) flags.push(flag);
    }
  }

  // Learn art
  if (choice.learnArt) {
    learnArtForCharacter(character.id, choice.learnArt);
  }

  // Join sect
  let sectId = character.sectId;
  if (choice.joinSect) {
    sectId = choice.joinSect;
  }

  // Create relationship
  if (choice.createRelation) {
    const rel = choice.createRelation;
    db.insert(relationships).values({
      id: uuid(),
      characterId: character.id,
      npcName: rel.npcName,
      relationType: rel.relationType,
      affinity: rel.affinity ?? 0,
      description: rel.description ?? '',
      createdAt: now,
    }).run();
  }

  // Advance age
  const agingResult = advanceAge(character.age, newStats.constitution ?? character.constitution);

  const newMartialLevel = calculateMartialLevel(
    newStats.bone ?? character.bone,
    newStats.wits ?? character.wits,
    newStats.qi ?? character.qi,
    newStats.technique ?? character.technique,
  );

  // Log event
  db.insert(eventLogs).values({
    id: uuid(),
    characterId: character.id,
    eventId: event.id,
    choiceIndex,
    lifeStage: character.lifeStage,
    age: character.age,
    createdAt: now,
  }).run();

  // Update character
  db.update(characters).set({
    age: agingResult.newAge,
    lifeStage: agingResult.newLifeStage === 'dead' ? character.lifeStage : agingResult.newLifeStage,
    martialLevel: newMartialLevel,
    sectId,
    flags: JSON.stringify(flags),
    isAlive: !agingResult.died,
    diedAt: agingResult.died ? agingResult.newAge : null,
    deathCause: agingResult.deathCause,
    bone: newStats.bone ?? character.bone,
    wits: newStats.wits ?? character.wits,
    qi: newStats.qi ?? character.qi,
    technique: newStats.technique ?? character.technique,
    agility: newStats.agility ?? character.agility,
    reputation: newStats.reputation ?? character.reputation,
    honor: newStats.honor ?? character.honor,
    constitution: newStats.constitution ?? character.constitution,
  }).where(eq(characters.id, character.id)).run();

  db.update(saves).set({ updatedAt: now }).where(eq(saves.id, saveId)).run();

  const updatedChar = db.select().from(characters).where(eq(characters.id, character.id)).get()!;
  const arts = db.select().from(martialArtsLearned).where(eq(martialArtsLearned.characterId, character.id)).all();

  // Get next event for non-dead character
  let nextEvent: EventTemplate | null = null;
  if (!agingResult.died) {
    const updatedPastIds = [...pastEventIds, event.id];
    nextEvent = selectEvent(deserializeCharacter(updatedChar), updatedPastIds);
  }

  return {
    character: serializeCharacter(updatedChar),
    event: nextEvent || event,
    learnedArts: arts,
    died: agingResult.died,
    deathCause: agingResult.deathCause,
  };
}

function learnArtForCharacter(characterId: string, artId: string) {
  if (artId === 'random_internal') {
    const internalArts = ['yijinjing', 'jiuyang', 'xiaowuxiang', 'zixia'];
    artId = internalArts[Math.floor(Math.random() * internalArts.length)]!;
  }

  const existing = db.select().from(martialArtsLearned)
    .where(eq(martialArtsLearned.characterId, characterId))
    .all()
    .find((a) => a.artId === artId);

  if (!existing) {
    const art = getMartialArt(artId);
    db.insert(martialArtsLearned).values({
      id: uuid(),
      characterId,
      artId,
      proficiency: 'beginner',
      proficiencyValue: art ? 5 : 1,
      learnedAt: new Date().toISOString(),
    }).run();
  }
}

export function getSaveList() {
  return db.select().from(saves).orderBy(desc(saves.updatedAt)).all();
}

export function deleteSave(saveId: string) {
  const save = db.select().from(saves).where(eq(saves.id, saveId)).get();
  if (!save) return;

  db.delete(eventLogs).where(eq(eventLogs.characterId, save.characterId)).run();
  db.delete(martialArtsLearned).where(eq(martialArtsLearned.characterId, save.characterId)).run();
  db.delete(relationships).where(eq(relationships.characterId, save.characterId)).run();
  db.delete(saves).where(eq(saves.id, saveId)).run();
  db.delete(characters).where(eq(characters.id, save.characterId)).run();
}

function deserializeCharacter(char: typeof characters.$inferSelect): Character {
  return {
    ...char,
    flags: deserializeFlags(char.flags),
    isAlive: char.isAlive as boolean,
    lifeStage: char.lifeStage as Character['lifeStage'],
    martialLevel: char.martialLevel as Character['martialLevel'],
    gender: char.gender as Character['gender'],
  };
}

function deserializeFlags(flags: unknown): string[] {
  if (typeof flags === 'string') {
    try { return JSON.parse(flags); } catch { return []; }
  }
  if (Array.isArray(flags)) return flags;
  return [];
}
