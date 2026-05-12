import type { CharacterCreateInput, Character, EventTemplate } from '@life-restart/shared';

export interface ElectronApi {
  createGame: (input: CharacterCreateInput) => Promise<Character>;
  getState: (saveId: string) => Promise<GameState | null>;
  nextTurn: (saveId: string) => Promise<TurnResult | null>;
  makeChoice: (saveId: string, choiceIndex: number) => Promise<TurnResult | null>;
  getSaveList: () => Promise<SaveEntry[]>;
  deleteSave: (saveId: string) => Promise<{ success: boolean }>;
}

export interface SaveEntry {
  id: string;
  name: string;
  characterId: string;
  createdAt: string;
  updatedAt: string;
}

export interface GameState {
  save: SaveEntry | null;
  character: Character | null;
  currentEvent: EventTemplate | null;
  learnedArts: LearnedArt[];
  relations: Relation[];
  logs: EventLog[];
}

export interface LearnedArt {
  id: string;
  characterId: string;
  artId: string;
  proficiency: string;
  proficiencyValue: number;
  learnedAt: string;
}

export interface Relation {
  id: string;
  characterId: string;
  npcName: string;
  relationType: string;
  affinity: number;
  description: string;
  createdAt: string;
}

export interface EventLog {
  id: string;
  characterId: string;
  eventId: string;
  choiceIndex: number;
  lifeStage: string;
  age: number;
  createdAt: string;
}

export interface TurnResult {
  character: Character;
  event: EventTemplate;
  learnedArts: LearnedArt[];
  died: boolean;
  deathCause: string | null;
}

declare global {
  interface Window {
    api: ElectronApi;
  }
}
