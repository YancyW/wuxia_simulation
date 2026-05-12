import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const saves = sqliteTable('saves', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  characterId: text('character_id').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const characters = sqliteTable('characters', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  gender: text('gender').notNull(),
  age: integer('age').notNull().default(10),
  lifeStage: text('life_stage').notNull().default('youth'),
  martialLevel: text('martial_level').notNull().default('beginner'),
  sectId: text('sect_id'),
  flags: text('flags').notNull().default('[]'),
  isAlive: integer('is_alive', { mode: 'boolean' }).notNull().default(true),
  diedAt: integer('died_at'),
  deathCause: text('death_cause'),
  createdAt: text('created_at').notNull(),
  // Stats
  bone: integer('bone').notNull().default(3),
  wits: integer('wits').notNull().default(3),
  qi: integer('qi').notNull().default(3),
  technique: integer('technique').notNull().default(3),
  agility: integer('agility').notNull().default(3),
  reputation: integer('reputation').notNull().default(0),
  honor: integer('honor').notNull().default(0),
  constitution: integer('constitution').notNull().default(3),
});

export const martialArtsLearned = sqliteTable('martial_arts_learned', {
  id: text('id').primaryKey(),
  characterId: text('character_id').notNull(),
  artId: text('art_id').notNull(),
  proficiency: text('proficiency').notNull().default('beginner'),
  proficiencyValue: integer('proficiency_value').notNull().default(1),
  learnedAt: text('learned_at').notNull(),
});

export const relationships = sqliteTable('relationships', {
  id: text('id').primaryKey(),
  characterId: text('character_id').notNull(),
  npcName: text('npc_name').notNull(),
  relationType: text('relation_type').notNull(),
  affinity: integer('affinity').notNull().default(0),
  description: text('description').notNull().default(''),
  createdAt: text('created_at').notNull(),
});

export const eventLogs = sqliteTable('event_logs', {
  id: text('id').primaryKey(),
  characterId: text('character_id').notNull(),
  eventId: text('event_id').notNull(),
  choiceIndex: integer('choice_index').notNull(),
  lifeStage: text('life_stage').notNull(),
  age: integer('age').notNull(),
  createdAt: text('created_at').notNull(),
});
