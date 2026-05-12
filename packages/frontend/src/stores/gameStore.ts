import { create } from 'zustand';
import type { Character, EventTemplate, EventChoice } from '@life-restart/shared';
import type { LearnedArt, Relation, GameState, TurnResult } from '../global';
import * as api from '../api/client';

interface GameStore {
  // State
  saveId: string | null;
  character: Character | null;
  currentEvent: EventTemplate | null;
  lastChoiceResult: { choice: EventChoice; outcomeText: string } | null;
  learnedArts: LearnedArt[];
  relations: Relation[];
  died: boolean;
  deathCause: string | null;
  loading: boolean;

  // Actions
  createGame: (name: string, gender: 'male' | 'female', backgroundId: string) => Promise<void>;
  loadGame: (saveId: string) => Promise<void>;
  advanceTurn: () => Promise<void>;
  choose: (choiceIndex: number) => Promise<void>;
  reset: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  saveId: null,
  character: null,
  currentEvent: null,
  lastChoiceResult: null,
  learnedArts: [],
  relations: [],
  died: false,
  deathCause: null,
  loading: false,

  createGame: async (name, gender, backgroundId) => {
    set({ loading: true });
    try {
      const character = await api.createGame({ name, gender, backgroundId: backgroundId as any });
      const saves = await api.getSaveList();
      const saveId = saves[0]?.id;
      if (!saveId) throw new Error('Save not created');

      set({ character, saveId, lastChoiceResult: null, died: false, deathCause: null, loading: false });

      // Auto-advance to first event
      const result = await api.nextTurn(saveId);
      if (result) {
        set({ currentEvent: result.event, character: result.character, learnedArts: result.learnedArts });
      }
    } catch (e) {
      set({ loading: false });
      throw e;
    }
  },

  loadGame: async (saveId) => {
    set({ loading: true });
    try {
      const state = await api.getState(saveId);
      if (state && state.character) {
        set({
          saveId,
          character: state.character as Character,
          currentEvent: null,
          learnedArts: state.learnedArts,
          relations: state.relations,
          died: !state.character.isAlive,
          deathCause: state.character.deathCause,
          lastChoiceResult: null,
          loading: false,
        });
      } else {
        set({ loading: false });
      }
    } catch (e) {
      set({ loading: false });
      throw e;
    }
  },

  advanceTurn: async () => {
    const { saveId } = get();
    if (!saveId) return;

    set({ lastChoiceResult: null });
    const result = await api.nextTurn(saveId);
    if (result) {
      set({
        currentEvent: result.event,
        character: result.character as Character,
        learnedArts: result.learnedArts,
      });
    }
  },

  choose: async (choiceIndex) => {
    const { saveId } = get();
    if (!saveId) return;

    set({ loading: true });
    try {
      const result = await api.makeChoice(saveId, choiceIndex);
      if (result) {
        const char = result.character as Character;
        set({
          character: char,
          learnedArts: result.learnedArts,
          died: result.died,
          deathCause: result.deathCause,
          loading: false,
        });

        if (result.died) {
          set({ currentEvent: null, lastChoiceResult: null });
        } else if (get().currentEvent) {
          const event = get().currentEvent!;
          const choice = event.choices[choiceIndex];
          if (choice) {
            set({
              lastChoiceResult: { choice, outcomeText: choice.outcomeText },
              currentEvent: null,
            });
          }
        }
      }
    } catch (e) {
      set({ loading: false });
      throw e;
    }
  },

  reset: () => {
    set({
      saveId: null,
      character: null,
      currentEvent: null,
      lastChoiceResult: null,
      learnedArts: [],
      relations: [],
      died: false,
      deathCause: null,
      loading: false,
    });
  },
}));
