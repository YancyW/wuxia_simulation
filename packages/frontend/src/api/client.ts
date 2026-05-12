import type { CharacterCreateInput, Character } from '@life-restart/shared';
import type { TurnResult, GameState, SaveEntry } from '../global';

function getApi() {
  if (!window.api) {
    throw new Error('Electron IPC not available. Are you running in Electron?');
  }
  return window.api;
}

export async function createGame(input: CharacterCreateInput): Promise<Character> {
  return getApi().createGame(input);
}

export async function getState(saveId: string): Promise<GameState | null> {
  return getApi().getState(saveId);
}

export async function nextTurn(saveId: string): Promise<TurnResult | null> {
  return getApi().nextTurn(saveId);
}

export async function makeChoice(saveId: string, choiceIndex: number): Promise<TurnResult | null> {
  return getApi().makeChoice(saveId, choiceIndex);
}

export async function getSaveList(): Promise<SaveEntry[]> {
  return getApi().getSaveList();
}

export async function deleteSave(saveId: string): Promise<{ success: boolean }> {
  return getApi().deleteSave(saveId);
}
