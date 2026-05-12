import { contextBridge, ipcRenderer } from 'electron';
import type { CharacterCreateInput } from '@life-restart/shared';

const api = {
  createGame: (input: CharacterCreateInput) => ipcRenderer.invoke('game:create', input),
  getState: (saveId: string) => ipcRenderer.invoke('game:state', saveId),
  nextTurn: (saveId: string) => ipcRenderer.invoke('game:next', saveId),
  makeChoice: (saveId: string, choiceIndex: number) => ipcRenderer.invoke('game:choose', saveId, choiceIndex),
  getSaveList: () => ipcRenderer.invoke('game:list'),
  deleteSave: (saveId: string) => ipcRenderer.invoke('game:delete', saveId),
};

contextBridge.exposeInMainWorld('api', api);

export type ElectronApi = typeof api;
