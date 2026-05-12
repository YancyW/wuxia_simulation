import { ipcMain } from 'electron';
import {
  createCharacter,
  getGameState,
  advanceTurn,
  makeChoice,
  getSaveList,
  deleteSave,
  serializeCharacter,
} from '../engine/game-manager.js';
import type { CharacterCreateInput } from '@life-restart/shared';

function serializeState(state: ReturnType<typeof getGameState>) {
  if (!state) return null;
  return {
    ...state,
    character: state.character ? serializeCharacter(state.character) : null,
  };
}

function serializeTurn(result: ReturnType<typeof makeChoice>) {
  if (!result) return null;
  return {
    ...result,
    character: serializeCharacter(result.character),
  };
}

export function registerIpcHandlers() {
  ipcMain.handle('game:create', (_event, input: CharacterCreateInput) => {
    return createCharacter(input);
  });

  ipcMain.handle('game:state', (_event, saveId: string) => {
    return serializeState(getGameState(saveId));
  });

  ipcMain.handle('game:next', (_event, saveId: string) => {
    return serializeTurn(advanceTurn(saveId));
  });

  ipcMain.handle('game:choose', (_event, saveId: string, choiceIndex: number) => {
    return serializeTurn(makeChoice(saveId, choiceIndex));
  });

  ipcMain.handle('game:list', () => {
    return getSaveList();
  });

  ipcMain.handle('game:delete', (_event, saveId: string) => {
    deleteSave(saveId);
    return { success: true };
  });
}
