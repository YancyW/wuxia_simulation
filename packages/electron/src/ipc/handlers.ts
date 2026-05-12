import { ipcMain } from 'electron';
import {
  createCharacter,
  getGameState,
  advanceTurn,
  makeChoice,
  getSaveList,
  deleteSave,
} from '../engine/game-manager.js';
import type { CharacterCreateInput } from '@life-restart/shared';

export function registerIpcHandlers() {
  ipcMain.handle('game:create', (_event, input: CharacterCreateInput) => {
    return createCharacter(input);
  });

  ipcMain.handle('game:state', (_event, saveId: string) => {
    return getGameState(saveId);
  });

  ipcMain.handle('game:next', (_event, saveId: string) => {
    return advanceTurn(saveId);
  });

  ipcMain.handle('game:choose', (_event, saveId: string, choiceIndex: number) => {
    return makeChoice(saveId, choiceIndex);
  });

  ipcMain.handle('game:list', () => {
    return getSaveList();
  });

  ipcMain.handle('game:delete', (_event, saveId: string) => {
    deleteSave(saveId);
    return { success: true };
  });
}
